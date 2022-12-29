open Suave
open Suave.Filters
open Suave.Operators
open Suave.Successful

open SuaveTest

let toOkJson (data: 'a) =
  data
  |> Suave.Json.toJson
  |> System.Text.Encoding.UTF8.GetString
  |> OK

let app =
  choose
    [ GET >=> choose
        [ path "/playlists" >=> 
            request (fun r -> SpotifyClient.getAllPlaylists() |> toOkJson)

          pathScan "/playlist/%s" 
            (fun playlistId -> SpotifyClient.getAllPlaylistItems playlistId |> toOkJson)

          pathScan "/search/%s"
            (fun search -> SpotifyClient.searchForTrack search |> toOkJson)
        ]
      POST >=> choose
        [ path "/hello" >=> OK "Hello POST"
          path "/goodbye" >=> OK "Good bye POST" ] ]

startWebServer defaultConfig app