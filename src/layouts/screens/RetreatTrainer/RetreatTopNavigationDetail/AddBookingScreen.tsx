/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {FC} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {postMethod} from '../../../../utils/helper';
import {CommonActions} from '@react-navigation/native';
import {Controller, useForm, useWatch} from 'react-hook-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector} from 'react-redux';
import {Dropdown} from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';
import colors from '../../../style/colors';
import Feather from 'react-native-vector-icons/Feather';
import RetreatTopNavigator from '../../../navigation/TabNavigation/RetreatTopNavigator';
import { MultiSelect } from 'react-native-element-dropdown';

interface Props {}

const AddBookingScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const {lead_id} = route.params;

  const [loading, setLoading] = useState(false);
  const [isFeeDatePickerVisible, setFeeDatePickerVisible] = useState(false);
  const [isBookingDatePickerVisible, setBookingDatePickerVisible] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [paymentType, setPaymentType] = useState('');
  const multiSelectRef = useRef(null);
  const [click, setClick] = useState(false);

  const roomTypeData = [
    {label: 'Double Room (Private)', value: 'Double Room (Private)'},
    {label: 'Double Room (Sharing)', value: 'Double Room (Sharing)'},
    {label: 'Triple Room (Private)', value: 'Triple Room (Private)'},
    {label: 'Triple Room (Sharing)', value: 'Triple Room (Sharing)'},
  ];

  const groupSizeData = [
    {label: '1-5', value: '1-5'},
    {label: '6-10', value: '6-10'},
    {label: '11-20', value: '11-20'},
    {label: '21-30', value: '21-30'},
  ];

  const paymentTypeData = [
    {label: 'Paid', value: 'Paid'},
    {label: 'Unpaid', value: 'Unpaid'},
  ];

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      room_type:"",
      group_size: '',
      booking_fee: '',
      payment_type: '',
      booking_date: '',
      fee_date: '',
    },
  });

  const handleFeeDateConfirm = date => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setValue('fee_date', formattedDate);
    setFeeDatePickerVisible(false);
  };

  const handleBookingDateConfirm = date => {
    const formattedDate = formatDate(date);
    setBookingDate(formattedDate);
    setValue('booking_date', formattedDate);
    setBookingDatePickerVisible(false);
  };

  const formatDate = date => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const onSubmit = async data => {
    Keyboard.dismiss();
    await updatestatusFun(data);
    setClick(true);
  };

  const updatestatusFun = async data => {
    setLoading(true);
    try {
      const row = {
        lead_id: lead_id,
        room_type: data.room_type.join(''),
        group_size: data.group_size,
        booking_fee: data.booking_fee,
        booking_date: data.booking_date,
        fee_date: data.fee_date || null,
        payment_type: data.payment_type,
      };

      const response = await postMethod('add-retreat-booking', row);
      console.log(row, 'row', response);

      if (response.status === 200) {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'RetreatTopNavigator',
                params: {
                  retreatid: null,
                },
              },
            ],
          }),
        );
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isFocus, setIsFocus] = useState(false);
  const [selected, setSelected] = useState([]);

  return (
    <View style={styles.container}>
      <Icon
        name="arrow-back"
        size={25}
        type="material"
        onPress={() => navigation.goBack()}
      />
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container1}>
        <KeyboardAvoidingView  enabled>
          <View style={{marginTop: 10}}>
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
                data={roomTypeData}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={{
                  color: 'black',
                }}
                placeholder={!isFocus ? 'Room Type' : 'Room Type'}
                value={selected} // Bind value to react-hook-form's field value
                onChange={(item) => {
                  setSelected(item);
                  onChange(item); // Update react-hook-form state
                }}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                />
              )}
              name="room_type"
            />
            {errors.room_type && (
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

          {/* Group Size Dropdown */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <Dropdown
                style={[styles.dropdown, isFocus]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={groupSizeData}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Group Size' : 'Group Size'}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  onChange(item.value);
                  setIsFocus(false);
                }}
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
              <Text style={styles.error}>This Field is required.</Text>
            </View>
          )}
          {/* Booking Fee Input */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <TextInput
                placeholder="Booking Fee"
                style={styles.textInput}
                placeholderTextColor={'black'}
                textColor="black"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                // activeOutlineColor='white'
                underlineColor="white"
              />
            )}
            name="booking_fee"
          />
          {errors.booking_fee && (
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
          {/* Payment Type Dropdown */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <Dropdown
                style={[styles.dropdown, isFocus]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={paymentTypeData}
                labelField="label"
                valueField="value"
                underlineColor="white"
                placeholder={!isFocus ? 'Payment Type' : 'Payment Type'}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setPaymentType(item.value); // Update payment type
                  setValue('payment_type', item.value);
                  if (item.value !== 'Paid') {
                    setSelectedDate('');
                    setValue('fee_date', null); // Clear fee_date if payment type is not Paid
                  }
                  setIsFocus(false);
                }}
              />
            )}
            name="payment_type"
          />
          {errors.payment_type && (
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
          {/* Booking Date Input */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange}}) => (
              <TextInput
                placeholder="Booking Date"
                placeholderTextColor={'black'}
                textColor="black"
                underlineColor="white"
                style={styles.textInput}
                value={bookingDate}
                onChangeText={onChange}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="calendar"
                    onPress={() => setBookingDatePickerVisible(true)}
                  />
                }
              />
            )}
            name="booking_date"
          />
          {errors.booking_date && (
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
          {paymentType === 'Paid' && (
            <Controller
              control={control}
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <TextInput
                  placeholder="Fee Date"
                  textColor="black"
                  underlineColor="white"
                  style={styles.textInput}
                  placeholderTextColor={'black'}
                  value={selectedDate}
                  onChangeText={onChange}
                  editable={false}
                  right={
                    <TextInput.Icon
                      icon="calendar"
                      onPress={() => setFeeDatePickerVisible(true)}
                    />
                  }
                />
              )}
              name="fee_date"
            />
          )}
          {paymentType === 'Paid' && errors.fee_date && (
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
          <Pressable style={styles.btn} onPress={handleSubmit(onSubmit)}>
            {loading ? (
              <ActivityIndicator size={20} color="black" />
            ) : (
              <Text style={styles.btnText}>Submit</Text>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Fee Date Picker */}
      <DateTimePickerModal
        isVisible={isFeeDatePickerVisible}
        mode="date"
        onConfirm={handleFeeDateConfirm}
        onCancel={() => setFeeDatePickerVisible(false)}
        minimumDate={new Date()}
      />

      {/* Booking Date Picker */}
      <DateTimePickerModal
        isVisible={isBookingDatePickerVisible}
        mode="date"
        onConfirm={handleBookingDateConfirm}
        onCancel={() => setBookingDatePickerVisible(false)}
        minimumDate={new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  container1: {
    width: responsiveWidth(90),
    height:responsiveHeight(10),

    alignSelf: 'center',
  },
  title: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Black',
    fontSize: responsiveFontSize(2.5),
    color: colors.black,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  textInput: {
    width: responsiveWidth(89),
    height: responsiveHeight(7.9),
   paddingBottom:0,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    color: 'black',
    elevation: 2,
    marginBottom: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  error: {
    width: 330,
    color: 'red',
    fontSize: 10,
    marginTop: -5,
    // marginLeft:10
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
    borderBottomStartRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopEndRadius: 8,
  },
  btnText: {
    color: 'black',
    fontSize: 18,
  },
  dropdown: {
    width: responsiveWidth(89),
    height: responsiveHeight(7.9),
   paddingBottom:0,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    elevation: 2,
    borderBottomStartRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopEndRadius: 8,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
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
  TextInput1: {
    width: responsiveWidth(89),
    height: responsiveHeight(7.9),
    padding: 10,
   paddingBottom:0,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    elevation: 2,
    borderBottomStartRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopEndRadius: 8,
    marginBottom: 0,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent:'center',
    alignItems:"center",
    textAlign:'center',
    borderWidth:0
  },
});

export default AddBookingScreen;
