import * as React from 'react'
import styles from './../styles'

const TextArea = ({ handler }) => (
  <div style={styles.genderContainer}>
    <div style={styles.genderText}>
      <label>Notes:</label>
    </div>
    <div style={styles.textAreaContainer}>
      <textarea style={styles.textAreaStyles} {...handler()} />
    </div>
  </div>
)

export default TextArea
