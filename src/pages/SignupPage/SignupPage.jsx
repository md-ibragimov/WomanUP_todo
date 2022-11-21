import React from 'react';
import { Link } from 'react-router-dom';
import Signup from '../../components/Signup/Signup';
import Container from '@mui/material/Container';


function SignupPage(props) {
  return (
    <Container maxWidth="sm">
      <Signup />
    </Container>
  );
}

export default SignupPage;