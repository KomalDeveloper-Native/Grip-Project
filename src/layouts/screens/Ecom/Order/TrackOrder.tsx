/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import StepIndicator from 'react-native-step-indicator';

interface Props {}

const TrackOrderScreen: FC<Props> = ({navigation}) => {
  const [orderStatus, setOrderStatus] = useState([
    {label: 'Order Placed', date: '08 October, 12:00 PM', completed: true},
    {label: 'In Progress', date: '10 October, 12:00 PM', completed: true},
    {label: 'Shipped', date: '14 October, 6:00 PM', completed: false},
    {label: 'Delivered', date: '15 October 2024', completed: false},
  ]);

  const products = [
    {
      id: 1,
      name: 'Grip Bheem Gada',
      category: 'Fitness',
      price: 'Rs 899.00',
      image: 'https://via.placeholder.com/70',
    },
    {
      id: 2,
      name: 'Grip Tongue Drum',
      category: 'Meditation Entertainment',
      price: 'Rs 4,999.00',
      image: 'https://via.placeholder.com/70',
    },
    {
      id: 3,
      name: 'Grip Mandala Mat',
      category: 'Yoga Mat',
      price: 'Rs 1,299.00',
      image: 'https://via.placeholder.com/70',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.row}>
        <Icon
          type="material"
          name="arrow-back"
          size={25}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
      <Text style={styles.header}>Track Order</Text>

      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.productContainer}>
            <Image source={{uri: item.image}} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <Icon name="remove" size={20} color="black" />
              <Text style={styles.quantityText}>1</Text>
              <Icon name="add" size={20} color="black" />
            </View>
          </View>
        )}
      />

      {/* Order Details */}
      <ScrollView>

      <View style={styles.orderDetails}>
        <Text style={styles.sectionHeader}>Order Details</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Expected Delivery Date</Text>
          <Text style={styles.detailsValue}>15 October 2024</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Transaction ID</Text>
          <Text style={styles.detailsValue}>TRESMKMS89ND</Text>
        </View>
      </View>

      {/* Order Status */}
      <View style={styles.orderStatus}>
        <Text style={styles.sectionHeader}>Order Status</Text>
        {/* Step Indicator */}
        <StepIndicator
          customStyles={customStepStyles}
          currentPosition={orderStatus.findIndex(status => !status.completed)}
          labels={orderStatus.map(status => status.label)}
          stepCount={4}
          // direction={'vertical'}
        />
      </View>
      </ScrollView>

    </View>
  );
};

const customStepStyles = {
  stepIndicatorSize: 20,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#000',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#000',
  stepStrokeUnFinishedColor: '#aaa',
  separatorFinishedColor: '#000',
  separatorUnFinishedColor: '#aaa',
  stepIndicatorFinishedColor: '#000',
  stepIndicatorUnFinishedColor: '#fff',
  stepIndicatorCurrentColor: '#000',
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 10,
  stepIndicatorLabelCurrentColor: '#fff',
  stepIndicatorLabelFinishedColor: '#fff',
  stepIndicatorLabelUnFinishedColor: '#aaa',
  labelColor: '#999',
  labelSize:responsiveFontSize(1.8),
  currentStepLabelColor: '#000',
  labelFontFamily:'Roboto-Medium',
  labelAlign:'left'
  // StepIndicator:24
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  row: {
    width: responsiveWidth(65),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
    marginRight: 0,
    alignSelf: 'flex-start',
    marginLeft:-8
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCategory: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 14,
    color: 'gray',
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderStatus: {
    marginTop: 16,
    // height:responsiveHeight(30)
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  completed: {
    backgroundColor: 'black',
  },
  pending: {
    backgroundColor: '#e0e0e0',
  },
  statusDetails: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusDate: {
    fontSize: 12,
    color: 'gray',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrackOrderScreen;
