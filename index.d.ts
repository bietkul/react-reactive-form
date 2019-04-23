import * as React from 'react'

export type ValidationErrors = {
  [key: string]: any
}
export type Status = 'VALID' | 'INVALID' | 'DISABLED' | 'PENDING'
export type InputType = 'checkbox' | 'radio' | 'switch'
export type Handler = {
  value: any
  onChange: (e: any) => void
  onBlur: (e: any) => void
  onFocus: (e: any) => void
  disabled: boolean
  checked?: boolean
  editable?: boolean
  type?: string
}
export interface Observable<T> {
  observers: Array<T>
  subscribe: (fn: Function) => void
  unsubscribe: (fn: Function) => void
}
type Meta = {
  value: any
  touched: boolean
  untouched: boolean
  disabled: boolean
  enabled: boolean
  invalid: boolean
  valid: boolean
  pristine: boolean
  dirty: boolean
  errors: ValidationErrors
  status: Status
  pending: boolean
  _pendingValue: any
  hasError: (errorCode: string, path?: String | Number[] | String) => boolean
  getError: (errorCode: string, path?: String | Number[] | String) => any
  handler: (inputType?: InputType, value?: string) => Handler
}
interface Child {
  [key: string]: Meta
}
export type FormProps = Child & Meta
export type FormHooks = 'change' | 'blur' | 'submit'

export interface AbstractControlOptions {
  validators?: ValidatorFn | ValidatorFn[] | null
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null
  updateOn?: FormHooks
}
export interface ValidatorFn {
  (c: AbstractControl | FormGroup | FormArray): ValidationErrors | null
}
export interface AsyncValidatorFn {
  (c: AbstractControl | FormGroup | FormArray):
    | Promise<ValidationErrors | null>
    | Observable<ValidationErrors | null>
}
declare abstract class AbstractControl {
  constructor(
    validator: ValidatorFn | null,
    asyncValidator: AsyncValidatorFn | null
  )
  /**
   * Emits an event every time the value of the control changes, in
   * the UI or programmatically.
   */
  valueChanges: Observable<any>
  /**
   * Emits an event every time the validation status of the control
   * is re-calculated.
   */
  statusChanges: Observable<any>
  value: any
  status: string
  /**
   * A control is `submitted` if the `handleSubmit` event has been triggered on it.
   */
  submitted: boolean
  /**
   * A control is `valid` when its `status === VALID`.
   *
   * In order to have this status, the control must have passed all its
   * validation checks.
   */
  valid: boolean
  /**
   * A control is `invalid` when its `status === INVALID`.
   *
   * In order to have this status, the control must have failed
   * at least one of its validation checks.
   */
  invalid: boolean
  /**
   * A control is `enabled` as long as its `status !== DISABLED`.
   *
   * In other words, it has a status of `VALID`, `INVALID`, or
   * `PENDING`.
   */
  enabled: boolean
  /**
   * A control is disabled if it's status is `DISABLED`
   */
  disabled: boolean
  /**
   * A control is `pending` when its `status === PENDING`.
   *
   * In order to have this status, the control must be in the
   * middle of conducting a validation check.
   */
  pending: boolean
  /**
   * A control is marked `touched` once the user has triggered
   * a `blur` event on it.
   */
  touched: boolean
  /**
   * A control is `untouched` if the user has not yet triggered
   * a `blur` event on it.
   */
  untouched: boolean
  /**
   * A control is `pristine` if the user has not yet changed
   * the value in the UI.
   *
   * Note that programmatic changes to a control's value will
   * *not* mark it dirty.
   */
  pristine: boolean
  /**
   * A control is `dirty` if the user has changed the value
   * in the UI or by calling OnChange method of `FormControl`
   *
   * Note that programmatic changes to a control's value will
   * *not* mark it dirty.
   */
  dirty: boolean
  /**
   * The parent control.
   */
  parent: FormGroup | FormArray
  errors: ValidationErrors
  /**
   * To set the meta properties
   */
  meta: { [key: string]: any }
  /**
   * Returns the update strategy of the `AbstractControl` (i.e.
   * the event on which the control will update itself).
   * Possible values: `'change'` (default) | `'blur'` | `'submit'`
   */
  updateOn: string
  validator: ValidatorFn | null
  asyncValidator: AsyncValidatorFn | null
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
  get: (path: String | Number[] | String) => AbstractControl
  /**
   * Retrieves the top-level ancestor of this control.
   */
  root: () => AbstractControl
  /**
   * Disables the control. This means the control will be exempt from validation checks and
   * excluded from the aggregate value of any parent. Its status is `DISABLED`.
   *
   * If the control has children, all children will be disabled to maintain the model.
   */
  disable: (opts?: { onlySelf?: boolean; emitEvent?: boolean }) => void
  /**
   * Enables the control. This means the control will be included in validation checks and
   * the aggregate value of its parent. Its status is re-calculated based on its value and
   * its validators.
   *
   * If the control has children, all children will be enabled.
   */
  enable: (opts?: { onlySelf?: boolean; emitEvent?: boolean }) => void
  /**
   * Updates value, validity & status of the control & parent
   */
  updateValueAndValidity: (
    opts?: { onlySelf?: boolean; emitEvent?: boolean }
  ) => void
  /**
   * Marks the control as `submitted`.
   *
   * If the control has any children, it will also mark all children as `submitted`
   */
  markAsSubmitted: (opts?: { emitEvent?: boolean }) => void
  /**
   * Marks the control as `unsubmitted`.
   *
   * If the control has any children, it will also mark all children as `unsubmitted`.
   *
   */
  markAsUnsubmitted: (opts?: { emitEvent?: boolean }) => void
  /**
   * Marks the control as `touched`.
   *
   * This will also mark all direct ancestors as `touched` to maintain
   * the model.
   */
  markAsTouched: (opts?: { onlySelf?: boolean; emitEvent?: boolean }) => void
  /**
   * Marks the control as `pristine`.
   *
   * If the control has any children, it will also mark all children as `pristine`
   * to maintain the model, and re-calculate the `pristine` status of all parent
   * controls.
   */
  markAsPristine: (opts?: { onlySelf?: boolean; emitEvent?: boolean }) => void
  /**
   * Marks the control as `untouched`.
   *
   * If the control has any children, it will also mark all children as `untouched`
   * to maintain the model, and re-calculate the `touched` status of all parent
   * controls.
   */
  markAsUntouched: (opts?: { onlySelf?: boolean; emitEvent?: boolean }) => void
  /**
   * Marks the control as `dirty`.
   *
   * This will also mark all direct ancestors as `dirty` to maintain
   * the model.
   */
  markAsDirty: (opts?: { onlySelf?: boolean; emitEvent?: boolean }) => void
  /**
   * Sets the synchronous validators that are active on this control.  Calling
   * this will overwrite any existing sync validators.
   */
  setValidators: (newValidator: Function | Function[] | null) => void
  /**
   * Sets the async validators that are active on this control.
   * Calling this will overwrite any existing async validators.
   */
  setAsyncValidators(newValidator: AsyncValidatorFn | AsyncValidatorFn[]): void
  /**
   * Empties out the sync validator list.
   */
  clearValidators: () => void
  /**
   * Empties out the async validator list.
   */
  clearAsyncValidators: () => void
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
   */
  setErrors: (
    errors: ValidationErrors | null,
    opts?: { onlySelf?: boolean }
  ) => void
  /**
   * Returns error data if the control with the given path has the error specified. Otherwise
   * returns null or undefined.
   *
   * If no path is given, it checks for the error on the present control.
   */
  getError: (errorCode: string, path?: String | Number[] | String) => any
  /**
   * Returns true if the control with the given path has the error specified. Otherwise
   * returns false.
   *
   * If no path is given, it checks for the error on the present control.
   */
  hasError: (errorCode: string, path?: String | Number[] | String) => boolean
  /**
   * Binds an input element to control.
   */
  handler: (inputType?: InputType, value?: string) => Handler
  setParent: (parent: FormGroup | FormArray) => void
  /**
   * Sets the value of the control. Abstract method (implemented in sub-classes).
   */
  abstract setValue(value: any, options?: Object): void
  /**
   * Patches the value of the control. Abstract method (implemented in sub-classes).
   */
  abstract patchValue(value: any, options?: Object): void
  /**
   * Resets the control. Abstract method (implemented in sub-classes).
   */
  abstract reset(value?: any, options?: Object): void
}
export interface FieldProps {
  render?: (
    control: FormArray | FormControl | FormGroup
  ) => React.ReactElement<any> | React.ReactElement<any>[]
  control: AbstractControl
}
export interface GroupProps {
  strict?: boolean
  render?: (
    control: FormArray | FormControl | FormGroup
  ) => React.ReactElement<any> | React.ReactElement<any>[]
  control?: AbstractControl
  name?: string
  index?: number
  formState?: any
  options?: AbstractControlOptions
  parent?: AbstractControl
  meta?: { [key: string]: any }
}
export interface FieldConfig extends GroupProps {
  controls: { [key: string]: any } | Array<any>
  control?: FormArray | FormGroup
  parent?: FormArray | FormGroup
  options?: AbstractControlOptions
  strict?: boolean
  meta?: { [key: string]: any }
}
export interface FormGeneratorProps {
  fieldConfig: FieldConfig
  onMount?: (form: FormArray | FormGroup) => void
  onUnmount?: () => void
  onValueChanges?: (value: { [key: string]: any } | Array<any>) => void
  onStatusChanges?: (status: Status) => void
}
export class Field extends React.Component<FieldProps, any> {}
export class FieldGroup extends React.Component<GroupProps, any> {}
export class FieldArray extends React.Component<GroupProps, any> {}
export class FieldControl extends React.Component<GroupProps, any> {}
export class FormGenerator extends React.Component<FormGeneratorProps, any> {}
/**
 * Creates an `AbstractControl` from a user-specified configuration.
 *
 * It is essentially syntactic sugar that shortens the `new FormGroup()`,
 * `new FormControl()`, and `new FormArray()` boilerplate that can build up in larger
 * forms.
 */
export class FormBuilder {
  /**
   * Construct a new `FormGroup` with the given map of configuration.
   * Valid keys for the `extra` parameter map are same as `AbstractControlOptions`.
   */
  static group(
    controlsConfig: { [key: string]: any },
    extra?: AbstractControlOptions | null
  ): FormGroup
  /**
   * Construct a new `FormControl` with the given `formState`,`validators`,
   * `asyncValidators` and `updateOn`.
   *
   * `formState` can either be a standalone value for the form control or an object
   * that contains both a value and a disabled status.
   *
   */
  static control(
    formState: Object,
    validators?: ValidatorFn | ValidatorFn[] | null,
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    updateOn?: FormHooks
  ): FormControl
  /**
   * Construct a `FormArray` from the given `controlsConfig` array of
   * configuration.
   * Valid keys for the `extra` parameter map are same as `AbstractControlOptions`.
   */
  static array(
    controlsConfig: any[],
    extra?: AbstractControlOptions | null
  ): FormArray
}
/**
 * Tracks the value and validity state of an array of `FormControl`,
 * `FormGroup` or `FormArray` instances.
 *
 * A `FormArray` aggregates the values of each child `FormControl` into an array.
 * It calculates its status by reducing the statuses of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Reactive Form,
 * along with `FormControl` and `FormGroup`.
 *
 *
 * When instantiating a `FormArray`, pass in an array of child controls as the first
 * argument.
 *
 * ### Example
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Jon', Validators.minLength(2)),
 *   new FormControl('Snow'),
 * ]);
 *
 * console.log(arr.value);   // ['Jon', 'Snow']
 * console.log(arr.status);  // 'VALID'
 * ```
 *
 * You can also include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators can be passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Jon'),
 *   new FormControl('Snow')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls
 *
 * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that will result in strange and unexpected behavior such
 * as broken change detection.
 *
 */
export class FormArray extends AbstractControl {
  constructor(
    controls: AbstractControl[],
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  )
  /**
   * Array of controls
   */
  controls: AbstractControl[]
  /**
   * Length of the control array.
   */
  length: number
  /**
   * Get the `AbstractControl` at the given `index` in the array.
   */
  at(index: number): AbstractControl
  /**
   * Insert a new `AbstractControl` at the end of the array.
   */
  push(control: AbstractControl): void
  /**
   * Insert a new {@link AbstractControl} at the given `index` in the array.
   */
  insert(index: number, control: AbstractControl): void
  /**
   * Remove the control at the given `index` in the array.
   */
  removeAt(index: number): void
  /**
   * Replace an existing control.
   */
  setControl(index: number, control: AbstractControl): void
  /**
   *  Sets the value of the `FormArray`. It accepts an array that matches
   *  the structure of the control.
   *
   * This method performs strict checks, so it will throw an error if you try
   * to set the value of a control that doesn't exist or if you exclude the
   * value of a control.
   *
   *  ### Example
   *
   *  ```
   *  const arr = new FormArray([
   *     new FormControl(),
   *     new FormControl()
   *  ]);
   *  console.log(arr.value);   // [null, null]
   *
   *  arr.setValue(['Jon', 'Snow']);
   *  console.log(arr.value);   // ['Jon', 'Snow']
   *  ```
   */
  setValue(
    value: any[],
    options: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
  /**
   *  Patches the value of the `FormArray`. It accepts an array that matches the
   *  structure of the control, and will do its best to match the values to the correct
   *  controls in the group.
   *
   *  It accepts both super-sets and sub-sets of the array without throwing an error.
   *
   *  ### Example
   *
   *  ```
   *  const arr = new FormArray([
   *     new FormControl(),
   *     new FormControl()
   *  ]);
   *  console.log(arr.value);   // [null, null]
   *
   *  arr.patchValue(['Jon']);
   *  console.log(arr.value);   // ['Jon', null]
   *  ```
   */
  patchValue(
    value: any[],
    options: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
  /**
   * Resets the `FormArray`. This means by default:
   *
   * * The array and all descendants are marked `pristine`
   * * The array and all descendants are marked `untouched`
   * * The value of all descendants will be null or null maps
   *
   * You can also reset to a specific form state by passing in an array of states
   * that matches the structure of the control. The state can be a standalone value
   * or a form state object with both a value and a disabled status.
   *
   * ### Example
   *
   * ```ts
   * this.arr.reset(['name', 'last name']);
   *
   * console.log(this.arr.value);  // ['name', 'last name']
   * ```
   *
   * - OR -
   *
   * ```
   * this.arr.reset([
   *   {value: 'name', disabled: true},
   *   'last'
   * ]);
   *
   * console.log(this.arr.value);  // ['name', 'last name']
   * console.log(this.arr.get(0).status);  // 'DISABLED'
   * ```
   */
  reset(
    value: any[],
    options: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
  /**
   * The aggregate value of the array, including any disabled controls.
   *
   * If you'd like to include all values regardless of disabled status, use this method.
   * Otherwise, the `value` property is the best way to get the value of the array.
   */
  getRawValue(): any[]
  /**
   * Submit action, can be used to tell the form that it has been submitted.
   * Useful when `updateOn` property is `submit`.
   * ```
   * <form onSubmit={this.form.handleSubmit}/>
   * ```
   */
  handleSubmit(): void
}
/**
 * Tracks the value and validity state of a group of `FormControl`
 * instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the statuses
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Reactive Form,
 * along with `FormControl` and `FormArray`.
 *
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child will be the name under which it is registered.
 *
 * ### Example
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Jon', Validators.minLength(2)),
 *   last: new FormControl('Snow'),
 * });
 *
 * console.log(form.value);   // {first: 'Jon', last; 'Snow'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * You can also include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ### Example
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you can alternatively choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, {validators: passwordMatchValidator, asyncValidators: otherValidator});
 * ```
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *    one: new FormControl()
 * }, {updateOn: 'blur'});
 * ```
 */
export class FormGroup extends AbstractControl {
  constructor(
    controls: { [key: string]: AbstractControl },
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  )
  controls: { [key: string]: AbstractControl }
  /**
   * Registers a control with the group's list of controls.
   *
   * This method does not update the value or validity of the control, so for most cases you'll want
   * to use addControl instead.
   */
  registerControl(name: string, control: AbstractControl): AbstractControl
  /**
   * Add a control to this group.
   */
  addControl(name: string, control: AbstractControl): void
  /**
   * Remove a control from this group.
   */
  removeControl(name: string): void
  /**
   * Replace an existing control.
   */
  setControl(name: string, control: AbstractControl): void
  /**
   * The aggregate value of the FormGroup, including any disabled controls.
   *
   * If you'd like to include all values regardless of disabled status, use this method.
   * Otherwise, the `value` property is the best way to get the value of the group.
   */
  getRawValue(): any
  /**
   *  Sets the value of the FormGroup. It accepts an object that matches
   *  the structure of the group, with control names as keys.
   *
   * This method performs strict checks, so it will throw an error if you try
   * to set the value of a control that doesn't exist or if you exclude the
   * value of a control.
   *
   *  ### Example
   *
   *  ```
   *  const form = new FormGroup({
   *     first: new FormControl(),
   *     last: new FormControl()
   *  });
   *  console.log(form.value);   // {first: null, last: null}
   *
   *  form.setValue({first: 'Jon', last: 'Snow'});
   *  console.log(form.value);   // {first: 'Jon', last: 'Snow'}
   *
   *  ```
   */
  setValue(
    value: { [key: string]: any },
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
  /**
   *  Patches the value of the FormGroup. It accepts an object with control
   *  names as keys, and will do its best to match the values to the correct controls
   *  in the group.
   *
   *  It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   *  ### Example
   *
   *  ```
   *  const form = new FormGroup({
   *     first: new FormControl(),
   *     last: new FormControl()
   *  });
   *  console.log(form.value);   // {first: null, last: null}
   *
   *  form.patchValue({first: 'Jon'});
   *  console.log(form.value);   // {first: 'Jon', last: null}
   *
   *  ```
   */
  patchValue(
    value: { [key: string]: any },
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
  /**
   * Resets the FormGroup. This means by default:
   *
   * * The group and all descendants are marked `pristine`
   * * The group and all descendants are marked `untouched`
   * * The value of all descendants will be null or null maps
   *
   * You can also reset to a specific form state by passing in a map of states
   * that matches the structure of your form, with control names as keys. The state
   * can be a standalone value or a form state object with both a value and a disabled
   * status.
   *
   * ### Example
   *
   *  ```ts
   *  this.form.reset({first: 'name', last: 'last name'});
   *
   * console.log(this.form.value);  // {first: 'name', last: 'last name'}
   * ```
   *
   * - OR -
   *
   * ```
   * this.form.reset({
   *   first: {value: 'name', disabled: true},
   *   last: 'last'
   * });
   *
   * console.log(this.form.value);  // {first: 'name', last: 'last name'}
   * console.log(this.form.get('first').status);  // 'DISABLED'
   * ```
   */
  reset(
    value?: any,
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
  /**
   * Submit action, can be used to tell the form that it has been submitted.
   * Useful when `updateOn` property is `submit`.
   * ```
   * <form onSubmit={this.form.handleSubmit}/>
   * ```
   */
  handleSubmit(): void
}
/**
 * Tracks the value and validation status of an individual form control.
 *
 * It is one of the three fundamental building blocks of Reactive forms, along with
 * FormGroup and FormArray.
 *
 * When instantiating a FormControl, you can pass in an initial value as the
 * first argument. Example:
 *
 * ```ts
 * const ctrl = new FormControl('some value');
 * console.log(ctrl.value);     // 'some value'
 *```
 *
 * You can also initialize the control with a form state object on instantiation,
 * which includes both the value and whether or not the control is disabled.
 * You can't use the value key without the disabled key; both are required
 * to use this way of initialization.
 *
 * ```ts
 * const ctrl = new FormControl({value: 'n/a', disabled: true});
 * console.log(ctrl.value);     // 'n/a'
 * console.log(ctrl.status);   // 'DISABLED'
 * ```
 *
 * The second FormControl argument can accept one of three things:
 * * a sync validator function
 * * an array of sync validator functions
 * * an options object containing validator and/or async validator functions
 *
 * Example of a single sync validator function:
 *
 * ```ts
 * const ctrl = new FormControl('', Validators.required);
 * console.log(ctrl.value);     // ''
 * console.log(ctrl.status);   // 'INVALID'
 * ```
 *
 * Example using options object:
 *
 * ```ts
 * const ctrl = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * The options object can also be used to define when the control should update.
 * By default, the value and validity of a control updates whenever the value
 * changes. You can configure it to update on the blur event instead by setting
 * the `updateOn` option to `'blur'`.
 *
 * ```ts
 * const c = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * You can also set `updateOn` to `'submit'`, which will delay value and validity
 * updates until the parent form of the control fires a submit event.
 *
 * See its superclass, AbstractControl, for more properties and methods.
 */
export class FormControl extends AbstractControl {
  constructor(
    formState: any,
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  )

  /**
   * Emits an event every time the value of the control changes, in
   * the UI by onChang event.
   */
  onValueChanges: Observable<any>
  /**
   * Emits an event every time whenever a blur event triggers.
   */
  onBlurChanges: Observable<any>
  /**
   * Function needs to be called whenever a value change happens.
   */
  onChange: (value: any) => void
  /**
   * Function needs to be called whenever a blur event triggers.
   */
  onBlur: () => void
  /**
   * Binds an input element to control.
   */
  handler: (inputType?: InputType, value?: string) => Handler
  /**
   * Set the value of the form control to `value`.
   *
   * If `onlySelf` is `true`, this change will only affect the validation of this `FormControl`
   * and not its parent component. This defaults to false.
   *
   * If `emitEvent` is `true`, this
   * change will cause a `valueChanges` event on the `FormControl` to be emitted. This defaults
   * to true (as it falls through to `updateValueAndValidity`).
   */
  setValue(
    value: any,
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
  /**
   * Patches the value of a control.
   *
   * This function is functionally the same as setValue at this level.
   * It exists for symmetry with `patchValue` on `FormGroups` and
   * `FormArrays`, where it does behave differently.
   */
  patchValue(
    value: any,
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
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
   * this.control.reset('Jon');
   *
   * console.log(this.control.value);  // 'Jon'
   * ```
   *
   * OR
   *
   * ```
   * this.control.reset({value: 'Jon', disabled: true});
   *
   * console.log(this.control.value);  // 'Jon'
   * console.log(this.control.status);  // 'DISABLED'
   * ```
   */
  reset(
    formState?: any,
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ): void
  /**
   * A control is `active` when its focused.
   */
  active: boolean
  /**
   * A control is `inactive` when its unfocused.
   */
  inactive: boolean
}
export class Validators {
  /**
   * Validator that requires controls to have a non-empty value.
   */
  static required(control: AbstractControl): ValidationErrors | null
  /**
   * Validator that requires control value to be true.
   */
  static requiredTrue(control: AbstractControl): ValidationErrors | null
  /**
   * Validator that performs email validation.
   */
  static email(control: AbstractControl): ValidationErrors | null
  /**
   * Validator that requires controls to have a value greater than a number.
   */
  static min(min: number): ValidatorFn
  /**
   * Validator that requires controls to have a value less than a number.
   */
  static max(max: number): ValidatorFn
  /**
   * Validator that requires controls to have a value of a minimum length.
   */
  static minLength(minLength: number): ValidatorFn
  /**
   * Validator that requires controls to have a value of a maximum length.
   */
  static maxLength(maxLength: number): ValidatorFn
  /**
   * Validator that requires a control to match a regex to its value.
   */
  static pattern(pattern: string | RegExp): ValidatorFn
}
