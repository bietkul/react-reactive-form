import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormArray } from './model'
import Field from './Field'
import configureControl from './configureControl'

class FieldGroup extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.control = configureControl(props, context, 'FormGroup')
  }
  getChildContext() {
    return {
      parentControl: this.control
    }
  }
  render() {
    const { strict, children, render } = this.props
    const FieldProps = {
      control: this.control,
      strict,
      render: render || children || null
    }
    return React.createElement(Field, FieldProps)
  }
}

FieldGroup.childContextTypes = {
  parentControl: PropTypes.oneOfType([
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup)
  ])
}
FieldGroup.contextTypes = {
  parentControl: PropTypes.oneOfType([
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup)
  ])
}

FieldGroup.defaultProps = {
  strict: true
}

FieldGroup.propTypes = {
  strict: PropTypes.bool,
  render: PropTypes.func,
  name: PropTypes.string,
  index: PropTypes.number,
  control: PropTypes.instanceOf(FormGroup),
  options: PropTypes.shape({
    validators: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    asyncValidators: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    updateOn: PropTypes.oneOf(['change', 'blur', 'submit'])
  }),
  parent: PropTypes.oneOfType([
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup)
  ]),
  meta: PropTypes.object
}
export default FieldGroup
