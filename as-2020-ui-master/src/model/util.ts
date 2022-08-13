import { Observable } from 'rxjs';

export const toObservable = <T>(promise: Promise<T>): Observable<T> => {
  return new Observable<T>(subscriber => {
    promise
      .then(val => subscriber.next(val))
      .catch(err => subscriber.error(err));
  });
};
