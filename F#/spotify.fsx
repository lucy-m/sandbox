#r "nuget: FsHttp,6"

open FsHttp.DslCE
open FsHttp
open System.Text.Json

type RefreshTokenResult = {
    access_token: string
}

type SpotifyResult<'a> = {
  href: string
  items: 'a list
  next: string Option
}

type GetPlaylistsResult = {
  id: string
  name: string
}

type SpotifyTrack = {
  id: string
  name: string
}

type GetPlaylistItemsResult = {
  track: SpotifyTrack
}

type FeatureResult = {
  id: string
  acousticness: float
  danceability: float
  energy: float
  instrumentalness: float
  liveness: float
  loudness: float
  mode: int
  speechiness: float
  tempo: float
  time_signature: float
  valence: float
}

type GetFeaturesResult = {
  audio_features: FeatureResult List
}

let refreshToken = "AQCIW4zMKT6zbPj8XhzNiyvXhWCJzA0ETuhSH-P-45VEhkyX2r-sZ5nwCLQrxDzcjuUForl5Gi1O99LaD5HfgNcOyN-UeoIFOzTp5TZFc_PfKbshVTV1iSOllPkrjva7MlI"
let encodedClientDetails = "YjhmMTUxZjUwMWEzNGI4YTg4ZTc2NWZlMDNmY2Y2ZmQ6MDI1OTQ1MDBmOWVkNDA3N2IxZjE0NTAxMGI1YmY1YWM="

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
  |> Response.toString 10000
  |> JsonSerializer.Deserialize<RefreshTokenResult>
  |> fun r -> r.access_token

let authHeader = $"Bearer {accessToken}"

let baseUrl = "https://api.spotify.com/v1/"

let getPaginated<'a> (url: string): 'a list =
  let initialUrl = url + "?limit=10&offset=0"

  let rec getPaginatedInner (url: string) (results: 'a list): 'a list =
    http {
      GET url
      Authorization authHeader
    }
    |> Response.toString 50000
    |> JsonSerializer.Deserialize<SpotifyResult<'a>>
    |> (fun r ->
      let newResults = List.concat [results; r.items]
      match r.next with
      | Some next -> getPaginatedInner next newResults
      | None -> newResults
    )

  getPaginatedInner initialUrl []

let getAllPlaylistItems (playlistId: string) =
  getPaginated<GetPlaylistItemsResult> $"{baseUrl}playlists/{playlistId}/tracks"

let allPlaylists = getPaginated<GetPlaylistsResult> (baseUrl + "me/playlists")

let getAudioFeatures (ids: string List) =
  let idsString = ids |> List.reduce (fun a b -> a + "," + b)
  http {
    GET (baseUrl + "audio-features")
    Authorization authHeader
    query [ "ids", idsString]
  }
    |> Response.toString 50000
    |> JsonSerializer.Deserialize<GetFeaturesResult>

let tSpinThings =
  allPlaylists
  |> List.tryFind (fun s -> s.name = "Spin things?")
  |> Option.map (fun r -> getAllPlaylistItems r.id)

let tSpinFaves =
  allPlaylists
  |> List.tryFind (fun s -> s.name = "spin faves")
  |> Option.map (fun r -> getAllPlaylistItems r.id)

let overlappingSongs =
  match tSpinThings, tSpinFaves with
  | Some spinThings, Some spinFaves ->
      spinThings
      |> List.filter (
          fun s ->
            spinFaves
            |> List.tryFind (fun t -> s.track.id = t.track.id)
            |> Option.isSome
          )
  | _ -> []

let tTestPlaylist =
  allPlaylists
  |> List.tryFind (fun s -> s.name = "Test Playlist")
  |> Option.map (fun p -> getAllPlaylistItems p.id)
  |> Option.map (fun tracks ->
    let trackNameMap =
      tracks
      |> List.map (fun t -> t.track.id, t.track.name)
      |> Map.ofList

    let audioFeatures =
      tracks
      |> List.map (fun t ->
        t.track.id
      )
      |> getAudioFeatures
      |> fun af -> af.audio_features

    audioFeatures
    |> List.map (fun f ->
      let key =
        trackNameMap
        |> Map.tryFind f.id
        |> Option.defaultValue ""

      key, f
    )
  )
  |> Option.defaultValue []

let byEnergy =
  tTestPlaylist
  |> List.sortBy (fun (name, features) -> features.energy)
