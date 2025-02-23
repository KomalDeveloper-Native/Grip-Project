/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useMemo, useState} from 'react';
import {FC} from 'react';
import {Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import AppBarSearch from '../../Component/AppBarSearch';
import {Divider, Icon, Image, Slider} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {reactHooksModule} from '@reduxjs/toolkit/query/react';
import {useNavigation} from 'react-day-picker';
import {getMethod, getStorageData} from '../../../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setKyc} from '../../../Redux/ListSlice ';
import Swiper from 'react-native-swiper';
import {Button, Card} from 'react-native-paper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';

interface Props {}
const MenuScreen: FC<Props> = ({navigation}): JSX.Element => {
  const kyc = useSelector(state => state.List.kyc);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);

  const [data, setData] = useState([]);
  const [retreat, setRetreat] = useState([]);
  const [trainer, setTrainer] = useState([]);
  const [blog, setBlog] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await CousseList();
    await RetreatList();
    await TrainerList();
    await BlogList();
   setRefreshing(false);
  }, []);


  useFocusEffect(
    useCallback(() => {
      CousseList();
      RetreatList();
      TrainerList();
      BlogList();
    }, []),
  );

  const [userId, setUserId] = useState([]);

  useMemo(async () => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    setUserId(storage.response.user.id);
  }, [userId]);

  const CousseList = async () => {
    const storage = await getStorageData();
    console.log(storage.response, 'star');
    const getKyc = await AsyncStorage.getItem('kyc');
    if (storage.response.kyc === 1) {
      setStore(storage.response.kyc);
    }
    try {
      setLoading(true);
      const response: any = await getMethod('home-course-list');
      setData(response.data.data);
      console.log(response.data.data, 'kkk');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const RetreatList = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod('home-retreat-list');
      setRetreat(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const TrainerList = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod('home-trainer-list');
      if (response.status === 200) {
        setTrainer(response.data.response);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const BlogList = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod('home-blog-list');
      setBlog(response.data.response);
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

  const SentTo = (id: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseDetailScreen',
        params: {
          courseid: id,
        },
      }),
    );
  };

  const SentToTrainer = (item, id) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TrainerScreen',
        params: {
          Trainer_id: id,
          Trainer: item,
        },
      }),
    );
  };

  const SentToRetreat = (item, id) => {
    console.log(item, 'vff');
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RetreatDetailsScreen',
        params: {
          retreatid: id,
          userid: item.user_id,
          loginUser: userId,
        },
      }),
    );
  };

  let bg = '#D9D9D9';
  return (
    <View style={styles.container}>
      <AppBarSearch navigation={navigation} icon={'menu'} />
      <ScrollView
       refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        <View style={{marginBottom: -515}}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            dotStyle={styles.dot}
            dotColor="white"
            activeDotColor="black"
            activeDotStyle={styles.dotStyle}>
            <View style={styles.slide1}>
              <Image
                source={require('../../img/photol1.png')}
                style={styles.image}
              />
              <View style={styles.column}>
                {kyc || store ? null : (
                  <>
                    <Pressable
                      style={styles.btn}
                      onPress={() => navigation.navigate('StudioIdentity')}>
                      <Text style={styles.btnText}>
                        Are you a Yoga Trainer ?
                      </Text>
                    </Pressable>
                    <Pressable style={styles.btn1}>
                      <Text style={styles.btnText}>Subscribe Now</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
            <View style={styles.slide2}>
              <Image
                source={require('../../img/photol1.png')}
                style={styles.image}
              />
            </View>
            <View style={styles.slide3}>
              <Image
                source={require('../../img/photol1.png')}
                style={styles.image}
              />
            </View>
          </Swiper>
        </View>

        <View style={{marginBottom: -390}}>
          <Text style={styles.text}>Course</Text>
          <Pressable style={{marginTop: -10, marginBottom: 20}}>
            <Swiper
              style={styles.wrapper}
              autoplay={true}
              autoplayDirection={true}
              showsButtons={false}
              showsPagination={false}
              dotStyle={styles.dot}>
              {data.map(item => (
                <Pressable
                  style={styles.slide1}
                  key={item.id}
                  onPress={() => SentTo(item.id)}>
                  <Image
                    source={{uri: item.image}}
                    // source={require('../../img/photol1.png')}
                    style={styles.image2}
                  />

                  <Text
                    style={[
                      styles.text,
                      {
                        marginBottom: 0,
                        width: responsiveWidth(88),
                        fontSize: responsiveFontSize(2),
                        letterSpacing: 1.5,
                        alignSelf: 'center',
                      },
                    ]}>
                    {item.title}
                  </Text>
                  <View style={styles.row}>
                    <Text style={[styles.review, {width: responsiveWidth(65)}]}>
                      {item.address}
                    </Text>
                    <View>
                      <Text style={{marginLeft: -5}}>
                        {renderStars(item.review.fullStars)}
                      </Text>
                      <Text style={styles.review}>
                        Reviews ({item.review.reviewCount})
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.text2}>
                    {item.morning_time ? `Morning ${item.morning_time}` : null}
                  </Text>
                </Pressable>
              ))}
            </Swiper>
          </Pressable>
        </View>
        <View style={{marginBottom: -330}}>
          <Text style={[styles.text, {marginBottom: 10}]}>Retreats</Text>
          <Pressable style={{marginBottom: 10}}>
            <Swiper
              style={styles.wrapper}
              showsButtons={false}
              showsPagination={false}
              autoplay={true}
              autoplayDirection={true}>
              {retreat.map(item => (
                <Pressable
                  style={styles.slide1}
                  key={item.id}
                  onPress={() => SentToRetreat(item, item.id)}>
                  <Card style={styles.card}>
                    <Card.Cover source={{uri: item.image}} />
                    {/* <Card.Title title="Card Title" subtitle="Card Subtitle"  /> */}
                    <Card.Content style={styles.row1}>
                      <Text style={styles.title}>{item.title}</Text>
                      <View>
                        <Text style={{marginLeft: -5}}>
                          {renderStars(item.review.fullStars)}
                        </Text>
                        <Text style={styles.review}>
                          Reviews ({item.review.reviewCount})
                        </Text>
                      </View>
                    </Card.Content>
                    <Card.Content
                      style={[
                        styles.row1,
                        {
                          gap: 15,
                          justifyContent: 'flex-start',
                          marginTop: 10,
                          marginBottom: 10,
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 5,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Icon name="groups" size={25} color={'black'} />
                        <Text
                          style={[
                            styles.review,
                            {fontFamily: 'Roboto-Regular'},
                          ]}>
                          {item['group size']} Person
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 5,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Icon
                          name="calendar"
                          type="font-awesome"
                          size={15}
                          color={'black'}
                        />
                        <Text
                          style={[
                            styles.review,
                            {fontFamily: 'Roboto-Regular'},
                          ]}>
                          {item['no of days']} Days
                        </Text>
                      </View>
                    </Card.Content>
                    <Card.Content
                      style={[
                        styles.row1,
                        {width: responsiveWidth(90), marginBottom: 0},
                      ]}>
                      <Card.Actions style={{marginLeft: -15}}>
                        <Button>Book Now</Button>
                      </Card.Actions>
                      <Text style={styles.review}>
                        From
                        <Text
                          style={[styles.review, {fontFamily: 'Roboto-Bold'}]}>
                          {''} ₹{item['price']}
                        </Text>
                      </Text>
                    </Card.Content>
                  </Card>
                </Pressable>
              ))}
            </Swiper>
          </Pressable>
        </View>
        <View style={{marginBottom: 0, marginTop: 15}}>
          <Text style={[styles.text, {marginBottom: 10}]}>Trainers</Text>

          <ScrollView horizontal style={{marginBottom: 10, minWidth: 250}}>
            {trainer.map(item => (
              <Pressable
                style={styles.scrollSlide}
                key={item.id}
                onPress={() => SentToTrainer(item, item.id)}>
                <Image
                  source={{uri: item['user image']}}
                  style={styles.image3}
                />
                <View style={{height: 40, width: '100%', marginBottom: 10}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        width: '80%',
                        fontSize: responsiveFontSize(2),
                        letterSpacing: 1.5,
                        marginBottom: -1,
                      },
                    ]}>
                    {item['trainer name']}
                  </Text>
                  <Text style={styles.text3}>Instructor</Text>
                </View>

                <View style={styles.row3}>
                  <Icon name="person" size={25} />
                  <Text style={styles.text4}>
                    No of course {item['no of course']}
                  </Text>
                </View>
                <View style={styles.row3}>
                  <Text>{renderStars(item.rating.fullStars)}</Text>
                  <Text style={styles.review}>
                    Reviews ({item.rating.reviewCount})
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <Image
            style={styles.image4}
            source={require('../../img/photol1.png')}
          />
          <ScrollView horizontal style={{marginBottom: 10, marginTop: 20}}>
            {blog.map(item => (
              <Pressable style={[styles.scrollSlide, {width: 'none'}]}>
                <Image source={{uri: item.image}} style={styles.image5} />
                <View style={styles.bg}>
                  <Text style={styles.blogTitle}>{item.name}</Text>
                  <Text style={styles.blogSub}>
                    {item['short descrtption']}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    width: responsiveWidth(88),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: 7,
  },
  row1: {
    width: responsiveWidth(90),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 10,
    // marginBottom:7
  },
  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  image: {
    width: responsiveWidth(95),
    height: responsiveHeight(25),
    // resizeMode: 'cover',
    borderRadius: 10,
  },

  image2: {
    width: responsiveWidth(95),
    height: responsiveHeight(24),
    resizeMode: 'cover',
    borderRadius: 30,
    marginBottom: 10,
  },
  image3: {
    width: responsiveWidth(45),
    height: responsiveHeight(20),
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  image4: {
    width: '100%',
    height: responsiveHeight(27),
    resizeMode: 'cover',
  },
  image5: {
    width: responsiveWidth(40),
    height: responsiveHeight(20),
    resizeMode: 'cover',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  bg: {
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  blogTitle: {
    flexWrap: 'wrap',
    color: 'black',
    width: responsiveWidth(65),
    maxHeight: responsiveHeight(20),
    fontSize: responsiveFontSize(2),
    letterSpacing: 1.5,
    fontFamily: 'Roboto-Medium',
  },
  blogSub: {
    fontFamily: 'Roboto-Regular',
    flexWrap: 'wrap',
    color: 'black',
    width: responsiveWidth(65),
    maxHeight: responsiveHeight(20),

    fontSize: responsiveFontSize(1.7),
    letterSpacing: 1,
  },
  column: {
    flexDirection: 'column',
    textAlign: 'left',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    marginTop: -70,
    marginHorizontal: 30,
  },
  btn: {
    width: responsiveWidth(47),
    height: responsiveHeight(4),
    backgroundColor: 'black',
    borderRadius: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
    color: 'white',
  },
  btn1: {
    width: responsiveWidth(47),
    height: responsiveHeight(4),
    alignItems: 'flex-start',
    backgroundColor: '#55555',
    borderRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  btnText: {
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },

  // Course Swiper
  wrapper: {
    // width:'100%',
    // alignItems:'center',
    // marginTop:999
  },
  dot: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: -1055,
    borderRadius: 10,
  },
  dotStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: -1055,
    color: 'white',
    width: 12,
    height: 12,
    borderRadius: 10,
  },
  slide1: {
    justifyContent: 'center',

    alignItems: 'center',
  },
  slide2: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  slide3: {
    justifyContent: 'flex-end',

    alignItems: 'center',
  },
  text: {
    width: responsiveWidth(95),

    color: 'black',
    fontSize: responsiveFontSize(2.6),
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'center',
    marginBottom: 20,
  },
  card: {
    width: responsiveWidth(95),
    height: responsiveHeight(55.9),
    backgroundColor: 'white',
    padding: 5,
    paddingBottom: 0,
    marginBottom: 45,
    alignSelf: 'center',
  },
  title: {
    color: 'black',
    flexWrap: 'wrap',
    width: responsiveWidth(55),
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Medium',

    letterSpacing: 1.1,
    textAlign: 'justify',
  },
  text2: {
    width: responsiveWidth(88),
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(2.1),
    alignSelf: 'center',
  },
  text3: {
    width: '75%',
    fontFamily: 'Roboto-Regular',
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    alignSelf: 'center',
  },
  text4: {
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(1.9),
    alignSelf: 'center',
  },

  review: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Regular',
  },
  scrollSlide: {
    width: responsiveWidth(50),
    marginTop: -12,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
});

export default MenuScreen;
