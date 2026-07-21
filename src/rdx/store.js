// handleClickSlice.js

import { createSlice } from '@reduxjs/toolkit';

const handleClickSlice = createSlice({
  name: 'handleCreate',
  initialState: null,
  reducers: {
    setHandleClick: (state, action) => action.payload
  }
});

export const { setHandleClick } = handleClickSlice.actions;
export default handleClickSlice.reducer;
