namespace Geometry

module Point =
  type Model = {
    x: double
    y: double
  }

  let zero: Model = { x = 0.0; y = 0.0 }

  let x (p: Model): double = p.x
  let y (p: Model): double = p.y
  let make (x: double) (y: double): Model = { x = x; y = y; }

  let add (a: Model) (b: Model): Model =
    {
      x = a.x + b.x
      y = a.y + b.y
    }

  let scale (s: double) (p: Model): Model =
    {
      x = p.x * s
      y = p.y * s
    }

  let scaleX (s: double) (p: Model): Model =
    {
      x = p.x * s
      y = p.y
    }

  let scaleY (s: double) (p: Model): Model =
    {
      x = p.x
      y = p.y * s
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

  let bounding (ps: Model[]): Model * Model =
    let minX = ps |> Array.minBy x |> x
    let minY = ps |> Array.minBy y |> y
    let maxX = ps |> Array.maxBy x |> x
    let maxY = ps |> Array.maxBy y |> y

    { x = minX; y = minY }, { x = maxX; y = maxY }

type Point = Point.Model
