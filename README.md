# React Reactive Forms
It's a library inspired by the angular's `Reactive Forms`, which allows to create a tree of form control objects in the component class and bind them with native form control elements.
# Features
- UI Independent.
- Nested forms.
- Not depends on any kind of state management library.
- Subscribers for value & status changes of controls.
- Provides a list of validators & also supports custom sync & async validators.
- Better form management with `FormGroup` & `FormArray` apis.
- Customizable update strategy for better performace with large forms.
# Installation
```sh
npm install react-reactive-form --save
```
# Basic Example
```import React, { Component } from 'react';
import { FormBuilder, Validators, reactiveForm } from "react-reactive-form";

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
# Documentation
* [Getting Started](docs/GettingStarted.md)
* [Examples](examples/)
* [API](docs/api/)
# Code Sandboxes
