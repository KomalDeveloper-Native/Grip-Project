/* eslint-disable prettier/prettier */
import { color } from '@rneui/base';
import React from 'react';
import { FC } from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import { Icon } from 'react-native-elements';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

interface Props {}
const ChatAppbar: FC<Props> = ({navigation}:any): JSX.Element => {
    return (
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Icon
                  name="arrow-back"
                  type="material"
                  color="black"
                  size={20}
                  onPress={() => navigation.goBack()}
                />
    
              <Image source={require('../img/one.jpeg')} style={styles.image} />
            </View>
            <Icon name="more-vert" type="material" color="black" size={25} />
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 10,
    backgroundColor:'white'

      },
    
      row: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 0,
      },
      image: {
        width: responsiveWidth(14),
        height: responsiveHeight(7),
        borderRadius: 50,
      },
    });
export default ChatAppbar;