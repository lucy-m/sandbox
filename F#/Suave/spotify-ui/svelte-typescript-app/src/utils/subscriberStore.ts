import type { Observable } from 'rxjs';
import { readable } from 'svelte/store';

export type SubscriberState<T> =
  | { kind: 'initial' }
  | { kind: 'error' }
  | { kind: 'data'; data: T };

export const subscriberStore = <T>(source$: Observable<T>) => {
  return readable<SubscriberState<T>>({ kind: 'initial' }, (set) => {
    const sub = source$.subscribe({
      next: (data) => set({ kind: 'data', data }),
      error: (err) => set({ kind: 'error' }),
    });
    return () => sub.unsubscribe();
  });
};
