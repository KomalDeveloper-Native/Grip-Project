/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {FC, useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import {getMethod} from '../../../utils/helper2';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {ActivityIndicator, Provider} from 'react-native-paper';
import {Icon} from 'react-native-elements';

interface Props {}
export const ProductList: FC<Props> = ({navigation, route}) => {
  const {categoryId} = route.params;
  const [product, setProduct] = useState<[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState([]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProduct();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, []),
  );

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await getMethod(
        `products?searchCriteria[filter_groups][0][filters][0][field]=type_id&searchCriteria[filter_groups][0][filters][0][value]=simple&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=category_id&searchCriteria[filter_groups][1][filters][0][value]=6&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&searchCriteria[filter_groups][2][filters][0][field]=visibility&searchCriteria[filter_groups][2][filters][0][value]=4&fields=items[id,sku,name,price,description,custom_attributes[short_description,special_price,],media_gallery_entries[types,file]]&searchCriteria[filter_groups][1][filters][0][value]=${categoryId}`,
      );
      console.warn(response.data.items);

      if (response.status === 200) {
        setProduct(response.data.items);
        // setImage(response.data.media_gallery_entries[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const sentFun = (item: never,specialPrice: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Description',
        params: {
          sku: item.sku,
          specialPrice :specialPrice 
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Pressable onPress={() => navigation.goBack()}>
        <Icon
          type="material"
          name="arrow-back"
          size={25}
          color={'black'}
          style={{
            marginLeft: 10,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
          }}
        />
      </Pressable>
      {loading ? (
        <ActivityIndicator size={25} color="black" />
      ) : (
        <FlatList
        data={product}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.gridContainer}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        renderItem={({ item }) => {
          // Fetch primary image or fallback to the first image
          const primaryImage =
            item.media_gallery_entries?.find((entry) => entry.types?.includes('image')) ||
            item.media_gallery_entries?.[0];
      
          const imageUrl = primaryImage
            ? `https://gripkart.com/pub/media/catalog/product${primaryImage.file}`
            : 'https://via.placeholder.com/150'; // Fallback if no image found
      
          // Dynamically find special_price from custom_attributes
          const specialPriceEntry = Object.values(item.custom_attributes || {}).find(
            (attr) => attr.attribute_code === 'special_price'
          );
          const specialPrice = specialPriceEntry ? specialPriceEntry.value : null;
      
          return (
            <Pressable style={styles.productCard} onPress={() => sentFun(item,parseFloat(specialPrice).toFixed(2))}>
              <Image source={{ uri: imageUrl }} style={styles.productImage} />
              <Text style={styles.productName}>
                {item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name}
              </Text>
      
              {specialPrice && (
              <Text style={styles.productSpecialPrice}>Rs{item.price}</Text>

              
              )}
        <Text style={styles.productPrice}>
                 Rs {parseFloat(specialPrice).toFixed(2)}
                </Text>
            </Pressable>
          );
        }}
      />
      
      
      
      )}

      {/* Product Grid */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems:'flex-start'
  },
  header: {
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gridContainer: {
    paddingVertical: 10,
  },
  productCard: {
    flex: 0.7,
    margin: 15,
    // marginHorizontal:15,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    padding: 10,
    elevation: 5,
    opacity: 1,
    width: responsiveWidth(45),
    justifyContent: 'center',
  },
  productImage: {
    width: responsiveWidth(34),
    height: responsiveHeight(25),
    resizeMode: 'contain',
  },
  productName: {
    width: responsiveWidth(35),
    minHeight: responsiveHeight(3),
    lineHeight: 15,

    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontSize: responsiveFontSize(1.65),
    marginBottom: 10,
  },
  productPrice: {
    width: responsiveWidth(40),

    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.6),
  },
  productSpecialPrice:{

    width: responsiveWidth(40),
    color:'gray',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
    textDecorationLine:'line-through'
  },
});
