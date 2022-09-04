import React, { useContext, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormArray, FormGroup } from './model'
import configureControl from './configureControl'
import Field from './Field'
import { FormControlContext } from './utils'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const FieldControl = (props) => {
  const {
    strict,
    children,
    render,
    name,
    parent,
    options,
    index,
    control,
    formState,
    meta,
  } = props
  const context = useContext(FormControlContext)
  const [formControl, setControl] = useState(
    configureControl(props, context, 'FormControl')
  )
  const FieldProps = {
    control: formControl,
    strict,
    render: render || children || null,
  }
  const prevName = usePrevious(name)
  useEffect(() => {
    if (name !== prevName) {
      setControl(
        configureControl(
          {
            name,
            parent,
            options,
            index,
            control,
            formState,
            meta,
          },
          context,
          'FormControl'
        )
      )
    }
  }, [name, parent, options, index, control, formState, meta, context])
  return React.createElement(Field, FieldProps)
}

FieldControl.defaultProps = {
  strict: true,
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
      disabled: PropTypes.bool,
    }),
    PropTypes.any,
  ]),
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

export default FieldControl
