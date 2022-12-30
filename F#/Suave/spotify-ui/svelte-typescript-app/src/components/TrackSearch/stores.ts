import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  of,
  share,
  Subject,
  switchMap,
} from 'rxjs';
import { readable } from 'svelte/store';
import type { TrackModel } from '../../models/track';
import type { ApiService } from '../../services/api';

export type StoreState =
  | { kind: 'initial' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'data'; data: TrackModel[] };

export const trackSearchStore = (apiService: ApiService) => {
  const textSearchSubject = new Subject<string>();
  const searchString$ = textSearchSubject.pipe(
    distinctUntilChanged(),
    debounceTime(1000)
  );
  const searchResult$ = searchString$.pipe(
    switchMap((search) => apiService.searchForTracks(search)),
    map((data) => ({ kind: 'data', data } as StoreState)),
    catchError((err) =>
      of({ kind: 'error', message: "Couldn't get data" } as StoreState)
    ),
    share()
  );
  const loading$ = textSearchSubject.pipe(
    distinctUntilChanged(),
    map(() => ({ kind: 'loading' } as StoreState))
  );

  const { subscribe } = readable<StoreState>({ kind: 'initial' }, (set) => {
    const sub = merge(searchResult$, loading$).subscribe((state) => set(state));

    return () => sub.unsubscribe();
  });

  const textSearchNext = (s: string) => textSearchSubject.next(s);

  return {
    subscribe,
    textSearchNext,
  };
};
