/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/No-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
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
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
const apiKey = 'AIzaSyB5D8cCcugZPm2WiQh106c-K1-2dmSEiv0';

interface Props {}
export const EditRetreatScreen: FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [singleFile, setSingleFile] = useState<any>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const {Retreatdata, retreatid} = route.params;
  const ref = useRef();
  const ref2 = useRef();
  const roomData = [
    {label: 'Double Room(Private)', value: 'Double Room(Private)'},
    {label: 'Double Room(Sharing)', value: 'Double Room(Sharing)'},
    {label: 'Triple Room(Private)', value: 'Triple Room(Private)'},
    {label: 'Triple Room(Sharing)', value: 'Triple Room(Sharing)'},
  ];
  const data = [
    {label: 'Full-Time', value: 'Full-Time'},
    {label: 'Part-Time', value: 'Part-Time'},
  ];

  useMemo(async () => {
    const storage = await getStorageData();
    console.log(Retreatdata.room, 'ste', retreatid);
    setUserData(storage.response.user);
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      retreat_title: '',
      retreat_location: '',
      retreat_overview: '',
      end_date: '',
      start_date: '',
      program_details: '',
      accommodation_hotel: '',
      upload_image: '',
      No_of_days: '',
      No_of_nights: '',
      room: '',
      price: '',
      group_size: '',
    },
  });
  useEffect(() => {
    console.log(Retreatdata, 'res');
    const address = Retreatdata.location;
    const address1 = Retreatdata['Accommodation Hotel'];

    ref.current?.setAddressText(address);
    ref2.current?.setAddressText(address1);

    setValue('retreat_title', Retreatdata.title);
    setValue('retreat_location', Retreatdata.location);
    setValue('retreat_overview', Retreatdata.overview);
    setValue('program_details', Retreatdata['Program Detail']);
    setValue('accommodation_hotel', Retreatdata['Accommodation Hotel']);
    setValue('No_of_days', Retreatdata.no_of_days);
    setValue('No_of_nights', Retreatdata.no_of_nights);
    setValue('room', Retreatdata.room);
    setValue('price', Retreatdata.price);
    setValue('group_size', Retreatdata.group_size);
    setSelectedDate(Retreatdata['start Date']);
    setSelectedDate1(Retreatdata['end Date']);
  }, []);
  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    fetchFrachise(data);
    reset(), setSingleFile(null), setSelectedDate(null);
    setSelectedDate1(null);
  };

  const selectOneFile = async () => {
    console.log('laka');
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setSingleFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Canceled from single doc picker');
      } else {
        Alert.alert('UnkNown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const fetchFrachise = async data => {
    const storage = await getStorageData();
    const login_id = storage.response.user.id;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('retreat_title', data.retreat_title);
      formData.append('retreat_overview', data.retreat_overview);
      formData.append('retreat_location', data.retreat_location);
      formData.append('end_date', selectedDate1);
      formData.append('start_date', selectedDate);
      formData.append('program_details', data.program_details);
      formData.append('status', data.status);
      formData.append('accommodation_hotel', data.accommodation_hotel);
      formData.append('No_of_days', data.No_of_days);
      formData.append('No_of_nights', data.No_of_nights);
      formData.append('room', data.room);
      formData.append('price', data.price);
      formData.append('group_size', data.group_size);
      formData.append('user_id', login_id);
      formData.append('status', 1);

      if (singleFile) {
        formData.append('upload_image', {
          uri: singleFile.uri,
          type: singleFile.type,
          name: singleFile.name,
        });
      }
      console.log(formData,'hh')
      const response: any = await FormPostMethod(
        `user-update-retreat?id=${retreatid}`,
        formData,
      );
      console.log(response);
      if (response.status === 200) {
        console.log(response.data, 'res0');
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        navigation.navigate('RetreatUserScreen');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  // Function to handle date confirmation
  const handleConfirm = date => {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero (months are 0-indexed)
    const year = date.getFullYear(); // Get full year

    const formattedDate = `${day}-${month}-${year}`; // Combine into "DD-MM-YYYY" format

    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const handleConfirm1 = date => {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero (months are 0-indexed)
    const year = date.getFullYear(); // Get full year

    const formattedDate = `${day}-${month}-${year}`; // Combine into "DD-MM-YYYY" format

    setSelectedDate1(formattedDate);
    hideDatePicker1();
  };

  // Show/Hide Date Picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const showDatePicker1 = () => setDatePickerVisibility1(true);
  const hideDatePicker1 = () => setDatePickerVisibility1(false);
  const [selected, setSelected] = useState([]);

  
  return ( 
    <>
      <ArrowIcon navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>Edit Retreat</Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            <KeyboardAvoidingView enabled>
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Retreat Title"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="retreat_title"
              />
              {errors.retreat_title && (
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
                  <MultiSelect
                  style={[styles.dropdown]}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.textInput}
                  selectedStyle={{
                    marginLeft:10,
                    marginBottom:15,
                    borderRadius:15
                  }}
                  iconStyle={styles.iconStyle}
                  data={roomData}
                  search={false}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={{
                    color: 'black',
                  }}
                  placeholder={!isFocus ? 'Select Room' : 'Room'}
                  value={value} // Bind value to react-hook-form's field value
                  onChange={(item) => {
                    setSelected(item);
                    onChange(item); // Update react-hook-form state
                  }}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                />
              )}
                name="room"
              />
              {errors.room && (
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
                      placeholder="Accommodation Hotel"
                      currentLocationLabel={'Accommodation Hotel'}
                      onPress={(data, details = null) => {
                        onChange(data.description); // Update the field value
                      }}
                      ref={ref2}

                      query={{
                        key: apiKey,
                        language: 'en',
                      }}
                      textInputProps={{
                        placeholderTextColor: 'black',
                        returnKeyType: 'search',
                        autoFocus: true,
                        blurOnSubmit: false,
                      }}
                      styles={{
                        textInput: {
                          ...styles.textInput,
                        },

                        listView: {
                          width: responsiveWidth(90),
                          alignSelf: 'center',
                          // marginBottom: 50,
                        },

                        description: {
                          color: colors.black,
                          fontFamily: 'Roboto-Regular',
                          fontSize: responsiveFontSize(2),
                        },
                      }}
                      fetchDetails={true}
                    />
                  )}
                  name="accommodation_hotel"
                />
              </View>

              {errors.accommodation_hotel && (
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
                    placeholder="No Of Days"
                    keyboardType="number-pad"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="No_of_days"
              />
              {errors.No_of_days && (
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
                    placeholder="No Of Night"
                    keyboardType="number-pad"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="No_of_nights"
              />
              {errors.No_of_nights && (
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
                    placeholder="Price"
                    keyboardType="number-pad"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="price"
              />
              {errors.price && (
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
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Start Date"
                    style={styles.textInput}
                    value={selectedDate} // Display the selected start date
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    onChangeText={onChange}
                    editable={false} 
                    placeholderTextColor="black"
                    right={
                      <TextInput.Icon
                        icon="calendar"
                        size={20}
                        color="black"
                        onPress={showDatePicker}
                      />
                    }
                  />
                )}
                name="start_date"
              />

              {/* End Date Input */}
              <Controller
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="End Date"
                    style={styles.textInput}
                    value={selectedDate1} // Display the selected end date
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    onChangeText={onChange}
                    editable={false} 
                    placeholderTextColor="black"
                    right={
                      <TextInput.Icon
                        icon="calendar"
                        size={20}
                        color="black"
                        onPress={showDatePicker1}
                      />
                    }
                  />
                )}
                name="end_date"
              />

              {/* Date Pickers */}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />

              <DateTimePickerModal
                isVisible={isDatePickerVisible1}
                mode="date"
                onConfirm={handleConfirm1}
                onCancel={hideDatePicker1}
              />
              <View style={styles.locationText}>
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <GooglePlacesAutocomplete
                      placeholder="Retreat Location"
                      currentLocationLabel={'Retreat Location'}
                      onPress={(data, details = null) => {
                        onChange(data.description); // Update the field value
                      }}
                      ref={ref}
                      query={{
                        key: apiKey,
                        language: 'en',
                      }}
                      textInputProps={{
                        placeholderTextColor: 'black',
                        returnKeyType: 'search',
                        autoFocus: true,
                        blurOnSubmit: false,
                      }}
                      styles={{
                        textInput: {
                          ...styles.textInput,
                        },

                        listView: {
                          width: responsiveWidth(90),
                          alignSelf: 'center',
                          // marginBottom: 50,
                        },

                        description: {
                          color: colors.black,
                          fontFamily: 'Roboto-Regular',
                          fontSize: responsiveFontSize(2),
                        },
                      }}
                      fetchDetails={true}
                    />
                  )}
                  name="retreat_location"
                />
              </View>

              {errors.retreat_location && (
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
                    placeholder="Group Size"
                    keyboardType="number-pad"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="group_size"
              />
              {errors.group_size && (
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
                    placeholder="Retreat Overview"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="retreat_overview"
              />
              {errors.retreat_overview && (
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
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Program Details       "
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
                name="program_details"
              />

              <Pressable
                onPress={() => selectOneFile()}
                style={[
                  styles.textrow,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: responsiveWidth(90),

                    height: responsiveHeight(7),
                    backgroundColor: colors.white,
                    elevation: 1.5,
                    borderBottomStartRadius: 15,
                    borderTopLeftRadius: 15,
                    borderBottomRightRadius: 15,
                    borderTopEndRadius: 15,
                    opacity: 55.15,
                    paddingHorizontal: 10,
                  },
                ]}>
                <Text style={{color: singleFile ? 'black' : 'black', fontSize: responsiveFontSize(2),}}>
                  {singleFile
                    ? singleFile.name
                    : data.upload_image
                    ? data.upload_image
                    : Retreatdata.image}
                </Text>
              </Pressable>
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
    height: responsiveHeight(7),
    paddingHorizontal: 10,
    backgroundColor: 'white',
    color: 'black',
    fontSize: responsiveFontSize(2),
    // fontFamily:'Roboto-Bold',
    opacity: 188,
    borderWidth: 0.1,
    borderColor: 'black',
    marginBottom: 15,
    // borderRadius: 10,
    borderBottomStartRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopEndRadius: 5,
    borderTopRightRadius: 5,
    paddingBottom: 0,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  locationText: {
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  textInput0: {
    width: responsiveWidth(90),
    paddingHorizontal: 10,
    color: 'black',
    fontSize: responsiveFontSize(2),
    backgroundColor: 'white',
    opacity: 188,
    elevation: 2,
    marginBottom: 15,
    borderRadius: 10,
    paddingBottom: 50,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  dropdown: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    marginBottom: 0,
    alignSelf: 'center',
    color: 'black',
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
    fontSize: 16,
    color: 'black',
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
    fontSize: responsiveFontSize(2),
  },
});
