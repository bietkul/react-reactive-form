import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormArray, FormGroup } from './model'
import configureControl from './configureControl'
import Field from './Field'
export default class FieldControl extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.control = configureControl(props, context, 'FormControl')
  }
  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name) {
      this.control = configureControl(this.props, this.context, 'FormControl')
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

FieldControl.defaultProps = {
  strict: true
}
FieldControl.propTypes = {
  strict: PropTypes.bool,
  render: PropTypes.func,
  name: PropTypes.string,
  index: PropTypes.number,
  control: PropTypes.instanceOf(FormControl),
  formState: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.any,
      disabled: PropTypes.bool
    }),
    PropTypes.any
  ]),
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
FieldControl.contextTypes = {
  parentControl: PropTypes.oneOfType([
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup)
  ])
}
