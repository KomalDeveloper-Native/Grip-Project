/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-sequences */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import {getMethod, getStorageData, postMethod} from '../../utils/helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {}

const FranchiseSearch: FC<Props> = ({color, icon, setResults, setLoading}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [searchTerm]),
  );

  const fetchData = async () => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    setLoading(true);
    const row = {
      current_user: login_user,
    };
    try {
      const response = await postMethod(
        `franchise-list?search=${searchTerm || ''}`,
        row,
      );
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DrawerNavigation'); // Replace with your default screen
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.row}>
        <Pressable
          style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}
          onPress={() => handleBackPress()}>
          {icon !== null ? (
            <Icon name={icon} type="material" color="black" size={25} />
          ) : null}

          <Image source={require('../img/one.jpeg')} style={styles.image} />
        </Pressable>

        <SearchBar
          fontColor="black"
          iconColor="white"
          shadowColor="#282828"
          cancelIconColor="black"
          backgroundColor="white"
          placeholder="Search here"
          onChangeText={text => setSearchTerm(text)}
          value={searchTerm}
          onSearchPress={() => console.log('Search Icon is pressed')}
          onCancel={() => {
            setSearchTerm('');
            fetchData();
          }}
          inputContainerStyle={{
            width: 250,
            backgroundColor: 'white',
            height: 30,
            alignItems: 'center',
            // borderRadius: 50
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
    width: '90%',
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
  resultsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default FranchiseSearch;
