/* eslint-disable prettier/prettier */
import React from 'react';
import {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {}

const handleBackPress = () => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate('DrawerNavigation'); // Replace with your default screen
  }
};

const ArrowIcon: FC<Props> = ({navigation}): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon
          name={'arrow-back'}
          color="black"
          size={25}
          // style={{transform: [{scaleX: 2.6}]}} // Stretches the arrow horizontally
          onPress={()=>navigation.goBack()}
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
