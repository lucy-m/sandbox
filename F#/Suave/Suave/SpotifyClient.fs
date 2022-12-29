namespace SuaveTest

open FsHttp

module SpotifyClient =    
  type RefreshTokenResult = {
      access_token: string
  }
  
  type SpotifyResult<'a> = {
    href: string
    items: 'a list
    next: string Option
  }

  type AlbumImage = {
    url: string
    height: int
    width: int
  }

  type Album = {
    name: string
    images: AlbumImage List
  }

  type Artist = {
    name: string
  }
  
  type Track = {
    id: string
    name: string
    artists: Artist List
    album: Album
    is_playable: bool
  }
  
  type GetPlaylistItemsResult = {
    track: Track
  }
  
  type Playlist = {
    id: string
    name: string
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
  
  let getPaginated<'a> (url: string): 'a list =
    let initialUrl = url + "?limit=20&offset=0"
  
    let rec getPaginatedInner (url: string) (results: 'a list): 'a list =
      spotifyGet<SpotifyResult<'a>> url
        |> (fun r ->
            let newResults = List.concat [results; r.items]
            match r.next with
            | Some next -> getPaginatedInner next newResults
            | None -> newResults
          )
      
    getPaginatedInner initialUrl []

  let getAllPlaylistItems (playlistId: string): Track List =
    getPaginated<GetPlaylistItemsResult> $"{baseUrl}playlists/{playlistId}/tracks"
    |> List.map (fun p -> p.track)
  
  let getAllPlaylists (): Playlist List =
    getPaginated<Playlist> $"{baseUrl}me/playlists"

  let searchForTrack (name: string): Track List =
    let q = System.Web.HttpUtility.UrlEncode(name)
    let url = $"{baseUrl}search?q={q}&type=track&market=GB"

    spotifyGet<SearchResult> url
    |> fun sr -> sr.tracks.items
