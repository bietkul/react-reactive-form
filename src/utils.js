import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';

export function isPromise(obj: any) {
    // allow any Promise/A+ compliant thenable.
    // It's up to the caller to ensure that obj.then conforms to the spec
  return !!obj && typeof obj.then === 'function';
}
export function isObservable(obj: any | Observable<any>) {
    // TODO use Symbol.observable when https://github.com/ReactiveX/rxjs/issues/2415 will be resolved
  return !!obj && typeof obj.subscribe === 'function';
}

export function toObservable(r: any): Observable<any> {
  const obs = isPromise(r) ? fromPromise(r) : r;
  if (!(isObservable(obs))) {
    throw new Error('Expected validator to return Promise or Observable.');
  }
  return obs;
}
export const isReactNative = () => (
  typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.product &&
  window.navigator.product === 'ReactNative'
);
export const isEvent = (candidate: any) =>
!!(candidate && candidate.stopPropagation && candidate.preventDefault);