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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import TrainingDetail from '../TrainerCourse/TrainingDetail';
import CustomerReview from './CustomerReview';

interface Props {}
const CourseDetailScreen: FC<Props> = ({
  navigation,
  route,
}: any): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(false);

  const {courseid, course} = route.params;

  console.log(courseid, 'uerids');
  useFocusEffect(
    useCallback(() => {
      CourseList();
    }, []),
  );

  const CourseList = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod(`course-detail/?id=${courseid}`);
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
    console.log(rating, 'rate');
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Icon key={i} name="star" type="material" color="orange" size={15} />,
        );
      } else if (i - 0.8 <= rating) {
        stars.push(
          <Icon
            key={i}
            name="star-half"
            type="material"
            color="orange"
            size={15}
          />,
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name="star-outline"
            type="material"
            color="orange"
            size={15}
          />,
        );
      }
    }
    return stars;
  };

  const optFunction = async (item: never[]) => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    console.log(login_user);
    setLoading(true);
    try {
      const row = {
        loginuser: login_user,
        user: item.user_id,
        course_id: item.id,
      };
      console.log(row, item);
      const response: any = await postMethod('optnow', row);
      console.log(response.data, 'res');
      if (response.data.success === true) {
        await AsyncStorage.setItem('name', JSON.stringify(item.name));
        await AsyncStorage.setItem('opt', JSON.stringify(response.data));

        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        navigation.dispatch(
          CommonActions.navigate({
            name: 'ChatList',
          }),
        );
      } else {
        const emailErrors = response?.data?.errors?.email ?? [];
        const message = response?.data?.message ?? '';
        const errorMessage = [...emailErrors, message].join('\n');
        // Display in Snackbar
        Snackbar.show({
          text: errorMessage,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
    setLoading(false);
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
        <View style={styles.row}>
          <Icon
            name="yoga"
            type="material-community"
            color={'black'}
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text}>{data.name}</Text>
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
      {(data.morning_timing && /\d/.test(data.morning_timing)) ||
      data.morning_days ? (
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
      {/\d/.test(data.evening_timing) || data.morning_days ? (
        <View style={styles.row}>
          <Icon
            name="moon"
            type="feather"
            color="#778899"
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}>
            {data.evening_days} || {data.evening_timing}{' '}
          </Text>
        </View>
      ) : null}
      <View style={styles.row}>
        {data.price ? (
          <>
            <Icon
              name="currency-inr"
              type="material-community"
              color={'gray'}
              size={15}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{data.price}/Month</Text>
            </View>
          </>
        ) : null}
        <Pressable style={styles.btn} onPress={() => optFunction(data)}>
          <Text style={styles.textOpt}>Opt Now</Text>
        </Pressable>
      </View>

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
            size={20}
            onPress={() => navigation.goBack(null)}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false} // Hide vertical scrollbar
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.text0}>Courses</Text>

          <RenderItem />
          <TrainingDetail
            navigation={navigation}
            item={data}
            courseid={courseid}
            Coursedata={false}
          />

          <CustomerReview navigation={navigation} courseid={courseid} />
        </ScrollView>
        <Pressable
          style={styles.tabBottom}
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({
                name: 'ReviewDetailPage',
                params: {
                  courseid: courseid,
                  course: data,
                },
              }),
            )
          }>
            <Text style={{color: 'white', fontFamily: 'Roboto-Medium',fontSize:responsiveFontSize(2)}}>
              Write A Review
            </Text>
        </Pressable>
      </MenuProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    padding: 20,
    paddingBottom: 0,
    paddingHorizontal: 10,
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
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 10,
  },
  text1: {
    width: responsiveWidth(73.4),
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
    width: responsiveWidth(88),
    backgroundColor: 'white',
    padding: 10,
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
    color: 'black',
    fontFamily: 'Roboto-Bold',
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
    marginBottom: 10,
    marginLeft: 10,
  },
  tabBottom: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius:50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 1,
    borderColor:'white',
    borderWidth:2.5,
    position: 'static',
    marginBottom:10,
    alignSelf:'center'
  },
});

export default CourseDetailScreen;
