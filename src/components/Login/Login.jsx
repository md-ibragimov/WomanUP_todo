import React from 'react';
import Form from '../Form/Form';
import { useDispatch } from 'react-redux';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setUser } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const dispatch = useDispatch();
  const nav = useNavigate()
  const auth = getAuth();
  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(({user}) => {
        dispatch(setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken
        }))
        nav('/');
      })
  }
  return (
    <Form
      title='login'
      handleClick={handleLogin}
    />
  );
}

export default Login;