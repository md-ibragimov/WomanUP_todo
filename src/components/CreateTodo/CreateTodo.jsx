import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import styles from './CreateTodo.module.scss';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { storage } from "../../firebase";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref as fileRef, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { v4 } from 'uuid'


function CreateTodo({ open, setOpen }) {
  const [value, setValue] = useState(null);
  const [saveButton, setSaveButton] = useState(true);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [fileButtonName, setFileButtonName] = useState('Pick file');
  useEffect(() => {
    if (title && value) {
      setSaveButton(false);
    }
  }, [title, value])

  const addTodo = () => {
    const auth = getAuth();
    const dbRef = ref(getDatabase());
    setSaveButton(true)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getDatabase();
        get(child(dbRef, `users/${user.uid}/todos`))
          .then(snap => {
            if (snap.exists()) {
              if (file) {
                const storageRef = fileRef(storage, `/files/${v4()}${file.name}`)
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on('state_changed', (snapshot) => { },
                  (err) => console.error,
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                      set(ref(db, `users/${user.uid}/todos`), [...snap.val(),
                      {
                        id: v4(),
                        title: title,
                        description: description,
                        date: JSON.stringify(value),
                        fileLink: url,
                        status: false,
                        fileName: fileName
                      }]
                      ).then(() => handleClose())
                    });
                  }
                )
              }
              else {
                set(ref(db, `users/${user.uid}/todos`), [...snap.val(),
                {
                  id: v4(),
                  title: title,
                  description: description,
                  date: JSON.stringify(value),
                  fileLink: '',
                  status: false,
                  fileName: fileName
                }]
                ).then(() => handleClose())
              }
            }
            else {
              if (file) {
                const storageRef = fileRef(storage, `/files/${v4()}${file.name}`)
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on('state_changed', (snapshot) => { },
                  (err) => console.error,
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                      set(ref(db, `users/${user.uid}/todos`), [
                        {
                          id: v4(),
                          title: title,
                          description: description,
                          date: JSON.stringify(value),
                          fileLink: url,
                          status: false,
                          fileName: fileName
                        }]
                      ).then(() => handleClose())
                    });
                  }
                )
              }
              else {
                set(ref(db, `users/${user.uid}/todos`), [
                  {
                    id: v4(),
                    title: title,
                    description: description,
                    date: JSON.stringify(value),
                    fileLink: '',
                    status: false,
                    fileName: fileName
                  }]
                ).then(() => handleClose())
              }
            }
          })
      }
    })
  }

  const handleClose = () => {
    setFileButtonName('Pick file')
    setValue(null);
    setOpen(false);
    setTitle('');
    setDescription('');
    setSaveButton(false);
    setFile('');

  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      className={styles.dialog}
    >
      <DialogTitle>{"Add new ToDo"}</DialogTitle>
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
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          color="error"
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
        <Button
          endIcon={<DoneIcon />}
          disabled={saveButton}
          variant="contained"
          color="success"
          onClick={addTodo}
        >save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTodo;