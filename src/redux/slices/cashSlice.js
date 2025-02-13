import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  transactions: [], // Satış işlemleri
  totalCash: 0, // Toplam kasa
};

const cashSlice = createSlice({
  name: 'cash',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push({
        ...action.payload,
        id: Date.now(),
        date: new Date().toISOString(),
      });
      state.totalCash += action.payload.amount;
      // AsyncStorage'a kaydet
      saveTransactionsToStorage(state.transactions);
    },
    addMultipleTransaction: (state, action) => {
      const { products, totalAmount } = action.payload;
      const transactionId = Date.now();
      const date = new Date().toISOString();

      products.forEach((product, index) => {
        state.transactions.push({
          ...product,
          id: transactionId + index,
          date,
          isMultiSale: true,
          multiSaleId: transactionId,
        });
      });

      state.totalCash += totalAmount;
      saveTransactionsToStorage(state.transactions);
    },
    cancelTransaction: (state, action) => {
      const { transactionId, amount } = action.payload;
      state.transactions = state.transactions.filter(t => t.id !== transactionId);
      state.totalCash -= amount;
      saveTransactionsToStorage(state.transactions);
    },
    cancelMultiSaleTransaction: (state, action) => {
      const { multiSaleId, totalAmount } = action.payload;
      state.transactions = state.transactions.filter(t => t.multiSaleId !== multiSaleId);
      state.totalCash -= totalAmount;
      saveTransactionsToStorage(state.transactions);
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.totalCash = action.payload.reduce((sum, transaction) => sum + transaction.amount, 0);
    },
  },
});

// AsyncStorage fonksiyonları
const saveTransactionsToStorage = async transactions => {
  try {
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const loadTransactionsFromStorage = async () => {
  try {
    const savedTransactions = await AsyncStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const {
  addTransaction,
  addMultipleTransaction,
  cancelTransaction,
  cancelMultiSaleTransaction,
  setTransactions,
} = cashSlice.actions;

export default cashSlice.reducer;
