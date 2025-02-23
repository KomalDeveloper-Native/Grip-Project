/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  kyc: 0,
  id:0,
  course_Id:0,
  status:null,
};

const ListSlice = createSlice({
  name: 'List',
  initialState,
  reducers: {
    setKyc: (state, action) => {
      state.kyc = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setCourseId: (state, action) => {
      state.course_Id = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {setKyc,setId,setCourseId,setStatus} = ListSlice.actions;
export default ListSlice.reducer;
