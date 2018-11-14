import React from 'react';
import TextField from '@material-ui/core/TextField';


const TextModalInput = ({ input }) => {

  return (
    <TextField
      label = "tag"
      value = {input}
      onChange = {(e) => {e.target.value}}
    />
  )
}

export default TextModalInput
