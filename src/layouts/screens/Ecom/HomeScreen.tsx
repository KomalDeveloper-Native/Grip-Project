/* eslint-disable semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {getMethod, getStorageData, postMethod} from '../../../utils/helper2';
import colors from '../../style/colors';
import {Avatar, Icon, SearchBar} from 'react-native-elements';
import {locale} from 'moment';
import {Circle} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import {ShopDrawerNavigator} from '../../navigation/DrawnNavigation';
import Mycart from './Cart/MycartScreen';
import Swiper from 'react-native-swiper';

interface Props {}

const HomeScreen: FC<Props> = ({navigation}) => {
  navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [scrollCat, setScrollCat] = useState<[]>([]);
  const [scrollBaner, setScrollBaner] = useState<[]>([]);
  const [scrollBaner1, setScrollBaner1] = useState<[]>([]);
  const [scrollBaner2, setScrollBaner2] = useState<[]>([]);
  const [scrollBaner3, setScrollBaner3] = useState<[]>([]);

  const [special, setSpecial] = useState<[]>([]);
  const [yoga, setYoga] = useState<[]>([]);
  const [meditation, setMeditation] = useState<[]>([]);

  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    await fetchCategory(); // Fetch new data
    setRefreshing(false); // Stop refreshing when done
  };

  useFocusEffect(
    useCallback(async () => {
      await fetchCategory();
      await scrollCategory();
      await bannerFun();
      await bannerFun1();
      await yogaFun();
      await MeditationFun();
      await specialFun();
      await bannerFun2();
      await bannerFun3();
    }, []),
  );

  const fetchCategory = async () => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    console.log(storage.response.token);
    setLoading(true);
    try {
      const response = await getMethod('categories');
      if (response.status === 200) {
        setCategory(response.data.children_data);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return null;
    }
  };

  const scrollCategory = async () => {
    setLoading(true);
    try {
      const response = await getMethod('cmsBlock/34');
      const sanitizedContent = response.data.content
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      const parsedContent = JSON.parse(sanitizedContent);
      if (parsedContent?.data) {
        setScrollCat(parsedContent.data); // Set state
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const bannerFun = async () => {
    setLoading(true);
    try {
      const response = await getMethod('cmsBlock/35');
      const sanitizedContent = response.data.content
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      const parsedContent = JSON.parse(sanitizedContent);
      if (parsedContent?.data) {
        setScrollBaner(parsedContent.data); // Set state
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const specialFun = async () => {
    setLoading(true);
    try {
      const response = await getMethod(
        'products?searchCriteria[filterGroups][0][filters][0][field]=spacial_product&searchCriteria[filterGroups][0][filters][0][value]=5553&searchCriteria[filterGroups][0][filters][0][condition_type]=eq',
      );
      setSpecial(response.data.items); // Set state
      console.log(response.data.items, 'df');
    } catch (error) {
      setLoading(false);
    }
  };

  const bannerFun1 = async () => {
    setLoading(true);
    try {
      const response = await getMethod('cmsBlock/36');
      const sanitizedContent = response.data.content
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      const parsedContent = JSON.parse(sanitizedContent);
      if (parsedContent?.data) {
        setScrollBaner1(parsedContent.data); // Set state
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const yogaFun = async () => {
    setLoading(true);
    try {
      const response = await getMethod(
        'products?searchCriteria[filter_groups][0][filters][0][field]=type_id&searchCriteria[filter_groups][0][filters][0][value]=simple&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=category_id&searchCriteria[filter_groups][1][filters][0][value]=3&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&searchCriteria[filter_groups][2][filters][0][field]=visibility&searchCriteria[filter_groups][2][filters][0][value]=4&searchCriteria[filter_groups][2][filters][0][condition_type]=eq&searchCriteria[pageSize]=10&searchCriteria[currentPage]=1&fields=items[id,sku,name,price,custom_attributes[special_price],media_gallery_entries[types,file]]',
      );
      setYoga(response.data.items); // Set state
      console.log(response.data.items, 'jj');
    } catch (error) {
      setLoading(false);
    }
  };

  const bannerFun2 = async () => {
    setLoading(true);
    try {
      const response = await getMethod('cmsBlock/35');
      const sanitizedContent = response.data.content
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      const parsedContent = JSON.parse(sanitizedContent);
      if (parsedContent?.data) {
        setScrollBaner2(parsedContent.data); // Set state
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const MeditationFun = async () => {
    setLoading(true);
    try {
      const response = await getMethod(
        'products?searchCriteria[filterGroups][0][filters][0][field]=category_id&searchCriteria[filterGroups][0][filters][0][value]=4&searchCriteria[filterGroups][1][filters][0][field]=type_id&searchCriteria[filterGroups][1][filters][0][value]=simple&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[pageSize]=4&searchCriteria[currentPage]=1&fileds=items[id,sku,name,price,custom_attributes[special_price],media_gallery_entries[types,file]]',
      );
      setMeditation(response.data.items); // Set state
    } catch (error) {
      setLoading(false);
    }
  };

  const bannerFun3 = async () => {
    setLoading(true);
    try {
      const response = await getMethod('cmsBlock/38');
      const sanitizedContent = response.data.content
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      const parsedContent = JSON.parse(sanitizedContent);
      if (parsedContent?.data) {
        setScrollBaner3(parsedContent.data); // Set state
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const sentFun = id => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ProductList',
        params: {
          categoryId: id,
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 12,
        }}>
        <Icon
          name="menu"
          type="material"
          size={25}
          color={'black'}
          style={{alignSelf: 'flex-start', marginVertical: 10}}
          onPress={() => navigation.openDrawer()}
        />
        <Icon
          name="cart"
          type="ionicon"
          size={30}
          color="black"
          onPress={() => navigation.navigate('Mycart')}
        />
      </View>

      <View style={styles.locationRow}>
        <View>
          <Text style={styles.locationText}>Location</Text>
          <View style={{flexDirection: 'row', rowGap: 5, marginLeft: -5}}>
            <Icon
              name="location-on"
              type="material"
              size={25}
              color={'black'}
            />

            <Text style={styles.location}>karol Bagh, Delhi</Text>
          </View>
        </View>
      </View>
      <View style={styles.locationRow}>
        <SearchBar
          color="black"
          fontColor="black"
          iconColor="black"
          shadowColor="#282828"
          cancelIconColor="black"
          placeholder="Search here"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          onSearchPress={() => {
            console.log('Search Icon Pressed');
            // Add your search logic here
          }}
          onCancel={() => {
            console.log('Cancel Pressed');
            setSearchTerm('');
          }}
          inputContainerStyle={{
            width: responsiveWidth(80),
            paddingVertical: 0,
            marginHorizontal: 15,
            backgroundColor: 'white',
          }}
          containerStyle={{
            width: responsiveWidth(93),
            backgroundColor: 'white',
            borderRadius: 20,
            paddingVertical: 0,
            borderWidth: 1,
            borderColor: 'lightgray',
          }}
          showCancel={true}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.scrollContainer}>
          <ScrollView style={{flexDirection: 'row', gap: 5}} horizontal>
            {scrollCat.map((item: any) => (
              <Pressable
                key={item.id}
                style={styles.rowItem}
                onPress={() => sentFun(item.id)}>
                <Image
                  source={{uri: item.url}}
                  style={styles.image}
                  // resizeMode="cover"
                />
                <Text style={styles.text}>{item.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={{marginBottom: -125}}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            dot={false}
            activeDot={false}
            showsPagination={false}>
            {scrollBaner.map(item => (
              <View style={styles.slide1} key={item.file}>
                <Image
                  source={{
                    uri: item.url,
                  }}
                  style={styles.image1}
                />
              </View>
            ))}
          </Swiper>
        </View>

        <ScrollView>
          <View style={{backgroundColor: 'white', opacity: 5}}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: responsiveFontSize(3),
                  width: responsiveWidth(50),
                  textAlign: 'center',
                  marginBottom: 15,
                },
              ]}>
              Special For You
            </Text>

            <View style={styles.column}>
              {special.length > 0 &&
                special.map((item, index) => (
                  <>
                    <Pressable
                      style={styles.columnItem}
                      onPress={() => sentFun(item.id)}>
                      <Image
                        source={{
                          uri: `https://gripkart.com/pub/media/catalog/product${item.media_gallery_entries[0]?.file}`,
                        }}
                        style={styles.image3}
                      />
                      <Text style={styles.text}>
                        {item.name.length > 40
                          ? `${item.name.substring(0, 30)}...`
                          : item.name}
                      </Text>
                      <Text style={styles.text}>
                        Rs
                        {/* {item.price} */}
                      </Text>
                    </Pressable>
                  </>
                ))}
            </View>
            <View style={styles.columnRow1}>
              {scrollBaner1.length > 0 && (
                <>
                  {/* First Row: Full Width Image */}
                  <View style={styles.fullRow}>
                    <Image
                      source={{uri: scrollBaner1[0]?.url}}
                      style={styles.image4}
                    />
                  </View>

                  {/* Second Row: Two Images Side by Side */}
                  <View style={styles.halfRow}>
                    {scrollBaner1.slice(1, 3).map((item, index) => (
                      <Image
                        key={index}
                        source={{uri: item.url}}
                        style={styles.image5}
                      />
                    ))}
                  </View>
                </>
              )}
            </View>
            <Text
              style={[
                styles.text,
                {
                  fontSize: responsiveFontSize(3),
                  width: responsiveWidth(35),
                  textAlign: 'center',
                  marginTop: 20,
                  marginBottom: 8,
                },
              ]}>
              Yoga Mat
            </Text>
            <View style={styles.column}>
              {yoga.length > 0 &&
                yoga.map((item, index) => (
                  <>
                    <Pressable
                      style={styles.columnItem}
                      onPress={() => sentFun(item.id)}>
                      <Image
                        source={{
                          uri: `https://gripkart.com/pub/media/catalog/product${item.media_gallery_entries[0]?.file}`,
                        }}
                        style={styles.image3}
                      />
                      <Text style={styles.text}>
                        {item.name.length > 40
                          ? `${item.name.substring(0, 30)}...`
                          : item.name}
                      </Text>
                      <Text style={styles.productSpecialPrice}>
                        Rs {item.price}
                      </Text>
                      {item.custom_attributes && (
                        <Text style={[styles.text, styles.specialPrice]}>
                          Rs
                          {parseFloat(
                            Object.values(item.custom_attributes || {}).find(
                              attr => attr.attribute_code === 'special_price',
                            )?.value,
                          ).toFixed(2)}
                        </Text>
                      )}
                    </Pressable>
                  </>
                ))}
            </View>
            <View style={{marginBottom: -120}}>
              <Swiper
                style={styles.wrapper}
                showsButtons={false}
                dot={false}
                activeDot={false}
                showsPagination={false}>
                {scrollBaner2.map(item => (
                  <View style={styles.slide1} key={item.file}>
                    <Image
                      source={{
                        uri: item.url,
                      }}
                      style={styles.image1}
                    />
                  </View>
                ))}
              </Swiper>
            </View>

            <Text
              style={[
                styles.text,
                {
                  fontSize: responsiveFontSize(3),
                  width: responsiveWidth(65),
                  textAlign: 'center',
                  flexWrap: 'nowrap',
                  marginBottom: 15,
                },
              ]}>
              Meditation Cushion
            </Text>
            <View style={styles.column}>
              {meditation.length > 0 &&
                meditation.map((item, index) => (
                  <>
                    <Pressable
                      style={styles.columnItem}
                      onPress={() => sentFun(item.id)}>
                      <Image
                        source={{
                          uri: `https://gripkart.com/pub/media/catalog/product${item.media_gallery_entries[0]?.file}`,
                        }}
                        style={styles.image3}
                      />
                      <Text style={styles.text}>
                        {item.name.length > 40
                          ? `${item.name.substring(0, 30)}...`
                          : item.name}
                      </Text>
                      <Text style={styles.text}>Rs {item.price}</Text>
                    </Pressable>
                  </>
                ))}
            </View>
            <View style={{marginBottom: -120}}>
              <Swiper
                style={styles.wrapper}
                showsButtons={false}
                dot={false}
                activeDot={false}
                showsPagination={false}>
                {scrollBaner3.map(item => (
                  <View style={styles.slide1} key={item.file}>
                    <Image
                      source={{
                        uri: item.url,
                      }}
                      style={styles.image1}
                    />
                  </View>
                ))}
              </Swiper>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: 'white',
    alignSelf: 'center',

    // alignItems: 'center',
  },
  locationRow: {
    width: responsiveWidth(92),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  locationText: {
    fontFamily: 'Roboto-Regulat',
    fontSize: responsiveFontSize(1.85),
    textAlign: 'justify',
  },
  location: {
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    textAlign: 'justify',
  },
  circle: {
    width: responsiveWidth(8),
    height: responsiveHeight(4),
    borderRadius: 55,
    backgroundColor: 'lightgray',
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 55,
  },

  scrollContainer: {
    width: responsiveWidth(100),
    height: responsiveHeight(15),
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 888,
    marginBottom: 0,
  },

  rowItem: {
    width: responsiveWidth(25),
    textAlign: 'center',
    alignItems: 'center',
    height: responsiveHeight(12.5),
    justifyContent: 'center',
    // marginRight: 0,
  },
  text: {
    width: responsiveWidth(30),

    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
  },
  productSpecialPrice: {
    width: responsiveWidth(40),
    color: 'gray',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
    textDecorationLine: 'line-through',
  },
  image: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),

    alignItems: 'center',
    resizeMode: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    // marginBottom: 15,
  },
  image2: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),

    alignItems: 'center',
    resizeMode: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    // marginBottom: 15,
  },

  column: {
    width: responsiveWidth(90),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 35,
    rowGap: 20,
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  columnItem: {
    width: responsiveWidth(40),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    opacity: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingBottom: 20,
  },
  // Course Swiper
  wrapper: {
    height: responsiveHeight(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    // flex: 1,
  },

  slide1: {
    justifyContent: 'flex-end',

    alignItems: 'center',
  },

  image1: {
    width: responsiveWidth(92),
    height: responsiveHeight(20),
    resizeMode: 'stretch',
    borderRadius: 5,
    marginBottom: 0,
  },
  columnRow1: {
    width: responsiveWidth(90),

    flexDirection: 'row',
    alignSelf: 'center',
    gap: 10,
  },

  image3: {
    width: responsiveWidth(25),
    height: responsiveHeight(12.5),
    marginTop: 11,
    // resizeMode: 'contain',
  },
  image4: {
    width: responsiveWidth(43.5),
    height: responsiveHeight(45),
    // resizeMode: 'contain',
    resizeMode: 'stretch',
  },
  image5: {
    width: responsiveWidth(43.5),
    height: responsiveHeight(22),
    marginBottom: 5,
    resizeMode: 'stretch',
  },
});

export default HomeScreen;
