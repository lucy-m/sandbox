open System

let chooseRandomWeighted (rnd: Random) (mapFn: 'a -> float) (items: 'a list): ('a * 'a list) Option =
  let withCumulativeWeights =
    items
    |> List.map (fun i -> i, mapFn i)
    |> List.mapFold (fun state (item, weight) ->
      (item, weight + state), (weight + state)
    ) 0.0
    |> fst

  let tTotalWeight =
    withCumulativeWeights
    |> List.tryLast
    |> Option.map snd

  tTotalWeight
  |> Option.bind (fun totalWeight ->
    let pick = rnd.NextDouble() * totalWeight

    let tItem =
      withCumulativeWeights
      |> List.tryFind (fun (item, weight) -> weight > pick)
      |> Option.map fst

    tItem
    |> Option.map (fun item ->
      let remainder =
        items
        |> List.filter (fun i -> i <> item)

      item, remainder
    )
  )

let r = Random()
let items = [0.1; 0.4; 0.8; 1.1]
let choice = chooseRandomWeighted r id items
