import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import store from './src/redux/store';
import { loadProductsFromStorage } from './src/redux/slices/stockSlice';
import { loadTransactionsFromStorage } from './src/redux/slices/cashSlice';

import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import StockScreen from './src/screens/StockScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import ProductDetail from './src/screens/ProductDetail';
import EditProduct from './src/screens/EditProduct';
import CashScreen from './src/screens/CashScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Ana Sayfa') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Barkod Tara') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Stok Listesi') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Kasa') {
            iconName = focused ? 'cash' : 'cash-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#20B2AA',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Ana Sayfa"
        component={HomeScreen}
        options={{
          headerStyle: { backgroundColor: '#20B2AA' },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Barkod Tara"
        component={ScanScreen}
        options={{
          headerStyle: { backgroundColor: '#20B2AA' },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Stok Listesi"
        component={StockScreen}
        options={{
          headerStyle: { backgroundColor: '#20B2AA' },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Kasa"
        component={CashScreen}
        options={{
          headerStyle: { backgroundColor: '#20B2AA' },
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedProducts, savedTransactions] = await Promise.all([
          loadProductsFromStorage(),
          loadTransactionsFromStorage(),
        ]);

        store.dispatch({ type: 'stock/setProducts', payload: savedProducts });
        store.dispatch({ type: 'cash/setTransactions', payload: savedTransactions });
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            headerShown: true,
            title: 'Yeni Ürün Ekle',
            headerStyle: { backgroundColor: '#20B2AA' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{
            headerShown: true,
            title: 'Ürün Detayı',
            headerStyle: { backgroundColor: '#20B2AA' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          options={{
            headerShown: true,
            title: 'Ürün Düzenle',
            headerStyle: { backgroundColor: '#20B2AA' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
