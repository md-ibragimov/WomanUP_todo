import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light' 
}

const darkTheme = createSlice({
  name: 'darkTheme',
  initialState,
  reducers: {
    changeTheme(state) {
      state.theme = (state.theme==='dark')?'light':'dark';
    }
  }
});

export const { changeTheme } = darkTheme.actions;
export default darkTheme.reducer