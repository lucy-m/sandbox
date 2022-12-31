open Suave
open Suave.Filters
open Suave.Operators
open Suave.Successful

open SuaveTest
open Suave.Writers

let testPlaylistId = "2BhCiuCLN7c8kZbXnm9uD0"
let trackedPlaylist = new TrackedPlaylist(testPlaylistId)

let toOkJson (data: 'a) =
  data
  |> System.Text.Json.JsonSerializer.Serialize
  |> OK

let app =
  choose [
    GET
    >=> addHeader "Access-Control-Allow-Origin" "*"
    >=> choose [ 
      path "/playlists" >=> 
        request (fun r -> SpotifyClient.getAllPlaylists() |> toOkJson)

      pathScan "/playlist/%s" 
        (fun playlistId -> SpotifyClient.getAllPlaylistItems playlistId |> toOkJson)

      pathScan "/search/%s"
        (fun search -> SpotifyClient.searchForTrack search |> toOkJson)

      path "/tracks" >=>
        request (fun r -> trackedPlaylist.getPlaylistItems() |> toOkJson)
    ]

    POST
    >=> addHeader "Access-Control-Allow-Origin" "*"
    >=> choose [
      pathScan "/user/%s/add-track/%s"
        (fun (userName, uri) ->
          trackedPlaylist.addToPlaylist userName uri
          OK ""
        )
    ]
  ]

startWebServer defaultConfig app