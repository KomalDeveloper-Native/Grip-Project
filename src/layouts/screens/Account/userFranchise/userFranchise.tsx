/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Icon} from 'react-native-elements';
import {Avatar} from '@rneui/themed';
import {CommonActions, useFocusEffect} from '@react-navigation/native';

import {useSelector} from 'react-redux';
import {getMethod, getStorageData} from '../../../../utils/helper';

interface Props {}
const userFranchise: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [franchise, setFranchise] = useState([]);
  const [message, setMessage] = useState('');
  const onRefresh = () => {
    setRefreshing(true);
    userFranchiseLisfun();
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      userFranchiseLisfun();
    }, []),
  );

  const userFranchiseLisfun = async () => {
    setLoading(true);
    try {
      const storage = await getStorageData();
      const id = storage.response.user.id;
      const endpoint = `user-franchise-list?user_id=${id}`;
      console.log(endpoint, 'endpoint');

      const response: any = await getMethod(endpoint);
      console.log(response.data, 'response data');

      if (response.status === 200) {
        setFranchise(response.data.leads);
        setMessage(response.data.message || 'No franchises available.');
      }
    } catch (error) {
      console.log('Error fetching franchise data', error);
      setMessage('An error occurred while fetching data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const ListDetailFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'userFranchiseDetail',
        params: {
          franchise_id: item,
        },
      }),
    );
  };

  return (
    <>
      <View style={{alignSelf: 'flex-start', margin: 10, marginLeft: 10}}>
        <Icon name="arrow-back" onPress={() => navigation.goBack()} size={25} />
      </View>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            width: responsiveWidth(95),
            borderRadius: 10,
            marginBottom: 10,
            elevation:1,

          }}>
          <Text style={{fontFamily: 'Roboto-Bold'}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: responsiveFontSize(2),
              }}>
              My franchise interest
            </Text>
          </Text>
        </View>
        <ScrollView
          style={{flexGrow: 1, paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {loading ? (
            <ActivityIndicator size={20} color="black" />
          ) : franchise ? (
            franchise.map(item => (
              <Pressable
                style={styles.row}
                key={item.id}
                onPress={() => ListDetailFun(item.id)}>
                <View style={styles.row1}>
                  <Avatar size={40} rounded source={{uri: item.image}} />
                  <View>
                    <Text style={styles.name}>{item.franchise_name}</Text>
                    <Text style={styles.course}>By {item.trainer_name}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.row1}>
                    <Icon name="update" size={20} color="black" />
                    <Text style={styles.date}>{item.status}</Text>
                  </View>
                  <View style={styles.row1}>
                    <Icon
                      name="event"
                      type="material"
                      size={20}
                      color="black"
                    />
                    <Text style={styles.newDate}>{item.date}</Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{message}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 2,
    // backgroundColor: '#D3D3D3',
    alignSelf: 'center',
  },
  row: {
    backgroundColor: 'white',
    opacity: 88,
    elevation: 2,
    borderRadius: 20,
    width: responsiveWidth(95),
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  name: {
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.7),
    letterSpacing: 1,
    marginBottom: 0.5,
    color: 'black',
  },
  date: {
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  newDate: {
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  row1: {
    width: responsiveWidth(60),

    flexDirection: 'row',
    gap: 10,
  },
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
});

export default userFranchise;
