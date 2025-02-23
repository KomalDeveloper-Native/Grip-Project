/* eslint-disable no-const-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {Avatar, Icon, SearchBar} from 'react-native-elements';
import {locale} from 'moment';
import {Circle} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import colors from '../../../style/colors';
import {Row} from 'react-day-picker';

import {
  deleteMethod,
  FormPostMethod,
  getMethod,
  postMethod,
  putMethod,
} from '../../../../utils/helper2';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCouponCode1 } from '../../../../Redux/ListSlice ';
import ApplyCoupon from './ApplyCoupon';

interface Props {}

const CartItemScreen: FC<Props> = ({navigation,setItem}) => {
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const coupon=useSelector(state => state.List.couponCode1)

  const [image, setImage] = useState([]);
  const [price, setPrice] = useState(null);
  const [qty, setQty] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback( () => {
   fetchCart();
    }, [orderItems])
  );

  const fetchCart = async () => {
    const token = await AsyncStorage.getItem('guestCartToken');
    setLoading(true);
    try {
      const response = await getMethod(`guest-carts/${token}/items/`);

      if (response.status === 200) {
        console.log(response.data)
        setOrderItems(
          response.data,
        );
        setItem(response.data)

      }
    } catch (error) {
      console.log(error,'j')
    }
  };

  const fetchImages = async () => {
    const item = await AsyncStorage.getItem('guestOrder');
    setLoading(true);
    try {
      const response = await getMethod(
        `products/${item.sku}?fields=media_gallery_entries[file]`,
      );
      if (response.status === 200) {
        setImage(response.data.media_gallery_entries);
      }
    } catch (error) {}
  };

  const increment = async (item, index) => {
    const token = await AsyncStorage.getItem('guestCartToken');
    setLoading(true);
    const cartItem = {
      cartItem: {
        quote_id: token,
        sku: item.sku,
        qty: 0
      },
    };

    try {
      const response = await postMethod(`guest-carts/${token}/items`, cartItem);
      if (response.status === 200) {
        setQty(item.qty);
        orderItems[index].price = orderItems[index].price * item.qty;
        setPrice(orderItems[index].price);
        fetchCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const decrement = async (item, index) => {
    const token = await AsyncStorage.getItem('guestCartToken');
    const updatedCartItems = [...orderItems]; // Create a shallow copy of the state array

    if (updatedCartItems[index].qty > 1) {
      // Calculate new quantity and price
      const newQty = updatedCartItems[index].qty-1
      const unitPrice = parseFloat(item.price)
      const newPrice = unitPrice * newQty
      setPrice(newPrice)


      // Update the state
      setOrderItems(updatedCartItems);

      try {
        // Sync with API
        const cartItem = {
          cartItem: {
            item_id: item.item_id,
            quote_id: token,
            sku: item.sku,
            qty: newQty
          },
        };

        const response = await postMethod(
          `guest-carts/${token}/items`,
          cartItem,
        );
        if (response.status === 200) {
          console.log('Cart updated successfully:', response.data);
      await fetchCart()

        }
      } catch (error) {
        console.error('Error updating cart:', error);
        Alert.alert('Error', 'Failed to update the cart. Please try again.');
      }
    } else {
      // Handle item removal
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from the cart?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: async () => {
              removeFromCart(item)
            },
          },
        ],
      );
    }
  };

  const removeFromCart = async item => {
    const token = await AsyncStorage.getItem('guestCartToken');
    setLoading(true);
    try {
      const response = await deleteMethod(
        `guest-carts/${token}/items/${item.item_id}`,
      );

      if (response.status === 200) {
        const updatedCartItems = [...orderItems]; // Copy the order items
        const filteredItems = updatedCartItems.filter(
          cartItem => cartItem.item_id !== item.item_id,
        );
        console.error(filteredItems,'kom')
        setOrderItems(filteredItems);
       await fetchCart()
      }
    } catch (error) {
      console.error(error, 'll');
      setLoading(false);
    }
  };

  


  if (loading) {
    <ActivityIndicator size={20} color={'black'} />;
  }

  return (
    <View style={styles.container}>
     <ScrollView
          contentContainerStyle={{
            alignSelf: 'center',
            alignItems: 'center',
            width: responsiveWidth(100),
            justifyContent: 'center',
            backgroundColor: 'white',
            paddingVertical: 5,
            opacity: 95,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView enabled>
      {orderItems.length === 0 ? (
        // Empty Cart View
        <View style={styles.emptyCartContainer}>
          <View style={styles.imageWithIconContainer}>
            <Image
              source={require('../../../img/Vector.png')}
              style={styles.emptyCartImage}
            />
            <Icon
              type="material-community"
              name="plus"
              size={50}
              color="black"
              style={styles.plusIcon}
            />
          </View>
          <Text style={styles.emptyCartText}>ohhh. Your cart is empty</Text>
          <Text style={styles.emptyCartSubText}>but it doesn’t have to be</Text>
          <Pressable
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('ShopScreen')} // Update to your shop screen
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </Pressable>
        </View>
      ) : (
       
      orderItems.map((item, index) => (
              <View style={styles.cart}>
                <View
                  style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    width: responsiveWidth(85),
                    marginBottom: 20,
                  }}>
                  <Icon
                    name="close"
                    size={25}
                    color="black"
                    onPress={() => removeFromCart(item)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: responsiveWidth(85),
                  }}>
                  {item.length > 0 ? (
                    image.map(item => (
                      <View style={styles.content}>
                        <Image
                          source={{
                            uri: `https://gripkart.com/pub/media/catalog/product${item.file}`,
                          }}
                          style={styles.image}
                        />
                      </View>
                    ))
                  ) : (
                    <View style={styles.content}>
                      <Image
                        source={{
                          uri: `https://gripkart.com/pub/media/catalog/product${image.file}`,
                        }}
                        style={styles.image}
                      />
                    </View>
                  )}

                  <View style={styles.column}>
                    <Text style={styles.text1}>
                      {item.name.length > 40
                        ? `${item.name.substring(0, 40)}...`
                        : item.name}
                    </Text>
                    <Text style={styles.text2}>{item.product_type}</Text>
                    <Text style={styles.text1}>
                      Rs {item.qty < 1 ? item.price : item.price * item.qty}
                    </Text>
                  </View>
                  <View style={styles.numberContainer}>
                    <Icon
                      type="material-community"
                      name="minus"
                      size={25}
                      color={'black'}
                      onPress={() => decrement(item, index)}
                    />
                    <Text>{item.qty}</Text>
                    <Icon
                      type="material-community"
                      name="plus"
                      size={25}
                      color={'black'}
                      onPress={() => increment(item, index)}
                    />
                  </View>
                </View>
              </View>
            ))
      )}
        </KeyboardAvoidingView>
          </ScrollView>
      {/* Cover for Payment and Coupon */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingBottom: 0,
    opacity: 7,
  },
  row: {
    width: responsiveWidth(60),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  text: {
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'center',
  },

  cart: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderRadius: 10,
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 1,
    opacity: 85,
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    // flexDirection: 'row',
  },
  content: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    elevation: 1,
    opacity: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    resizeMode: 'contain',
  },
  column: {
    width: responsiveWidth(35),
    gap: 2,
    flexDirection: 'column',
  },
  numberContainer: {
    width: responsiveWidth(20),

    height: responsiveHeight(5),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    elevation: 1,
  },
  text1: {
    width: responsiveWidth(40),

    color: 'black',
    fontSize: responsiveFontSize(1.62),
    fontFamily: 'Roboto-Bold',
    textAlign: 'justify',
    lineHeight: responsiveFontSize(2.5),
  },
  text2: {
    width: responsiveWidth(40),

    color: 'black',
    fontSize: responsiveFontSize(1.65),
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
  },

  cover: {
    width: wp('100%'),
    height: hp('45%'),
    backgroundColor: colors.white,
    borderRadius: 40,
    elevation: 5.5,
    opacity: 88.15,
    marginTop: 20,
    borderEndEndRadius: 0,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
    alignSelf: 'center',
    padding: 20,
    marginBottom: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  couponContainer: {
    width: wp('88%'),

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  couponInput: {
    width: responsiveWidth(70),
    height: responsiveHeight(5),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    elevation: 1,
    marginLeft: 1,
    position: 'relative',
    zIndex: -5,
    borderColor:'white'
  },
  applyButton: {
    width: responsiveWidth(15),
    height: responsiveHeight(7.5),
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successText: {
    color: 'green',
    fontSize: responsiveFontSize(1.8),
    marginBottom: 20,
  },
  paymentContainer: {
    marginTop: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentText: {
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  paymentValue: {
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  totalText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'black',
  },
  totalValue: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 10,
  },

  btn: {
    width: responsiveWidth(85),
    height: responsiveHeight(6.5),
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 80,
    borderRadius: 50,
    alignSelf: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageWithIconContainer: {
    flexDirection: 'row',
    gap: 0,
    marginTop: -5,
    marginBottom: 55,
  },

  emptyCartImage: {
    width: responsiveWidth(23),
    height: responsiveHeight(15),
    resizeMode: 'contain',
    borderTopRightRadius: 50,
    position: 'absolute',
    zIndex: -55,
  },

  plusIcon: {
    marginLeft: 55.5, // Space between image and plus icon,
    marginTop: 2.2,
    position: 'relative',

    zIndex: 999,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
  },

  emptyCartText: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },

  emptyCartSubText: {
    fontSize: responsiveFontSize(2),
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto-Regular',
  },

  shopNowButton: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  shopNowText: {
    fontSize: responsiveFontSize(2),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CartItemScreen;
