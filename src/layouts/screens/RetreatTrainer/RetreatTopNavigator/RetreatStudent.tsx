/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Avatar} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';
import { Icon } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';

interface Props {}
const RetreatStudent: FC<Props> = (): JSX.Element => {
  const trainerId = useSelector(state => state.List.id);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [message, setMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    leadLisfun(); // re-fetch the data
    setRefreshing(false);

  };
  useFocusEffect(
    useCallback(() => {
      leadLisfun();
    }, []),
  );

  const leadLisfun = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    setLoading(true);
    try {
      const response: any = await postMethod(
        `user-retreat-student-list?user_id=${id}`,
      );
      console.log(response.data, 'dar');
      if (response.status===200) {
        setStudent(response.data.student_list);
        setMessage(response.data.message)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };
  return (
    <View style={styles.container}>
      {
        loading?
        <ActivityIndicator color='black' size={20} />
        :
         student ?

        <ScrollView
        style={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
        {student.map((item, index) => (
          <View style={styles.row} key={item.id}>
            <View style={styles.row1}>
              <Avatar
                size={40}
                avatarStyle={{backgroundColor: '#D3D3D3'}}
                rounded
                source={{
                  uri: item.image,
                }}
              />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.course}>{item.retreat}</Text>
              </View>
              <View style={styles.row1}>
                <Icon name="calendar" type='font-awesome' size={15} color={'black'} />
                <Text style={styles.date}>{item.applied_on}</Text>
              </View>
         
            </View>
            <View></View>
          </View>
        ))}
      </ScrollView>

      :   <View style={styles.modalView}>
      <Text style={styles.modalText}>
        {message}
      </Text>
    </View>
      }
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 2,
    alignSelf: 'center',
  },
  row: {
    backgroundColor: 'white',
    opacity: 88,
    elevation: 2,
    borderRadius: 20,
    width: responsiveWidth(95),
    height: responsiveHeight(10),
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
  date: {
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  course: {
    width: responsiveWidth(52),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.3),
    letterSpacing: 1,
    marginBottom: 0.5,
    color: 'black',
  },
  row1: {
    flexDirection: 'row',
    gap: 5,
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
    marginBottom: 15,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
});

export default RetreatStudent;
