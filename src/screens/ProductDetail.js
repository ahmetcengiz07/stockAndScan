import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateQuantity } from '../redux/slices/stockSlice';
import { Ionicons } from '@expo/vector-icons';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();

  const handleUpdateStock = (amount) => {
    if (amount === -1 && product.quantity <= 0) {
      Alert.alert("Uyarı", "Stok zaten 0'da!");
      return;
    }
    
    dispatch(updateQuantity({ barcode: product.barcode, quantity: amount }));
    Alert.alert(
      "Başarılı",
      `Stok ${amount > 0 ? 'arttırıldı' : 'azaltıldı'}`,
      [{ text: "Tamam", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons 
            name={product.category === 'Tulum' ? 'shirt' : 
                  product.category === 'Elbise' ? 'glasses' : 
                  product.category === 'Ayakkabı' ? 'walk' : 'shirt-outline'} 
            size={40} 
            color="#20B2AA" 
          />
          <Text style={styles.title}>{product.name}</Text>
        </View>

        <View style={styles.barcodeContainer}>
          <Ionicons name="barcode-outline" size={24} color="#20B2AA" />
          <Text style={styles.barcodeText}>Barkod: {product.barcode}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Kategori:</Text>
          <Text style={styles.value}>{product.category}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Beden:</Text>
          <Text style={styles.value}>{product.size}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Renk:</Text>
          <Text style={styles.value}>{product.color}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Stok:</Text>
          <Text style={[styles.value, styles.stockValue]}>{product.quantity}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Fiyat:</Text>
          <Text style={styles.value}>{product.price} TL</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.decreaseButton]}
            onPress={() => handleUpdateStock(-1)}
          >
            <Text style={styles.buttonText}>Stok Azalt (-1)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.increaseButton]}
            onPress={() => handleUpdateStock(1)}
          >
            <Text style={styles.buttonText}>Stok Arttır (+1)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.editButton]}
          onPress={() => navigation.navigate('EditProduct', { product })}
        >
          <Text style={styles.editButtonText}>Ürünü Düzenle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  stockValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#20B2AA',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  decreaseButton: {
    backgroundColor: '#ff6b6b',
  },
  increaseButton: {
    backgroundColor: '#20B2AA',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  barcodeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'monospace',
  },
  editButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetail; 