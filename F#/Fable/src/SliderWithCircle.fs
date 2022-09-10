namespace Components

open Sutil
open Sutil.DOM
open Sutil.Attr
open Feliz

module SliderWithCircle =
  let cmpt () =
    let sizeStore: IStore<double> = Store.make 6.0

    Html.div [
      disposeOnUnmount [ sizeStore ]
      Html.div [
        style [
          Css.displayFlex
          Css.flexDirectionColumn
          Css.rowGap (length.rem 0.5)
          Css.gridTemplateRows [length.auto; length.fr 1]
          Css.width 600
          Css.height (length.percent 100)
        ]
        Html.input [
          Attr.typeRange
          Attr.min 0.1
          Attr.max 20
          Attr.step 0.5

          bindFragment sizeStore Attr.value

          onInput (fun e -> Store.set sizeStore (e.inputElement.valueAsNumber)) []
        ]
        Svg.svg [
          style [
            Css.width (length.px 600)
            Css.height (length.px 400)
            Css.border (length.px 2, borderStyle.solid, color.black)
          ]
          Svg.circle [
            style [
              Css.fill (color.mediumSlateBlue)
            ]
            Svg.cx 100
            Svg.cy 60

            bindFragment sizeStore Svg.r
          ]
        ]
      ]
    ]