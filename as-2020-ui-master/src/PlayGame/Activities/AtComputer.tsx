import React from 'react';
import { ChoiceButton } from '../ChoiceButton';
import { GameParameters } from '../../model/game-parameters';
import { PlayEventType } from '../../model/play-event';
import { Position } from '../../converters/model';
import { GameStatus } from '../../model/game-status';
import { Observable, Subscription } from 'rxjs';
import { EventStatusScoreCalculator } from '../../model/event-status-score-calculator';
import { getPropertiesByType } from '../../model/play-event-properties';
import './AtComputer.scss';
import { FloatOutString } from './FloatOutString';

interface AtComputerProps {
  gameParameters: GameParameters;
  status$: Observable<GameStatus>;
  onEvent: (e: PlayEventType) => void;
}

interface AtComputerState {
  currentStatus?: GameStatus;
  purchaseIndicators: Array<React.ReactElement>;
}

export class AtComputer extends React.Component<
  AtComputerProps,
  AtComputerState,
  {}
> {
  private readonly layout = {
    startX: 100,
    startY: 100,
    deltaX: 320,
    deltaY: 70
  };
  private readonly eventScoreCalculator: EventStatusScoreCalculator;
  private statusSub?: Subscription;

  constructor(props: AtComputerProps) {
    super(props);
    this.state = {
      purchaseIndicators: []
    };
    this.eventScoreCalculator = EventStatusScoreCalculator(
      props.gameParameters
    );
  }

  componentDidMount(): void {
    this.statusSub = this.props.status$.subscribe(gameStatus =>
      this.setState({ currentStatus: gameStatus })
    );
  }

  componentWillUnmount(): void {
    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }
  }

  private addPurchaseIndicator(at: Position, cost: number): void {
    const display = cost.toString();

    const newPurchaseIndicator = (
      <FloatOutString
        displayValue={display}
        startPosition={at}
        key={Math.random()}
      ></FloatOutString>
    );

    const newIndicators = [
      newPurchaseIndicator,
      ...this.state.purchaseIndicators
    ].slice(0, 2);

    this.setState({ purchaseIndicators: newIndicators });
  }

  private calcItemPosition(x: number, y: number): Position {
    const { startX, startY, deltaX, deltaY } = this.layout;

    const position: Position = {
      position: { x: startX + x * deltaX, y: startY + y * deltaY }
    };

    return position;
  }

  private renderButton(
    e: PlayEventType,
    description: string,
    x: number,
    y: number
  ): React.ReactElement {
    if (!this.state.currentStatus) {
      return <text>Cannot render button</text>;
    } else {
      const currentStatus = this.state.currentStatus;

      const position = this.calcItemPosition(x, y);
      const cost = this.eventScoreCalculator.calculateScoreForEvent(
        e,
        currentStatus
      );
      const text = description + ' (' + -1 * cost + ')';

      const canPerform = ((): boolean => {
        const canBuy = currentStatus.score + cost >= 0;

        const properties = getPropertiesByType(e);
        const additionalValidation = properties.additionalValidation(
          currentStatus
        );

        return canBuy && additionalValidation;
      })();

      const purchaseIndicatorPosition = {
        position: {
          x: position.position.x + this.layout.deltaX / 2,
          y: position.position.y
        }
      };

      return (
        <ChoiceButton
          disabled={!canPerform}
          name={text}
          position={position}
          onClick={() => {
            this.props.onEvent(e);
            this.addPurchaseIndicator(purchaseIndicatorPosition, cost);
          }}
        ></ChoiceButton>
      );
    }
  }

  private addHelpText(text: string, x: number, y: number): React.ReactElement {
    const position = this.calcItemPosition(x, y).position;

    return (
      <text x={position.x} y={position.y + this.layout.deltaY / 2} fill="white">
        {text}
      </text>
    );
  }

  render() {
    return (
      <g>
        {this.renderButton(PlayEventType.ScriptWritten, 'Develop script', 0, 0)}
        {this.renderButton(
          PlayEventType.ScriptDeployed,
          'Deploy script with AVS',
          1,
          0
        )}
        {this.addHelpText(
          'A script on Windows produces 1 Cookie per Second',
          2,
          0
        )}
        {this.renderButton(
          PlayEventType.KubernetesResearched,
          'Research Kubernetes',
          0,
          1
        )}
        {this.renderButton(
          PlayEventType.KubernetesDeploy,
          'Deploy script on Kubernetes',
          1,
          1
        )}
        {this.addHelpText('A script on K8S produces 1 Cookie per Second', 2, 1)}
        {this.renderButton(
          PlayEventType.CcgCreated,
          'Develop Colo Config Generator',
          0,
          2
        )}
        {this.renderButton(
          PlayEventType.CcgDeploy,
          'Deploy script to Colo',
          1,
          2
        )}
        {this.addHelpText('A script in a colo 10 Cookies per Second', 2, 2)}
        {this.state.purchaseIndicators}
      </g>
    );
  }
}
