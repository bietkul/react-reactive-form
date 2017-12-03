import * as React from "react";
import { Observable } from 'rxjs';

export type ValidationErrors = {
    [key: string]: any
};
export type FormHooks = 'change' | 'blur' | 'submit';

export interface AbstractControlOptions {
  validators?: ValidatorFn|ValidatorFn[]|null;
  asyncValidators?: AsyncValidatorFn|AsyncValidatorFn[]|null;
  updateOn?: FormHooks;
}
export interface ValidatorFn { (c: AbstractControl): ValidationErrors|null; }
export interface AsyncValidatorFn {
    (c: AbstractControl): Promise<ValidationErrors|null>|Observable<ValidationErrors|null>;
}
declare abstract class AbstractControl {
    constructor(validator: ValidatorFn|null, asyncValidator: AsyncValidatorFn|null)
    valueChanges: Observable<any>;
    statusChanges: Observable<any>;
    value: any;
    /**
    * A control is `valid` when its `status === VALID`.
    *
    * In order to have this status, the control must have passed all its
    * validation checks.
    */
    valid: boolean;
    /**
    * A control is `invalid` when its `status === INVALID`.
    *
    * In order to have this status, the control must have failed
    * at least one of its validation checks.
    */
    invalid: boolean;
    /**
    * A control is `enabled` as long as its `status !== DISABLED`.
    *
    * In other words, it has a status of `VALID`, `INVALID`, or
    * `PENDING`.
    */
    enabled: boolean;
    /**
    * A control is disabled if it's status is `DISABLED`
    */
    disabled: boolean;
    /**
    * A control is marked `touched` once the user has triggered
    * a `blur` event on it.
    */
    touched: boolean;
    /**
    * A control is `untouched` if the user has not yet triggered
    * a `blur` event on it.
    */
    untouched: boolean;
    /**
    * A control is `pristine` if the user has not yet changed
    * the value in the UI.
    *
    * Note that programmatic changes to a control's value will
    * *not* mark it dirty.
    */
    pristine: boolean;
    /**
    * A control is `dirty` if the user has changed the value
    * in the UI or by calling OnChange method of `FormControl`
    *
    * Note that programmatic changes to a control's value will
    * *not* mark it dirty.
    */
    dirty: boolean;
    /**
    * The parent control.
    */
    parent: FormGroup|FormArray;
    errors: object;
    /**
    * Returns the update strategy of the `AbstractControl` (i.e.
    * the event on which the control will update itself).
    * Possible values: `'change'` (default) | `'blur'` | `'submit'`
    */
    updateOn: string;
    pending: boolean;
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
    get: (path: String|Number[]|String) => AbstractControl;
    /**
    * Retrieves the top-level ancestor of this control.
    */
    root: () => AbstractControl;
    /**
    * Disables the control. This means the control will be exempt from validation checks and
    * excluded from the aggregate value of any parent. Its status is `DISABLED`.
    *
    * If the control has children, all children will be disabled to maintain the model.
    */
    disable: (opts?: {onlySelf?: boolean, emitEvent?: boolean}) => void;
    /**
    * Enables the control. This means the control will be included in validation checks and
    * the aggregate value of its parent. Its status is re-calculated based on its value and
    * its validators.
    *
    * If the control has children, all children will be enabled.
    */
    enable: (opts?: {onlySelf?: boolean, emitEvent?: boolean}) => void;
    /**
    * Updates value, validity & status of the control & parent
    */
    updateValueAndValidity: (opts?: {onlySelf?: boolean, emitEvent?: boolean}) => void;
    /**
    * Marks the control as `touched`.
    *
    * This will also mark all direct ancestors as `touched` to maintain
    * the model.
    */
    markAsTouched: (opts?: {onlySelf?: boolean}) => void;
    /**
    * Marks the control as `pristine`.
    *
    * If the control has any children, it will also mark all children as `pristine`
    * to maintain the model, and re-calculate the `pristine` status of all parent
    * controls.
    */
    markAsPristine: (opts?: {onlySelf?: boolean}) => void;
    /**
    * Marks the control as `untouched`.
    *
    * If the control has any children, it will also mark all children as `untouched`
    * to maintain the model, and re-calculate the `touched` status of all parent
    * controls.
    */
    markAsUntouched: (opts?: {onlySelf?: boolean}) => void;
    /**
    * Marks the control as `dirty`.
    *
    * This will also mark all direct ancestors as `dirty` to maintain
    * the model.
    */
    markAsDirty: (opts?: {onlySelf?: boolean}) => void;
    /**
    * Sets the synchronous validators that are active on this control.  Calling
    * this will overwrite any existing sync validators.
    */
    setValidators: (newValidator: Function|Function[]|null) => void;
    /**
    * Empties out the sync validator list.
    */
    clearValidators: () => void;
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
    setErrors: (errors: ValidationErrors, opts?: {onlySelf?: boolean}) => void;
    /**
    * Returns error data if the control with the given path has the error specified. Otherwise
    * returns null or undefined.
    *
    * If no path is given, it checks for the error on the present control.
    */
    getError: (errorCode: string, path: String|Number[]|String) => any;
    /**
    * Returns true if the control with the given path has the error specified. Otherwise
    * returns false.
    *
    * If no path is given, it checks for the error on the present control.
    */
    hasError: (errorCode: string, path: String|Number[]|String) => boolean;
    setParent: (parent: FormGroup|FormArray) => void;
    /**
    * Sets the value of the control. Abstract method (implemented in sub-classes).
    */
    abstract setValue(value: any, options?: Object): void;
    /**
    * Patches the value of the control. Abstract method (implemented in sub-classes).
    */
    abstract patchValue(value: any, options?: Object): void;
    /**
    * Resets the control. Abstract method (implemented in sub-classes).
    */
    abstract reset(value?: any, options?: Object): void;
}
declare module "react-reactive-form" {
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
        * Valid keys for the `extra` parameter map are `validator` and `asyncValidator`.
        *
        * See the `FormGroup` constructor for more details.
        */
        group(controlsConfig: {[key: string]: any}, extra?: {[key: string]: any}|null): FormGroup
        /**
        * Construct a new `FormControl` with the given `formState`,`validator`, and
        * `asyncValidator`.
        *
        * `formState` can either be a standalone value for the form control or an object
        * that contains both a value and a disabled status.
        *
        */
        control(formState: Object, validator?: ValidatorFn|ValidatorFn[]|null,
            asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormControl
        /**
        * Construct a `FormArray` from the given `controlsConfig` array of
        * configuration, with the given optional `validator` and `asyncValidator`.
        */
        array(controlsConfig: any[], validator?: ValidatorFn|null,
        asyncValidator?: AsyncValidatorFn|null): FormArray
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
    export class FormArray extends AbstractControl  {
        setValue(value: any, options?: Object): void;
        patchValue(value: any, options?: Object): void;
        reset(value?: any, options?: Object): void;
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
    * @howToUse
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
            controls: {[key: string]: AbstractControl},
            validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
            asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null)
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
        setValue(value: {[key: string]: any}, options?: {onlySelf?: boolean, emitEvent?: boolean}):void
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
        patchValue(value: {[key: string]: any}, options?: {onlySelf?: boolean, emitEvent?: boolean}): void
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
        * ```ts
        * this.form.reset({first: 'name', last: 'last name'});
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
        reset(value: any, options?: {onlySelf?: boolean, emitEvent?: boolean}): void
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
        constructor(formState: any,
            validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
            asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null);
        onChange: (value: any) => void;
        onBlur: () => void;
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
        setValue(value: any, options?: {onlySelf?: boolean,emitEvent?: boolean}): void
        /**
         * Patches the value of a control.
         *
         * This function is functionally the same as setValue at this level.
         * It exists for symmetry with `patchValue` on `FormGroups` and
         * `FormArrays`, where it does behave differently.
         */
        patchValue(value: any, options?: {onlySelf?: boolean, emitEvent?: boolean }): void
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
        reset(formState: any, options?: {onlySelf?: boolean, emitEvent?: boolean}): void
    }
    export class Validators {
        /**
         * Validator that requires controls to have a non-empty value.
        */
        static required(control: AbstractControl): ValidationErrors|null
        /**
        * Validator that requires control value to be true.
        */
        static requiredTrue(control: AbstractControl): ValidationErrors|null
        /**
         * Validator that performs email validation.
        */
        static email(control: AbstractControl): ValidationErrors|null
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
        static pattern(pattern: string|RegExp): ValidatorFn
    }
    export function reactiveForm(ReactComponent: React.SFC|React.ComponentClass<any>, formGroup: FormGroup):React.ComponentClass<any>;
}