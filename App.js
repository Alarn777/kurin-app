/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import HomeScreenUser from './screens/User/MainScreen'
import HomeScreenCleaner from './screens/Cleaner/MainScreen'
import Login from './screens/Login'
import Register from './screens/Register'



import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Reducer from './FriendReducer';
import SocketIOClient from 'socket.io-client';
import Consts from "./ENV_VARS";

const store = createStore(Reducer);


const AppNavigator = createStackNavigator(
  {
    HomeScreenUser: {
      name: 'HomeScreenUser',
      screen: HomeScreenUser,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    HomeScreenCleaner: {
      name: 'HomeScreenCleaner',
      screen: HomeScreenCleaner,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    Login:Login,
    Register:Register,
  },
  {
    initialRouteName: 'Login'
  }
)


const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

  }


  render() {
    return(
      <Provider store={ store }>
        <AppContainer
        //   screenProps={ {
        //     currentFriends: this.state.currentFriends,
        //     possibleFriends: this.state.possibleFriends,
        //     addFriend: this.addFriend,
        //   } }
        />
      </Provider>
    )
  }
}
