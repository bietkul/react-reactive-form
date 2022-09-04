import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormArray } from './model'
import { FormControlContext } from './utils'
import Field from './Field'
import configureControl from './configureControl'

const FieldGroup = (props) => {
  const { strict, children, render } = props
  const context = useContext(FormControlContext)
  const control = configureControl(props, context, 'FormGroup')
  const FieldProps = {
    control,
    strict,
    render: render || children || null,
  }
  return React.createElement(
    FormControlContext.Provider,
    {
      value: control,
    },
    React.createElement(Field, FieldProps)
  )
}

FieldGroup.defaultProps = {
  strict: true,
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
      PropTypes.arrayOf(PropTypes.func),
    ]),
    asyncValidators: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func),
    ]),
    updateOn: PropTypes.oneOf(['change', 'blur', 'submit']),
  }),
  parent: PropTypes.oneOfType([
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup),
  ]),
  meta: PropTypes.object,
}
export default FieldGroup
