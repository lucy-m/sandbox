open System

type ScheduleEntry = {
  startTime: DateTime
  endTime: DateTime
}

type Schedule = ScheduleEntry list

let combineSchedules (a: Schedule) (b: Schedule): Schedule =
  let both =
    a
    |> List.append b
    |> List.sortBy (fun s -> s.startTime)

  both
  |> List.fold (fun (tPrev, allItems) next ->
    match tPrev with
    | None -> (Some next, allItems)
    | Some prev ->
        if next.startTime > prev.endTime
        then (Some next, prev::allItems)
        else
          let startTime = prev.startTime
          let endTime = if next.endTime > prev.endTime then next.endTime else prev.endTime
          let current: ScheduleEntry = {
            startTime = startTime
            endTime = endTime
          }
          (Some current, allItems)
  ) (None, [])
  |> fun (last, rest) ->
      match last with
      | Some l -> l::rest
      | None -> rest
  |> List.rev

let scheduleA: Schedule = [
  {
    startTime = new DateTime(2020, 3, 14, 11, 0, 0)
    endTime   = new DateTime(2020, 3, 14, 11, 15, 0)
  }
  {
    startTime = new DateTime(2020, 3, 14, 12, 0, 0)
    endTime   = new DateTime(2020, 3, 14, 13, 0, 0)
  }
]

let scheduleB: Schedule = [
  {
    startTime = new DateTime(2020, 3, 14, 11, 0, 0)
    endTime   = new DateTime(2020, 3, 14, 11, 25, 0)
  }
  {
    startTime = new DateTime(2020, 3, 14, 13, 0, 0)
    endTime   = new DateTime(2020, 3, 14, 14, 0, 0)
  }
]

let combined = combineSchedules scheduleA scheduleB
