/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/store.js
import {configureStore} from '@reduxjs/toolkit';
import ListReducer from './ListSlice ';

const store = configureStore({
  reducer: {
    List: ListReducer,
  },
});
export default store;