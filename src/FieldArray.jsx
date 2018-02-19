import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormArray } from './model'
import configureControl from './configureControl'
import Field from './Field'

class FieldArray extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.control = configureControl(props, context, 'FormArray')
  }
  getChildContext() {
    return {
      parentControl: this.control
    }
  }
  render() {
    const { strict, children, render } = this.props
    return (
      <Field
        control={this.control}
        strict={strict}
        render={render || children || null}
      />
    )
  }
}
FieldArray.childContextTypes = {
  parentControl: PropTypes.oneOfType([
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup)
  ])
}
FieldArray.contextTypes = {
  parentControl: PropTypes.oneOfType([
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup)
  ])
}
FieldArray.defaultProps = {
  strict: true
}

FieldArray.propTypes = {
  strict: PropTypes.bool,
  render: PropTypes.func,
  name: PropTypes.string,
  index: PropTypes.number,
  control: PropTypes.instanceOf(FormArray),
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
  ])
}
export default FieldArray
