/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable dot-notation */
/* eslint-disable quotes */
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
import {Divider} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {setStatus} from '../../../../Redux/ListSlice ';

const ReatreatFollowDetail: FC<Props> = ({navigation, route}): JSX.Element => {
  const {followid} = route.params;
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState([]);
  const [data, setData] = useState<[]>([]);
  const [nextUpdate, setNextUpdate] = useState<[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);
  const [message, setMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const memoFun = useMemo(() => {
    return data.status;
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await followHistory(); // Refresh data
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(async () => {
      await followHistory();
    }, []),
  );

  const followHistory = async () => {
    setLoading(true);
    try {
      const response: any = await getMethod(
        `user-retreat-lead-followup-detail?id=${followid}`,
      );
      if (response.data.success === true) {
        setData(response.data['Lead Detail']);
        setUpdate(response.data['Follow Up History']);
        setNextUpdate(response.data['Next Follow Up']);
        setMessage(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const updatestatusFun = async id => {
    setLoading(true);
    try {
      const row = {
        lead_id: followid,
        status: id,
      };
      const response: any = await postMethod(
        `user-retreat-lead-update-status`,
        row,
      );
      if (response.status === 200) {
        setUpdate(response.data.data.status);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error('Failed to update lead status:', error);
    }
  };

  const useMemoFun = useMemo(async () => {
    if (statusNo !== null && confirmVisible) {
      await updatestatusFun(statusNo); // Avoid calling followHistory here
    }
  }, []);

  const handleConfirm = async num => {
    setButtonLoading(true); // Optional: Indicate button is processing
    await updatestatusFun(num); // Wait for status update
    await followHistory(); // Refresh the history
    dispatch(setStatus(num)); // Update Redux state
    setButtonLoading(false);
    setConfirmVisible(false);
  };
  const handleCancel = num => {
    dispatch(setStatus(num));
    setConfirmVisible(false);
  };

  const confirmAction = async () => {
    setConfirmVisible(true);
  };

  const SentFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddRetreatLeadFollow',
        params: {
          lead_id: followid,
        },
      }),
    );
  };

  if (loading) {
    <ActivityIndicator size={25} color={'black'} />;
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size={20} color="black" />
      ) : (
        <MenuProvider>
          <View style={styles.row0}>
            <Icon
              name="arrow-back"
              type="material"
              color="black"
              size={25}
              onPress={() => navigation.goBack()}
            />
            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
              {data.status !== 'Close' && data.booking !== 'yes' && (
                <Icon
                  name="plus"
                  type="material-community"
                  color="black"
                  size={30}
                  onPress={() => SentFun(followid)}
                />
              )}
              {data.status !== 'Close' && (
                <MenuPop
                  navigation={navigation}
                  followid={followid}
                  CloseFun={() => confirmAction()}
                  data={data}
                />
              )}
            </View>
          </View>
          {data ? (
            <>
              <View style={styles.row}>
                <View style={styles.row1}>
                  <Avatar
                    size={40}
                    // avatarStyle={{ backgroundColor: '#D3D3D3' }}
                    rounded
                    source={{uri: data.image}}
                  />
                  <View style={styles.rowbox}>
                    <View>
                      <Text style={styles.name}>{data.name}</Text>
                      <Text style={styles.course}>{data.retreat_name}</Text>
                    </View>
                    <View>
                      <View style={styles.row1}>
                        <Icon
                          name="chatbox-ellipses"
                          type="ionicon"
                          size={20}
                          color="black"
                          onPress={() => navigation.goBack()}
                        />
                        <Text style={styles.date}>
                          {typeof nextUpdate?.comments === 'string' &&
                          nextUpdate.comments.length > 100
                            ? `${nextUpdate.comments.substring(0, 100)}...`
                            : nextUpdate?.comments || 'No comments available'}
                        </Text>
                      </View>
                      <View style={styles.row1}>
                        <Icon
                          name="event"
                          type="material"
                          size={20}
                          color="black"
                        />
                        <Text style={styles.newDate}>{data.date} </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }>
                  {nextUpdate.comments ? (
                    <View style={styles.box}>
                      <View style={styles.textBg}>
                        <Text
                          style={[
                            styles.course,
                            {
                              marginBottom: 0,
                              fontSize: responsiveFontSize(1.9),
                            },
                          ]}>
                          Next Follow Up
                        </Text>
                      </View>
                      <>
                        <View style={styles.box0}>
                          <Icon
                            name="chatbox-ellipses"
                            type="ionicon"
                            size={20}
                            color="black"
                          />
                          <Text style={styles.course}>
                            {nextUpdate.comments}
                          </Text>
                        </View>
                        <View style={styles.box0}>
                          <Icon
                            name="event"
                            type="material"
                            size={20}
                            color="black"
                          />
                          <Text style={styles.course}>
                            {nextUpdate.follow_up_date}
                          </Text>
                        </View>
                      </>
                    </View>
                  ) : (
                    <View style={styles.textBg}>
                      <Text style={styles.course}>No Comment Available</Text>
                    </View>
                  )}

                  <View style={styles.box1}>
                    <View style={styles.textBg}>
                      <Text
                        style={[
                          styles.course,
                          {marginBottom: 5, fontSize: responsiveFontSize(1.9)},
                        ]}>
                        Follow Up History
                      </Text>
                    </View>
                    <ScrollView style={{minHeight: responsiveHeight(40)}}>
                      {update.map((item, index) => (
                        <View key={index}>
                          {/* Use index or a unique key */}
                          <View style={styles.box0}>
                            <Icon
                              name="chatbox-ellipses"
                              type="ionicon"
                              size={20}
                              color="black"
                            />
                            <Text style={styles.course}>{item.comments}</Text>
                          </View>
                          <View style={styles.box0}>
                            <Icon
                              name="event"
                              type="material"
                              size={20}
                              color="black"
                            />
                            <Text style={styles.course}>
                              {item.follow_up_date}
                            </Text>
                          </View>
                          <Divider />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </ScrollView>
              </View>
            </>
          ) : (
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{message}</Text>
            </View>
          )}
        </MenuProvider>
      )}
      <Modal
        transparent={true}
        visible={confirmVisible}
        animationType="slide"
        onRequestClose={() => handleCancel(1)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Would you like to proceed with closing the lead?
            </Text>
            <View style={styles.rowIcon1}>
              <Pressable style={styles.button} onPress={() => handleCancel(1)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => handleConfirm(0)}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MenuPop = ({navigation, followid, CloseFun, data}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const SentFun1 = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddBookingScreen',
        params: {
          lead_id: followid,
        },
      }),
    );
  };

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
            paddingVertical: 7,
            marginVertical: -4,
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
          {data.booking !== 'yes' ? (
            <Pressable onPress={() => SentFun1(followid)}>
              <Text style={styles.menuText2}>Add Booking</Text>
            </Pressable>
          ) : null}

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
                  <Text style={styles.menuText}>Change Lead Status</Text>
                </View>
              </View>
            </View>
          </Modal>
        </MenuOption>
        {data.status === 'Close' ? null : (
          <MenuOption>
            <Pressable onPress={() => CloseFun()}>
              <Text style={styles.menuText2}>Close Lead</Text>
            </Pressable>
          </MenuOption>
        )}
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
  rowbox: {
    minWidth: responsiveWidth(75),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row0: {
    width: responsiveWidth(93),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexGrow: 3,
    flex: 3,
    borderRadius: 10,
    width: responsiveWidth(95),
    backgroundColor: 'white',
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  box: {
    width: responsiveWidth(90),
    backgroundColor: '#D3D3D3',
    flexDirection: 'column',
    borderRadius: 5,
    position: 'relative',
    padding: responsiveWidth(6),
    alignSelf: 'center',
    justifyContent: 'space-between',

    gap: 10,
    marginBottom: 10,
    opacity: 88,
    elevation: 1,
  },

  // EEECEC
  box1: {
    width: responsiveWidth(90),
    backgroundColor: '#EEECEC',
    flexDirection: 'column',
    borderRadius: 5,

    padding: 20,
    alignSelf: 'center',
    // justifyContent: 'space-between',

    gap: 10,
    opacity: 88,
    elevation: 1,
  },

  textBg: {
    width: responsiveWidth(79),
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },

  box0: {
    // width: responsiveWidth(90),
    // paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom:15,
    // alignItems: 'center',
    // marginTop:2,
  },

  name: {
    minWidth: responsiveWidth(20),
    maxWidth: responsiveWidth(50),
    marginBottom: 5,
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    minWidth: responsiveWidth(20),
    maxWidth: responsiveWidth(45),
    marginBottom: 10,
    flexWrap: 'wrap',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
    textAlign: 'justify',
  },
  row1: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    // width: responsiveWidth(40),
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 10,
  },
  date: {
    minWidth: responsiveWidth(20),
    maxWidth: responsiveWidth(50),
    maxHeight: responsiveHeight(40),

    marginBottom: 5,

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
    height: responsiveHeight(15),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
  },
  buttonText1: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
  },
  modalText: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.75),
    marginBottom: 10,
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

  rowIcon: {},
  rowIcon1: {
    flexDirection: 'row',
    gap: 10,
    // marginBottom:10,
    alignItems: 'center',
    // marginBottom: 20,
  },
});

export default ReatreatFollowDetail;
