# Form Group
Tracks the value and validity state of a `group` of [FormControl](FormControl.md) instances.
A FormGroup aggregates the values of each child FormControl into one object, with each control name as the key. 
It calculates its status by reducing the statuses of its children. 
For example, if one of the controls in a group is invalid, the entire group becomes invalid.

FormGroup is one of the three fundamental building blocks used to define forms in Reactive Forms, 
along with [FormControl](FormControl.md) and [FormArray](FormArray.md).

## How To Use

When instantiating a FormGroup, pass in a collection of child controls as the first argument. 
The key for each child will be the name under which it is registered.
Example
```ts
const form = new FormGroup({
  first: new FormControl('Jon', Validators.minLength(2)),
  last: new FormControl('Snow'),
});

console.log(form.value);   // {first: 'Jon', last; 'Snow'}
console.log(form.status);  // 'VALID'
```
You can also include group-level validators as the second arg, or group-level async validators as the third arg. 
These come in handy when you want to perform validation that considers the value of more than one child control.
Example
```ts
const form = new FormGroup({
  password: new FormControl('', Validators.minLength(2)),
  passwordConfirm: new FormControl('', Validators.minLength(2)),
}, passwordMatchValidator);


function passwordMatchValidator(g: FormGroup) {
   return g.get('password').value === g.get('passwordConfirm').value
      ? null : {'mismatch': true};
}
```
Like `FormControl` instances, you can alternatively choose to pass in validators and async validators 
as part of an options object.
```ts
const form = new FormGroup({
  password: new FormControl('')
  passwordConfirm: new FormControl('')
}, {validators: passwordMatchValidator, asyncValidators: otherValidator});
```
The options object can also be used to set a default value for each child control's `updateOn` property. 
If you set `updateOn` to `'blur'` at the group level, all child controls will default to `'blur'`, 
unless the child has explicitly specified a different `updateOn` value.
```ts
const c = new FormGroup({
   one: new FormControl()
}, {updateOn: 'blur'});

## Constructor
```
constructor(controls: {
    [key: string]: AbstractControl;
}, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, 
asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null)

## Members
```ts
controls: {
    [key: string]: AbstractControl;
}
```
##
```ts
registerControl(name: string, control: AbstractControl): AbstractControl
```
Registers a control with the group's list of controls.

This method does not update the value or validity of the control, so for most cases you'll want to use `addControl` instead.
##
```ts
addControl(name: string, control: AbstractControl): void
```
Add a control to this group.
##
```ts
removeControl(name: string): void
```
Remove a control from this group.
##
```ts
setControl(name: string, control: AbstractControl): void
```
Replace an existing control.
##
```ts
contains(controlName: string): boolean
```
Check whether there is an `enabled` control with the given name in the group.

It will return false for disabled controls. If you'd like to check for existence in the group only, use `get` instead.

##
```ts
setValue(value: {
    [key: string]: any;
}, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Sets the value of the FormGroup. It accepts an object that matches the structure of the group, with control names as keys.

This method performs strict checks, so it will throw an error if you try to set the value of a control that doesn't
exist or if you exclude the value of a control.

Example
```ts
const form = new FormGroup({
   first: new FormControl(),
   last: new FormControl()
});
console.log(form.value);   // {first: null, last: null}

form.setValue({first: 'Jon', last: 'Snow'});
console.log(form.value);   // {first: 'Jon', last: 'Snow'}
```
##
```ts
patchValue(value: {
    [key: string]: any;
}, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Patches the value of the FormGroup. It accepts an object with control names as keys, and will do its best to match the values 
to the correct controls in the group.
It accepts both super-sets and sub-sets of the group without throwing an error.

Example
```ts
const form = new FormGroup({
   first: new FormControl(),
   last: new FormControl()
});
console.log(form.value);   // {first: null, last: null}

form.patchValue({first: 'Jon'});
console.log(form.value);   // {first: 'Jon', last: null}
```
##
```ts
reset(value: any = {}, options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Resets the FormGroup. This means by default:

* The group and all descendants are marked pristine
* The group and all descendants are marked untouched
* The value of all descendants will be null or null maps
You can also reset to a specific form state by passing in a map of states that matches the structure of your form, 
with control names as keys. The state can be a standalone value or a form state object with both a value and a disabled
status.

Example
```ts
this.form.reset({first: 'name', last: 'last name'});

console.log(this.form.value);  // {first: 'name', last: 'last name'}
```
OR
```ts
this.form.reset({
  first: {value: 'name', disabled: true},
  last: 'last'
});

console.log(this.form.value);  // {first: 'name', last: 'last name'}
console.log(this.form.get('first').status);  // 'DISABLED'
```
##
```ts
getRawValue(): any
```
The aggregate value of the FormGroup, including any disabled controls.

If you'd like to include all values regardless of disabled status, use this method. 
Otherwise, the value property is the best way to get the value of the group.

##
```ts
handleSubmit():void
```
Submit action, can be used to tell the form that it has been submitted.    
Useful when `updateOn` property is set to `submit`.

Example
```ts
<form onSubmit={this.form.handleSubmit}/>
```

<br/></br>
Note: This document is a derivative of ["Form Group Document"](https://angular.io/api/forms/FormGroup) by Google, 
under [CC BY](https://creativecommons.org/licenses/by/4.0/).


