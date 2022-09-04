import * as React from 'react'

const Checkbox = ({ handler }) => (
  <div>
    <input {...handler('checkbox')} />
    <label>&nbsp;&nbsp;I agree to the terms and condition.</label>
  </div>
)

export default Checkbox
