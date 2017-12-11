# Abstract Control

This is the base class for [FormControl](FormControl.md), [FormGroup](FormGroup.md), and [FormArray](FormArray.md).

It provides some of the shared behavior that all controls and groups of controls have, like running validators, 
calculating status, and resetting state. It also defines  the properties that are shared between all sub-classes, 
like value, valid, and dirty. It shouldn't be instantiated directly.

## Overview
### Subclasses
* [FormControl](FormControl.md)
* [FormGroup](FormGroup.md)
* [FormArray](FormArray.md)

### Constructor
```ts
constructor(validator: ValidatorFn | null, asyncValidator: AsyncValidatorFn | null)
```
