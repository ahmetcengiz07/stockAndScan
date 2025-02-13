import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { cancelTransaction, cancelMultiSaleTransaction } from '../redux/slices/cashSlice';
import { updateQuantity } from '../redux/slices/stockSlice';

const CashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { transactions, totalCash } = useSelector(state => state.cash);
  const { products } = useSelector(state => state.stock);
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, today, week, month
  const [searchQuery, setSearchQuery] = useState('');

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
    Alert.alert('Satış İptali', 'Bu satışı iptal etmek istediğinize emin misiniz?', [
      {
        text: 'İptal',
        style: 'cancel',
      },
      {
        text: 'Evet',
        onPress: () => {
          if (transaction.isMultiSale) {
            // Çoklu satış iptali
            const relatedTransactions = transactions.filter(
              t => t.multiSaleId === transaction.multiSaleId
            );
            const totalAmount = relatedTransactions.reduce((sum, t) => sum + t.amount, 0);

            dispatch(
              cancelMultiSaleTransaction({
                multiSaleId: transaction.multiSaleId,
                totalAmount,
              })
            );

            // Her ürün için stok güncelleme
            relatedTransactions.forEach(t => {
              dispatch(
                updateQuantity({
                  barcode: t.barcode,
                  quantity: t.quantity, // Stoka geri ekle
                })
              );
            });
          } else {
            // Tekli satış iptali
            dispatch(
              cancelTransaction({
                transactionId: transaction.id,
                amount: transaction.amount,
              })
            );

            // Stok güncelleme
            dispatch(
              updateQuantity({
                barcode: transaction.barcode,
                quantity: transaction.quantity, // Stoka geri ekle
              })
            );
          }
        },
      },
    ]);
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
      style={styles.transactionCard}
      onLongPress={() => handleCancelTransaction(item)}
      onPress={() => handleTransactionPress(item)}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.barcodeText}>Barkod: {item.barcode}</Text>
        </View>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString('tr-TR')}</Text>
      </View>

      <View style={styles.transactionDetails}>
        <Text style={styles.quantity}>{item.quantity} adet</Text>
        <Text style={styles.amount}>{item.amount} TL</Text>
      </View>

      {item.isMultiSale && (
        <View style={styles.multiSaleBadge}>
          <Text style={styles.multiSaleText}>Çoklu Satış</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Toplam Kasa</Text>
        <Text style={styles.totalAmount}>{totalCash.toLocaleString('tr-TR')} TL</Text>
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
          <Text style={styles.statLabel}>Satış Adedi</Text>
          <Text style={styles.statValue}>{periodTotals.count}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Satılan Ürün</Text>
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cash-outline" size={48} color="#20B2AA" />
              <Text style={styles.emptyText}>Satış işlemi bulunamadı</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    fontFamily: 'monospace',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  transactionDetails: {
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
});

export default CashScreen;
