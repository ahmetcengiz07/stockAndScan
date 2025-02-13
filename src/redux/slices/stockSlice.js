import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
      // Ürün eklendiğinde AsyncStorage'a kaydet
      saveProductsToStorage(state.products);
    },
    updateQuantity: (state, action) => {
      const { barcode, quantity } = action.payload;
      const product = state.products.find(p => p.barcode === barcode);
      if (product) {
        product.quantity += quantity;
        // Güncelleme yapıldığında AsyncStorage'a kaydet
        saveProductsToStorage(state.products);
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(p => p.barcode !== action.payload);
      // Ürün silindiğinde AsyncStorage'a kaydet
      saveProductsToStorage(state.products);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.barcode === action.payload.barcode);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
  },
});

// AsyncStorage fonksiyonları
const saveProductsToStorage = async products => {
  try {
    await AsyncStorage.setItem('products', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

export const loadProductsFromStorage = async () => {
  try {
    const savedProducts = await AsyncStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const {
  setProducts,
  addProduct,
  updateQuantity,
  removeProduct,
  setLoading,
  setError,
  updateProduct,
} = stockSlice.actions;

export default stockSlice.reducer;
