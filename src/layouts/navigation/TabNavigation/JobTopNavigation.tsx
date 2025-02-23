/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CustomTopNavigator from '../CustomTopNavigator';
import ApplicationScreeen from '../../screens/TrainerJob/JobTopNavigator.tsx/ApplicationScreeen';
import CandidateScreen from '../../screens/TrainerJob/JobTopNavigator.tsx/CandidateScreen';
import CustomJobTopNavigation from './CustomJobTopNavigation';

const Tab = createMaterialTopTabNavigator();

export default function JobTopNavigation({route}:any) {
  const {jobid} = route.params;
  return (
    <Tab.Navigator
      tabBar={props => <CustomJobTopNavigation {...props} />}
      initialRouteName="Applications">
      <Tab.Screen
        name="Active"
        component={ApplicationScreeen}
        options={{tabBarLabel: 'Applications'}}
        initialParams={{jobid:jobid}}
      />
      <Tab.Screen
        name="Candidates" // Change this to "LeadList" to match navigation name
        component={CandidateScreen}
        options={{tabBarLabel: 'Candidates'}}
        initialParams={{jobid:jobid}}

      />
 
    </Tab.Navigator>
  );
}
