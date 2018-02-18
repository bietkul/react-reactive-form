
# FieldGroup
A react component which creates a new or can be used with an existing [FormGroup](FormGroup.md) control.

## How it works
 - It creates a new instance of [FormGroup](FormGroup.md) in absence of the `name` and `control` props.
 - If a `name` prop is defined then it means that the control has to be added in an already existing parent control (  [FormGroup](FormGroup.md) / [FormArray](FormArray.md)) i.e the parent control must be present.
 - If a control with the same name is already present in the parent control then it just returns the same otherwise it'll create a new instance of [FormGroup](FormGroup.md) class. 
 - You can define a parent control either by passing the `parent` prop or using the component as a child of the `FieldGroup` component.
 - If a `control` prop is defined then it just returns the same.


## Props
```ts
strict: boolean;
```
Default value: `true`

If `true` then it'll only re-render the component only when any change happens in the form group control irrespective of the parent component(state and props) changes.

##

```ts
    render: (control: FormArray|FormControl|FormGroup) => React.ReactElement<any>|React.ReactElement<any>[];
```
A render function prop which returns a react component which needs to be re-render whenever the control state changes.
You can also pass a render function as a child.
For eg.

```ts
  <FieldGroup ...>
  {
    (control) => <SomeComponent/>
  }
  </FieldGroup>
```

##
```ts
control: AbstractControl;
```
An instance of [FormGroup](FormGroup.md) control.

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

For eg.

```ts
<FieldGroup
  options={{
    validators: Validators.required,
    updateOn: 'blur'
  }}
/>
```

##
```ts
parent: AbstractControl;
```
An instance of FormGroup or FormArray class as a parent control.
