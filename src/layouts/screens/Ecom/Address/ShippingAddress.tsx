/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable space-infix-ops */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Controller, useForm} from 'react-hook-form';
import {TextInput} from 'react-native-paper';
import {getStorageData} from '../../../../utils/helper';
import Snackbar from 'react-native-snackbar';
import {getMethod, postMethod} from '../../../../utils/helper2';
import colors from '../../../style/colors';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
interface Props {}

const ShippingAddress: FC<Props> = ({navigation, isChecked, setPass}) => {
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);

  useFocusEffect(
    useCallback(() => {
      countryFunction();
      const name = country.map(item => item.name);
      setState(name);
    }, [country]),
  );

  const countryFunction = async () => {
    setLoading(true);
    try {
      const response = await getMethod(`directory/countries/IN/`);
      if (response.status === 200) {
        setCountry(response.data.available_regions);
      }
    } catch (error) {
      console.log(error, 'err');
    }
  };

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      region: '',
      region_id: '',
      country_id: '',
      street: '',
      telephone: '',
      postcode: '',
      city: '',
      firstname: '',
      lastname: '',
      email: '',
    },
  });

  const memoFun = useMemo(async () => {
    const storage = await getStorageData();
    console.log(storage.response);
    const data = storage.response.user;
    setValue('firstname', data.first_name);

    setValue('lastname', data.last_name);
    setValue('email', data.email);
    setValue('telephone', data.phone_number);
  }, []);

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    ShippingAddress(data);
  };

  const ShippingAddress = async data => {

    const storage = await getStorageData();
    // const id = storage.response.user.id;
    const token = await AsyncStorage.getItem('guestCartToken');
    console.log(storage.response);

    let billing = {};

    if (isChecked === true) {
      billing = data;
    }
    setLoading(true);

    let row;
    try {
      country.map(
        item =>
          (row = {
            addressInformation: {
              shipping_address: {
                firstname: billing.firstname,
                lastname: billing.lastname,
                email: billing.email,
                city: billing.city,
                postcode: billing.postcode,
                telephone: billing.telephone,
                street: [billing.street],
                region: billing.region,
                region_id: item.id,
                country_id: 'IN',
                // shape_in_address_book:1,
              },
              billing_address: {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                city: data.city,
                postcode: data.postcode,
                telephone: data.telephone,
                street: [data.street],
                region: data.region,
                region_id: item.id,
                country_id: 'IN',

              },
              shipping_method_code: 'freeshipping',
              shipping_carrier_code: 'freeshipping',
            },
          }),
      );

      console.log(row, 'row');

      console.log(row, 'fdf');
      const response: any = await postMethod(
        `guest-carts/${token}/shipping-information`,
        row,
      );
      if (response.status === 200) {
        console.log(response.data, 'res0');
        await AsyncStorage.setItem(
          'address',
          JSON.stringify(row.addressInformation),
        );
        setPass(true);
        reset();
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
      console.error(error, 'ert');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView enabled>
        {/* First Name */}
        <Controller
          control={control}
          name="firstname"
          rules={{required: 'First Name is required'}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="First Name"
              style={styles.input}
              underlineColor="transparent"
              outlineColor="transparent"
              textColor="black"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={'gray'}
            />
          )}
        />
        {errors.firstname && (
          <Text style={styles.error}>{errors.firstname.message}</Text>
        )}

        {/* Last Name */}
        <Controller
          control={control}
          name="lastname"
          rules={{required: 'Last Name is required'}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              underlineColor="transparent"
              outlineColor="transparent"
              textColor="black"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={'gray'}
            />
          )}
        />
        {errors.lastname && (
          <Text style={styles.error}>{errors.lastname.message}</Text>
        )}

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Enter a valid email',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Email"
              style={styles.input}
              underlineColor="transparent"
              outlineColor="transparent"
              textColor="black"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="email-address"
              placeholderTextColor={'gray'}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        {/* Phone */}
        <Controller
          control={control}
          name="telephone"
          rules={{
            required: 'Phone number is required',
            minLength: {value: 10, message: 'Enter a valid phone number'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              underlineColor="transparent"
              outlineColor="transparent"
              textColor="black"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="phone-pad"
              placeholderTextColor={'gray'}
            />
          )}
        />
        {errors.telephone && (
          <Text style={styles.error}>{errors.telephone.message}</Text>
        )}

        {/* Address */}
        <Controller
          control={control}
          name="street"
          rules={{required: 'Address is required'}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Street"
              style={styles.input}
              underlineColor="transparent"
              outlineColor="transparent"
              textColor="black"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={'gray'}
            />
          )}
        />
        {errors.street && (
          <Text style={styles.error}>{errors.street.message}</Text>
        )}

        {/* City */}
        <Controller
          control={control}
          name="city"
          rules={{required: 'City is required'}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="City"
              style={styles.input}
              underlineColor="transparent"
              outlineColor="transparent"
              textColor="black"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={'gray'}
            />
          )}
        />
        {errors.city && <Text style={styles.error}>{errors.city.message}</Text>}

        {/* State Picker */}
        <Controller
          control={control}
          name="region"
          rules={{required: 'State is required'}}
          render={({field: {onChange, value}}) => (
            <View style={styles.pickerWrapper}>
              <Picker
                placeholder="Select State"
                dropdownIconColor={'gray'}
                selectedValue={value}
                style={styles.picker}
                onValueChange={onChange}>
                <Picker.Item label="Select State" value="" />
                {state.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.region && (
          <Text style={styles.error}>{errors.region.message}</Text>
        )}

        {/* Postcode */}
        <Controller
          control={control}
          name="postcode"
          rules={{
            required: 'Postcode is required',
            pattern: {value: /^[0-9]{5,6}$/, message: 'Enter a valid postcode'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Zip/Postal Code"
              style={styles.input}
              underlineColor="transparent"
              outlineColor="transparent"
              textColor="black"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholderTextColor={'gray'}
            />
          )}
        />
        {errors.postcode && (
          <Text style={styles.error}>{errors.postcode.message}</Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignSelf: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    marginBottom: 10,
    paddingBottom: 0,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    borderWidth: 0.4,
    borderRadius: 10,
    borderTopStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  pickerContainer: {
    width: responsiveWidth(90),

    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 15,
  },

  error: {
    // width: 30,
    color: 'red',
    fontSize: 10,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    width: responsiveWidth(85),
    height: responsiveHeight(6.5),
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
    marginVertical: 20,
  },
  buttonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.9),
    color: 'white',
  },
  pickerWrapper: {
    width: responsiveWidth(90),

    borderWidth: 0.4,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden', // Ensures the picker stays within rounded corners
    paddingHorizontal: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  picker: {},
});

export default ShippingAddress;
