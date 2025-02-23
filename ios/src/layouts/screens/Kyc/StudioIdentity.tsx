/* eslint-disable prettier/prettier */
import React from 'react';
import {FC} from 'react';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface Props {}
const StudioIdentity: FC<Props> = ({navigation}:any): JSX.Element => {
  return (
    <View style={styles.container}>
      <Icon name="arrow-back" type="MaterialIcons" color={'black'} size={30} onPress={()=>navigation.goBack()} />
      <View style={styles.container1}>
        <Image
          source={require('../../img/ByNeelmaJain.png')}
          style={styles.image}
        />
        <Text style={styles.text}>Verify Your Studio Idenity</Text>
        <Text style={styles.text0}>
          Verify Your Studio Identity by providing accurate details,
          authentication, and supporting documents to ensure security and
          legitimacy in your fitness workspace.
        </Text>
        <Pressable style={styles.btn} onPress={()=>navigation.navigate('SubmitStudio')}>
          <Text style={styles.text1}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    padding: 10,

  },
  container1: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 50,

  },
  image: {
    width: responsiveWidth(30),
    height: responsiveHeight(15),
    marginBottom: 30,
  },
  text: {
    width: responsiveWidth(100),
    textAlign: 'center',
    flexWrap: 'nowrap',
    fontFamily: 'Roboto-Black',
    fontSize: responsiveFontSize(2.8),
    letterSpacing: 2.5,
    color: 'black',
    marginBottom: 20,
  },
  text0: {
    width: responsiveWidth(87),
    textAlign: 'center',
    flexWrap: 'nowrap',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
    marginBottom: 250,
    letterSpacing: 1,

  },
  btn: {
    width: responsiveWidth(87),
    height:responsiveHeight(6),
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'center',
    backgroundColor:'white',
    elevation:3.5,
    opacity:328,
    borderRadius:10,
  },
  text1: {
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.8),
    color: 'black',
  },
});

export default StudioIdentity;
