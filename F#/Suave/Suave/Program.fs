open Suave
open Suave.Filters
open Suave.Operators
open Suave.Successful
open Suave.WebSocket
open Suave.Sockets
open Suave.Sockets.Control

open SuaveTest
open Suave.Writers
open System.Text.Json
open Suave.RequestErrors

let testPlaylistId = "2BhCiuCLN7c8kZbXnm9uD0"
let trackedPlaylist = new TrackedPlaylist(testPlaylistId)

let toOkJson (data: 'a) =
  data
  |> JsonSerializer.Serialize
  |> OK

let ws (webSocket : WebSocket) (context: HttpContext) =
  socket {
    let mutable loop = true

    use playlistItems = 
      trackedPlaylist
        .playlistItemsStream()
        .Subscribe(
          fun items ->
            let byteResponse =
              items
              |> WebSocketMessages.playlistItems
              |> JsonSerializer.Serialize
              |> System.Text.Encoding.UTF8.GetBytes
              |> ByteSegment

            do webSocket.send Text byteResponse true
                |> Async.RunSynchronously
        )
    
    while loop do
        let! msg = webSocket.read()
    
        match msg with
        | (Close, _, _) ->
          loop <- false
        | _ -> ()
  }

let mapResult (r: Result<unit, string>): WebPart =
  match r with
  | Ok _ -> OK ""
  | Error message -> BAD_REQUEST message

let app =
  choose [
    path "/websocket" >=> handShake ws

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
      pathScan "/user/%s/track/%s"
        (fun (userName, uri) ->
          trackedPlaylist.addToPlaylist userName uri
          |> mapResult
        )
      
      pathScan "/user/%s/remove-track/%s"
        (fun (userName, uri) ->
          printfn $"Delete request from {userName} of {uri}"
          trackedPlaylist.removeFromPlaylist userName uri
          |> mapResult
        )
    ]

    DELETE
    >=> addHeader "Access-Control-Allow-Origin" "*"
    >=> choose [
      pathScan "/user/%s/remove-track/%s"
        (fun (userName, uri) ->
          printfn $"Delete request from {userName} of {uri}"
          trackedPlaylist.removeFromPlaylist userName uri
          |> mapResult
        )
    ]
  ]

startWebServer defaultConfig app