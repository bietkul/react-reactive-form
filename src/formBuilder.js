// import React, { Component } from 'react';
import { FormControl, FormArray, FormGroup, AbstractControl } from './model';

export default class FormBuilder {
  // group(formFieldsObj) {
  //   const formControls = [];
  //   if (formFieldsObj) {
  //     Object.keys(formFieldsObj).forEach((fieldName) => {
  //       if (formFieldsObj[fieldName] instanceof FormGroup) {
  //         const formGroup = formFieldsObj[fieldName];
  //         const formController = new FormControl(fieldName, formGroup.value, null);
  //         console.log('SUCCESS WE GOT HERE ======>', formGroup);
  //         formControls.push(formController);
  //       } else {
  //         // Create a form controller with name, value, validator & disabled
  //         const formController = new FormControl(fieldName, formFieldsObj[fieldName][0], formFieldsObj[fieldName][1]);
  //         formControls.push(formController);
  //       }
  //     });
  //   }
  //   return new FormGroup(formControls);
  // }
  group(controlsConfig: {[key: string]: any}, extra: {[key: string]: any}|null = null): FormGroup {
    const controls = this._reduceControls(controlsConfig);
    const validator = extra != null ? extra.validator : null;
    const asyncValidator = extra != null ? extra.asyncValidator : null;
    return new FormGroup(controls, validator, asyncValidator);
  }
  /** First argument in form state you can set the initial form state
   * for e.g {value: 'Something', disabled: true}
   * Second argument is the validators
   * Third argument is the async validator
   */
  control(formState, validator, asyncValidator): FormControl {
    return new FormControl(formState, validator, asyncValidator);
  }
  _reduceControls(controlsConfig: {[k: string]: any}): {[key: string]: AbstractControl} {
    const controls: {[key: string]: AbstractControl} = {};
    Object.keys(controlsConfig).forEach((controlName) => {
      controls[controlName] = this._createControl(controlsConfig[controlName]);
    });
    return controls;
  }
  _createControl(controlConfig: any): AbstractControl {
    if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
        controlConfig instanceof FormArray) {
      return controlConfig;
    } else if (Array.isArray(controlConfig)) {
      const value = controlConfig[0];
      const validator = controlConfig.length > 1 ? controlConfig[1] : null;
      const asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
      return this.control(value, validator, asyncValidator);
    }
    return this.control(controlConfig);
  }
}
