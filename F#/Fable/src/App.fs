module App

open Browser.Dom
open Sutil
open Demos

let app() =
  Html.div [
    // MyButton.cmpt "Hello" 
    //ObservableDemo.cmpt ()
    //SliderWithCircle.cmpt ()
    SpringCanvas.cmpt ()
    //MultiplyCanvas.cmpt ()
    SpringBoneCanvas.cmpt ()
  ]

app() |> Program.mountElement "sutil-app"
