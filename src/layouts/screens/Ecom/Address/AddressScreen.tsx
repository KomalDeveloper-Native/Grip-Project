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

interface Props {}

const AddressScreen: FC<Props> = ({navigation}) => {
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);

  const [selectedValue, setSelectedValue] = useState(null);

  const options = [{id: 1, label: ''}];

  const applyCoupon = () => {
    if (couponCode.trim() === '') {
      Alert.alert('Error', 'Please enter a valid coupon code.');
    } else {
      setApplied(true);
      Alert.alert('Success', `Coupon "${couponCode}" applied!`);
    }
  };

  const sentFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'PaymentScreen',
        // params: {
        //   franchiseid: id,
        // },
      }),
    );
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

      <ScrollView
        contentContainerStyle={{
          width: responsiveWidth(100),
          backgroundColor: 'white',
          opacity: 9,
          alignSelf: 'center',
          paddingTop: 10,
        }}>
        <View style={styles.cart}>
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
          {options.map(option => (
            <CheckBox
              key={option.id}
              title={option.label}
              checked={selectedValue === option.id}
              onPress={() => setSelectedValue(option.id)}
              containerStyle={styles.checkBoxContainer}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="green"
              uncheckedColor="gray"
            />
          ))}
        </View>
        <Pressable style={styles.btn} onPress={() => sentFun()}>
          <Icon
            name="plus"
            type="material-community"
            size={30}
            color={'black'}
          />
          <Text style={[styles.btnText]}>Add New Shipping Address</Text>
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
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 20,
  },

  btn: {
    width: responsiveWidth(85),
    height: responsiveHeight(6.5),
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'lightgray',
  },
  btnText: {
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.8),
  },
});

export default AddressScreen;
