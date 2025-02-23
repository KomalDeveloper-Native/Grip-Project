/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useId, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  RefreshControl,
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
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBarSearch from '../../Component/AppBarSearch';

interface Props {}

const RetreatUserScreen: FC<Props> = ({navigation}) => {
  // navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [retreat, setRetreat] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses(); // re-fetch the data
    setRefreshing(false);

  };

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, []),
  );

  const fetchCourses = async () => {
    const storage = await getStorageData();

    const login_id = storage.response.user.id;
    setLoading(true);
    try {
      const response: any = await getMethod(
        `user-retreat-list?user_id=${login_id}`,
      );
      if (response.status === 200) {
        console.log(response.data.data, login_id, 'res0');
        setRetreat(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sendId = (item, id) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RetreatUserDetailScreen',
        params: {
          retreatid: id,
        },
      }),
    );
  };

  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Icon key={i} name="star" type="material" color="orange" size={15} />,
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

  const renderItem = ({item}: any) => (
    <Card
      style={styles.card}
      key={item.id}
      onPress={() => sendId(item, item.id)}>
      <Image
        source={{uri: item.image}}
        style={styles.image}
        resizeMode="contain"
      />
      <Text
        style={[
          // styles.text,
          {
            width: responsiveWidth(80),
            fontFamily: 'Roboto-Bold',
            fontSize:responsiveFontSize(2),
            marginBottom: 5,
            marginLeft:5
          },
        ]}>
        {item.title}
      </Text>

      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View style={styles.row}>
          <Icon
            name="meditation"
            type="material-community"
            color={'black'}
            size={25}
            style={styles.rowSpace}
          />
          <Text style={styles.text}>Retreat Organized By {item.user_name}</Text>
        </View>

        <View style={{marginLeft: 5}}>
          <Text>{renderStars(item.review.averageRating)}</Text>
          <Text style={styles.review}>Reviews ({item.review.reviewCount})</Text>
        </View>
      </View>

      {item.location ? (
        <View style={styles.row}>
          <Icon
            name="map-marker"
            type="font-awesome"
            color="black"
            size={20}
            style={styles.rowSpace}
          />

          <Text style={styles.text1}>{item.location}</Text>
        </View>
      ) : null}
      <View style={styles.row}>
        {item.group_size ? (
          <>
            <Icon
              name="group"
              type="font-awesome"
              color="black"
              size={20}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.group_size} Members</Text>
          </>
        ) : null}
      </View>

      <View
        style={[
          styles.row,
          {width: responsiveWidth(65), alignItems: 'center'},
        ]}>
        {item.no_of_days ? (
          <>
            <Icon
              name="weather-night"
              type="material-community"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.no_of_days} Days</Text>
            </View>
          </>
        ) : null}
        <View style={styles.row1}>
          <Icon
            name="check-circle"
            type="material"
            color={item.status === 'Active' ? 'green' : 'red'}
            size={25}
          />
        </View>
      </View>

      <View
        style={[
          styles.row,
          {width: responsiveWidth(65), alignItems: 'center'},
        ]}>
        {item.price ? (
          <>
            <Icon
              name="currency-inr"
              type="material-community"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.price}</Text>
            </View>
          </>
        ) : null}
        <View style={styles.row1}>
          <Icon
            name="campaign"
            type="material"
            size={25}
            color={item.promation !== true ? 'red' : 'green'}
          />
        </View>
      </View>
      <View style={styles.itemRow}>
        <View style={styles.rowColumn}>
          <Icon name="groups" type="material" size={25} color="#000" />
          <Text style={styles.rowText}>Leads :{item.Lead}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon name="person-add" type="material" size={25} color="#000" />
          <Text style={styles.rowText}>Suscriptions :{item.Suscription}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon name="eye" type="font-awesome" size={25} color="#000" />
          <Text style={styles.rowText}>Impressions: {item.impresssion}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon
            name="mouse-pointer"
            type="font-awesome"
            size={25}
            color="#000"
          />
          <Text style={styles.rowText}>Click: {item.click}</Text>
        </View>
      </View>
    </Card>
  );

  let bg = 'white';

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DrawerNavigation'); // Replace with your default screen
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row0}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-back"
            size={25}
            color={'black'}
            onPress={() => handleBackPress()}
          />
          <Image
            source={require('../../img/one.jpeg')}
            style={styles.logoImage}
          />
        </View>

          <Icon
            name="plus"
            type="entypo"
            color={'black'}
            size={30}
            style={{
              opacity: 0.8,
              width: responsiveWidth(14),
              height: responsiveHeight(7),
              padding: 0,
              marginBottom: 0,
            }}
            onPress={() => navigation.navigate('AddNewRetreat')}
          />
  
      </View>
      <Text style={styles.text0}>Retreats</Text>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : retreat.length > 0 ? (
        <FlatList
          data={retreat}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Oops.. no retreats yet. Add Now</Text>
        </View>
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: wp('100%'),
//     height: hp('100%'),

//     backgroundColor: 'white',
//     alignSelf: 'center',
//     overflow: 'hidden',
//   },
//   row0: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: responsiveWidth(115),
//     paddingLeft: 10,
//     alignItems: 'center',
//   },
//   logoImage: {
//     width: responsiveWidth(15),
//     height: responsiveHeight(5),
//     padding: 10,
//     marginBottom: 20,
//   },
//   text0: {
//     width: responsiveWidth(88),
//     alignSelf: 'center',

//     color: 'black',
//     fontFamily: 'Roboto-Bold',
//     fontSize: 20,
//     marginBottom: 5,
//   },
//   card: {
//     width: responsiveWidth(88),
//     backgroundColor: 'white',
//     padding: 15,
//     marginBottom: 20,
//     marginTop: 10,
//     alignSelf: 'center',
//   },
//   image: {
//     width: responsiveHeight(40),
//     height: responsiveHeight(20),
//     resizeMode: 'contain',
//     marginBottom: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     alignSelf: 'center',
//   },
//   row: {
//     width: responsiveWidth(55),

//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 10,
//     marginBottom: 5,
//   },
//   row1: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '92%',
//   },
//   rowSpace: {
//     width: 25,
//   },
//   text: {
//     width: responsiveWidth(45),

//     color: 'black',
//     fontFamily: 'Roboto-Bold',
//     fontSize: responsiveFontSize(1.7),
//   },
//   review: {
//     color: 'black',
//     fontSize: 12,
//     fontFamily: 'Roboto-Regular',
//   },
//   btn: {
//     width: responsiveWidth(21),
//     height: responsiveHeight(3.8),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     elevation: 5.5,
//     borderRadius: 8,
//     color: 'black',
//   },
//   text1: {
//     flexWrap: 'wrap',
//     textAlign: 'left',
//     color: 'black',
//     fontFamily: 'Roboto-light',
//     fontSize: responsiveFontSize(1.65),
//     marginBottom: 0,
//     letterSpacing: 1,
//   },
//   itemRow: {
//     width: responsiveWidth(90),
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     alignSelf: 'center',
//     // marginBottom: 20,
//   },
//   rowColumn: {
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   rowText: {
//     color: 'black',
//     fontSize: responsiveFontSize(1.5),
//     fontFamily: 'Roboto-Medium',
//   },

//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonClose: {
//     backgroundColor: '#2196F3',
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//     fontSize: responsiveFontSize(3),
//     color: 'black',
//   },
// });

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: responsiveWidth(15),
    height: responsiveHeight(5),
  },
  text0: {
    width: responsiveWidth(88),
    alignSelf: 'center',

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(3),
    // marginBottom: 5,
  },
  card: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 20,
    marginTop: 5,
    alignSelf: 'center',
  },
  image: {
    width: responsiveWidth(82),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 5,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:5

  },
  row1: {
    width: responsiveWidth(70),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSpace: {
    width: 25,
    alignItems: 'center',
  },
  text: {
    width: responsiveWidth(47),

    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    marginLeft:5
  },
  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginLeft:8
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
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 0,
    letterSpacing: 1,
  },
  text1: {
    width: responsiveWidth(50),
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 5,
    letterSpacing: 1,
    marginLeft: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  rowColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  rowText: {
    color: 'black',
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Roboto-Medium',
  },
  course: {
    width: responsiveWidth(85),
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    letterSpacing: 1,
    color: 'black',
    marginLeft:5
  },

  // Model
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
});
export default RetreatUserScreen;
