/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import {Card} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {getMethod, getStorageData, postMethod} from '../../../utils/helper';
import colors from '../../style/colors';
// import NewCourseScreen from './NewCourseScreen';
import {MenuProvider} from 'react-native-popup-menu';
import {Icon} from 'react-native-elements';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {FlipInEasyX} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import RetreatUser from './RetreatUserScreen';
import JobDetail from '../TrainerJob/JobDetail';
import RetreatDetail from './RetreatDetail';
import {useDispatch} from 'react-redux';
import {setRetreatId} from '../../../Redux/ListSlice ';
import RetreatTopNavigator from '../../navigation/TabNavigation/RetreatTopNavigator';

interface Props {}
const RetreatUserDetailScreen: FC<Props> = ({
  navigation,
  route,
}: // user_id,
any): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<[]>([]);
  const [status, setStatus] = useState(false);
  const {retreatid} = route.params;

  console.log(retreatid, 'uerids');
  useFocusEffect(
    useCallback(() => {
      RetreatList();
    }, [data]),
  );

  const RetreatList = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod(
        `user-retreat-detail/?id=${retreatid}`,
      );
      if (response.status === 200) {
        setData(response.data.data[0]);
        console.log(response.data.data[0], 'drx');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };
  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          type="material"
          color={i <= rating ? 'orange' : 'orange'}
          size={15}
        />,
      );
    }
    return stars;
  };

  const RenderItem = () => (
    <View style={styles.card}>
      <Image
        source={{uri: data.image}}
        style={styles.image}
        resizeMode="contain"
      />
      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            // alignItems: 'flex-start',
            marginBottom: 0,
          },
        ]}>
          <Text style={styles.text}>{data.title}</Text>

        <View >
          <Text>{renderStars(data.review?.fullStars)}</Text>
          <Text style={styles.review}>
            Reviews ({data.review?.reviewCount})
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Icon
          name="meditation"
          type="material-community"
          color={'black'}
          size={20}
          style={styles.rowSpace}
        />
        <Text style={styles.text2}>
          <Text style={styles.name}>With {data.user_name}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Icon
          name="location-pin"
          type="entypo"
          color={'black'}
          size={15}
          style={styles.rowSpace}
        />
        <Text style={styles.text1}>{data.location}</Text>
      </View>
      {data.group_size ? (
        <View style={styles.row}>
          <Icon
            name="group"
            type="font-awesome"
            color="black"
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}>{data.group_size} Members</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Icon
          name="weather-night"
          type="material-community"
          color="black"
          size={15}
          style={styles.rowSpace}
        />
        <Text style={styles.text1}>{data.no_of_days}</Text>
      </View>
      <View style={styles.row}>
        {data.price ? (
          <>
            <Icon
              name="currency-inr"
              type="material-community"
              color={'black'}
              size={15}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{data.price}</Text>
            </View>
          </>
        ) : null}
      </View>
      <Text style={[styles.text0, {marginLeft: 0}]}>Overview</Text>
      <Text
        style={[
          styles.text1,

          {
            // width: responsiveWidth(80),
            fontSize: responsiveFontSize(1.75),
            textAlign: 'justify',
            marginBottom: 0,
          },
        ]}>
        {data.overview}
      </Text>

      <Text style={[styles.text0, {marginLeft: 0}]}>Accommodation Hotel</Text>
      <Text
        style={[
          styles.text1,

          {
            width: responsiveWidth(88),
            fontSize: responsiveFontSize(1.75),
            textAlign: 'justify',
            marginBottom: 0,
          },
        ]}>
        {data['Accommodation Hotel']}
      </Text>
      <Text style={[styles.text0, {marginLeft: 0}]}>Program Detail</Text>
      <Text
        style={[
          styles.text1,

          {
            width: responsiveWidth(80),
            fontSize: responsiveFontSize(1.75),
            textAlign: 'justify',
            marginBottom: 0,
          },
        ]}>
        {data['Program Detail'] != null && data['Program Detail'].length > 250
          ? status
            ? data['Program Detail']
            : data['Program Detail'].substring(0, 250)
          : data['Program Detail']}
      </Text>

      {data['Program Detail'] ? (
        <Pressable
          style={{flexDirection: 'row'}}
          onPress={() => setStatus(!status)}>
          <Text style={[styles.text1, {color: 'green'}]}>
            {data['Program Detail'] != null &&
            data['Program Detail'].length > 250
              ? status
                ? ' Show More Details'
                : 'Hide More Details'
              : ' '}
          </Text>
        </Pressable>
      ) : (
        <View style={{display: 'none'}}></View>
      )}
    </View>
  );

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.row0}>
          <Icon
            name="arrow-back"
            type="material"
            color="black"
            size={20}
            onPress={() => navigation.goBack(null)}
          />
          <MenuPop navigation={navigation} item={data} retreatid={retreatid} />
        </View>
        <Text style={styles.text0}>Ratreat Details</Text>

        <ScrollView
          showsVerticalScrollIndicator={false} // Hide vertical scrollbar
          showsHorizontalScrollIndicator={false}>
          <RenderItem />
          <RetreatDetail navigation={navigation} item={data} />
        </ScrollView>
      </View>
    </MenuProvider>
  );
};

export const MenuPop = ({navigation, item, retreatid}: any) => {
  const [loading, setLoading] = useState(false);
  const [status1, setStatus1] = useState('');

  console.log('ii', retreatid, item, 'data');
  const dispatch = useDispatch();
  dispatch(setRetreatId(retreatid));
  const PressView = (item: any) => {
    console.log(item, 'item');
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditRetreatScreen',
        params: {
          Retreatdata: item,
          retreatid: retreatid,
        },
      }),
    );
  };

  const distableFun = async (res: number) => {
    console.log(res, 'row');

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
                `user-retreat-status?id=${retreatid}`,
                row,
              );
              console.warn(response.data, 'ds1');
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

  const NavFun = screen => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RetreatTopNavigator',
        params: {
          retreatid: retreatid,
          screen: screen,
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
          <Pressable onPress={() => NavFun('Booking')}>
            <Text style={styles.menuText}>Bookings</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun('Lead')}>
            <Text style={styles.menuText}>Leads</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun('FollowUp')}>
            <Text style={styles.menuText}>Follow ups</Text>
          </Pressable>
        </MenuOption>

        <MenuOption>
          <Pressable onPress={() => NavFun('Student')}>
            <Text style={styles.menuText}>Student</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          {status1 === 2 ? (
            <Pressable onPress={() => distableFun(1)}>
              <Text style={styles.menuText}>Enable</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => distableFun(2)}>
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
    width: wp('100%'),
    height: hp('100%'),
    paddingBottom: 0,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
  },

  row0: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  title: {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.1),
    marginBottom: 15,
  },
  name: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.3),
    marginBottom: 5,
  },
  text0: {
    width: responsiveWidth(60),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 10,
  },
  text1: {
    width: responsiveWidth(85),
    flexWrap: 'wrap',
    textAlign: 'left',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
    letterSpacing: 1,
    color: 'black',
  },
  textOpt: {
    // flexWrap: 'wrap',
    // textAlign: 'left',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
    letterSpacing: 1,
    color: 'black',
  },
  card: {
    width: responsiveWidth(95),
    backgroundColor: 'white',
    padding: 8,
    paddingBottom: 0,
    marginBottom: 20,
    borderLeftWidth: 0.1,
    // borderStartWidth:0.1,
    borderRightWidth: 0.1,
    marginTop: 10,
    alignSelf: 'center',
    // alignItems:'center'
  },
  image: {
    height: responsiveHeight(20),
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,

  },
  row1: {
    width: responsiveWidth(50),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',

    // marginBottom: 10,
  },
  rowSpace: {
    width: 18,
  },

  text: {
    width: responsiveWidth(65),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    marginLeft:5
  },
  rowGap: {
    flexDirection: 'row',
    gap: 10,
  },
  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  btn: {
    width: responsiveWidth(21),
    height: responsiveHeight(3.8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 5.5,
    opacity: 55,
    borderRadius: 8,
    color: 'black,',
  },
  text2: {
    color: 'black',
    fontFamily: 'Roboto-regular',
    fontSize: 20,
    marginBottom: 0,
  },

  text3: {
    width: responsiveWidth(83),
    marginBottom: 0,
    textAlign: 'justify',
    flexWrap: 'wrap',
    color: 'black',
    fontWeight: '500',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.6),
    letterSpacing: 0.7,
  },

  //MENU Pop
  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },
  tabBottom: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default RetreatUserDetailScreen;
