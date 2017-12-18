# Form Builder
Creates an [AbstractControl](AbstractControl.md) from a user-specified configuration.

It is essentially syntactic sugar that shortens the new FormGroup(), new FormControl(), 
and new FormArray() boilerplate that can build up in larger forms.

## How To Use
```ts
imoprt { FormBuilder } from "react-reactive-form";
...
const form = FormBuilder.group({
  name: FormBuilder.group({
     first: ['Jon', Validators.minLength(2)],
     last: 'Snow',
  }),
  email: '',
});
```
## Members

```ts
static group(controlsConfig: {
    [key: string]: any;
}, extra: {
    [key: string]: any;
} | null = null): FormGroup
```
Construct a new [FormGroup](FormGroup.md) with the given map of configuration. 
Valid keys for the `extra` parameter map are same as [AbstractControlOptions](AbstractControlOptions.md).

##
```ts
static control(
  formState: Object, 
  validator?: ValidatorFn | ValidatorFn[] | null, 
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  updateOn: FormHooks): FormControl
```
Construct a new FormControl with the given formState,validator,asyncValidator and updateOn.
formState can either be a standalone value for the form control or an object that contains both a value and a disabled status.

## 
```ts
static array(controlsConfig: any[], extra?: AbstractControlOptions|null): FormArray
```
Construct a `FormArray` from the given `controlsConfig` array of configuration.
Valid keys for the `extra` parameter map are same as [AbstractControlOptions](AbstractControlOptions.md).

<br/></br>
Note: This document is a derivative of ["Form Builder Document"](https://angular.io/api/forms/FormBuilder) by Google,
under [CC BY](https://creativecommons.org/licenses/by/4.0/).
