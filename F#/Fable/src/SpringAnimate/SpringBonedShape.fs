namespace SpringAnimate

open Geometry

module SpringBonedShape =
  type RiggedCommand = {
    command: PathPointShape.Command
    attachedToIndex: int
  }

  type Model = {
    commands: RiggedCommand[]
    bone: SpringBone2d
  }

  let getShape (model: Model): PathPointShape =
    model.commands
    |> Array.map (fun c -> c.command)

  let rig 
      (attachStrategy: PathPointShape.Command -> (int * Spring2d)[] -> int)
      (bone: SpringBone2d) 
      (shape: PathPointShape)
    : Model =

    let indexedSprings =
      SpringBone.dim2.getSprings bone
      |> Array.indexed

    let commands =
      shape
      |> Array.map (fun command ->
        let attachedToIndex = attachStrategy command indexedSprings

        {
          command = command
          attachedToIndex = attachedToIndex
        }
      )

    {
      commands = commands
      bone = bone
    }
    
  let tick (dt: double) (s: Model): Model =
    if SpringBone.dim2.isStationary s.bone
    then s
    else
      let tickedBone = SpringBone.dim2.tick dt s.bone

      let indexOffsetMap =
        SpringBone.dim2.getSprings s.bone
        |> Array.zip (SpringBone.dim2.getSprings tickedBone)
        |> Array.map (fun (original, ticked) ->
          Point.sub original.position ticked.position
        )
        |> Array.indexed
        |> Map.ofArray

      let tickedCommands =
        s.commands
        |> Array.map (fun rigged ->
          let tOffset = indexOffsetMap |> Map.tryFind rigged.attachedToIndex

          match tOffset with
          | Option.None -> rigged
          | Option.Some offset ->
            let translated = PathPointShape.translateCommand offset rigged.command
            {
              command = translated
              attachedToIndex = rigged.attachedToIndex
            }
        )

      {
        commands = tickedCommands
        bone = tickedBone
      }
