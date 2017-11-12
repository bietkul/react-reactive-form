import _ from 'lodash';
import { Subject } from 'rxjs';
import FormControl from './formControl';


export default class FormGroup extends FormControl {
  constructor(controls) {
    super();
    this.controls = controls;
    this.valueChanges = new Subject();
    this.statusChanges = new Subject();
    this.updateDOM = new Subject();
    Object.keys(controls).forEach((key) => {
      const formName = controls[key].name;
      const formController = this.get(formName);
      formController.parent = this;
      formController.valueChanges.subscribe(() => {
        this.valueChanges.next(this.value);
      }, (error) => {
        console.log(error);
      }, () => {
        console.log('Complete');
      });
      formController.statusChanges.subscribe(() => {
        this.statusChanges.next(this.status);
      }, (error) => {
        console.log(error);
      }, () => {
        console.log('Complete');
      });
      formController.updateDOM.subscribe(() => {
        this.updateDOM.next();
      }, (error) => {
        console.log(error);
      }, () => {
        console.log('Complete');
      });
    });
  }
  get(formControlName) {
    return _.find(this.controls, formControl => formControl.name === formControlName);
  }
  get value() {
    const value = {};
    this.controls.forEach((control) => {
      value[control.name] = control.value;
    });
    return value;
  }
   /**
   * Runs the validators for all controls
   * @param {Component} ReactComponent
   * @param {FormGroup} formGroup
   * @return {Component} connect
   */
  runValidators() {
    this.controls.forEach((control) => {
      FormGroup.validateControl(control);
    });
  }
  /**
   * Runs the validators for a particular control
   * @param {FormControl} control
   */
  static validateControl(control: FormControl) {
    const formControl = control;
    formControl.errors = {};
    if (formControl.validator) {
      formControl.validator.forEach((validator) => {
        const error = validator(formControl.value);
        if (error) {
          const errorKey = Object.keys(error)[0];
          formControl.errors[errorKey] = error[errorKey];
        }
      });
    }
  }
}
