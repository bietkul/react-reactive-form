import { toObservable, isEvent, getHandler, isReactNative } from './utils'
import Subject from './observable'
import Validators from './validators'

export const FormHooks = 'change' | 'blur' | 'submit'

/**
 * Indicates that a FormControl is valid, i.e. that no errors exist in the input value.
 */
export const VALID = 'VALID'

/**
 * Indicates that a FormControl is invalid, i.e. that an error exists in the input value.
 */
export const INVALID = 'INVALID'

/**
 * Indicates that a FormControl is pending, i.e. that async validation is occurring and
 * errors are not yet available for the input value.
 */
export const PENDING = 'PENDING'

/**
 * Indicates that a FormControl is disabled, i.e. that the control is exempt from ancestor
 * calculations of validity or value.
 */
export const DISABLED = 'DISABLED'

/**
 * Calculates the control's value according to the input type
 * @param {any} event
 * @return {any}
 */
function getControlValue(event) {
  if (isEvent(event)) {
    switch (event.target.type) {
      case 'checkbox':
        return event.target.checked
      case 'select-multiple':
        if (event.target.options) {
          let options = event.target.options
          var value = []
          for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
              value.push(options[i].value)
            }
          }
          return value
        }
        return event.target.value
      default:
        return isReactNative() ? event.nativeEvent.text : event.target.value
    }
  }
  return event
}
/**
 * @param {AbstractControl} control
 * @param {(String|Number)[]|String} path
 * @param {String} delimiter
 */
function _find(control, path, delimiter) {
  if (path == null) return null
  if (!(path instanceof Array)) {
    path = path.split(delimiter)
  }
  if (path instanceof Array && path.length === 0) return null
  return path.reduce((v, name) => {
    if (v instanceof FormGroup) {
      return v.controls[name] || null
    }
    if (v instanceof FormArray) {
      return v.at(name) || null
    }
    return null
  }, control)
}
/**
 * @param {{validators: Function|Function[]|null, asyncValidators: Function|Function[]|null, updateOn: 'change' | 'blur' | 'submit'}} validatorOrOpts
 * @return {Boolean}
 */
function isOptionsObj(validatorOrOpts) {
  return (
    validatorOrOpts != null &&
    !Array.isArray(validatorOrOpts) &&
    typeof validatorOrOpts === 'object'
  )
}
/**
 * @param {Function} validator
 * @return {Function}
 */
function normalizeValidator(validator) {
  if (validator.validate) {
    return c => validator.validate(c)
  }
  return validator
}
/**
 * @param {Function} validator
 * @return {Function}
 */
function normalizeAsyncValidator(validator) {
  if (validator.validate) {
    return c => validator.validate(c)
  }
  return validator
}
/**
 * @param {Function[]} validators
 * @return {Function|null}
 */
function composeValidators(validators) {
  return validators != null
    ? Validators.compose(validators.map(normalizeValidator))
    : null
}
/**
 * @param {Function[]} validators
 * @return {Function|null}
 */
function composeAsyncValidators(validators) {
  return validators != null
    ? Validators.composeAsync(validators.map(normalizeAsyncValidator))
    : null
}

function coerceToValidator(validatorOrOpts) {
  const validator = isOptionsObj(validatorOrOpts)
    ? validatorOrOpts.validators
    : validatorOrOpts
  return Array.isArray(validator)
    ? composeValidators(validator)
    : validator || null
}

function coerceToAsyncValidator(asyncValidator, validatorOrOpts) {
  const origAsyncValidator = isOptionsObj(validatorOrOpts)
    ? validatorOrOpts.asyncValidators
    : asyncValidator
  return Array.isArray(origAsyncValidator)
    ? composeAsyncValidators(origAsyncValidator)
    : origAsyncValidator || null
}
/**
 * This is the base class for `FormControl`, `FormGroup`, and
 * `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 */
export class AbstractControl {
  /**
   * @param {Function|null} validator
   * @param {Function|null} asyncValidator
   */

  constructor(validator, asyncValidator) {
    this.validator = validator
    this.asyncValidator = asyncValidator
    /**
     * A control is marked `touched` once the user has triggered
     * a `blur` event on it.
     */
    this.touched = false
    this.submitted = false
    /**
     * A control is `pristine` if the user has not yet changed
     * the value in the UI.
     *
     * Note that programmatic changes to a control's value will
     * *not* mark it dirty.
     */
    this.pristine = true
    this.meta = {}
    this._pendingChange = this.updateOn !== 'change'
    this._pendingDirty = false
    this._pendingTouched = false
    this._onDisabledChange = []
    this.hasError = this.hasError.bind(this)
    this.getError = this.getError.bind(this)
    this.reset = this.reset.bind(this)
    this.get = this.get.bind(this)
    this.patchValue = this.patchValue.bind(this)
    this.setValue = this.setValue.bind(this)
  }
  /**
   * Returns the update strategy of the `AbstractControl` (i.e.
   * the event on which the control will update itself).
   * Possible values: `'change'` (default) | `'blur'` | `'submit'`
   */
  get updateOn() {
    return this._updateOn
      ? this._updateOn
      : this.parent
        ? this.parent.updateOn
        : 'change'
  }
  /**
   * A control is `dirty` if the user has changed the value
   * in the UI.
   *
   * Note that programmatic changes to a control's value will
   * *not* mark it dirty.
   * @return {Boolean}
   */
  get dirty() {
    return !this.pristine
  }
  /**
   * A control is `valid` when its `status === VALID`.
   *
   * In order to have this status, the control must have passed all its
   * validation checks.
   * @return {Boolean}
   */
  get valid() {
    return this.status === VALID
  }
  /**
   * A control is `invalid` when its `status === INVALID`.
   *
   * In order to have this status, the control must have failed
   * at least one of its validation checks.
   * @return {Boolean}
   */
  get invalid() {
    return this.status === INVALID
  }
  /**
   * A control is `pending` when its `status === PENDING`.
   *
   * In order to have this status, the control must be in the
   * middle of conducting a validation check.
   */
  get pending() {
    return this.status === PENDING
  }
  /**
   * The parent control.
   * * @return {FormGroup|FormArray}
   */
  get parent() {
    return this._parent
  }
  /**
   * A control is `untouched` if the user has not yet triggered
   * a `blur` event on it.
   * @return {Boolean}
   */
  get untouched() {
    return !this.touched
  }
  /**
   * A control is `enabled` as long as its `status !== DISABLED`.
   *
   * In other words, it has a status of `VALID`, `INVALID`, or
   * `PENDING`.
   * @return {Boolean}
   */
  get enabled() {
    return this.status !== DISABLED
  }
  /**
   * A control is disabled if it's status is `DISABLED`
   */
  get disabled() {
    return this.status === DISABLED
  }
  /**
   * Retrieves the top-level ancestor of this control.
   * @return {AbstractControl}
   */
  get root() {
    let x = this
    while (x._parent) {
      x = x._parent
    }
    return x
  }
  setInitialStatus() {
    if (this.disabled) {
      this.status = DISABLED
    } else {
      this.status = VALID
    }
  }
  /**
   * Disables the control. This means the control will be exempt from validation checks and
   * excluded from the aggregate value of any parent. Its status is `DISABLED`.
   *
   * If the control has children, all children will be disabled to maintain the model.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  disable(opts = {}) {
    this.status = DISABLED
    this.errors = null
    this._forEachChild(control => {
      control.disable({
        onlySelf: true
      })
    })
    this._updateValue()

    if (opts.emitEvent !== false) {
      this.valueChanges.next(this.value)
      this.statusChanges.next(this.status)
      this.stateChanges.next()
    }

    this._updateAncestors(!!opts.onlySelf)
    this._onDisabledChange.forEach(changeFn => changeFn(true))
  }
  /**
   * Enables the control. This means the control will be included in validation checks and
   * the aggregate value of its parent. Its status is re-calculated based on its value and
   * its validators.
   *
   * If the control has children, all children will be enabled.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  enable(opts = {}) {
    this.status = VALID
    this._forEachChild(control => {
      control.enable({
        onlySelf: true
      })
    })
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: opts.emitEvent
    })
    this._updateAncestors(!!opts.onlySelf)
    this._onDisabledChange.forEach(changeFn => changeFn(false))
  }
  /**
   * Re-calculates the value and validation status of the control.
   *
   * By default, it will also update the value and validity of its ancestors.
   * @param {{onlySelf: Boolean, emitEvent: Booelan}} options
   */
  updateValueAndValidity(options = {}) {
    this.setInitialStatus()
    this._updateValue()
    const shouldValidate =
      this.enabled && (this.updateOn !== 'submit' || this.submitted)
    if (shouldValidate) {
      this._cancelExistingSubscription()
      this.errors = this._runValidator()
      this.status = this._calculateStatus()
      if (this.status === VALID || this.status === PENDING) {
        this._runAsyncValidator(true)
      }
    }
    if (options.emitEvent !== false) {
      this.valueChanges.next(this.value)
      this.statusChanges.next(this.status)
      this.stateChanges.next()
    }
    if (this.parent && !options.onlySelf) {
      this.parent.updateValueAndValidity(options)
    }
  }
  /**
   * Marks the control as `touched`.
   *
   * This will also mark all direct ancestors as `touched` to maintain
   * the model.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  markAsTouched(opts = {}) {
    this.touched = true
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsTouched(opts)
    }
    if (opts.emitEvent) {
      this.stateChanges.next()
    }
  }
  /**
   * Marks the control as `submitted`.
   *
   * If the control has any children, it will also mark all children as `submitted`
   * @param {{emitEvent: Boolean}} opts
   * @return {void}
   */
  markAsSubmitted(opts = {}) {
    this.submitted = true

    this._forEachChild(control => {
      control.markAsSubmitted()
    })

    if (opts.emitEvent !== false) {
      this.stateChanges.next()
    }
  }
  /**
   * Marks the control as `unsubmitted`.
   *
   * If the control has any children, it will also mark all children as `unsubmitted`.
   *
   * @param {{emitEvent: Boolean}} opts
   * @return {void}
   */
  markAsUnsubmitted(opts = {}) {
    this.submitted = false

    this._forEachChild(control => {
      control.markAsUnsubmitted({
        onlySelf: true
      })
    })

    if (opts.emitEvent !== false) {
      this.stateChanges.next()
    }
  }
  /**
   * Marks the control as `pristine`.
   *
   * If the control has any children, it will also mark all children as `pristine`
   * to maintain the model, and re-calculate the `pristine` status of all parent
   * controls.
   * @param {{onlySelf: Boolean}} opts
   * @return {void}
   */
  markAsPristine(opts = {}) {
    this.pristine = true
    this._pendingDirty = false
    this._forEachChild(control => {
      control.markAsPristine({
        onlySelf: true
      })
    })
    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts)
    }
  }
  /**
   * Marks the control as `untouched`.
   *
   * If the control has any children, it will also mark all children as `untouched`
   * to maintain the model, and re-calculate the `touched` status of all parent
   * controls.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  markAsUntouched(opts = {}) {
    this.touched = false
    this._pendingTouched = false
    this._forEachChild(control => {
      control.markAsUntouched({
        onlySelf: true
      })
    })
    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts)
    }
    if (opts.emitEvent) {
      this.stateChanges.next()
    }
  }
  /**
   * Marks the control as `dirty`.
   *
   * This will also mark all direct ancestors as `dirty` to maintain
   * the model.
   * @param {{onlySelf: Boolean}} opts
   * @return {void}
   */
  markAsDirty(opts = {}) {
    this.pristine = false
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsDirty(opts)
    }
  }
  /**
   * Marks the control as `pending`.
   * @param {{onlySelf: Boolean}} opts
   * @return {void}
   */
  markAsPending(opts = {}) {
    this.status = PENDING

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsPending(opts)
    }
  }
  /**
   * Sets the synchronous validators that are active on this control.  Calling
   * this will overwrite any existing sync validators.
   * @param {Function|Function[]|null} newValidator
   * @return {void}
   */
  setValidators(newValidator) {
    this.validator = coerceToValidator(newValidator)
  }
  /**
   * Sets the async validators that are active on this control. Calling this
   * will overwrite any existing async validators.
   */
  setAsyncValidators(newValidator) {
    this.asyncValidator = coerceToAsyncValidator(newValidator)
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
   * ```
   * @param {{onlySelf: boolean}} opts
   * @return {void}
   */
  setErrors(errors, opts = {}) {
    this.errors = errors
    this._updateControlsErrors(opts.emitEvent !== false)
  }
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
   * @param {(String|Number)[]|String} path
   * @return {AbstractControl|null}
   */
  get(path) {
    return _find(this, path, '.')
  }
  /**
   * Returns error data if the control with the given path has the error specified. Otherwise
   * returns null or undefined.
   *
   * If no path is given, it checks for the error on the present control.
   * @param {String} errorCode
   * @param {(String|Number)[]|String} path
   */
  getError(errorCode, path) {
    const control = path ? this.get(path) : this
    return control && control.errors ? control.errors[errorCode] : null
  }
  /**
   * Returns true if the control with the given path has the error specified. Otherwise
   * returns false.
   *
   * If no path is given, it checks for the error on the present control.
   * @param {String} errorCode
   * @param {(String|Number)[]|String} path
   * @return {Booelan}
   */
  hasError(errorCode, path) {
    return !!this.getError(errorCode, path)
  }
  /**
   * Empties out the sync validator list.
   */
  clearValidators() {
    this.validator = null
  }
  /**
   * Empties out the async validator list.
   */
  clearAsyncValidators() {
    this.asyncValidator = null
  }
  /**
   * @param {FormGroup|FormArray} parent
   * @return {Void}
   */
  setParent(parent) {
    this._parent = parent
  }
  /**
   * @param {Boolean} onlySelf
   */
  _updateAncestors(onlySelf) {
    if (this._parent && !onlySelf) {
      this._parent.updateValueAndValidity()
      this._parent._updatePristine()
      this._parent._updateTouched()
    }
  }
  /**
   * @param {String} status
   * @return {Booelan}
   */
  _anyControlsHaveStatus(status) {
    return this._anyControls(control => control.status === status)
  }
  /**
   * @return {String}
   */
  _calculateStatus() {
    if (this._allControlsDisabled()) return DISABLED
    if (this.errors) return INVALID
    if (this._anyControlsHaveStatus(PENDING)) return PENDING
    if (this._anyControlsHaveStatus(INVALID)) return INVALID
    return VALID
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null
  }
  /**
   * @param {Booelan} emitEvent
   * @return {void}
   */
  _runAsyncValidator(emitEvent) {
    if (this.asyncValidator) {
      this.status = PENDING
      const obs = toObservable(this.asyncValidator(this))
      this._asyncValidationSubscription = obs.subscribe(errors =>
        this.setErrors(errors, {
          emitEvent
        })
      )
    }
  }
  _cancelExistingSubscription() {
    if (this._asyncValidationSubscription) {
      this._asyncValidationSubscription.unsubscribe()
    }
  }
  /**
   * @param {{onlySelf: boolean}} opts
   * @return {void}
   */
  _updatePristine(opts = {}) {
    this.pristine = !this._anyControlsDirty()
    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts)
    }
  }
  /**
   * @param {{onlySelf: boolean}} opts
   * @return {void}
   */
  _updateTouched(opts = {}) {
    this.touched = this._anyControlsTouched()
    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts)
    }
  }
  /**
   * @return {Boolean}
   */
  _anyControlsDirty() {
    return this._anyControls(control => control.dirty)
  }
  _anyControlsUnsubmitted() {
    return this._anyControls(control => !control.submitted)
  }
  /**
   * @return {Boolean}
   */
  _anyControlsTouched() {
    return this._anyControls(control => control.touched)
  }
  /**
   * @param {Booelan} emitEvent
   * @return {void}
   */
  _updateControlsErrors(emitEvent) {
    this.status = this._calculateStatus()
    if (emitEvent) {
      this.statusChanges.next()
      this.stateChanges.next()
    }
    if (this._parent) {
      this._parent._updateControlsErrors(emitEvent)
    }
  }
  _initObservables() {
    this.valueChanges = new Subject()
    this.statusChanges = new Subject()
    this.stateChanges = new Subject()
  }
  // Abstarct Methods
  /**
   * @param {Function} cb
   * @return {void}
   */
  _forEachChild(cb) {}
  _updateValue() {}
  _allControlsDisabled() {}
  _anyControls() {}
  reset(value, options) {}
  setValue() {}
  patchValue() {}
  _registerOnCollectionChange(fn) {
    this._onCollectionChange = fn
  }
  /**
   * @param {{validators: Function|Function[]|null, asyncValidators: Function|Function[]|null, updateOn: 'change' | 'blur' | 'submit'}} opts
   * @return {Void}
   */
  _setUpdateStrategy(opts) {
    if (isOptionsObj(opts) && opts.updateOn != null) {
      this._updateOn = opts.updateOn
    }
  }
}
export class FormControl extends AbstractControl {
  constructor(formState, validatorOrOpts, asyncValidator) {
    super(
      coerceToValidator(validatorOrOpts),
      coerceToAsyncValidator(asyncValidator, validatorOrOpts)
    )
    this.formState = formState
    this.validatorsOrOpts = validatorOrOpts
    this._applyFormState(formState)
    this._setUpdateStrategy(validatorOrOpts)
    this._pendingChange = true
    this._pendingDirty = false
    this._pendingTouched = false
    /**
     * A control is `active` when its focused.
     */
    this.active = false
    this.onValueChanges = new Subject()
    this.onBlurChanges = new Subject()
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false
    })
    this._initObservables()
    /**
     * Called whenevers an onChange event triggers.
     * Updates the control value according to the update strategy.
     *
     * @param {any} event
     * @return {void}
     */
    this.onChange = event => {
      const value = getControlValue(event)
      if (this.updateOn !== 'change') {
        this._pendingValue = value
        this._pendingChange = true
        if (!this._pendingDirty) {
          this._pendingDirty = true
        }
        this.stateChanges.next()
      } else {
        if (!this.dirty) {
          this.markAsDirty()
        }
        this.setValue(value)
      }
      this.onValueChanges.next(value)
    }
    /**
     * Called whenevers an onBlur event triggers.
     */

    this.onBlur = () => {
      this.active = false
      if (this.updateOn === 'blur') {
        if (!this.dirty) {
          this.markAsDirty()
        }
        if (!this.touched) {
          this.markAsTouched()
        }
        this.setValue(this._pendingValue)
      } else if (this.updateOn === 'submit') {
        this._pendingTouched = true
        this._pendingDirty = true
      } else {
        const emitChangeToView = !this.touched
        if (!this.dirty) {
          this.markAsDirty()
        }
        if (!this.touched) {
          this.markAsTouched()
        }
        if (emitChangeToView) {
          this.stateChanges.next()
        }
      }
      this.onBlurChanges.next(this._pendingValue)
    }
    /**
     * Called whenevers an onFocus event triggers.
     */
    this.onFocus = () => {
      this.active = true
      this.stateChanges.next()
    }
    /**
     * Returns the required props to bind an input element.
     * @param {string} inputType
     * @param {any} value
     */
    this.handler = (inputType, value) => getHandler(inputType, value, this)
  }
  /**
   * A control is `inactive` when its not focused.
   * @return {Boolean}
   */
  get inactive() {
    return !this.active
  }
  /**
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
   * @return {void}
   */
  setValue(value, options = {}) {
    this.value = this._pendingValue = value
    this.updateValueAndValidity(options)
  }
  /**
   * Patches the value of a control.
   *
   * This function is functionally the same as setValue at this level.
   * It exists for symmetry with patchValue on `FormGroups` and
   * `FormArrays`, where it does behave differently.
   * @param {any} value
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
   * @return {void}
   */
  patchValue(value, options = {}) {
    this.setValue(value, options)
  }

  /**
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
   * @return {void}
   */
  reset(formState = null, options = {}) {
    this._applyFormState(formState)
    this.markAsPristine(options)
    this.markAsUntouched(options)
    this.setValue(this.value, options)
    this._pendingChange = false
  }
  /**
   * @param {Function} condition
   * @return {Boolean}
   */
  _anyControls(condition) {
    return false
  }
  /**
   * @return {Boolean}
   */
  _allControlsDisabled() {
    return this.disabled
  }
  /**
   * @return {Boolean}
   */
  _isBoxedValue(formState) {
    return (
      typeof formState === 'object' &&
      formState !== null &&
      Object.keys(formState).length === 2 &&
      'value' in formState &&
      'disabled' in formState
    )
  }
  _applyFormState(formState) {
    if (this._isBoxedValue(formState)) {
      this.value = this._pendingValue = formState.value
      if (formState.disabled) {
        this.disable({
          onlySelf: true,
          emitEvent: false
        })
      } else {
        this.enable({
          onlySelf: true,
          emitEvent: false
        })
      }
    } else {
      this.value = this._pendingValue = formState
    }
  }
  _syncPendingControls() {
    if (this.updateOn === 'submit') {
      if (this._pendingDirty) this.markAsDirty()
      if (this._pendingTouched) this.markAsTouched()
      if (this._pendingChange) {
        this.setValue(this._pendingValue)
        this._pendingChange = false
        return true
      }
    }
    return false
  }
}
export class FormGroup extends AbstractControl {
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(
      coerceToValidator(validatorOrOpts),
      coerceToAsyncValidator(asyncValidator, validatorOrOpts)
    )
    this.controls = controls
    this.validatorOrOpts = validatorOrOpts
    this._initObservables()
    this._setUpdateStrategy(validatorOrOpts)
    this._setUpControls()
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false
    })
    this.handleSubmit = e => {
      if (e) {
        e.preventDefault()
      }
      if (this._anyControlsUnsubmitted()) {
        this.markAsSubmitted({
          emitEvent: false
        })
      }
      if (!this._syncPendingControls()) {
        this.updateValueAndValidity()
      }
    }
  }
  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * It will return false for disabled controls. If you'd like to check for existence in the group
   * only, use `AbstractControl` get instead.
   * @param {String} controlName
   * @return {Boolean}
   */
  contains(controlName) {
    return (
      this.controls.hasOwnProperty(controlName) &&
      this.controls[controlName].enabled
    )
  }
  /**
   * Registers a control with the group's list of controls.
   *
   * This method does not update the value or validity of the control, so for most cases you'll want
   * to use addControl instead.
   * @param {String} name
   * @param {AbstractControl} control
   * @return {AbstractControl}
   */
  registerControl(name, control) {
    if (this.controls[name]) return this.controls[name]
    this.controls[name] = control
    control.setParent(this)
    control._registerOnCollectionChange(this._onCollectionChange)
    return control
  }

  /**
   * Add a control to this group.
   * @param {String} name
   * @param {AbstractControl} control
   * @return {void}
   */
  addControl(name, control) {
    this.registerControl(name, control)
    this.updateValueAndValidity()
    this._onCollectionChange()
  }

  /**
   * Remove a control from this group.
   * @param {String} name
   * @return {void}
   */
  removeControl(name) {
    if (this.controls[name])
      this.controls[name]._registerOnCollectionChange(() => {})
    delete this.controls[name]
    this.updateValueAndValidity()
    this._onCollectionChange()
  }

  /**
   * Replace an existing control.
   * @param {String} name
   * @param {AbstractControl} control
   * @return {void}
   */
  setControl(name, control) {
    if (this.controls[name])
      this.controls[name]._registerOnCollectionChange(() => {})
    delete this.controls[name]
    if (control) this.registerControl(name, control)
    this.updateValueAndValidity()
    this._onCollectionChange()
  }
  /**
   * Sets the value of the FormGroup. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * This method performs strict checks, so it will throw an error if you try
   * to set the value of a control that doesn't exist or if you exclude the
   * value of a control.
   *
   *  ### Example
   *  form.setValue({first: 'Jon', last: 'Snow'});
   *  console.log(form.value);   // {first: 'Jon', last: 'Snow'}
   * @param {{[key: string]: any}} value
   * @param {{onlySelf: boolean, emitEvent: boolean}} options
   * @return {void}
   */
  setValue(value, options = {}) {
    this._checkAllValuesPresent(value)
    Object.keys(value).forEach(name => {
      this._throwIfControlMissing(name)
      this.controls[name].setValue(value[name], {
        onlySelf: true,
        emitEvent: options.emitEvent
      })
    })
    this.updateValueAndValidity(options)
  }
  /**
   * Resets the `FormGroup`.
   * @param {any} value
   * @param {{onlySelf: boolean, emitEvent: boolean}} options
   * @return {void}
   */
  reset(value = {}, options = {}) {
    this._forEachChild((control, name) => {
      control.reset(value[name], {
        onlySelf: true,
        emitEvent: options.emitEvent
      })
    })
    this.updateValueAndValidity(options)
    this.markAsUnsubmitted()
    this._updatePristine(options)
    this._updateTouched(options)
  }
  /**
   *  Patches the value of the FormGroup. It accepts an object with control
   *  names as keys, and will do its best to match the values to the correct controls
   *  in the group.
   *
   *  It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   *  ### Example
   *  ```
   *  console.log(form.value);   // {first: null, last: null}
   *
   *  form.patchValue({first: 'Jon'});
   *  console.log(form.value);   // {first: 'Jon', last: null}
   *
   *  ```
   * @param {{[key: string]: any}} value
   * @param {{onlySelf: boolean, emitEvent: boolean}} options
   * @return {void}
   */
  patchValue(value, options = {}) {
    Object.keys(value).forEach(name => {
      if (this.controls[name]) {
        this.controls[name].patchValue(value[name], {
          onlySelf: true,
          emitEvent: options.emitEvent
        })
      }
    })
    this.updateValueAndValidity(options)
  }
  /**
   * The aggregate value of the FormGroup, including any disabled controls.
   *
   * If you'd like to include all values regardless of disabled status, use this method.
   * Otherwise, the `value` property is the best way to get the value of the group.
   */
  getRawValue() {
    return this._reduceChildren({}, (acc, control, name) => {
      acc[name] =
        control instanceof FormControl ? control.value : control.getRawValue()
      return acc
    })
  }
  /**
   * @param {{(v: any, k: String) => void}} callback
   * @return {void}
   */
  _forEachChild(callback) {
    Object.keys(this.controls).forEach(k => callback(this.controls[k], k))
  }

  _onCollectionChange() {}
  /**
   * @param {Function} condition
   * @return {Boolean}
   */
  _anyControls(condition) {
    let res = false
    this._forEachChild((control, name) => {
      res = res || (this.contains(name) && condition(control))
    })
    return res
  }
  _updateValue() {
    this.value = this._reduceValue()
  }
  _reduceValue() {
    return this._reduceChildren({}, (acc, control, name) => {
      if (control.enabled || this.disabled) {
        acc[name] = control.value
      }
      return acc
    })
  }
  _reduceErrors() {
    return this._reduceChildren({}, (acc, control, name) => {
      if (control.enabled || this.disabled) {
        acc[name] = control.errors
      }
      return acc
    })
  }
  /**
   * @param {Function} fn
   */
  _reduceChildren(initValue, fn) {
    let res = initValue
    this._forEachChild((control, name) => {
      res = fn(res, control, name)
    })
    return res
  }
  _setUpControls() {
    this._forEachChild(control => {
      control.setParent(this)
      control._registerOnCollectionChange(this._onCollectionChange)
    })
  }
  /**
   * @return {Boolean}
   */
  _allControlsDisabled() {
    for (const controlName of Object.keys(this.controls)) {
      if (this.controls[controlName].enabled) {
        return false
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled
  }
  _checkAllValuesPresent(value) {
    this._forEachChild((control, name) => {
      if (value[name] === undefined) {
        throw new Error(
          `Must supply a value for form control with name: '${name}'.`
        )
      }
    })
  }
  _throwIfControlMissing(name) {
    if (!Object.keys(this.controls).length) {
      throw new Error(`
        There are no form controls registered with this group yet.
      `)
    }
    if (!this.controls[name]) {
      throw new Error(`Cannot find form control with name: ${name}.`)
    }
  }
  _syncPendingControls() {
    let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
      return child._syncPendingControls() ? true : updated
    })
    if (subtreeUpdated) this.updateValueAndValidity()
    return subtreeUpdated
  }
}
export class FormArray extends AbstractControl {
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(
      coerceToValidator(validatorOrOpts),
      coerceToAsyncValidator(asyncValidator, validatorOrOpts)
    )
    this.controls = controls
    this.validatorOrOpts = validatorOrOpts
    this._initObservables()
    this._setUpdateStrategy(validatorOrOpts)
    this._setUpControls()
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false
    })
    this.handleSubmit = e => {
      if (e) {
        e.preventDefault()
      }
      if (this._anyControlsUnsubmitted()) {
        this.markAsSubmitted({
          emitEvent: false
        })
      }
      if (!this._syncPendingControls()) {
        this.updateValueAndValidity()
      }
    }
  }
  /**
   * Get the `AbstractControl` at the given `index` in the array.
   * @param {Number} index
   * @return {AbstractControl}
   */
  at(index) {
    return this.controls[index]
  }

  /**
   * Insert a new `AbstractControl` at the end of the array.
   * @param {AbstractControl} control
   * @return {Void}
   */
  push(control) {
    this.controls.push(control)
    this._registerControl(control)
    this.updateValueAndValidity()
    this._onCollectionChange()
  }

  /**
   * Insert a new `AbstractControl` at the given `index` in the array.
   * @param {Number} index
   * @param {AbstractControl} control
   */
  insert(index, control) {
    this.controls.splice(index, 0, control)
    this._registerControl(control)
    this.updateValueAndValidity()
    this._onCollectionChange()
  }

  /**
   * Remove the control at the given `index` in the array.
   * @param {Number} index
   */
  removeAt(index) {
    if (this.controls[index])
      this.controls[index]._registerOnCollectionChange(() => {})
    this.controls.splice(index, 1)
    this.updateValueAndValidity()
    this._onCollectionChange()
  }

  /**
   * Replace an existing control.
   * @param {Number} index
   * @param {AbstractControl} control
   */
  setControl(index, control) {
    if (this.controls[index])
      this.controls[index]._registerOnCollectionChange(() => {})
    this.controls.splice(index, 1)

    if (control) {
      this.controls.splice(index, 0, control)
      this._registerControl(control)
    }

    this.updateValueAndValidity()
    this._onCollectionChange()
  }

  /**
   * Length of the control array.
   * @return {Number}
   */
  get length() {
    return this.controls.length
  }

  /**
   * Sets the value of the `FormArray`. It accepts an array that matches
   * the structure of the control.
   * @param {any[]} value
   * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
   */
  setValue(value, options = {}) {
    this._checkAllValuesPresent(value)
    value.forEach((newValue, index) => {
      this._throwIfControlMissing(index)
      this.at(index).setValue(newValue, {
        onlySelf: true,
        emitEvent: options.emitEvent
      })
    })
    this.updateValueAndValidity(options)
  }

  /**
   *  Patches the value of the `FormArray`. It accepts an array that matches the
   *  structure of the control, and will do its best to match the values to the correct
   *  controls in the group.
   * @param {any[]} value
   * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
   */
  patchValue(value, options = {}) {
    value.forEach((newValue, index) => {
      if (this.at(index)) {
        this.at(index).patchValue(newValue, {
          onlySelf: true,
          emitEvent: options.emitEvent
        })
      }
    })
    this.updateValueAndValidity(options)
  }

  /**
   * Resets the `FormArray`.
   * @param {any[]} value
   * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
   */
  reset(value = [], options = {}) {
    this._forEachChild((control, index) => {
      control.reset(value[index], {
        onlySelf: true,
        emitEvent: options.emitEvent
      })
    })
    this.updateValueAndValidity(options)
    this.markAsUnsubmitted()
    this._updatePristine(options)
    this._updateTouched(options)
  }

  /**
   * The aggregate value of the array, including any disabled controls.
   *
   * If you'd like to include all values regardless of disabled status, use this method.
   * Otherwise, the `value` property is the best way to get the value of the array.
   * @return {any[]}
   */
  getRawValue() {
    return this.controls.map(control => {
      return control instanceof FormControl
        ? control.value
        : control.getRawValue()
    })
  }

  _syncPendingControls() {
    let subtreeUpdated = this.controls.reduce((updated, child) => {
      return child._syncPendingControls() ? true : updated
    }, false)
    if (subtreeUpdated) this.updateValueAndValidity()
    return subtreeUpdated
  }

  _throwIfControlMissing(index) {
    if (!this.controls.length) {
      throw new Error(`
        There are no form controls registered with this array yet.
      `)
    }
    if (!this.at(index)) {
      throw new Error(`Cannot find form control at index ${index}`)
    }
  }

  _forEachChild(cb) {
    this.controls.forEach((control, index) => {
      cb(control, index)
    })
  }

  _updateValue() {
    this.value = this.controls
      .filter(control => control.enabled || this.disabled)
      .map(control => control.value)
  }

  _anyControls(condition) {
    return this.controls.some(control => control.enabled && condition(control))
  }

  _setUpControls() {
    this._forEachChild(control => this._registerControl(control))
  }

  _checkAllValuesPresent(value) {
    this._forEachChild((control, i) => {
      if (value[i] === undefined) {
        throw new Error(`Must supply a value for form control at index: ${i}.`)
      }
    })
  }

  _allControlsDisabled() {
    for (const control of this.controls) {
      if (control.enabled) return false
    }
    return this.controls.length > 0 || this.disabled
  }

  _registerControl(control) {
    control.setParent(this)
    control._registerOnCollectionChange(this._onCollectionChange)
  }

  _onCollectionChange() {}
}
