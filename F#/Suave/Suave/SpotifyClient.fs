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
  
  type SpotifyTrack = {
    id: string
    name: string
  }
  
  type GetPlaylistItemsResult = {
    track: SpotifyTrack
  }
  
  type GetPlaylistsResult = {
    id: string
    name: string
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
  
  let getPaginated<'a> (url: string): 'a list =
    let initialUrl = url + "?limit=20&offset=0"
  
    let rec getPaginatedInner (url: string) (results: 'a list): 'a list =
      http {
        GET url
        Authorization authHeader
        Accept "application/json"
      }
      |> Request.send
      |> Response.toResult
      |> Result.injectError (fun err ->
        printfn $"Error getting paginated spotify data {err}"
      )
      |> Result.map (fun v ->
        v
        |> Response.deserializeJson<SpotifyResult<'a>>
        |> (fun r ->
          let newResults = List.concat [results; r.items]
          match r.next with
          | Some next -> getPaginatedInner next newResults
          | None -> newResults
          )
        )
      |> Result.defaultValue []
      
    getPaginatedInner initialUrl []

  let getAllPlaylistItems (playlistId: string) =
    getPaginated<GetPlaylistItemsResult> $"{baseUrl}playlists/{playlistId}/tracks"
  
  let getAllPlaylists () = getPaginated<GetPlaylistsResult> (baseUrl + "me/playlists")