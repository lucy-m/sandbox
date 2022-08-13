import React from 'react';
import { Time } from '../../converters/model';
import { Subscription, interval } from 'rxjs';
import { STEP_INTERVAL, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants';
import coffeeCup from '../../Assets/coffee.png';

interface DrinkingCoffeeProps {
  durationTicks: number;
  onDone: () => void;
}

interface DrinkingCoffeeState {
  time: Time;
}

export class DrinkingCoffee extends React.Component<
  DrinkingCoffeeProps,
  DrinkingCoffeeState,
  {}
> {
  private timerSub?: Subscription;
  private readonly imageSize = 300;

  constructor(props: DrinkingCoffeeProps) {
    super(props);

    this.state = {
      time: { time: 0 }
    };
  }

  componentDidMount(): void {
    this.timerSub = interval(STEP_INTERVAL).subscribe(_ => {
      const newTime = { time: this.state.time.time + 1 };
      this.setState({
        time: newTime
      });
      if (newTime.time > this.props.durationTicks) {
        this.props.onDone();
      }
    });
  }

  componentWillUnmount(): void {
    this.timerSub && this.timerSub.unsubscribe();
  }

  render(): React.ReactElement {
    const percentComplete = Math.round(
      (this.state.time.time / this.props.durationTicks) * 100
    );

    return (
      <g>
        <image
          href={coffeeCup}
          width={this.imageSize}
          height={this.imageSize}
          x={(CANVAS_WIDTH - this.imageSize) / 2}
          y={(CANVAS_HEIGHT - this.imageSize) / 2}
        ></image>
        <text
          x={(CANVAS_WIDTH + this.imageSize) / 2 + 150}
          y={CANVAS_HEIGHT / 2 + 20}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="66px"
          fill="white"
          stroke="black"
          strokeWidth="2px"
        >
          {percentComplete}%
        </text>
      </g>
    );
  }
}
