/* eslint-disable dot-notation */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
  ScrollView,
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

interface Props {}
const FranchiseFollowDetail: FC<Props> = ({route, navigation}): JSX.Element => {
  const {followid, followDate} = route.params;
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState([]);
  const [data, setData] = useState([]);
  const [nextUpdate, setNextUpdate] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);

  useFocusEffect(
    useCallback(() => {
      followHistory();
    }, []),
  );

  console.log(followid, 'follr');
  const followHistory = async () => {
    setLoading(true);
    try {
      const response: any = await getMethod(
        `franchise-lead-followup-details?lead_id=${followid}`,
      );
      console.log(data, response.data, 'uuu');
      if (response.status === 200) {
        const History = response.data['Follow Up History'];
        setData(response.data['Lead Detail']);
        setUpdate(History);
        setNextUpdate(response.data['Next Follow Up']);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatestatusFun = async id => {
    console.log(id, 'id');
    setButtonLoading(true); // Set button loading state
    setLoading(true);
    try {
      const row = {
        status: id,
      };
      const response: any = await postMethod(
        `franchise-lead-change-status-user?id=${followid}`,
        row,
      );
      console.log(response.data, 'ds99 ');

      if (response.status === 200) {
        // setLead(response.data.lead);
        setUpdate(response.data.data.status);
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
      followHistory();
    }
  }, [update, confirmVisible,statusNo]);
  console.log(statusNo, 'ffjd');

  const handleConfirm = () => {
    updatestatusFun(statusNo);
    dispatch(setStatus(0));
    followHistory();
    setConfirmVisible(false);
  };

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  const confirmAction = () => {
    setConfirmVisible(true);
  };

  const SentFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FollowUpScreen',
        params: {
          followid: item,
        },
      }),
    );
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
            {data.status === 'Open' && (
              <MenuPop
                navigation={navigation}
                followid={followid}
                CloseFun={() => confirmAction()}
              />
            )}

            {/* <Icon name="more-vert" type="material" color="black" size={20} /> */}
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size={20} color={'black'} />
        ) : 
        <><View style={styles.row}>
            <View style={styles.row1}>
              <Avatar
                size={40}
                // avatarStyle={{backgroundColor: '#D3D3D3'}}
                rounded
                source={{ uri: data.image }} />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}>
                  <View>
                    <Text style={styles.name}>{data.name}</Text>
                    <Text
                      style={[
                        styles.course,
                        { marginBottom: 80, width: responsiveWidth(50) },
                      ]}>
                      {data.franchise_name}
                    </Text>
                  </View>
                  <View>
                    <View style={styles.row1}>
                      <Icon
                        name="chatbox-ellipses"
                        type="ionicon"
                        size={20}
                        color="black"
                        onPress={() => navigation.goBack()} />
                      <Text style={styles.date}>
                        {typeof nextUpdate?.comments === 'string' &&
                          nextUpdate.comments.length > 100
                          ? `${nextUpdate.comments.substring(0, 100)}...`
                          : nextUpdate?.comments}
                      </Text>
                    </View>
                    <View style={styles.row1}>
                      <Icon
                        name="event"
                        type="material"
                        size={20}
                        color="black" />
                      <Text style={styles.newDate}>{followDate}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <>

              {nextUpdate ? (
                <View style={styles.box}>
                  <View style={styles.textBg}>
                    <Text
                      style={[{ marginBottom: 0, fontSize: responsiveFontSize(1.9) }]}>
                      Next Follow Up
                    </Text>
                  </View>
                  <>
                    <View style={styles.box0}>
                      <Icon
                        name="chatbox-ellipses"
                        type="ionicon"
                        size={20}
                        color="black" />
                      <Text style={styles.course}>{nextUpdate.comments}</Text>
                    </View>
                    <View style={styles.box0}>
                      <Icon name="event" type="material" size={20} color="black" />
                      <Text style={styles.course}>{nextUpdate.follow_up_date}</Text>
                    </View>
                  </>
                </View>
              ) : null}
            </><View style={styles.box1}>
              <View style={styles.textBg}>
                <Text
                  style={[{ marginBottom: 5, fontSize: responsiveFontSize(1.9) }]}>
                  Follow Up History
                </Text>
              </View>
              <ScrollView
                style={{ maxHeight: responsiveHeight(41.2) }}
                showsVerticalScrollIndicator={false}>
                {update.map((item, index) => (
                  <View key={index}>
                    {/* Use index or a unique key */}
                    <View style={styles.box0}>
                      <Icon
                        name="chatbox-ellipses"
                        type="ionicon"
                        size={20}
                        color="black" />
                      <Text style={styles.course}>{item.comments}</Text>
                    </View>
                    <View style={styles.box0}>
                      <Icon name="event" type="material" size={20} color="black" />
                      <Text style={styles.course}>{item.follow_up_date}</Text>
                    </View>
                    <Divider />
                  </View>
                ))}
              </ScrollView>
            </View></>
}
        
      </MenuProvider>
      <Modal
        transparent={true}
        visible={confirmVisible}
        animationType="slide"
        onRequestClose={handleCancel}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Would you like to proceed with closing the lead?
            </Text>
            <View style={styles.rowIcon1}>
              <Pressable style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MenuPop = ({navigation, followid, CloseFun}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const SentFun1 = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddSubscriptionScreen',
        params: {
          followid: item,
        },
      }),
    );
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
          },
        }}>
        <MenuOption>
          <Pressable onPress={() => CloseFun(0)}>
            <Text style={styles.menuText2}> Close Lead</Text>
          </Pressable>
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
    flexGrow: 1,
    borderRadius: 10,
    width: responsiveWidth(95),

    backgroundColor: 'white',

    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  box: {
    width: responsiveWidth(90),
    backgroundColor: '#D3D3D3',
    flexDirection: 'column',
    borderRadius: 5,
    position: 'absolute',
    padding: 20,
    marginTop: 115,
    alignSelf: 'center',
    justifyContent: 'space-between',

    gap: 10,
    marginBottom: 880,
    opacity: 88,
    elevation: 1,
  },

  // EEECEC
  box1: {
    width: responsiveWidth(90),
    backgroundColor: '#EEECEC',
    flexDirection: 'column',
    borderRadius: 5,
    position: 'absolute',
    padding: 20,
    marginTop: 300,
    alignSelf: 'center',
    justifyContent: 'space-between',

    gap: 10,
    marginBottom: 20,
    opacity: 88,
    elevation: 1,
  },

  textBg: {
    width: responsiveWidth(79),
    //  height:responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    textAlign: 'center',
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
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    width: responsiveWidth(70),
    marginBottom: 10,
    flexWrap: 'wrap',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
    // marginLeft: -3,
    textAlign: 'justify',
  },
  row1: {
    // marginLeft: -4,

    flexDirection: 'row',
    gap: 10,
  },
  row2: {
    width: responsiveWidth(70),
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
    // marginBottom: 10,
    // marginLeft: 10,
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

  rowIcon: {},
  rowIcon1: {
    flexDirection: 'row',
    gap: 10,
    // marginBottom:10,
    alignItems: 'center',
    // marginBottom: 20,
  },
});

export default FranchiseFollowDetail;
