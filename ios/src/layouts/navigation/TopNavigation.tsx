/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SubscriptionList from '../screens/Course/TopNavigationScreen/SubscriptionList';
import LeadList from '../screens/Course/TopNavigationScreen/LeadList';
import CustomTopNavigator from './CustomTopNavigator';
import FollowUP from '../screens/Course/TopNavigationScreen/FolluwUp';
import Stude from '../screens/Course/TopNavigationScreen/Stude';

const Tab = createMaterialTopTabNavigator();

export default function TopNavigator({route}:any) {
  const {courseid} = route.params;
  console.log(courseid,'ll','lal')
  return (
    <Tab.Navigator
      tabBar={props => <CustomTopNavigator {...props} />}
      initialRouteName="Subscription">
      <Tab.Screen
        name="Subscription"
        component={SubscriptionList}
        options={{tabBarLabel: 'Subscription'}}
        // initialParams={{courseid:courseid}}
      />
      <Tab.Screen
        name="LeadName" // Change this to "LeadList" to match navigation name
        component={LeadList}
        options={{tabBarLabel: 'Lead'}}
        initialParams={{courseid:courseid}}

      />
      <Tab.Screen
        name="FollowUpName" // Change this to "LeadList" to match navigation name
        component={FollowUP}
        options={{tabBarLabel: 'Followups'}}
        initialParams={{courseid:courseid}}

      />
      <Tab.Screen
        name="StudeName" // Change this to "LeadList" to match navigation name
        component={Stude}
        options={{tabBarLabel: 'Students'}}
        initialParams={{courseid:courseid}}

      />
    </Tab.Navigator>
  );
}
