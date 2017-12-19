import React from 'react';
import { FormGroup, FormArray, FormControl } from './model';
import { getHandler, propsToBeMap } from './utils';

/**
 * @param {FormControl|FormGroup|FormArray} control
 */
function mapControlToProps(control) {
  const mappedObject = {};
  Object.keys(propsToBeMap).forEach((key) => {
    const controlProperty = control[propsToBeMap[key]];
    mappedObject[key] = controlProperty;
  });
  if(control instanceof FormControl) {
    mappedObject['handler'] = (inputType, value) => getHandler(inputType, value, control);
  }
  return mappedObject;
}
/**
 * @param {FormControl|FormGroup|FormArray} control
 * @param {String} name
 */
function mapNestedControls(control, name) {
  var extraProps = {};
  extraProps[name] = mapControlToProps(control);
  if(control instanceof FormGroup && control.controls) {
    Object.keys(control.controls).forEach((childControlName) => {
      extraProps[name] = Object.assign(extraProps[name], mapNestedControls(control.controls[childControlName], childControlName));
    })
  } else if(control instanceof FormArray && control.controls) {
    extraProps[name]['controls'] = control.controls;
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
 * @return {Component} reactiveForm
 */
function reactiveForm(ReactComponent, formGroup) {
  const formControls = formGroup.controls;
  const extraProps = mapProps(formControls);
  mapProps(formControls);
  class ReactiveForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        extraProps
      };
      this.updateComponent = this.updateComponent.bind(this);
    }
    componentWillMount() {
      // Add listeners
      formGroup.stateChanges.subscribe(() => {
        this.updateComponent();
      });
    }
    componentWillUnmount() {
      //Remove listeners
      if (formGroup.stateChanges.observers) {
        formGroup.stateChanges.observers.forEach((observer) => {
          formGroup.stateChanges.unsubscribe(observer);
        });
      }
    }
    updateComponent() {
      this.setState({
        extraProps: mapProps(formControls)
      });
    }
    render() {
      const props = Object.assign({}, this.props, this.state.extraProps);
      return React.createElement(ReactComponent, props);
    }
}
  return ReactiveForm;
}
export default reactiveForm;
