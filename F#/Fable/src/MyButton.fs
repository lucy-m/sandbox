namespace Components

open Sutil
open Sutil.DOM
open Sutil.Attr

module MyButton =

  let cmpt (text: string) =
    let intStore: IStore<int> = Store.make 1

    Html.div [
      disposeOnUnmount [ intStore ]

      bindFragment intStore (fun model -> Html.text $"The value is {model}")

      Html.button [
        onClick (fun _ -> Store.set intStore (intStore.Value + 1)) []
        Html.text $"{text}"
      ]
    ]
