import React from 'react';
import { Link } from 'react-router-dom'

function LoginPage(props) {
  return (
    <div>
      OR <Link to='/signin' >REGISTER</Link>
    </div>
  );
}

export default LoginPage;