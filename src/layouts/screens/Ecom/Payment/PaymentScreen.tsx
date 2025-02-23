/* eslint-disable no-dupe-keys */
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
import colors from '../../../style/colors';
import {Row} from 'react-day-picker';
import TrackOrderScreen from '../Order/TrackOrder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorageData, postMethod, putMethod } from '../../../../utils/helper2';
import Snackbar from 'react-native-snackbar';

interface Props {}

const PaymentScreen: FC<Props> = ({navigation,route}) => {
  const {allAddress,isChecked}=route.params;
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);
 const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [selectedValue, setSelectedValue] = useState('cod');

 

  const sentFun = () => {
    if(selectedValue==='cod'){
      PaymenFunction()
    }
   

  };

  const PaymenFunction = async () => {
    let address:any = await AsyncStorage.getItem('address');
    const address1:any=JSON.parse(address)
    const token = await AsyncStorage.getItem('guestCartToken');
    console.error(token,'ff')
    setLoading(true);
    try {
      const row = {
         email:"lalkomal805@gmail.com",
         billing_address: {
          ...address1.billing_address,
          save_in_address_book: 1,
        },
          shipping_address: {
            ...address1.shipping_address,
            save_in_address_book: 1,
            same_as_billing: 1,
          },
          shipping_method:{
            method_code: "freeshipping",
            carrier_code: "freeshipping",
          },
          payment_method: {
            method: "cashondelivery",
          },
      };

      console.log(row, 'row');
      const response: any = await putMethod(
        `guest-carts/${token}/order`,
        row,
      );
      console.log(response, 'res0');
      if (response.status === 200) {
   
        navigation.dispatch(
          CommonActions.navigate({
            name: 'PaymentSuccessful',
          
          }),
        );
        Snackbar.show({
          text: 'Success add shipping and billing address',
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        //   } else {
        //     Snackbar.show({
        //       text: response.data.message,
        //       duration: 2000,
        //       textColor: colors.white,
        //       backgroundColor: 'red',
        //     });
      }
      setLoading(false);
    } catch (error) {
      console.error('err',error, 'ert');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon
          type="material"
          name="arrow-back"
          size={25}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.text}>Payment Methods</Text>
      </View>
      <Text style={styles.locationText}>Select Your Payment Option</Text>

      <ScrollView
        contentContainerStyle={{
          width: responsiveWidth(100),
          backgroundColor: 'white',
          opacity: 9,
          alignSelf: 'center',
          paddingTop: 10,
        }}>
        <View style={styles.cart}>
          <Text
            style={[
              styles.changeBtnText,
              {
                marginLeft: 10,
                marginBottom: 0,
                fontSize: responsiveFontSize(2.1),
              },
            ]}>
            Credit / Debit card / Net Banking
          </Text>
          <CheckBox
            checked={selectedValue === 'card'}
            onPress={() => setSelectedValue('card')}
            containerStyle={styles.checkBoxContainer}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor="green"
            uncheckedColor="gray"
          />
        </View>
        <View style={styles.cart}>
          <Text
            style={[
              styles.changeBtnText,
              {
                marginLeft: 10,
                marginBottom: 0,
                fontSize: responsiveFontSize(2.1),
              },
            ]}>
            Cash On Delivered
          </Text>
          <CheckBox
            checked={selectedValue === 'cod'}
            onPress={() => setSelectedValue('cod')}
            containerStyle={styles.checkBoxContainer}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor="green"
            uncheckedColor="gray"
          />
        </View>
        <Pressable style={styles.btn} onPress={() => sentFun()}>
          <Text style={[styles.btnText]}>Apply</Text>
        </Pressable>
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
  },
  row: {
    width: responsiveWidth(95),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
    marginRight: 0,
    alignSelf: 'center',
  },
  text: {
    width: responsiveWidth(90),

    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  locationText: {
    width: responsiveWidth(90),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    textAlign: 'justify',
    alignSelf: 'center',
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
    width: responsiveWidth(72),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),
  },

  cart: {
    width: responsiveWidth(90),
    height: responsiveHeight(8),
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 0.7,
    marginBottom: 20,
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
});

export default PaymentScreen;
