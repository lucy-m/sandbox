import Axios from 'axios';
import { BASE_URL } from '../constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toObservable } from './util';
import { PlayerStatus } from './player-status';

export interface GameStatus {
  id: string;
  playerName: string;
  character: {
    name: string;
  };
  score: number;
  scoreRate: number;
  scriptWritten: boolean;
  scriptDeployedCount: number;
  kubernetesResearched: boolean;
  kubernetesDeployCount: number;
  ccgCreated: boolean;
  ccgDeployCount: number;
  playerStatus: PlayerStatus;
}

export const getGameStatus = (id: string): Observable<GameStatus> => {
  return toObservable(
    Axios.get<GameStatus>(BASE_URL + 'game/status/' + id)
  ).pipe(map(response => response.data));
};

export const statusWith = (
  gameStatus: GameStatus,
  overrides: Partial<GameStatus>
): GameStatus => {
  return Object.assign({}, gameStatus, overrides);
};
