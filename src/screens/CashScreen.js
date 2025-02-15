import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  cancelTransaction,
  cancelMultiSaleTransaction,
  resetDailyTransactions,
} from '../redux/slices/cashSlice';
import { updateQuantity } from '../redux/slices/stockSlice';
import CustomModal from '../components/CustomModal';

// Android için LayoutAnimation'ı etkinleştir
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { transactions, totalCash } = useSelector(state => state.cash);
  const { products } = useSelector(state => state.stock);
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, today, week, month
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'warning',
  });
  const [showHint] = useState(new Animated.Value(1));
  const [isHintVisible, setIsHintVisible] = useState(true);

  React.useEffect(() => {
    // 2.5 saniye sonra ipucu metnini kaybet
    Animated.sequence([
      Animated.delay(2500),
      Animated.timing(showHint, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animasyon bittiğinde layout animasyonunu başlat ve hint'i gizle
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsHintVisible(false);
    });
  }, []);

  // Filtreleme ve hesaplama fonksiyonları
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        switch (selectedPeriod) {
          case 'today':
            return transactionDate >= today;
          case 'week':
            return transactionDate >= weekAgo;
          case 'month':
            return transactionDate >= monthAgo;
          default:
            return true;
        }
      })
      .filter(transaction =>
        transaction.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [transactions, selectedPeriod, searchQuery]);

  // Dönem toplamları
  const periodTotals = useMemo(() => {
    return {
      count: filteredTransactions.length,
      amount: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
      items: filteredTransactions.reduce((sum, t) => sum + t.quantity, 0),
    };
  }, [filteredTransactions]);

  const handleCancelTransaction = transaction => {
    setSelectedTransaction(transaction);
    setModalConfig({
      title: 'Satış İptali',
      message: 'Bu satışı iptal etmek istediğinize emin misiniz?',
      type: 'warning',
    });
    setModalVisible(true);
  };

  const handleResetDaily = () => {
    setModalConfig({
      title: 'Günlük Kasa Sıfırlama',
      message: 'Bugünün kasa geçmişini sıfırlamak istediğinize emin misiniz?',
      type: 'warning',
    });
    setSelectedTransaction('reset');
    setModalVisible(true);
  };

  const handleModalClose = confirmed => {
    // Eğer success tipinde bir modal ise sadece kapat
    if (modalConfig.type === 'success') {
      setModalVisible(false);
      setSelectedTransaction(null);
      return;
    }

    if (confirmed) {
      if (selectedTransaction === 'reset') {
        // Günlük kasa sıfırlama
        dispatch(resetDailyTransactions());
        setModalConfig({
          title: 'Başarılı',
          message: 'Günlük kasa başarıyla sıfırlandı',
          type: 'success',
        });
        setTimeout(() => {
          setModalVisible(false);
          setSelectedTransaction(null);
        }, 1500);
        return;
      }

      if (selectedTransaction) {
        if (selectedTransaction.isMultiSale) {
          // Çoklu satış iptali
          const relatedTransactions = transactions.filter(
            t => t.multiSaleId === selectedTransaction.multiSaleId
          );
          const totalAmount = relatedTransactions.reduce((sum, t) => sum + t.amount, 0);

          dispatch(
            cancelMultiSaleTransaction({
              multiSaleId: selectedTransaction.multiSaleId,
              totalAmount,
            })
          );

          // Her ürün için stok güncelleme
          relatedTransactions.forEach(t => {
            dispatch(
              updateQuantity({
                barcode: t.barcode,
                quantity: t.quantity,
              })
            );
          });
        } else {
          // Tekli satış iptali
          dispatch(
            cancelTransaction({
              transactionId: selectedTransaction.id,
              amount: selectedTransaction.amount,
            })
          );

          // Stok güncelleme
          dispatch(
            updateQuantity({
              barcode: selectedTransaction.barcode,
              quantity: selectedTransaction.quantity,
            })
          );
        }

        setModalConfig({
          title: 'Başarılı',
          message: 'Satış başarıyla iptal edildi',
          type: 'success',
        });

        setTimeout(() => {
          setModalVisible(false);
          setSelectedTransaction(null);
        }, 1500);
      }
    } else {
      setModalVisible(false);
      setSelectedTransaction(null);
    }
  };

  const handleTransactionPress = transaction => {
    // Eğer transaction içinde product varsa direkt onu kullan
    if (transaction.product) {
      navigation.navigate('ProductDetail', { product: transaction.product });
      return;
    }

    // Barkod varsa products içinden bul
    if (transaction.barcode) {
      const product = products.find(p => p.barcode === transaction.barcode);
      if (product) {
        navigation.navigate('ProductDetail', { product });
        return;
      }
    }

    // Barkod yoksa veya ürün bulunamadıysa, transaction bilgilerinden yeni bir ürün objesi oluştur
    const productFromTransaction = {
      barcode: transaction.barcode || 'Barkod Yok',
      name: transaction.productName,
      category: transaction.category || 'Kategori Yok',
      size: transaction.size || 'Beden Bilgisi Yok',
      color: transaction.color || 'Renk Bilgisi Yok',
      price: transaction.price || 0,
      quantity: 0,
    };

    navigation.navigate('ProductDetail', { product: productFromTransaction });
  };

  const renderPeriodButton = (period, label) => (
    <TouchableOpacity
      style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === period && styles.periodButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }) => (
    <TouchableOpacity
      style={[styles.transactionCard, isHintVisible && styles.transactionCardWithHint]}
      onLongPress={() => handleCancelTransaction(item)}
      onPress={() => handleTransactionPress(item)}
    >
      <View style={styles.transactionContent}>
        {item.product?.photo ? (
          <Image source={{ uri: item.product.photo.uri }} style={styles.productImage} />
        ) : (
          <View style={styles.productIconContainer}>
            <Ionicons name="cart-outline" size={24} color="#20B2AA" />
          </View>
        )}
        <View style={styles.transactionDetails}>
          <View style={styles.transactionHeader}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.barcodeText}>Barkod: {item.barcode}</Text>
            </View>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString('tr-TR')}</Text>
          </View>

          <View style={styles.transactionFooter}>
            <Text style={styles.quantity}>{item.quantity} adet</Text>
            <Text style={styles.amount}>{item.amount} TL</Text>
          </View>
        </View>
      </View>

      {item.isMultiSale && (
        <View style={styles.multiSaleBadge}>
          <Text style={styles.multiSaleText}>Çoklu Satış</Text>
        </View>
      )}

      {isHintVisible && (
        <Animated.View
          style={[
            styles.hintContainer,
            {
              opacity: showHint,
              transform: [{ scaleY: showHint }],
            },
          ]}
        >
          <Animated.View style={{ opacity: showHint }}>
            <View style={styles.hintContent}>
              <Ionicons name="information-circle-outline" size={14} color="#666" />
              <Text style={styles.hintText}>İptal etmek için uzun basın</Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Toplam Kasa</Text>
          <Text style={styles.totalAmount}>{totalCash.toLocaleString('tr-TR')} TL</Text>
          {totalCash > 0 && (
            <TouchableOpacity style={styles.resetButton} onPress={handleResetDaily}>
              <Ionicons name="refresh-circle" size={24} color="#FF6B6B" />
              <Text style={styles.resetButtonText}>Günlük Kasayı Sıfırla</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.periodButtons}>
            {renderPeriodButton('all', 'Tümü')}
            {renderPeriodButton('today', 'Bugün')}
            {renderPeriodButton('week', 'Bu Hafta')}
            {renderPeriodButton('month', 'Bu Ay')}
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Ürün ara..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>İşlem Sayısı</Text>
            <Text style={styles.statValue}>{periodTotals.count}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Toplam Adet</Text>
            <Text style={styles.statValue}>{periodTotals.items}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Toplam Tutar</Text>
            <Text style={styles.statValue}>{periodTotals.amount} TL</Text>
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Satış Geçmişi</Text>
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="cash-outline" size={48} color="#20B2AA" />
                <Text style={styles.emptyText}>Satış işlemi bulunamadı</Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={handleModalClose}
        showCancelButton={modalConfig.type === 'warning'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  totalCard: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginTop: 5,
  },
  filterContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  periodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  periodButtonActive: {
    backgroundColor: '#20B2AA',
  },
  periodButtonText: {
    color: '#666',
    fontSize: 14,
  },
  periodButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#20B2AA',
  },
  transactionsContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionCardWithHint: {
    paddingBottom: 0, // İpucu görünürken padding'i kaldır
  },
  transactionContent: {
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
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  barcodeText: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#20B2AA',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  multiSaleBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#20B2AA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  multiSaleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  resetButtonText: {
    color: '#FF6B6B',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  hintContainer: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  hintContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default CashScreen;
