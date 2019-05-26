import UserScreen from './User/MainScreen'
import CleanerScreen from './Cleaner/MainScreenCleaner'
import Icon from 'react-native-vector-icons/Ionicons'
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  ImageBackground
} from 'react-native'
import axios from 'axios'
import Consts from '../ENV_VARS'
import SocketIOClient from 'socket.io-client'
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';

export default class Login extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <Image resizeMode="contain" style={{ height: 40 }} source={require('../assets/logo.png')} />
    ),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      alignSelf: 'center',
      lockIconColor: '',
      renderUser: false,
      renderCleaner: false
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      userToken: ''
    }
    this.fetchData = this.fetchData.bind(this)
    this.dealWithData = this.dealWithData.bind(this)
  }

  componentDidMount(): void {
    this.setState({ lockIconColor: '#8BC34A' })
  }

  onClickListener = viewId => {
    if (viewId === 'register') {
      this.props.navigation.navigate('Register')
    }
    if (viewId === 'login') {
      //simplifyLogin
      this.props.navigation.navigate('HomeScreenCleaner', {
        userToken: 'asdasd',
        userEmail:'Mona@gmail.com'
      });

      // this.props.navigation.navigate('HomeScreenUser', {
      //   userToken: 'asdasd',
      //   userEmail: 'John@gmail.com'
      // })

      // this.fetchData()

      // this.setState({renderCleaner:true})
      // this.props.navigation.navigate('HomeScreenUser')
    }
  }

  async fetchData() {
    try {
      const response = await axios.post(Consts.host + '/login', {
        email: this.state.email,
        password: this.state.password
      })
      this.dealWithData(response.data)
    } catch (err) {}
  }

  dealWithData(data) {
    if (data.userToken) {
      this.setState({ userToken: data.userToken })
      this.props.navigation.navigate('HomeScreenUser', {
        userToken: this.state.userToken,
        userEmail: this.state.email
      })
    } else {
      this.setState({ lockIconColor: '#B80000', password: '' })
    }
  }

  validateLogin() {
    // if(this.state.password !== '1'){
    //   this.setState({lockIconColor: "#B80000" })
    // }
    // else {
    //   this.setState({lockIconColor: "#8BC34A" })
    // }

    //api call

    this.fetchData()

    //if user
    // this.props.navigation.navigate('HomeScreenUser', {
    //   userToken: ''
    // });
  }

  render() {
    return (
      <ImageBackground
        source={require('./assets/Background.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <Image
            resizeMode="contain"
            style={{ height: 100, marginBottom: 20 }}
            source={require('../assets/logo.png')}
          />
          <Text
            style={{
              fontFamily: 'arial',
              fontSize: 20,
              color: '#141823',
              marginBottom: 100
            }}
          >
            Faster and reliable cleaning process
          </Text>
          <View style={styles.inputContainer}>
            <Icon style={styles.inputIcon} name="ios-mail" size={30} color="#8BC34A" />
            <TextInput
              style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid="transparent"
              onChangeText={email => this.setState({ email })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              style={styles.inputIcon}
              name="ios-lock"
              size={30}
              color={this.state.lockIconColor}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Password"
              secureTextEntry
              underlineColorAndroid="transparent"
              onChangeText={password => this.setState({ password })}
            />
          </View>
          <AwesomeButtonRick
            type="anchor"
            width={200}
            style={{margin:15}}
            onPress={() => this.onClickListener('login')}
          >
            Login
          </AwesomeButtonRick>
          <AwesomeButtonRick
            type="primary"
            width={200}
            style={{margin:15}}
            onPress={() => this.onClickListener('register')}
          >
            Register
          </AwesomeButtonRick>

          <TouchableHighlight
            style={styles.buttonContainer}
            onPress={() => this.onClickListener('restore_password')}
          >
            <Text style={{color:'white'}}>Forgot your password?</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    // backgroundColor: '#DCDCDC'
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30
  },
  loginButton: {
    backgroundColor: '#8BC34A'
  },
  registerButton: {
    backgroundColor: '#00BCD4'
  },
  loginText: {
    // color: 'white',
  }
})
