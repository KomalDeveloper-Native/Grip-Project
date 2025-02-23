/* eslint-disable quotes */
/* eslint-disable no-dupe-keys */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
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

import TrainerEvent from './TrainerEvent';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch} from 'react-redux';
import JobTopNavigation from '../../navigation/TabNavigation/JobTopNavigation';

interface Props {}
const TrainerEventDetailScreen: FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [store, setStore] = useState(null);
  const [store1, setStore1] = useState(null);
  const {eventId} = route.params;
  console.log(eventId, 'jkk');

  useFocusEffect(
    useCallback(() => {
      fetchEventDetail();
    }, []),
  );

  const fetchEventDetail = async () => {
    const storage = await getStorageData();
    try {
      setLoading(true);
      const response: any = await getMethod(`event-detail-user-specific?id=2`);
      if (response.status === 200) {
        setData(response.data.data);
      }
      console.log(response.data.data.review.averageRating, 'fdgf');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error1');
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

          <MenuPop navigation={navigation} item={data} eventId={eventId} />
        </View>

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
              alignItems: 'flex-start',
              // marginBottom: -5,
            },
          ]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.text}>{data.title}</Text>
          </View>
          <View>
            {/* <Text>{renderStars(data.review[0].fullStars)}</Text> */}
            {/* <Text style={styles.review}>
              Reviews ({data.review[0].reviewCount})
            </Text> */}
          </View>
        </View>
        {data.start_date || data.end_date ? (
          <View style={styles.row}>
            <Icon
              name="calendar"
              type="font-awesome"
              color="black"
              size={15}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>
              {data.start_date}-{data.end_date}
            </Text>
          </View>
        ) : null}

        <View style={styles.row}>
          {data.start_time || data.end_time ? (
            data.start_time ? (
              <>
                <Icon
                  name="clock-o"
                  type="font-awesome"
                  color="black"
                  size={15}
                  style={styles.rowSpace}
                />
                <Text style={styles.text1}>
                  {data.start_time}Am to {data.end_time}Pm
                </Text>
              </>
            ) : (
              <>
                <Icon
                  name="clock-o"
                  type="font-awesome"
                  color="black"
                  size={15}
                  style={styles.rowSpace}
                />
                <Text style={styles.text1}>{data.end_time}</Text>
              </>
            )
          ) : null}

          {/* <View style={styles.row1}>
            {/* <View>
            <Text></Text>
          </View> */}
            {/* <Icon
              name="check-circle"
              type="material"
              color={data.status === 'Active' ? 'green' : 'red'}
              size={25}
            />
          </View> */} 
        </View>

        <View style={[styles.row, {width: 100}]}>
          {data.venue ? (
            <>
              <Icon
                name="location-on"
                type="material"
                color={'red'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{data.venue}</Text>
            </>
          ) : null}

    
        </View>

        {/* <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
          <Text style={styles.title}>Job Details</Text>
          <Text
            style={[
              styles.title1,
              {fontFamily: 'Roboto-Regular', letterSpacing: 1},
            ]}>
            {data.job_description}
          </Text>
        </View> */}
        <TrainerEvent navigation={navigation} item={data} />
      </ScrollView>
    </MenuProvider>
  );
};

export const MenuPop = ({navigation, item, eventId}: any) => {
  const [loading, setLoading] = useState(false);
  const [status1, setStatus1] = useState('');

  console.log('ii', eventId, item, 'data');
  const dispatch = useDispatch();
  const PressView = (item: any) => {
    console.log(item, 'item');
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditJobScreen',
        params: {
          Jobdata: item,
          eventId: eventId,
        },
      }),
    );
  };

  const NavFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'JobTopNavigation',
        params: {
          eventId: eventId,
        },
      }),
    );
  };

  const distableFun = async (res: number) => {
    console.log(res, 'row', eventId);

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
                status: res,
              };
              setStatus1(res);

              const response: any = await postMethod(
                `user-job-status-update?id=${eventId}`,
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

      <MenuOptions>
        <MenuOption>
          <Pressable onPress={() => PressView(item)}>
            <Text style={styles.menuText}>Edit</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun()}>
            <Text style={styles.menuText}>Leads</Text>
          </Pressable>
        </MenuOption>

        <MenuOption>
          <Pressable onPress={() => NavFun()}>
            <Text style={styles.menuText}>Tickets</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun()}>
            <Text style={styles.menuText}>Follow Ups</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun()}>
            <Text style={styles.menuText}>Promote</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun()}>
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
  text: {
    width: responsiveWidth(68),
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.45),
  },
  image: {
    width: responsiveHeight(40),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },

  row: {
    width: responsiveWidth(48),
    flexDirection: 'row',
    alignItems: 'center',
    gap:5,
    marginLeft: 10,
    marginBottom: 5,
  },
  
  text1: {
    width: responsiveWidth(68),

    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
    letterSpacing: 1,
    marginLeft: 5,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginLeft: 15,
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

export default TrainerEventDetailScreen;
