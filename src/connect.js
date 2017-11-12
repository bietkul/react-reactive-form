import React, { Component } from 'react';
/**
 * Higher order component
 * @param {Component} ReactComponent
 * @param {FormGroup} formGroup
 * @return {Component} connect
 */
function connect(ReactComponent, formGroup) {
  const formControls = formGroup.controls;
  const extraProps = {};
  if (formControls) {
    formControls.forEach((formControl) => {
      if (formControl) {
        extraProps[formControl.name] = formControl;
      }
    });
  }
  class Connect extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    componentDidMount() {
      // Add listeners
      formGroup.updateDOM.subscribe(() => {
        if (this.myForm) {
          this.updateComponent();
        }
      }, (error) => {
        console.log(error);
      });
      // formGroup.statusChanges.subscribe(() => {
      //   if (this.myForm) {
      //     this.updateComponent();
      //   }
      // }, (error) => {
      //   console.log(error);
      // });
    }
    componentWillUnmount() {
      // Remove listeners
      if (formGroup.updateDOM.observers) {
        formGroup.updateDOM.observers.forEach((observer) => {
          observer.unsubscribe();
        });
      }
    }
    updateComponent = () => this.setState(this.state)
    render() {
      return (
        <ReactComponent ref={(c) => { this.myForm = c; }} {...this.props} {...extraProps} />
      );
    }
}
  return Connect;
}
export default connect;
