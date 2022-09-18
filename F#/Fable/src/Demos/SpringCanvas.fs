namespace Demos

open Sutil
open Sutil.DOM
open Feliz
open SpringAnimate
open Components

open JsLib
open Geometry

module SpringCanvas =
  let initial: Spring = {
    position = { x = 60.0; y = 35.0 }
    velocity = { x = 0.0; y = 0.0 }
    endPoint = { x = 300.0; y = 200.0 }
    properties = {
      stiffness = 8.0
      friction = 26.0
      weight = 4.0
    }
  }
  let springStore: IStore<Spring> = Store.make initial

  let ticker = RxJs.interval(50)
  ticker.subscribe(fun _ -> 
    let ticked = Spring.tick 0.01 springStore.Value

    if ticked <> springStore.Value
    then Store.set springStore ticked
    else ignore()
  )

  let d1 = PathPointCommand.parseString "M 41.080116,96.411724 c 0.614227,-2.209137 -2.594468,0.61665 -2.850388,-1.214378 -1.98812,0.577661 -2.392719,-1.302797 -0.984441,-2.10224 -0.799156,-0.533327 -2.574401,-0.147177 -2.407438,-1.37271 -0.09185,-1.19119 -2.028014,-1.540676 -0.745081,-3.61566 2.414623,-0.593413 -2.217282,-1.635525 -0.247222,-2.55246 -0.405614,-1.407559 -0.707162,-2.061822 -1.256243,-3.67526 0.16709,-1.244294 0.412784,-2.082223 1.654066,-2.69521 -0.549549,-1.10605 0.465878,-3.430303 -1.811948,-3.40671 -1.459392,0.170173 5.837309,-2.146567 2.000388,-1.97927 -4.143355,-0.60369 2.379711,-1.499638 3.449205,-1.15393 3.473665,-0.05295 6.796067,-0.565802 10.226682,-0.82561 1.571699,0.335382 2.166143,-0.0329 3.576441,0.09812 2.852253,-0.499961 5.933534,0.07091 8.899595,-0.16872 1.377959,0.222002 2.849464,-0.337677 3.784396,-0.22842 1.783568,-0.164666 3.942595,-0.369051 5.92048,-0.241522 1.42938,-0.711414 2.250048,0.156115 3.391912,-0.366728 2.269411,0.212946 5.517556,-0.259767 8.11147,-0.08562 2.958455,-0.436983 6.160057,-0.03853 9.17122,0.21297 1.594113,0.363745 2.920644,-1.24951 3.72907,-0.24949 0.166538,-0.942209 0.538989,-0.1549 1.67811,0.08445 2.708012,-0.210334 5.77325,0.205749 8.5721,0.0799 2.50403,0.0525 4.15974,0.01678 6.7727,-0.16216 1.55549,0.153604 3.28952,-0.01513 4.71451,0.01566 2.59004,-0.02252 5.22184,0.07037 7.80656,-0.164185 1.40795,-0.659714 8.23971,0.775828 7.1351,-0.86199 -1.26277,0.144519 -7.47914,0.06194 -5.17142,-0.1398 3.13899,-0.169595 6.17156,-0.11596 9.27522,-0.16309 5.38058,0.0039 10.80295,-0.188043 16.19079,-0.08402 3.14923,-0.40257 5.26737,0.576295 8.02141,1.50955 2.42609,-0.466457 3.42687,1.233397 1.83826,1.34756 2.63454,0.963024 0.41999,0.849019 -0.50608,1.98135 1.17972,0.71311 3.32846,2.294022 1.35723,2.75117 -2.47363,-0.107291 1.11925,2.52569 0.10782,2.21144 -1.38977,0.53352 0.39456,2.748291 -2.30203,3.335111 2.02368,0.115833 3.69016,2.77728 4.33066,3.477174 -0.37186,0.507719 -2.57017,0.253287 -0.4801,1.949375 -3.46219,-0.209202 0.86,2.465153 -1.19142,2.65711 -1.6617,-0.889895 -0.30297,0.78273 -2.24302,0.57908 -0.44933,1.101552 0.65514,1.587825 -1.28792,0.59448 -0.0979,2.028318 -1.12013,-0.556616 -1.59828,0.27139 1.33751,1.574898 0.23183,0.377857 -0.15099,0.67009 -0.97151,0.921545 -3.26416,-0.277875 -3.85856,0.58677 -1.11417,-0.700113 -3.15858,-0.09475 -4.13655,-0.59657 -1.46025,0.252221 -2.8449,-0.433432 -4.09617,0.169276 -1.75496,-0.325469 -3.2973,-0.09574 -5.21496,-0.112076 -0.94322,-0.640979 -1.75418,0.851012 -2.48924,-0.34574 -0.69613,0.149702 -2.40292,0.516346 -3.49244,0.20608 -1.51188,-0.602607 -2.77143,-1.200031 -3.71309,-0.326825 -0.14861,-0.477373 -2.13797,0.214258 -2.58667,0.08361 -0.98303,0.956105 -1.23966,-0.2183 -2.39368,0.2899 -1.72041,1.099151 -4.95704,0.242077 -7.15123,0.28211 -1.35967,0.01942 -1.35516,0.136257 -2.59368,0.14086 -1.7489,0.617136 -2.05848,-0.288901 -3.47158,-0.21238 -1.0073,-0.109922 -0.43598,-0.420177 -1.84298,0.22296 -1.77259,0.237133 -2.55517,-0.258657 -4.16244,-0.0015 -1.13371,-0.136911 -1.88651,0.383151 -2.88413,-9.7e-4 -1.12752,0.818782 -3.558696,0.254577 -4.38743,0.28514 -0.266828,0.03343 -1.565152,-0.542461 -2.6332,-0.67811 -1.039895,0.150183 -1.002212,-0.603094 -2.26606,0.0326 -0.953313,0.284889 -1.970721,0.534734 -3.33437,0.95132 -0.861999,-0.842468 -1.724486,0.185128 -2.467939,0.24537 -0.06521,-1.321689 -2.662336,0.81999 -4.033251,-0.11894 -1.885474,0.568955 -3.316851,0.316146 -4.99516,0.23657 -1.252646,0.180312 -2.228843,0.347617 -3.71864,0.64057 -1.452753,-0.04627 -4.295528,0.273078 -4.35745,0.24217 -1.094417,-0.32481 -2.065661,0.246323 -3.352711,-0.22969 -1.088653,-0.278096 -3.31777,0.568602 -4.043557,0.01647 -1.583134,0.198946 -3.702489,0.418854 -4.685375,0.62102 -0.604387,-0.64984 -3.426787,-0.523673 -3.871855,-0.39748 -1.027703,-0.207343 -3.141713,0.293121 -3.960419,0.46588 -0.955368,-1.22057 -1.792407,1.158388 -2.419556,-0.3069 -1.90381,1.076703 -1.495613,-0.178302 -3.039611,0.38753 -1.12516,-0.355001 -4.365677,-0.448104 -4.422713,0.34012 -0.0018,0.522838 -0.04708,0.361174 -0.404677,0.564098 z M 133.17203,70.534616 c 1.56335,-0.563185 3.64244,0.41704 4.85745,-0.62341 -1.25694,-0.195003 -2.78142,-0.05803 -4.27121,0.10197 -0.5746,-0.458426 -2.33439,0.48649 -0.58624,0.52144 z"
  let d2 = PathPointCommand.parseString "M 30,20 70,80 L 200,120 180,140 C 190,160 245,155 260,140 m 0,-40 80,5 l 20,80 c 30,30 -40,10 -60,60"

  let cmpt () =
    Html.div [
      disposeOnUnmount [springStore]
      Svg.svg [
        Attr.width (length.px 600)
        Attr.height (length.px 400)
        Attr.style [
          Css.border (length.px 2, borderStyle.solid, color.black)
        ]

        bindFragment springStore SpringDisplay.cmpt

        PathCommandDisplay.cmpt (PathCommandDisplay.Args(commands = d1, debug = true))
        PathCommandDisplay.cmpt (PathCommandDisplay.Args(commands = d2, debug = true))
      ]
    ]
