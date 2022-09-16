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

  let tick (dt: double) (s: Model): Model =
    let dp = Point.sub s.position s.endPoint
    let acceleration =
      let spring = Point.scale dp s.properties.stiffness
      let friction = Point.scale s.velocity s.properties.friction
      let overall = Point.add spring friction
      Point.scale overall (-1.0 / (dt * s.properties.weight))

    {
      s with
        position = Point.add s.position s.velocity
        velocity = Point.add s.velocity acceleration
    }