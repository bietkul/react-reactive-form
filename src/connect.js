import React, { Component } from 'react';
import { FormGroup, FormArray, FormControl } from './model';
import { isReactNative } from './utils';



// React
const propsToBeMap = {
  value: 'value',
  touched: 'touched',
  untouched: 'untouched',
  disabled: 'disabled',
  enabled: 'enabled',
  invalid: 'invalid',
  valid: 'valid',
  pristine: 'pristine',
  dirty: 'dirty',
  errors: 'errors',
  hasError: 'hasError',
  status: 'status',
}
const controlsToBeMap = {
  ReactNative: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur',
    editable: 'enabled',
    disabled: 'disabled',
  },
  default: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur',
    disabled: 'disabled',
  }
}
const inputControls = isReactNative() ? controlsToBeMap.ReactNative : controlsToBeMap.default;
function mapControlToProps(control: FormControl|FormGroup) {
  const mappedObject = {};
  const controlObject = {};
  Object.keys(propsToBeMap).forEach((key) => {
    const controlProperty = control[propsToBeMap[key]];
    mappedObject[key] = controlProperty;
  });
  if(control instanceof FormControl) {
    Object.keys(inputControls).forEach((key) => {
      const controlProperty = control[inputControls[key]];
      controlObject[key] = controlProperty;
    });
    mappedObject['input'] = controlObject;
  }
  return mappedObject;
}
function mapNestedControls(control: FormControl, name: String) {
  var extraProps = {};
  extraProps[name] = mapControlToProps(control);
  if(control instanceof FormGroup|FormArray && control.controls) {
    Object.keys(control.controls).forEach((childControlName) => {
      // extraProps[controlName+'.'+childControlName] = mapControlToProps(control.controls[childControlName]);
      extraProps = Object.assign(extraProps, mapNestedControls(control.controls[childControlName], name+'.'+childControlName));
    })
  }
  return extraProps;
}
function mapProps(formControls) {
  let extraProps = {};
  if (formControls) {
    Object.keys(formControls).forEach((controlName) => {
      const control = formControls[controlName];
      if (control) {
        extraProps = Object.assign(extraProps, mapNestedControls(control, controlName));
      }
    });
  }
  return extraProps;
}
/**
 * Higher order component
 * @param {Component} ReactComponent
 * @param {FormGroup} formGroup
 * @return {Component} connect
 */
function connect(ReactComponent, formGroup) {
  const formControls = formGroup.controls;
  const extraProps = mapProps(formControls);
  console.log('THIS IS FORM', formGroup.updateDOM);
  mapProps(formControls);
  class Connect extends Component {
    constructor(props) {
      super(props);
      this.state = {
        extraProps
      };
    }
    componentDidMount() {
      // Add listeners
      // formGroup.updateDOM.subscribe(() => {
      //   if (this.myForm) {
      //     this.updateComponent();
      //   }
      // }, (error) => {
      //   console.log(error);
      // });
      formGroup.statusChanges.subscribe(() => {
        if (this.myForm) {
          this.updateComponent();
        }
      }, (error) => {
        console.log(error);
      });
      formGroup.valueChanges.subscribe(() => {
        if (this.myForm) {
          this.updateComponent();
        }
      }, (error) => {
        console.log(error);
      });
    }
    componentWillUnmount() {
      // Remove listeners
      // if (formGroup.updateDOM.observers) {
      //   formGroup.updateDOM.observers.forEach((observer) => {
      //     observer.unsubscribe();
      //   });
      // }
    }
    updateComponent = () => {
      this.setState({
        extraProps: mapProps(formControls)
      });
    }
    render() {
      return (
        <ReactComponent ref={(c) => { this.myForm = c; }} {...this.props} {...this.state.extraProps} />
      );
      // return (
      //   <ReactComponent ref={(c) => { this.myForm = c; }} {...this.props} />
      // );
    }
}
  return Connect;
}
export default connect;
