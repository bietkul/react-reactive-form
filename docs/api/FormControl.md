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
Returns the props required to bind a control to a native input element.

Note: 
* `inputType` parameter is required for `checkbox`, `radio` and `switch`( React Native ) components.
* `value` parameter only can be used for `radio` buttons to assign a value to a particular button.

Example

```ts
  <input type="text" {...username.handler()}/>
```
Binds a `text` input.
##
```ts
  <input type="date" {...birthday.handler()}/> 
```
Binds a `date` input.
##
```ts
<input {...terms.handler("checkbox")}/>
```
Binds a `checkbox` input.
##
```ts
<input {...gender.handler('radio', 'male')}/> Male
<input {...gender.handler('radio', 'female')}/> Female
<input {...gender.handler('radio', 'other')}/> Other
```
Binds a `radio` input.
##
```ts
  <TextInput {...username.handler()}/>
```
Binds a React Native `TextInput` component.
##
```ts
  <Switch {...terms.handler('switch')}/>
```
Binds a React Native `Switch` component.

A `handler` object can have these properties:

```ts
value: any;
```
Sometimes this value can be different from the actual value of `control`.

For example, if the `updateOn` property is `blur` or `submit` than the value property of handler will be `_pendingValue`
of the control.

The `_pendingValue` is the value of a control which is not validated yet which means the actual value of the
control is different.

So, this `value` is just to control the input element, for actual value of the control you can use the `value` property 
of the mapped control prop.
##
```ts
onChange: (e: any) => void;
```
Function needs to be called whenever a value change event triggers.
##
```ts
onBlur: (e: any) => void;
```
Function needs to be called whenever a `blur` event triggers.
##
```ts
disabled: boolean;
```
Tells the input element about the `disabled` status.
##
```ts
checked?: boolean;
```
Checked property for `checkbox` and `radio` buttons.
##
```ts
editable?: boolean;
```
React Native uses `editable` property to tell the `TextInput` about the `enabled` status.
##
```ts
type?: string;
```
Returns the type of input element in case of `checkbox` & `radio` buttons.


Although `handler` works well with all kind of inputs, you can also bind your custom input 
components.

Example

```ts
<Field 
   control={myForm.get('birthday')}
   render={({ onChange, value }) => (
      <DatePickerIOS 
        date={value}
        dateForm="MM/DD/YYYY"
        onDateChange={onChange}
      />
   )}
 />
```

Binds a React Native `DatePickerIOS` component.

Note: This document is a derivative of ["Form Control Document"](https://angular.io/api/forms/FormControl) by Google,
under [CC BY](https://creativecommons.org/licenses/by/4.0/).






