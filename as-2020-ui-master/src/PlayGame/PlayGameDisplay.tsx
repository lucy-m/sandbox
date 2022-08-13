import React, { Fragment } from 'react';
import { Time, Position } from '../converters/model';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  IS_DEV,
  STEP_INTERVAL,
  TICK_INTERVAL
} from '../constants';
import './PlayGameDisplay.scss';
import { interval, Subscription, Observable, Subject } from 'rxjs';
import roomBackground from '../Assets/room.png';
import overlay from '../Assets/room-overlay.png';
import InteractionZone from './InteractionZone';
import { validPlayerPositions, usableObjects } from './usable-objects';
import { Activity } from '../model/activity';
import { UsableObject } from '../model/usable-object';
import pointInPolygon from '../model/point-in-polygon';
import { CancelInteractionLayer } from './Activities/CancelInteractionLayer';
import CookieClicker from './Activities/CookieClicker';
import { PlayEvent, PlayEventType } from '../model/play-event';
import { AtComputer } from './Activities/AtComputer';
import { GameStatus } from '../model/game-status';
import { GameParameters } from '../model/game-parameters';
import { Player } from './Player';
import { HelpOverlay } from './Activities/HelpOverlay';
import { InterfaceActions } from './InterfaceActions';
import { StatusIndicator } from './StatusIndicator';
import { FloatOutString } from './Activities/FloatOutString';
import { DrinkingCoffee } from './Activities/DrinkingCoffee';
import { WatchingTv } from './Activities/WatchingTv';

interface PlayGameDisplayProps {
  onEventDispatched: (e: PlayEvent) => void;
  gameParameters: GameParameters;
  status$: Observable<GameStatus>;
}

interface PlayGameDisplayState {
  time: Time;
  gameStatus?: GameStatus;
  scoreTickIndicators: Array<React.ReactElement>;
}

const svgId = 'game-container';

export class PlayGameDisplay extends React.Component<
  PlayGameDisplayProps,
  PlayGameDisplayState,
  {}
> {
  private readonly playableZone: JSX.Element;
  private readonly usableObjectZones: Array<JSX.Element>;
  private readonly interfaceActions: JSX.Element;
  private activity: Activity;
  private timerSub?: Subscription;
  private statusSub?: Subscription;
  private playerPosition: Position;
  private playerMoveTo: Subject<Position>;
  private tickDeferredActions: Array<{ inTicks: number; action: () => void }>;

  constructor(props: PlayGameDisplayProps) {
    super(props);

    this.state = {
      time: { time: 0 },
      scoreTickIndicators: []
    };

    this.playerPosition = {
      position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }
    };
    this.playerMoveTo = new Subject<Position>();
    this.activity = Activity.Help;
    this.tickDeferredActions = [];

    this.playableZone = (
      <InteractionZone
        points={validPlayerPositions}
        onClick={e => this.onValidMovePlaceClick(e)}
        devFill="hsla(220, 80%, 70%, 0.3)"
      ></InteractionZone>
    );
    this.usableObjectZones = usableObjects.map((obj, index) => (
      <InteractionZone
        points={obj.interactiveZone}
        onClick={e => this.onInteractionZoneClick(e, obj)}
        key={index}
      ></InteractionZone>
    ));
    this.interfaceActions = (
      <InterfaceActions
        onSetActivity={a => (this.activity = a)}
      ></InterfaceActions>
    );
  }

  componentDidMount(): void {
    this.statusSub = this.props.status$.subscribe(gameStatus =>
      this.setState({ gameStatus })
    );

    this.timerSub = interval(STEP_INTERVAL).subscribe(_ => {
      const newTime = this.state.time.time + 1;
      this.setState({ time: { time: newTime } });
      if (newTime % TICK_INTERVAL === 0) {
        this.tick();
      }
    });
  }

  componentWillUnmount(): void {
    this.timerSub && this.timerSub.unsubscribe();
    this.statusSub && this.statusSub.unsubscribe();
  }

  getMouseEventCoords: (e: React.MouseEvent) => Position = (() => {
    let svg: any;
    let point: any;

    return (e: React.MouseEvent): Position => {
      if (!svg || !point) {
        svg = document.getElementById(svgId) as any;
        point = svg.createSVGPoint();
      }
      const x = e.clientX;
      const y = e.clientY;
      point.x = x;
      point.y = y;
      const canvasCoords = point.matrixTransform(svg.getScreenCTM().inverse());

      return {
        position: { x: canvasCoords.x, y: canvasCoords.y }
      };
    };
  })();

  onValidMovePlaceClick(e: React.MouseEvent): void {
    if (this.activity === Activity.None) {
      const newPosition = this.getMouseEventCoords(e);
      this.playerMoveTo.next(newPosition);
    }
  }

  onPlayerMoveDone(p: Position): void {
    this.playerPosition = p;
  }

  onInteractionZoneClick(
    e: React.MouseEvent,
    usableObject: UsableObject
  ): void {
    const playerPosition = this.playerPosition.position;

    if (pointInPolygon(playerPosition, usableObject.interactiveZone)) {
      if (IS_DEV) {
        console.log('Starting activity', usableObject.relatedActivity);
      }
      const activity = usableObject.relatedActivity;

      this.activity = activity;
    } else {
      this.onValidMovePlaceClick(e);
    }
  }

  onCanvasClick(e: React.MouseEvent): void {
    const clickPosition = this.getMouseEventCoords(e);

    if (IS_DEV) {
      console.log(
        'Clicked on canvas at',
        JSON.stringify(clickPosition.position)
      );
    }
  }

  cancelActivity(): void {
    this.activity = Activity.None;
  }

  tick(): void {
    this.dispatchEvent({ type: PlayEventType.Tick });
    if (this.state.gameStatus) {
      const tickRate = this.state.gameStatus.scoreRate;
      if (tickRate > 0) {
        const tickIndicator = (
          <FloatOutString
            displayValue={'+' + tickRate}
            key={Math.random()}
            startPosition={{ position: { x: 200, y: 488 } }}
          ></FloatOutString>
        );

        const newTickIndicators = [
          tickIndicator,
          ...this.state.scoreTickIndicators
        ].slice(0, 3);

        this.setState({ scoreTickIndicators: newTickIndicators });
      }
    }

    this.tickDeferredActions.forEach(({ inTicks, action }) => {
      if (inTicks === 0) {
        action();
      }
    });
    this.tickDeferredActions = this.tickDeferredActions
      .map(({ inTicks, action }) => ({ inTicks: inTicks - 1, action }))
      .filter(({ inTicks }) => inTicks >= 0);
  }

  addTickDeferredAction(inTicks: number, action: () => void): void {
    this.tickDeferredActions = [
      ...this.tickDeferredActions,
      { inTicks, action }
    ];
  }

  dispatchEvent(e: PlayEvent): void {
    this.props.onEventDispatched(e);
  }

  getCurrentActivity(): JSX.Element {
    const activity = this.activity;
    if (this.activity === Activity.None) {
      if (this.state.gameStatus) {
        return (
          <Player
            character={this.state.gameStatus.character.name}
            initialPosition={this.playerPosition}
            moveTo={this.playerMoveTo.asObservable()}
            onMoveDone={p => this.onPlayerMoveDone(p)}
          ></Player>
        );
      } else {
        return <Fragment></Fragment>;
      }
    }

    if (this.activity === Activity.Help) {
      return <Fragment></Fragment>;
    }

    const activityElement = (() => {
      if (activity === Activity.CookieClicking) {
        return (
          <CookieClicker
            onCookieClicked={() =>
              this.dispatchEvent({ type: PlayEventType.CookieClicked })
            }
            status$={this.props.status$}
            gameParameters={this.props.gameParameters}
          ></CookieClicker>
        );
      } else if (activity === Activity.AtComputer) {
        return (
          <AtComputer
            status$={this.props.status$}
            gameParameters={this.props.gameParameters}
            onEvent={e => this.dispatchEvent({ type: e })}
          ></AtComputer>
        );
      } else if (activity === Activity.DrinkCoffee) {
        return (
          <DrinkingCoffee
            durationTicks={
              this.props.gameParameters.coffeeDrinkDuration * TICK_INTERVAL
            }
            onDone={() => {
              this.cancelActivity();
              this.dispatchEvent({ type: PlayEventType.DrinkCoffee });
              this.addTickDeferredAction(
                this.props.gameParameters.energizedDuration,
                () => this.dispatchEvent({ type: PlayEventType.DeEnergize })
              );
            }}
          ></DrinkingCoffee>
        );
      } else if (activity === Activity.WatchTv) {
        return (
          <WatchingTv
            durationTicks={
              this.props.gameParameters.watchTvDuration * TICK_INTERVAL
            }
            onDone={() => {
              this.cancelActivity();
              this.dispatchEvent({ type: PlayEventType.WatchTv });
              this.addTickDeferredAction(
                this.props.gameParameters.entertainedDuration,
                () => this.dispatchEvent({ type: PlayEventType.Unentertained })
              );
            }}
          ></WatchingTv>
        );
      }
    })();
    return (
      <Fragment>
        <CancelInteractionLayer
          onCancel={() => this.cancelActivity()}
        ></CancelInteractionLayer>
        {activityElement}
      </Fragment>
    );
  }

  render(): React.ReactElement {
    return (
      <svg
        id={svgId}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        width="100%"
        className="game-container"
        onClick={e => this.onCanvasClick(e)}
      >
        <image href={roomBackground} height="100%" width="100%" />
        <g className={IS_DEV ? 'dev items' : 'items'}>
          {this.playableZone}
          {this.usableObjectZones}
          {this.getCurrentActivity()}
        </g>
        <image href={overlay} height="100%" width="100%" pointerEvents="none" />
        {this.interfaceActions}
        <StatusIndicator
          currentStatus={this.state.gameStatus}
        ></StatusIndicator>
        {this.state.scoreTickIndicators}
        {this.activity === Activity.Help && (
          <HelpOverlay onClick={() => this.cancelActivity()}></HelpOverlay>
        )}
      </svg>
    );
  }
}

export default PlayGameDisplay;
