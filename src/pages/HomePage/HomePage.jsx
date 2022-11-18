import React from 'react';
import { Navigate } from 'react-router-dom'

function HomePage(props) {
  return (
    <div>
      <Navigate to='/login' />
    </div>
  );
}

export default HomePage;