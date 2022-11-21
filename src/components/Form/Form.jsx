import React, { useEffect, useState } from 'react';
import styles from './Form.module.scss';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import { IconButton, InputAdornment } from '@mui/material';
import { Input, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';



function Form({ title, handleClick }) {
  const navigation = useNavigate();
  const [values, setValues] = useState(true)
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const handleClickShowPassword = () => { setValues(!values) }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={styles.form}
    >
      <TextField
        label="Email"
        variant="standard"
        autoComplete='on'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <FormControl variant='standard'>
        <InputLabel
          htmlFor="standard-adornment-password"
        >
          Password</InputLabel>
        <Input
          label='Password'
          type={values ? 'password' : 'text'}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoComplete='on'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {values ? <Visibility /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <div className={styles['button-container']}>
        <Button
          onClick={() => {
            title === 'login' ? navigation('/signup') : navigation('/login')
          }}
        >{title === 'login' ? 'create account' : 'login'}</Button>
        <Button
          variant="contained"
          color="success"
          type='submit'
          onClick={() => handleClick(email, pass)}
        >
          {title}</Button>
      </div>

    </form >
  );
}

export default Form;