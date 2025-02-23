/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {Avatar} from '@rneui/themed';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import {Icon} from 'react-native-elements';
import colors from '../../../style/colors';
import {getMethod, getStorageData} from '../../../../utils/helper';
import {useFocusEffect} from '@react-navigation/native';

interface Props {}
const ChangeLeadStatus: FC<Props> = ({navigation,route}): JSX.Element => {
  const {lead} = route.params;

  return (
    <View style={styles.container}>
      <MenuProvider>
        <View style={styles.row0}>
          <Icon name="arrow-back" type="material" color="black" size={25} onPress={()=>navigation.goBack()} />
          <View style={{flexDirection: 'row', gap: 20}}>
            <Icon
              name="chatbox-ellipses"
              type="ionicon"
              color="black"
              size={30}
            />
            <MenuPop navigation={navigation} />
            {/* <Icon name="more-vert" type="material" color="black" size={20} /> */}
          </View>
        </View>

        <View
              style={styles.row}
              key={lead.id}
              >
              <View style={styles.row1}>
                <Avatar
                  size={40}
                  avatarStyle={{backgroundColor: '#D3D3D3'}}
                  rounded
                  source={require('../../../img/one.jpeg')}
                />
                <View>
                  <Text style={styles.name}>{lead.name}</Text>
                  <Text style={styles.course}>{lead['course name']}</Text>
                </View>
              </View>
              <View>
                <View style={styles.row1}>
                  <Icon name="person" type="material" size={20} color="black" />
                  <Text style={styles.date}>{lead.status}</Text>
                </View>
                <View style={styles.row1}>
                  <Icon name="event" type="material" size={20} color="black" />
                  <Text style={styles.newDate}>{lead['Lead Date']}</Text>
                </View>
              </View>
            </View>
      </MenuProvider>
    </View>
  );
};

export const MenuPop = ({navigation}) => (
  <Menu>
    <MenuTrigger>
      <Icon name="more-vert" type="material" color="black" size={25} />
    </MenuTrigger>

    <MenuOptions>
      <MenuOption>
        <Pressable >
          <Text style={styles.menuText}>Change Lead Status</Text>
        </Pressable>
      </MenuOption>
      <MenuOption>
        <Pressable >
          <Text style={styles.menuText}> Close Lead</Text>
        </Pressable>
      </MenuOption>
    </MenuOptions>
  </Menu>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#D3D3D3',
    
      },
      row0: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    
      },

  row: {
    borderRadius: 10,
    flex:1,
    width: responsiveWidth(95),
    backgroundColor: 'white',
    
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  row1: {
    flexDirection: 'row',
    gap: 15,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',

    // gap: 10,
  },
  btn: {
    width: responsiveWidth(30),
    height: responsiveHeight(5),
    backgroundColor: 'white',
    elevation: 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
  },
  btnText: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
  },
  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
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
});

export default ChangeLeadStatus;
