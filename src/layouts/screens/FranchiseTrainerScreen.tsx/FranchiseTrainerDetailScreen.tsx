/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Alert,
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
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch} from 'react-redux';
import {setCourseId} from '../../../Redux/ListSlice ';
import FranchiseDetail from './FranchiseDetail';
import FranchiseTopNavigation from '../../navigation/TabNavigation/FranchiseTopNavigation';
import LeadFranchise from './FranchiseTopNavigator/LeadFranchise';
import {Screen} from 'react-native-screens';

interface Props {}
const FranchiseTrainerDetailScreen: FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<[]>([]);
  const [status, setStatus] = useState(false);
  const [results, setResults] = useState(null);
  const {franchiseid} = route.params;

  useFocusEffect(
    useCallback(() => {
      TrainerDetails();
    }, [data]),
  );

  const TrainerDetails = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod(
        `franchise-user-detail?id=${franchiseid}`,
      );
      if (response.status === 200) {
        setData(response.data.franchise);
        console.log(response.data, 'response.data1');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const sentId = (data: {id: any}) => {
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
      <MenuProvider>
        <View style={styles.container}>
          <View style={styles.row0}>
            <Icon
              name="arrow-back"
              type="material"
              color="black"
              size={20}
              onPress={() => navigation.goBack()}
            />
            <View style={{flexDirection: 'row', gap: 20}}>
              <MenuPop
                navigation={navigation}
                item={data}
                franchise_id={franchiseid}
              />
            </View>
          </View>
          <ScrollView>
            {data && (
              <>
                <View style={styles.content}>
                  <Image
                    source={{uri: data.image}}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={[styles.row, {marginBottom: 10}]}>
                  <Icon
                    name="home-group"
                    type="material-community"
                    color={'black'}
                    size={25}
                    style={styles.rowSpace}
                  />
                  <Text style={styles.title}>Franchise Details</Text>
                </View>
                <Text style={styles.text4}>{data.title}</Text>

                <Text style={styles.text4}>{data.name}</Text>

                <Text style={styles.text4}>{data.services_offerings}</Text>
                <View style={styles.row2}>
                  {data.year_of_establishment ? (
                    <>
                      <Icon
                        name="calendar"
                        type="material-community"
                        color={'black'}
                        size={15}
                        style={styles.rowSpace}
                      />
                      <View style={styles.row1}>
                        <Text style={styles.text1}>
                          {data.year_of_establishment}
                        </Text>
                      </View>
                    </>
                  ) : null}
                </View>
                <View style={styles.row2}>
                  {data.space_required ? (
                    <>
                      <Icon
                        name="home-map-marker"
                        type="material-community"
                        color={'black'}
                        size={15}
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
                <View style={styles.row2}>
                  {data.investment_required ? (
                    <>
                      <Icon
                        name="currency-inr"
                        type="material-community"
                        color={'black'}
                        size={15}
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
                  <View style={styles.row}>
                    <Icon
                      name="certificate-outline"
                      type="material-community"
                      color="black"
                      size={15}
                    />
                    <Text
                      style={[
                        styles.title,
                        {marginLeft: 0, marginBottom: 0, marginTop: 0},
                      ]}>
                      Business Details
                    </Text>
                  </View>

                  <Text
                    style={[styles.text1, {marginLeft: 0, marginBottom: 10}]}>
                    {data.business_details}
                  </Text>
                </View>
                <View>
                  <View style={styles.row}>
                    <Icon
                      name="star-outline"
                      type="material-community"
                      color="black"
                      size={15}
                    />
                    <Text
                      style={[
                        styles.title,
                        {marginLeft: 0, marginBottom: 0, marginTop: 0},
                      ]}>
                      Benefits
                    </Text>
                  </View>

                  <Text
                    style={[styles.text1, {marginLeft: 0, marginBottom: 10}]}>
                    {data.business_details}
                  </Text>
                </View>
              </>
            )}
            <FranchiseDetail navigation={navigation} item={data} />
          </ScrollView>
        </View>
      </MenuProvider>
    </>
  );
};

export const MenuPop = ({navigation, item, franchise_id}: any) => {
  const [loading, setLoading] = useState(false);
  const [status1, setStatus1] = useState('');
  const dispatch = useDispatch();
  // dispatch(setCourseId(franchise_id));
  const PressView = (item: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditTrainerFranchise',
        params: {
          franchiseData: item,
        },
      }),
    );
  };

  const NavFun = screen => {
    console.log(screen, 'd');
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FranchiseTopNavigation',
        params: {
          franchise_id: franchise_id,
          screenName: screen,
        },
      }),
    );
  };

  const distableFun = async (res: number) => {
    console.log(res, 'row', franchise_id);
    const status = res === 1 ? 'Disable' : 'Enable';
    Alert.alert(
      'Confirmation',
      `Are you sure you want to ${status} ?`,
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
                `franchise-update-status-by-user?id=${franchise_id}`,
                row,
              );
              console.log(response.data, 'ds');

              if (response.status === 200) {
                console.log(response.data, 'ds');
              } else {
                console.log(response, '500');
                // Handle error cases here if needed
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

      <MenuOptions
        customStyles={{
          optionWrapper: {
            paddingHorizontal: 15, // Adjust horizontal padding
          },
          optionsContainer: {
            marginVertical: 25,
            paddingVertical: 10,
            backgroundColor: '#fff', // Set background color
            borderRadius: 15, // Rounded corners
            elevation: 5, // Add shadow for Android
            shadowColor: '#000', // Shadow color for iOS
            shadowOpacity: 0.2, // Shadow opacity for iOS
            shadowRadius: 4, // Shadow radius for iOS
            shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS
          },
        }}>
        <MenuOption>
          <Pressable onPress={() => PressView(item)}>
            <Text style={styles.menuText}>Edit</Text>
          </Pressable>
        </MenuOption>

        <MenuOption>
          <Pressable onPress={() => NavFun('LeadFranchise')}>
            <Text style={styles.menuText}>Leads</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun('FollowFrachise')}>
            <Text style={styles.menuText}>Follow Ups</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun('InterestedFranchise')}>
            <Text style={styles.menuText}>Interested Parties</Text>
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
    backgroundColor: 'white',
    // padding: 10,
    paddingHorizontal: 15,
    // alignItems: 'flex-start',
  },
  image: {
    width: responsiveWidth(100),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    alignItems: 'center',
    marginBottom: 5,
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
    width: responsiveWidth(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  text: {
    width: 337,
    fontFamily: 'Roboto-Regular',
    color: 'black',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(1.9),
  },
  name: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2.1),
  },
  row: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    // marginLeft:-5
  },
  row2: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginLeft: -5,
    marginBottom: 5,
  },
  conainer1: {
    flexDirection: 'row',
    marginBottom: 10,
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
    fontFamily: 'Roboto-Regular',
    color: 'black',
    fontSize: responsiveFontSize(1.5),
  },
  text4: {
    maxWidth: responsiveWidth(50),
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 5,
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
    backgroundColor: 'black',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    // marginBottom: 10,
    alignSelf: 'center',
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
  row0: {
    width: responsiveWidth(95),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: responsiveWidth(95),

    flexWrap: 'wrap',
    color: 'black',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 0,
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
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
});

export default FranchiseTrainerDetailScreen;

{
  /* <Icon
name="home-group"
type="material-community"
color={'black'}
size={25}
style={styles.rowSpace}
/> */
}
