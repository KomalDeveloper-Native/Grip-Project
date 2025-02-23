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
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';

interface Props {}
const userFranchise: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState([]);
  const [message, setMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
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
    const storage = await getStorageData();
    const id = storage.response.user.id;
    let endpoint = ``;
    setLoading(true);
    try {
      endpoint = `lead-list-simple-user?user_id=1371`;
      console.log(endpoint, 'endpo');
      const response: any = await postMethod(endpoint);
      if (response.data.success === true) {
        setCourse(response.data.leads);
      }
      setMessage(response.data.message);

      console.log(response.data.message, message, 'dar');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };

  const ListDetailFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'userCourseDetail',
        params: {
          course_id: item,
        },
      }),
    );
  };

  return (
    <>
      <View style={{alignSelf: 'flex-start', margin: 10}}>
        <Icon name="arrow-back" size={25} onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            width: responsiveWidth(95),
            borderRadius: 10,
            marginBottom: 10,
            elevation: 1,
          }}>
          <Text style={{fontFamily: 'Roboto-Bold'}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: responsiveFontSize(2),
              }}>
              My joined courses
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
          ) : course.length > 0 ? (
            course.map(item => (
              <Pressable
                style={styles.row}
                key={item.id}
                onPress={() => ListDetailFun(item.id)}>
                <View style={styles.row1}>
                  <Avatar
                    size={40}
                    rounded
                    source={{uri: item.image}}
                    // containerStyle={{backgroundColor: 'lightgray'}}
                  />
                  <View>
                    <Text style={styles.name}>{item.course_name}</Text>
                    <Text style={styles.course}>By {item.trainer_name}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.row1}>
                    <Icon
                      // type="font"
                      name="update"
                      size={20}
                      color="black"
                    />
                    <Text style={styles.date}>{item.status}</Text>
                  </View>
                  <View style={styles.row1}>
                    <Icon
                      name="event"
                      type="material"
                      size={20}
                      color="black"
                    />
                    <Text style={styles.newDate}>{item.lead_date}</Text>
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
    width: responsiveWidth(40),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    width: responsiveWidth(40),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.7),
    letterSpacing: 1,
    marginBottom: 0.5,
    color: 'black',
  },
  date: {
    width: responsiveWidth(40),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  newDate: {
    width: responsiveWidth(40),

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
