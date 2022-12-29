﻿open Suave
open Suave.Filters
open Suave.Operators
open Suave.Successful

open SuaveTest

let app =
  choose
    [ GET >=> choose
        [ path "/playlists" >=> request (fun r -> OK (SpotifyClient.getAllPlaylists().ToString()))
          pathScan "/playlist/%s" (fun playlistId -> OK (SpotifyClient.getAllPlaylistItems(playlistId).ToString()))
          pathScan "/search/%s" (fun search -> OK (SpotifyClient.searchForTrack(search).ToString()))
        ]
      POST >=> choose
        [ path "/hello" >=> OK "Hello POST"
          path "/goodbye" >=> OK "Good bye POST" ] ]

startWebServer defaultConfig app