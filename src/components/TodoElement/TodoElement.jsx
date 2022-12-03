import React, { useEffect, useState } from 'react';
import styles from './TodoElement.module.scss';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Slide from '@mui/material/Slide';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { storage } from "../../firebase";
import { v4 } from 'uuid'

import {
  ref as fileRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function TodoElement({ data, todos }) {
  const [disabledButton, setDisabledButton] = useState(false);
  const [checkbox, setCheckbox] = useState(data.status);
  const [value, setValue] = useState(dayjs(String(data.date).slice(1, data.date.length - 1)));
  const [description, setDescription] = useState(data.description);
  const [title, setTitle] = useState(data.title);
  const [fileName, setFileName] = useState('');
  const [fileButtonName, setFileButtonName] = useState(data.fileLink ? data.fileName : 'Pick file');
  const [open, setOpen] = useState(false);
  const [fileLink, setFileLink] = useState(data.fileLink)
  const [file, setFile] = useState('');

  const deleteTodo = () => {
    const auth = getAuth();
    const db = getDatabase();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set(ref(db, `users/${user.uid}/todos`), [...todos.filter(el => {
          if (el.id === data.id) {
            return false
          }
          return true
        })]).then(() => handleClose())
      }
    })
  }

  const handleTodo = () => {
    const auth = getAuth();
    const db = getDatabase();

    if (file) {
      const storageRef = fileRef(storage, `/files/${v4()}${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file);
      onAuthStateChanged(auth, (user) => {
        uploadTask.on('state_changed', (snapshot) => { },
          (err) => console.error,
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              set(ref(db, `users/${user.uid}/todos`), [...todos.map(el => {
                if (el.id === data.id) {
                  return {
                    ...data,
                    title: title,
                    description: description,
                    date: JSON.stringify(value),
                    fileLink: url,
                    fileName: fileName
                  }
                }
              })]).then(() => handleClose())
            });
          }
        )
      })

    }
    else {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          set(ref(db, `users/${user.uid}/todos`), [...todos.map(el => {
            if (el.id === data.id) {
              return {
                ...data,
                title: title,
                description: description,
                date: JSON.stringify(value),
                fileLink: fileLink,
                fileName: fileName
              }
            }
          })]).then(() => handleClose())
        }
      })
    }
  }

  useEffect(() => {
    if (title && value) {
      setDisabledButton(false)
    }
    else {
      setDisabledButton(true)
    }
  }, [title, value])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle(data.title);
    setDescription(data.description);
    setFileLink(data.fileLink);
    setFileButtonName(data.fileLink ? data.fileName : 'Pick file')
    setValue(dayjs(String(data.date).slice(1, data.date.length - 1)))
    setFile('');
  };

  return (
    <div className={styles.todo}>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Container>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {data.title}
              </Typography>
              <Button
                disabled={disabledButton}
                endIcon={<DoneIcon />}
                variant="contained"
                color="success"
                onClick={handleTodo}>
                save
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Container className={styles.dialog}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles['dialog-element']}
            label='Title'
          />
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Todo description"
            multiline
            rows={3}
            className={styles['dialog-element']}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className={styles['dialog-element']}
              label="Pick date"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <div className={styles['file-buttons']}>
            <form
              method="post"
              encType="multipart/form-data"
              className={styles['handle-file']}
              onChange={(file) => {
                setFileButtonName(file.target.files[0].name);
              }}
            >
              <label className={styles['input-file']}>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFileName(e.target.files[0].name);
                  }}
                />
                <span>{fileButtonName}</span>
              </label>
            </form>
            {fileLink
              && (
                <>
                  <a href={fileLink} download >Download</a>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setFile('');
                      setFileLink('')
                      setFileButtonName('Pick file')
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>)
            }


          </div>
          <Button
            onClick={deleteTodo}
            variant="contained"
            color="error"
          >Delete</Button>

        </Container>
      </Dialog>
      <Checkbox
        checked={checkbox}
        onChange={(e) => {
          setCheckbox(e.target.checked)
          const auth = getAuth();
          onAuthStateChanged(auth, (user) => {
            if (user) {
              const db = getDatabase();
              set(ref(db, `users/${user.uid}/todos`), [
                ...todos.map(el => {
                  if (el.id === data.id) {
                    return {
                      ...el,
                      status: !el.status
                    }
                  }
                  return el
                })
              ])
            }
          })

        }}
      />
      <div
        className={styles['todo-info']}
        onClick={handleClickOpen}
      >
        <span
          className={styles['todo-title']}
          style={{
            textDecoration: `${checkbox ? 'line-through' : 'none'}`
          }}
        >{data.title}</span>
        <span
          onClick={() => {
            console.log(dayjs().isAfter(String(data.date.slice(1, data.date.length - 1)), 'day'))
          }}
          style={{
            color: `${dayjs().isAfter(String(data.date.slice(1, data.date.length - 1)), 'day') ? 'red' : null}`
          }}
        >{String(dayjs(data.date.slice(1, data.date.length - 1))['$d']).split(' ').slice(0, 4).join(' ')}</span>
      </div>
    </div>
  );
}

export default TodoElement;