import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      state.items.push(action.payload);
      // Yeni ürün eklendiğinde AsyncStorage'a kaydet
      saveProductsToStorage(state.items);
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveProductsToStorage(state.items);
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveProductsToStorage(state.items);
    },
  },
});

// AsyncStorage fonksiyonları
export const saveProductsToStorage = async (products) => {
  try {
    await AsyncStorage.setItem('products', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

export const loadProductsFromStorage = async () => {
  try {
    const products = await AsyncStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const { setProducts, addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer; 