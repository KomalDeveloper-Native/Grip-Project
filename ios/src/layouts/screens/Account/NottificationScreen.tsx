/* eslint-disable prettier/prettier */
import React from 'react';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, Image} from 'react-native-elements';
import Appbar from '../../Component/Appbar';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Divider } from 'react-native-paper';

interface Props {}
const NotificationScreen: FC<Props> = ({navigation}): JSX.Element => {
  return (
    <><Appbar iconName={'more-vert'} navigation={navigation} /><View style={styles.container}>
      <View style={styles.row}>
        <Avatar size={55} rounded source={require('../../img/Rectangle92.png')} />
        <Text style={styles.title}>Neelima Jain <Text style={styles.title1}>has posted a new course</Text></Text>
        <Text style={styles.time}>15m</Text>
      </View>
      <Divider />
      <View style={styles.row}>
        <Avatar size={55} rounded source={require('../../img/Rectangle92.png')} />
        <Text style={styles.title}>Neelima Jain <Text style={styles.title1}>has posted a new course</Text></Text>
        <Text style={styles.time}>15m</Text>
      </View>
      <Divider />

      <View style={styles.row}>
        <Avatar size={55} rounded source={require('../../img/Rectangle92.png')} />
        <Text style={styles.title}>Neelima Jain <Text style={styles.title1}>has posted a new course</Text></Text>
        <Text style={styles.time}>15m</Text>
      </View>
      <Divider />
      <View style={styles.row}>
        <Avatar size={55} rounded source={require('../../img/Rectangle92.png')} />
        <Text style={styles.title}>Neelima Jain <Text style={styles.title1}>has posted a new course</Text></Text>
        <Text style={styles.time}>15m</Text>
      </View>
      <Divider />
    </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white',
  },
  row:{
    width:'98%',
    flexDirection:'row',
    padding:10,
    alignItems:'center',
   justifyContent:'space-between',

  },
  title:{
    width:responsiveWidth(57),
    color:'black',
    flexWrap:'wrap',
    fontSize:responsiveFontSize(2.4),
    fontFamily:'Roboto-Medium',

  },
  title1:{
    width:responsiveWidth(70),
    color:'black',
    flexWrap:'wrap',
    fontSize:responsiveFontSize(1.9),
    fontFamily:'Roboto-Regular',

  },

  time:{
    color:'black',
    fontSize:responsiveFontSize(2),
    fontFamily:'Roboto-Medium',
  }

});

export default NotificationScreen;
