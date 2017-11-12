import { Subject } from 'rxjs';
/**
 * Indicates that a FormControl is valid, i.e. that no errors exist in the input value.
 */
export const VALID = 'VALID';

/**
 * Indicates that a FormControl is invalid, i.e. that an error exists in the input value.
 */
export const INVALID = 'INVALID';

/**
 * Indicates that a FormControl is pending, i.e. that async validation is occurring and
 * errors are not yet available for the input value.
 */
export const PENDING = 'PENDING';

/**
 * Indicates that a FormControl is disabled, i.e. that the control is exempt from ancestor
 * calculations of validity or value.
 */
export const DISABLED = 'DISABLED';

export default class FormControl {
  // asyncValidator;
  // controls;
  // dirty;
  // disabled;
  // enabled;
  // errors;
  // invalid;
  // parent;
  // pending;
  // pristine;
  // root;
  // status;
  // statusChanges;
  // touched;
  // unctouched;
  // valid;
  // validator;
  // value;
  // valueChanges;
  // _value; {name: 'wdwoj', nkwns: 'nkwdw', widhiwhd: 'nwkdniwhd'}
  // _errors: null,
  _value;
  onChangeText;
  errors;
  invalid;
  pristine;
  status;
  touched;
  valid;
  validator;
  valueChanges = new Subject();
  statusChanges = new Subject();
  updateDOM = new Subject();

  constructor(name, value, extras) {
    const validators = extras ? extras.validators || [] : [];
    const disabled = extras ? extras.disabled || false : false;
    this.disabled = disabled || false;
    this.name = name;
    this.validator = validators;
    this.errors = null;
    this.pristine = true;
    this.touched = false;
    this._value = value || null;

    // Calculates & sets the status
    this.status = this.calculateStatus();

    // Auto things for React Native TextInput
    this.onChangeText = (fieldValue) => {
      this.value = fieldValue;
    };
    this.onBlur = () => {
      if (!this.touched) {
        this.markAsTouched();
      }
    };
    this.onChangeValue = (fieldValue) => {
      this.value = fieldValue;
    };
    Object.defineProperty(this, 'value', {
      enumerable: true,
      get: () => this._value,
      set: (updateBy: any) => {
        this._value = updateBy;
        // this.valueChanges.next(this._value);
        this.updateValidityAndStatus();
        // this.parent.runValidators();
        // this.foo('dqiudguiq');
      },
    });
  }
  /**
   * A control is valid if it's status is `VALID`
   */
  get valid() {
    return this.status === VALID;
  }
  /**
   * A control is invalid if it's status is `INVALID`
   */
  get invalid() {
    return this.status === INVALID;
  }
  /**
   * A control is pending if it's status is `PENDING`
   */
  get pending() {
    return this.status === PENDING;
  }
  /**
   * A control is disabled if it's status is `DISABLED`
   */
  get disabled() {
    return this.status === DISABLED;
  }
  /**
   * A control is enabled if it's status is not `DISABLED`
   */
  get enabled() {
    return this.status !== DISABLED;
  }

  // Getter Setter for enabling & disabling the input
  // NEED TO SET IT
  set enabled(value) {
    this.disabled = !value;
  }
  /**
   * Disabling a controls means it'll be exempted from all validations
     & will not participate in the aggregate value of the form model
  */
  set disabled(value) {
    if (value) {
      // Set status to disabled
      this.status = DISABLED;
      this.errors = null;
      this.value = null;
    } else {
      // Check for validity & update the status.
      this.status = VALID;
    }
    this.updateValidityAndStatus();
  }
  // Getter Setter for value of input
  // get value() {
  //   return this._value;
  // }
  // set value(value: any) {
  //   this._value = value;
  //   this.valueChanges.next(this._value);
  //   // this.foo('dqiudguiq');
  // }
  // Getter Setter for status
  get status() {
    return this._status;
  }
  set status(value: any) {
    this._status = value;
    // this.statusChanges.next(this._status);
  }
  get untouched() {
    return !this.touched;
  }
  calculateStatus() {
    console.log("calculateStatus");
    // A VALID status means that the control is enabled & has no errors.
    if (this.enabled && !this.errors) {
      return VALID;
    } else if (this.errors) {
      return INVALID;
    }
    return DISABLED;
  }
  /**
   * Runs the validators for a particular control
   * @return {Object} errors
   */
  runValidator() {
    console.log('runValidator');
    const errors = {};
    if (this.validator) {
      this.validator.forEach((validator) => {
        const error = validator(this.value);
        if (error) {
          const errorKey = Object.keys(error)[0];
          errors[errorKey] = error[errorKey];
        }
      });
    }
    // console.log("VALIDATORS CALLED", errors);
    return errors && Object.keys(errors).length !== 0 ? errors : null;
  }
  setInitialStatus() {
    console.log('setInitialStatus');
    if (this.disabled) {
      this.status = DISABLED;
    } else {
      this.status = VALID;
    }
  }
 /**
 * Updates Validity & Status of the control & parent
 * @param {Boolean} onlySelf // If true, then it'll not update the parent
 * @param {Boolean} emitEvent // If false, then it'll not emit status & value changes events
 */
  updateValidityAndStatus(onlySelf, emitEvent) {
    console.log("updateValidityAndStatus");
    this.setInitialStatus();
    if (this.enabled) {
      this.errors = this.runValidator();
      this.status = this.calculateStatus();
    }
    if (emitEvent !== false) {
      this.valueChanges.next(this._value);
      this.statusChanges.next(this._status);
      this.updateDOM.next();
    }
    if (this.parent && !onlySelf) {
      // Will look on to it
      // this.parent.updateValueAndValidity(onlySelf, emitEvent);
    }
  }

//   updateValueAndValidity(opts: {
//     onlySelf ? : boolean,
//     emitEvent ? : boolean
//   } = {}): void {
//     this._setInitialStatus();
//     this._updateValue();

//     if (this.enabled) {
//       this._cancelExistingSubscription();
//       this.errors = this._runValidator();
//       this.status = this._calculateStatus();

//       if (this.status === VALID || this.status === PENDING) {
//         this._runAsyncValidator(opts.emitEvent);
//       }
//     }

//     if (opts.emitEvent !== false) {
//       this.valueChanges.next(this._value);
//       this.statusChanges.next(this.status);
//     }

//     if (this._parent && !opts.onlySelf) {
//       this._parent.updateValueAndValidity(opts);
//     }
  //  }
/**
 * Checks the presence of a particular error
 * @param {String} errorType
 * @return {Boolean|Number} hasError
 */
  hasError(errorType) {
    console.log("hasError");
    return this.errors ? this.errors[errorType] : false;
  }
  markAsTouched() {
    this.touched = true;
    this.updateDOM.next();
  }
}
