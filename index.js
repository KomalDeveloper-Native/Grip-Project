/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { PaperProvider } from 'react-native-paper';
import store from './src/Redux/store';
import { Provider } from 'react-redux';

const AppRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppRedux);
export default AppRedux;
