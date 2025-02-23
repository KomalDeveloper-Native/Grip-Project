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
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import colors from '../../style/colors';
import {Controller, useForm} from 'react-hook-form';
import Snackbar from 'react-native-snackbar';
import Feather from 'react-native-vector-icons/Feather';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {postMethod, storeData} from '../../../utils/helper';
import {ScrollViewBase} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}

const RegisterScreen: FC<Props> = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordVisible1, setPasswordVisible1] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!isPasswordVisible1);
  };

  // use React Hook Form
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      first_name: '',
      email: '',
      password: '',
      mobile_no: '',
      address: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    SignUp(data);
  };

  //  Handle to Login Function
  const SignUp = async (props: any) => {
    const raw = {
      first_name: props.first_name,
      email: props.email,
      mobile_no: props.mobile_no,
      password: props.password,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('signup', raw);
      console.log(response.data);
      if (response.data.status === true) {
        await storeData(response.data);
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: '#7CA942',
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'DrawerNavigation'}],
        });
      } else {
        const emailErrors = response?.data?.errors?.email ?? [];
        const message = response?.data?.message ?? '';
        const errorMessage = [...emailErrors, message].join('\n');

        // Display in Snackbar
        Snackbar.show({
          text: errorMessage,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
      Snackbar.show({
        text: error,
        duration: 1000,
        textColor: colors.white,
        backgroundColor: 'red',
      });
    }
    const userId = uuid.v4();

    try {
      await firestore().collection('Users').doc(userId).set({
        first_name: props.first_name,
        email: props.email,
        mobile_no: props.mobile_no,
        password: props.password,
        userId: userId,
      });

      // After successfully adding user to Firestore
      const userData = {userId};
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('User added successfully and data stored in AsyncStorage.');
    } catch (error) {
      console.error('Failed to add user: ', error);
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
        <KeyboardAvoidingView enabled>
          <View style={styles.cover}>
            <Text style={styles.RagisterType}>Register Now</Text>
            <View style={styles.coverText}>
              <View style={styles.coverText0}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholder="Name"
                      underlineColor={colors.white}
                      placeholderTextColor={colors.text_secondary}
                      value={value}
                      onChangeText={value => onChange(value)}
                      textColor="black"
                      style={styles.textInput}
                    />
                  )}
                  name="first_name"
                />
                {errors.first_name && errors.first_name.type === 'required' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>Name is required.</Text>
                  </View>
                )}
              </View>
              <View style={styles.coverText0}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholder="Email"
                      underlineColor={colors.white}
                      placeholderTextColor={colors.text_secondary}
                      value={value}
                      onChangeText={value => onChange(value)}
                      textColor="black"
                      style={styles.textInput}
                    />
                  )}
                  name="email"
                />
                {errors.email && errors.email.type === 'required' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>Email is required.</Text>
                  </View>
                )}
                {errors.email && errors.email.type === 'pattern' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>Email is not valid.</Text>
                  </View>
                )}
              </View>
              <View style={styles.coverText0}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholder="Mobile No"
                      underlineColor={colors.white}
                      keyboardType={'number-pad'}
                      placeholderTextColor={colors.text_secondary}
                      value={value}
                      onChangeText={value => onChange(value)}
                      textColor="black"
                      style={styles.textInput}
                    />
                  )}
                  name="mobile_no"
                />
                {errors.mobile_no && errors.mobile_no.type === 'required' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>Mobile_no is required.</Text>
                  </View>
                )}
                {errors.mobile_no && errors.mobile_no.type === 'minLength' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>
                      Mobile_no should be 10 digits.
                    </Text>
                  </View>
                )}
                {errors.mobile_no && errors.mobile_no.type === 'maxLength' && (
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

              <View style={styles.coverText0}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    minLength: 8, // Adjusted minLength to 8 since the pattern requires at least 8 characters
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={colors.text_secondary}
                      underlineColor={colors.white}
                      value={value}
                      activeOutlineColor="gray"
                      outlineColor="white"
                      onChangeText={value => onChange(value)}
                      style={styles.textInput}
                      textColor="black"
                      secureTextEntry={!isPasswordVisible}
                      right={
                        <TextInput.Icon
                          icon={isPasswordVisible ? 'eye' : 'eye-off'}
                          size={20}
                          onPress={togglePasswordVisibility}
                        />
                      }
                    />
                  )}
                  name="password"
                />
                {errors.password && errors.password.type === 'required' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>Password is required.</Text>
                  </View>
                )}
                {errors.password && errors.password.type === 'minLength' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>
                      Password must be at least 8 characters long.
                    </Text>
                  </View>
                )}
                {errors.password && errors.password.type === 'pattern' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>
                      Password must include uppercase, lowercase, numeric, and
                      special characters.
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.coverText0}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    validate: value =>
                      value === getValues('password') ||
                      'Passwords do not match',
                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholder="Confirm Password"
                      placeholderTextColor={colors.text_secondary}
                      underlineColor={colors.white}
                      value={value}
                      activeOutlineColor="gray"
                      outlineColor="white"
                      onChangeText={value => onChange(value)}
                      style={styles.textInput}
                      textColor="black"
                      secureTextEntry={!isPasswordVisible1}
                      right={
                        <TextInput.Icon
                          icon={isPasswordVisible1 ? 'eye' : 'eye-off'}
                          size={20}
                          onPress={togglePasswordVisibility1}
                        />
                      }
                    />
                  )}
                  name="confirmPassword"
                />
                {errors.confirmPassword && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>Passwords do not match</Text>
                  </View>
                )}
              </View>
            </View>

            <Pressable
              style={styles.btn}
              android_ripple={{color: 'white'}}
              onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <Text style={styles.btnText}>Register </Text>
              )}
            </Pressable>

            <Pressable style={styles.btn0} android_ripple={{color: 'white'}}>
              <View style={styles.LoginRow}>
                <Text style={styles.btnText0}>Already Have a Account? </Text>
                <Pressable onPress={() => navigation.navigate('LoginScreen')}>
                  <Text style={styles.btnText1}>Login Now</Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreen;
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
    marginVertical: responsiveWidth(5),
  },
  RagisterType: {
    width: responsiveWidth(89),
    alignSelf: 'center',
    color: colors.black,
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Roboto-Medium',
    alignItems: 'flex-start',
  },
  cover: {
    width: wp('100%'),
    height: hp('89.5%'),
    backgroundColor: colors.white,
    // padding: 24,
    paddingVertical: 10,
    borderRadius: 50,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 10.5,
    opacity: 8.15,
    shadowColor: 'gray',
  },
  coverText: {
    // height: responsiveHeight(55),
  },
  coverText0: {
    height: responsiveHeight(10),
    marginBottom: 5,
  },

  textInput: {
    width: responsiveWidth(89),
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

  row: {
    flexDirection: 'row',
    width: responsiveWidth(89),
    alignSelf: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 4,
    marginTop: -3,
  },
  error: {
    width: 330,
    color: 'red',
    fontSize: 10,
    marginTop: -5,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: colors.black,
    width: responsiveWidth(85),
    height: responsiveHeight(6),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 20,
    borderRadius: 8,
    elevation: 0.05,
    marginBottom: 0,
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  btn0: {
    backgroundColor: colors.white,
    width: responsiveWidth(85),
    height: responsiveHeight(7),
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 20,
    borderRadius: 8,
    elevation: 4,
    borderColor: 'gray',
    opacity: 1.45,
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 50,
    borderLeftWidth: 0.1,
    borderRightWidth: 0.1,
  },
  LoginRow: {
    flexDirection: 'row',
  },
  btnText0: {
    color: colors.black,
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
