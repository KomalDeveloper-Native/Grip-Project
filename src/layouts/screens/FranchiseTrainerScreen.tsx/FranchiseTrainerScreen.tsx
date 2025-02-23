/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useState} from 'react';
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
import {Avatar, Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBarSearch from '../../Component/AppBarSearch';
import FranchiseSearch from '../../Component/FranchiseSearch';

interface Props {}

const FranchiseTrainerScreen: FC<Props> = ({navigation}) => {
  navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchFranchise(); // re-fetch the data
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      fetchFranchise();
    }, []),
  );

  const fetchFranchise = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    setLoading(true);
    try {
      const response: any = await getMethod(
        `franchise-user-list?user_id=${id}`,
      );
      if (response.status === 200) {
        console.log(response.data, 'res1');
        setFranchise(response.data.franchises);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error(error);
    }
  };

  const sendId = id => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FranchiseTrainerDetailScreen',
        params: {
          franchiseid: id,
        },
      }),
    );
  };

  const renderItem = ({item}: any) => (
    <Card style={styles.card} key={item.id} onPress={() => sendId(item.id)}>
      <View style={[styles.row, {alignItems: 'flex-start'}]} key={item.id}>
        <View style={styles.row1}>
          <Image source={{uri: item.image}} style={styles.image} />
          <View>
            <Text style={styles.course}>{item.title}</Text>

            <Text style={[styles.course, {fontFamily: 'Roboto-Regular'}]}>
              {item.name}
            </Text>
            <View style={styles.row}>
              {item.location ? (
                <>
                  <Icon
                    name="location-pin"
                    type="material"
                    color={'black'}
                    size={20}
                  />
                  <View style={styles.row1}>
                    <Text style={styles.text1}>{item.location}</Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.row}>
        {item.space_required ? (
          <>
            <Icon
              name="home-map-marker"
              type="material-community"
              color={'black'}
              size={20}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>
                Area Required {item.space_required} Sq.Ft
              </Text>
              <Icon
                name="check-circle"
                type="material"
                color={item.status === 1 ? 'green' : 'red'}
                size={25}
              />
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.row}>
        {item.investment_required ? (
          <>
            <Icon
              name="hand-coin"
              type="material-community"
              size={20}
              color="#000"
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>
                Invesment Start ₹{item.investment_required}
              </Text>
              <Icon
                name="campaign"
                type="material"
                size={25}
                style={styles.rowSpace}
                color={item.promation === true ? 'green' : 'red'}
              />
            </View>
          </>
        ) : null}
      </View>
      <View style={styles.itemRow}>
        <View style={styles.rowColumn}>
          <Icon
            name="money"
            type="font-awesome"
            size={25}
            color="#000"
            style={styles.rowSpace}
          />
          <Text style={styles.rowText}>Interest: {item.interest}</Text>
        </View>

        <View style={styles.rowColumn}>
          <Icon
            name="eye"
            type="font-awesome"
            size={25}
            color="#000"
            style={styles.rowSpace}
          />
          <Text style={styles.rowText}>Impressions: {item.impressions}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon
            name="mouse-pointer"
            type="font-awesome"
            size={25}
            color="#000"
            style={styles.rowSpace}
          />
          <Text style={styles.rowText}>Click: {item.click}</Text>
        </View>
      </View>
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <View style={styles.row0}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-back"
            size={25}
            color={'black'}
            onPress={() => navigation.goBack()}
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
          onPress={() => navigation.navigate('CreateTrainerFranchise')}
        />
      </View>
      <Text style={styles.text0}>Franchises</Text>

      {loading ? (
        <ActivityIndicator size={25} color={colors.black} />
      ) : (
        <>
          {franchise ? (
            <FlatList
              data={franchise}
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
              <Text style={styles.modalText}>
                Oops.. no franchise opportunities posted yet. Add Now
              </Text>
            </View>
          )}
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
    width: responsiveWidth(14),
    height: responsiveHeight(7),
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
    paddingHorizontal:12,
    marginBottom: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  image: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    resizeMode: 'contain',
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:5,
    marginLeft:2

  },
  row1: {
    width: responsiveWidth(76.5),

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSpace: {
    width: 25,
    alignItems: 'center',
  },
  text: {
    width: responsiveWidth(55),
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.7),
  },
  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
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
    marginBottom: 0,
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
    width: responsiveWidth(65),
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    letterSpacing: 1,
    color: 'black',
    marginLeft: 15,
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

export default FranchiseTrainerScreen;
