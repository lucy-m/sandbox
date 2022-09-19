namespace SpringAnimate

open Geometry

module Spring =
  type Properties = {
    stiffness: double
    friction: double
    weight: double
    resolution: double
  }

  type 'a Model = {
    position: 'a
    velocity: 'a
    endPoint: 'a
    properties: Properties
  }

  type 'a Operations = {
    zero: 'a
    dist: 'a -> 'a -> double
    add: 'a -> 'a -> 'a
    sub: 'a -> 'a -> 'a
    scale: double -> 'a -> 'a
    abs: 'a -> double
  }

  type 'a Tick = double -> 'a Model -> 'a Model

  type 'a MakeSpringTypeResult = {
    isStationary: 'a Model -> bool
    snap: 'a Model -> 'a Model
    tick: 'a Tick
  }

  let makeSpringType (ops: 'a Operations): 'a MakeSpringTypeResult =
    let isStationary (s: 'a Model): bool =
      s.position = s.endPoint
      && s.velocity = ops.zero

    let snap (s: 'a Model): 'a Model =
      if isStationary s
      then s
      else
        let dp = ops.dist s.position s.endPoint
        let position, velocity =
          if dp < s.properties.resolution && ops.abs s.velocity < s.properties.resolution
          then s.endPoint, ops.zero
          else s.position, s.velocity

        {
          s with
            position = position
            velocity = velocity
        }

    let tick (dt: double) (s: 'a Model): 'a Model =
      if isStationary s
      then s
      else
        let dp = ops.sub s.position s.endPoint
        let acceleration =
          let spring = ops.scale s.properties.stiffness dp
          let friction = ops.scale s.properties.friction s.velocity
          let overall = ops.add spring friction
          ops.scale (-dt / (s.properties.weight)) overall

        {
          s with
            position = ops.add s.position s.velocity
            velocity = ops.add s.velocity acceleration
        }
        |> snap

    {
      isStationary = isStationary
      snap = snap
      tick = tick
    }

  let dim1 =
    makeSpringType {
      zero = 0.0
      dist = fun a b -> abs(a - b)
      add = (+)
      sub = (-)
      scale = (*)
      abs = abs
    }

  let dim2 = 
    makeSpringType {
      zero = Point.zero
      dist = Point.dist
      add = Point.add
      sub = Point.sub
      scale = Point.scale
      abs = Point.abs
    }

type 'a Spring = 'a Spring.Model
type Spring1d = double Spring.Model
type Spring2d = Point Spring.Model
