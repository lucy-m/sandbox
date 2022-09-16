namespace JsLib

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
