import React from 'react'
import PropTypes from 'prop-types'
import { FormControl } from './model'
import { isFunction, warning } from './utils'

export default class Field extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.configureControl(props, context)
  }

  componentDidMount() {
    // Add listener
    this.addListener()
  }
  addListener() {
    if (this.control) {
      this.control.stateChanges.subscribe(() => {
        this.forceUpdate()
      })
    }
  }
  removeListener(control) {
    if (control) {
      if (control.stateChanges.observers) {
        control.stateChanges.observers.forEach(observer => {
          control.stateChanges.unsubscribe(observer)
        })
      }
    }
  }
  configureControl(props, context) {
    const { name, formState, opts, parent, control } = props
    if (control) {
      this.control = control
    } else if (name) {
      // Add control automatically
      const parentControl = parent || context.parentControl
      if (parentControl) {
        if (!parentControl.get(name)) {
          parentControl.addControl(name, new FormControl(formState, opts))
        }
        this.control = parentControl.get(name)
      } else {
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    const { name } = nextProps
    if (this.props.name !== name) {
      this.removeListener(this.control)
      this.configureControl(nextProps, this.context)
      this.addListener()
    }
  }
  componentWillUnmount() {
    // Remove Listener
    console.log('UNMOUNT CALLED =========>', this)
    this.removeListener(this.control)
    console.log('UNMOUNT CALLED =========>', this.props.control)
  }
  shouldComponentUpdate(props) {
    if (!props.strict) {
      return true
    }
    return false
  }
  getComponent() {
    const { render, children } = this.props
    warning(
      this.control,
      `Missing Control.Please make sure that an instance of FormControl, FormGroup or FormArray must be passed as a control prop in the Field component`
    )
    if (this.control) {
      // Render function as child
      if (isFunction(children)) {
        return children(this.control)
      }
      // Render function as render prop
      if (isFunction(render)) {
        return render(this.control)
      }
      // Render function as component
      if (typeof render === 'string') {
        return React.createElement(render, this.control)
      }
    }
    return null
  }
  render() {
    console.log('RENDER GOT CALLED', this.props.name, this)
    return this.getComponent()
  }
}

Field.defaultProps = {
  strict: true
}

Field.propTypes = {
  strict: PropTypes.bool,
  control: PropTypes.object,
  render: PropTypes.func
}
Field.contextTypes = {
  parentControl: PropTypes.object
}
