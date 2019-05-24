import * as React from 'react';
import { BottomNavigation, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import {View,Image} from 'react-native'
import { NavigationActions } from 'react-navigation';
import { withNavigationFocus } from "react-navigation";
import Home from './Home'
import History from './History'
import CleanerProfile from './CleanerProfile'
import axios from "axios";
import Consts from "../../ENV_VARS";


export default class MainScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      index: 0,
      userEmail:this.props.navigation.state.params.userEmail,
      cleaners:[],
      change:false,
      user:null,

      routes: [
        { key: 'home', title: 'Home', icon: 'home',color: "#8BC34A", navigation: this.props.navigation,},
        { key: 'History', title: 'My cleans', icon: 'history',color: 'green', navigation: this.props.navigation,father:this},
        { key: 'CleanerProfile', title: 'Profile', icon: 'person' ,color: 'red', navigation: this.props.navigation,},
      ],
    };
    this.resetNavigation = this.resetNavigation.bind(this)
  }

  static navigationOptions = {
    headerLeft: null,
    headerTitle:(<Image resizeMode='contain' style={{height:40}}  source={require('../../assets/logo.png')}/>),
    headerTitleStyle:
      {
        flex:1,
        textAlign: 'center',
        alignSelf:'center'
      },
  };
  // check(){
  //   return this.state.change
  // }

  // componentDidMount(): void {
  //   // console.log(this.props.navigation)
  //   // console.log(this)
  // }

  // set(){
  //   this.setState({change: !this.state.change})
  // }

  resetNavigation(targetRoute) {
    const navigateAction = NavigationActions.navigate({
      routeName: targetRoute,
      index: 0,
      params:{ cleaners: index },
      action: NavigationActions.navigate({ routeName: targetRoute }),
    });

    this.props.navigation.dispatch(navigateAction);
  }

  _handleIndexChange = index => {

    this.setState({ index })
  };

  _renderScene = BottomNavigation.SceneMap({
    home: Home,
    History: History,
    CleanerProfile:CleanerProfile,
  });


  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
        resetNavigation={this.resetNavigation}
      />

    );
  }
}