import Main from './Main';
import Grafico from './Grafico';
import BTtela from './BTtela'
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation';

const Routes = createAppContainer(
  createStackNavigator({
    Main: Main,  
    Grafico: Grafico,

  })
);

export default Routes;