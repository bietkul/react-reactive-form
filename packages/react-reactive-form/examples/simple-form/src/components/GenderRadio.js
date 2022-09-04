import * as React from 'react'
import styles from './../styles'

const GenderRadio = ({ handler }) => (
  <div style={styles.genderContainer}>
    <div style={styles.genderText}>
      <label>Gender:</label>
    </div>
    <div style={styles.radioContainer}>
      <div>
        <input {...handler('radio', 'male')} />
        <label>Male</label>
      </div>
      <div>
        <input {...handler('radio', 'female')} />
        <label>Female</label>
      </div>
      <div>
        <input {...handler('radio', 'other')} />
        <label>Other</label>
      </div>
    </div>
  </div>
)

export default GenderRadio
