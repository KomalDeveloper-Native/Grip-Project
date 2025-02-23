/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {getMethod, getStorageData} from '../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {bg} from 'date-fns/locale';
import AppBarSearch from '../../Component/AppBarSearch';
import {ActivityIndicator, Card} from 'react-native-paper';
import {Yoga, Meditation, Human} from '@flaticon/flaticon-uicons';
import TrainerReview from './TrainerReview';
import ArrowIcon from '../../Component/ArrowIcon';

interface Props {}
const TrainerScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState(false);
  const [results, setResults] = useState(null);
  const {Trainer_id, Trainer} = route.params;
  const [userid, setUserid] = useState(null);
  console.log(Trainer_id, 'tr');

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    TrainerDetails(); // re-fetch the data
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      TrainerDetails();
    }, [Trainer_id, Trainer]),
  );

  const TrainerDetails = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    setUserid(id);
    try {
      setLoading(true);
      const response: any = await getMethod(`trainer-detail?id=${Trainer_id}`);
      if (response.status === 200) {
        setData(response.data);
        console.log(response.data, 'response.data1');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const renderStars = rating => {
    const stars = [];

    // Cap the rating at 5 for display purposes
    const cappedRating = Math.min(rating, 5);
    const fullStars = Math.floor(cappedRating);
    const hasHalfStar = cappedRating > fullStars;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Icon key={i} name="star" type="material" color="orange" size={15} />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
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

  const handlePress = data => {
    const url = data;
    console.log('URL:', data); // Debugging
    if (data.length > 0) {
      Linking.openURL(url).catch(err =>
        Alert.alert('Error', "Couldn't load page"),
      );
    }
  };

  if (loading) {
    return <ActivityIndicator size={20} color="black" />;
  }

  let bg = 'white';
  return (
    <>
      <ArrowIcon iconName={'arrow-back'} navigation={navigation} />
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {data && (
            <>
              <Image
                source={{uri: data.trainer['user image']}}
                style={styles.image}
              />
              <View style={styles.content}>
                <View>
                  <Text style={styles.name}>{data.trainer.name}</Text>
                  <Text style={styles.title}>
                    {data.trainer['studio name']}
                  </Text>
                </View>
                <View style={{width: 80}}>
                  <Text style={styles.name}>
                    {renderStars(data.trainer.review.averageRating)}
                  </Text>
                  <Text
                    style={[
                      styles.title,
                      {
                        marginLeft: responsiveWidth(1.74),
                      },
                    ]}>
                    Reviews ({data.trainer.review.reviewCount})
                  </Text>
                </View>
              </View>
              <View style={[styles.row, {marginBottom: 20}]}>
                <Pressable onPress={() => handlePress(data.trainer.instagram)}>
                  <Icon
                    name="logo-instagram"
                    type="ionicon"
                    color="#E4405F"
                    onPress={() => console.log('Instagram pressed')}
                  />
                </Pressable>

                <Pressable onPress={() => handlePress(data.trainer.facebook)}>
                  <Icon name="logo-facebook" type="ionicon" color="#3b5998" />
                </Pressable>

                <Pressable onPress={() => handlePress(data.trainer.youtube)}>
                  <Icon
                    name="logo-youtube"
                    type="ionicon"
                    color="#FF0000"
                    onPress={() => console.log('YouTube pressed')}
                  />
                </Pressable>
                <Pressable onPress={() => handlePress(data.trainer.linkedin)}>
                  <Icon
                    name="logo-linkedin"
                    type="ionicon"
                    color="#0077B5"
                    onPress={() => console.log('LinkedIn pressed')}
                  />
                </Pressable>
              </View>
              {data.trainer.about && (
                <>
                  <View style={styles.row}>
                    <Icon name="person" size={20} />
                    <Text style={styles.name}></Text>
                  </View>
                  <Text style={styles.text}>{data.trainer.about}</Text>
                </>
              )}
              {data.trainer.location && (
                <>
                  <View style={styles.row}>
                    <Icon
                      name="location-pin"
                      type="entypo"
                      size={20}
                      color={'red'}
                    />
                    <Text style={styles.name}>Location</Text>
                  </View>
                  <Text style={styles.text}>{data.trainer.location}</Text>
                </>
              )}

              {data.trainer.certification && (
                <>
                  <View style={styles.row}>
                    <Icon
                      name="award"
                      type="font-awesome-5"
                      // type="fontAwesome"
                      color="black"
                      size={20}
                      onPress={() => console.log('Certificate icon pressed')}
                    />
                    <Text style={styles.name}>Certifications</Text>
                  </View>
                  <ScrollView style={styles.conainer1} horizontal>
                    <Image
                      source={{uri: data.trainer.certification}}
                      style={styles.image0}
                    />
                  </ScrollView>
                </>
              )}

              {data.trainer.Skills && (
                <>
                  <View style={styles.row}>
                    <Icon
                      name="award"
                      type="font-awesome-5"
                      color="black"
                      size={20}
                    />
                    <Text style={styles.name}>Skills</Text>
                  </View>
                  <Text style={styles.text}>{data.trainer.Skills}</Text>
                </>
              )}

              {data.courses.length > 0 ? (
                <View style={styles.row}>
                  <Icon
                    name="book-outline"
                    size={20}
                    color="#000"
                    type="material-community"
                  />
                  <Text style={styles.name}>Courses</Text>
                </View>
              ) : null}
              <ScrollView horizontal style={{marginBottom: 0}}>
                {data.courses.map((item: any) => (
                  <Card style={styles.scrollSlide} key={item.id}>
                    <Image source={{uri: item.image}} style={styles.image3} />

                    <Text
                      style={[
                        styles.text,
                        {
                          marginBottom: 0,
                          width: '75%',
                          fontSize: responsiveFontSize(2),
                          letterSpacing: 1.5,
                          fontFamily: 'Roboto-Medium',
                        },
                      ]}>
                      {item.title}
                    </Text>
                    <Text style={styles.text3}>{item.address}</Text>
                    <View style={styles.row3}>
                      <Text style={styles.text4}>
                        {item.morning_time} {item.evening_time}
                      </Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text>{renderStars(item.review.averageRating)}</Text>
                      <Text style={styles.review}>
                        Reviews ({item.review.reviewCount})
                      </Text>
                    </View>
                  </Card>
                ))}
              </ScrollView>
              {data.retreats.length > 0 ? (
                <View style={styles.row}>
                  <Icon
                    name="store"
                    size={20}
                    color="#000"
                    type="material-community"
                  />
                  <Text style={styles.name}>Retreat</Text>
                </View>
              ) : null}

              <ScrollView horizontal style={{marginBottom: 10}}>
                {data.retreats.map((item: any) => (
                  <Card style={styles.scrollSlide} key={item.id}>
                    {item.image ? (
                      <Image source={{uri: item.image}} style={styles.image3} />
                    ) : null}

                    <Text
                      style={[
                        styles.text,
                        {
                          marginBottom: 0,
                          width: '75%',
                          fontSize: responsiveFontSize(2),
                          letterSpacing: 1.5,
                          fontFamily: 'Roboto-Medium',
                        },
                      ]}>
                      {item.title}
                    </Text>
                    <Text style={styles.text3}>{item.address}</Text>
                    <View>
                      <Text style={styles.text3}>
                        Group Size {item.group_size}
                      </Text>
                    </View>
                    <View style={styles.row3}>
                      <Text style={styles.text4}>
                        {item.morning_time} {item.evening_time}
                      </Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text>
                        {renderStars(item.review.averageRating !== 'undefined')}
                      </Text>
                      <Text style={styles.review}>
                        Reviews ({item.review.reviewCount})
                      </Text>
                    </View>
                  </Card>
                ))}
              </ScrollView>
              {data.blogs.length > 0 ? (
                <View style={styles.row}>
                  <Icon
                    name="store"
                    size={20}
                    color="#000"
                    type="material-community"
                  />
                  <Text style={styles.name}>Blogs</Text>
                </View>
              ) : null}

              <ScrollView horizontal style={{marginBottom: 10}}>
                {data.blogs.map((item: any) => (
                  <Card style={styles.scrollSlide} key={item.id}>
                    <Image source={{uri: item.image}} style={styles.image3} />
                    <View
                      style={{
                        width: responsiveWidth(70),
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.text,
                          {
                            width: '100%',
                            textAlign: 'justify',
                            fontSize: responsiveFontSize(1.9),
                            letterSpacing: 1.5,
                            fontFamily: 'Roboto-Medium',
                            marginBottom: 10,
                          },
                        ]}>
                        {item.title}
                      </Text>
                      <Text style={styles.text3}>{item.short_description}</Text>
                    </View>
                  </Card>
                ))}
              </ScrollView>

              {data.blogs.length > 0 ? (
                <View style={styles.row}>
                  <Icon name="briefcase" type="entypo" size={20} color="#000" />
                  <Text style={styles.name}>Job Opening</Text>
                </View>
              ) : null}
              <ScrollView horizontal style={{marginBottom: 10}}>
                {data.jobData.map((item: any) => (
                  <Card style={styles.scrollSlide} key={item.id}>
                    <View
                      style={{
                        width: responsiveWidth(70),
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.text,
                          {
                            width: '100%',
                            textAlign: 'justify',
                            fontSize: responsiveFontSize(1.9),
                            letterSpacing: 1.5,
                            fontFamily: 'Roboto-Medium',
                            // marginBottom: 10,
                          },
                        ]}>
                        {item.title}
                      </Text>
                      <View>
                        <Text style={styles.text3}>{item.location}</Text>
                        <Text style={styles.text3}>{item.type}</Text>

                        <Text style={[styles.text3, {marginBottom: 0}]}>
                          {item.shift}
                        </Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </ScrollView>
              {data.franchises.length > 0 ? (
                <View style={styles.row}>
                  <Icon
                    name="store"
                    size={20}
                    color="#000"
                    type="material-community"
                  />
                  <Text style={styles.name}> Franchise Opportunities</Text>
                </View>
              ) : null}

              <ScrollView horizontal style={{marginBottom: 10}}>
                {data.franchises.map((item: any) => (
                  <Card style={styles.scrollSlide} key={item.id}>
                    {item.image ? (
                      <Image source={{uri: item.image}} style={styles.image3} />
                    ) : null}
                    <View
                      style={{
                        width: responsiveWidth(70),
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.text,
                          {
                            width: '100%',
                            textAlign: 'justify',
                            fontSize: responsiveFontSize(1.7),
                            letterSpacing: 1.5,
                            fontFamily: 'Roboto-Medium',
                            // marginBottom: 10,
                          },
                        ]}>
                        {item.space}
                      </Text>
                      <Text style={styles.text3}>{item.investment}</Text>
                    </View>
                  </Card>
                ))}
              </ScrollView>
            </>
          )}
        </ScrollView>
        <TrainerReview navigation={navigation} Trainer_id={Trainer_id} />

        {data ? (
          userid === Trainer_id ? null : (
            <>
              <Pressable
                style={[styles.tabBottom, {backgroundColor: 'orange'}]}
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'AddTrainerReview',
                      params: {
                        Trainer_id: Trainer_id,
                        Trainer: data.trainer,
                      },
                    }),
                  )
                }>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Roboto-Medium',
                    fontSize: responsiveFontSize(2),
                  }}>
                  Write A Review
                </Text>
              </Pressable>
            </>
          )
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 10,
    paddingHorizontal: 15,
    // alignItems: 'flex-start',
  },
  image: {
    width: responsiveWidth(90),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    alignItems: 'center',
    marginBottom: 20,
  },
  image0: {
    width: responsiveWidth(70),
    height: responsiveHeight(20),
    alignItems: 'center',
  },
  content: {
    width: responsiveWidth(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 5,
    marginLeft: 5,
  },
  title: {
    width: responsiveWidth(68),
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(1.8),
  },
  name: {
    width: responsiveWidth(68),

    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2),
  },
  row: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'flex-start',
  },
  conainer1: {
    flexDirection: 'row',
    // marginBottom: 10,
    marginHorizontal: 15,
  },
  conainer2: {
    marginHorizontal: 0,
  },
  scrollSlide: {
    width: responsiveWidth(75),
    backgroundColor: 'white',
    marginBottom: 20,
    marginTop: 10,
    padding: 10,

    marginRight: 10,
    marginLeft: 5,
  },
  image3: {
    width: responsiveWidth(70),
    height: responsiveHeight(20),
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 10,
  },

  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  text2: {
    width: responsiveWidth(88),
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(2.1),
    alignSelf: 'center',
  },
  text3: {
    width: responsiveWidth(68),

    fontFamily: 'Roboto-Regular',
    color: 'black',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
  },
  text4: {
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(1.9),
  },
  review: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Regular',
  },
  tabBottom: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default TrainerScreen;
