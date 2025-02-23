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
import {Avatar, CheckBox, Icon, SearchBar} from 'react-native-elements';
import {locale} from 'moment';
import {Circle} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
// import colors from '../../../style/colors';
import {Row} from 'react-day-picker';
import ShippingAddress from '../Address/ShippingAddress';
import Snackbar from 'react-native-snackbar';
import colors from '../../../style/colors';
import {getMethod, getStorageData} from '../../../../utils/helper2';
import RazorpayCheckout from 'react-native-razorpay';
import Mycart from './MycartScreen';
import MycartScreen from './MycartScreen';
import CartItemScreen from './CartItemScreen';

interface Props {}

const CheckoutScreen: FC<Props> = ({navigation}) => {
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [pass, setPass] = useState(false);
  const [loader, setLoader] = useState(false);
  const [item, setItem] = useState([]);

  const sentFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'PaymentScreen',
        params: {
          isChecked:isChecked
        },
      }),
    );
  };

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };

  const Payment = async () => {
    const storage = await getStorageData();
    const user = storage.response.user;
    if (150) {
      setLoader(true);
      try {
        let options = {
          description: 'Payment',
          image: require('../../../img/GRIPLogo.jpg'),
          currency: 'INR',
          key: 'rzp_test_9D90iVl6rEVRoN',
          amount: 15 * 100,
          name: 'FitGrip',
          order_id: '',
          theme: {color: colors.black},
        };

        RazorpayCheckout.open(options)
          .then(data => {
            if (data) {
              const paymentData = {
                bookId: 5212,
                razorpay_payment_id: 'rzp_live_5VC3pVIlFuAnB3',
                paymentType: 'Online',
                paymentStatus: 'success',
                amount: 150,
                name: user.name,
                email: user.email,
                number: user.phone_number,
                // address: user.address
              };
              paymentMutation.mutate(paymentData);
            } else {
              setLoader(false);
              Snackbar.show({
                text: 'Failed To Pay, Try Again',
                duration: Snackbar.LENGTH_SHORT,
                textColor: colors.white,
                backgroundColor: colors.error,
              });
            }
          })
          .catch(error => {
            setLoader(false);
            Snackbar.show({
              text: 'Payment Process Cancelled',
              duration: Snackbar.LENGTH_SHORT,
              textColor: colors.white,
              backgroundColor: colors.error,
            });
          });
      } catch (error) {
        setLoader(false);
        Snackbar.show({
          text: 'Error processing payment',
          duration: Snackbar.LENGTH_SHORT,
          textColor: colors.white,
          backgroundColor: colors.error,
        });
      }
    } else {
      Snackbar.show({
        text: 'Enter Some Amount',
        duration: Snackbar.LENGTH_SHORT,
        textColor: colors.white,
        backgroundColor: colors.error,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon
            type="material"
            name="arrow-back"
            size={25}
            color={'black'}
            style={{marginLeft: 10}}
          />
        </Pressable>
        <Text style={styles.text}>Checkout</Text>
      </View>
      <Text style={styles.locationText}>Shipping Address</Text>
      <ShippingAddress isChecked={isChecked} setPass={setPass} pass={pass} />
      <View
        style={{
          flexDirection: 'row',
          rowGap: 5,
          marginLeft: 10,
          width: responsiveWidth(90),
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <View>
          <View style={{flexDirection: 'row', gap: 5}}>
            <Icon
              name="location-on"
              type="material"
              size={20}
              color={'black'}
            />

            <Text style={styles.location}>Home</Text>
          </View>
          <Text style={[styles.changeBtnText, {marginLeft: 10}]}>
            karol Bagh, Delhi
          </Text>
        </View>

        <Pressable
          style={styles.changeBtn}
          onPress={() => navigation.navigate('AddressScreen')}>
          <Text style={styles.changeBtnText}>Change</Text>
        </Pressable>
      </View>

      <CheckBox
        title="Billing address same as shipping address"
        checkedColor="black"
        textStyle={{fontFamily: 'Roboto-Medium', color: 'black'}}
        checked={isChecked}
        onPress={handleCheckboxToggle}
        containerStyle={styles.checkbox}
      />
      {!isChecked && (
        <ShippingAddress isChecked={isChecked} setPass={setPass}  />
      )}

      <Text style={styles.checkout}>Order List</Text>
   
      <ScrollView>
        <CartItemScreen navigation={navigation} setItem={setItem} isChecked={isChecked}
        
        />
      </ScrollView>
      {
        item.length>0 && (
          <Pressable style={styles.btn} onPress={() => sentFun()}>
          <Text style={styles.btnText}>Process to Checkout</Text>
        </Pressable>
        )
      }
    
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
  locationText: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(3),
    textAlign: 'justify',
    alignSelf: 'center',
    marginBottom: -3,
  },
  location: {
    width: responsiveWidth(59.5),

    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.85),
  },
  changeBtn: {
    backgroundColor: 'white',
    width: responsiveWidth(25),

    height: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'justify',
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 50,
    elevation: 2,
    opacity: 55,
  },
  changeBtnText: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),
  },
  checkout: {
    width: responsiveWidth(90),

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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 1,
    opacity: 88,
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    flexDirection: 'row',
  },
  content: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    elevation: 1,
    opacity: 85,
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
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Bold',
    textAlign: 'left',
    alignSelf: 'center',
  },
  text2: {
    width: responsiveWidth(40),

    color: 'black',
    fontSize: responsiveFontSize(1.65),
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    alignSelf: 'center',
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

  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 5,
    fontSize: responsiveFontSize(1),
  },
});

export default CheckoutScreen;
