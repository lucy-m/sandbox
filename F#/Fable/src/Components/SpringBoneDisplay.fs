namespace Components

open Sutil
open SpringAnimate

module SpringBoneDisplay =
  let cmpt (springBone: SpringBone2d) =
    let springs = SpringBone.dim2.getSprings springBone

    springs 
    |> Array.map SpringDisplay.cmpt
    |> Svg.g
