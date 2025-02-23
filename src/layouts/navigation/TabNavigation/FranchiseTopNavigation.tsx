/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CustomFranchiseTopNavigation from './CustomFranchiseTopNavigation';
import InterestedFranchise from '../../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/InterestedFranchise';
import LeadFranchise from '../../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/LeadFranchise';
import FollowFrachise from '../../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/FollowFrachise';

const Tab = createMaterialTopTabNavigator();

export default function FranchiseTopNavigation({route}:any) {
  const {franchise_id,screenName} = route.params;
  console.log(screenName,'scre')
  return (
    <Tab.Navigator
      tabBar={props => <CustomFranchiseTopNavigation {...props} />}
      initialRouteName={screenName}>
      <Tab.Screen
        name="InterestedFranchise"
        component={InterestedFranchise}
        options={{tabBarLabel: 'Interested Parties'}}
        initialParams={{franchise_id:franchise_id}}
      />
      <Tab.Screen
        name="LeadFranchise"
        component={LeadFranchise}
        options={{tabBarLabel: 'Lead'}}
        initialParams={{franchise_id:franchise_id}}

      />
        <Tab.Screen
        name="FollowFrachise"
        component={FollowFrachise}
        options={{tabBarLabel: 'Followups'}}
        initialParams={{franchise_id:franchise_id}}

      />

  
    </Tab.Navigator>
  );
}
 