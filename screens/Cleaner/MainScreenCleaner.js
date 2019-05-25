import * as React from 'react'
import { BottomNavigation, Text } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import { View, Image } from 'react-native'
import { NavigationActions, withNavigationFocus } from 'react-navigation'

import Starred from './StarredCleaner'
import HomeClean from './Home'
import HistoryClean from './History'
import CleanerProfile from './CleanerProfile'
import axios from 'axios'
import Consts from '../../ENV_VARS'

export default class MainScreenCleaner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      userEmail: this.props.navigation.state.params.userEmail,
      cleaners: [],
      change: false,
      user: null,
      color: 'green',
      routes: [
        {
          key: 'HomeClean',
          title: 'Home',
          // activeColor: '#8BC34A',
          icon: 'home',
          color: '#8BC34A',
          navigation: this.props.navigation
        },
        {
          key: 'HistoryClean',
          title: 'My cleans',
          icon: 'history',
          color: 'green',
          navigation: this.props.navigation,
          father: this
        },
        {
          key: 'Starred',
          title: 'Rate',
          icon: 'star',
          color: '#ffc107',
          // activeColor: '#F44336',
          navigation: this.props.navigation
        },
        {
          key: 'CleanerProfile',
          title: 'Profile',
          icon: 'person',
          color: 'blue',
          // activeColor: '#F44336',
          navigation: this.props.navigation
        }

      ]
    }
    this.resetNavigation = this.resetNavigation.bind(this)
  }

  static navigationOptions = {
    headerLeft: null,
    headerTitle: (
      <Image
        resizeMode="contain"
        style={{ height: 40 }}
        source={require('../../assets/logo.png')}
      />
    ),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      alignSelf: 'center'
    }
  }
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
      action: NavigationActions.navigate({ routeName: targetRoute })
    })

    this.props.navigation.dispatch(navigateAction)
  }

  _handleIndexChange = index => {
    this.setState({ index })
  }

  _renderScene = BottomNavigation.SceneMap({
    HomeClean,
    HistoryClean,
    CleanerProfile,
    Starred
  })

  render() {
    return (
      <BottomNavigation
          onPress={()=> {}}
        navigationState={this.state}
        //   navigationState={}
        // activeColor={'red'}
        // activeBackground={'blue'}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
        resetNavigation={this.resetNavigation}
      />
    )
  }
}