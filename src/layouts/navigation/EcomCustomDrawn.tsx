/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {useFocusEffect, CommonActions} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Text, View, StyleSheet, Pressable, FlatList} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getMethod} from '../../utils/helper2';
import {ProductList} from '../screens/Ecom/ProductList';

const colors = {
  white: '#fff',
  black: '#000',
  lightGray: '#f7f7f7',
  gray: '#808080',
};

const EcomCustomDrawn = ({navigation}) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  useFocusEffect(
    useCallback(async () => {
      await fetchCategory();
    }, []),
  );

  const fetchCategory = async () => {
    // console.log(storage.response.token)
    setLoading(true);
    try {
      const response = await getMethod('categories');
      console.log(response.data, 'data1');

      if (response.status === 200) {
        setCategory(response.data.children_data);
        return response.data.children_data;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return null;
    }
  };

  const sentFun = (id) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ProductList',
        params: {
          categoryId: id,
        },
      }),
    );
  };

  const toggleCategory = (index: number) => {
    setActiveCategory(activeCategory === index ? null : index);
    setActiveSubCategory(null); // Close subcategory when switching category
  };

  const toggleSubCategory = (index: number) => {
    setActiveSubCategory(activeSubCategory === index ? null : index);
  };

  const renderSubcategory = (subcategory: any[], categoryIndex: number,item) => {
    return (
      <View style={styles.subCategoryContainer}>
        {subcategory.map((sub, subIndex) => (
          <View key={subIndex}>
            <Pressable
              style={styles.subCategory}
              onPress={() => toggleSubCategory(subIndex)}>
              <Text style={styles.subCategoryName}>{sub.name}</Text>
              <MaterialCommunityIcons
                name={
                  activeSubCategory === subIndex ? 'chevron-up' : 'chevron-down'
                }
                size={25}
                color={colors.gray}
              />
            </Pressable>
            {/* Render Sub-Subcategory */}
            {activeSubCategory === subIndex && (
              <View style={styles.subSubCategoryContainer}>
                {sub['children_data'].map((subSub, subSubIndex) => (
                  <Pressable
                    key={subSubIndex}
                    style={styles.subSubCategory}
                    onPress={() => sentFun(item.id)}>
                    <Text style={styles.subSubCategoryName}>{subSub.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <FlatList
        data={category}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View>
            {/* Main Category */}
            <Pressable
              style={styles.category}
              onPress={() => toggleCategory(index)}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <MaterialCommunityIcons
                name={activeCategory === index ? 'chevron-up' : 'chevron-down'}
                size={25} 
                color={colors.black}
              />
            </Pressable>
            {/* Subcategory */}
            {activeCategory === index &&
              renderSubcategory(item['children_data'], index, item)}
          </View>
        )}
      />
    </View>
  );
};

export default EcomCustomDrawn;

const styles = StyleSheet.create({
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  categoryName: {
    fontSize: responsiveFontSize(1.8),

    fontWeight: '600',
    color: colors.black,
    fontFamily: 'Roboto-Bold',
  },
  subCategoryContainer: {
    backgroundColor: colors.white,
  },
  subCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.gray,
  },
  subCategoryName: {
    marginLeft: 15,
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.8),
    color: colors.black,
  },

  subSubCategory: {
    backgroundColor: 'white',
    elevation: 5,
    opacity: 5,

    paddingVertical: 15,
  },
  subSubCategoryName: {
    fontSize: responsiveFontSize(1.75),
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    marginBottom: 0,
    // marginTop:20,
    marginLeft: 50,
  },
});
