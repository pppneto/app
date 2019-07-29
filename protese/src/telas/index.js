import Main from './Main';
import Grafico from './Grafico';
import { createAppContainer, createStackNavigator } from 'react-navigation';

const Routes = createAppContainer(
  createStackNavigator({
    Main: Main,
    Grafico: Grafico,
  })
);

export default Routes;