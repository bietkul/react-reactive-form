import * as React from 'react'
import styles from './../styles'

const SelectBox = ({ handler }) => (
  <div>
    <label>Nationality:</label>
    <select
      style={{ ...styles.input, padding: '5px 20px 5px 10px' }}
      {...handler()}
    >
      <option value="" disabled>
        Select
      </option>
      <option value="us">US</option>
      <option value="uk">UK</option>
      <option value="india">India</option>
      <option value="china">China</option>
    </select>
  </div>
)
export default SelectBox
