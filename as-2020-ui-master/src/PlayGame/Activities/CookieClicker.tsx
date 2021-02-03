import React from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, STEP_INTERVAL } from '../../constants';
import { Time, TimePositionConverter } from '../../converters/model';
import cookie from '../../Assets/cookie.png';
import { interval, Subscription, Observable } from 'rxjs';
import { constantTimePosition } from '../../converters/no-op-pipes';
import { FullPipe, TimePipe } from '../../converters/pipe';
import { Delay } from '../../converters/delay';
import { TimeStretch } from '../../converters/time-stretch';
import { LinearInterpolator } from '../../converters/linear-interpolator';
import { TimeReverse } from '../../converters/time-reverse';
import { FloatOutString } from './FloatOutString';
import { GameParameters } from '../../model/game-parameters';
import { GameStatus } from '../../model/game-status';
import { EventStatusScoreCalculator } from '../../model/event-status-score-calculator';
import { PlayEventType } from '../../model/play-event';

const baseCookieSize = 200;

interface CookieClickerProps {
  onCookieClicked: () => void;
  gameParameters: GameParameters;
  status$: Observable<GameStatus>;
}

interface CookieClickerState {
  time: Time;
  currentStatus?: GameStatus;
  floatOutStrings: Array<React.ReactElement>;
}

export class CookieClicker extends React.Component<
  CookieClickerProps,
  CookieClickerState,
  {}
> {
  private cookieSize: TimePositionConverter;
  private readonly eventScoreCalculator: EventStatusScoreCalculator;
  private statusSub?: Subscription;
  private timer?: Subscription;

  constructor(props: CookieClickerProps) {
    super(props);

    this.state = {
      time: { time: 0 },
      floatOutStrings: []
    };

    this.eventScoreCalculator = EventStatusScoreCalculator(
      props.gameParameters
    );

    this.cookieSize = constantTimePosition({
      position: { x: baseCookieSize, y: baseCookieSize }
    });
  }

  componentDidMount(): void {
    this.statusSub = this.props.status$.subscribe(gameStatus =>
      this.setState({ currentStatus: gameStatus })
    );

    this.timer = interval(STEP_INTERVAL).subscribe(_ =>
      this.setState({ time: { time: this.state.time.time + 1 } })
    );
  }

  componentWillUnmount(): void {
    this.timer && this.timer.unsubscribe();
    this.statusSub && this.statusSub.unsubscribe();
  }

  onCookieClicked(): void {
    this.props.onCookieClicked();
    const cookieSize = FullPipe({
      timeConverter: TimePipe([
        Delay(this.state.time.time),
        TimeStretch(6),
        TimeReverse(1)
      ]),
      timePositionConverter: LinearInterpolator(
        { x: baseCookieSize, y: baseCookieSize },
        { x: 0.9 * baseCookieSize, y: 0.85 * baseCookieSize }
      )
    });
    this.addNewFloatOutString();
    this.cookieSize = cookieSize;
  }

  addNewFloatOutString(): void {
    const score = this.state.currentStatus
      ? this.eventScoreCalculator.calculateScoreForEvent(
          PlayEventType.CookieClicked,
          this.state.currentStatus
        )
      : '5';
    const newFloatOutStrings = [
      <FloatOutString
        displayValue={'+' + score}
        key={Math.random()}
        startPosition={{
          position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }
        }}
        xJitter={40}
      ></FloatOutString>,
      ...this.state.floatOutStrings
    ].slice(0, 4);
    this.setState({
      floatOutStrings: newFloatOutStrings
    });
  }

  render(): React.ReactElement {
    const cookieSize = this.cookieSize.convert(this.state.time).position;

    return (
      <g>
        <rect
          x={CANVAS_WIDTH / 2 - 160}
          y={CANVAS_HEIGHT / 2 - 120}
          width="320"
          height="240"
          rx="20"
          ry="20"
          fill="lightgray"
        ></rect>
        <image
          className="interactive"
          href={cookie}
          height={cookieSize.x}
          x={(CANVAS_WIDTH - cookieSize.x) / 2}
          y={(CANVAS_HEIGHT - cookieSize.y) / 2}
          onClick={() => this.onCookieClicked()}
        ></image>
        {this.state.floatOutStrings}
      </g>
    );
  }
}

export default CookieClicker;
