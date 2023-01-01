namespace SuaveTest

module WebSocketMessages =
  type 'a Model = {
    tag: string
    data: 'a
  }

  let playlistItems
      (data: TrackedPlaylist.TrackedTrack[])
    : TrackedPlaylist.TrackedTrack[] Model =
    {
      tag = "playlistItems"
      data = data
    }
