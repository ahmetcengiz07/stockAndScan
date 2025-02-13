import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../redux/slices/stockSlice';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';

const EditProduct = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();

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

  const categories = [
    'Yenidoğan takımları',
    'İkili takımlar',
    'Ceketli takımlar',
    'Ceketli takımlar',
    'Üçlü takımlar',
    'Tulumlar',
    'Elbiseler',
    'Battaniyeler',
    ,
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
  };

  useEffect(() => {
    // Fiyatı formatlı şekilde göster
    formatPrice(price);
  }, []);

  const formatPrice = value => {
    // Virgül ve noktaları temizle
    const cleanValue = value.replace(/[.,]/g, '');
    // Son iki rakamı kuruş olarak ayır
    const length = cleanValue.length;
    let formattedValue = '';

    if (length <= 2) {
      formattedValue = '0,' + cleanValue.padStart(2, '0');
    } else {
      const lira = cleanValue.slice(0, length - 2);
      const kurus = cleanValue.slice(length - 2);
      // Binlik ayracı ekle
      formattedValue = Number(lira).toLocaleString('tr-TR') + ',' + kurus;
    }

    setFormattedPrice(formattedValue);
    // Gerçek değeri kaydet
    setPrice((Number(cleanValue) / 100).toString());
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
    };

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
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Barkod:</Text>
          <View style={styles.barcodeInputContainer}>
            <Ionicons name="barcode-outline" size={24} color="#20B2AA" style={styles.barcodeIcon} />
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
                  style={[styles.pickerItemText, category === cat && styles.pickerItemTextSelected]}
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
                <Text style={[styles.pickerItemText, size === s && styles.pickerItemTextSelected]}>
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
          <Text style={styles.label}>Stok Miktarı:</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(prev => (parseInt(prev) - 1).toString())}
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fiyat (TL):</Text>
          <View style={styles.quantityContainer}>
            <TextInput
              style={[styles.quantityInput, { flex: 1 }]}
              value={formattedPrice}
              onChangeText={formatPrice}
              placeholder="0,00"
              keyboardType="numeric"
              textAlign="center"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={handleModalClose}
      />
    </ScrollView>
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
    fontFamily: 'monospace',
  },
});

export default EditProduct;
