namespace SuaveTest

open FsHttp

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
  
  let refreshToken = "AQCIW4zMKT6zbPj8XhzNiyvXhWCJzA0ETuhSH-P-45VEhkyX2r-sZ5nwCLQrxDzcjuUForl5Gi1O99LaD5HfgNcOyN-UeoIFOzTp5TZFc_PfKbshVTV1iSOllPkrjva7MlI"
  let encodedClientDetails = "YjhmMTUxZjUwMWEzNGI4YTg4ZTc2NWZlMDNmY2Y2ZmQ6MDI1OTQ1MDBmOWVkNDA3N2IxZjE0NTAxMGI1YmY1YWM="
  let baseUrl = "https://api.spotify.com/v1/"

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

  let spotifyGet<'a> (url: string): 'a =
    http {
      GET url
      Authorization authHeader
      Accept "application/json"
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

  let mutable cachedPlaylists: Playlist [] Option = None
  
  let getAllPlaylists (): Playlist [] =
    match cachedPlaylists with
    | Some r -> r
    | None ->
      let r = getPaginated<Playlist> $"{baseUrl}me/playlists"
      cachedPlaylists <- Some r
      r

  let searchForTrack (name: string): Track [] =
    let q = System.Web.HttpUtility.UrlEncode(name)
    let url = $"{baseUrl}search?q={q}&type=track&market=GB"

    spotifyGet<SearchResult> url
    |> fun sr -> sr.tracks.items
