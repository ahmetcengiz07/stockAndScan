import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateQuantity } from '../redux/slices/stockSlice';
import { addTransaction } from '../redux/slices/cashSlice';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success',
  });
  const [currentStock, setCurrentStock] = useState(product.quantity);
  const [saleQuantity, setSaleQuantity] = useState(1);

  const handleUpdateStock = amount => {
    if (amount === -1 && currentStock <= 0) {
      setModalConfig({
        title: 'Uyarı',
        message: "Stok miktarı 0'dan küçük olamaz",
        type: 'warning',
      });
      setModalVisible(true);
      return;
    }

    const newStock = currentStock + amount;
    if (newStock === 0) {
      setModalConfig({
        title: 'Uyarı',
        message: 'Bu üründe yeterli stok yoktur',
        type: 'warning',
      });
      setModalVisible(true);
    }
    setCurrentStock(newStock);
    dispatch(updateQuantity({ barcode: product.barcode, quantity: amount }));
  };

  const handleSale = () => {
    if (currentStock <= 0) {
      setModalConfig({
        title: 'Uyarı',
        message: 'Bu üründe yeterli stok yoktur',
        type: 'warning',
      });
      setModalVisible(true);
      return;
    }

    if (saleQuantity > currentStock) {
      setModalConfig({
        title: 'Uyarı',
        message: 'Seçilen miktar stoktan fazla!',
        type: 'warning',
      });
      setModalVisible(true);
      return;
    }

    // Stoktan düş
    dispatch(updateQuantity({ barcode: product.barcode, quantity: -saleQuantity }));
    setCurrentStock(prev => prev - saleQuantity);

    // Kasaya ekle
    dispatch(
      addTransaction({
        productName: product.name,
        barcode: product.barcode,
        quantity: saleQuantity,
        amount: product.price * saleQuantity,
        category: product.category,
        size: product.size,
        color: product.color,
        price: product.price,
        product: product,
      })
    );

    setModalConfig({
      title: 'Başarılı',
      message: `${saleQuantity} adet ürün satışı yapıldı`,
      type: 'success',
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalConfig.type === 'success') {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons
              name={
                product.category === 'Tulum'
                  ? 'shirt'
                  : product.category === 'Elbise'
                    ? 'glasses'
                    : product.category === 'Ayakkabı'
                      ? 'walk'
                      : 'shirt-outline'
              }
              size={40}
              color="#20B2AA"
            />
            <Text style={styles.title}>{product.name}</Text>
          </View>

          {product.photo && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: product.photo.uri }} style={styles.photo} />
            </View>
          )}

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
            <Text style={styles.value}>{Math.round(product.price)} TL</Text>
          </View>

          <View style={styles.saleQuantityContainer}>
            <Text style={styles.label}>Satış Adedi:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setSaleQuantity(prev => Math.max(1, prev - 1))}
                disabled={saleQuantity <= 1}
              >
                <Ionicons name="remove" size={24} color={saleQuantity <= 1 ? '#ccc' : '#20B2AA'} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{saleQuantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setSaleQuantity(prev => Math.min(currentStock, prev + 1))}
                disabled={saleQuantity >= currentStock}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={saleQuantity >= currentStock ? '#ccc' : '#20B2AA'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saleButton} onPress={handleSale}>
            <Ionicons name="cart-outline" size={24} color="#fff" style={styles.saleIcon} />
            <Text style={styles.saleButtonText}>
              {saleQuantity > 1
                ? `${saleQuantity} Adet Satış Yap (${Math.round(product.price * saleQuantity)} TL)`
                : `Satış Yap (${Math.round(product.price)} TL)`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProduct', { product })}
          >
            <Ionicons name="create-outline" size={24} color="#fff" style={styles.editIcon} />
            <Text style={styles.editButtonText}>Ürünü Düzenle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={handleModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
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
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editIcon: {
    marginRight: 4,
  },
  saleButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saleIcon: {
    marginRight: 4,
  },
  saleQuantityContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 5,
    marginTop: 5,
  },
  quantityButton: {
    padding: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
  },
  photoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ProductDetail;
