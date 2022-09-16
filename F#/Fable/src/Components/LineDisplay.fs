namespace Components

open Sutil
open Feliz
open Geometry

module LineDisplay =
  type EndPoint =
    | Abs of Point
    | Rel of Point

  let cmpt (startPoint: Point) (endPoint: EndPoint) =
    let absEndPoint =
      match endPoint with
      | Abs ep -> ep
      | Rel ep -> Point.add startPoint ep

    Svg.line [
      Attr.stroke color.black
      Svg.x1 startPoint.x
      Svg.y1 startPoint.y
      Svg.x2 absEndPoint.x
      Svg.y2 absEndPoint.y
    ]