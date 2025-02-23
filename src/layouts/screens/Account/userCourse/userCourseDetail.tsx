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
  ScrollView,
  RefreshControl,
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
import {AsyncStorage} from 'react-native';

interface Props {}
const userCourseDetail: FC<Props> = ({navigation}): JSX.Element => {
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);
  const [update, setUpdate] = useState([]);
  const route = useRoute();
  const {course_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(null);

  const [buttonLoading, setButtonLoading] = useState(false); // State for button loading
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    courseDetailFun();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      courseDetailFun();
    }, []),
  );

  const courseDetailFun = async () => {
    setLoading(true);

    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, 'storage');
      const response: any = await getMethod(
        `lead-simple-user-detail?lead_id=${course_id}`,
      );
      if (response.status === 200) {
        setData(response.data.subscription);
        console.log(response.data, 'va');
      }
      setMessage(response.data.message);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error', course_id);
    }
  };
  return (
    <View style={styles.container}>
      <MenuProvider>
        <View style={styles.row0}>
          <Icon
            name="arrow-back"
            type="material"
            color="black"
            size={20}
            onPress={() => navigation.goBack()}
          />
          <View style={{flexDirection: 'row', gap: 20}}>
            {data && (
              <MenuPop
                navigation={navigation}
                subscription_id={data.subscription_id}
              />
            )}
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {data ? (
            <View style={styles.row}>
              <View style={styles.row1}>
                <Avatar
                  size={40}
                  rounded
                  source={{uri: data.image}}
                  // containerStyle={{backgroundColor: 'lightgray'}}
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
                      <Text style={styles.name}>{data.course}</Text>
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
                        <Text style={styles.newDate}>{data.date}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.textInput}>
                <Text style={styles.text}>
                  Subscription Start Date: {data['subscription Start Date']}
                </Text>
              </View>
              <View style={styles.textInput}>
                <Text style={styles.text}>
                  Last Payment Date: {data['Last Payment Date']}
                </Text>
              </View>
              <View style={styles.textInput}>
                <Text style={styles.text}>
                  Last Paid Amount : {data['Last Payment Amount']}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{message}</Text>
            </View>
          )}
        </ScrollView>
      </MenuProvider>
    </View>
  );
};

export const MenuPop: FC<MenuPopProps> = ({navigation, subscription_id}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const courseDetailFun = async () => {
    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, 'storage');
      const row = {
        suscription_id: subscription_id,
      };
      const response: any = await postMethod(`suscription-history`, row);
      if (response.status === 200) {
        setData(response.data.subscription);
        console.log(response.data, 'val');
      }
    } catch (error) {
      console.log('error');
    }
  };

  const toggleModal = () => {
    courseDetailFun();
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
            <Text style={styles.menuText2}>Transaction History</Text>
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
                  <Text style={styles.menuText1}>Transaction History</Text>
                  <Pressable style={styles.rowIcon1}>
                    <Text style={styles.menuText}>
                      {data['Subscription Date']}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.menuText}> ₹{data.amount}</Text>
                      <Icon
                        type="material"
                        name="picture-as-pdf"
                        size={20}
                        color="red"
                      />
                    </View>
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
    fontSize: responsiveFontSize(2),
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
    justifyContent: 'space-between',
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
    fontSize: responsiveFontSize(1.7),
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
    fontSize: responsiveFontSize(26),
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default userCourseDetail;
