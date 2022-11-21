import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';
import CreateTodo from '../../components/CreateTodo/CreateTodo';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import TodoElement from '../../components/TodoElement/TodoElement';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { getDatabase, ref, onValue } from "firebase/database";
import { v4 } from 'uuid';

function HomePage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [todos, setTodos] = useState([]);
  const db = getDatabase();



  // Handles input change event and updates state

  const generateTodos = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const starCountRef = ref(db, `users/${user.uid}/todos`);
        onValue(starCountRef, (snap) => {
          if (snap.exists()) {
            setTodos(snap.val());
            setOpen(false)
          }
          else setOpen(false)

          return
        })

      }
    })
  }
  useEffect(() => {
    generateTodos();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken
        }))
      }
      else {
        navigate('/login')
      }
    })
  }, [])

  return (
    <Container className={styles.container}>
      <Dialog
        open={open}
      >
        <div className={styles.loader}>
          <div>
            <LinearProgress />
          </div>
        </div>
      </Dialog>
      <Fab
        color="primary"
        aria-label="add"
        className={styles['add-button']}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
      <CreateTodo
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
      {todos.map(el => {
        return (
          <TodoElement
            key={v4()}
            data={el}
            todos={todos}
          />
        )
      })}
    </Container>
  )
}

export default HomePage;