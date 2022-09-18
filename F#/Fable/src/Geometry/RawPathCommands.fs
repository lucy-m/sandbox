namespace Geometry

open System.Text.RegularExpressions

module RawPathCommand =
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands
  type Single =
  | M of double[]
  | MRel of double[]
  | L of double[]
  | LRel of double[]
  | C of double[]
  | CRel of double[]
  | Z

  let commandRegex = new Regex("[MmLlCcZz][\s,\d\.e\-]*")

  let splitToCommandsRaw (input: string): string[] =
    [| for v in commandRegex.Matches(input) do v |]
    |> Array.map (fun m -> m.Value)

  let rawToModel (input: string): Single Option =
    match input.ToCharArray() |> Array.toList with
    | head::tail ->
      if head = 'z' || head = 'Z'
      then Option.Some Z
      else
        let values =
          tail
          |> List.toArray
          |> fun chars -> new System.String(chars)
          |> fun s -> s.Split([|','; ' '|], System.StringSplitOptions.RemoveEmptyEntries)
          |> Array.map double

        match head with
        | 'M' -> M values |> Some
        | 'm' -> MRel values |> Some
        | 'L' -> L values |> Some
        | 'l' -> LRel values |> Some
        | 'C' -> C values |> Some
        | 'c' -> CRel values |> Some
        | _ -> Option.None
    | _ -> Option.None

  let getValueString (model: Single): string Option =
    match model with
    | M values
    | MRel values
    | L values 
    | LRel values
    | C values
    | CRel values ->
      values
      |> Array.chunkBySize 2
      |> Array.map (
        Array.map string
        >> Array.reduce (fun a b -> a + "," + b)
      )
      |> Array.reduce (fun a b -> a + " " + b)
      |> Some
    | Z -> None

  let getCommandString (model: Single): string =
    match model with
    | M _ -> "M"
    | MRel _ -> "m"
    | L _ -> "L"
    | LRel _ -> "l"
    | C _ -> "C"
    | CRel _ -> "c"
    | Z -> "z"

  let commandToString (model: Single): string =
    let command = getCommandString model
    let value = 
      getValueString model 
      |> Option.map (fun s -> " " + s)
      |> Option.defaultValue ""

    command + value

  let parseString (s: string): Single[] =
    s
    |> splitToCommandsRaw
    |> Array.choose rawToModel

  let stringify (model: Single[]): string =
    model
    |> Array.map commandToString
    |> Array.reduce (fun a b -> a + " " + b)

type RawPathCommand = RawPathCommand.Single
