import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormArray, FormGroup } from './model'
import configureControl from './configureControl'
import Field from './Field'

class FieldControlInternal extends React.Component {
  state = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { name } = nextProps;
    if (!prevState || prevState.oldName !== name) {
      return {
        ...prevState,
        control: configureControl(nextProps, {}, 'FormControl'),
        oldName: name
      }
    }
    return null
  }

  render() {
    const { strict, children, render } = this.props
    const { control } = this.state
    const FieldProps = {
      control,
      strict,
      render: render || children || null
    }
    return React.createElement(Field, FieldProps)
  }
}

FieldControlInternal.defaultProps = {
  strict: true
}
FieldControlInternal.propTypes = {
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

const FieldControl = (props, context) => React.createElement(FieldControlInternal, {...props, parent: props.parent || context.parentControl})

FieldControl.contextTypes = {
  parentControl: PropTypes.oneOfType([
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup)
  ])
}

export default FieldControl
