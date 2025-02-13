import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity } from '../redux/slices/stockSlice';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(true);
  const dispatch = useDispatch();
  const products = useSelector(state => state.stock.products) || [];

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    const unsubscribe = navigation.addListener('focus', () => {
      setScanning(true);
    });

    return unsubscribe;
  }, [navigation]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanning) return;
    setScanning(false);

    const product = products.find(p => p.barcode === data);

    if (product) {
      navigation.navigate('ProductDetail', { product });
    } else {
      Alert.alert('Yeni Ürün', 'Bu barkoda ait ürün sistemde kayıtlı değil.', [
        {
          text: 'Ürün Ekle',
          onPress: () => navigation.navigate('AddProduct', { barcode: data }),
          style: 'default',
        },
        {
          text: 'İptal',
          onPress: () => setScanning(true),
          style: 'cancel',
        },
      ]);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera" size={50} color="#20B2AA" />
        <Text style={styles.permissionText}>Kamera izni isteniyor...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="warning" size={50} color="#20B2AA" />
        <Text style={styles.permissionText}>Kamera izni reddedildi</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => BarCodeScanner.requestPermissionsAsync()}
        >
          <Text style={styles.permissionButtonText}>İzin İste</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
        </View>
        <View style={styles.bottomOverlay}>
          <Text style={styles.instructions}>Barkodu tarama alanına yerleştirin</Text>
          {!scanning && (
            <TouchableOpacity style={styles.rescanButton} onPress={() => setScanning(true)}>
              <Text style={styles.rescanButtonText}>Tekrar Tara</Text>
            </TouchableOpacity>
          )}
        </View>
      </BarCodeScanner>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderRadius: 20,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#20B2AA',
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#20B2AA',
    borderTopRightRadius: 20,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#20B2AA',
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#20B2AA',
    borderBottomRightRadius: 20,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  rescanButton: {
    backgroundColor: '#20B2AA',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  rescanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionText: {
    color: '#333',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#20B2AA',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScanScreen;
