import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './redux/store';

import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import StockScreen from './screens/StockScreen';
import AddProductScreen from './screens/AddProductScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Bebek Giyim Stok Takip' }}
          />
          <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'Barkod Tara' }} />
          <Stack.Screen name="Stock" component={StockScreen} options={{ title: 'Stok Listesi' }} />
          <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={{ title: 'Yeni Ürün Ekle' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
