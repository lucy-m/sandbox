module App

open Browser.Dom
open Sutil
open Components

let app() =
  Html.div [
    // MyButton.cmpt "Hello" 
    ObservableDemo.cmpt ()
    SliderWithCircle.cmpt ()
  ]

app() |> Program.mountElement "sutil-app"
