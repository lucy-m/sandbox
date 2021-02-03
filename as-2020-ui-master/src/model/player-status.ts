import { PlayEventType } from './play-event';
import { GameStatus } from './game-status';

export interface PlayerStatus {
  energized: boolean;
  entertained: boolean;
}

export const playerStatusWith = (
  playerStatus: PlayerStatus,
  overrides: Partial<PlayerStatus>
): PlayerStatus => {
  return Object.assign({}, playerStatus, overrides);
};

export const getAdditionalPlayEventScore = (
  playerStatus: PlayerStatus,
  playEventType: PlayEventType,
  gameStatus: GameStatus
) => {
  if (playEventType === PlayEventType.CookieClicked) {
    const multiplier =
      (playerStatus.energized ? 0.5 : 0) + (playerStatus.entertained ? 0.3 : 0);
    return gameStatus.scoreRate * multiplier;
  }

  return 0;
};
