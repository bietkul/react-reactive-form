# Getting Started With `react-reactive-form`
The basic implementation of reactive forms is super easy but it may be helpful to read a brief description of the core form classes.
* [Abstract Control](api/AbstractControl.md)
* [Form Group](api/FormGroup.md)
* [Form Array](api/FormArray.md)
* [Form Control](api/FormControl.md)
* [Form Builder](api/FormBuilder.md)
## Overview
There are two ways to connect your components to reactive-form.

### By using `reactiveForm`
You can use the [`reactiveForm`](api/ReactiveForm.md) method. It returns a higher order component 
which regulary provides control(mapped) props to your component.
```ts
reactiveForm(ReactComponent: React.SFC|React.ComponentClass<any>, form: FormGroup|FormArray):React.ComponentClass<any>
```

### By using `Field` ( recommended )

For better performance with large forms & [Form Array’s](api/FormArray.md) it’s highly recommended to use the [Field](api/Field.md) component instead of `reactiveForm` method.

`Field` component subscribes a particular control & only update it when it’s or it’s parent’s state changes, which of course reduces the re-rendering and boost the performance significantly.


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

### With `reactiveForm`

Use the `reactiveForm` method to connect your form group or array to the Component in which you want to use input handlers.
Now you'll start receiving the [mapped control props](api/Props.md) with input handlers.  

In below given example `username.handler` is a function which binds the input element to the `username` control.

```js
import React, { Component } from 'react';
import { FormBuilder, Validators, reactiveForm } from "./react-reactive-form";

// Create the controls
const loginForm = FormBuilder.group({
  username: ['', Validators.required],
  password: ['', Validators.required],
  rememberMe: false
});

class Login extends Component {
    handleReset=(e) => {
        loginForm.reset();
        e.preventDefault();
    }
    handleSubmit=(e) => {
        console.log("Form values", loginForm.value);
        e.preventDefault();
    }
    render() {
        const { 
            username, 
            password, 
            rememberMe 
        } = this.props;
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <input {...username.handler()}/>
                    <span>
                        {username.touched 
                        && username.hasError('required')
                        && "Username is required"}
                    </span>
                </div>
                <div>
                    <input {...password.handler()}/>
                    <span>
                        {password.touched 
                        && password.hasError('required') 
                        && "Password is required"}
                    </span>
                </div>
                <div>
                    <input {...rememberMe.handler('checkbox')}/>
                </div>
                <button onClick={this.handleReset}>Reset</button>
                <button type="submit">Submit</button>
            </form>
        );
    }
}
// React HOC to connect form with component.
export default reactiveForm(Login, loginForm);

```

### With `Field`
[Field](api/Field.md) subscribes the component to a particular control's state changes which improves the performance by restricting the re-rendering of other fields.  

```js
import React, { Component } from 'react';
import { FormBuilder, Validators, Field } from "react-reactive-form";
import { AbstractControl } from "react-reactive-form";

// Create the controls
const loginForm = FormBuilder.group({
  username: ["", Validators.required],
  password: ["", Validators.required],
  rememberMe: false
});

export default class Login extends Component {
    handleReset=(e) => {
        loginForm.reset();
        e.preventDefault();
    }
    handleSubmit=(e) => {
        console.log("Form values", loginForm.value);
        e.preventDefault();
    }
    render() {
        return (
              <Field
                control={loginForm}
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
