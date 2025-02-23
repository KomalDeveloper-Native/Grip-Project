/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Pressable,
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
import {getMethod, getStorageData} from '../../../../utils/helper';
import {useSelector} from 'react-redux';

interface Props {}
const RetreatTransaction: FC<Props> = ({navigation, route}): JSX.Element => {
  const {courseid} = route.params;
  const trainerId = useSelector(state => state.List.id);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  useFocusEffect(
    useCallback(() => {
      leadLisfun();
    }, [lead]),
  );

  const leadLisfun = async () => {
  let endpoint = ``;
  console.log(courseid)

    setLoading(true);
    try {
      if (courseid) {
        endpoint = `lead-list?course_id=${courseid}`;
      } else {
        endpoint = `lead-list-user?user_id=${trainerId}`;
      }
      console.log(endpoint,'endpo')
      const response: any = await getMethod(endpoint);
      console.log(response.data,'dar');
      if (response.data.success === true) {
        setLead(response.data.leads);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };

  const ListDetailFun = item => {
    console.log(item.suscription_id,'kj')
    navigation.dispatch(
      CommonActions.navigate({
        name: 'LeadDetailsView',
        params: {
          lead_id: item.id,
          subscription_id: item.suscription_id,

        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
        {
        lead.length>0 ?
          lead.map(item => (
            <Pressable
              style={styles.row}
              key={item.id}
              onPress={() => ListDetailFun(item)}>
              <View style={styles.row1}>
                <Avatar
                  size={40}
                  avatarStyle={{backgroundColor: '#D3D3D3'}}
                  rounded
                //   source={require('../../../img/one.jpeg')}
                />
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.course}>{item['course name']}</Text>
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
                  <Icon name="event" type="material" size={20} color="black" />
                  <Text style={styles.newDate}>{item['Lead Date']}</Text>
                </View>
              </View>
            </Pressable>
          ))
          :
          <View style={styles.modalView}>
          <Text style={styles.modalText}>
           Oops! No Lead Found 
          </Text>
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
    // backgroundColor: '#D3D3D3',
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
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.3),
    letterSpacing: 1,
    marginBottom: 0.5,
    color: 'black',
  },
  date: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  newDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  row1: {
    width: 110,
    flexDirection: 'row',
    gap: 10,
  },
  
  modalView: {
    width: 200,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    paddingHorizontal:10,
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

export default RetreatTransaction;
