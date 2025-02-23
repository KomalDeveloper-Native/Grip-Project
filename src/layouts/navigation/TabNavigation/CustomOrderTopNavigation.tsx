/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
import {CommonActions} from '@react-navigation/native';
import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

function CustomOrderTopNavigation({state, descriptors, navigation, position}) {
  return (
    <>
      <View style={styles.row0}>
      <View style={styles.appbar}>
        <Icon
          type="material"
          name="arrow-back"
          size={25}
          color={'black'}
          style={{marginLeft: 10}}
        />
        <Text style={styles.text}>My Order</Text>
      </View>
      </View>

      <View style={{flexDirection: 'row'}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0)),
          });

          return (
            <TouchableOpacity
              key={index} // <-- Add unique key prop here
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.row, isFocused && styles.activeTab]}>
              <Animated.Text
                style={[styles.label, isFocused && styles.activeLabel]}>
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(100),

    backgroundColor:'white',
    alignSelf: 'center',
  },

  row0: {
    width: responsiveWidth(100),
    alignSelf: 'center',
    backgroundColor:'white',

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appbar: {
    width: responsiveWidth(60),
    // backgroundColor:'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'center',
  },

  logoImage: {
    width: responsiveWidth(15),
    height: responsiveHeight(5),
  },

  row: {
    backgroundColor: 'white',
    opacity: 0.88,
    width: responsiveWidth(35), // Adjust the width as needed
    height: responsiveHeight(7),
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    color: 'black',
  },
  activeTab: {
    width: responsiveWidth(35), // Adjust the width as needed

    justifyContent: 'center',
    backgroundColor: 'white', // Change the background color of the active tab
  },
  label: {
    color: 'black', // Default color for label
  },
  activeLabel: {
    fontWeight: 'bold', // Bold style for active label
  },
});

export default CustomOrderTopNavigation;
