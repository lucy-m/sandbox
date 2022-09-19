namespace Demos

open Sutil
open Feliz

module MultiplyCanvas =
  let css = [
    Styling.rule "rect" [
      Css.custom ("mix-blend-mode", "multiply")      
    ]
  ]

  let mkRect (x: int) (y: int) (color: string) =
    Svg.rect [
      Attr.x x
      Attr.y y
      Attr.width 200
      Attr.height 200
      Attr.style [ Css.fill color ]
    ]

  let cmpt () =
    Html.div [
      Svg.svg [
        Attr.width (length.px 600)
        Attr.height (length.px 400)
        Attr.style [
          Css.border (length.px 2, borderStyle.solid, color.black)
        ]

        mkRect  50  50 color.pink
        mkRect  75  75 color.dodgerBlue
        mkRect 100 100 color.hotPink
        mkRect 125 125 color.lightSeaGreen
        mkRect 150 150 color.lightCoral
        mkRect 175 175 color.paleGoldenRod
      ]
    ]
    |> Styling.withStyle css
