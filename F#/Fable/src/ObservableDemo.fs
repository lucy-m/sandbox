namespace Components

open Sutil
open Sutil.Attr
open Fable.Core

module RxJs =
  [<Import("Observable", from="rxjs")>]
  type Observable<'Model>() =
    member _.subscribe(fn: 'Model -> unit): unit = jsNative

  [<Import("Subject", from="rxjs")>]
  type Subject<'Model>() =
    inherit Observable<'Model>()
    member _.next(): unit = jsNative

  [<Import("interval", from="rxjs")>]
  let interval(interval: int): Observable<int> = jsNative

module ObservableDemo =
  let cmpt (): DOM.SutilElement =
    let myObs = new RxJs.Subject<unit>()
    let myTimer = RxJs.interval(1000)

    myObs.subscribe(fun () -> printfn "Hello from observable")
    myTimer.subscribe(fun i -> printfn $"Timer has ticked {i}")

    Html.div [
      Html.text "I work!"
      Html.button [
        onClick (fun _ -> myObs.next()) []
        Html.text "Click me!"
      ]
    ]
