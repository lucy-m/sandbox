namespace SuaveTest

open FsHttp
open System.Text.Json

module SpotifyClient =    
  type RefreshTokenResult = {
      access_token: string
  }
  
  type SpotifyResult<'a> = {
    href: string
    items: 'a []
    next: string Option
  }

  type Image = {
    url: string
    height: int Option
    width: int Option
  }

  type Album = {
    name: string
    images: Image []
  }

  type Artist = {
    name: string
  }
  
  type Track = {
    id: string
    uri: string
    name: string
    artists: Artist []
    album: Album
    is_playable: bool
  }
  
  type GetPlaylistItemsResult = {
    track: Track
  }
  
  type Playlist = {
    id: string
    name: string
    images: Image []
  }

  type SearchResult = {
    tracks: Track SpotifyResult
  }
  
  let refreshToken = "AQDq-JsE9ItSXrNTjo-LNMBFiHmTgGSKv_hsfZeWHgUnoQDD_ecx2aEPRDYGu33xOjuW2zD5gClmm80IvY2nF325t7hIdxs6S-Uy66RqWTA1Q6xWgPUnqopXoLk0MobN3eo"
  let encodedClientDetails = "YjhmMTUxZjUwMWEzNGI4YTg4ZTc2NWZlMDNmY2Y2ZmQ6MDI1OTQ1MDBmOWVkNDA3N2IxZjE0NTAxMGI1YmY1YWM="
  let baseUrl = "https://api.spotify.com/v1/"
  let testPlaylistId = "2BhCiuCLN7c8kZbXnm9uD0"

  let authHeader = 
    let accessToken =
      http {
        POST "https://accounts.spotify.com/api/token"
        Authorization $"Basic {encodedClientDetails}"
        body
        formUrlEncoded [
          "grant_type", "refresh_token"
          "refresh_token", refreshToken
        ]
      }
      |> Request.send
      |> Response.deserializeJson<RefreshTokenResult>
      |> fun r -> r.access_token
      
    printfn $"Got access token {accessToken}"

    $"Bearer {accessToken}"

  let cacheResult (fn: unit -> 'a): unit -> 'a =
    let mutable cached: 'a Option = None

    let cachedFn () =
      match cached with
      | Some r -> r
      | None ->
        let r = fn()
        cached <- Some r
        r

    cachedFn


  let spotifyGet<'a> (url: string): 'a =
    http {
      GET url
      Authorization authHeader
    }
    |> Request.send
    |> Response.toResult
    |> Result.injectError (fun err ->
      printfn $"Error getting spotify data {err}"
    )
    |> Result.map Response.deserializeJson<'a>
    |> Result.defaultWith(fun () -> failwith "Failed to get")
  
  let getPaginated<'a> (url: string): 'a [] =
    let initialUrl = url + "?limit=10&offset=0"
  
    let rec getPaginatedInner (url: string) (results: 'a []): 'a [] =
      spotifyGet<SpotifyResult<'a>> url
        |> (fun r ->
            let newResults = Array.concat [|results; r.items|]
            match r.next with
            | Some next -> getPaginatedInner next newResults
            | None -> newResults
          )
      
    getPaginatedInner initialUrl [||]

  let getAllPlaylistItems (playlistId: string): Track [] =
    getPaginated<GetPlaylistItemsResult> $"{baseUrl}playlists/{playlistId}/tracks"
    |> Array.map (fun p -> p.track)
  
  let getAllPlaylists: unit -> Playlist [] =
    fun () -> getPaginated<Playlist> $"{baseUrl}me/playlists"
    |> cacheResult

  let searchForTrack (name: string): Track [] =
    let q = System.Web.HttpUtility.UrlEncode(name)
    let url = $"{baseUrl}search?q={q}&type=track&market=GB"

    spotifyGet<SearchResult> url
    |> fun sr -> sr.tracks.items

  let clearTestPlaylist () =
    printfn $"Clearing test playlist {testPlaylistId}"

    let tracks = getAllPlaylistItems testPlaylistId
    let uris = tracks |> Array.map (fun t -> {|uri = t.uri|})
    let jsonBody = {| tracks = uris |} |> JsonSerializer.Serialize

    http {
      DELETE $"{baseUrl}playlists/{testPlaylistId}/tracks"
      Authorization authHeader
      
      body
      json jsonBody
    }
    |> Request.send
    |> Response.toResult
    |> Result.injectError (fun err ->
      printfn $"Error getting spotify data {err}"
    )
    |> ignore
