# Abstract Control Options

You can use abstract control options to configure your [Controls](AbstractControl.md).

Example

```ts
  const myForm = new FormGroup({
      username: new FormControl("", {
          validators: [Validators.required, Validators.email],
          asyncValidators: myAsyncValidator,
          updateOn: "blur"
      })
  });
```

## Properties
```ts
validators?: ValidatorFn|ValidatorFn[]|null;
```
It can be used to set a sync validator function or an array of sync validator functions.
A validator function is a callback which returns validation errors or null ( if the control is valid );
```ts
 (c: AbstractControl): ValidationErrors | null
```
You can also define your custom sync validators.

Example

```ts
function passwordMatchValidator(g: FormGroup) {
   return g.get('password').value === g.get('passwordConfirm').value
      ? null : {'mismatch': true};
}
```
##
```ts
asyncValidators?: AsyncValidatorFn|AsyncValidatorFn[]|null;
 ```
It can be used to set an async validator function or an array of async validator functions.
An async validator function is a callback which returns a `Promise` or `Observable` with validation errors 
or null ( if the control is valid );
```ts
(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>
```
Example
```ts
function asyncValidator(control: AbstractControl) {
    return fetch("// Some api")
    .then((response) => { return response.json(); })
    .then((responseJson) => {
      if (responseJson.isExist) {
        return {isExist: true};
      }
      return null;
    })
    .catch((error) => {
      return control.errors;
    });
}
```
 ##
 ```ts
updateOn?: FormHooks;
```
Possible Values
```ts
FormHooks = 'change' | 'blur' | 'submit'; // default is 'change'
```
It can be used to set a default value for each child control's updateOn property. 
If you set updateOn to 'blur' at the group level, all child controls will default to 'blur', unless the child has 
explicitly specified a different updateOn value.


