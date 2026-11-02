import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  StatusBar, 
  Modal, 
  Alert,
  ScrollView
} from 'react-native';
import { fetchProducts, fetchFlashDeals, createOrder } from './src/services/api';

const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [cartVisible, setCartVisible] = useState(false);
  
  // Structured Home Delivery Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [division, setDivision] = useState('ঢাকা');
  const [district, setDistrict] = useState('ঢাকা');
  const [thana, setThana] = useState('');
  const [homeAddress, setHomeAddress] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    if (data && data.length > 0) {
      setProducts(data);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    Alert.alert('সফল!', `"${product.title_bn || product.title}" কার্টে যোগ হয়েছে।`);
  };

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !thana.trim() || !homeAddress.trim()) {
      Alert.alert('সতর্কতা', 'দয়া করে নাম, ফোন নম্বর, বিভাগ, জেলা, থানা এবং বাসার সম্পূর্ণ ঠিকানা পূরণ করুন।');
      return;
    }

    const fullAddress = `${homeAddress}, থানা: ${thana}, জেলা: ${district}, বিভাগ: ${division}`;

    const payload = {
      customer: { name: customerName, phone: customerPhone },
      shipping_address: fullAddress,
      address_details: {
        division,
        district,
        thana,
        home_address: homeAddress
      },
      items: cart,
      payment_method: 'cod'
    };

    const res = await createOrder(payload);
    if (res.success || res.order) {
      const orderId = res.order ? res.order.order_id : 'PIRAN-' + Math.floor(100000 + Math.random() * 900000);
      Alert.alert('অভিনন্দন! 🎉', `আপনার হোম ডেলিভারি অর্ডারটি নিশ্চিত হয়েছে!\nঅর্ডার আইডি: ${orderId}\nঠিকানা: ${fullAddress}`);
      setCart([]);
      setCartVisible(false);
    } else {
      Alert.alert('ত্রুটি', res.message || 'অর্ডার করতে সমস্যা হয়েছে।');
    }
  };

  const filtered = products.filter(p => 
    !search || (p.title_bn && p.title_bn.includes(search)) || (p.title && p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cartTotal >= 1500 ? 0 : (district === 'ঢাকা' ? 60 : 120);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4338ca" />

      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>PIRAN SHOP</Text>
          <Text style={styles.brandSubtitle}>মেগা মার্কেটপ্লেস</Text>
        </View>

        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setCartVisible(true)}
        >
          <Text style={styles.cartIconText}>🛒</Text>
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.reduce((a, b) => a + b.quantity, 0)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput 
          placeholder="পণ্য খুঁজুন (যেমন: ঘড়ি, পাঞ্জাবি...)"
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Products List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.categoryText}>{item.category_name}</Text>
            <Text numberOfLines={2} style={styles.productTitle}>{item.title_bn || item.title}</Text>
            <Text style={styles.priceText}>৳{item.price.toLocaleString()}</Text>

            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>+ কার্টে যোগ</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Cart & Structured Address Modal */}
      <Modal visible={cartVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>হোম ডেলিভারি চেকআউট</Text>
              <TouchableOpacity onPress={() => setCartVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartItemsScroll}>
              {cart.map((item, index) => (
                <View key={index} style={styles.cartRow}>
                  <Text style={styles.cartRowTitle} numberOfLines={1}>{item.title_bn || item.title}</Text>
                  <Text style={styles.cartRowPrice}>
                    {item.quantity}x ৳{item.price}
                  </Text>
                </View>
              ))}

              {/* Structured Address Form */}
              <View style={styles.formSection}>
                <Text style={styles.formTitle}>গ্রাহকের তথ্য</Text>
                <TextInput 
                  placeholder="আপনার পূর্ণ নাম *"
                  value={customerName}
                  onChangeText={setCustomerName}
                  style={styles.input}
                />
                <TextInput 
                  placeholder="সচল মোবাইল নম্বর *"
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  style={styles.input}
                />

                <Text style={[styles.formTitle, { marginTop: 10 }]}>ডেলিভারি ঠিকানা</Text>
                <View style={styles.rowInputs}>
                  <TextInput 
                    placeholder="বিভাগ (যেমন: ঢাকা) *"
                    value={division}
                    onChangeText={setDivision}
                    style={[styles.input, { flex: 1, marginRight: 6 }]}
                  />
                  <TextInput 
                    placeholder="জেলা (যেমন: ঢাকা) *"
                    value={district}
                    onChangeText={setDistrict}
                    style={[styles.input, { flex: 1, marginLeft: 6 }]}
                  />
                </View>

                <TextInput 
                  placeholder="থানা / উপজেলা (যেমন: মিরপুর / উত্তরা) *"
                  value={thana}
                  onChangeText={setThana}
                  style={styles.input}
                />
                <TextInput 
                  placeholder="বাসা নং, রোড নং, ফ্ল্যাট, এলাকা বিস্তারিত *"
                  multiline
                  numberOfLines={2}
                  value={homeAddress}
                  onChangeText={setHomeAddress}
                  style={[styles.input, { height: 60 }]}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <View style={styles.priceRow}>
                <Text style={styles.label}>ডেলিভারি চার্জ:</Text>
                <Text style={[styles.val, deliveryFee === 0 && { color: '#16a34a' }]}>
                  {deliveryFee === 0 ? 'ফ্রি ডেলিভারি' : `৳${deliveryFee}`}
                </Text>
              </View>
              <Text style={styles.totalText}>মোট বিল: ৳{(cartTotal + deliveryFee).toLocaleString()}</Text>
              <TouchableOpacity 
                style={styles.checkoutBtn}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutText}>ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করুন</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandTitle: { color: '#ffffff', fontSize: 20, fontWeight: '900' },
  brandSubtitle: { color: '#c7d2fe', fontSize: 11 },
  cartButton: { position: 'relative', padding: 6 },
  cartIconText: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fbbf24',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  searchContainer: { padding: 12, backgroundColor: '#ffffff' },
  searchInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a'
  },
  listContent: { padding: 8 },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 6,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  cardImage: { width: '100%', height: 130, borderRadius: 12 },
  categoryText: { fontSize: 10, color: '#64748b', marginTop: 8 },
  productTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginTop: 2, height: 36 },
  priceText: { fontSize: 15, fontWeight: '900', color: '#4f46e5', marginTop: 4 },
  addButton: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 8,
    alignItems: 'center'
  },
  addButtonText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    padding: 20
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  closeBtn: { fontSize: 20, color: '#64748b', fontWeight: 'bold' },
  cartItemsScroll: { maxHeight: 380 },
  cartRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  cartRowTitle: { fontSize: 12, color: '#0f172a', flex: 1 },
  cartRowPrice: { fontSize: 12, fontWeight: 'bold', color: '#4f46e5' },
  formSection: { marginTop: 14 },
  formTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12,
    marginBottom: 8,
    color: '#0f172a'
  },
  modalFooter: { borderTopWidth: 1, borderColor: '#f1f5f9', paddingTop: 12, marginTop: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 12, color: '#64748b' },
  val: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  totalText: { fontSize: 15, fontWeight: '900', color: '#0f172a', marginBottom: 10 },
  checkoutBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  checkoutText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 }
});
