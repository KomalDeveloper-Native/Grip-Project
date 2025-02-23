/* eslint-disable prettier/prettier */
import React from 'react';
import {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

interface Props {
}

const ArrowIcon: FC<Props> = ({navigation}): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon
          name={'arrow-back'}
          type="material"
          color="black"
          size={20}
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: 'white',
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderColor: 'white',
  },
});

export default ArrowIcon;
