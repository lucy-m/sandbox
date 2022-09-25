namespace SpringAnimate

open Geometry

module SpringBone =
  type 'a Model = {
    initial: 'a Spring
    subsequent: {|spring: 'a Spring; offset: 'a|}[]
  }
  type 'a Tick = double -> 'a Model -> 'a Model

  type 'a MakeTypeResult = {
    springType: 'a Spring.MakeTypeResult
    getSprings: 'a Model -> 'a Spring[]
    isStationary: 'a Model -> bool
    makeUniformStationary: Spring.Properties -> 'a * 'a[] -> 'a Model
    tick: 'a Tick
    nudge: 'a -> 'a Model -> 'a Model
  }

  let makeSpringBoneType 
      (springType: 'a Spring.MakeTypeResult) 
    : 'a MakeTypeResult =

    let ops = springType.operations

    let getSprings (model: 'a Model): 'a Spring[] =
      let subsequentSprings =
        model.subsequent |> Array.map (fun r -> r.spring)

      Array.append [| model.initial |] subsequentSprings

    let isStationary (model: 'a Model): bool =
      model
      |> getSprings
      |> Array.map springType.isStationary 
      |> Array.fold (&&) true

    let makeUniformStationary 
        (properties: Spring.Properties)
        (initial: 'a, points: 'a[])
      : 'a Model =
      let initialSpring: 'a Spring = {
        position = initial
        velocity = ops.zero
        endPoint = initial
        properties = properties
      }
      let subsequent =
        Array.append [|initial|] points
        |> Array.pairwise
        |> Array.map (fun (prev, point) ->
          let offset = ops.sub point prev
          let spring: 'a Spring = {
            position = point
            velocity = ops.zero
            endPoint = point
            properties = properties
          }
          {| offset = offset; spring = spring |}
        )

      { initial = initialSpring; subsequent = subsequent }

    let tick (dt: double) (s: 'a Model): 'a Model =
      if isStationary s
      then s
      else
        let allSprings = getSprings s
        let prevSprings = allSprings |> Array.take (Array.length allSprings - 1)
        let withAdjustedEndpoints =
          Array.zip prevSprings s.subsequent
          |> Array.map (fun (prev, subsequent) ->
            let offset = subsequent.offset
            let spring = subsequent.spring
            let endPoint = ops.add prev.position offset

            {| offset = offset; spring = { spring with endPoint = endPoint }|}
          )

        let initial = springType.tick dt s.initial
        let subsequent =
          withAdjustedEndpoints
          |> Array.map (fun subsequent ->
            let offset = subsequent.offset
            let spring = springType.tick dt subsequent.spring

            {| offset = offset; spring = spring|}
          )

        { initial = initial; subsequent = subsequent}

    let nudge (offset: 'a) (bone: 'a Model): 'a Model =
      let initialEndpoint =
        ops.add bone.initial.endPoint offset

      {
        bone with
          initial = {
            bone.initial with
              endPoint = initialEndpoint
          }
      }

    {
      springType = springType
      getSprings = getSprings
      isStationary = isStationary
      makeUniformStationary = makeUniformStationary
      tick = tick
      nudge = nudge
    }

  let dim1 = makeSpringBoneType Spring.dim1
  let dim2 = makeSpringBoneType Spring.dim2

type 'a SpringBone = 'a SpringBone.Model
type SpringBone1d = double SpringBone.Model
type SpringBone2d = Point SpringBone.Model
