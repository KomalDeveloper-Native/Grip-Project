/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable semi */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, {useCallback, useMemo, useState} from 'react';
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
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';
import colors from '../../../style/colors';
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
import TrainingDetail from './TrainingDetail';
import EditCourse from '../EditCourse/EditCourse';
import {useDispatch, useSelector} from 'react-redux';
import {setCourseId, setId} from '../../../../Redux/ListSlice ';
import {Screen} from 'react-native-screens';
import Snackbar from 'react-native-snackbar';

interface Props {
  navigation: any;
}
const TrainerDetailScreen: FC<Props> = ({
  navigation,
  route,
}: any): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(false);
  const [first, setFirst] = useState(null);
  const [last, setLast] = useState(null);
  const {course_id} = route.params;
  useFocusEffect(
    useCallback(() => {
      CourseListDetail();
    }, [data]),
  );

  useMemo(() => {
    return data;
  }, []);

  const CourseListDetail = async () => {
    const storage = await getStorageData();
    try {
      setLoading(true);
      const response: any = await getMethod(`course-detail/?id=${course_id}`);
      if (response.status === 200) {
        setData(response.data);
        console.log(response.data, 'drx');
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
        source={{uri: data.select_image}}
        style={styles.image}
        resizeMode="contain"
      />
      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 5,
          },
        ]}>
        <View style={{flexDirection: 'row', gap: 15}}>
          <Text style={styles.text}>{data.name}</Text>
        </View>
        <View>
          <Text>{renderStars(data.fullstar)}</Text>
          <Text style={styles.review}>Reviews({data.totalreview})</Text>
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
          <Text style={styles.name}>With {data.trainer}</Text>
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
      {data.created_at ? (
        <View style={styles.row}>
          <Icon
            name="calendar"
            type="font-awesome"
            color="black"
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}>{data.created_at}</Text>
        </View>
      ) : null}
      {data.morning_timing && /\d/.test(data.morning_timing) ? (
        <View style={styles.row}>
          <Icon
            name="wb-sunny"
            type="material"
            color="black"
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}>
            {data.morning_days} || {data.morning_timing}
          </Text>
        </View>
      ) : null}
      {data.evening_timing && /\d/.test(data.evening_timing) ? (
        <View style={styles.row}>
          <Icon
            name="moon"
            type="feather"
            color="black"
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}>
            {data.evening_days} || {data.evening_timing}
          </Text>
        </View>
      ) : null}
      {data.price ? (
        <View style={styles.row}>
          <Icon
            name="currency-inr"
            type="material-community"
            color={'black'}
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}>{data.price}/Month </Text>
        </View>
      ) : null}

      <Text
        style={[
          styles.text1,

          {
            width: responsiveWidth(79),
            fontSize: responsiveFontSize(2),
            textAlign: 'justify',
            marginBottom: 0,
          },
        ]}>
        {data.description != null && data.description.length > 250
          ? status
            ? data.description
            : data.description.substring(0, 250)
          : data.description}
      </Text>

      {data.description ? (
        <Pressable
          style={{flexDirection: 'row'}}
          onPress={() => setStatus(!status)}>
          <Text style={[styles.text1, {color: 'green'}]}>
            {data.description != null && data.description.length > 250
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
          <View style={{flexDirection: 'row',alignItems:'center'}}>
            <Icon
              name="notifications"
              type="material"
              color="black"
              size={20}
            />
            <MenuPop
              navigation={navigation}
              item={data}
              course_id={course_id}
            />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false} // Hide vertical scrollbar
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.text0}>Course Details</Text>
          <RenderItem />
          <TrainingDetail
            navigation={navigation}
            item={data}
            Coursedata={true}
          />
        </ScrollView>
      </MenuProvider>
    </View>
  );
};

export const MenuPop = ({navigation, item, course_id}: any) => {
  const [loading, setLoading] = useState(false);
  const [status1, setStatus1] = useState('');

  console.log('ii', course_id, item, 'data');
  const dispatch = useDispatch();
  dispatch(setCourseId(course_id));
  const PressView = (item: any) => {
    console.log(item, 'item');
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditCourse',
        params: {
          course: item,
        },
      }),
    );
  };

  const NavFun = screen => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TopNavigation',
        params: {
          courseid: course_id,
          screen: screen,
        },
      }),
    );
  };

  const distableFun = async (res: number) => {
    const data = res === 1 ? 'Enable' : 'Disable';

    // Show confirmation dialog
    Alert.alert(
      '',
      `Are you sure you want to ${data} Course?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            try {
              const row = {id: course_id, status: res};
              const response: any = await postMethod('course-status', row);

              if (response.data.success) {
                setStatus1(res);
                Snackbar.show({
                  text:
                    data === 'Enable'
                      ? 'Your course has been successfully enabled! 🎉'
                      : 'Your course has been successfully disabled. You can enable it anytime! ⚠️',
                  duration: 1000,
                  textColor: colors.white,
                  backgroundColor: data === 'Enable' ? 'green' : 'red',
                });
              } else {
                // Handle error response
                Snackbar.show({
                  text: 'Failed to update course status. Please try again later.',
                  duration: 1000,
                  textColor: colors.white,
                  backgroundColor: 'red',
                });
              }
            } catch (error) {
              console.error('Failed to update course status:', error);
              Snackbar.show({
                text: 'An error occurred. Please try again.',
                duration: 1000,
                textColor: colors.white,
                backgroundColor: 'red',
              });
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
        <Icon name="more-vert" type="material" color="black" size={25 } />
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
        <View>
          <MenuOption>
            <Pressable onPress={() => PressView(item)}>
              <Text style={styles.menuText}>Edit</Text>
            </Pressable>
          </MenuOption>
          <MenuOption>
            <Pressable onPress={() => NavFun('SubscriptionList')}>
              <Text style={styles.menuText}>Subscription</Text>
            </Pressable>
          </MenuOption>
          <MenuOption>
            <Pressable onPress={() => NavFun('LeadList')}>
              <Text style={styles.menuText}>Leads</Text>
            </Pressable>
          </MenuOption>
          <MenuOption>
            <Pressable onPress={() => NavFun('FollowUpScreen')}>
              <Text style={styles.menuText}>Follow Ups</Text>
            </Pressable>
          </MenuOption>
          <MenuOption>
            <Pressable onPress={() => NavFun('StudeName')}>
              <Text style={styles.menuText}>Students</Text>
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
        </View>
      </MenuOptions>
    </Menu>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    padding: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  row0: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: responsiveFontSize(2.2),
    marginBottom: 5,
  },
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    marginBottom: 5,
    marginLeft: 10,
    marginTop: 10,
  },
  text1: {
    width: responsiveWidth(73),
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 0,
  },
  card: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    paddingBottom: 0,
    borderLeftWidth: 0.1,
    // borderStartWidth:0.1,
    borderRightWidth: 0.1,
    marginTop: 10,
    alignSelf: 'center',
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
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  row1: {
    flexDirection: 'row',
    gap: 63,
    marginBottom: 10,
  },
  rowSpace: {
    width: 18,
  },

  text: {
    width: responsiveWidth(65),
    fontSize: responsiveFontSize(1.76),
    color: 'black',
    fontFamily: 'Roboto-Bold',
    textAlign:'justify'
  },

  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginLeft: 8.5,
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

  //MENU Pop
  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },

  custom: {
    padding: 10,
  },
});

export default TrainerDetailScreen;
