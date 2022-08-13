import { Observable } from 'rxjs';
import { toObservable } from './util';
import Axios from 'axios';
import { BASE_URL } from '../constants';
import { map } from 'rxjs/operators';

export interface GameParameters {
  batchSize: number;
  baseScriptRate: number;
  itemStepRate: number;
  coffeeDrinkDuration: number;
  energizedDuration: number;
  watchTvDuration: number;
  entertainedDuration: number;
  baseScoreRates: { [eventName: string]: number };
  baseScorePerTick: { [eventName: string]: number };
}

export const getGameParameters = (): Observable<GameParameters> => {
  return toObservable(
    Axios.get<GameParameters>(BASE_URL + 'game/parameters/')
  ).pipe(map(response => response.data));
};
