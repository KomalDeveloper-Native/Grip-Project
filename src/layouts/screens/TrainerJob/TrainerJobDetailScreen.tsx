/* eslint-disable no-dupe-keys */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, Icon} from 'react-native-elements';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {getStorageData, getMethod, postMethod} from '../../../utils/helper';
import {Divider} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-gesture-handler';
import JobDetail from './JobDetail';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch} from 'react-redux';
import {setCourseId, setJobId} from '../../../Redux/ListSlice ';
import JobTopNavigation from '../../navigation/TabNavigation/JobTopNavigation';

interface Props {}
const TrainerJobDetail: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [store, setStore] = useState(null);
  const [store1, setStore1] = useState(null);
  const {jobid} = route.params;
  console.log(jobid, 'jkk');

  useFocusEffect(
    useCallback(() => {
      FetchJob();
    }, [data]),
  );

  const FetchJob = async () => {
    const storage = await getStorageData();
    try {
      setLoading(true);
      const response: any = await getMethod(`user-job-detail?id=${jobid}`);
      setData(response.data.data);
      console.log(response.data, 'fdgf');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };


  return (
    <MenuProvider>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Icon
            name="arrow-back"
            size={20}
            color={'black'}
            onPress={() => navigation.goBack()}
          />

          <MenuPop navigation={navigation} item={data} jobid={jobid} />
        </View>

        <View style={{padding: 10, paddingBottom: 0}}>
          <Text style={[styles.title, {fontSize: responsiveFontSize(2.5)}]}>
            {data.job_title}
          </Text>
          <Text style={styles.title1}>{data.user_name}</Text>
        </View>
        <Divider />

        <View style={[styles.row, {paddingVertical: 10}]}>
          {data.job_type ? (
            <>
              <Icon
                name="briefcase"
                type="material-community"
                color={'black'}
                size={15}
              />
              <View style={styles.row1}>
                <Text style={styles.text1}> {data.job_type}</Text>
              </View>
            </>
          ) : null}
        </View>
        <Divider />

        <View style={{padding: 10, paddingBottom: 0}}>
          <Text style={styles.title}>Location</Text>
          <Text style={styles.title1}>{data.location}</Text>
        </View>
        <View style={{paddingHorizontal: 10}}>
          <Text style={styles.title}>Salary</Text>
          <Text style={styles.title1}>{data.pay_range} /Monthly</Text>
        </View>
        <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
          <Text style={styles.title}>Job Details</Text>
          <Text
            style={[
              styles.title1,
              {fontFamily: 'Roboto-Regular', letterSpacing: 1},
            ]}>
            {data.job_description}
          </Text>
        </View>
        <JobDetail navigation={navigation} item={data} />
      </ScrollView>
    </MenuProvider>
  );
};

export const MenuPop = ({navigation, item, jobid}: any) => {
  const [loading, setLoading] = useState(false);
  const [status1, setStatus1] = useState('');

  console.log('ii', jobid, item, 'data');
  const dispatch = useDispatch();
  dispatch(setJobId(jobid));
  const PressView = (item: any) => {
    console.log(item, 'item');
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditJobScreen',
        params: {
          Jobdata: item,
          jobid: jobid,
        },
      }),
    );
  };

  const NavFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'JobTopNavigation',
        params: {
          jobid: jobid,
        },
      }),
    );
  };

  const distableFun = async (res: number) => {
    console.log(res, 'row', jobid);

    // Show confirmation dialog
    const status = res === 1 ? 'Disable' : 'Enable';
    Alert.alert(
      'Confirmation',
      `Are you sure you want to ${status} ?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            try {
              const row = {
                status: res,
              };
              setStatus1(res);

              const response: any = await postMethod(
                `user-job-status-update?id=${jobid}`,
                row,
              );
              console.log(response.data, 'ds');

              if (response.status === 200) {
                console.log(response.data, 'ds');
              } else {
                console.log(response, '500');
              }
            } catch (error) {
              console.error('Failed to update course status:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <Menu>
      <MenuTrigger>
        <Icon name="more-vert" type="material" color="black" size={25} />
      </MenuTrigger>

      <MenuOptions    customStyles={{
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
          <Pressable onPress={() => PressView(item)}>
            <Text style={styles.menuText}>Edit</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun()}>
            <Text style={styles.menuText}>Applications</Text>
          </Pressable>
        </MenuOption>

        <MenuOption>
          {status1 === 1 ? (
            <Pressable onPress={() => distableFun(0)}>
              <Text style={styles.menuText}>Enable</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => distableFun(1)}>
              <Text style={styles.menuText}>Disable</Text>
            </Pressable>
          )}
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),

    padding: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
  },

  row0: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logoImage: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
    padding: 0,
    marginBottom: 0,
  },

  card: {
    width: responsiveWidth(88),
    paddingBottom: 5,
    padding: 10,

    marginBottom: 10,
    // borderStartWidth:0.1,
    backgroundColor: 'white',
    marginTop: 10,
    alignSelf: 'center',
  },
  title: {
    width: responsiveWidth(80),
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    marginBottom: 5,
    // marginBottom: 10,
  },
  title1: {
    // width: responsiveWidth(90),
    color: 'black',
    fontSize: responsiveFontSize(1.75),
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
  },
  row: {
    width: responsiveWidth(48),
    flexDirection: 'row',
    alignItems: 'center',
    // gap:5,
    marginLeft: 10,
    marginBottom: 5,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginLeft: 10,
  },
  rowSpace: {
    width: 15,
  },

  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  btn: {
    width: responsiveWidth(28),
    height: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 5.5,
    borderRadius: 8,
  },

  //MENU Pop
  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
    marginLeft: 10,
  },

  custom: {
    padding: 10,
  },
});

export default TrainerJobDetail;
