/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, Icon} from 'react-native-elements';
import {
  FormPostMethod,
  getStorageData,
  postMethod,
} from '../../../utils/helper';
import {Controller, useForm} from 'react-hook-form';
import {TextInput} from 'react-native-paper';
import {Pressable} from 'react-native';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import ArrowIcon from '../../Component/ArrowIcon';
import DocumentPicker from 'react-native-document-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useDispatch} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
interface Props {
  navigation: any;
  route: any;
}
export const AddJobScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(false);

  const [franchise, setFranchise] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusLocation, setIsFocusLocation] = useState(false);
  const [isFocusJobType, setIsFocusJobType] = useState(false);
  const apiKey = 'AIzaSyB5D8cCcugZPm2WiQh106c-K1-2dmSEiv0';
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [loading]),
  );

  const data = [
    {label: 'Full-Time', value: 'Full-Time'},
    {label: 'Part-Time', value: 'Part-Time'},
  ];
  const dataPay = [
    {label: '0-₹10000', value: '0-₹10000'},
    {label: '₹10000-₹20000', value: '₹10000-₹20000'},
    {label: '₹20000-₹30000', value: '₹20000-₹30000'},
    {label: '₹30000-₹40000', value: '₹30000-₹40000'},
    {label: '₹40000-₹50000', value: '₹40000-₹50000'},
  ];
  const locationTypeOptions = [
    {label: 'Hybrid', value: 'Hybrid'},
    {label: 'Remote', value: 'Remote'},
    {label: 'On Site', value: 'On Site'},
  ];
  useMemo(async () => {
    const storage = await getStorageData();
    console.log(storage.response.user, 'ste');
    setUserData(storage.response.user);
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      job_description: '',
      job_title: '',
      location_type: '',
      job_type: '',
      location: '',
      pay_range: '',
    },
  });
  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    fetchFrachise(data);
  };

  const fetchFrachise = async data => {
    const storage = await getStorageData();
    setLoading(true);
    try {
      const row = {
        user_id: storage.response.user.id,
        status: 1,
        job_title: data.job_title,
        job_description: data.job_description,
        location_type: data.location_type,
        location: data.location,
        job_type: data.job_type,
        pay_range: data.pay_range,
      };
      const response: any = await postMethod('add-job', row);
      if (response.status === 200) {
        console.log(response.data, 'res0');
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        navigation.navigate('TrainerJobScreen');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
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
    <>
      <ArrowIcon navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>Create Job</Text>

        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            <KeyboardAvoidingView enabled>
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Job Title"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="job_title"
              />
              {errors.job_title && (
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
              <Controller
                control={control}
                name="location_type"
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocusLocation && {borderColor: 'blue'},
                    ]}
                    // searchPlaceholder=''
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={locationTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Location Type"
                    value={value}
                    onFocus={() => setIsFocusLocation(true)}
                    onBlur={() => setIsFocusLocation(false)}
                    onChange={item => {
                      onChange(item.value);
                      setIsFocusLocation(false);
                    }}
                  />
                )}
              />
              {errors.location_type && (
                <Text style={styles.error}>This field is required.</Text>
              )}

              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    style={[styles.dropdown, isFocus]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.textInput}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    itemTextStyle={{
                      color: 'black',
                    }}
                    placeholder={!isFocus ? 'Job Type' : 'Job Type'}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      onChange(item.value);
                      setIsFocus(false);
                    }}
                  />
                )}
                name="job_type"
              />
              {errors.job_type && (
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
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    style={[styles.dropdown, isFocus]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.textInput}
                    iconStyle={styles.iconStyle}
                    data={dataPay}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    itemTextStyle={{
                      color: 'black',
                    }}
                    placeholder={!isFocus ? 'Pay Range' : 'Pay Range'}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      onChange(item.value);
                      setIsFocus(false);
                    }}
                  />
                )}
                name="pay_range"
              />
              {errors.pay_range && (
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

              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Enter Job Descrpation"
                    style={styles.textInput0}
                    multiline
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="job_description"
              />
              {errors.job_description && (
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
              <View style={styles.locationText}>
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <GooglePlacesAutocomplete
                      placeholder="Enter Location"
                      
                      onPress={(data, details = null) => {
                        onChange(data.description);
                        getLocation();
                      }}
                      currentLocationLabel={'Select Studio Location'}
                      // textInputProps={}
                      textInputProps={{
                        placeholderTextColor: 'black',
                        returnKeyType: 'search',
                        // autoFocus: true,
                        // blurOnSubmit: false,
                      }}
                      query={{
                        key: apiKey,
                        language: 'en',
                      }}
                      styles={{
                        textInput: {
                          ...styles.textInput1,

                        },
                        listView: {
                          width: responsiveWidth(90),
                          alignSelf: 'center',
                          backgroundColor: colors.white,
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
                  name="location"
                />
                {errors.location && (
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
            </KeyboardAvoidingView>
          </View>
          <Pressable style={styles.btn} onPress={handleSubmit(onSubmit)}>
            {loading ? (
              <ActivityIndicator size={20} color="black" />
            ) : (
              <Text style={styles.btnText}>Submit</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    // alignItems: 'flex-start',
  },
  title: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Black',
    fontSize: responsiveFontSize(2.5),
    color: colors.black,
    marginTop: 0,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title1: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2.2),
    color: colors.black,
    marginBottom: 10,
    alignSelf: 'center',
  },
  textInput: {
    width: responsiveWidth(90),
    height: responsiveHeight(7.5),

    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    marginBottom: 15,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderRadius: 5,
    borderWidth: 0.1,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Regular',
  },
  locationText: {
    width: responsiveWidth(90),
    // height:responsiveHeight(12),
    alignSelf: 'center',
  },

  textInput1: {
    backgroundColor: colors.white,
    height: responsiveHeight(7.5),
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 15,
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderRadius: 5,
    borderWidth: 0.1,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  textInput0: {
    width: responsiveWidth(90),

    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    // elevation: 2,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderRadius: 5,
    borderWidth: 0.1,

    marginBottom: 15,
    paddingBottom: 50,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },
  dropdown: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 5,
    padding: 8,
    paddingHorizontal: 15,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 0.1,
    marginBottom: 15,
    alignSelf: 'center',
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },
  dropdownButtonText: {
    textAlign: 'left',
    color: 'black',
  },
  dropdownRowText: {
    textAlign: 'left',
    color: 'black',
  },
  placeholderStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 12,
    marginBottom: 10,
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
    width: responsiveWidth(35),
    height: responsiveHeight(6.5),
    backgroundColor: 'white',
    elevation: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  btnText: {
    color: 'black',
    fontSize: 18,
  },
  textrow: {
    marginBottom: 15,
  },
});
