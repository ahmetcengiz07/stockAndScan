import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './slices/stockSlice';

const store = configureStore({
  reducer: {
    stock: stockReducer,
  },
});

export default store;
