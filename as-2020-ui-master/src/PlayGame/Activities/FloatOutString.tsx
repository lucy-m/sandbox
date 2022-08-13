import React from 'react';
import { Time, TimePositionConverter, Position } from '../../converters/model';
import { Subscription, interval } from 'rxjs';
import { STEP_INTERVAL } from '../../constants';
import { MoveBetween } from '../../converters/move-between';
import { addPoint } from '../../converters/point';

interface FloatOutStringProps {
  startPosition: Position;
  displayValue: string;
  xJitter?: number;
}

interface FloatOutStringState {
  time: Time;
}

export class FloatOutString extends React.Component<
  FloatOutStringProps,
  FloatOutStringState,
  {}
> {
  private timer?: Subscription;
  private readonly position: TimePositionConverter;
  private readonly fadeOutDistance = -90;
  private readonly xOffset: number;

  constructor(props: FloatOutStringProps) {
    super(props);

    this.state = {
      time: { time: 0 }
    };

    const endPosition = {
      position: addPoint(props.startPosition.position, {
        x: 0,
        y: this.fadeOutDistance
      })
    };
    this.position = MoveBetween(props.startPosition, endPosition, 2.5, {
      time: 0
    });
    const xJitter = this.props.xJitter || 0;
    this.xOffset = xJitter * Math.random() - xJitter / 2;
  }

  componentDidMount(): void {
    this.timer = interval(STEP_INTERVAL).subscribe(_ => {
      this.tick();
    });
  }

  componentWillUnmount(): void {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }

  tick(): void {
    const nextTime = this.state.time.time + 1;
    this.setState({ time: { time: nextTime } });
  }

  render(): React.ReactElement {
    const position = this.position.convert(this.state.time).position;
    const distanceFromStart = position.y - this.props.startPosition.position.y;
    const opacity = 1 - distanceFromStart / this.fadeOutDistance;

    return (
      <text
        x={position.x + this.xOffset}
        y={position.y}
        fontSize="36px"
        strokeWidth="2px"
        fill="white"
        stroke="black"
        opacity={opacity}
        textAnchor="middle"
      >
        {this.props.displayValue}
      </text>
    );
  }
}
