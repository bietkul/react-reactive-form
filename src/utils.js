import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';

export function isPromise(obj) {
  return !!obj && typeof obj.then === 'function';
}
/**
* Checks if an object is Observable
* @param {Observable} obj
* @returns {Observable}
*/
export function isObservable(obj) {
  return !!obj && typeof obj.subscribe === 'function';
}
/**
* Converts an object into Observable
* @param {any} r
* @returns {Observable}
*/
export function toObservable(r) {
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
export const isEvent = (candidate) =>
!!(candidate && candidate.stopPropagation && candidate.preventDefault);