import { map } from 'rxjs/operator/map';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AbstractControl } from './model';
import { toObservable } from './utils';

function isEmptyInputValue(value) {
  return value == null || value.length === 0;
}
function isPresent(o: any): boolean {
  return o != null;
}
function _mergeErrors(arrayOfErrors) {
  const res: {[key: string]: any} =
      arrayOfErrors.reduce((res, errors) => {
        return errors != null ? { ...res, ...errors } : res;
      }, {});
  return Object.keys(res).length === 0 ? null : res;
}
function _executeValidators(control: AbstractControl, validators: Function): any[] {
  return validators.map(v => v(control));
}
function _executeAsyncValidators(control: AbstractControl, validators: Function[]): any[] {
  return validators.map(v => v(control));
}

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Validators {
  /**
   * Validator that requires controls to have a value greater than a number.
   */
  static min(min) {
    return (control) => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const parsedValue = parseFloat(control.value);
      return !isNaN(parsedValue) && parsedValue < min ?
      { min: { min, actual: parsedValue } } : null;
    };
  }

  // /**
  //  * Validator that requires controls to have a value less than a number.
  //  */
  static max(max) {
    return (control) => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const parsedValue = parseFloat(control.value);
      return !isNaN(parsedValue) && parsedValue > max ?
      { max: { max, actual: parsedValue } } : null;
    };
  }

  /**
   * Validator that requires controls to have a non-empty value.
   */
  static required(control) {
    return isEmptyInputValue(control.value) ? { required: true } : null;
  }

  /**
   * Validator that requires control value to be true.
   */
  static requiredTrue(control) {
    return control.value === true ? null : { required: true };
  }

  /**
   * Validator that performs email validation.
   */
  static email(control) {
    return EMAIL_REGEXP.test(control.value) ? null : { email: true };
  }

  /**
   * Validator that requires controls to have a value of a minimum length.
   */
  static minLength(minLength) {
    return (control) => {
      if (isEmptyInputValue(control.value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const length = control.value ? control.value.length : 0;
      return length < minLength ?
          { minLength: { requiredLength: minLength, actualLength: length } } : null;
    };
  }

  /**
   * Validator that requires controls to have a value of a maximum length.
   */
  static maxLength(maxLength) {
    return (control) => {
      const length = control.value ? control.value.length : 0;
      return length > maxLength ?
          { maxLength: { requiredLength: maxLength, actualLength: length } } : null;
    };
  }
  /**
   * Validator that requires a control to match a regex to its value.
   */
  static pattern(pattern) {
    if (!pattern) return null;
    let regex;
    let regexStr;
    if (typeof pattern === 'string') {
      regexStr = `^${pattern}$`;
      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }
    return (control) => {
      if (isEmptyInputValue(control.value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      return regex.test(control.value) ? null :
      { pattern: { requiredPattern: regexStr, actualValue: control.value } };
    };
  }
  /**
   * Compose multiple validators into a single function that returns the union
   * of the individual error maps.
   */
  static compose(validators: (Function|null|undefined)[]|null): Function|null {
    if (!validators) return null;
    const presentValidators: Function[] = validators.filter(isPresent);
    if (presentValidators.length === 0) return null;

    return (control: AbstractControl) =>
      _mergeErrors(_executeValidators(control, presentValidators));
  }

  static composeAsync(validators: (Function|null)[]): Function|null {
    if (!validators) return null;
    const presentValidators: Function[] = validators.filter(isPresent);
    if (presentValidators.length === 0) return null;

    return (control: AbstractControl) => {
      const observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
      return map.call(forkJoin(observables), _mergeErrors);
    };
  }
}
