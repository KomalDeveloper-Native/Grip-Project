/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {FC} from 'react';
import {
  Pressable,
  Image,
  Keyboard,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../style/colors';
import {TextInput, Title} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import {postMethod, storeData} from '../../../utils/helper';
import {Controller, useForm} from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import {CommonActions} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import ArrowIcon from '../../Component/ArrowIcon';

interface Props {}
const ForgetPassword: FC<Props> = ({navigation}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [isemailFocused, setemailFocused] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    ForgetPassword(data);
  };

  const ForgetPassword = async (props: any) => {
    const raw = {
      email: props.email,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('request-password-reset', raw);
      if (response.status === 200) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'EmailCode',
            params: {
              email: props.email,
            },
          }),
        );
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };
  return (
    <>
      <ArrowIcon iconName={'arrow-back'} navigation={navigation} />

    <View style={styles.container}>
      <View>
        <Image
          source={require('../../img/one.jpeg')}
          style={styles.logoImage} />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView enabled>
          <View style={styles.cover}>
            <Text style={styles.title}>Forget Password</Text>
            <View>
              <Text style={styles.text}>
                Don’t worry! it happens, please enter the email associated with
                your account
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                  pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    placeholderTextColor={colors.black}
                    underlineColor={colors.white}
                    value={value}
                    activeOutlineColor="gray"
                    outlineColor="white"
                    onChangeText={value => onChange(value)}
                    style={styles.textInput}
                    textColor="black"
                    placeholder="Email address" />
                )}
                name="email" />
              {errors.email && errors.email.type === 'required' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon} />
                  <Text style={styles.error}>email is required.</Text>
                </View>
              )}
              {errors.email && errors.email.type === 'pattern' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon} />
                  <Text style={styles.error}>email is not valid.</Text>
                </View>
              )}
            </View>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={styles.btn}
              android_ripple={{ color: 'white' }}>
              {loading ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <Text style={styles.btnText}>Send Code</Text>
              )}
            </Pressable>

            <View style={{ flexDirection: 'row', alignSelf: "center" }}>
              <Text style={styles.text1}>Remeber Password?</Text>
              <Pressable onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.text1}>Login</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View></>
  );
};

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
    marginVertical: responsiveWidth(30),
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
  title: {
    textAlign: 'left',
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    marginBottom: 5,
    fontFamily: 'Roboto-SemiBold',
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
  text: {
    textAlign: 'left',
    color: 'gray',
    fontSize: responsiveFontSize(1.65),
    marginBottom: 10,
    fontFamily: 'Roboto-Light',
    opacity: 10,
  },
  text1: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.85),
    marginBottom: 10,
    opacity: 10,
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    textDecorationLine: 'underline',
  },
  errorInput: {
    borderColor: 'red',
  },

  row: {
    flexDirection: 'row',
    marginLeft: 12,
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
    marginBottom: 45,
    justifyContent: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
});

export default ForgetPassword;
