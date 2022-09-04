import * as React from 'react'

const Values = ({ value }) => {
  return (
    <div style={styles.main}>
      <h3 style={{ color: '#389926' }}>Values</h3>
      <pre style={styles.text}>{JSON.stringify(value, 0, 2)}</pre>
    </div>
  )
}
export default Values

const styles = {
  main: {
    border: '1px solid #ccc',
    backgroundColor: '#000',
    borderRadius: '4px',
    width: '80%',
    marginLeft: '7%',
    marginTop: '20px',
    padding: '10px 20px',
    textAlign: 'left',
  },
  text: {
    color: '#DDE1DC',
    fontSize: '18px',
    lineHeight: '30px',
  },
}
