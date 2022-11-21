import React from 'react';
import Login from '../../components/Login/Login';
import Container from '@mui/material/Container';

function LoginPage(props) {
  return (
    <Container maxWidth="sm">
      <Login/>
    </Container>
  );
}

export default LoginPage;