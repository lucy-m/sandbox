namespace Geometry

module Point =
  type Model = {
    x: double
    y: double
  }

  let zero: Model = { x = 0.0; y = 0.0 }

  let add (a: Model) (b: Model): Model =
    {
      x = a.x + b.x
      y = a.y + b.y
    }

  let scale (s: double) (a: Model): Model =
    {
      x = a.x * s
      y = a.y * s
    }

  let sub (a: Model) (b: Model): Model =
    {
      x = a.x - b.x
      y = a.y - b.y
    }

  let dist (a: Model) (b: Model): double =
    let x = (a.x - b.x) ** 2.0
    let y = (a.y - b.y) ** 2.0

    (x + y) ** 0.5

  let abs (a: Model): double = dist a zero

type Point = Point.Model