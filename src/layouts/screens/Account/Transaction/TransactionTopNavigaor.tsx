/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TransactionCustomTopNavigator from './TransactionCustomTopNavigator';
import CourseTransaction from './CourseTransaction';
import RetreatTransaction from './RetreatTransaction';
const Tab = createMaterialTopTabNavigator();

export default function TransitionTopNavigator({route}:any) {

  return (
    <Tab.Navigator
      tabBar={props => <TransactionCustomTopNavigator {...props} />}
      initialRouteName={'CourseTransaction'}>
      <Tab.Screen
        name="CourseTransaction"
        component={CourseTransaction}
        options={{tabBarLabel: 'Course'}}
        // initialParams={{courseid:courseid}}
      />
      <Tab.Screen
        name="RetreatTransaction" // Change this to "LeadList" to match navigation name
        component={RetreatTransaction}
        options={{tabBarLabel: 'Retreat'}}
        // initialParams={{courseid:courseid}}

      />
    
    </Tab.Navigator>
  );
}
