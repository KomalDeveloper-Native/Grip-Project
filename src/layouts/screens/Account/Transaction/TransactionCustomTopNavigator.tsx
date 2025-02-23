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
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

function TransactionCustomTopNavigator({state, descriptors, navigation, position}) {
  return (
    <>
      <View style={styles.row0}>
        <Pressable style={{flexDirection:'row',alignItems:"center",gap:5}}    onPress={() => navigation.goBack()}>
        <Icon
          name="arrow-back"
          size={20}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
        {/* <Image source={require('../img/gripTop.jpg')} style={styles.logoImage} /> */}
        </Pressable>
    
        {/* <MenuProvider> */}
        <Icon name="more-vert" type="material" color="black" size={25} />
        {/* <MenuPop navigation={navigation} /> */}
        {/* </MenuProvider> */}
      </View>

      <View style={{flexDirection: 'row',width:responsiveWidth(100)}}>
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

export const MenuPop = ({navigation, item}: any) => {
  return (
    <Menu>
      <MenuTrigger>
        <Icon name="more-vert" type="material" color="black" size={25} />
      </MenuTrigger>

      <MenuOptions>
        <MenuOption>
          <Pressable>
            <Text style={styles.menuText}>Edit</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => navigation.navigate('SubscriptionList')}>
            <Text style={styles.menuText}>Subscription</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => navigation.navigate('LeadDetailsView')}>
            <Text style={styles.menuText}>Leads</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => navigation.navigate('FollowUp')}>
            <Text style={styles.menuText}>Follow Ups</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => navigation.navigate('Student')}>
            <Text style={styles.menuText}>Students</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Text style={styles.menuText}>Disable</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',

    alignSelf: 'center',
  },

  row0: {
    width: responsiveWidth(95),
    alignSelf: 'center',
    paddingVertical: 5,
    opacity:9989,
    backgroundColor: '#F5F5F5',

    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  
  },

  logoImage: {
    width: responsiveWidth(10),
    height: responsiveHeight(5),
  },

  row: {
    backgroundColor: 'white',
    opacity: 0.88,
    width: responsiveWidth(26.25), // Adjust the width as needed
    height: responsiveHeight(7),
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    color: 'black',
  },
  activeTab: {
    width: responsiveWidth(25), // Adjust the width as needed

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

export default TransactionCustomTopNavigator;
