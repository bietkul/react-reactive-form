# reactiveForm

To connect your components to reactive-form you need to use the reactiveForm method. 

It returns a higher order component which regulary provides control(mapped) props to your component.

```ts
reactiveForm(ReactComponent: React.SFC|React.ComponentClass<any>, form: FormGroup|FormArray):React.ComponentClass<any>
```
