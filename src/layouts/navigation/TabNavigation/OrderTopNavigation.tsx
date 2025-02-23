/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CustomJobTopNavigation from './CustomJobTopNavigation';
import CompletedScreen from '../../screens/Ecom/Order/CompletedScreen';
import ActiveScreen from '../../screens/Ecom/Order/ActiveScreen';
import CancelScreen from '../../screens/Ecom/Order/CancelScreen';
import CustomOrderTopNavigation from './CustomOrderTopNavigation';

const Tab = createMaterialTopTabNavigator();

export default function OrderTopNavigation({route}:any) {
  // const {jobid,screen} = route.params;
  return (
    <Tab.Navigator
      tabBar={props => <CustomOrderTopNavigation {...props} />}
      initialRouteName="Completed">
             <Tab.Screen
        name="Active" // Change this to "LeadList" to match navigation name
        component={ActiveScreen}
        options={{tabBarLabel: 'Active'}}

      />
      <Tab.Screen
        name="Completed"
        component={CompletedScreen}
        options={{tabBarLabel: 'Completed'}}
      />
        <Tab.Screen
        name="Cencelled"
        component={CancelScreen}
        options={{tabBarLabel: 'Cencelled'}}
      />
 
 
    </Tab.Navigator>
  );
}
