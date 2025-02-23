/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CustomTopNavigator from '../CustomTopNavigator';
import Booking from '../../screens/RetreatTrainer/RetreatTopNavigator/Booking';
import Stude from '../../screens/Course/LeadScreen/Stude';
import RetreatLead from '../../screens/RetreatTrainer/RetreatTopNavigator/RetreatLead';
import FollowUP from '../../screens/Course/LeadScreen/FollowUp';
import RetreatFollow from '../../screens/RetreatTrainer/RetreatTopNavigator/RetreatFollow';
import RetreatStudent from '../../screens/RetreatTrainer/RetreatTopNavigator/RetreatStudent';
import CustomRetreatTopNavigator from './CustomRetreatTopNavigator';

const Tab = createMaterialTopTabNavigator();

export default function RetreatTopNavigator({route}:any) {
  const {retreatid,screen} = route.params;
  return (
    <Tab.Navigator
      tabBar={props => <CustomRetreatTopNavigator {...props} />}
      initialRouteName={screen}>
      <Tab.Screen
        name="Booking"
        component={Booking}
        options={{tabBarLabel: 'Booking'}}
        // initialParams={{courseid:courseid}}
      />
      <Tab.Screen
        name="Lead" // Change this to "LeadList" to match navigation name
        component={RetreatLead}
        options={{tabBarLabel: 'Lead'}}
        // initialParams={{courseid:courseid}}

      />
      <Tab.Screen
        name="FollowUp" // Change this to "LeadList" to match navigation name
        component={RetreatFollow}
        options={{tabBarLabel: 'Followups'}}
        initialParams={{retreatid:retreatid}}

      />
      <Tab.Screen
        name="Student" // Change this to "LeadList" to match navigation name
        component={RetreatStudent}
        options={{tabBarLabel: 'Students'}}
        // initialParams={{courseid:courseid}}

      />
    </Tab.Navigator>
  );
}
