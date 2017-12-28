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

There are two ways to create these:

#### With FormBuilder
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

#### Without FormBuilder

```js
import { FormGroup, FormControl } from "react-reactive-form";

const loginForm = new FormGroup({
  username: new FormControl(''),
  password: new FormControl(''),
})
```

### step2: Connect form with component
[Field](api/Field.md) component subscribes a particular control & only update it when it’s or it’s parent’s state changes, which improves the performance by restricting the unnecessary re-rendering of other fields.  

```js
import React, { Component } from 'react';
import { FormBuilder, Validators, Field } from "react-reactive-form";

export default class Login extends Component {
    constructor(props) {
      super(props);
      // Create the controls
      this.loginForm = FormBuilder.group({
        username: ["", Validators.required],
        password: ["", Validators.required],
        rememberMe: false
      });
    }
    handleReset=(e) => {
        this.loginForm.reset();
        e.preventDefault();
    }
    handleSubmit=(e) => {
        console.log("Form values", this.loginForm.value);
        e.preventDefault();
    }
    render() {
        return (
              <Field
                control={this.loginForm}
                render={({ get, invalid }) => (
                  <form onSubmit={this.handleSubmit}>
                    <Field
                      control={get("username")}
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
                    <Field
                      control={get("password")}
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
                    <Field
                      control={get("rememberMe")}
                      render={({handler}) => (
                        <div>
                          <input {...handler("checkbox")}/>
                        </div>
                      )}
                    />
                    <button 
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
