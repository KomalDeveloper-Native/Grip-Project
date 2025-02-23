/* eslint-disable prettier/prettier */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FC} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  iconName: string;
}

const Appbar: FC<Props> = ({iconName}): JSX.Element => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable style={{flexDirection: 'row',alignItems:'center'}}
         onPress={() => navigation.goBack()}
        >
          <Icon
             name={'arrow-back'}
             color="black"
             type='material'
             size={25}
            //  style={{transform: [{scaleX: 2.6}]}} // Stretches the arrow horizontally
            //  onPress={()=>navigation.goBack()}
           
          />
          <Image source={require('../img/one.jpeg')} style={styles.image} />
        </Pressable>
        <Icon name={iconName} type="material" color="black" size={20} />
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
    marginLeft:10
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});

export default Appbar;
