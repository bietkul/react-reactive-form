
# FormGenerator
A react component which generates a new tree of control objects or can be used with an existing control tree & assign the components to the controls.

## How it works
 - It creates a new instance of [FormControl](FormControl.md) if the `name` prop is defined.
 - If a `name` prop is defined then it means that the control has to be added in an already existing parent control (  [FormGroup](FormGroup.md) / [FormArray](FormArray.md)) i.e the parent control must be present.
 - If a control with the same name is already present in the parent control then it just returns the same otherwise it'll create a new instance of [FormControl](FormControl.md) class. 
 - You can define a parent control either by passing the `parent` prop or using the component as a child of the `FieldArray` or `FieldGroup` component.
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
name: string;
```
Name of the control.

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

##
```ts
meta: {[key: string]: any};
```
You can pass an object of custom variables to customize your component.

For example:

```ts
<FieldControl
  meta={{
    label: "First Name",
    placeholder: "Enter your first name"
  }}
 ...
/>
```
