/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {opacity} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import Appbar from '../../Component/Appbar';
import {getMethod, getStorageData, postMethod} from '../../../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import FranchiseScreen from '../Franchise/FranchiseScreen';
import FranchiseTrainerScreen from '../FranchiseTrainerScreen.tsx/FranchiseTrainerScreen';
import Snackbar from 'react-native-snackbar';
import {useFocusEffect} from '@react-navigation/native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import colors from '../../style/colors';
import RadioGroup from 'react-native-radio-buttons-group';
const screenWidth = Dimensions.get('window').width;
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
  ruleTypes,
} from 'react-native-gifted-charts';
import {ScreenHeight} from '@rneui/base';
import RNPickerSelect from 'react-native-picker-select';
import {bg} from 'date-fns/locale';

interface Props {}
const AccountScreen: FC<Props> = ({navigation}: any): JSX.Element => {
  const kyc = useSelector(state => state.List.kyc);
  const [store, setStore] = useState(null);
  const [store1, setStore1] = useState(null);
  const [monthlyCount, setMonthlyCount] = useState([]);
  const [selectedOption, setSelectedOption] = useState('course');
  const [selected, setSelected] = useState(null);

  const [valueType, setValueType] = useState('click'); // Click or Impression selection

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    // Re-fetch the data when module changes
    CourseGraph(value, valueType);
  };

  const handleValueTypeChange = (value: string) => {
    setValueType(value);
    // Re-fetch the data when value type changes
    CourseGraph(selectedOption, value);
  };

  useFocusEffect(
    useCallback(() => {
      CourseGraph();
    }, [selectedOption]),
  );

  const memoFun = useMemo(async () => {
    const storage = await getStorageData();
    console.log(storage, 'memo');
    if (storage.response.kyc === 1) {
      setStore(storage.response.kyc);
    }
    const getKyc = await AsyncStorage.getItem('kyc');
    setStore1(getKyc);
    console.log(storage.response.kyc, store1, 'kkd');
  }, []);

  const CourseGraph = async () => {
    try {
      const storage = await getStorageData();
      const login_user = storage.response.user.id;
      const row = {
        user_id: login_user,
      };
      const response = await postMethod(
        `${selectedOption}-click-and-impression`,
        row,
      );
      if (response.status === 200) {
        const apiData = response.data;
        const data = Object.keys(apiData.monthlyImpressionCounter).map(
          date => ({
            label: date,
            clickValue: apiData.monthlyClickCounter[date] || null,
            impressionValue: apiData.monthlyImpressionCounter[date],
          }),
        );
        console.error(response.data, selectedOption, 'data');
        setMonthlyCount(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const data = monthlyCount.flatMap(item => {
    if (valueType === 'click') {
      return [
        {
          label: item.label, // Date as the label
          value: item.clickValue, // Click value
          barStyle: {backgroundColor: 'blue'}, // Click bars colored blue
          type: 'click', // Add type to distinguish clicks
        },
      ];
    } else if (valueType === 'impression') {
      return [
        {
          label: item.label, // Date as the label
          value: item.impressionValue, // Impression value
          barStyle: {backgroundColor: 'orange'}, // Impression bars colored orange
          type: 'impression', // Add type to distinguish impressions
        },
      ];
    }
    return [];
  });
  return (
    <>
      <MenuProvider>
        <MenuPop navigation={navigation} />
        <View style={styles.container}>
          <ScrollView
            zoomScale={5}
            scrollToOverflowEnabled={false}
            showsVerticalScrollIndicator={false}>
            {kyc || store ? (
              <>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{flexDirection:'row',justifyContent:'center',gap:20}}>
   
                  <RNPickerSelect
                    dropdownItemStyle={{
                      backgroundColor: '#C9E6F0',
                    }}
                    activeItemStyle={{
                      backgroundColor: 'white',
                      overflow: 'hidden',
                    }}
                    value={valueType}
                    onValueChange={value => handleValueTypeChange(value)}
                    items={[
                      {label: 'Clicks', value: 'click'},
                      {label: 'Impressions', value: 'impression'},
                    ]}
                    placeholder={{
                      label: 'Select Your Module',
                      value: null, // Set value to null so placeholder is displayed initially
                      color: 'black',
                    }}
                    style={{
                      inputIOS: {
                        fontSize: responsiveFontSize(1.8),
                        width: responsiveWidth(45),
                        height: 40,
                        color: 'black',
                        borderWidth: 1,
                        borderColor: 'white',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        marginBottom: 20,
                        backgroundColor: '#C9E6F0', // Adjust padding for text
                      },
                      inputAndroid: {
                        fontSize: responsiveFontSize(1.8),
                        width: responsiveWidth(45),
                        height: 40,
                        color: 'black',
                        borderWidth: 1,
                        borderColor: 'white',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        marginBottom: 20,
                        backgroundColor: '#C9E6F0',
                      },
                    }}
                    useNativeAndroidPickerStyle={false}
                  />
                  <RNPickerSelect
                    dropdownItemStyle={{
                      backgroundColor: '#C9E6F0',
                    }}
                    activeItemStyle={{
                      backgroundColor: 'white',
                      overflow: 'hidden',
                    }}
                    value={selectedOption} // Bind selected value to the picker
                    onValueChange={value => handleOptionChange(value)}
                    items={[
                      {label: 'Franchise', value: 'franchise'},
                      {label: 'Job', value: 'job'},
                      {label: 'Course', value: 'course'},
                      {label: 'Retreat', value: 'retreat'},
                    ]}
                    placeholder={{
                      label: 'Select Your Module',
                      value: null, // Set value to null so placeholder is displayed initially
                      color: 'black',
                    }}
                    style={{
                      inputIOS: {
                        fontSize: responsiveFontSize(1.8),
                        width: responsiveWidth(45),
                        height: 40,
                        color: 'black',
                        borderWidth: 1,
                        borderColor: 'white',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        marginBottom: 20,
                        backgroundColor: '#C9E6F0', // Adjust padding for text
                      },
                      inputAndroid: {
                        fontSize: responsiveFontSize(1.8),
                        width: responsiveWidth(45),
                        height: 40,
                        color: 'black',
                        borderWidth: 1,
                        borderColor: 'white',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        marginBottom: 20,
                        backgroundColor: '#C9E6F0',
                      },
                    }}
                    useNativeAndroidPickerStyle={false}
                  />
                  </View>
               

                  <BarChart
                    data={data}
                    height={responsiveHeight(35)}
                    width={screenWidth - 10}
                    capColor={'white'}
                    barBorderColor={'orange'}
                    //  labelWidth={-50}
                    gradientColor={'green'}
                    dashWidth={0}
                    spacing={30}
                  />
                </ScrollView>
              </>
            ) : null}
            <View style={styles.row}>
              {kyc || store ? (
                <Pressable
                  style={styles.row_container}
                  onPress={() => navigation.navigate('TrainerCourseScreen')}>
                  <View style={styles.icon}>
                    <Image
                      source={require('../../img/MyCourse.png')}
                      style={{width: 35, height: 35}}
                    />
                  </View>
                  <Text style={styles.Active}>My Course</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.row_container}
                  onPress={() => navigation.navigate('userCourse')}>
                  <View style={styles.icon}>
                    <Image
                      source={require('../../img/MyCourse.png')}
                      style={{width: 35, height: 35}}
                    />
                  </View>
                  <Text style={styles.Active}>My Course</Text>
                </Pressable>
              )}
              {kyc || store ? (
                <Pressable
                  style={styles.row_container}
                  onPress={() => navigation.navigate('FranchiseTrainerScreen')}>
                  <View style={styles.icon}>
                    <Icon
                      name="campaign" // 'campaign' icon resembles a loudspeaker in Material Icons
                      type="material"
                      size={35}
                      color="#87ceeb"
                    />
                  </View>

                  <Text style={styles.Active}>Franchies</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.row_container}
                  onPress={() => navigation.navigate('userFranchise')}>
                  <View style={styles.icon}>
                    <Icon
                      name="campaign" // 'campaign' icon resembles a loudspeaker in Material Icons
                      type="material"
                      size={35}
                      color="#87ceeb"
                    />
                  </View>

                  <Text style={styles.Active}>Franchies</Text>
                </Pressable>
              )}

              {kyc || store ? (
                <Pressable
                  style={styles.row_container}
                  onPress={() => navigation.navigate('TrainerJobScreen')}>
                  <View style={styles.icon}>
                    <Icon
                      name="groups"
                      type="material"
                      size={25}
                      color="#000"
                    />
                  </View>
                  <Text style={styles.Active}>Job List</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.row_container}
                  onPress={() => navigation.navigate('userJob')}>
                  <View style={styles.icon}>
                    <Icon
                      name="groups"
                      type="material"
                      size={25}
                      color="#000"
                    />
                  </View>

                  <Text style={styles.Active}>Job List</Text>
                </Pressable>
              )}

              {kyc || store ? (
                <Pressable
                  style={styles.row_container}
                  onPress={() => navigation.navigate('RetreatUserScreen')}>
                  <View style={styles.icon}>
                    <Icon
                      name="person-add"
                      type="material"
                      size={25}
                      color="#000"
                    />
                  </View>

                  <Text style={styles.Active}>Retreat</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.row_container}
                  onPress={() => navigation.navigate('userRetreat')}>
                  <View style={styles.icon}>
                    <Icon
                      name="person-add"
                      type="material"
                      size={25}
                      color="#000"
                    />
                  </View>

                  <Text style={styles.Active}>Retreat</Text>
                </Pressable>
              )}

              {/* <Pressable
                style={styles.row_container}
                onPress={() => navigation.navigate('TrainerEventScreen')}>
                <View style={styles.icon}>
                  <Icon name="eye" type="font-awesome" size={25} color="#000" />
                </View>

                <Text style={styles.Active}>Events</Text>
              </Pressable> */}

              <Pressable
                style={styles.row_container}
                onPress={() => navigation.navigate('ReviewListScreen')}>
                <View style={styles.icon}>
                  <Icon
                    name="mouse-pointer"
                    type="font-awesome"
                    size={25}
                    color="#000"
                  />
                </View>

                <Text style={styles.Active}> Reviews </Text>
              </Pressable>

              <Pressable
                style={styles.row_container}
                onPress={() => navigation.navigate('Profile')}>
                <View style={styles.icon}>
                  <Icon name="person" type="material" size={25} color="#000" />
                </View>
                <Text style={styles.Active}>Profile</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </MenuProvider>
    </>
  );
};

export const MenuPop = ({navigation}: any) => {
  const [userDetails, setUserDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, []),
  );

  const getUserData = async () => {
    try {
      const storedData = await getStorageData();
      setUserDetails(storedData);
    } catch (error) {
      console.log('Error retrieving images:', error);
    }
  };

  const LogOut = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    try {
      const row = {user_id: id};
      const api: any = await getMethod('logout', row);
      console.log(api.data, 'ghh');
      if (api.status === 200) {
        await AsyncStorage.removeItem('user_data');

        navigation.reset({
          routes: [{name: 'LoginScreen'}],
        });
      } else {
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#AE1717',
          backgroundColor: '#F2A6A6',
        });
      }
    } catch (e) {
      Snackbar.show({
        text: 'Some Error Occurred-' + e,
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#AE1717',
        backgroundColor: '#F2A6A6',
      });
    }
  };

  const handleLogoutPress = () => {
    setModalVisible(true); // Show the modal when the logout option is pressed
  };

  const confirmLogout = () => {
    LogOut();
    setModalVisible(false); // Close the modal after confirming
  };

  const cancelLogout = () => {
    setModalVisible(false); // Close the modal on cancel
  };

  return (
    <View style={styles.row}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          name={'arrow-back'}
          type="material"
          color="black"
          size={25}
          onPress={() => navigation.goBack()}
        />
        <Image source={require('../../img/one.jpeg')} style={styles.image} />
      </View>

      <Menu>
        <MenuTrigger>
          <View>
            <Icon name={'settings'} type="material" color="black" size={20} />
          </View>
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
            <Pressable onPress={handleLogoutPress}>
              <Text style={styles.menuText}>Logout</Text>
            </Pressable>
          </MenuOption>
        </MenuOptions>
      </Menu>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelLogout} // Close modal on hardware back button press
      >
        <View style={styles.modalContainer}>
          <View >
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={cancelLogout}>
                <Text style={styles.buttonText1}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={confirmLogout}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    // alignSelf: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    // overflow: 'hidden',
  },
  image: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
    borderRadius: 50,
    marginLeft: 10,
  },
  row_container: {
    width: responsiveWidth(28),
    height: responsiveHeight(13),
    // padding:20,
    opacity: 458,
    elevation: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 0.1,
    // borderStartWidth:0.1,
    borderRightWidth: 0.1,
    alignSelf: 'center',
  },
  icon: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    opacity: 555,
    elevation: 2,
    borderRadius: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Active: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
  },
  graphStyle: {
    elevation: 1.5,
    opacity: 35,
    borderRadius: 15,
    marginBottom: 20,
  },

  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.9),
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
  modalContainer: {
    marginTop: responsiveWidth(80),
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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '40%',
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
   textAlign:'center',
    fontSize: responsiveFontSize(1.75),
  },
  cancelIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default AccountScreen;
