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
    handleReset=(e) => {
        this.loginForm.reset();
    }
    handleSubmit=(e) => {
        console.log("Form values", this.loginForm.value);
        e.preventDefault();
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
## Add Dynamic Control
You can also create dynamic controls without even initializing the group control object with the help of new react form components ( [FieldGroup](docs/api/FieldGroup.md), [FieldControl](docs/api/FieldControl.md), [FieldArray](docs/api/FieldArray.md)).

```js
import React, { Component } from 'react';
import {
    FieldGroup, 
    FieldControl,
    Validators
 } from "react-reactive-form";

export default class Login extends Component {
    handleSubmit=(e, value) => {
        console.log("Form values", value);
        e.preventDefault();
    }
    render() {
        return (
              <FieldGroup
                render={({ get, invalid, reset, value }) => (
                  <form onSubmit={(e) => this.handleSubmit(e, value)}>
                    <FieldControl
                      name="username"
                      options={{ validators: Validators.required }}
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
                      options={{ validators: Validators.required }}
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
                      onClick={() => reset()}
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
<b>So, it's not necessary that you should define your control separately but if you need the better control then you should do that, if your controls are dynamic then you can also initalize the empty group control and add the controls later.
See the example:</b>

```js
import React, { Component } from 'react';
import {
    FormBuilder,
    FieldGroup, 
    FieldControl,
    Validators
 } from "react-reactive-form";

export default class Login extends Component {
    // Initialize the empty group control
    loginForm = FormBuilder.group({});
    
    handleReset=(e) => {
        this.loginForm.reset();
    }
    handleSubmit=(e) => {
        console.log("Form values", this.loginForm.value);
        e.preventDefault();
    }
    render() {
        return (
              <FieldGroup
                control={this.loginForm}
                render={({ get, invalid, reset, value }) => (
                  <form onSubmit={this.handleSubmit}>
                    <FieldControl
                      name="username"
                      options={{ validators: Validators.required }}
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
                      options={{ validators: Validators.required }}
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

## The best practice
# Documentation
* [Getting Started](docs)
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
