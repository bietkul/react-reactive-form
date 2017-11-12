
function isEmptyInputValue(value) {
  return value == null || value.length === 0;
}

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Validators {
  /**
   * Validator that requires controls to have a value greater than a number.
   */
  static min(min) {
    return (value) => {
      if (isEmptyInputValue(value) || isEmptyInputValue(min)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue < min ? { min: { min, actual: parsedValue } } : null;
    };
  }

  // /**
  //  * Validator that requires controls to have a value less than a number.
  //  */
  static max(max) {
    return (value) => {
      if (isEmptyInputValue(value) || isEmptyInputValue(max)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > max ? { max: { max, actual: parsedValue } } : null;
    };
  }

  /**
   * Validator that requires controls to have a non-empty value.
   */
  static required(value) {
    return isEmptyInputValue(value) ? { required: true } : null;
  }

  /**
   * Validator that requires control value to be true.
   */
  static requiredTrue(value) {
    return value === true ? null : { required: true };
  }

  /**
   * Validator that performs email validation.
   */
  static email(value) {
    return EMAIL_REGEXP.test(value) ? null : { email: true };
  }

  /**
   * Validator that requires controls to have a value of a minimum length.
   */
  static minLength(minLength) {
    return (value) => {
      if (isEmptyInputValue(value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const length = value ? value.length : 0;
      return length < minLength ?
          { minLength: { requiredLength: minLength, actualLength: length } } : null;
    };
  }

  /**
   * Validator that requires controls to have a value of a maximum length.
   */
  static maxLength(maxLength) {
    return (value) => {
      const length = value ? value.length : 0;
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
    return (value) => {
      if (isEmptyInputValue(value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      return regex.test(value) ? null : { pattern: { requiredPattern: regexStr, actualValue: value } };
    };
  }
}
