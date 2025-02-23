/* eslint-disable quotes */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
  Keyboard,
  PermissionsAndroid,
} from 'react-native';
import {Avatar} from '@rneui/themed';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import {Icon} from 'react-native-elements';
import colors from '../../../style/colors';
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setStatus} from '../../../../Redux/ListSlice ';
import {Controller, useForm} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import {TextInput} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {MouseButton, ScrollView} from 'react-native-gesture-handler';
import RejoinScreen from './RejoinScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import MenuPop from './RejoinScreen';

interface Props {}
const RetreatMarkFees: FC<Props> = ({navigation}): JSX.Element => {
  navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const statusNo = useSelector(state => state.List.status);
  const [isFocus, setIsFocus] = useState(false);
  const trainerId = useSelector(state => state.List.id);
  const {Booking_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [booking, setBooking] = useState<[]>([]);
  const [bookingRetreat, setBookingRetreat] = useState([]);
  const [message, setMessage] = useState(null);
  const [message1, setMessage1] = useState(null);

  useFocusEffect(
    useCallback(async () => {
      await BookingLisfun();
      await BookingHistory();
      console.warn(history, 'history',Booking_id);
    }, []),
  );

  const BookingLisfun = async () => {
    setLoading(true);
    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, 'storage');
      const response: any = await postMethod(
        `user-retreat-booking-detail?id=${Booking_id}`,
      );
      if (response.status === 200) {
        setBooking(response.data.data[0]);
        setBookingRetreat(response.data.retreat_details[0]);
        setMessage(response.data.message);
        console.log(response.data, 'va');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const BookingHistory = async () => {
    setLoading(true);
    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, 'storage');
      const response: any = await postMethod(
        `retreat-booking-history?booking_id=${Booking_id}`,
      );
      console.log(response.data, 'vav');
      if (response.status === 200) {
        setHistory(response.data.data);
        setMessage1(response.data.message);

        console.log(response.data, 'vaf');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      paid_amount: '',
      paid_date: '',
      due_amount: '',
      due_date: '',
    },
  });

  const handleConfirm = date => {
    setDatePickerVisible(false);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setValue('paid_date', formattedDate);
    setValue('due_date', formattedDate);
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    if (booking['payment status'] === 'Paid') {
      await dueStatus(data);
    } else {
      await updateStatus(data);
    }
  };

  const updateStatus = async (data: {paid_amount: any; paid_date: any}) => {
    setLoading(true);
    const row = {
      booking_id: Booking_id,
      paid_amount: data.paid_amount,
      paid_date: data.paid_date,
    };
    console.log(row, 'fff');
    try {
      const response: any = await postMethod(
        'retreat-booking-mark-fees-paid',
        row,
      );
      if (response.data.success === true) {
        console.log(response.data, 'yy');
        setConfirmVisible(false);
        reset();
        setSelectedDate(null);
      }
    } catch (error) {
      console.error('Failed to update Booking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const dueStatus = async (data: {due_amount: any; due_date: any}) => {
    setLoading(true);
    const row = {
      booking_id: Booking_id, // using the correct subscription ID
      due_amount: data.due_amount,
      due_date: data.due_date,
    };
    try {
      const response: any = await postMethod(
        'retreat-booking-mark-fees-due',
        row,
      );
      if (response.data.success === true) {
        console.log(response.data, 'yyjj');
        setConfirmVisible(false);
        reset();
        setSelectedDate(null);
      }
    } catch (error) {
      console.error('Failed to update subscription status to due:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempStatus(null);
    setConfirmVisible(false);
  };

  if (loading) {
    <ActivityIndicator size={20} color={'black'} />;
  }

  return (
    <View style={styles.container}>
      <MenuProvider>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : (
          <>
            <View style={styles.row0}>
              <Icon
                name="arrow-back"
                type="material"
                color="black"
                size={25}
                onPress={() => navigation.goBack()}
              />

              <View style={{flexDirection: 'row', gap: 20}}>
                {booking['payment status'] === 'End' ? null : (
                  <MenuPop
                    navigation={navigation}
                    item={history}
                    id={Booking_id}
                    message1={message1}
                    bookingDetail={booking}
                  />
                )}
              </View>
            </View>
            <>
              <ScrollView>
                {booking ? (
                  <View style={styles.row}>
                    <View style={styles.row1}>
                      <Avatar
                        size={40}
                        // avatarStyle={{backgroundColor: '#D3D3D3'}}
                        rounded
                        source={{uri:booking.image}}
                      />
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 20,
                          }}>
                          <View>
                            <Text style={styles.name}>{booking.name}</Text>
                            <Text style={styles.course}>
                              {booking['retreat name']}
                            </Text>
                          </View>
                          <View>
                            <View style={styles.row1}>
                              <Icon
                                name="update"
                                type="material"
                                size={20}
                                color="black"
                                style={{width: 25, marginLeft: 5}}
                              />
                              <Text style={styles.date}>
                                {booking['payment status']}
                              </Text>
                            </View>
                            <View style={styles.rowText}>
                              <Icon
                                name="event"
                                type="material"
                                size={20}
                                color="black"
                                style={{width: 40, marginLeft: -10}}
                              />
                              <Text style={styles.newDate}>
                                {booking.payment_date}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    {booking['payment status'] === 'Ended' ? null : booking[
                        'payment status'
                      ] === 'Paid' ? (
                      <Pressable
                        style={[styles.btn1, {backgroundColor: 'red'}]}
                        onPress={() => setConfirmVisible(true)}>
                        <Text style={[styles.btnText1]}>Mark Fees as Due</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.btn1}
                        onPress={() => setConfirmVisible(true)}>
                        <Text style={styles.btnText1}>Mark Fees as paid</Text>
                      </Pressable>
                    )}

                    <View>
                      <Text style={styles.name}>Room Type</Text>

                      <View style={styles.textInput0}>
                        <Text style={styles.course}>
                          {bookingRetreat.room_type}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.name}>Group Size</Text>

                      <View style={styles.textInput0}>
                        <Text style={styles.course}>
                          {bookingRetreat.group_size}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.name}>Booking Date</Text>

                      <View style={styles.textInput0}>
                        <Text style={styles.course}>
                          {bookingRetreat['Booking Date']}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text style={styles.name}>Last Payment Date</Text>

                      <View style={styles.textInput0}>
                        <Text style={styles.course}>
                          {booking.payment_date}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.name}>Last Paid Amount</Text>
                      <View style={styles.textInput0}>
                        <Text style={styles.course}>
                          {booking['last payment']}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>{message}</Text>
                  </View>
                )}
              </ScrollView>
            </>
          </>
        )}
      </MenuProvider>

      {booking['payment status'] === 'Paid' ? (
        <Modal
          transparent={true}
          visible={confirmVisible}
          animationType="slide"
          onRequestClose={handleCancel}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.rowIcon}>
                <Text style={styles.menuText1}>Mark Fees as Due</Text>
                <Pressable onPress={handleCancel}>
                  <Icon
                    type="material"
                    name="close"
                    size={20}
                    color={'black'}
                  />
                </Pressable>
              </View>

              <View>
                <View style={{alignSelf: 'center'}}>
                  <Text style={styles.name}>Due Amount</Text>
                  <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder={''}
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
                    name="due_amount"
                  />
                  {errors.due_amount && (
                    <View
                      style={[
                        styles.rowText,
                        {width: responsiveWidth(80), alignSelf: 'center'},
                      ]}>
                      <Feather
                        name="alert-circle"
                        size={9}
                        color="red"
                        style={styles.icon}
                      />
                      <Text style={styles.error}>This field is required.</Text>
                    </View>
                  )}

                  <Text style={styles.name}>Due Date</Text>

                  <View>
                    <Controller
                      control={control}
                      rules={{required: true}}
                      render={({field: {onChange}}) => (
                        <TextInput
                          placeholder={''}
                          style={styles.textInput}
                          textColor="black"
                          underlineColor="white"
                          outlineColor="white"
                          value={selectedDate}
                          onChangeText={onChange}
                          placeholderTextColor={'black'}
                          right={
                            <TextInput.Icon
                              icon="calendar"
                              size={20}
                              onPress={() => setDatePickerVisible(true)}
                            />
                          }
                        />
                      )}
                      name="due_date"
                    />
                    {errors.due_date && (
                      <View
                        style={[
                          styles.rowText,
                          {width: responsiveWidth(80), alignSelf: 'center'},
                        ]}>
                        <Feather
                          name="alert-circle"
                          size={9}
                          color="red"
                          style={styles.icon}
                        />
                        <Text style={styles.error}>
                          This field is required.
                        </Text>
                      </View>
                    )}

                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={() => setDatePickerVisible(false)}
                    />
                  </View>

                  <Pressable
                    style={styles.btnItem}
                    onPress={handleSubmit(onSubmit)}>
                    {loading ? (
                      <ActivityIndicator size={20} color="black" />
                    ) : (
                      <Text style={styles.btnText}>Submit</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        <Modal
          transparent={true}
          visible={confirmVisible}
          animationType="slide"
          onRequestClose={handleCancel}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.rowIcon}>
                <Text style={styles.menuText1}>Mark Fees as Paid</Text>
                <Pressable onPress={handleCancel}>
                  <Icon
                    type="material"
                    name="close"
                    size={20}
                    color={'black'}
                  />
                </Pressable>
              </View>

              <View>
                <View style={{alignSelf: 'center'}}>
                  <Text
                    style={[
                      styles.name,
                      {width: responsiveWidth(80), alignSelf: 'center'},
                    ]}>
                    Paid Amount
                  </Text>
                  <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder={''}
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
                    name="paid_amount"
                  />
                  {errors.paid_amount && (
                    <View
                      style={[
                        styles.rowText,
                        {width: responsiveWidth(80), alignSelf: 'center'},
                      ]}>
                      <Feather
                        name="alert-circle"
                        size={9}
                        color="red"
                        style={styles.icon}
                      />
                      <Text style={styles.error}>This field is required.</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.name,
                      {width: responsiveWidth(80), alignSelf: 'center'},
                    ]}>
                    Paid Date
                  </Text>

                  <View>
                    <Controller
                      control={control}
                      rules={{required: true}}
                      render={({field: {onChange}}) => (
                        <TextInput
                          placeholder={''}
                          style={styles.textInput}
                          textColor="black"
                          underlineColor="white"
                          outlineColor="white"
                          value={selectedDate}
                          onChangeText={onChange}
                          placeholderTextColor={'black'}
                          right={
                            <TextInput.Icon
                              icon="calendar"
                              size={20}
                              onPress={() => setDatePickerVisible(true)}
                            />
                          }
                        />
                      )}
                      name="paid_date"
                    />
                    {errors.paid_date && (
                      <View
                        style={[
                          styles.rowText,
                          {width: responsiveWidth(80), alignSelf: 'center'},
                        ]}>
                        <Feather
                          name="alert-circle"
                          size={9}
                          color="red"
                          style={styles.icon}
                        />
                        <Text style={styles.error}>
                          This field is required.
                        </Text>
                      </View>
                    )}

                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={() => setDatePickerVisible(false)}
                    />
                  </View>

                  <Pressable
                    style={styles.btnItem}
                    onPress={handleSubmit(onSubmit)}>
                    {loading ? (
                      <ActivityIndicator size={20} color="black" />
                    ) : (
                      <Text style={styles.btnText}>Submit</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const MenuPop = ({navigation, item, id, message1, bookingDetail}) => {
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [update, setUpdate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState('');
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      end_date: '',
    },
  });

  const data = [
    {label: 'Paid', value: 'Paid'},
    {label: 'Unpaid', value: 'Unpaid'},
  ];

  useFocusEffect(
    useCallback(async () => {
      await getUpdateStatus();
      requestMediaPermissions();
    }, []),
  );

  // Request Android storage permissions
  const requestMediaPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download the file',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const downloadResume = async () => {
    try {
      const hasPermissions = await requestMediaPermissions();
      if (!hasPermissions) {
        Alert.alert(
          'Permission Denied',
          'Storage access is required to download files.',
        );
        return;
      }
      const date = new Date();
      const {config, fs} = RNFetchBlob;
      const filedir = fs.dirs.DownloadDir; // Android download directory
      const fileName = `resume_${Date.now()}.pdf`;

      console.log('Download URL:', pastedUrl);
      console.log('Saving to:', `${filedir}/${fileName}`);

      const res = await config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path:
            filedir +
            '/download_' +
            Math.floor(date.getDate() + date.getSeconds() / 2),
          description: 'File Download',
        },
      }).fetch('GET', pastedUrl);

      console.log('The file saved to:', res.path());
      Alert.alert('Download Successful', `File saved to: ${res.path()}`);
    } catch (error) {
      console.error('Download Error:', error);
      Alert.alert(
        'Download Failed',
        'An error occurred while downloading the file.',
      );
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModalSec1 = () => {
    setModalVisible2(!isModalVisible2);
  };

  const onSubmit = async data => {
    Keyboard.dismiss();
    await updateStatus(data);
  };

  const updateStatus = async data => {
    setLoading(true);

    const row = {
      booking_id: id,
      end_date: data.end_date,
    };

    console.log(row);

    try {
      const response = await postMethod('retreat-booking-end', row);
      if (response.data.success === true) {
        console.log(response.data, 'jk');
        reset();
        setModalVisible2(!isModalVisible2);
        await AsyncStorage.setItem(
          'updateStatus',
          JSON.stringify(response.data.status),
        );
      }
    } catch (error) {
      console.error('Failed to update subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpdateStatus = async () => {
    const endedSubscriptions = await AsyncStorage.getItem('updateStatus');
    setUpdate(endedSubscriptions);
    console.log(update, 'f');
  };

  const formatDate = date => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const handleConfirm1 = date => {
    setDatePickerVisible1(false);
    const formattedDate = formatDate(date);
    setSelectedDate1(formattedDate);
    setValue('end_date', formattedDate);
  };

  return (
    <Menu>
      <MenuTrigger>
        <Icon name="more-vert" type="material" color="black" size={25} />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionWrapper: {
            paddingHorizontal: 15, // Adjust horizontal padding
            paddingVertical: 7,
            marginVertical: -5,
          },
          optionsContainer: {
            marginVertical: 25,
            paddingVertical: 10,

            backgroundColor: '#fff', // Set background color
            borderRadius: 15, // Rounded corners
            elevation: 5, // Add shadow for Android
            shadowColor: '#000', // Shadow color for iOS
            shadowOpacity: 0.2, // Shadow opacity for iOS
            shadowRadius: 4, // Shadow radius for iOS
            shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS
            justifyContent: 'center',
          },
        }}>
        <MenuOption>
          <Pressable onPress={toggleModal}>
            <Text style={styles.menuText2}>History</Text>
          </Pressable>

          <>
            <Modal
              transparent={true}
              visible={isModalVisible}
              animationType="slide"
              onRequestClose={toggleModal}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <ScrollView>
                    <View style={styles.rowIcon}>
                      <Text style={styles.menuText1}>History</Text>
                      <Pressable
                        style={styles.cancelIcon}
                        onPress={toggleModal}>
                        <Icon
                          type="material"
                          name="close"
                          size={30}
                          color="#000"
                        />
                      </Pressable>
                    </View>
                    {item ? (
                      item.map(item => (
                        <View>
                          <View style={styles.rowIcon} key={item.booking_id}>
                            {item.paid_amount && (
                              <Text style={styles.menuText1}>
                                ₹{item.paid_amount}
                              </Text>
                            )}

                            <View
                              style={{
                                flexDirection: 'row',
                                gap: 15,
                                alignItems: 'center',
                              }}>
                              <Text
                                style={[styles.menuText2, {marginBottom: 0}]}>
                                {item.paid_date}
                              </Text>
                              {/* <Icon
                                name="download"
                                size={30}
                                color="#000"
                                onPress={() => downloadResume()}
                              /> */}
                            </View>
                          </View>
                        </View>
                      ))
                    ) : (
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>{message1}</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </>
        </MenuOption>

        {/* End Subscription */}
        <MenuOption>
          {bookingDetail['payment status'] === 'Ended' ? null : (
            <Pressable onPress={toggleModalSec1}>
              <Text style={styles.menuText2}>Cancel Booking</Text>
            </Pressable>
          )}

          <Modal
            transparent={true}
            visible={isModalVisible2}
            animationType="slide"
            onRequestClose={toggleModalSec1}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Pressable style={styles.cancelIcon} onPress={toggleModalSec1}>
                  <Icon type="material" name="close" size={30} color="#000" />
                </Pressable>
                <View style={styles.rowIcon}>
                  <Text style={styles.menuText1}>Cancel Booking</Text>
                </View>
                <View>
                  <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange}}) => (
                      <TextInput
                        placeholder="Date"
                        style={styles.textInput}
                        textColor="black"
                        underlineColor="white"
                        outlineColor="white"
                        value={selectedDate1}
                        onChangeText={onChange}
                        placeholderTextColor={'black'}
                        editable={false}
                        right={
                          <TextInput.Icon
                            icon="calendar"
                            size={20}
                            onPress={() => setDatePickerVisible1(true)}
                          />
                        }
                      />
                    )}
                    name="end_date"
                  />
                  {errors.end_date && (
                    <View style={styles.rowText}>
                      <Feather
                        name="alert-circle"
                        size={9}
                        color="red"
                        style={styles.icon}
                      />
                      <Text style={styles.error}>This field is required.</Text>
                    </View>
                  )}
                  <Pressable
                    style={styles.btn}
                    onPress={handleSubmit(onSubmit)}>
                    {loading ? (
                      <ActivityIndicator size={20} color="black" />
                    ) : (
                      <Text style={styles.btnText}>Submit</Text>
                    )}
                  </Pressable>

                  <DateTimePickerModal
                    minimumDate={new Date()}
                    isVisible={isDatePickerVisible1}
                    mode="date"
                    onConfirm={handleConfirm1}
                    onCancel={() => setDatePickerVisible1(false)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#D3D3D3',
    // alignItems: 'flex-start',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  row: {
    borderRadius: 10,
    width: responsiveWidth(95),
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
    alignSelf: 'center',
    // flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    width: responsiveWidth(45),
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
    marginBottom: 10,
  },
  course: {
    width: responsiveWidth(45),
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  row1: {
    flexDirection: 'row',
    gap: 15,
  },

  date: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  newDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  btn: {
    width: responsiveWidth(30),
    height: responsiveHeight(5),
    backgroundColor: 'white',
    elevation: 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    marginBottom: 40,
  },
  btnText: {
    color: 'black',
    fontSize: responsiveFontSize(1.96),
    fontFamily: 'Roboto-Medium',
  },
  btnItem: {
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
  btn1: {
    width: responsiveWidth(30),
    height: responsiveHeight(5),
    backgroundColor: 'green',
    elevation: 2.5,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 10,
  },
  btnText1: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
  },

  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.5),
  },
  menuText1: {
    color: colors.black,
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 20,
  },
  menuText2: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },
  menuText3: {
    color: colors.white,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },

  // Modal
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // marginVertical:20,
  },
  modalContainer: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  cancelIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  modalText: {
    // marginTop: 20,
    // fontSize: 18,
    // textAlign: 'center',
  },
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  box: {
    width: 40,
    height: 30,
    borderRadius: 5,
    backgroundColor: 'red',

    alignItems: 'center',
    justifyContent: 'center',
  },

  textInput: {
    width: responsiveWidth(85),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
    marginBottom: 25,
    borderRadius: 10,
    paddingBottom: 0,
    alignSelf: 'center',
  },
  textInput0: {
    width: responsiveWidth(90),
    height: 50,
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
    marginBottom: 25,
    borderRadius: 10,
    borderStartEndRadius: 10,
    borderTopEndRadius: 10,
    borderEndStartRadius: 10,
    borderEndEndRadius: 10,
    paddingBottom: 0,
    borderWidth: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  rowText: {
    flexDirection: 'row',
    marginLeft: 12,
    marginBottom: 5,
  },
  icon: {
    marginRight: 4,
    marginTop: -8,
  },
  error: {
    width: 330,
    color: 'red',
    fontSize: 10,
    marginTop: -10,
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

  dropdown: {
    width: responsiveWidth(80),
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    marginBottom: 15,
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
});

export default RetreatMarkFees;
