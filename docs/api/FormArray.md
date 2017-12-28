# FormArray

Tracks the value and validity state of an array of [FormControl](FormControl.md), [FormGroup](FormGroup.md) 
or [FormArray](FormArray.md) instances.

A FormArray aggregates the values of each child FormControl into an array. 
It calculates its status by reducing the statuses of its children.
For example, if one of the controls in a FormArray is invalid, the entire array becomes invalid.

FormArray is one of the three fundamental building blocks used to define forms in Reactive Forms, 
along with [FormControl](FormControl.md) and [FormGroup](FormGroup.md).

## How To Use
When instantiating a FormArray, pass in an array of child controls as the first argument.

Example

```ts
const arr = new FormArray([
  new FormControl('Jon', Validators.minLength(2)),
  new FormControl('Snow'),
]);

console.log(arr.value);   // ['Jon', 'Snow']
console.log(arr.status);  // 'VALID'
```
You can also include array-level validators and async validators. 
These come in handy when you want to perform validation that considers the value of more than one child control.

The two types of validators can be passed in separately as the second and third arg respectively, 
or together as part of an options object.
```ts
const arr = new FormArray([
  new FormControl('Jon'),
  new FormControl('Snow')
], {validators: myValidator, asyncValidators: myAsyncValidator});
```
The options object can also be used to set a default value for each child control's `updateOn` property. 
If you set updateOn to `'blur'` at the array level, all child controls will default to `'blur'`, 
unless the child has explicitly specified a different `updateOn` value.
```ts
const c = new FormArray([
   new FormControl()
], {updateOn: 'blur'});
```
## Adding or removing controls
To change the controls in the array, use the `push`, `insert`, or `removeAt` methods in FormArray itself. 
These methods ensure the controls are properly tracked in the form's hierarchy. 
Do not modify the array of AbstractControls used to instantiate the FormArray directly, 
as that will result in strange and unexpected behavior such as broken change detection.

## Constructor
```ts
constructor(controls: AbstractControl[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null)
```
## Members
```ts
controls: AbstractControl[]
```
##
```ts
submitted: boolean
```
A form is submitted if the `handleSubmit` function has been called on it.
##
```ts
at(index: number): AbstractControl
```
Get the [AbstractControl](AbstractControl.md) at the given index in the array.
##
```ts
push(control: AbstractControl): void
```
Insert a new [AbstractControl](AbstractControl.md) at the end of the array.
##
```ts
insert(index: number, control: AbstractControl): void
```
Insert a new [AbstractControl](AbstractControl.md) at the given index in the array.

##
```ts
removeAt(index: number): void
```
Remove the control at the given index in the array.
##
```ts
setControl(index: number, control: AbstractControl): void
```
Replace an existing control.
##
```ts
get length: number
```
Length of the control array.
##
```ts
setValue(value: any[], options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Sets the value of the FormArray. It accepts an array that matches the structure of the control.

This method performs strict checks, so it will throw an error if you try to set the value of a control that doesn't 
exist or if you exclude the value of a control.

Example
```ts
const arr = new FormArray([
   new FormControl(),
   new FormControl()
]);
console.log(arr.value);   // [null, null]

arr.setValue(['Jon', 'Snow']);
console.log(arr.value);   // ['Jon', 'Snow']
```
##
```ts
patchValue(value: any[], options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Patches the value of the FormArray. It accepts an array that matches the structure of the control, 
and will do its best to match the values to the correct controls in the group.

It accepts both super-sets and sub-sets of the array without throwing an error.

Example
```ts
const arr = new FormArray([
   new FormControl(),
   new FormControl()
]);
console.log(arr.value);   // [null, null]

arr.patchValue(['Jon']);
console.log(arr.value);   // ['Jon', null]
```
##
```ts
reset(value: any = [], options: {
    onlySelf?: boolean;
    emitEvent?: boolean;
} = {}): void
```
Resets the FormArray. This means by default:

* The array and all descendants are marked pristine
* The array and all descendants are marked untouched
* The value of all descendants will be null or null maps
You can also reset to a specific form state by passing in an array of states that matches the structure of the control. 
The state can be a standalone value or a form state object with both a value and a disabled status.

Example

```ts
this.arr.reset(['name', 'last name']);

console.log(this.arr.value);  // ['name', 'last name']
```
OR
```ts
this.arr.reset([
  {value: 'name', disabled: true},
  'last'
]);

console.log(this.arr.value);  // ['name', 'last name']
console.log(this.arr.get(0).status);  // 'DISABLED'
```
##
```ts
getRawValue(): any[]
```
The aggregate `value` of the array, including any disabled controls.

If you'd like to include all values regardless of disabled status, use this method. 
Otherwise, the `value` property is the best way to get the `value` of the array.

##
```ts
handleSubmit():void
```
Submit action, can be used to tell the form that it has been submitted.
Useful when `updateOn` property is `submit`.

Example
```ts
<form onSubmit={this.form.handleSubmit}/>
```
<br/></br>
Note: This document is a derivative of ["Form Array Document"](https://angular.io/api/forms/FormArray) by Google, 
under [CC BY](https://creativecommons.org/licenses/by/4.0/).











