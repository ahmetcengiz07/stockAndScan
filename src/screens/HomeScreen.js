import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { products } = useSelector(state => state.stock);

  const totalProducts = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalVariants = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= 1).length;

  const categories = [
    'Yenidoğan takımları',
    'İkili takımlar',
    'Ceketli takımlar',
    'Üçlü takımlar',
    'Tulumlar',
    'Elbiseler',
    'Battaniyeler',
    'Bornozlar',
    'Trikolar',
    'Sweatler',
    'Çoraplar',
    'Şapkalar',
    'Zıbınlar',
    'Tokalar',
  ];

  const handleCategoryPress = category => {
    navigation.navigate('Stok Listesi', { selectedCategory: category });
  };

  const handleLowStockPress = () => {
    navigation.navigate('Stok Listesi', { showLowStock: true });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Hoş Geldiniz</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="cube" size={30} color="#20B2AA" />
            <Text style={styles.statNumber}>{totalProducts}</Text>
            <Text style={styles.statLabel}>Toplam Stok</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="apps" size={30} color="#20B2AA" />
            <Text style={styles.statNumber}>{totalVariants}</Text>
            <Text style={styles.statLabel}>Ürün Çeşidi</Text>
          </View>

          <TouchableOpacity style={styles.statCard} onPress={handleLowStockPress}>
            <Ionicons
              name="warning"
              size={30}
              color={lowStockProducts > 0 ? '#FF6B6B' : '#20B2AA'}
            />
            <Text style={[styles.statNumber, lowStockProducts > 0 && styles.lowStockNumber]}>
              {lowStockProducts}
            </Text>
            <Text style={styles.statLabel}>Az Stok</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <View style={styles.categoryGrid}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <Ionicons
                  name={
                    category.includes('takım')
                      ? 'shirt'
                      : category === 'Tulumlar'
                        ? 'shirt'
                        : category === 'Elbiseler'
                          ? 'shirt-outline'
                          : category === 'Battaniyeler'
                            ? 'bed-outline'
                            : category === 'Bornozlar'
                              ? 'water-outline'
                              : category === 'Trikolar' || category === 'Sweatler'
                                ? 'shirt'
                                : category === 'Çoraplar'
                                  ? 'footsteps-outline'
                                  : category === 'Şapkalar'
                                    ? 'glasses-outline'
                                    : category === 'Zıbınlar'
                                      ? 'shirt-outline'
                                      : category === 'Tokalar'
                                        ? 'flower-outline'
                                        : 'shirt-outline'
                  }
                  size={24}
                  color="#20B2AA"
                />
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 30, // Alt kısımda ekstra padding
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
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
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
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
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
    paddingHorizontal: 5,
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
    textAlign: 'center',
  },
  lowStockNumber: {
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
});

export default HomeScreen;
