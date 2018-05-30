
# FormGenerator
A react component which generates a tree of control objects & render the UI by keeping the same order in which the controls have been defined in `fieldConfig`.

## How it works
 - It creates a new instance of [FormGroup](FormGroup.md) ( if `controls` property is an object ) or 
  [FormArray](FormArray.md) ( if `controls` property is an array ) if the `control` property is not supplied.
 - It renders the form UI according to the control-component mapping by keeping the same order in which they have been
   defined in `fieldConfig`.
 - You can define a parent control by passing the `parent` property.
 - If a `control` prop is defined then it just returns the same.


## Props
```ts
onMount: (form: FormGroup|FormArray) => void 
```
A function callback called when a form has been rendered, the basic use case is to save the form instance for further uses.
## 
```ts
onUnmount: () => void
```
A function callback called when a form has been unmounted.
## 
```ts
fieldConfig: {[key: string]: any}
```
Field config has a set of properties which are required for the form configuration.

### Properties of `fieldConfig` 
```ts
controls: Array<{[key: string]: any}> | {[key: string]: any};
```
FormGenerator creates a [FormGroup](FormGroup.md) if the `controls` property is an object.

For example the following config will create a [FormGroup](FormGroup.md) with two form controls named `username` & `password` respectively.
```ts
const fieldConfig = {
  controls: {
    username: {
    ...
    },
    password: {
      ....
    }
  }
}
```

FormGenerator creates a [FormArray](FormArray.md) if the `controls` property is an array.

For example the following config will create a [FormArray](FormArray.md) with two form controls at index `0` & `1` respectively.

```ts
const fieldConfig = {
  controls: [
    {
      ... // item1
    },
    {
      ... // item2
    }
  ]
}
```

#### Nested Controls
You can also define the nested controls in the same way.

Example: Nested controls in `FormGroup`
```ts
const fieldConfig = {
  controls: {
    address: {
      controls: {
         city: {
           ...
         },
         country: {
           ...
         }
      }
    }
  }
}
```
The above example will create a structure like that:
```ts
{
  address: {
    city: "",
    country: ""
  }
}
```

Example: Nested controls in `FormArray`

```ts
const fieldConfig = {
  controls: [
    {
      // item1
      controls: {
        itemName: {
          ....
        },
        itemPrice: {
          ...
        }
      }
    }, 
    {
      // item2
    }
  ]
}
```
The above example will create a structure like that:
```ts
[
  {
    itemName: "",
    itemPrice: ""
  },
  "" // item2
]
```
##
```ts
formState: any|{ value: any, disabled: boolean }
```
You can use this property to define the initial state of the control.
### Note:
Only works with [FormControl](FormControl.md)

##
```ts
meta: {[key: string]: any};
```
You can pass an object of custom inputs to customize your component.

##
```ts
    render: (control: FormArray|FormControl|FormGroup) => React.ReactElement<any>|React.ReactElement<any>[];
```
A render function prop which returns a react component which needs to be re-render whenever the control state changes.

### Note:
Only works with [FormControl](FormControl.md)

For example: 
```ts
const fieldConfig = {
  controls: {
    username: {
      render: TextInput // some react component to render an input,
      meta: {
        label: "Username"
      }
    },
    password: {
      render: TextInput,
      meta: {
        label: "Password",
        type: "password"
      }
    }
  }
}
```
##

```ts
index: number
```
To define at which index the controls has to be inserted if the parent control is an instance of [FormArray](FormArray.md).

### Note:
Only works if the parent is [FormArray](FormArray.md).

##
```ts
options: AbstractControlOptions;
```
You can pass the [AbstractControlOptions](AbstractControlOptions.md) as `options` props.

For example: 
```ts
const fieldConfig = {
  controls: {
    username: {
      render: TextInput // some react component to render an input,
      meta: {
        label: "Username"
      }
      options: {
        validators: Validators.required,
        updateOn: 'blur'
      }
    },
    password: {
      render: TextInput,
      meta: {
        label: "Password",
        type: "password"
      },
      options: {
        validators: Validators.required,
      }
    }
  }
}
```


##
```ts
control: AbstractControl;
```
An instance of [AbstractControl](AbstractControl.md) control.

##
```ts
parent: AbstractControl;
```
An instance of [FormGroup](FormGroup.md) or [FormArray](FormArray.md) class as a parent control.

## Inject a component
FormGenerator generates the UI in the same order in which the controls have been defined in the `formConfig`, so sometime you may need to add a component in between the controls.
FormGenerator provides this facility by defining a `$field_` property to determine that the control is not need to be added so it just renders the component.

If the parent is `FormGroup` then you can inject a component by defining the control name starts with`$field_`.

For Example:
```ts
const fieldConfig = {
  controls: {
    $field_0: {
      render: () => <span>Username:</span>
    },
    username: {
      render: TextInput,
    },
    $field_1: {
      render: () => <span>Password:</span>
    },
    password: {
      render: TextInput,
      meta: {
        label: "Password",
        type: "password"
      }
    }
  }
}
```
If the parent is `FormArray` then you can inject a component by defining the control's index starts with`$field_`.

```ts
const fieldConfig = {
  controls: [
    {
      index: "$field_0"
      render: () => <span>Item1:</span>
    },
    {
      render: TextInput
    },
    {
      index: "$field_1"
      render: () => <span>Item2:</span>
    },
    {
      render: TextInput
    }
  ]
}
```
You can also access the root control object by using the `$field_` control & subscribe the component for the form state changes by just defining the `isStatic` property as `false`.

For example:

```ts
const fieldConfig = {
  controls: {
    username: {
      render: TextInput,
    },
    password: {
      render: TextInput,
      meta: {
        label: "Password",
        type: "password"
      }
    },
    $field_0: {
      isStatic: false,
      render: ({ invalid }) => <button disabled={invalid}>Submit</button>
    },
  }
}
```
