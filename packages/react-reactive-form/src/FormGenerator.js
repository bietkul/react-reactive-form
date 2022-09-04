import React from 'react'
import PropTypes from 'prop-types'
import FieldControl from './FieldControl'
import FieldArray from './FieldArray'
import FieldGroup from './FieldGroup'
import Field from './Field'
import { FormGroup, FormArray } from './model'
import { warning, mapConfigToFieldProps, generateKey } from './utils'
import configureControl from './configureControl'

const FIELD_CONFIG_STRING = '$field_'

export default class FormGenerator extends React.Component {
  constructor(props) {
    super(props)
    // Intiate the form property
    this.form = null
  }
  componentDidMount() {
    this.props.onMount(this.form)
  }
  componentDidUpdate() {
    this.props.onMount(this.form)
  }
  shouldComponentUpdate(nextProps) {
    // Only Re-renders for changes in field config
    if (nextProps.fieldConfig !== this.props.fieldConfig) {
      return true
    }
    return false
  }
  componentWillUnmount() {
    const { onUnmount } = this.props
    onUnmount()
  }
  // Create the form instance
  configureForm(type = 'FormGroup') {
    const { fieldConfig } = this.props
    this.form = configureControl(fieldConfig, {}, type)
  }
  // Creates the control from fieldConfig.
  setControl(configProps, key, name = null) {
    // Map the props to be passed in Field
    const propsToBePassed = mapConfigToFieldProps(configProps)
    // Set the key
    propsToBePassed.key = key
    if (name) {
      propsToBePassed.name = name
    }
    // Set the component for $field_
    if (
      (name && name.startsWith(FIELD_CONFIG_STRING)) ||
      (typeof configProps.index === 'string' &&
        configProps.index.startsWith(FIELD_CONFIG_STRING))
    ) {
      // Only subscribe when isStatic is false
      if (configProps.isStatic === false) {
        return React.createElement(
          Field,
          Object.assign({}, { control: this.form }, propsToBePassed)
        )
      }
      return propsToBePassed.render()
    }

    if (configProps.controls) {
      if (configProps.controls instanceof Array) {
        // If controls is an array then configure FormArray
        if (!this.form) {
          this.configureForm('FormArray')
          propsToBePassed.control = this.form
        }
        return React.createElement(
          FieldArray,
          Object.assign({}, propsToBePassed, {
            render: () =>
              configProps.controls.map((config, index) =>
                this.setControl(config, `${key}_${index}`)
              )
          })
        )
      } else if (configProps.controls instanceof Object) {
        // If controls is an object then configure FormGroup
        if (!this.form) {
          this.configureForm()
          propsToBePassed.control = this.form
        }
        return React.createElement(
          FieldGroup,
          Object.assign({}, propsToBePassed, {
            render: () =>
              Object.keys(configProps.controls).map(key =>
                this.setControl(configProps.controls[key], key, key)
              )
          })
        )
      } else {
        warning(false, `Missing controls in fieldConfig.`)
        return null
      }
    } else {
      return React.createElement(FieldControl, propsToBePassed)
    }
  }
  generateFields() {
    // Reset the form instance
    this.form = null
    const { fieldConfig } = this.props
    if (fieldConfig.controls) {
      const fields = this.setControl(fieldConfig, generateKey('my_form'))
      return fields
    } else {
      // Throw error
      warning(false, `Missing controls in fieldConfig.`)
      return null
    }
  }
  render() {
    const { fieldConfig } = this.props
    if (fieldConfig) {
      return this.generateFields()
    }
    return null
  }
}

FormGenerator.propTypes = {
  fieldConfig: PropTypes.shape({
    controls: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
      .isRequired,
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
  onUnmount: PropTypes.func
}
FormGenerator.defaultProps = {
  onMount: () => null,
  onUnmount: () => null
}
