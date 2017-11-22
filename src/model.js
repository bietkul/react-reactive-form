import { Subject, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { toObservable, isEvent } from './utils';
import Validators from './validators';

// Can set different config for both react & react native
// Can Also set Config For A particular FormControl, FormGroup & FormArray

// React Native
// const Config = {
//   onChange: 'onChangeText',
//   enabled: 'editable',
//   onBlur: 'onblur',
// };
// React
const Config = {
  onChange: 'onChange',
  enabled: 'enabled',
  onBlur: 'onBlur',
};

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


function _find(control: AbstractControl, path: Array<string|number>| string, delimiter: string) {
  if (path == null) return null;
  if (!(path instanceof Array)) {
    path = path.split(delimiter);
  }
  if (path instanceof Array && (path.length === 0)) return null;
  return path.reduce((v: AbstractControl, name) => {
    if (v instanceof FormGroup) {
      return v.controls[name] || null;
    }
    if (v instanceof FormArray) {
      return v.at(name) || null;
    }
    return null;
  }, control);
}
function isOptionsObj(validatorOrOpts): boolean {
  return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
    typeof validatorOrOpts === 'object';
}
function normalizeValidator(validator: Function): Function {
  if (validator.validate) {
    return (c: AbstractControl) => validator.validate(c);
  }
  return validator;
}
function normalizeAsyncValidator(validator) {
  if (validator.validate) {
    return (c: AbstractControl) => validator.validate(c);
  }
  return validator;
}
function composeValidators(validators: Array<Function>): Function|null {
  return validators != null ? Validators.compose(validators.map(normalizeValidator)) : null;
}
function composeAsyncValidators(validators: Array<Function>) {
  return validators != null ? Validators.composeAsync(validators.map(normalizeAsyncValidator)) :
                          null;
}
function coerceToValidator(validatorOrOpts) {
  const validator =
    (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators :
                                     validatorOrOpts);
  return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
function coerceToAsyncValidator(
  asyncValidator?: Function, validatorOrOpts) {
  const origAsyncValidator =
    (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators :
                                     asyncValidator);

  return Array.isArray(origAsyncValidator) ? composeAsyncValidators(origAsyncValidator) :
                                           origAsyncValidator || null;
}
export class FormArray {}
export class AbstractControl {
  constructor(validator, asyncValidator) {
    this.validator = validator;
    this.asyncValidator = asyncValidator;
    this.touched = false;
    /**
   * A control is `pristine` if the user has not yet changed
   * the value in the UI.
   *
   * Note that programmatic changes to a control's value will
   * *not* mark it dirty.
   */
    this.pristine = true;
  }
  /**
   * Returns the update strategy of the `AbstractControl` (i.e.
   * the event on which the control will update itself).
   * Possible values: `'change'` (default) | `'blur'` | `'submit'`
   */
  get updateOn() {
    return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
  }
  /**
   * A control is `dirty` if the user has changed the value
   * in the UI.
   *
   * Note that programmatic changes to a control's value will
   * *not* mark it dirty.
   */
  get dirty(): boolean { return !this.pristine; }
  /**
   * A control is `valid` when its `status === VALID`.
   *
   * In order to have this status, the control must have passed all its
   * validation checks.
   */
  get valid(): boolean { return this.status === VALID; }
    /**
     * A control is `invalid` when its `status === INVALID`.
     *
     * In order to have this status, the control must have failed
     * at least one of its validation checks.
     */
  get invalid(): boolean { return this.status === INVALID; }
   /**
   * The parent control.
   */
  get parent(): FormGroup|FormArray { return this._parent; }
  /**
   * A control is `enabled` as long as its `status !== DISABLED`.
   *
   * In other words, it has a status of `VALID`, `INVALID`, or
   * `PENDING`.
   */
  get [Config.enabled](): boolean { return this.status !== DISABLED; }
   /**
   * A control is disabled if it's status is `DISABLED`
   */
  get disabled() {
    return this.status === DISABLED;
  }
  /**
   * A control is `untouched` if the user has not yet triggered
   * a `blur` event on it.
   */
  get untouched(): boolean { return !this.touched; }
  get root(): AbstractControl {
    let x: AbstractControl = this;

    while (x._parent) {
      x = x._parent;
    }

    return x;
  }

  _forEachChild(cb: Function): void {}
  setInitialStatus() {
    // console.log('setInitialStatus');
    if (this.disabled) {
      this.status = DISABLED;
    } else {
      this.status = VALID;
    }
  }
  _onDisabledChange: Function[] = [];
  /**
   * Disables the control. This means the control will be exempt from validation checks and
   * excluded from the aggregate value of any parent. Its status is `DISABLED`.
   *
   * If the control has children, all children will be disabled to maintain the model.
   */
  disable(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this.status = DISABLED;
    this.errors = null;
    this._forEachChild((control: AbstractControl) => { control.disable({ onlySelf: true }); });
    this._updateValue();

    if (opts.emitEvent !== false) {
      this.valueChanges.next(this.value);
      this.statusChanges.next(this.status);
    }

    this._updateAncestors(!!opts.onlySelf);
    this._onDisabledChange.forEach(changeFn => changeFn(true));
  }
  /**
   * Enables the control. This means the control will be included in validation checks and
   * the aggregate value of its parent. Its status is re-calculated based on its value and
   * its validators.
   *
   * If the control has children, all children will be enabled.
   */
  enable(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this.status = VALID;
    this._forEachChild((control: AbstractControl) => { control.enable({ onlySelf: true }); });
    this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });

    this._updateAncestors(!!opts.onlySelf);
    this._onDisabledChange.forEach(changeFn => changeFn(false));
  }
  /**
   * Sets the synchronous validators that are active on this control.  Calling
   * this will overwrite any existing sync validators.
   */
  setValidators(newValidator): void {
    this.validator = coerceToValidator(newValidator);
  }
  /**
   * Empties out the sync validator list.
   */
  clearValidators(): void { this.validator = null; }

  _updateAncestors(onlySelf: boolean) {
    if (this._parent && !onlySelf) {
      this._parent.updateValueAndValidity();
      this._parent._updatePristine();
      this._parent._updateTouched();
    }
  }
  _anyControlsHaveStatus(status: string): boolean {
    return this._anyControls((control: AbstractControl) => control.status === status);
  }
  _calculateStatus(): string {
    if (this._allControlsDisabled()) return DISABLED;
    if (this.errors) return INVALID;
    if (this._anyControlsHaveStatus(PENDING)) return PENDING;
    if (this._anyControlsHaveStatus(INVALID)) return INVALID;
    return VALID;
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null;
  }
  _runAsyncValidator(emitEvent?: boolean): void {
    if (this.asyncValidator) {
      this.status = PENDING;
      const obs = toObservable(this.asyncValidator(this));
      this._asyncValidationSubscription =
        obs.subscribe(errors => this.setErrors(errors, { emitEvent }));
    }
  }
  _updatePristine(opts: {onlySelf?: boolean} = {}): void {
    this.pristine = !this._anyControlsDirty();

    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts);
    }
  }

  _updateTouched(opts: {onlySelf?: boolean} = {}): void {
    this.touched = this._anyControlsTouched();

    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts);
    }
  }
  _anyControlsDirty(): boolean {
    return this._anyControls((control: AbstractControl) => control.dirty);
  }
  _anyControlsTouched(): boolean {
    return this._anyControls((control: AbstractControl) => control.touched);
  }
  /**
   * Sets errors on a form control.
   *
   * This is used when validations are run manually by the user, rather than automatically.
   *
   * Calling `setErrors` will also update the validity of the parent control.
   *
   * ### Example
   *
   * ```
   * const login = new FormControl("someLogin");
   * login.setErrors({
   *   "notUnique": true
   * });
   *
   * expect(login.valid).toEqual(false);
   * expect(login.errors).toEqual({"notUnique": true});
   *
   * login.setValue("someOtherLogin");
   *
   * expect(login.valid).toEqual(true);
   * ```
   */
  setErrors(errors, opts: {emitEvent?: boolean} = {}): void {
    this.errors = errors;
    this._updateControlsErrors(opts.emitEvent !== false);
  }
  _updateControlsErrors(emitEvent: boolean): void {
    this.status = this._calculateStatus();

    if (emitEvent) {
      this.statusChanges.next();
    }

    if (this._parent) {
      this._parent._updateControlsErrors(emitEvent);
    }
  }
  // Abstarct Methods
  _updateValue() {}
  _allControlsDisabled() {}
  _anyControls() {}
  reset(value?: any, options?: Object): void {};
  /**
   * Resets the form control. This means by default:
   *
   * * it is marked as `pristine`
   * * it is marked as `untouched`
   * * value is set to null
   *
   * You can also reset to a specific form state by passing through a standalone
   * value or a form state object that contains both a value and a disabled state
   * (these are the only two properties that cannot be calculated).
   *
   * Ex:
   *
   * ```ts
   * this.control.reset('Nancy');
   *
   * console.log(this.control.value);  // 'Nancy'
   * ```
   *
   * OR
   *
   * ```
   * this.control.reset({value: 'Nancy', disabled: true});
   *
   * console.log(this.control.value);  // 'Nancy'
   * console.log(this.control.status);  // 'DISABLED'
   * ```
   */
  /**
   * Marks the control as `touched`.
   *
   * This will also mark all direct ancestors as `touched` to maintain
   * the model.
   */
  markAsTouched(opts: {onlySelf?: boolean} = {}): void {
    this.touched = true;

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsTouched(opts);
    }
  }
    /**
   * Marks the control as `pristine`.
   *
   * If the control has any children, it will also mark all children as `pristine`
   * to maintain the model, and re-calculate the `pristine` status of all parent
   * controls.
   */
  markAsPristine(opts: {onlySelf?: boolean} = {}): void {
    this.pristine = true;
    this._pendingDirty = false;

    this._forEachChild((control: AbstractControl) => { control.markAsPristine({onlySelf: true}); });

    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts);
    }
  }
   /**
   * Marks the control as `untouched`.
   *
   * If the control has any children, it will also mark all children as `untouched`
   * to maintain the model, and re-calculate the `touched` status of all parent
   * controls.
   */
  markAsUntouched(opts: {onlySelf?: boolean} = {}): void {
    this.touched = false;
    this._pendingTouched = false;

    this._forEachChild(
        (control: AbstractControl) => { control.markAsUntouched({ onlySelf: true }); });

    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts);
    }
  }
  /**
   * Marks the control as `dirty`.
   *
   * This will also mark all direct ancestors as `dirty` to maintain
   * the model.
   */
  markAsDirty(opts: {onlySelf?: boolean} = {}): void {
    this.pristine = false;

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsDirty(opts);
    }
  }

  /**
  * Updates Validity & Status of the control & parent
  * @param {Object} options
  * Contains two entities
  * onlySelf : If true, then it'll not update the parent
  * emitEvent : If false, then it'll not emit status & value changes events
  */
  updateValueAndValidity(options = {}) {
    this.setInitialStatus();
    this._updateValue();
    if (this.enabled) {
      this.errors = this._runValidator();
      this.status = this._calculateStatus();
      if (this.status === VALID || this.status === PENDING) {
        this._runAsyncValidator(options.emitEvent);
      }
    }
    if (options.emitEvent !== false) {
      this.valueChanges.next(this.value);
      this.statusChanges.next(this.status);
    }
    if (this.parent && !options.onlySelf) {
      // Will look on to it
      this.parent.updateValueAndValidity(options.onlySelf, options.emitEvent);
    }
    if (this.updateDOM) {
      this.updateDOM.next();
    }
  }
  setValue() {}
  /**
   * Retrieves a child control given the control's name or path.
   *
   * Paths can be passed in as an array or a string delimited by a dot.
   *
   * To get a control nested within a `person` sub-group:
   *
   * * `this.form.get('person.name');`
   *
   * -OR-
   *
   * * `this.form.get(['person', 'name']);`
   */
  get(path: Array<string|number>|string): AbstractControl|null { return _find(this, path, '.'); }
  // /**
  // * Checks the presence of a particular error
  // * @param {String} errorType
  // * @return {Boolean|Number} hasError
  // */
  // hasError(errorType) {
  //   // console.log("hasError");
  //   return this.errors ? this.errors[errorType] : false;
  // }

  /**
   * Returns error data if the control with the given path has the error specified. Otherwise
   * returns null or undefined.
   *
   * If no path is given, it checks for the error on the present control.
   */
  getError(errorCode: string, path?: string[]): any {
    const control = path ? this.get(path) : this;
    return control && control.errors ? control.errors[errorCode] : null;
  }
  /**
   * Returns true if the control with the given path has the error specified. Otherwise
   * returns false.
   *
   * If no path is given, it checks for the error on the present control.
   */
  hasError = (errorCode: string, path?: string[]): boolean => { return !!this.getError(errorCode, path); }
  _initObservables() {
    this.valueChanges = new Subject();
    this.statusChanges = new Subject();
  }
  setParent(parent: FormGroup|FormArray): void { this._parent = parent; }
  _registerOnCollectionChange(fn: () => void): void { this._onCollectionChange = fn; }
  _setUpdateStrategy(opts): void {
    if (isOptionsObj(opts) && opts.updateOn != null) {
      this._updateOn = opts.updateOn;
    }
  }
}
export class FormControl extends AbstractControl {
  constructor(formState, validatorOrOpts, asyncValidator) {
    super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator));
    this.formState = formState;
    this.validatorsOrOpts = validatorOrOpts;
    this.asyncValidator = asyncValidator;
    this._applyFormState(formState);
    this._setUpdateStrategy(validatorOrOpts);
    this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this._initObservables();
     // Auto things for React Native TextInput
    this.onChange = (event, value) => {
      console.log('THIS IS EVENT',this,isEvent(event), event.target.value, value);
      this.markAsDirty();
      if(isEvent(event)) {
        this.setValue(event.target.value);
      } else {
        this.setValue(event);
      }
      // this._updateDirty();
    };
    this.onBlur = () => {
      console.log("OB BLUR CALLED =====", this.touched)
      if (!this.touched) {
        this.markAsTouched();
        this._updateTouched();
      }
    };
  }
  _anyControls(condition: Function): boolean { return false; }
  _allControlsDisabled(): boolean { return this.disabled; }
  setValue(value: any, options: {
    onlySelf?: boolean,
    emitEvent?: boolean,
  } = {}): void {
    this.value = this._pendingValue = value;
    this.updateValueAndValidity(options);
  }
  _isBoxedValue(formState: any): boolean {
    return typeof formState === 'object' && formState !== null &&
        Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
  }
  _applyFormState(formState: any) {
    if (this._isBoxedValue(formState)) {
      this.value = this._pendingValue = formState.value;
      if (formState.disabled) {
        this.disable({ onlySelf: true, emitEvent: false });
      } else {
        this.enable({ onlySelf: true, emitEvent: false });
      }
    } else {
      this.value = this._pendingValue = formState;
    }
  }
  reset(formState: any = null, options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._applyFormState(formState);
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.setValue(this.value, options);
    this._pendingChange = false;
  }
}
export class FormGroup extends AbstractControl {
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator));
    this.controls = controls;
    this.validatorOrOpts = validatorOrOpts;
    this.asyncValidator = asyncValidator;
    this.updateDOM = new Subject();
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }
  _forEachChild(callback: (v: any, k: string) => void): void {
    Object.keys(this.controls).forEach(k => callback(this.controls[k], k));
  }
  _onCollectionChange() {
    // this.updateValueAndValidity();
    this._parent.updateDOM.next();
  }
  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * It will return false for disabled controls. If you'd like to check for existence in the group
   * only, use {@link AbstractControl#get get} instead.
   */
  contains(controlName: string): boolean {
    // return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    return Object.prototype.hasOwnProperty.call(this.controls, 'controlName') && this.controls[controlName].enabled;
  }
  _anyControls(condition: Function): boolean {
    let res = false;
    this._forEachChild((control: AbstractControl, name: string) => {
      res = res || (this.contains(name) && condition(control));
    });
    return res;
  }
  _updateValue(): void {
    this.value = this._reduceValue();
  }
  // setValue(value: {[key: string]: any}, options: {onlySelf?: boolean, emitEvent?: boolean} = {}):
  // void {
  //   this._checkAllValuesPresent(value);
  //   Object.keys(value).forEach((name) => {
  //     this._throwIfControlMissing(name);
  //     this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
  //   });
  //   this.updateValueAndValidity(options);
  // }
  _reduceValue() {
    return this._reduceChildren(
        {}, (acc: {[k: string]: AbstractControl}, control: AbstractControl, name: string) => {
          if (control.enabled || this.disabled) {
            acc[name] = control.value;
          }
          return acc;
        });
  }
  _reduceChildren(initValue: any, fn: Function) {
    let res = initValue;
    this._forEachChild(
        (control: AbstractControl, name: string) => { res = fn(res, control, name); });
    return res;
  }
  _setUpControls(): void {
    this._forEachChild((control: AbstractControl) => {
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
    });
  }
  _allControlsDisabled(): boolean {
    for (const controlName of Object.keys(this.controls)) {
      if (this.controls[controlName].enabled) {
        return false;
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled;
  }
  reset(value: any = {}, options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._forEachChild((control: AbstractControl, name: string) => {
      control.reset(value[name], {onlySelf: true, emitEvent: options.emitEvent});
    });
    this.updateValueAndValidity(options);
    this._updatePristine(options);
    this._updateTouched(options);
  }
}
