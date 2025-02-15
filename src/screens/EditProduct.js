import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../redux/slices/stockSlice';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';
import * as ImagePicker from 'expo-image-picker';

const EditProduct = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const priceInputRef = useRef(null);

  const [barcode, setBarcode] = useState(product.barcode);
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [size, setSize] = useState(product.size);
  const [color, setColor] = useState(product.color);
  const [price, setPrice] = useState(product.price.toString());
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [formattedPrice, setFormattedPrice] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success',
  });
  const [photo, setPhoto] = useState(product.photo || null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

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
  const sizes = [
    'Yeni Doğan',
    '0-3 Ay',
    '3-6 Ay',
    '6-9 Ay',
    '9-12 Ay',
    '12-18 Ay',
    '18-24 Ay',
    '2 Yaş',
    '3 Yaş',
    '4 Yaş',
    '5 Yaş',
    '6 Yaş',
    '7 Yaş',
    '8 Yaş',
    '9 Yaş',
  ];
  const colors = [
    'Siyah',
    'Beyaz',
    'Kırmızı',
    'Mavi',
    'Yeşil',
    'Sarı',
    'Mor',
    'Pembe',
    'Gri',
    'Kahverengi',
    'Diğer',
  ];

  const colorCodes = {
    Siyah: '#000000',
    Beyaz: '#FFFFFF',
    Kırmızı: '#FF0000',
    Mavi: '#0000FF',
    Yeşil: '#008000',
    Sarı: '#FFFF00',
    Mor: '#800080',
    Pembe: '#FFC0CB',
    Gri: '#808080',
    Kahverengi: '#8B4513',
    Diğer: '#000000',
  };

  useEffect(() => {
    formatPrice(price);
  }, []);

  const formatPrice = value => {
    // Virgül ve noktaları temizle
    const cleanValue = value.replace(/[.,]/g, '');
    // Formatlı değeri ayarla
    const formattedValue = Number(cleanValue).toLocaleString('tr-TR');
    setFormattedPrice(formattedValue);
    // Gerçek değeri kaydet
    setPrice(cleanValue);
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Kamerayı kullanabilmek için izin vermeniz gerekiyor.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setPhoto({
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }
    } catch (error) {
      console.log('Kamera hatası:', error);
      Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
    }
    setShowPhotoModal(false);
  };

  const handleChoosePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriyi kullanabilmek için izin vermeniz gerekiyor.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        presentationStyle: 'pageSheet',
        selectionLimit: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      console.log('Galeri sonucu:', result);

      if (!result.canceled) {
        const asset = result.assets[0];
        const filename = asset.uri.split('/').pop() || 'photo.jpg';
        setPhoto({
          uri: asset.uri,
          type: 'image/jpeg',
          name: filename,
        });
      }
    } catch (error) {
      console.log('Galeri hatası detayı:', error);
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu. Hata detayı: ' + error.message);
    }
    setShowPhotoModal(false);
  };

  const handleSave = () => {
    if (!barcode || !name || !category || !size || !color || !price || !quantity) {
      setModalConfig({
        title: 'Hata',
        message: 'Lütfen tüm alanları doldurun',
        type: 'error',
      });
      setModalVisible(true);
      return;
    }

    if (isNaN(quantity) || parseInt(quantity) < 0) {
      setModalConfig({
        title: 'Hata',
        message: 'Lütfen geçerli bir stok miktarı girin',
        type: 'error',
      });
      setModalVisible(true);
      return;
    }

    const updatedProduct = {
      ...product,
      barcode,
      name,
      category,
      size,
      color,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      photo: photo
        ? {
            uri: photo.uri,
            type: 'image/jpeg',
            name: photo.name || 'photo.jpg',
          }
        : null,
    };

    console.log('Kaydedilen ürün:', updatedProduct);
    dispatch(updateProduct(updatedProduct));
    setModalConfig({
      title: 'Başarılı',
      message: 'Ürün başarıyla güncellendi',
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.card}>
          <TouchableOpacity style={styles.photoContainer} onPress={() => setShowPhotoModal(true)}>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={40} color="#666" />
                <Text style={styles.photoPlaceholderText}>Fotoğraf Ekle</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Barkod:</Text>
            <View style={styles.barcodeInputContainer}>
              <Ionicons
                name="barcode-outline"
                size={24}
                color="#20B2AA"
                style={styles.barcodeIcon}
              />
              <TextInput
                style={styles.barcodeInput}
                value={barcode}
                onChangeText={setBarcode}
                placeholder="Barkod"
                keyboardType="numeric"
              />
            </View>
          </View>

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
            <View style={styles.pickerContainer}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pickerItem, category === cat && styles.pickerItemSelected]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      category === cat && styles.pickerItemTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Beden:</Text>
            <View style={styles.pickerContainer}>
              {sizes.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.pickerItem, size === s && styles.pickerItemSelected]}
                  onPress={() => setSize(s)}
                >
                  <Text
                    style={[styles.pickerItemText, size === s && styles.pickerItemTextSelected]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Renk:</Text>
            <View style={styles.pickerContainer}>
              {colors.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.pickerItem,
                    {
                      backgroundColor: color === c ? colorCodes[c] : '#fff',
                      borderColor: color === c ? colorCodes[c] : '#ddd',
                      borderWidth: color === c ? 3 : 1,
                    },
                  ]}
                  onPress={() => setColor(c)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      color === c && styles.pickerItemTextSelected,
                      color === c && (c === 'Beyaz' || c === 'Sarı')
                        ? { color: '#333' }
                        : color === c
                          ? { color: '#fff' }
                          : null,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fiyat (TL):</Text>
            <View style={styles.quantityContainer}>
              <TextInput
                ref={priceInputRef}
                style={[styles.quantityInput, { flex: 1 }]}
                value={formattedPrice}
                onChangeText={formatPrice}
                placeholder="0,00"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Stok Miktarı:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  const newQuantity = parseInt(quantity) - 1;
                  if (newQuantity < 0) {
                    setModalConfig({
                      title: 'Uyarı',
                      message: "Stok miktarı 0'dan küçük olamaz",
                      type: 'warning',
                    });
                    setModalVisible(true);
                    return;
                  }
                  if (newQuantity === 0) {
                    setModalConfig({
                      title: 'Uyarı',
                      message: 'Bu üründe yeterli stok yoktur',
                      type: 'warning',
                    });
                    setModalVisible(true);
                  }
                  setQuantity(newQuantity.toString());
                }}
                disabled={parseInt(quantity) <= 0}
              >
                <Ionicons
                  name="remove"
                  size={24}
                  color={parseInt(quantity) <= 0 ? '#ccc' : '#20B2AA'}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={text => {
                  if (text === '' || /^\d+$/.test(text)) {
                    const newQuantity = parseInt(text || '0');
                    if (newQuantity === 0) {
                      setModalConfig({
                        title: 'Uyarı',
                        message: 'Bu üründe yeterli stok yoktur',
                        type: 'warning',
                      });
                      setModalVisible(true);
                    }
                    setQuantity(text);
                  }
                }}
                keyboardType="numeric"
                textAlign="center"
              />
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(prev => (parseInt(prev) + 1).toString())}
              >
                <Ionicons name="add" size={24} color="#20B2AA" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPhotoModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fotoğraf Seç</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPhotoModal(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.photoOption} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={24} color="#333" />
              <Text style={styles.photoOptionText}>Fotoğraf Çek</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoOption} onPress={handleChoosePhoto}>
              <Ionicons name="image" size={24} color="#333" />
              <Text style={styles.photoOptionText}>Galeriden Seç</Text>
            </TouchableOpacity>

            {photo && (
              <TouchableOpacity
                style={[styles.photoOption, styles.deleteOption]}
                onPress={() => {
                  setPhoto(null);
                  setShowPhotoModal(false);
                }}
              >
                <Ionicons name="trash" size={24} color="#FF6B6B" />
                <Text style={[styles.photoOptionText, { color: '#FF6B6B' }]}>Fotoğrafı Sil</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>

      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={handleModalClose}
      />
    </KeyboardAvoidingView>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  pickerItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    margin: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  pickerItemSelected: {
    borderColor: '#20B2AA',
    borderWidth: 2,
  },
  pickerItemText: {
    fontSize: 14,
    color: '#666',
  },
  pickerItemTextSelected: {
    fontWeight: 'bold',
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 5,
    height: 50,
  },
  quantityButton: {
    padding: 10,
  },
  quantityInput: {
    minWidth: 50,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  barcodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f8f8',
  },
  barcodeIcon: {
    marginRight: 10,
  },
  barcodeInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  photoOptionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EditProduct;
