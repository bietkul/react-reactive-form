# React Reactive Forms
[![Build Status](https://travis-ci.org/bietkul/react-reactive-form.svg?branch=master)](https://travis-ci.org/bietkul/react-reactive-form)
[![NPM Version](https://img.shields.io/npm/v/react-reactive-form.svg?style=flat)](https://www.npmjs.com/package/react-reactive-form)

It's a library inspired by the [Angular's Reactive Forms](https://angular.io/guide/reactive-forms), which allows to create a tree of form control objects in the component class and bind them with native form control elements.
# Features
- UI independent.
- Zero dependencies. 
- Nested forms.
- Subscribers for value & status changes of controls.
- Provides a set of validators & also supports custom sync & async validators.
- Better form management with `FormGroup` & `FormArray` apis.
- Customizable update strategy for better performace with large forms.
# Installation
```sh
npm install react-reactive-form --save
```
# Basic Example

```js
import React, { Component } from 'react';
import { FormBuilder, Validators, Field } from "react-reactive-form";
import { AbstractControl } from "react-reactive-form";

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
# Documentation
* [Getting Started](docs/GettingStarted.md)
* [API](docs/api/)
# Code Sandboxes
Try out `react-reactive-forms` in these sandbox versions of the Examples.
* [Simple Form](https://codesandbox.io/s/4rxokpr270)
* [Sync & Async Validation](https://codesandbox.io/s/qq8xq7j2w)
* [User Registeration Form With Nested Forms](https://codesandbox.io/s/p2rqmr8qk7)
* [Form Array With Dynamic Controls](https://codesandbox.io/s/nw9wxw2nvl)
* [Update On Submit](https://codesandbox.io/s/3qk1ly16j1)

Let's make React Reactive Forms better! If you're interested in helping, all contributions are welcome and appreciated.

And don't forget to star the repo, I will ensure more frequent updates! Thanks!
