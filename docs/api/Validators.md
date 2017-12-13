# Validators

Provides a set of validators used by form controls.

A validator is a function that processes a [FormControl](FormControl.md) or collection of controls and returns a map of errors. 
A null map means that validation has passed.

Example
##
```ts
var loginControl = new FormControl("", Validators.required)
```

## Static Members
```ts
static min(min: number): ValidatorFn
```
Validator that requires controls to have a value greater than a number
##
```ts
static max(max: number): ValidatorFn
```
Validator that requires controls to have a value less than a number.
##
```ts
static required(control: AbstractControl): ValidationErrors | null
```
Validator that requires controls to have a non-empty value.
##
```ts
static requiredTrue(control: AbstractControl): ValidationErrors | null
```
Validator that requires control value to be true.
##
```ts
static email(control: AbstractControl): ValidationErrors | null
```
Validator that performs email validation.
##
```ts
static minLength(minLength: number): ValidatorFn
```
Validator that requires controls to have a value of a minimum length.
##
```ts
static maxLength(maxLength: number): ValidatorFn
```
Validator that requires controls to have a value of a maximum length.
##
```ts
static pattern(pattern: string | RegExp): ValidatorFn
```
Validator that requires a control to match a regex to its value.

<br/></br>
Note: This document is a derivative of ["Validators Document"](https://angular.io/api/forms/Validators) by Google,
under [CC BY](https://creativecommons.org/licenses/by/4.0/).
