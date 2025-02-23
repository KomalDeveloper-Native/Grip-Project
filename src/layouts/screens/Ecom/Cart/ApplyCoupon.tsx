/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {FC} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector,useDispatch} from 'react-redux';
import {deleteMethod, putMethod} from '../../../../utils/helper2';
import {CommonActions} from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-paper';
import { setCouponCode1 } from '../../../../Redux/ListSlice ';

interface Props {
    navigation:any
}
const ApplyCoupon: FC<Props> = ({itemBill,navigation}): JSX.Element => {
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const coupon = useSelector(state => state.List.couponCode1);
  const [couponCode, setCouponCode] = useState('');
  const dispatch=useDispatch()
  console.log(coupon)


  const applyCoupon = async () => {
    const token = await AsyncStorage.getItem('guestCartToken');
    setLoading(true);
    try {
      const response = await putMethod(
        `guest-carts/${token}/coupons/${couponCode}`,
      );

      if (response.status === 200) {
        setCode(response.data);
      const result =  dispatch(setCouponCode1(response.data));
      console.log(result)
      }

      // setCouponCode('')

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const sentFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CheckoutScreen',
        // params: {
        //   franchiseid: id,
        // },
      }),
    );
  };

  const deleteCoupon = async () => {
    const token = await AsyncStorage.getItem('guestCartToken');
    setLoading(true);
    try {
      const response = await deleteMethod(`guest-carts/${token}/coupons/`);

      if (response.status === 200) {
        console.log(coupon, code, response.data, 'fo');

        setCode(false);
        dispatch(setCouponCode1(null));
      }

      setCouponCode('');

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <View style={styles.cover}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Apply Coupon */}
        <Text style={styles.sectionTitle}>Apply Coupon</Text>
        <View style={styles.couponContainer}>
          <TextInput
            style={styles.couponInput}
            placeholder="Enter coupon code"
            onChangeText={setCouponCode}
            value={couponCode}
            activeOutlineColor='white'
            outlineColor='white'
            
          />
          {!coupon ? (
            <Pressable style={styles.applyButton} onPress={() => applyCoupon()}>
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.applyButton, {backgroundColor: 'red'}]}
              onPress={() => deleteCoupon()}>
              <Text style={styles.applyText}>Cancel</Text>
            </Pressable>
          )}
        </View>
        {coupon && <Text style={styles.successText}>Coupon applied!</Text>}

        {/* Payment Details */}
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.paymentContainer}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentText}>Sub total</Text>
            <Text style={styles.paymentValue}>{itemBill.subtotal}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentText}>Delivery Fee</Text>
            <Text style={styles.paymentValue}>{itemBill.shipping_amount}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentText}>Discount</Text>
            <Text style={styles.paymentValue}>{itemBill.discount_amount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalValue}>{itemBill.grand_total}</Text>
          </View>
        </View>
        <Pressable style={styles.btn} onPress={() => sentFun()}>
          <Text style={styles.btnText}>Process to Checkout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
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
    borderColor: 'white',
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

export default ApplyCoupon;
