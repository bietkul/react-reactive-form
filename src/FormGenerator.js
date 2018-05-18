import React from 'react'
import PropTypes from 'prop-types'
import FieldControl from './FieldControl'
import FieldArray from './FieldArray'
import FieldGroup from './FieldGroup'
import {
  FormGroup,
  FormArray
} from './model'
import {
  generateKey,
  warning
} from './utils'
import configureControl from './configureControl'

export default class FormGenerator extends React.Component {
  constructor(props) {
    super(props)
    this.form = null
  }
  shouldComponentUpdate(nextProps) {
    // Only Re-renders for changes in field config
    if (nextProps.fieldConfig !== this.props.fieldConfig) {
      return true
    }
    return false
  }
  // Called after the form setup
  formDidMount() {
    const {
      onMount,
      onValueChanges,
      onStatusChanges
    } = this.props;
    if (this.form) {
      // Call the onMount callback
      onMount(this.form)
      // Add listener for value changes
      if (onValueChanges) {
        this.form.valueChanges.subscribe((value) => {
          onValueChanges(value)
        })
      }
      // Add listener for status changes
      if (onStatusChanges) {
        this.form.statusChanges.subscribe((status) => {
          onStatusChanges(status)
        })
      }
    }
  }
  componentWillUnmount() {
    const {
      onUnmount
    } = this.props;
    onUnmount()
  }
  getFields() {
    const fields = []
    const {
      fieldConfig
    } = this.props
    // Resets the form
    this.form = null;
    // Creates an AbstractControl & push it to the fields array ( For leaf controls )
    const setControl = (metaControl, index) => {
      if (metaControl && !metaControl.controls) {
        fields.push(
          React.createElement(FieldControl, Object.assign({}, {
            control: configureControl(metaControl, {}, 'FormControl'),
            key: generateKey(index)
          }, metaControl))
        )
      } else {
        if (metaControl.controls instanceof Array) {
          // Create a Form Array
          const control = configureControl(metaControl, {}, 'FormArray')
          fields.push(
            React.createElement(FieldArray, Object.assign({}, {
              control,
              key: generateKey(index)
            }, metaControl))
          )
          // Call the setFields
          setFields(metaControl.controls, control, index)
        } else {
          // Create a Form Group
          const control = configureControl(metaControl, {}, 'FormGroup')
          fields.push(
            React.createElement(FieldGroup, Object.assign({}, {
              control,
              key: generateKey(index)
            }, metaControl))
          )
          setFields(metaControl.controls, control, index)
        }
      }
    }
    // Creates an AbstractControl & push it to the fields array ( For parent controls )
    const setFields = (controls, formInstance, key) => {
      if (!controls || !formInstance) {
        return
      }
      if (controls instanceof Array) {
        controls.forEach((field, i) => {
          const metaControl = field
          if (!metaControl.parent) {
            // Set the parent if not available
            metaControl.parent = formInstance
          }
          setControl(metaControl, `${key}_${i}`)
        })
      } else {
        Object.keys(controls).forEach((field, i) => {
          const metaControl = controls[field]
          if (!metaControl.parent) {
            // Set the parent if not available
            metaControl.parent = formInstance
          }
          // Set the control name
          metaControl.name = field
          setControl(metaControl, `${key}_${i}`)
        })
      }
    }
    let props = {
      key: generateKey('my-form'),
      render: fieldConfig.render,
      strict: fieldConfig.strict
    }
    if (fieldConfig.controls instanceof Array) {
      // If the field config is an object then initiate with a FormArray
      this.form = configureControl(fieldConfig, {}, 'FormArray')
      props.control = this.form
      fields.push(React.createElement(FieldArray, props))
      setFields(fieldConfig.controls, this.form, 0)
    } else if (fieldConfig.controls instanceof Object) {
      // If the field config is an object then initiate with a FormGroup
      this.form = configureControl(fieldConfig, {}, 'FormGroup')
      props.control = this.form
      fields.push(React.createElement(FieldGroup, props))
      setFields(fieldConfig.controls, this.form, 0)
    } else {
      // Throw error
      warning(false, `Missing controls in fieldConfig.`)
    }
    this.formDidMount()
    return fields
  }
  render() {
    const {
      fieldConfig
    } = this.props
    if (fieldConfig) {
      return this.getFields()
    }
    return null
  }
}

FormGenerator.propTypes = {
  fieldConfig: PropTypes.shape({
    controls: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]).isRequired,
    strict: PropTypes.bool,
    render: PropTypes.func,
    name: PropTypes.string,
    index: PropTypes.number,
    control: PropTypes.oneOfType([
      PropTypes.instanceOf(FormArray),
      PropTypes.instanceOf(FormGroup)
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
  }).isRequired,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onValueChanges: PropTypes.func,
  onStatusChanges: PropTypes.func,
}
FormGenerator.defaultProps = {
  onMount: () => null,
  onUnmount: () => null,
}