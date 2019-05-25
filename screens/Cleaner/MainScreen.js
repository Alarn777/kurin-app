import * as React from 'react';
import { BottomNavigation, Text } from "react-native-paper";
import {View,Image} from 'react-native'


import Home from './Home'
import History from './History'
import Starred from './Starred'
import CleanerProfile from './CleanerProfile'


export default class MyComponent extends React.Component {
  // static navigationOptions = {
  //   headerTitle:(<Image resizeMode='contain' style={{height:40}}  source={require('../../assets/logo.png')}/>),
  //   headerTitleStyle:
  //     {
  //       flex:1,
  //       textAlign: 'center',
  //       alignSelf:'center'
  //     },
  // };


  state = {
    index: 0,
    routes: [
      { key: 'home', title: 'Home', icon: 'home',color: 'lightblue' },
      { key: 'History', title: 'History', icon: 'history',color: 'green' },
      { key: 'CleanerProfile', title: 'Profile', icon: 'person' ,color: 'blue' },
      { key: 'Starred', title: 'Rate', icon: 'star',color: '#ffc107' },

    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    home: Home,
    Starred: Starred,
    History: History,
    CleanerProfile: CleanerProfile
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />

    );
  }
}