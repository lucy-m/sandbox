import { BehaviorSubject, Observable } from 'rxjs';
import { GameStatus } from './game-status';
import { PlayEvent } from './play-event';
import { GameParameters } from './game-parameters';
import { EventStatusScoreCalculator } from './event-status-score-calculator';
import { getPropertiesByType } from './play-event-properties';

export class StatusAccumulator {
  private readonly status: BehaviorSubject<GameStatus>;
  private readonly scoreCalculator: EventStatusScoreCalculator;

  public get status$(): Observable<GameStatus> {
    return this.status.asObservable();
  }

  public get currentStatus(): GameStatus {
    return this.status.value;
  }

  constructor(initialStatus: GameStatus, parameters: GameParameters) {
    this.status = new BehaviorSubject<GameStatus>(initialStatus);
    this.scoreCalculator = EventStatusScoreCalculator(parameters);
  }

  adjustStatusFromEvent(playEvent: PlayEvent): void {
    const current = this.currentStatus;
    const eventType = playEvent.type;
    const withUpdatedScore = (() => {
      const eventScore = this.scoreCalculator.calculateScoreForEvent(
        eventType,
        current
      );
      const tickScore = this.scoreCalculator.calculateScoreForTick(
        eventType,
        current
      );

      return Object.assign({}, current, {
        score: current.score + eventScore,
        scoreRate: current.scoreRate + tickScore
      });
    })();

    const withAdditionalStatusUpdates = getPropertiesByType(
      eventType
    ).additionalStatusUpdates(withUpdatedScore);

    this.status.next(withAdditionalStatusUpdates);
  }
}
