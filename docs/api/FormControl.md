# Form Control

Tracks the value and validation status of an individual form control.

It is one of the three fundamental building blocks of Reactive forms, along with [FormGroup](FormGroup.md) and [FormArray](FormArray.md).

## How To Use
When instantiating a FormControl, you can pass in an initial value as the first argument. Example:
```ts
const ctrl = new FormControl('some value');
console.log(ctrl.value);     // 'some value'
```
You can also initialize the control with a form state object on instantiation, which includes both the value and whether or not 
the control is disabled. You can't use the value key without the disabled key; both are required to use this way of 
initialization.
```ts
const ctrl = new FormControl({value: 'n/a', disabled: true});
console.log(ctrl.value);     // 'n/a'
console.log(ctrl.status);   // 'DISABLED'
```
The second FormControl argument can accept one of three things:

a sync validator function
an array of sync validator functions
an options object containing validator and/or async validator functions.

Example of a single sync validator function:
```ts
const ctrl = new FormControl('', Validators.required);
console.log(ctrl.value);     // ''
console.log(ctrl.status);   // 'INVALID'
```
Example using options object:
```ts
const ctrl = new FormControl('', {
   validators: Validators.required,
   asyncValidators: myAsyncValidator,
});
```
The options object can also be used to define when the control should update. 
By default, the value and validity of a control updates whenever the value changes. 
You can configure it to update on the `blur` event instead by setting the updateOn option to `'blur'`.
```ts
const c = new FormControl('', { updateOn: 'blur' });
```
You can also set updateOn to `'submit'`, which will delay value and validity updates until the parent form of the control 
fires a `submit` event.

See its superclass, [AbstractControl](AbstractControl.md), for more properties and methods.

## Constructor
```ts
constructor(formState: any = null, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null)
```
## Members
```ts
setValue(value: any, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Set the `value` of the form control to value.

If `onlySelf` is true, this change will only affect the validation of this FormControl and not its parent component. 
This defaults to `false`.

If `emitEvent` is true, this change will cause a valueChanges event on the FormControl to be emitted. 
This defaults to `true` (as it falls through to updateValueAndValidity)
##
```ts
patchValue(value: any, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Patches the value of a control.

This function is functionally the same as `setValue` at this level. 
It exists for symmetry with patchValue on `FormGroups` and `FormArrays`, where it does behave differently.
##
```ts
reset(formState: any = null, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Resets the form control. This means by default:

* it is marked as pristine
* it is marked as untouched
* value is set to null
You can also reset to a specific form state by passing through a standalone value or a form state object that contains both 
a value and a disabled state (these are the only two properties that cannot be calculated).
Ex.
```ts
this.control.reset('Jon');

console.log(this.control.value);  // 'Jon'
```
OR
```ts
this.control.reset({value: 'Jon', disabled: true});

console.log(this.control.value);  // 'Jon'
console.log(this.control.status);  // 'DISABLED'
```
##
```ts
onChange: (value: any) => void;
```
Function needs to be called whenever a value change happens.
##
```ts
onBlur: () => void;
```
Function needs to be called whenever a blur event triggers.
##
```ts
handler: (inputType?: InputType, value?: string) => Handler;
```
Returns the props required to bind a control with an input element.

For more details see the handler section of [props](Props.md).

Note: This document is a derivative of ["Form Control Document"](https://angular.io/api/forms/FormControl) by Google,
under [CC BY](https://creativecommons.org/licenses/by/4.0/).






