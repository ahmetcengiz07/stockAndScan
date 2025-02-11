import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../redux/slices/stockSlice';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ['Tulum', 'Elbise', 'Ayakkabı', 'Diğer'];
const SIZES = ['0-3 ay', '3-6 ay', '6-9 ay', '9-12 ay', '12-18 ay', '18-24 ay'];

const AddProductScreen = ({ route, navigation }) => {
  const { barcode } = route.params;
  const dispatch = useDispatch();
  const products = useSelector(state => state.stock.products);
  
  useEffect(() => {
    const existingProduct = products.find(p => p.barcode === barcode);
    if (existingProduct) {
      Alert.alert(
        "Uyarı",
        `Bu barkoda (${barcode}) sahip ürün zaten mevcut:\n\n${existingProduct.name}\nKategori: ${existingProduct.category}\nBeden: ${existingProduct.size}`,
        [
          {
            text: "Tamam",
            onPress: () => navigation.goBack(),
          }
        ]
      );
    }
  }, [barcode, products, navigation]);

  const [product, setProduct] = useState({
    barcode: barcode,
    name: '',
    category: '',
    size: '',
    color: '',
    quantity: '0',
    price: '0',
  });

  const handleSave = () => {
    const existingProduct = products.find(p => p.barcode === barcode);
    if (existingProduct) {
      Alert.alert("Hata", "Bu barkoda sahip ürün zaten mevcut!");
      return;
    }

    if (!product.name || !product.category || !product.size) {
      Alert.alert('Uyarı', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    dispatch(addProduct({
      ...product,
      id: Date.now().toString(),
      quantity: parseInt(product.quantity),
      price: parseFloat(product.price),
      lastUpdated: new Date().toISOString()
    }));
    navigation.navigate('Ana Sayfa');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.barcodeContainer}>
        <Ionicons name="barcode-outline" size={24} color="#20B2AA" />
        <Text style={styles.barcodeText}>Barkod: {barcode}</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ürün Adı *</Text>
        <TextInput
          style={styles.input}
          value={product.name}
          onChangeText={(text) => setProduct({...product, name: text})}
          placeholder="Ürün adını girin"
        />
      </View>

      <Text style={styles.label}>Kategori *</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              product.category === category && styles.categoryButtonActive
            ]}
            onPress={() => setProduct({...product, category})}
          >
            <Text style={[
              styles.categoryButtonText,
              product.category === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Beden *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeContainer}>
        {SIZES.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeButton,
              product.size === size && styles.sizeButtonActive
            ]}
            onPress={() => setProduct({...product, size})}
          >
            <Text style={[
              styles.sizeButtonText,
              product.size === size && styles.sizeButtonTextActive
            ]}>
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Renk</Text>
        <TextInput
          style={styles.input}
          value={product.color}
          onChangeText={(text) => setProduct({...product, color: text})}
          placeholder="Renk girin"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Miktar</Text>
          <TextInput
            style={styles.input}
            value={product.quantity}
            onChangeText={(text) => setProduct({...product, quantity: text})}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.label}>Fiyat (TL)</Text>
          <TextInput
            style={styles.input}
            value={product.price}
            onChangeText={(text) => setProduct({...product, price: text})}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  barcodeText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#20B2AA',
    borderColor: '#20B2AA',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  sizeContainer: {
    marginBottom: 20,
  },
  sizeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sizeButtonActive: {
    backgroundColor: '#20B2AA',
    borderColor: '#20B2AA',
  },
  sizeButtonText: {
    color: '#666',
    fontSize: 14,
  },
  sizeButtonTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#20B2AA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddProductScreen; 