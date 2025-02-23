/* eslint-disable prettier/prettier */
import React from 'react';
import { FC } from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../../style/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Icon } from 'react-native-elements';
  
interface Props {}
const UploadCirtificate: FC<Props> = (): JSX.Element => {
  return (

        <View style={styles.container}>
          <Icon
            name="arrow-back"
            size={20}
            color={'black'}
            style={{marginBottom: 20,alignItems:'flex-start'}}
          />
          <ScrollView>
            <Text style={styles.text}>Upload Certificate </Text>
            <View style={styles.textrow}>
              <TextInput placeholder=" Certificate Name " style={styles.textInput} />
            </View>
            <View style={styles.textrow}>
              <TextInput placeholder="Upload Certificate " style={styles.textInput} />
            </View>
          
            <Pressable style={styles.btn}>
                <Text style={styles.btnText}>Save</Text>
            </Pressable>
          </ScrollView>
        </View>
      );

};

const styles = StyleSheet.create({
    container: {
      width:'100%',
      flex: 1,
      padding: 10,
      alignSelf: 'center',
      backgroundColor: 'white',
    },
    text: {
      width: responsiveWidth(90),
  
      color: 'black',
      fontFamily: 'Roboto-Bold',
      fontSize: responsiveFontSize(2.2),
      marginBottom: 10,
      alignSelf: 'center',
  
    },
    textInput: {
      width: responsiveWidth(90),
      height: responsiveHeight(7),
      backgroundColor: colors.white,
      elevation: 1.5,
      borderBottomStartRadius: 15,
      borderTopLeftRadius: 15,
      borderBottomRightRadius: 15,
      borderTopEndRadius: 15,
      opacity: 55.15,
      marginBottom: 10,
      color: colors.black,
      fontSize: responsiveFontSize(2),
      fontFamily: 'Roboto-Bold',
      // borderWidth: 0.1,
      overflow: 'hidden',
      borderRightColor: 'white',
      // borderColor: 'white',
      alignSelf: 'center',
  
    },
    textInput0: {
      width: responsiveWidth(90),
      paddingBottom: 50,
      backgroundColor: colors.white,
      elevation: 1.5,
      borderBottomStartRadius: 15,
      borderTopLeftRadius: 15,
      borderBottomRightRadius: 15,
      borderTopEndRadius: 15,
      opacity: 55.15,
      marginBottom: 10,
      color: colors.black,
      fontSize: responsiveFontSize(2),
      fontFamily: 'Roboto-Bold',
      // borderWidth: 0.1,
      overflow: 'hidden',
      alignSelf: 'center',
      borderRightColor: 'white',
      // borderColor: 'white',
    },
  
    textrow: {
      marginBottom: 10,
    },
    btn: {
      backgroundColor: colors.black,
      width: wp('87%'),
      height: hp('7%'),
      alignSelf: 'center',
      alignItems: 'center',
      padding: 10,
      marginVertical: 20,
      borderRadius: 8,
      elevation: 0.05,
      marginBottom: 15,
      justifyContent: 'center',
    },
    btnText: {
      color: colors.white,
      fontSize: 18,
      fontFamily: 'Roboto-Medium',
    },
  });

export default UploadCirtificate;