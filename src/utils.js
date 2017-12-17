import Observable from "./observable";

/** Converts a promise into Observable
* @param {Promise} r
* @param {(value: any) => any} cb
* @returns {Observable}
*/
export function fromPromise(r, cb) {
  const observable = new Observable();

  r.then((value) => {
    const mappedValue = (value) =>  cb ? cb(value): value;
    observable.next(mappedValue(value));
  },
  (error) => {
    observable.next(error);
  }).then(null, error => {throw(error);});
  return observable;
}
/**
 * Checks if an object is a Promise
 * @param {Observable} obj
 * @returns {boolean}
 */
export function isPromise(obj) {
  return !!obj && typeof obj.then === 'function';
}
/**
 * Checks if an object is Observable
 * @param {Observable} obj
 * @returns {boolean}
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