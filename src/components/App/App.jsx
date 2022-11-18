import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from '../../pages/HomePage/HomePage';
import SigninPage from '../../pages/SigninPage/SigninPage';
import LoginPage from '../../pages/LoginPage/LoginPage';
import Notfoundpage from '../../pages/Notfoundpage/Notfoundpage';
import Layout from '../Layout/Layout';



function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Homepage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='signin' element={<SigninPage />} />
          <Route path='*' element={<Notfoundpage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;