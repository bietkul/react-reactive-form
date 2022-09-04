import * as React from 'react'
import styles from './../styles'

// React SFC to render Input element
const TextInput = ({ handler, meta: { label, placeholder } }) => {
  return (
    <div>
      <label>{label}:</label>
      <input placeholder={placeholder} style={styles.input} {...handler()} />
    </div>
  )
}

export default TextInput
