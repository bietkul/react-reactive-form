// import React, { Component } from 'react';
import FormControl from './formControl';
import FormGroup from './formGroup';

export default class FormBuilder {
  group(formFieldsObj) {
    const formControls = [];
    if (formFieldsObj) {
      Object.keys(formFieldsObj).forEach((fieldName) => {
        // Create a form controller with name, value, validator & disabled
        const formController = new FormControl(fieldName, formFieldsObj[fieldName][0], formFieldsObj[fieldName][1]);
        formControls.push(formController);
      });
    }
    return new FormGroup(formControls);
  }
}
