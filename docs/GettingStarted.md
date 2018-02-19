# Getting Started With `react-reactive-form`
The basic implementation of reactive forms is super easy but it may be helpful to read a brief description of the core form classes.
* [Abstract Control](api/AbstractControl.md)
* [Form Group](api/FormGroup.md)
* [Form Array](api/FormArray.md)
* [Form Control](api/FormControl.md)
* [Form Builder](api/FormBuilder.md)

## Basic Usage Guide
### step 1: Create FormGroup or FormArray
A form group is a collection object of form controls & form array is the collection array of form controls.

There are three ways to create these:

#### With FormBuilder ( Static Controls )
The FormBuilder class helps reduce repetition and clutter by handling details of control creation for you.
`FormBuilder.group` is a static method that creates a FormGroup. `FormBuilder.group` takes an object whose keys and values are 
`FormControl` names and their definitions. In this example, the username control is defined by its initial data value, 
an empty string.

Defining a group of controls in a single object makes for a compact, readable style. It beats writing an equivalent 
series of new FormControl(...) statements.

```js
import { FormBuilder } from "react-reactive-form";

const loginForm = FormBuilder.group({
  username: [''],
  password: [''],
});
```

#### Without FormBuilder ( Static Controls )

```js
import { FormGroup, FormControl } from "react-reactive-form";

const loginForm = new FormGroup({
  username: new FormControl(''),
  password: new FormControl(''),
})
```

#### Without initializing the controls ( Dynamic Controls )

You can also create controls without even initializing the group control object with the help of new react form components ( [FieldGroup](api/FieldGroup.md), [FieldControl](api/FieldControl.md), [FieldArray](api/FieldArray.md)).

For eg.

```ts
<FieldGroup
  render={({ value }) => (
  <form>
    <FieldControl
      name="test"
      render={({ handler }) => <input {...handler()}/>}
     />
     <pre>{value.toString()}</pre>
  </form>)}
/>
```
The above example will create an instance of [FormGroup](FormGroup.md) class which has a control named `test`.


### step2: Connect form with component
This steps is not needed if you're using dynamic controls but if you want a better control over your form state then you should do that, if your controls are dynamic then you can also initalize the empty group control and add the controls later.  
Example:

```js
import React, { Component } from 'react';
import {
    FormBuilder,
    FieldGroup,
    FieldControl,
    Validators,
 } from "react-reactive-form";

export default class Login extends Component {
    loginForm = FormBuilder.group({
        username: ["", Validators.required],
        password: ["", Validators.required],
        rememberMe: false
      });
    }
    handleReset=() => {
        this.loginForm.reset();
    }
    handleSubmit=(e) => {
        e.preventDefault();
        console.log("Form values", this.loginForm.value);
    }
    render() {
        return (
              <FieldGroup
                control={this.loginForm}
                render={({ get, invalid }) => (
                  <form onSubmit={this.handleSubmit}>
                    <FieldControl
                      name="username"
                      render={({ handler, touched, hasError }) => (
                        <div>
                          <input {...handler()}/>
                          <span>
                              {touched
                              && hasError("required")
                              && "Username is required"}
                          </span>
                        </div>  
                      )}
                    />
                    <FieldControl
                      name="password"
                      render={({ handler, touched, hasError }) => (
                        <div>
                          <input {...handler()}/>
                          <span>
                              {touched
                              && hasError("required")
                              && "Password is required"}
                          </span>
                        </div>  
                      )}
                    />
                    <FieldControl
                      name="rememberMe"
                      render={({handler}) => (
                        <div>
                          <input {...handler("checkbox")}/>
                        </div>
                      )}
                    />
                    <button
                      type="button"
                      onClick={this.handleReset}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={invalid}
                    >
                      Submit
                    </button>
                  </form>
                )}
              />
        );
    }
}
```
