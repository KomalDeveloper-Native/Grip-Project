/* eslint-disable quotes */
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
import {Avatar, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';

interface Props {
  navigation: any;
}
const TrainerEventScreen: FC<Props> = ({navigation}: any): JSX.Element => {
  //   const kyc = useSelector(state => state.List.kyc);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [store, setStore] = useState(null);
  const [store1, setStore1] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchEvent();
    }, []),
  );

  const fetchEvent = async () => {
    const storage = await getStorageData();

    const login_id = storage.response.user.id;

    try {
      setLoading(true);
      const response: any = await getMethod(
        `event-list-user-specific?user_id=117`,
      );
      setData(response.data.data);
      console.log(response.data, 'fdgf');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const sendId = id => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TrainerEventDetailScreen',
        params: {
          eventId: id,
        },
      }),
    );
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

  const renderItem = ({item}: any) => (
    <Card style={styles.card} key={item.id} onPress={() => sendId(item.id)}>
      <Image
        source={{uri: item.image}}
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
          <Text style={styles.text}>{item.title}</Text>
        </View>
        <View>
          <Text> {renderStars(item.review)}</Text>
          <Text style={styles.review}> Reviews ({item.review.reviewCount})</Text>
        </View>
      </View>
      {item.start_date || item.end_date ? (
        <View style={styles.row}>
          <Icon
            name="calendar"
            type="font-awesome"
            color="black"
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}>
            {item.start_date}-{item.end_date}
          </Text>
        </View>
      ) : null}

      <View style={styles.row}>
        {item.start_time || item.end_time ? (
          item.start_time ? (
            <>
              <Icon
                name="clock-o"
                type="font-awesome"
                color="black"
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>
                {item.start_time}Am to {item.end_time}Pm
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
              <Text style={styles.text1}>{item.end_time}</Text>
            </>
          )
        ) : null}

        <View style={styles.row1}>
          {/* <View>
            <Text></Text>
          </View> */}
          <Icon
            name="check-circle"
            type="material"
            color={item.status === 'Active' ? 'green' : 'red'}
            size={25}
          />
        </View>
      </View>

      <View style={[styles.row, {width: 100}]}>
        {item.venue ? (
          <>
            <Icon
              name="location-on"
              type="material"
              color={'red'}
              size={15}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.venue}</Text>
          </>
        ) : null}

        <View style={styles.row1}>
          {/* <Text></Text> */}
          <Icon
            name="campaign"
            type="material"
            size={25}
            color={item.promote === 'Inactive' ? 'red' : 'green'}
          />
        </View>
      </View>

      <View style={styles.itemRow}>
        <View style={styles.rowColumn}>
          <Icon name="groups" type="material" size={20} color="#000" />
          <Text style={styles.rowText}>Leads: {item.lead}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon name="person-add" type="material" size={20} color="#000" />
          <Text style={styles.rowText}>Subscriptions: {item.subscription}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon name="eye" type="font-awesome" size={20} color="#000" />
          <Text style={styles.rowText}>Impressions: {item.impression}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon
            name="mouse-pointer"
            type="font-awesome"
            size={20}
            color="#000"
          />
          <Text style={styles.rowText}>Click: {item.clicks}</Text>
        </View>
      </View>
    </Card>
  );
  let bg = 'white';

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Icon
          name="arrow-back"
          size={20}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.text0}>Event</Text>
      </View>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={{paddingBottom: 20}}
            showsVerticalScrollIndicator={false}
          />
        </>
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
    // paddingHorizontal:8,
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
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 5,
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
    width: responsiveHeight(40),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    width: responsiveWidth(90),
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    marginBottom: -5,
    // marginBottom: 10,
  },
  title1: {
    width: responsiveWidth(80),
    color: 'black',
    fontSize: responsiveFontSize(1.75),
    fontFamily: 'Roboto-Medium',
  },
  row: {
    // width: responsiveWidth(48),
    flexDirection: 'row',
    alignItems: 'center',
    // gap:5,
    marginBottom: 5,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSpace: {
    width: 15,
  },
  text: {
    width: responsiveWidth(60),
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.45),
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
  btnText: {
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'white',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
    letterSpacing: 1,
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
  itemRow: {
    width: responsiveWidth(90),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  rowColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  rowText: {
    color: 'black',
    fontSize: responsiveFontSize(1.1),
    fontFamily: 'Roboto-Medium',
  },
  menuText1: {
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 20,
  },

  // Modal

  modalBackground1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  },
  modalContainer1: {
    width: responsiveWidth(60),
    height: responsiveHeight(18),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
    alignSelf: 'center',
    textAlign: 'center',
  },

  rowIcon: {},
  rowIcon1: {
    flexDirection: 'row',
  },
  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default TrainerEventScreen;
