import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const StockScreen = ({ navigation, route }) => {
  const { products } = useSelector(state => state.stock);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCategory = route.params?.selectedCategory;
  const showLowStock = route.params?.showLowStock;

  const filteredProducts = products
    .filter(product => {
      if (showLowStock) {
        return product.quantity <= 1;
      }
      return !selectedCategory || product.category === selectedCategory;
    })
    .filter(
      product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderItem = ({ item }) => {
    const isLowStock = item.quantity <= 1;

    return (
      <TouchableOpacity
        style={[styles.productCard, isLowStock && styles.lowStockCard]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={styles.cardContent}>
          {item.photo ? (
            <Image source={{ uri: item.photo.uri }} style={styles.productImage} />
          ) : (
            <View style={styles.productIconContainer}>
              <Ionicons
                name={
                  item.category === 'Tulum'
                    ? 'shirt'
                    : item.category === 'Elbise'
                      ? 'glasses'
                      : item.category === 'Ayakkabı'
                        ? 'walk-outline'
                        : 'shirt-outline'
                }
                size={24}
                color={isLowStock ? '#FF6B6B' : '#20B2AA'}
              />
            </View>
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>
              {item.category} - {item.size} - {item.color}
            </Text>
            {isLowStock && (
              <Text style={styles.criticalStockWarning}>
                Kritik Stok Uyarısı: {item.quantity} adet kaldı!
              </Text>
            )}
          </View>
          <View style={styles.quantityContainer}>
            <Text style={[styles.quantity, isLowStock ? styles.lowStock : null]}>
              {item.quantity}
            </Text>
            <Text style={styles.price}>{item.price} TL</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {(selectedCategory || showLowStock) && (
        <View style={styles.categoryHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.setParams({ selectedCategory: null, showLowStock: false })}
          >
            <Ionicons name="close-circle" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.categoryTitle}>
            {showLowStock ? 'Kritik Stok Seviyesindeki Ürünler' : selectedCategory}
          </Text>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ürün ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.barcode}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#20B2AA" />
            <Text style={styles.emptyText}>
              {selectedCategory
                ? `${selectedCategory} kategorisinde ürün bulunamadı`
                : 'Ürün bulunamadı'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct', { barcode: null })}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  list: {
    padding: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetails: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  quantityContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lowStock: {
    color: '#20B2AA',
  },
  price: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#20B2AA',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lowStockCard: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  criticalStockWarning: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
});

export default StockScreen;
