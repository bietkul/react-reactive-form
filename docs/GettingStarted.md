# Getting Started With `react-reactive-form`
The basic implementation of reactive forms is super easy but it may be helpful to read a brief description of the core form classes.
* [Abstract Control](api/AbstractControl)
* [Form Group](api/FormGroup)
* [Form Array](api/FormArray)
* [Form Control](api/FormControl)
* [Form Builder](api/FormBuilder)
## Overview
To connect your components to reactive-form you need to use the `reactiveForm` method. It returns a higher order component 
which regulary provides control(mapped) props to your component.

```reactiveForm(ReactComponent: React.SFC|React.ComponentClass<any>, form: FormGroup|FormArray):React.ComponentClass<any>```
## Basic Usage Guide
It may be helpful to read a brief description of the core form classes.
* [Abstract Control](api/AbstractControl)
* [Form Control](api/FormControl)
* [Form Group](api/FormGroup)
* [Form Array](api/FormArray)
### step 1: Create FormGroup or FormArray
A form group is a collection object of form controls & form array is the collection array of form controls.

There are two ways to create these:

#### With FormBuilder
The FormBuilder class helps reduce repetition and clutter by handling details of control creation for you.
`FormBuilder.group` is a method that creates a FormGroup. `FormBuilder.group` takes an object whose keys and values are 
`FormControl` names and their definitions. In this example, the username control is defined by its initial data value, 
an empty string.

Defining a group of controls in a single object makes for a compact, readable style. It beats writing an equivalent 
series of new FormControl(...) statements.

```js
import { FormBuilder } from "react-reactive-form";

const fb = new FormBuilder();
const loginForm = fb.group({
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
Use the `reactiveForm` method to connect your form group or array to the Component in which you want to use input handlers.
Now you'll start receiving the [mapped control props](api/Props) with input handlers.  
```js
import React, { Component } from 'react';
import { FormBuilder, reactiveForm } from "react-reactive-form";

const fb = new FormBuilder();
const loginForm = fb.group({
  username: [''],
  password: [''],
});
class Login extends Component {
...
}
export default reactiveForm(Login, loginform);
```

### step3: Use handlers to bind input elements
In below given example `username.handler` is a function which binds the input element to the `username` control.
```js
import React, { Component } from 'react';
import { FormBuilder, Validators, reactiveForm } from "./react-reactive-form";

// Create the controls
const fb = new FormBuilder();
const loginForm = fb.group({
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





















