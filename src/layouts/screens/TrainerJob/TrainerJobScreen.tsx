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
const TrainerJobScreen: FC<Props> = ({navigation}: any): JSX.Element => {
  //   const kyc = useSelector(state => state.List.kyc);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [store, setStore] = useState(null);
  const [store1, setStore1] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    FetchJob(); // re-fetch the data
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      FetchJob();
    }, []),
  );

  const FetchJob = async () => {
    const storage = await getStorageData();

    const login_id = storage.response.user.id;

    try {
      setLoading(true);
      const response: any = await getMethod(
        `user-job-list?user_id=${login_id}`,
      );
      setData(response.data.data);
      console.log(response.data, 'fdgf');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const sendId = (item, id) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TrainerJobDetail',
        params: {
          jobid: id,
        },
      }),
    );
  };

  const renderItem = ({item}) => (
    <ScrollView>
      <Card style={styles.card} onPress={() => sendId(item, item.id)}>
        <View style={styles.row}>
          <>
            <View>
              <Text style={styles.course}>{item.job_title}</Text>
              <View style={styles.row1}>
                <Text
                  style={[
                    styles.course,
                    {
                      fontFamily: 'Roboto-Medium',
                      fontSize: responsiveFontSize(1.7),
                      marginBottom: 5,
                    },
                  ]}>
                  {item.location}
                </Text>
              </View>
            </View>
          </>
        </View>
        <Text style={[styles.text1, {fontSize: responsiveFontSize(2)}]}>
          {item.job_description.length > 200
            ? item.job_description.substring(0, 200) + '...'
            : item.job_description}
        </Text>

        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          {item.pay_range ? (
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="wallet"
                type="material"
                size={20}
                color="#000"
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.pay_range}/Monthly</Text>
            </View>
          ) : null}
          <View>
            <Icon
              name="check-circle"
              type="material"
              color={item.status === 'Active' ? 'green' : 'red'}
              size={25}
            />
          </View>
        </View>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          {item.job_type ? (
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="briefcase"
                type="material-community"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />

              <Text style={styles.text1}>{item.job_type}</Text>
            </View>
          ) : null}
          <View>
            <Icon
              name="campaign"
              type="material"
              color={item.promation === 'Active' ? 'green' : 'red'}
              size={25}
              style={styles.rowSpace}
            />
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.rowColumn}>
            <Icon
              name="file-document-outline" // You can replace this with the specific name of the paper icon
              type="material-community"
              size={25}
              color="#000"
              style={styles.rowSpace}
            />
            <Text style={styles.rowText}>Applications :{item.application}</Text>
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
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row0}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-back"
            size={20}
            color={'black'}
            onPress={() => navigation.goBack()}
          />
          <Image
            source={require('../../img/one.jpeg')}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.row}>
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
            onPress={() => navigation.navigate('AddJobScreen')}
          />
        </View>
      </View>
      <Text style={styles.text0}>Jobs </Text>

      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : data ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={{paddingBottom: 20}}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Oops.. no jobs posted yet. Add Now
          </Text>
        </View>
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
  },
  row1: {
    width: responsiveWidth(78),

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
    marginLeft: 5,
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

export default TrainerJobScreen;
