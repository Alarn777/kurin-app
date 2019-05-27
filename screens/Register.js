import Consts from '../ENV_VARS'
import Icon from 'react-native-vector-icons/Ionicons'
import RadioForm from 'react-native-simple-radio-button'
import React from 'react'
import { View, TextInput, Image, ImageBackground } from 'react-native'
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
import styles from './Register.style'
export default class Login extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <Image
        resizeMode="contain"
        style={styles.headerImage}
        source={require('../assets/logo.png')}
      />
    ),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      alignSelf: 'center'
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      address: '',
      cleaner: false,
      IconColor: '#8BC34A'
    }
    this.validateForm = this.validateForm.bind(this)
    this.registerUser = this.registerUser.bind(this)
  }
  componentDidMount() {
    this.setState({
      IconColor: '#8BC34A'
    })
  }

  validateForm() {
    if (this.state.password === '' || this.state.password !== this.state.password2) {
      this.setState({ IconColor: '#B80000' })
      this.setState({ password: '', password2: '' })
    } else {
      this.setState({ IconColor: '#8BC34A' })
      this.registerUser()
    }
  }
  registerUser() {
    let newUser = {}
    if (this.state.cleaner) {
      newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        address: this.state.address,
        cleaner: this.state.cleaner,
        available: false,
        avatar: 'https://www.w3schools.com/w3css/img_lights.jpg',
        about: '',
        rating: 0
      }
      fetch(Consts.host + '/createCleaner', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
        .then(() => {})
        .catch(() => {})
    } else {
      newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        address: this.state.address,
        cleaner: this.state.cleaner,
        avatar: '',
        rating: 0,
        description: '',
        favorite_cleaners: [],
        events: []
      }
      fetch(Consts.host + '/createUser', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
        .then(() => {})
        .catch(() => {})
    }

    //send to register route
  }

  onClickListener(viewId) {
    if (viewId === 'submit') {
      this.validateForm()
    }
  }

  render() {
    return (
      <ImageBackground source={require('./assets/Background.jpg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Image resizeMode="contain" style={styles.logo} source={require('../assets/logo.png')} />
          <View style={styles.inputContainer}>
            <Icon style={styles.inputIcon} name="ios-person" size={30} color="#8BC34A" />
            <TextInput
              style={styles.inputs}
              placeholder="Name"
              underlineColorAndroid="transparent"
              onChangeText={name => this.setState({ name })}
            />
          </View>
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
            <Icon style={styles.inputIcon} name="ios-lock" size={30} color={this.state.IconColor} />
            <TextInput
              style={styles.inputs}
              placeholder="Password"
              secureTextEntry
              underlineColorAndroid="transparent"
              onChangeText={password => this.setState({ password })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon style={styles.inputIcon} name="ios-lock" size={30} color={this.state.IconColor} />
            <TextInput
              style={styles.inputs}
              placeholder="Repeat password"
              secureTextEntry
              underlineColorAndroid="transparent"
              onChangeText={password2 => this.setState({ password2 })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon style={styles.inputIcon} name="ios-home" size={30} color="#8BC34A" />
            <TextInput
              style={styles.inputs}
              placeholder="Address"
              underlineColorAndroid="transparent"
              onChangeText={address => this.setState({ address })}
            />
          </View>
          <View style={styles.inputContainer}>
            <RadioForm
              style={styles.radioSelect}
              radio_props={[
                { label: 'Cleaner      ', value: true },
                { label: 'Customer', value: false }
              ]}
              formHorizontal
              labelHorizontal
              buttonColor={'#8BC34A'}
              animation
              onPress={value => {
                this.setState({ cleaner: value })
              }}
            />
          </View>
          <AwesomeButtonRick
            type="primary"
            width={200}
            style={styles.registerButton}
            onPress={() => this.onClickListener('submit')}
          >
            Register
          </AwesomeButtonRick>
        </View>
      </ImageBackground>
    )
  }
}
