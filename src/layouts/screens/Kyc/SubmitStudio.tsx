/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Image,
  Keyboard,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {getStorageData, postMethod, storeData} from '../../../utils/helper';
import Snackbar from 'react-native-snackbar';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../style/colors';
import AccountScreen from '../Account/AccountScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {MouseButton} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {setKyc} from '../../../Redux/ListSlice ';

interface Props {}
const SubmitStudio: FC<Props> = ({navigation}: any): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(false);
  const [opt, setOpt] = useState(null);
  const [resultUp, setResultUp] = useState();

  const apiKey = 'AIzaSyB5D8cCcugZPm2WiQh106c-K1-2dmSEiv0';
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [loading, setKyc]),
  );

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    // reset,
    getValues,
    // setValue,
  } = useForm({
    defaultValues: {
      studio_name: '',
      address: '',
    },
  });

  const onSubmit = (data: {studio_name: string; address: string}) => {
    Keyboard.dismiss();
    StudioFunction(data);
  };

  const StudioFunction = async (data: {studio_name: any; address: any}) => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    const obj = storage.response;
    console.log(obj.kyc, 'fdfd');
    setLoading(true);

    try {
      const row = {
        studio_name: data.studio_name,
        address: data.address,
      };
      const response: any = await postMethod(`studio-kyc?user_id=${id}`, row);
      if (response.data.success === true) {
        console.log(response.data.kyc, 'respo');
        if (response.data.kyc === 1) {
          setOpt(response.data.kyc);
          await AsyncStorage.setItem('kyc', JSON.stringify(response.data.kyc));
          // await AsyncStorage.removeItem('user_data');
          obj.kyc = response.data.kyc;
          dispatch(setKyc(response.data.kyc));
         console.warn(response.data,'kycCreate')
        //  await storeData(response.data);

        }

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
        navigation.navigate('AccountScreen');
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
    }
  };

  // Function to get permission for location
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };

  return (
    <View style={styles.container}>
      <Icon
        name="arrow-back"
        type="MaterialIcons"
        color={'black'}
        size={30}
        onPress={() => navigation.goBack()}
      />

      <Text style={styles.text}>Verify Your Studio Idenity</Text>

      <View style={{alignSelf: 'center'}}>
        <Text style={styles.name}>Studio Name</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              placeholder="Enter Studio Name"
              placeholderTextColor={colors.text_secondary}
              underlineColor={colors.white}
              textColor="black"
              value={value}
              onChangeText={value => onChange(value)}
              style={[styles.textInput, {marginBottom: 0}]}
            />
          )}
          name="studio_name"
        />
        {errors.studio_name && errors.studio_name.type === 'required' && (
          <View style={styles.row}>
            <Feather
              name="alert-circle"
              size={9}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.error}>This Field is required.</Text>
          </View>
        )}
        <View>
          <Text style={styles.name}>Studio Location</Text>
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <GooglePlacesAutocomplete
                placeholder="Select Studio Location"
                onPress={(data, details = null) => {
                  onChange(data.description);
                  getLocation();
                }}
                textInputProps={{
                  placeholderTextColor: 'gray',
                  returnKeyType: 'search',
                  // autoFocus: true,
                  // blurOnSubmit: false,
                }}
                query={{
                  key: apiKey,
                  language: 'en',
                }}
                styles={{
                  textInput: styles.textInput1,
                  listView: {
                    width: responsiveWidth(89),
                    // zIndex: 999,
                    // position: 'absolute',
                    alignSelf: 'center',
                    backgroundColor: colors.white,
                    marginBottom: 50,
                  },
                  row: {
                    backgroundColor: colors.white,
                  },
                  description: {
                    color: colors.black,
                    fontFamily: 'Roboto-Regular',
                    fontSize: responsiveFontSize(1.5),
                  },
                }}
                fetchDetails={true}
              />
            )}
            name="address"
          />
          {errors.address && (
            <View style={styles.row}>
              <Feather
                name="alert-circle"
                size={9}
                color="red"
                style={styles.icon}
              />
              <Text style={styles.error}>This field is required.</Text>
            </View>
          )}
        </View>
      </View>
      <Pressable style={styles.btn} onPress={handleSubmit(onSubmit)}>
        {loading ? (
          <ActivityIndicator size={20} color="white" />
        ) : (
          <Text style={styles.text1}>Next</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    padding: 10,
  },

  text: {
    fontFamily: 'Roboto-Black',
    fontSize: responsiveFontSize(2.8),
    color: 'black',
    marginLeft: 5,
    marginTop: 20,
    marginBottom: 35,
  },
  text1: {
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.8),
    color: 'white',
  },

  name: {
    width: responsiveWidth(89),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
    color: 'black',
    // marginLeft: 5,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  textInput: {
    width: responsiveWidth(89),
    height: responsiveHeight(6.7),
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 0,
    color: colors.black,
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  textInput1: {
    width: responsiveWidth(89),
    height: responsiveHeight(6.7),
    paddingHorizontal: 15,

    backgroundColor: colors.white,
    elevation: 1.5,
    borderRadius: 15,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 0,
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),

    borderWidth: 0,
    overflow: 'hidden',
    alignSelf: 'center',
  },

  row: {
    width: responsiveWidth(89),
    flexDirection: 'row',
    marginLeft: 12,
    marginTop: 10,
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
    width: responsiveWidth(87),
    height: responsiveHeight(6),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 3.5,
    opacity: 328,
    borderRadius: 10,
    // marginTop:-325,
    // marginBottom:30,
    marginVertical: -305,
    color: 'black',
    zIndex: -155,
  },
});

export default SubmitStudio;
