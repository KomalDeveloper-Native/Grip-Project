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
  Platform,
  Linking,
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
import {TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDate} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import * as DocumentPicker from 'react-native-document-picker';
import {DocumentPickerResponse} from 'react-native-document-picker';
import Snackbar from 'react-native-snackbar';
interface Props {}
const ApplicationDetail: FC<Props> = ({navigation}): JSX.Element => {
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);
  const [update, setUpdate] = useState([]);
  const route = useRoute();
  const {ApplicantId} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [jobData, setJobData] = useState([]);
  console.log(statusNo, 'statusNo');
  const [buttonLoading, setButtonLoading] = useState(false); // State for button loading
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pastedUrl, setPastedUrl] = useState('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const STORAGE_KEY = '@savedFilePath';

  useFocusEffect(
    useCallback(() => {
      ApplicationFun();
      getUpdateStatus();
 
      setPastedUrl(data.resume);
      requestMediaPermissions();
    }, [pastedUrl,data]),
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
            Math.floor(date.getDate() + date.getSeconds() / 2) ,
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

  const getUpdateStatus = async () => {
    try {
      const endedSubscriptions =
        JSON.parse(await AsyncStorage.getItem('updateStatus')) || [];
      if (endedSubscriptions.includes(id)) {
        setUpdate(true); // Show "Subscription Ended"
      } else {
        setUpdate(false); // Show "End Subscription"
      }
    } catch (error) {
      console.error('Failed to retrieve update status:', error);
    }
  };

  const ApplicationFun = async () => {
    setLoading(true);

    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, 'storage');
      const response: any = await getMethod(
        `user-job-application-detail?id=${ApplicantId}`,
      );
      console.log(response.data, 'va');

      if (response.data.success === true) {
        setData(response.data.application);
        setJobData(response.data.application.job);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const updatestatusFun = async id => {
    // setButtonLoading(true); // Set button loading state
    setLoading(true);
    try {
      const row = {
        status: id,
      };
      const response: any = await postMethod(
        `user-job-application-change-status?id=${ApplicantId}`,
        row,
      );

      if ((response.status = 200)) {
        setUpdate(response.data.status);
        ApplicationFun();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
      setButtonLoading(false); // Reset button loading state
    }
  };
  const memoResult = useMemo(() => {
    if (statusNo !== null) {
      updatestatusFun(statusNo);
    }
  }, [statusNo]);

  const confirmAction = (num: number) => {
    dispatch(setStatus(num));
    setTempStatus(num);
    ApplicationFun();
  };

  return (
    <View style={styles.container}>
      <MenuProvider>
        <View style={styles.row0}>
          <Icon
            name="arrow-back"
            type="material"
            color="black"
            size={25}
            onPress={() => navigation.goBack()}
          />
          <View style={{flexDirection: 'row', gap: 20}}>
            {/* <Icon
              name="chatbox-ellipses"
              type="ionicon"
              color="black"
              size={30}
            /> */}
            {data.status === 'Close' ? null : data.status ===
              'subscribed' ? null : (
              <MenuPop
                navigation={navigation}
                item={data}
                Approve={() => confirmAction(1)}
                Reject={() => confirmAction(0)}
                Awaiting={() => confirmAction(2)}
              />
            )}

            {/* <Icon name="more-vert" type="material" color="black" size={20} /> */}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.row1}>
            <Avatar
              size={40}
              avatarStyle={{backgroundColor: '#D3D3D3'}}
              rounded
              source={require('../../../img/one.jpeg')}
            />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <View>
                  <Text style={styles.name}>{data.name}</Text>
                  <Text style={styles.course}>{jobData.job_title}</Text>
                </View>
                <View>
                  <View style={styles.row1}>
                    <Icon
                      name="update"
                      type="material"
                      size={20}
                      color="black"
                    />
                    <Text style={styles.date}>{data.status}</Text>
                  </View>
                  <View style={styles.row1}>
                    <Icon
                      name="event"
                      type="material"
                      size={20}
                      color="black"
                    />
                    <Text style={styles.newDate}>{data.applied_date}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.textInput}>
            <Text style={styles.text}>Pay Range: ₹{jobData.pay_range}</Text>
          </View>
          <View style={styles.textInput}>
            <Text style={styles.text}>Job Type: {jobData.job_type}</Text>
          </View>
          <View
            style={[
              styles.textInput,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <Text style={styles.text}>Download Resume : {data.resume}</Text>

            <Pressable onPress={() => downloadResume()}>
              <Icon name="download" size={30} color="green" />
            </Pressable>
          </View>
        </View>
      </MenuProvider>
    </View>
  );
};

export const MenuPop: FC<MenuPopProps> = ({
  navigation,
  item,
  Approve,
  Reject,
  Awaiting,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const colorIcon2 = item.status === 'Awaiting' ? 'orange' : 'gray';
  const colorIcon = item.status === 'Approve' ? 'green' : 'gray';
  const colorIcon1 = item.status === 'Reject' ? 'red' : 'gray';

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
          },
        }}>
        <MenuOption>
          <Pressable onPress={toggleModal}>
            <Text style={styles.menuText2}>Change Application Status</Text>
          </Pressable>
          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={toggleModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Pressable style={styles.cancelIcon} onPress={toggleModal}>
                  <Icon type="material" name="close" size={30} color="#000" />
                </Pressable>
                <View style={styles.rowIcon}>
                  <Text style={styles.menuText1}>
                    Change Application Status
                  </Text>
                  <Pressable style={styles.rowIcon1} onPress={() => Approve()}>
                    <Icon
                      type="material"
                      name="check-circle"
                      size={20}
                      color={colorIcon}
                    />
                    <Text style={styles.menuText}>Approve</Text>
                  </Pressable>
                  <Pressable style={styles.rowIcon1} onPress={() => Reject()}>
                    <Icon
                      type="material"
                      name="check-circle"
                      size={20}
                      color={colorIcon1}
                    />
                    <Text style={styles.menuText}>Reject</Text>
                  </Pressable>
                  <Pressable style={styles.rowIcon1} onPress={() => Awaiting()}>
                    <Icon
                      type="material"
                      name="check-circle"
                      size={20}
                      color={colorIcon2}
                    />
                    <Text style={styles.menuText}>Awaiting</Text>
                  </Pressable>
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
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  row: {
    borderRadius: 10,
    flex: 1,
    width: responsiveWidth(95),
    backgroundColor: 'white',

    padding: 10,
    alignSelf: 'center',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },

  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
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
  row2: {
    width: responsiveWidth(74),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 10,
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
  },
  btnText: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
  },
  btnText0: {
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
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 20,
  },
  menuText2: {
    width: responsiveWidth(90),

    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },

  // Modal
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: responsiveWidth(90),
    // height: responsiveHeight(18),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
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
  rowIcon: {},
  rowIcon1: {
    flexDirection: 'row',
    gap: 10,
    // marginBottom:10,
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    width: responsiveWidth(85),
    height: responsiveHeight(8),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
    marginBottom: 25,
    borderRadius: 10,
    marginTop: 5,
    padding: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    width: responsiveWidth(72),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.5),
  },
  btnItem: {
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
  btnItemText: {
    color: 'black',
    fontSize: responsiveFontSize(1.96),
    fontFamily: 'Roboto-Medium',
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
});

export default ApplicationDetail;
