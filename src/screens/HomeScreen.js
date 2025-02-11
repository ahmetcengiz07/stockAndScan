import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { products } = useSelector((state) => state.stock);

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity < 5).length;

  const handleCategoryPress = (category) => {
    navigation.navigate('Stok Listesi', { selectedCategory: category });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="cube" size={30} color="#20B2AA" />
            <Text style={styles.statNumber}>{totalProducts}</Text>
            <Text style={styles.statLabel}>Toplam Ürün</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="warning" size={30} color="#20B2AA" />
            <Text style={styles.statNumber}>{lowStockProducts}</Text>
            <Text style={styles.statLabel}>Az Stok</Text>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Tulum')}
            >
              <Ionicons name="shirt" size={24} color="#20B2AA" />
              <Text style={styles.categoryText}>Tulum</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Elbise')}
            >
              <Ionicons name="glasses" size={24} color="#20B2AA" />
              <Text style={styles.categoryText}>Elbise</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Ayakkabı')}
            >
              <Ionicons name="footsteps" size={24} color="#20B2AA" />
              <Text style={styles.categoryText}>Ayakkabı</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Diğer')}
            >
              <Ionicons name="shirt-outline" size={24} color="#20B2AA" />
              <Text style={styles.categoryText}>Diğer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  categoriesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
});

export default HomeScreen; 
