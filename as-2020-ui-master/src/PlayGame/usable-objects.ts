import { Point } from '../converters/point';
import { UsableObject } from '../model/usable-object';
import { Activity } from '../model/activity';

export const validPlayerPositions: Array<Point> = [
  { x: 470, y: 170 },
  { x: 1100, y: 270 },
  { x: 1140, y: 590 },
  { x: 760, y: 580 },
  { x: 150, y: 440 }
];

const pc1: UsableObject = {
  interactiveZone: [
    { x: 621, y: 78 },
    { x: 787, y: 103 },
    { x: 781, y: 208 },
    { x: 745, y: 260 },
    { x: 600, y: 240 }
  ],
  relatedActivity: Activity.CookieClicking
};

const pc2: UsableObject = {
  interactiveZone: [
    { x: 793, y: 213 },
    { x: 806, y: 106 },
    { x: 954, y: 126 },
    { x: 944, y: 238 },
    { x: 933, y: 293 },
    { x: 763, y: 266 }
  ],
  relatedActivity: Activity.CookieClicking
};

const pc3: UsableObject = {
  interactiveZone: [
    { x: 953, y: 237 },
    { x: 968, y: 130 },
    { x: 1119, y: 142 },
    { x: 1106, y: 256 },
    { x: 1113, y: 323 },
    { x: 944, y: 292 }
  ],
  relatedActivity: Activity.CookieClicking
};

const helpdesk: UsableObject = {
  interactiveZone: [
    { x: 365, y: 122 },
    { x: 460, y: 208 },
    { x: 415, y: 293 },
    { x: 306, y: 265 },
    { x: 287, y: 161 }
  ],
  relatedActivity: Activity.AtComputer
};

const coffeeMachine: UsableObject = {
  interactiveZone: [
    { x: 161, y: 410 },
    { x: 104, y: 282 },
    { x: 191, y: 234 },
    { x: 254, y: 342 }
  ],
  relatedActivity: Activity.DrinkCoffee
};

const tv: UsableObject = {
  interactiveZone: [
    { x: 703, y: 493 },
    { x: 680, y: 335 },
    { x: 996, y: 374 },
    { x: 995, y: 540 }
  ],
  relatedActivity: Activity.WatchTv
};

export const usableObjects: Array<UsableObject> = [
  pc1,
  pc2,
  pc3,
  helpdesk,
  coffeeMachine,
  tv
];
