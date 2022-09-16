namespace SpringAnimate

open Geometry

module Spring =
  type Properties = {
    stiffness: double
    friction: double
    weight: double
  }

  type Model = {
    position: Point
    velocity: Point
    endPoint: Point
    properties: Properties
  }

  let isStationary (s: Model): bool =
    s.position = s.endPoint
    && s.velocity = Point.zero

  let snap (s: Model): Model =
    if isStationary s
    then s
    else
      let dp = Point.dist s.position s.endPoint
      let position, velocity =
        if dp < 0.3 && Point.abs s.velocity < 0.3
        then s.endPoint, Point.zero
        else s.position, s.velocity

      {
        s with
          position = position
          velocity = velocity
      }

  let tick (dt: double) (s: Model): Model =
    if isStationary s
    then s
    else
      let dp = Point.sub s.position s.endPoint
      let acceleration =
        let spring = Point.scale s.properties.stiffness dp
        let friction = Point.scale s.properties.friction s.velocity
        let overall = Point.add spring friction
        Point.scale (-dt / (s.properties.weight)) overall

      {
        s with
          position = Point.add s.position s.velocity
          velocity = Point.add s.velocity acceleration
      }
      |> snap

type Spring = Spring.Model