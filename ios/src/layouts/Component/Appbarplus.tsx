/* eslint-disable prettier/prettier */
import React from 'react';
import {FC} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

interface Props {}
const AppbarPlus: FC<Props> = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={require('../img/one.jpeg')} style={styles.image} />
        <Icon name="plus" type="material-community" color="black" size={20} />
      </View>
      <Divider />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },

  image: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
    borderRadius: 50,
  },
  row: {
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    padding:10,
  },
});

export default AppbarPlus;
