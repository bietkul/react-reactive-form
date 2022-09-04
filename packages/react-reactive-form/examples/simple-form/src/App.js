import { useRef } from 'react'
import { FormBuilder, FieldControl, FieldGroup } from 'react-reactive-form'
import Values from './Values'
import styles from './styles'
import {
  TextInput,
  Checkbox,
  GenderRadio,
  SelectBox,
  TextArea,
} from './components'

const SimpleForm = () => {
  // Create a group of form controls with default values.
  const myForm = useRef(
    FormBuilder.group({
      first_name: '',
      last_name: '',
      gender: 'male',
      nationality: '',
      terms: false,
      notes: '',
    })
  )
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`You submitted \n ${JSON.stringify(myForm.current.value, null, 2)}`)
  }
  const handleReset = () => {
    myForm.current.reset()
  }
  return (
    <div style={styles.main}>
      <h2>Simple Form</h2>
      <FieldGroup
        control={myForm.current}
        render={({ pristine, value }) => (
          <form onSubmit={() => handleSubmit}>
            <FieldControl
              name="first_name"
              render={TextInput}
              // Use meta to add some extra props
              meta={{
                label: 'First Name',
                placeholder: 'Enter first name',
              }}
            />

            <FieldControl
              name="last_name"
              meta={{
                label: 'Last Name',
                placeholder: 'Enter last name',
              }}
              render={TextInput}
            />

            <FieldControl name="gender" render={GenderRadio} />

            <FieldControl name="nationality" render={SelectBox} />

            <FieldControl name="notes" render={TextArea} />

            <FieldControl name="terms" render={Checkbox} />

            <div>
              <button
                disabled={pristine}
                style={styles.button}
                onClick={(e) => handleSubmit(e)}
              >
                Submit
              </button>
              <button
                type="button"
                style={styles.button}
                onClick={() => handleReset()}
              >
                Reset
              </button>
            </div>
            <Values value={value} />
          </form>
        )}
      />
    </div>
  )
}

export default SimpleForm
