/* eslint-disable jsx-quotes */
/* eslint-disable no-dupe-keys */
/* eslint-disable quotes */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, {FC, useState} from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Keyboard,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import colors from '../../style/colors';
import {Controller, useForm} from 'react-hook-form';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {postMethod, storeData} from '../../../utils/helper';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}

const ResendOtpScreen: FC<Props> = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const [isphone_noFocused, setphone_noFocused] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  // use React Hook Form
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      phone_no: '',
    },
  });
  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    LogIn(data);
  };

  const LogIn = async (props: any) => {
    const apiResponse = {
      data: {
        status: false,
        message: 'Incorrect Email and Password',
      },
    };
    const raw = {
      phone_no: props.phone_no,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('reset-otp', raw);
      if (response.status === 200) {
        await storeData(response.data);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'OtpVerification',
            params: {
              phone_no: props.phone_no,
            },
          }),
        );
      } else {
        Snackbar.show({
          text: apiResponse.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error', apiResponse.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require('../../img/one.jpeg')}
          style={styles.logoImage}
        />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.cover}>
          <KeyboardAvoidingView enabled>
            <Text style={styles.label}>Resend OTP</Text>

            <View style={styles.coverText}>
              <View style={styles.textRow}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholder="Enter Mobile No"
                      underlineColor={colors.white}
                      keyboardType={'number-pad'}
                      placeholderTextColor={colors.text_secondary}
                      value={value}
                      onChangeText={value => onChange(value)}
                      textColor="black"
                      style={styles.textInput}
                    />
                  )}
                  name="phone_no"
                />
                {errors.phone_no && errors.phone_no.type === 'required' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>phone_no is required.</Text>
                  </View>
                )}
                {errors.phone_no && errors.phone_no.type === 'minLength' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>
                      phone_no should be 10 digits.
                    </Text>
                  </View>
                )}
                {errors.phone_no && errors.phone_no.type === 'maxLength' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>
                      Mobile no should be 10 digits.
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* <Pressable onPress={() => navigation.navigate('ResendOtpScreen')}>
              <Text style={styles.forgotBox}>
                Login in With{' '}
                <Text style={[styles.forgotBox, {fontFamily: 'Roboto-Bold'}]}>
                  Email
                </Text>{' '}
              </Text>
            </Pressable> */}

            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={styles.btn}
              android_ripple={{color: 'white'}}>
              {loading ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <Text style={styles.btnText}>Send OTP</Text>
              )}
            </Pressable>

            <View style={styles.LoginRow}>
              <Text style={styles.btnText0}>Don’t have an account ? </Text>
              <Pressable
                android_ripple={{color: 'white'}}
                onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.btnText1}>Register Now</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default ResendOtpScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  logoImage: {
    width: responsiveWidth(40),
    height: responsiveHeight(15),
    alignSelf: 'center',
    marginVertical: responsiveWidth(10),
  },
  cover: {
    width: wp('100%'),
    height: hp('76.5%'),
    backgroundColor: colors.white,
    padding: 24,
    paddingVertical: 50,
    borderRadius: 50,
    elevation: 10.5,
    opacity: 8.15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  coverText: {
    height: responsiveHeight(27),
    marginBottom:-135
  },

  textRow: {
    marginBottom: 8,
  },
  label: {
    color: colors.black,
    fontSize: 17,
    fontFamily: 'Roboto-Medium',
    marginBottom:20
  },
  textInput: {
    width: responsiveWidth(86.5),
    height: responsiveHeight(7),
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 10,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0.1,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRightColor: 'white',
    borderColor: 'gray',
  },

  forgotBox: {
    textAlign: 'right',
    color: 'black',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 55,
  },
  textInputFocused: {
    borderColor: colors.bg_green,
  },
  errorInput: {
    borderColor: 'red',
  },

  row: {
    width: responsiveWidth(86.5),
    flexDirection: 'row',
    marginLeft: 12,
  },
  icon: {
    marginRight: 4,
    marginTop: -3,
  },
  error: {
    width: 280,
    color: 'red',
    fontSize: 10,
    marginTop: -5,
    // marginBottom
  },
  btn: {
    backgroundColor: colors.black,
    width: wp('87%'),
    height: hp('7%'),
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 20,
    borderRadius: 8,
    elevation: 0.05,
    marginBottom: 15,
    justifyContent: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },

  Text: {
    color: colors.black,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
    marginBottom: 19,
  },
  icon0: {
    fontSize: 50,
  },
  LoginRow0: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    // alignSelf:"center",
  },
  googleIcon: {
    color: '#4285F4',
  },
  appleIcon: {
    color: '#000000',
  },
  facebookIcon: {
    color: '#3b5998',
  },

  LoginRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignSelf: 'center',
  },
  btnText0: {
    color: colors.gray,
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
  },
  btnText1: {
    color: colors.black,
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    textDecorationLine: 'underline',
  },
});
