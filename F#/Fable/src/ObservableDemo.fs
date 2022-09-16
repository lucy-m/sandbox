namespace Components

open Sutil
open Sutil.Attr

open JsLib

module ObservableDemo =
  let cmpt (): DOM.SutilElement =
    let valueStore: IStore<int> = Store.make 0

    let myObs = new RxJs.Subject<unit>()
    let myTimer = RxJs.interval(1000)

    myObs.subscribe(fun () -> printfn "Hello from observable")
    myTimer.subscribe(fun i -> Store.set valueStore i)

    Html.div [
      Html.text "I work!"
      Html.button [
        onClick (fun _ -> myObs.next()) []
        Html.text "Click me!"
      ]
      Html.div [
        bindFragment valueStore (fun value -> Html.text $"The val is {value}")
      ]
    ]
