import {
  Time,
  TimePositionConverter,
  Position,
  positionsClose
} from '../converters/model';
import { Observable, Subscription, interval } from 'rxjs';
import React from 'react';
import { constantTimePosition } from '../converters/no-op-pipes';
import { STEP_INTERVAL } from '../constants';
import { MoveBetween } from '../converters/move-between';
import adrianaWalk from '../Assets/Adriana-walk.png';
import adrianaIdle from '../Assets/Adriana-idle.png';
import irvingWalk from '../Assets/Irving-walk.png';
import irvingIdle from '../Assets/Irving-idle.png';
import { Point } from '../converters/point';
import './Player.scss';

interface PlayerProps {
  onMoveDone: (p: Position) => void;
  initialPosition: Position;
  moveTo: Observable<Position>;
  character: string;
}

interface PlayerState {
  time: Time;
}

export class Player extends React.Component<PlayerProps, PlayerState, {}> {
  private readonly timerSub: Subscription;
  private readonly moveSub: Subscription;
  private readonly playerVelocity = 5;
  private readonly imageSize = 100;
  private playerPosition: TimePositionConverter;
  private isWalking: boolean;
  private walkPhase: boolean;
  private flipImage: boolean;
  private readonly walkPhaseDuration = 10;
  private readonly idleHref: string;
  private readonly walkHref: string;

  constructor(props: PlayerProps) {
    super(props);

    this.state = {
      time: { time: 0 }
    };

    const playerInitialPosition = constantTimePosition(props.initialPosition);
    this.playerPosition = playerInitialPosition;
    this.isWalking = false;
    this.walkPhase = false;
    this.flipImage = false;

    this.timerSub = interval(STEP_INTERVAL).subscribe(_ => {
      const newTime = this.state.time.time + 1;
      this.setState({ time: { time: newTime } });
      if (newTime % this.walkPhaseDuration === 0) {
        this.walkPhase = !this.walkPhase;
      }
    });

    this.moveSub = props.moveTo.subscribe(newPosition => {
      this.startWalking();
      const currentPosition = this.getPlayerPosition();
      if (!positionsClose(newPosition, currentPosition)) {
        this.flipImage = currentPosition.position.x < newPosition.position.x;
        const playerPosition = MoveBetween(
          currentPosition,
          newPosition,
          this.playerVelocity,
          this.state.time,
          () => {
            this.doneWalking();
            props.onMoveDone(newPosition);
          }
        );
        this.playerPosition = playerPosition;
      }
    });
    this.idleHref = props.character === 'Irving' ? irvingIdle : adrianaIdle;
    this.walkHref =
      this.props.character === 'Irving' ? irvingWalk : adrianaWalk;
  }

  componentWillUnmount(): void {
    this.timerSub.unsubscribe();
    this.moveSub.unsubscribe();
  }

  getPlayerPosition(): Position {
    return this.playerPosition.convert(this.state.time);
  }

  getImagePosition(): Point {
    const center = this.getPlayerPosition().position;
    return {
      x: center.x - this.imageSize / 2,
      y: center.y - this.imageSize / 2
    };
  }

  startWalking(): void {
    this.isWalking = true;
  }

  doneWalking(): void {
    this.isWalking = false;
  }

  getImageTransform(): string {
    const position = this.getImagePosition();
    const xAdjust = this.flipImage ? 100 : 0;
    const translate = ` translate(${position.x + xAdjust}, ${position.y})`;
    const scale = this.flipImage ? 'scale(-1, 1)' : '';

    return translate + scale;
  }

  getIdleClass(): string {
    return (
      (!this.isWalking || this.walkPhase ? 'show' : 'hide') +
      (this.flipImage ? ' flip' : '')
    );
  }

  getWalkClass(): string {
    return (
      (this.isWalking && !this.walkPhase ? 'show' : 'hide') +
      (this.flipImage ? ' flip' : '')
    );
  }

  render(): React.ReactElement {
    return (
      <g className="player">
        <image
          className={this.getIdleClass()}
          transform={this.getImageTransform()}
          height="140"
          href={this.idleHref}
        />
        <image
          className={this.getWalkClass()}
          transform={this.getImageTransform()}
          height="140"
          href={this.walkHref}
        />
      </g>
    );
  }
}
