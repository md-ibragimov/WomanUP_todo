import React from 'react';
import Form from '../Form/Form';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom'
import { getDatabase, ref, set } from "firebase/database";

function Signup() {
  const dispatch = useDispatch();
  const nav = useNavigate()
  const handleRegister = (email, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken
        }))
        const db = getDatabase();
        set(ref(db, `users/${user.uid}`), {
          email: user.email, 
          id: user.uid, 
          todos: []
        })
        nav('/')
      })
  }
  return (
    <Form
      title='sign up'
      handleClick={handleRegister}
    />
  );
}

export default Signup;