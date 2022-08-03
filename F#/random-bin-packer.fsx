open System

type EurovisionCountry = {
  label: string
  chanceToWin: float
}

let rnd = Random()

let mean (items: float list): float =
  items |> List.sum |> fun total -> total / float (items.Length)

let stdDev (items: float list): float =
  let m = mean items

  items
  |> List.map (fun x -> (x - m) ** 2.0)
  |> List.sum
  |> fun t -> t / float (items.Length)
  |> fun t -> t ** 0.5

let chooseRandom (rnd: Random) (items: 'a list): ('a * 'a list) Option =
  let index = rnd.Next(items.Length)
  let indexed = items |> List.indexed
  
  let tItem =
    indexed
    |> List.tryFind (fun (i, _) -> i = index)

  tItem
  |> Option.map (fun (index, item) ->
    let remainder =
      indexed
      |> List.filter (fun (i, _) -> i <> index)
      |> List.map snd

    item, remainder
  )

let randomBin (rnd: Random) (binCount: int) (items: 'a list): 'a list list =
  if binCount <= 0 then
    []
  else
    let rec randomBinInner (remaining: 'a list) (currentBins: 'a list list): 'a list list =
      let tNextBin = chooseRandom rnd currentBins
      let tNextItem = chooseRandom rnd remaining

      match tNextBin, tNextItem with
      | Some (nextBin, otherBins), Some (nextItem, remaining) ->
        let newBins = (nextItem::nextBin)::otherBins
        randomBinInner remaining newBins
      | _ ->
        currentBins

    let initialBins = List.init binCount (fun _ -> [])
    randomBinInner items initialBins

let totalScore (items: float list): float =
  items |> List.sum

let items = [0.0 .. 0.1 .. 4.0]

let binned =
  List.init 1000 id
  |> List.map (fun i -> 
    let bins =
      randomBin rnd 10 items
      |> List.map (fun bin -> totalScore bin, bin)

    bins |> List.map fst |> stdDev, bins
  )

let bestBin = binned |> List.minBy fst
let worstBin = binned |> List.maxBy snd
