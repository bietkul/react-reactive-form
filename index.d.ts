import * as React from "react";
import { Observable } from 'rxjs';
// import { FormBuilder } from './src/formBuilder';
// import Validators from './src/validators';
// import { FormGroup, FormControl, FormArray } from './src/model';
// import connect from './src/connect';
declare class AbstractControl {
    valueChanges: Observable<any>
}
export type ValidationErrors = {
    [key: string]: any
};
declare module "react-reactive-form" {
    export class FormBuilder {
        group(controlsConfig: {[key: string]: any}, extra?: {[key: string]: any}|null): FormGroup
    }
    export class FormArray  {}
    export class FormGroup extends AbstractControl {}
    export class FormControl {}
    export class Validators {
        static required(control: AbstractControl): ValidationErrors|null
    }
    export function reactiveForm(ReactComponent: React.SFC|React.ComponentClass<any>, formGroup: FormGroup):React.ComponentClass<any>;
}