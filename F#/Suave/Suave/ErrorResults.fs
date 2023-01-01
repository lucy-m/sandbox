namespace SuaveTest

module ErrorResults =
  let spotifyError = Result.Error "spotifyError"
  let wrongUser = Result.Error "wrongUser"
  let alreadyAdded = Result.Error "alreadyAdded"