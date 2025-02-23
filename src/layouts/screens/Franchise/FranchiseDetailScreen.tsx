/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Card} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ArrowIcon from '../../Component/ArrowIcon';
import {getStorageData, getMethod, postMethod} from '../../../utils/helper';
import {Icon} from 'react-native-elements';

interface Props {}
const FranchiseDetailScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [status, setStatus] = useState(false);
  const [results, setResults] = useState(null);
  const {franchiseid, loginUser, userid} = route.params;

  useFocusEffect(
    useCallback(() => {
      TrainerDetails();
      franchiseImpression();
    }, [franchiseid]),
  );

  const TrainerDetails = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    const row = {
      current_user: id,
    };
    try {
      setLoading(true);
      const response: any = await postMethod(
        `franchise-detail?id=${franchiseid}`,
        row,
      );
      if (response.status === 200) {
        setData(response.data.franchise_details);
        console.log(response.data, 'response.data');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const franchiseImpression = async () => {
    setLoading(true);
    try {
      const row = {
        userIP: 'jj',
        userCountry: 'jjj',
        dataArray: [
          {
            franchise: [franchiseid], // Send the entire array of IDs
          },
        ],
      };
      const response: any = await postMethod('tracking-site', row);
      if (response.status === 200) {
        console.warn(response.data, row.dataArray, 'j');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading state is reset on error
    }
  };

  if (loading) {
    return <ActivityIndicator size={20} color="black" />;
  }
  const sendId = data => {
    console.log(data);
    // FranchiseScreen
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FranchiseApply',
        params: {
          franchiseid: data.id,
        },
      }),
    );
  };

  let bg = 'white';
  return (
    <>
      <ArrowIcon iconName={'arrow-back'} navigation={navigation} />
      <View style={styles.container}>
        <ScrollView>
          {data && (
            <>
              <View style={styles.content}>
                <View style={styles.row}>
                  <Icon
                    name="home-group"
                    type="material-community"
                    color={'black'}
                    size={25}
                    style={styles.rowSpace}
                  />
                  <Text style={styles.title}>Franchise Details</Text>
                </View>
              </View>
              <Text style={styles.text4}>{data.services_offerings}</Text>
              <View style={styles.row}>
                {data.year_of_establishment ? (
                  <>
                    <Icon
                      name="calendar"
                      type="material-community"
                      color={'black'}
                      size={20}
                      style={styles.rowSpace}
                    />
                    <Text style={styles.text1}>
                      {data.year_of_establishment}
                    </Text>
                  </>
                ) : null}
              </View>
              <View style={styles.row}>
                {data.space_required ? (
                  <>
                    <Icon
                      name="home-map-marker"
                      type="material-community"
                      color={'black'}
                      size={20}
                      style={styles.rowSpace}
                    />
                    <View style={styles.row1}>
                      <Text style={styles.text1}>
                        {data.space_required} Sq.Ft
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View style={styles.row}>
                {data.investment_required ? (
                  <>
                    <Icon
                      name="currency-inr"
                      type="material-community"
                      color={'black'}
                      size={20}
                      style={styles.rowSpace}
                    />
                    <View style={styles.row1}>
                      <Text style={styles.text1}>
                        {data.investment_required}/Month
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View>
                <View style={[styles.row, {marginTop: 10}]}>
                  <Icon
                    name="certificate-outline"
                    type="material-community"
                    color="black"
                    size={20}
                  />
                  <Text
                    style={[
                      styles.title,
                      {
                        marginLeft: 0,
                        fontSize: responsiveFontSize(2),
                      },
                    ]}>
                    Business Details
                  </Text>
                </View>

                <Text style={[styles.text1, {marginLeft: 0, marginBottom: 10}]}>
                  {data.business_details}
                </Text>
              </View>
              <View>
                <View style={styles.row}>
                  <Icon
                    name="gift"
                    type="font-awesome"
                    color="black"
                    size={20}
                  />
                  <Text
                    style={[
                      styles.title,
                      {
                        marginLeft: 0,
                        fontSize: responsiveFontSize(2),
                      },
                    ]}>
                    Benefits
                  </Text>
                </View>

                <Text style={[styles.text1, {marginLeft: 0, marginBottom: 10}]}>
                  {data.business_details}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
        {data.apply_status ? (
          <Pressable
            style={[styles.tabBottom, {backgroundColor: 'red'}]}
            onPress={() => sendId(data)}>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(1.9),
                textAlign: 'center',
                // width: responsiveWidth(80),
              }}>
              SHOW INTEREST AGAIN
            </Text>
          </Pressable>
        ) : loginUser === userid ? null : (
          <Pressable style={styles.tabBottom} onPress={() => sendId(data)}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Roboto-Medium',
                fontSize: responsiveFontSize(2),
              }}>
              SHOW INTEREST
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 10,
    paddingHorizontal: 20,
    // alignItems: 'flex-start',
  },
  image: {
    width: responsiveWidth(100),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  image0: {
    width: responsiveWidth(70),
    height: responsiveHeight(20),
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  content: {
    // width: responsiveWidth(29),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  title: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(3),
  },
  name: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2),
  },
  row: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  conainer1: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 20,
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

  text4: {
    width: responsiveWidth(89.5),
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
    textAlign: 'justify',
  },
  review: {
    width: responsiveWidth(89.5),
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
    backgroundColor: 'black',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    // marginBottom: 10,
    alignSelf: 'center',
    marginBottom: 30,
  },

  tabBottom1: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 1,
    borderColor: 'black',
    borderWidth: 2.5,
    position: 'static',
    marginBottom: 10,
    alignSelf: 'center',
  },

  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  rowSpace: {
    width: 25,
  },

  btn: {
    width: responsiveWidth(21),
    height: responsiveHeight(3.8),
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
    width: responsiveWidth(90),
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 0,
    letterSpacing: 1,
  },
});

export default FranchiseDetailScreen;
