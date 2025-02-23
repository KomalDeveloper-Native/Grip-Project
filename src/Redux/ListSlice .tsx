/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import {createSlice} from '@reduxjs/toolkit';
import { Actions } from 'react-native-gifted-chat';
// import { State } from 'react-native-gesture-handler';

const initialState = {
  kyc: 0,
  id:0,
  course_Id:0,
  jobid:0,
  status:null,
  updateStatus:'End',
  tokens:null,
  orderItem:null,
  couponCode1:null
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
    setJobId: (state, action) => {
      state.jobid = action.payload;
    },
    setRetreatId: (state, action) => {
      state.jobid = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setUpdateStatus: (state, action) => {
      state.updateStatus = action.payload;
    },
    setTokens:(state,action)=>{
      state.tokens = action.payload;

    },
    setOrderItem:(state,action)=>{
      state.orderItem = action.payload;

    },
    setCouponCode1:(state,action)=>{
      state.couponCode1 = action.payload;
    },
  },
});

export const {setKyc,setId,setCourseId,setStatus,setJobId,setRetreatId,setUpdateStatus,setTokens,setOrderItem,setCouponCode1} = ListSlice.actions;
export default ListSlice.reducer;
