import React from "react"
import PropTypes from 'prop-types'
import { FormGroup } from "./model"
import Field from "./Field"

class Form extends React.Component {
  constructor(props) {
    super(props);
    const { name, controls, parent, opts } = this.props;
    if(parent) {
      if(!parent.get(name)) {
          parent.addControl(name, new FormGroup(controls || [], opts));
      }
      this.control = parent.get(name);
    } else {
      this.control = new FormGroup(controls || [], opts);
    }
  }
  getChildContext() {
      return {
          parentControl: this.control,
      }
  }
  render() {
    const { render, strict } = this.props;
    console.log("THIS IS THE FORM COMPONENT", this.control);
    return (
      <Field
        strict={strict}
        control={this.control}
        render={(control) => render(control)}
      />
    );
  }
}
Form.childContextTypes = {
  parentControl: PropTypes.object,
}
Field.defaultProps = {
  strict: true
}

Field.propTypes = {
  strict: PropTypes.bool,
  control: PropTypes.object,
  render: PropTypes.func
}