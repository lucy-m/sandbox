open Suave
open Suave.Filters
open Suave.Operators
open Suave.Successful

open SuaveTest
open Suave.Writers

let toOkJson (data: 'a) =
  data
  |> System.Text.Json.JsonSerializer.Serialize
  |> OK

let app =
  choose [
    GET
    >=> addHeader "Access-Control-Allow-Origin" "*"
    >=>
      choose [ 
        path "/playlists" >=> 
          request (fun r -> SpotifyClient.getAllPlaylists() |> toOkJson)

        pathScan "/playlist/%s" 
          (fun playlistId -> SpotifyClient.getAllPlaylistItems playlistId |> toOkJson)

        pathScan "/search/%s"
          (fun search -> SpotifyClient.searchForTrack search |> toOkJson)
      ]
    ]

startWebServer defaultConfig app