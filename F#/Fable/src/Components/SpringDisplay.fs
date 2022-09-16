namespace Components

open Sutil
open Feliz
open SpringAnimate
open Geometry

module SpringDisplay =
  let cmpt (spring: Spring) =
    Svg.g [
      Svg.circle [
        Attr.style [
          Css.fill color.mediumSlateBlue
        ]
        Svg.r 6.0
        Svg.cx spring.position.x
        Svg.cy spring.position.y
      ]
      LineDisplay.cmpt
        spring.position
        (LineDisplay.EndPoint.Rel <| Point.scale 3.0 spring.velocity)
    ]
