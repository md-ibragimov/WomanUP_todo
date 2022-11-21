import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from '../../pages/HomePage/HomePage';
import SignupPage from '../../pages/SignupPage/SignupPage';
import LoginPage from '../../pages/LoginPage/LoginPage';
import Notfoundpage from '../../pages/Notfoundpage/Notfoundpage';
import Layout from '../Layout/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';





function App() {
  const theme = useSelector(state => state.darkTheme.theme);
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#ff5722'
      },
      mode: theme,
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='signup' element={<SignupPage />} />
            <Route path='*' element={<Notfoundpage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;