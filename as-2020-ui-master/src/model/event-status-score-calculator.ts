import { GameParameters } from './game-parameters';
import { PlayEventType } from './play-event';
import { GameStatus } from './game-status';
import { getPropertiesByType } from './play-event-properties';
import { getAdditionalPlayEventScore } from './player-status';

export interface EventStatusScoreCalculator {
  calculateScoreForEvent: (e: PlayEventType, gameStatus: GameStatus) => number;
  calculateScoreForTick: (e: PlayEventType, gameStatus: GameStatus) => number;
}

export const EventStatusScoreCalculator = (
  parameters: GameParameters
): EventStatusScoreCalculator => {
  const calculateScoreForEvent = (
    e: PlayEventType,
    gameStatus: GameStatus
  ): number => {
    const baseCost = parameters.baseScoreRates[e.name];
    const properties = getPropertiesByType(e);
    const stepCount = properties.stepCount;
    const stepRatio = 1 + parameters.itemStepRate / 100;
    const stepTotalCost = Math.ceil(
      Math.pow(stepRatio, stepCount(gameStatus)) * baseCost
    );
    const additionalScore = getAdditionalPlayEventScore(
      gameStatus.playerStatus,
      e,
      gameStatus
    );
    return Math.floor(stepTotalCost + additionalScore);
  };

  const calculateScoreForTick = (e: PlayEventType) =>
    parameters.baseScorePerTick[e.name];

  return {
    calculateScoreForEvent,
    calculateScoreForTick
  };
};
