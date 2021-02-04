import React from 'react';
import { interval, Subject } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { letters, makeSpringBezierMaker, SpringBezier, SpringCircle } from '.';
import {
  p,
  Point,
  Sharp,
  Smooth,
  SmoothAsymm,
  VertexShape,
  Zero,
} from '../../shapes';
import { makeSquare } from '../../shapes/square';
import { getMouseEventCoords } from '../../util';
import { mediaPlayer } from './media-player';

const dt = 20;
const timer = interval(dt).pipe(mapTo(dt));

const bezierMaker = makeSpringBezierMaker(
  {
    friction: 30,
    stiffness: 4,
    weight: 5,
  },
  true
);

const square1 = makeSquare(Zero, 50);
const square2 = makeSquare(p(50, 0), 50);

export const SpringDemo: React.FC = () => {
  const [started, setStarted] = React.useState(true);
  const [circleEndPoint] = React.useState(new Subject<Point>());
  const [nudge] = React.useState(new Subject<Point>());
  const [shapeMorph] = React.useState(new Subject<VertexShape>());

  const [playPause] = React.useState(
    new Subject<'play' | 'pause' | 'e' | 'eFlat'>()
  );
  const leftShape = playPause.pipe(
    map((s) => {
      switch (s) {
        case 'play':
          return mediaPlayer.play;
        case 'pause':
          return mediaPlayer.pauseLeft;
        case 'e':
          return mediaPlayer.e1;
        case 'eFlat':
          return mediaPlayer.eFlat1;
      }
    })
  );
  const rightShape = playPause.pipe(
    map((s) => {
      switch (s) {
        case 'play':
          return mediaPlayer.play;
        case 'pause':
          return mediaPlayer.pauseRight;
        case 'e':
          return mediaPlayer.e2;
        case 'eFlat':
          return mediaPlayer.eFlat2;
      }
    })
  );

  const onCanvasClick = (e: React.MouseEvent) => {
    circleEndPoint.next(getMouseEventCoords(e));
  };

  const start = bezierMaker.vertex(Sharp({ x: 10, y: 60 }));
  const subsequent = [
    bezierMaker.vertex(Sharp({ x: 100, y: 24 })),
    bezierMaker.vertex(Smooth({ x: 120, y: 80 }, { x: -20, y: -3 })),
    bezierMaker.vertex(
      SmoothAsymm({ x: 180, y: 60 }, { x: -12, y: -12 }, Zero)
    ),
    bezierMaker.vertex(Smooth({ x: 170, y: 160 }, { x: -40, y: 0 })),
    bezierMaker.vertex(SmoothAsymm({ x: 210, y: 55 }, Zero, { x: 20, y: -10 })),
    bezierMaker.vertex(Sharp({ x: 300, y: 100 })),
    bezierMaker.vertex(Sharp({ x: 300, y: 150 })),
    bezierMaker.vertex(Smooth({ x: 270, y: 150 }, { x: 45, y: 100 })),
  ];

  const nudgeUp = () => nudge.next({ x: 0, y: -100 });
  const nudgeDown = () => nudge.next({ x: 0, y: 100 });

  const reset = () => {};
  const startStop = () => setStarted(!started);
  const morphA = () => shapeMorph.next(letters.A);
  const morphB = () => shapeMorph.next(letters.B);
  const morphC = () => shapeMorph.next(letters.C);
  const morphD = () => shapeMorph.next(letters.D);
  const morphE = () => shapeMorph.next(letters.E);
  const morphF = () => shapeMorph.next(letters.F);
  const morphI = () => shapeMorph.next(letters.I);
  const morphSquare1 = () => shapeMorph.next(square1);
  const morphSquare2 = () => shapeMorph.next(square2);

  const morphPlay = () => playPause.next('play');
  const morphPause = () => playPause.next('pause');
  const morphMediaE = () => playPause.next('e');
  const morphMediaEFlat = () => playPause.next('eFlat');

  return (
    <div>
      <h2>Spring</h2>
      <svg height={400} width={600} id="svg" onClick={onCanvasClick}>
        <SpringCircle
          endPoint={circleEndPoint}
          timer={timer}
          started={started}
        />
        <SpringBezier
          initial={{ start, subsequent }}
          timer={timer}
          started={started}
          nudge={nudge}
        />
        <SpringBezier
          initial={bezierMaker.shape(letters.A)}
          origin={{ x: 100, y: 300 }}
          timer={timer}
          started={started}
          morph={shapeMorph}
          showSprings={false}
        />
        <SpringBezier
          initial={bezierMaker.shape(mediaPlayer.play)}
          origin={{ x: 400, y: 300 }}
          timer={timer}
          started={started}
          morph={leftShape}
          showSprings={false}
        />
        <SpringBezier
          initial={bezierMaker.shape(mediaPlayer.play)}
          origin={{ x: 400, y: 300 }}
          timer={timer}
          started={started}
          morph={rightShape}
          showSprings={false}
        />
      </svg>
      <div>
        <button onClick={startStop}>{started ? 'Stop' : 'Start'}</button>
        <button onClick={reset}>Reset</button>
        <button onClick={nudgeUp}>Nudge up</button>
        <button onClick={nudgeDown}>Nudge down</button>
      </div>
      <div>
        <button onClick={morphA}>Morph A</button>
        <button onClick={morphB}>Morph B</button>
        <button onClick={morphC}>Morph C</button>
        <button onClick={morphD}>Morph D</button>
        <button onClick={morphE}>Morph E</button>
        <button onClick={morphF}>Morph F</button>
        <button onClick={morphI}>Morph I</button>
      </div>
      <div>
        <button onClick={morphSquare1}>Square 1</button>
        <button onClick={morphSquare2}>Square 2</button>
        <button onClick={morphPlay}>Play</button>
        <button onClick={morphPause}>Pause</button>
        <button onClick={morphMediaE}>e</button>
        <button onClick={morphMediaEFlat}>e flat</button>
      </div>
    </div>
  );
};
