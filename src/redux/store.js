import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './slices/stockSlice';
import cashReducer from './slices/cashSlice';

const store = configureStore({
  reducer: {
    stock: stockReducer,
    cash: cashReducer,
  },
});

export default store;
