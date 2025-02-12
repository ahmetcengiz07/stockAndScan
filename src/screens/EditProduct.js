import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../redux/slices/stockSlice';

const EditProduct = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();

  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [size, setSize] = useState(product.size);
  const [color, setColor] = useState(product.color);
  const [price, setPrice] = useState(product.price.toString());

  const handleSave = () => {
    if (!name || !category || !size || !color || !price) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const updatedProduct = {
      ...product,
      name,
      category,
      size,
      color,
      price: parseFloat(price)
    };

    dispatch(updateProduct(updatedProduct));
    Alert.alert(
      'Başarılı',
      'Ürün başarıyla güncellendi',
      [{ text: 'Tamam', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ürün Düzenle</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ürün Adı:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ürün adı"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kategori:</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Kategori"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Beden:</Text>
          <TextInput
            style={styles.input}
            value={size}
            onChangeText={setSize}
            placeholder="Beden"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Renk:</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="Renk"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fiyat (TL):</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Fiyat"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#20B2AA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProduct; 