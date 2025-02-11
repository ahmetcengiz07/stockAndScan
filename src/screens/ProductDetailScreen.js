import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const product = useSelector(state => 
    state.products.items.find(item => item.id === productId)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.detail}>Barkod: {product.barcode}</Text>
      <Text style={styles.detail}>Stok: {product.stock}</Text>
      <Text style={styles.detail}>Fiyat: ₺{product.price}</Text>
      {/* Diğer ürün detayları */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ProductDetailScreen; 