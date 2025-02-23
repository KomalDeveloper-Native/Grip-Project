/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable semi */
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
} from 'react-native';
import {Card} from 'react-native-paper';
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
import colors from '../../style/colors';
import {Avatar, Icon, SearchBar} from 'react-native-elements';
import {locale} from 'moment';
import {Circle} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import {getMethod, postMethod} from '../../../utils/helper2';
import {useDispatch, useSelector} from 'react-redux';
import {setOrderItem, setTokens} from '../../../Redux/ListSlice ';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {}

const Description: FC<Props> = ({navigation, route}) => {
  const { sku, specialPrice } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<any>({});
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategory();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategory();
      fetchToken();
    }, [])
  );
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await getMethod(
        `products/${sku}?fields=id,sku,name,price,media_gallery_entries[types,file],custom_attributes,extension_attributes,description,stock_item`
      );
      if (response.status === 200) {
        const data = response.data;
        setCategory(data);
        setDescription(
          data.custom_attributes.find((attr: any) => attr.attribute_code === 'description')?.value || ''
        );
        setImage(data.media_gallery_entries || []);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      Alert.alert('Error', 'Failed to fetch product details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchToken = async () => {
    try {
      const existingToken = await AsyncStorage.getItem('guestCartToken');
      if (!existingToken) {
        const response = await postMethod('guest-carts');
        if (response.status === 200) {
          const newToken = response.data;
          await AsyncStorage.setItem('guestCartToken', newToken);
          setToken(newToken);
          dispatch(setTokens(newToken));
        }
      } else {
        setToken(existingToken);
      }
    } catch (error) {
      console.error('Error fetching guest cart token:', error);
    }
  };

  const addToCart = async () => {
    if (!token) {
      Alert.alert('Error', 'Cart token is missing. Please try again.');
      return;
    }

    setLoading(true);
    const cartItem = {
      cartItem: {
        quote_id: token,
        sku,
        qty: 1,
      },
    };

    try {
      const response = await postMethod(`guest-carts/${token}/items`, cartItem);
      if (response.status === 200) {
        const data = response.data;
        await AsyncStorage.setItem('guestOrder', JSON.stringify(data));
        dispatch(setOrderItem(response.data));
        navigation.navigate('Mycart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Icon
          type="material"
          name="arrow-back"
          size={25}
          color={'black'}
          style={{
            marginLeft: 10,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
          }}
        />
      </Pressable>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        dotStyle={styles.dot}
        dotColor="gray"
        activeDotColor="black"
        activeDotStyle={styles.dotStyle}
        onIndexChanged={index => {
          console.log('Current index:', index);
          setActiveIndex(index);
        }}>
        {image.map(item => (
          <View style={styles.slide1} key={item.file}>
            <Image
              source={{
                uri: `https://gripkart.com/pub/media/catalog/product${item.file}`,
              }}
              style={styles.image}
            />
          </View>
        ))}
      </Swiper>
      <View style={styles.cover}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text style={styles.text1}>{category.name}</Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignSelf: 'flex-start',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 8,
            }}>
            <Text style={[styles.productSpecialPrice]}>
              Rs {category.price}
            </Text>
            <Text style={styles.productPrice}>Rs {specialPrice}</Text>
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <View
              style={{
                backgroundColor: 'lightgray',
                width: 60,
                height: 25,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',

                opacity: 1,
                gap: 5,
              }}>
              <Text>4.8</Text>
              <Icon name="star" color={'orange'} size={20} />
            </View>
          <Text>(100 Review)</Text>
          </View> */}
          <View>
            <Text style={[styles.text1, {fontSize: responsiveFontSize(2)}]}>
              Description
            </Text>
            <Text style={styles.text2}>{description.value}</Text>
            <Text style={[styles.text1, {fontSize: responsiveFontSize(2)}]}>
              Specifications
            </Text>
            <View
              style={styles.specification}>
              <Text style={styles.bold}>Special Price</Text>
              <Text style={styles.light}>{specialPrice}</Text>
            </View>
            <View
              style={styles.specification}>
              <Text style={styles.bold}>Price</Text>
              <Text style={styles.light}>{category.price}</Text>
            </View>
            <View
              style={styles.specification}>

              <Text style={styles.bold}>Quantiy</Text>
              <Text style={styles.light}>{category.qty}</Text>
            </View>
            {/* <Text style={[styles.text1, {fontSize: responsiveFontSize(2)}]}>
              Review
            </Text> */}
          </View>
        </ScrollView>
        <View style={styles.btn}>
          <View>
            <Text
              style={[
                styles.text1,
                {
                  fontSize: responsiveFontSize(1.8),
                  color: 'white',
                  marginBottom: 2,
                },
              ]}>
              Total
            </Text>
            <Text
              style={[
                styles.text1,
                {
                  fontSize: responsiveFontSize(2),
                  color: 'white',
                  marginBottom: 2,
                },
              ]}>
              Rs {specialPrice}
            </Text>
          </View>
          <Pressable style={styles.cart} onPress={addToCart}>
            <Text
              style={[
                {
                  fontFamily: 'Roboto-Medium',
                  fontSize: responsiveFontSize(2),
                  color: 'black',
                  marginBottom: 0,
                },
              ]}>
              Add To Cart
            </Text>
          </Pressable>
        </View>
      </View>
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
  },

  // Product Swiper
  wrapper: {
    height: responsiveHeight(40),
    justifyContent: 'center',
    alignItems: 'center',
    //  flex: 1 ,
  },
  dot: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderRadius: 10,
    marginTop: 200,
  },
  dotStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    color: 'white',
    width: 12,
    height: 12,

    borderRadius: 10,
    marginTop: 200,
  },
  slide1: {
    justifyContent: 'flex-end',

    alignItems: 'center',
  },

  image: {
    width: responsiveWidth(90),
    height: responsiveHeight(38),
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom:0
  },
  text: {
    width: responsiveWidth(95),

    color: 'black',
    fontSize: responsiveFontSize(2.6),
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'center',
    marginBottom: 20,
  },
  cover: {
    width: wp('100%'),
    height: hp('52.5%'),
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
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    // width: responsiveWidth(65),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.2),
    marginBottom: 5,
    alignItems: 'flex-start',
    textAlign: 'justify',


  },
  text2: {
    width: responsiveWidth(85),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.9),
    marginBottom: 10,
    textAlign: 'auto',
  },
  bold: {
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    marginBottom: 10,
    textAlign: 'auto',
  },
  light: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.9),
    marginBottom: 10,
    textAlign: 'left',
  },
  specification:{
    
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: responsiveWidth(50),
    
  },
  btn: {
    width: responsiveWidth(100),
    height: responsiveHeight(10),
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: 'row',
    padding: 20,
  },
  cart: {
    width: responsiveWidth(40),
    height: responsiveHeight(6),
    backgroundColor: 'white',
    borderRadius: 50,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  productPrice: {
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
  },
  productSpecialPrice: {
    color: 'gray',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.9),
    textDecorationLine: 'line-through',
  },
});

export default Description;
