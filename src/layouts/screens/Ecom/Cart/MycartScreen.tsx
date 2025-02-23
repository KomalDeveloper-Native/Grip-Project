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
import CartItemScreen from './CartItemScreen';

interface Props {}

const Mycart: FC<Props> = ({navigation, route}) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemBill, setItemsBill] = useState<[]>([]);
  const [orderItems, setOrderItems] = useState<[]>([]);
  const [image, setImage] = useState([]);
    const [item, setItem] = useState([]);
  const dispatch=useDispatch()

  useFocusEffect(
    useCallback(() => {
      getCartBill()
    }, [itemBill])
  );


  const getCartBill = async () => {
    const token = await AsyncStorage.getItem('guestCartToken');
    setLoading(true); 
    try {
      const response = await getMethod(`guest-carts/${token}/totals`);

      if (response.status === 200) {
        setItemsBill(response.data)
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (loading) {
    <ActivityIndicator size={20} color={'black'} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
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
        <Text style={styles.text}>My Cart</Text>
      </View>
      <CartItemScreen  navigation={navigation} setItem={setItem} />
      {/* Cover for Payment and Coupon */}
     <ApplyCoupon itemBill={itemBill} navigation={navigation}/>
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

export default Mycart;
