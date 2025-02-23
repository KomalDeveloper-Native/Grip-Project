/* eslint-disable jsx-quotes */
/* eslint-disable @typescript-eslint/no-shadow */
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
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {getMethod, getStorageData, postMethod} from '../../../utils/helper';
import colors from '../../style/colors';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';

interface Props {
  navigation: any;
}
const UpDateScreen: FC<Props> = ({navigation}: any): JSX.Element => {
  const kyc = useSelector(state => state.List.kyc);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [store, setStore] = useState(null);
  const [store1, setStore1] = useState(null);

  useFocusEffect(
    useCallback(() => {
      UpdateList();
    }, []),
  );

  const UpdateList = async () => {
    const storage = await getStorageData();
    const getKyc = await AsyncStorage.getItem('kyc');

    if (storage.response.kyc == 1) {
      setStore(storage.response.kyc);
    }
    setStore1(getKyc);

    try {
      setLoading(true);
      const response: any = await getMethod('updates');
      setData(response.data.data);
      console.log(response.data.data, 'fdgf');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };
  const capitalizeFirstLetter = string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const optFunction = async item => {
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
  

  const sendId = (item,id) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseDetailScreen',
        params: {
          courseid: id,
          course: item,

        },
      }),
    );
  };

  const renderItem = ({item}) => (
    <>
      <Card style={styles.card}
       onPress={()=>sendId(item,item.id)}
      >
        <View style={{flexDirection: 'row', gap: 5}}>
          {item['user image'] ? (
            <Image source={{uri: item['user image']}} style={styles.rowimage} />
          ) : null}
          <View>
            <View style={styles.rowTitle}>
              <Text
                style={[
                  styles.text0,
                  {
                    width: responsiveWidth(70),
                    fontSize: responsiveFontSize(1.7),
                  },
                ]}>
                {capitalizeFirstLetter(item.name)}
                <Text
                  style={[
                    styles.text1,
                    {
                      fontSize: responsiveFontSize(1.8),
                      width: responsiveWidth(120),
                    },
                  ]}></Text>
              </Text>
            </View>
            <View style={styles.row}>
              <Icon
                name="location-pin"
                type="entypo"
                color={'red'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.location}</Text>
            </View>
          </View>
        </View>
        {item.title ? <Text style={styles.tittle}>{item.title}</Text> : null}
        {item.table === 'event' ? (
          <>
            <View style={styles.row}>
              <Icon
                name="calendar"
                type="font-awesome"
                color={'#FFA500'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.created_at}</Text>
            </View>
            <View style={styles.row}>
              <Icon
                name="clock-o"
                type="font-awesome"
                color={'#FFA500'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.morning_days}</Text>
            </View>
          </>
        ) : null}
        {item.table === 'retreat' ? (
          <>
            <View style={styles.row}>
              <Icon
                name="groups"
                type="material"
                color={'gray'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.created_at}</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="weather-night" // Icon representing a half moon with a sun
                color={'gray'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>
                {item.days <= 1 ? ` ${item.days}Day ` : `${item.days}Days `}
                {item.Nights <= 1 ? `${item.days}Night` : `${item.days}Nights`}
              </Text>
              {/* {item.nights} Nights */}
            </View>
            <View style={styles.row}>
              <Icon
                name="currency-inr"
                type="material-community"
                color={'gray'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.fees}</Text>
            </View>
          </>
        ) : null}

        {item.table === 'franchises' ? (
          <>
            <View style={styles.row}>
              <Icon
                name="map"
                type="material"
                color={'black'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.area}</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="chart-line" // Icon representing a half moon with a sun
                color={'black'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item['investment start']}</Text>
            </View>
          </>
        ) : null}

        {item.table === 'career' ? (
          <>
            <View style={styles.row}>
              <Icon
                name="currency-inr"
                type="material-community"
                color={'gray'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>Salary {item.salery} Per Month</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="clock-check"
                color={'gray'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.job_type}</Text>
            </View>
            <View style={styles.row}>
              <Icon
                name="sunny"
                type="material"
                color={'#FFA500'}
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.created_at}</Text>
            </View>
          </>
        ) : null}
        {item['banner image'] ? (
          <Image source={{uri: item['banner image']}} style={styles.image} />
        ) : null}
        <View style={styles.row1}>
          <View style={styles.row0}>
            <MaterialCommunityIcons
              name="thumb-up-outline"
              // type="font-awesome"
              color="black"
              size={20}
            />
            <Text style={styles.text0}>10</Text>
          </View>
          <View style={styles.row0}>
            <Icon
              name="chatbox-ellipses-outline"
              type="ionicon"
              color="black"
              size={20}
            />
            <Text style={styles.text0}>10</Text>
          </View>
          <Pressable style={styles.btn} onPress={()=>optFunction(item)}  >
            <Text
              style={[
                styles.text0,
                {
                  fontFamily: 'Roboto-light',
                  fontSize: responsiveFontSize(1.55),
                },
              ]}>
              Opt Now
            </Text>
          </Pressable>
        </View>
      </Card>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row0}>
        <View style={{flexDirection:'row',alignItems:"center"}}>
        <Icon name='arrow-back' size={20} color={'black'} onPress={()=>navigation.goBack()} />
        <Image 
          source={require('../../img/one.jpeg')}
          style={styles.logoImage}
        />
        </View>
       
        <View style={styles.row}>
          {kyc || store ? (
            <Icon
              name="plus"
              type="entypo"
              color={'black'}
              size={25}
              style={{
                opacity: 0.8,
                width: responsiveWidth(14),
                height: responsiveHeight(7),
                padding: 0,
                marginBottom: 0,
              }}
              onPress={() => navigation.navigate('NewCourseScreen')}
            />
          ) : null}
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={{paddingBottom: 20}}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
  rowimage: {
    width: responsiveWidth(10),
    height: responsiveHeight(5),
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
  },

  logoImage: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
    padding: 0,
    marginBottom: 0,
  },
  tittle: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
  },
  name: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
  rowTitle: {
    width: '100%',
    marginLeft: 5,
    marginBottom: 5,
  },
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    // marginBottom: 5,
  },
  text1: {
    width: '83%',
    display: 'flex',
    flexWrap: 'wrap',
    color: 'black',
    letterSpacing: 0.5,
    fontFamily: 'Roboto-regular',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 0,
    marginLeft: 5,
  },
  card: {
    width: responsiveWidth(88),
    paddingBottom: 5,
    padding: 10,

    marginBottom: 20,
    // borderStartWidth:0.1,
    backgroundColor: 'white',
    marginTop: 10,
    alignSelf: 'center',
  },
  image: {
    width: responsiveWidth(85),
    height: responsiveHeight(25),
    padding: 15,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: 5,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSpace: {
    width: 18,
  },

  text: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
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
});

export default UpDateScreen;
