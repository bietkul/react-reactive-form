import React, { Component } from 'react';
/**
 * Higher order component
 * @param {Component} ReactComponent
 * @param {FormGroup} formGroup
 * @return {Component} connect
 */
function connect(ReactComponent, formGroup) {
  // const formControls = formGroup.controls;
  // const extraProps = {};
  // console.log('THIS IS FORM', formGroup.updateDOM);
  // if (formControls) {
  //   Object.keys(formControls).forEach((controlName) => {
  //     if (formControls[controlName]) {
  //       extraProps[controlName] = formControls[controlName];
  //     }
  //   });
  // }
  // formGroup.updateDOM.subscribe(() => {
  //   console.log('THIS IS THE SUCCESS NOINWVBUOBWVBUWBVBWVBWUVBIUWBVBVBEVBWEBVIUWEBVIUWBEBWEVIUBWEU')
  // }, (error) => {
  //   console.log(error);
  // });
  class Connect extends Component {
    constructor(props) {
      super(props);
      this.state = {};
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
    updateComponent = () => this.setState(this.state)
    render() {
      console.log('RENDER CALLED');
      // return (
      //   <ReactComponent ref={(c) => { this.myForm = c; }} {...this.props} {...extraProps} />
      // );
      return (
        <ReactComponent ref={(c) => { this.myForm = c; }} {...this.props} />
      );
    }
}
  return Connect;
}
export default connect;
