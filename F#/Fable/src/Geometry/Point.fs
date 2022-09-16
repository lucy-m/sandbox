namespace Geometry

module Point =
  type Model = {
    x: double
    y: double
  }

  let add (a: Model) (b: Model): Model =
    {
      x = a.x + b.x
      y = a.y + b.y
    }

  let scale (a: Model) (s: double): Model =
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

type Point = Point.Model