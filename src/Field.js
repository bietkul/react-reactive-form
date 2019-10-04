import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormArray, FormGroup } from './model'
import { isFunction, warning } from './utils'

export default class Field extends React.Component {
  state = {
    forceUpdate: () => this.forceUpdate()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { control } = nextProps;
    if (control !== prevState.lastControl) {
      Field.removeListener(control);
      Field.addListener(control, prevState.forceUpdate);
      return {
        ...prevState,
        lastControl: control
      }
    }
    return null
  }

  static addListener(control, forceUpdate) {
    if (control) {
      control.stateChanges.subscribe(() => {
        forceUpdate()
      })
    }
  }
  static removeListener(control) {
    if (control) {
      if (control.stateChanges.observers) {
        control.stateChanges.observers.forEach(observer => {
          control.stateChanges.unsubscribe(observer)
        })
      }
    }
  }
  componentWillUnmount() {
    const { control } = this.props
    // Remove Listener
    Field.removeListener(control)
  }
  shouldComponentUpdate(props) {
    if (!props.strict) {
      return true
    }
    return false
  }
  getComponent() {
    const { render, children, control } = this.props
    warning(
      control,
      `Missing Control.Please make sure that an instance of FormControl, FormGroup or FormArray must be passed as a control prop in the Field component`
    )
    if (control) {
      // Render function as child
      if (isFunction(children)) {
        return children(control)
      }
      // Render function as render prop
      if (isFunction(render)) {
        return render(control)
      }
      return null
    }
    return null
  }
  render() {
    return this.getComponent()
  }
}

Field.defaultProps = {
  strict: true
}

Field.propTypes = {
  strict: PropTypes.bool,
  control: PropTypes.oneOfType([
    PropTypes.instanceOf(FormControl),
    PropTypes.instanceOf(FormArray),
    PropTypes.instanceOf(FormGroup)
  ]).isRequired,
  render: PropTypes.func
}
