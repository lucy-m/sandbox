namespace SuaveTest

open System.Reactive.Subjects
open System
open System.Reactive.Linq

module TrackedPlaylist =
  type TrackingInfo = {
    addedBy: string
  }
  
  type TrackedTrack = {
    track: SpotifyClient.Track
    info: TrackingInfo Option
  }

  type Model(id: string) =
    let id = id
    let mutable trackMap = new Map<string, TrackingInfo>([])
    let updateSubject = new BehaviorSubject<unit>()

    do SpotifyClient.clearPlaylist id
  
    member this.getPlaylistItems(): TrackedTrack[] =
      let spotifyTracks = SpotifyClient.getAllPlaylistItems id
      let matched =
        spotifyTracks
        |> Array.map (fun track ->
          let info = trackMap |> Map.tryFind track.uri

          { track = track; info = info}
        )

      matched

    member this.playlistItemsStream(): IObservable<TrackedTrack[]> =
      updateSubject :> IObservable<unit>
      |> Observable.map this.getPlaylistItems

    member this.addToPlaylist (addedBy: string) (uri: string): unit =
      let addResult = SpotifyClient.addToPlaylist id uri
      match addResult with
      | Ok _ ->
        let trackingInfo: TrackingInfo = {
          addedBy = addedBy
        }
        trackMap <- trackMap |> Map.add uri trackingInfo
        updateSubject.OnNext()
      | _ -> ()

type TrackedPlaylist = TrackedPlaylist.Model