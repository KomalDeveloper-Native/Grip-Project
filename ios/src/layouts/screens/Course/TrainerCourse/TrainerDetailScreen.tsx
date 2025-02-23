/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
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

  console.log(course_id, 'uerids');
  useFocusEffect(
    useCallback(() => {
      CourseListDetail();
    }, []),
  );

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
    <Card style={styles.card}>
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
            // alignItems: 'flex-start',
            marginBottom: 0,
          },
        ]}>
        <View style={{flexDirection: 'row', gap: 15}}>
          <Icon
            name="yoga"
            type="material-community"
            color={'black'}
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text}> {data.name}</Text>
        </View>
        <View>
          <Text> {renderStars(data.fullstar)}</Text>
          <Text style={styles.review}> Reviews ({data.totalreview})</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Icon
          name="yoga"
          type="material-community"
          color={'black'}
          size={15}
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
          color={'red'}
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
            color="#FFA500"
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}>{data.created_at}</Text>
        </View>
      ) : null}
      {(data.morning_timing && /\d/.test(data.morning_timing)) 
       ? (
        <View style={styles.row}>
          <Icon
            name="wb-sunny"
            type="material"
            color="#FFA500"
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
            color="#778899"
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
            color={'gray'}
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
    </Card>
  );

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
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.text0}>Courses</Text>
          <RenderItem />
          <TrainingDetail navigation={navigation} item={data} Coursedata={true}/>
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

  const NavFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TopNavigation',
        params: {
          courseid: course_id,
        },
      }),
    );
  };

  const distableFun = async (res: number) => {
    console.log(res, 'row',course_id);

    // Show confirmation dialog
    Alert.alert(
      'Confirmation',
      'Are you sure you want to ?',
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
                id: course_id,
                status: res,
              };
              setStatus1(res);

              const response: any = await postMethod('course-status', row);
              console.log(response.data, 'ds');

              if (response.status === 200) {
                console.log(response.data, 'ds');
              } else {
                console.log(response, '500');
                // Handle error cases here if needed
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

      <MenuOptions>
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
          <Pressable onPress={() => NavFun('FollowUp')}>
            <Text style={styles.menuText}>Follow Ups</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun('Student')}>
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
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
    letterSpacing: 1,
  },
  card: {
    width: responsiveWidth(88),
    backgroundColor: 'white',
    padding: 15,
    paddingBottom: 0,
    marginBottom: 20,
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
    color: 'black',
    fontFamily: 'Roboto-Bold',
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

export default TrainerDetailScreen;
