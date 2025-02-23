/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Avatar} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';

interface Props {}
const Stude: FC<Props> = (): JSX.Element => {
  const trainerId = useSelector(state => state.List.id);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [message, setMessage] = useState([]);

  useFocusEffect(
    useCallback(() => {
      leadLisfun();
    }, []),
  );

  const leadLisfun = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    setLoading(true);
    const row = {
      userId: id,
    };
    try {
      const response: any = await postMethod(
        'course-subscription-student',
        row,
      );
      console.log(response.data, 'dar');
      if (response.data.status === 'success') {
        setStudent(response.data.followUp);
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
      <ScrollView
        style={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
          {
            student.length>0 ?
            student.map((item, index) => (
              <View style={styles.row} key={item.id}>
                <View style={styles.row1}>
                  <Avatar
                    size={40}
                    avatarStyle={{backgroundColor: '#D3D3D3'}}
                    rounded
                    source={require('../../../img/one.jpeg')}
                  />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.course}>{item.course_name}</Text>
                  </View>
                </View>
                <View></View>
              </View>
            ))
            :
            <View style={styles.modalView}>
            <Text style={styles.modalText}>Oops! No Subscription found</Text>
          </View>
          }
       
      </ScrollView>
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
    width: responsiveWidth(20),
    minHeight: 20,
    maxHeight: responsiveHeight(40),
    marginBottom: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    maxWidth: responsiveWidth(35),

    minHeight: 20,
    maxHeight: responsiveHeight(40),
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.3),
    letterSpacing: 1,
    color: 'black',
  },

  row1: {
    flexDirection: 'row',
    gap: 10,
  },
  
  modalView: {
    width: responsiveWidth(80),
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
    width:responsiveWidth(60),
    marginBottom: 15,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  }, 
});

export default Stude;
