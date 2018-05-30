
# FormGenerator
A react component which generates a tree of control objects or can be append to an existing control tree & renders the associated React components in the same order.

## How it works
 - It creates a new instance of [FormGroup](FormGroup.md) ( if `controls` property is an object ) or [FormArray]
   (FormArray.md) ( if `controls` property is an array ).
 - It renders the UI of the form according to associated components to the controls by keeping the same order in which they    have been defined in `fieldConfig`.
 - You can define a parent control by passing the `parent` property.
 - If a `control` prop is defined then it just returns the same.


## Props

## fieldConfig

Checkout these properties of controls
```ts
controls: Array<{[key: string]: any}> | {[key: string]: any};
```
Controls as an object
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
Controls as an array
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
Nested Controls in object
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

Nested Controls In array

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
##

```ts
formState: any|{ value: any, disabled: boolean }
```
You can use this prop to define the initial state of the control.
##
```ts
meta: {[key: string]: any};
```
##
You can pass an object of custom variables to customize your component.
```ts
    render: (control: FormArray|FormControl|FormGroup) => React.ReactElement<any>|React.ReactElement<any>[];
```
A render function prop which returns a react component which needs to be re-render whenever the control state changes.
You can also pass a render function as a child.

##
```ts
control: AbstractControl;
```
An instance of [AbstractControl](AbstractControl.md) control.

##

```ts
index: number
```
To define at which index the controls has to be inserted if the parent control is an instance of [FormArray](FormArray.md).

##
```ts
options: AbstractControlOptions;
```
You can pass the [AbstractControlOptions](AbstractControlOptions.md) as `options` props.

##
```ts
parent: AbstractControl;
```
An instance of [FormGroup](FormGroup.md) or [FormArray](FormArray.md) class as a parent control.



