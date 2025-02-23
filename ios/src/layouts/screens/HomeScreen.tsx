/* eslint-disable prettier/prettier */
import React from 'react';
import { FC } from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import AppBarSearch from '../Component/AppBarSearch';

interface Props {}
const HomeScreen: FC<Props> = ({navigation}:any): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row'}}>
     <AppBarSearch navigation={navigation} color={'black'} icon={'arrow-back'} setResults={}/>
      </View>
    
      <View style={styles.row}>
        <Image source={require('../../img/photol1.png')} style={styles.image} />
        <View style={styles.column}>
          <Pressable style={styles.btn} onPress={()=>navigation.navigate('StudioIdentity')}>
            <Text style={styles.btnText}>Are you a Yoga Trainer ?</Text>
          </Pressable>
          <Pressable style={styles.btn1}>
            <Text style={styles.btnText}>Subscribe Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: responsiveWidth(95),
    height: responsiveHeight(25),
    resizeMode: 'cover',
    borderRadius: 20,
  },
  column: {
    flexDirection: 'column',
    textAlign: 'left',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    marginTop: -70,
    marginHorizontal: 30,
  },
  btn: {
    width: responsiveWidth(47),
    height: responsiveHeight(4),
    backgroundColor:'black',
    borderRadius: 30,
    alignItems:'flex-start',
    justifyContent: 'center',
    paddingHorizontal:10,
    color:'white'
  },
  btn1: {
    width: responsiveWidth(47),
    height: responsiveHeight(4),
    alignItems:'flex-start',
    backgroundColor: '#55555',
    borderRadius: 30,
    justifyContent: 'center',
    paddingHorizontal:10,
  },
  btnText:{
    fontFamily:"Roboto-Regular",
    color:'white',

  }
});

export default HomeScreen
