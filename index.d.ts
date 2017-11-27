import * as React from "react";
import { FormBuilder } from './src/formBuilder';
import Validators from './src/validators';
import { FormGroup, FormControl, FormArray } from './src/model';
import connect from './src/connect';
declare module "react-reactive-form" {
    export class FormBuilder {}
    export class FormArray {}
    export class FormGroup {}
    export class FormControl {}
    export class Validators {}
    export function connect (ReactComponent: React.Component, formGroup: FormGroup): React.Component;
}
