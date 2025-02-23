/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-shadow */
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
  RefreshControl,
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
import {TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDate} from 'date-fns';
import {ScrollView} from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';

interface Props {}
const userJobDetail: FC<Props> = ({navigation}): JSX.Element => {
  const dispatch = useDispatch();
  const route = useRoute();
  const {job_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pastedUrl, setPastedUrl] = useState('');
 console.log(job_id,'job_id')
  const onRefresh = () => {
    setRefreshing(true);
    ApplicationFun();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      ApplicationFun();
      setPastedUrl(data.resume);
      requestMediaPermissions()
    }, [pastedUrl,data]),
  );

  const ApplicationFun = async () => {
    setLoading(true);
    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, 'storage');
      const response: any = await getMethod(
        `user-job-apply-detail?id=${job_id}`,
      );
      if (response.status === 200) {
        setData(response.data.application);
        setJobData(response.data.application.job);
        console.log(response.data, 'va');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

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
  

  return (
    <View style={styles.container}>
      <View style={styles.row0}>
        <Icon
          name="arrow-back"
          type="material"
          color="black"
          size={25}
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.row}>
          <View style={styles.row1}>
            <Avatar
              size={40}
              rounded
              source={{uri: data.image}}
              // containerStyle={{backgroundColor: 'lightgray', marginBottom: 20}}
            />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <View>
                  <Text style={styles.name}>{jobData.job_title}</Text>
                  <Text style={styles.course}>{data.trainer_name}</Text>
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
              {flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'},
            ]}>
            <Text style={styles.text}>Download Resume</Text>

            <Pressable onPress={() => downloadResume()}>
              <Icon name="download" size={30} color="black" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
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
    width: responsiveWidth(45),
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
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  newDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),
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
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
    marginLeft: 10,
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
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.5),
    justifyContent:'center'
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

export default userJobDetail;
