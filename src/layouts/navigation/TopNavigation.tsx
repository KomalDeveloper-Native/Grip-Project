/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SubscriptionList from '../screens/Course/LeadScreen/SubscriptionList';
import LeadList from '../screens/Course/LeadScreen/LeadList';
import CustomTopNavigator from './CustomTopNavigator';
import FollowUP from '../screens/Course/LeadScreen/FollowUp';
import Stude from '../screens/Course/LeadScreen/Stude';

const Tab = createMaterialTopTabNavigator();

export default function TopNavigator({route}:any) {
  const {courseid,screen} = route.params;
  console.log(screen,'ffd')
  console.log(courseid,'ll','lal')
  return (
    <Tab.Navigator
      tabBar={props => <CustomTopNavigator {...props} />}
      initialRouteName={screen}>
      <Tab.Screen
        name="SubscriptionList"
        component={SubscriptionList}
        options={{tabBarLabel: 'Subscription'}}
        // initialParams={{courseid:courseid}}
      />
      <Tab.Screen
        name="LeadList" // Change this to "LeadList" to match navigation name
        component={LeadList}
        options={{tabBarLabel: 'Lead'}}
        initialParams={{courseid:courseid}}

      />
      <Tab.Screen
        name="FollowUpScreen" // Change this to "LeadList" to match navigation name
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
