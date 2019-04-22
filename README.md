<p align="center">
  <img src="logo.png" alt="React Native Game Engine" height="120" />
</p>

# React Reactive Forms

[![Build Status](https://travis-ci.org/bietkul/react-reactive-form.svg?branch=master)](https://travis-ci.org/bietkul/react-reactive-form)
[![Backers on Open Collective](https://opencollective.com/react-reactive-form/backers/badge.svg)](#backers) 
[![Sponsors on Open Collective](https://opencollective.com/react-reactive-form/sponsors/badge.svg)](#sponsors) 
[![NPM Version](https://img.shields.io/npm/v/react-reactive-form.svg?style=flat)](https://www.npmjs.com/package/react-reactive-form)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
<img 
    alt="gzip size"
    src="https://img.shields.io/badge/gzip%20size-7%20kB-brightgreen.svg"
  />
<a href="https://github.com/bietkul/react-reactive-form/pulls">
    <img
      alt="PRs welcome"
      src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
    />
 </a>

It's a library inspired by the [Angular's Reactive Forms](https://angular.io/guide/reactive-forms), which allows to create a tree of form control objects in the component class and bind them with native form control elements.

# Features

* UI independent.
* Zero dependencies.
* Nested forms.
* Subscribers for value & status changes of controls.
* Provides a set of validators & also supports custom sync & async validators.
* `FormGenerator` api to create large forms with less code.
* Better form management with `FormGroup` & `FormArray` apis.
* Customizable update strategy for better performace with large forms.

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

const TextInput = ({ handler, touched, hasError, meta }) => (
  <div>
    <input placeholder={`Enter ${meta.label}`} {...handler()}/>
    <span>
        {touched
        && hasError("required")
        && `${meta.label} is required`}
    </span>
  </div>  
)
export default class Login extends Component {
    loginForm = FormBuilder.group({
        username: ["", Validators.required],
        password: ["", Validators.required],
        rememberMe: false
    });
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
                      render={TextInput}
                      meta={{ label: "Username" }}
                    />

                    <FieldControl
                      name="password"
                      render={TextInput}
                      meta={{ label: "Password" }}
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
## Using [FormGenerator](docs/api/FormGenerator.md)
```js
import React, { Component } from 'react';
import {
    Validators,
    FormGenerator
 } from "react-reactive-form";
// Input component
const TextInput = ({ handler, touched, hasError, meta }) => (
  <div>
    <input placeholder={`Enter ${meta.label}`} {...handler()}/>
    <span>
        {touched
        && hasError("required")
        && `${meta.label} is required`}
    </span>
  </div>  
)
// Checkbox component
const CheckBox = ({ handler }) => (
    <div>
      <input {...handler("checkbox")}/>
    </div>
  )
// Field config to configure form
const fieldConfig = {
    controls: {
        username: {
            options: {
                validators: Validators.required
            },
            render: TextInput,
            meta: { label: "Username" }
        },
        password: {
            options: {
                validators: Validators.required
            },
            render: TextInput,
            meta: { label: "Password" }
        },
        rememberMe: {
            render: CheckBox
        },
        $field_0: {
            isStatic: false,
            render: ({ invalid, meta: { handleReset } }) => (
                <div>
                    <button
                      type="button"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={invalid}
                    >
                      Submit
                    </button>
                </div>
            )
        }
    },
}
export default class Login extends Component {
    handleReset=() => {
        this.loginForm.reset();
    }
    handleSubmit=(e) => {
        e.preventDefault();
        console.log("Form values", this.loginForm.value);
    }
    setForm = (form) => {
        this.loginForm = form;
        this.loginForm.meta = {
            handleReset: this.handleReset
        }
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGenerator
                    onMount={this.setForm}
                    fieldConfig={fieldConfig}
                />
            </form>
        );
    }
}
```
## Add Controls Dynamically

You can also create controls without even initializing the group control object with the help of new react form components ( [FieldGroup](docs/api/FieldGroup.md), [FieldControl](docs/api/FieldControl.md), [FieldArray](docs/api/FieldArray.md)).

```js
import React, { Component } from 'react'
import { FieldGroup, FieldControl, Validators } from 'react-reactive-form'

export default class Login extends Component {
  handleSubmit = (e, value) => {
    console.log('Form values', value)
    e.preventDefault()
  }
  render() {
    return (
      <FieldGroup
        render={({ get, invalid, reset, value }) => (
          <form onSubmit={e => this.handleSubmit(e, value)}>
            <FieldControl
              name="username"
              options={{ validators: Validators.required }}
              render={({ handler, touched, hasError }) => (
                <div>
                  <input {...handler()} />
                  <span>
                    {touched && hasError('required') && 'Username is required'}
                  </span>
                </div>
              )}
            />
            <FieldControl
              name="password"
              options={{ validators: Validators.required }}
              render={({ handler, touched, hasError }) => (
                <div>
                  <input {...handler()} />
                  <span>
                    {touched && hasError('required') && 'Password is required'}
                  </span>
                </div>
              )}
            />
            <FieldControl
              name="rememberMe"
              render={({ handler }) => (
                <div>
                  <input {...handler('checkbox')} />
                </div>
              )}
            />
            <button type="button" onClick={() => reset()}>
              Reset
            </button>
            <button type="submit" disabled={invalid}>
              Submit
            </button>
          </form>
        )}
      />
    )
  }
}
```

<b>So, it's not mandatory that you need to define your control separately but if you want a better control over your form state then you should do that, if your controls are dynamic then you can also initalize the empty group control and add the controls later.
See the example:</b>

```js
import React, { Component } from 'react'
import {
  FormBuilder,
  FieldGroup,
  FieldControl,
  Validators
} from 'react-reactive-form'

export default class Login extends Component {
  // Initialize the empty group control
  loginForm = FormBuilder.group({})

  handleReset = e => {
    this.loginForm.reset()
  }
  handleSubmit = e => {
    console.log('Form values', this.loginForm.value)
    e.preventDefault()
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
                  <input {...handler()} />
                  <span>
                    {touched && hasError('required') && 'Username is required'}
                  </span>
                </div>
              )}
            />
            <FieldControl
              name="password"
              options={{ validators: Validators.required }}
              render={({ handler, touched, hasError }) => (
                <div>
                  <input {...handler()} />
                  <span>
                    {touched && hasError('required') && 'Password is required'}
                  </span>
                </div>
              )}
            />
            <FieldControl
              name="rememberMe"
              render={({ handler }) => (
                <div>
                  <input {...handler('checkbox')} />
                </div>
              )}
            />
            <button type="button" onClick={this.handleReset}>
              Reset
            </button>
            <button type="submit" disabled={invalid}>
              Submit
            </button>
          </form>
        )}
      />
    )
  }
}
```

# Documentation

* [Getting Started](docs)
* [API](docs/api/)

# Code Sandboxes
  Try out `react-reactive-forms` in these sandbox versions of the Examples.
* [Simple Form](https://codesandbox.io/s/4rxokpr270)
* [Simple Form With FormGenerator](https://codesandbox.io/s/jpkjny836v)
* [Sync & Async Validation](https://codesandbox.io/s/qq8xq7j2w)
* [User Registeration Form With Nested Forms](https://codesandbox.io/s/p2rqmr8qk7)
* [Form Array With Dynamic Controls](https://codesandbox.io/s/nw9wxw2nvl)
* [Update On Submit](https://codesandbox.io/s/3qk1ly16j1)
* [Multi-page Wizard Form](https://codesandbox.io/s/136340om74)


# FAQ

### How is it different from other form libraries?

React has many libraries which works on the form logic, but here are some concerns with these:

#### Code Complexity
If you’re using the redux-form then you should know the pain, for just a two field login form you’d to write the store logic.In RRF you can see that how simple is to deal with simple and complex forms.

`And one of the awesome thing is that you can just write your form controls logic anywhere in your application.`

#### Dependencies
Many libraries come with dependencies for e.g redux is required for redux-form, So what If I’m using another state management or not event using any.
According to Dan Abramov, form state is inherently ephemeral and local, so tracking it in Redux (or any kind of Flux library) is unnecessary.
RRF comes with `zero` dependency, So it’s totally up to you that how you want to save your form state if needed.

#### Performance
Now that’s a big problem with almost all libraries when you're dealing with large forms.

How RRF does solve performance issues ?
- It uses subscription to update the components so rather updating all the fields on every input changes, it only update the particular field for which the state change takes place.
- RRF has a nice option to define that when(blur, submit or change) to update your form's state by using the `updateOn` property.

#### Dynamic Changes
With the help of subscribers it's pretty easy to listen for a particular state changes and modify the controls accordingly.


### What are `value` and `status` changes subscribers?

RRF uses inbuilt `Subject`, A `Subject` is an object with the method next(v).To feed a new value to the Subject,RRF just calls the next(theValue), and it will be multicasted to the Observers registered to listen to the Subject.
So basically it provides three subjects for each AbstractControl `valueChanges`, `statusChanges` and `stateChanges` and additional two subjects for FormControl ( `onValueChanges`, `onBlurChanges`)
You can register an observer to a particular Subject to do some actions whenever some particular changes happen.

Example:

```ts
componentDidMount() {
  this.myForm.get(“gender”).valueChanges.subscribe((value) => {
    // do something
  })
}
```
Checkout the [Basic usage guide](docs) for more details.

### How the Field components work?

Field components are subscribed to the state changes of a particular control which means that it’ll re-render the component only when it’s state changes disregarding of other field changes.You can also implement your custom wrappers by using the stateChanges `Subject`.

### How updateOn feature works?

Its an another performance booster in RRF, it just holds the computation needed to be made after every keystroke or value changes until you want to execute.It has three options `change`(default), `blur` and `submit`, you can define all of them at both field and record level.

### Is this library compatible with React Native?

Yes, this library works with react-native also, currently it supports react-native `TextInput` and `Switch` component.

### Note: 
If you're using react-native then please add the following line of code in `index.js` of your project to avoid error in android devices.

```js
import "core-js/es6/symbol";
import "core-js/fn/symbol/iterator";
```


Let's make React Reactive Forms better! If you're interested in helping, all contributions are welcome and appreciated.

And don't forget to star the repo, I will ensure more frequent updates! Thanks!

## Contributors

This project exists thanks to all the people who contribute. 
<a href="https://github.com/bietkul/react-reactive-form/graphs/contributors"><img src="https://opencollective.com/react-reactive-form/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/react-reactive-form#backer)]

<a href="https://opencollective.com/react-reactive-form#backers" target="_blank"><img src="https://opencollective.com/react-reactive-form/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/react-reactive-form#sponsor)]

<a href="https://opencollective.com/react-reactive-form/sponsor/0/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/1/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/2/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/3/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/4/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/5/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/6/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/7/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/8/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/react-reactive-form/sponsor/9/website" target="_blank"><img src="https://opencollective.com/react-reactive-form/sponsor/9/avatar.svg"></a>


