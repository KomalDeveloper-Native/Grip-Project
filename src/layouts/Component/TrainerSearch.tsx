/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-sequences */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {getMethod} from '../../utils/helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {}

const TrainerSearch: FC<Props> = ({
  navigation,
  color,
  icon,
  setResults,
  setLoading,
  screenNavigate,
}): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (searchTerm.length > 0) {
        trainerSearch();
      } else {
        trainerSearch();
      }
    }, [searchTerm]),
  );

  const trainerSearch = async () => {
    setLoading(true);
    try {
      const response = await getMethod(
        `trainer-list?search=${searchTerm || ''}`,
      );
      setResults(response.data.response);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error('Error fetching data:', error);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.row}>
        <Pressable style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}
        onPress={() => navigation.goBack()}
        >
          {icon !== null ? (
          <Icon name={icon} type="material" color="black" size={25} />
          ) : null}

          <Image source={require('../img/one.jpeg')} style={styles.image} />
        </Pressable>

        <SearchBar
          fontColor="white"
          iconColor="white"
          shadowColor="#282828"
          cancelIconColor="white"
          backgroundColor="white"
          placeholder="Search here"
          onChangeText={text => setSearchTerm(text)}
          value={searchTerm}
          onSearchPress={() => console.log('Search Icon is pressed')}
          onCancel={() => {
            setSearchTerm('');
            trainerSearch(); // Trigger refresh when cancel is pressed
          }}
          inputContainerStyle={{
            width: 250,
            backgroundColor: 'white',
            height: 30,
            alignItems: 'center',
            borderColor: 'white',
            borderRadius: 50,
            borderWidth: 1,
          }}
          containerStyle={{
            backgroundColor: 'white',
            borderRadius: 50,
            alignItems: 'center',
            borderColor: 'white',
          }}
        />
      </View>
      <Icon 
        name="bell"
        type="material-community" 
        color="black" 
        size={25} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#d3d3d3',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    width: '85%',
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

export default TrainerSearch;
