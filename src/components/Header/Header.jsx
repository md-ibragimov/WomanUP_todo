import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Container from '@mui/material/Container';
import { useAuth } from '../../hooks/use-auth';
import { useDispatch } from 'react-redux';
import { changeTheme } from '../../store/slices/DarkThemeSlice';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Header(props) {
  const dispatch = useDispatch()
  const navigation = useNavigate()
  const auth = getAuth();
  const { isAuth } = useAuth();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Container>
          <Toolbar>

            <Typography
              variant='h6'
              component='span'
              sx={{ flexGrow: 1 }}
            >To Do</Typography>
            {isAuth && <Button
              onClick={() => {
                signOut(auth)
              }}
              color="inherit"
              endIcon={<LogoutIcon />}
            >Log out</Button>}
            <IconButton
              onClick={() => {
                dispatch(changeTheme())
              }}
            >
              <Brightness4Icon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default Header;