import LinearGradient from 'react-native-linear-gradient';
import Consts from '../ENV_VARS'
import UserScreen from './User/MainScreen'
import CleanerScreen from './Cleaner/MainScreen'
import Icon from 'react-native-vector-icons/Ionicons';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import React, { Component, } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Picker,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  ImageBackground
} from 'react-native';



export default class Login extends React.Component {
  static navigationOptions = {
    headerTitle:(<Image resizeMode='contain' style={{height:40}}  source={require('../assets/logo.png')}/>),
    headerTitleStyle:
      {
        flex:1,
        textAlign: 'center',
        alignSelf:'center'
      },
  };
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email   : '',
      password: '',
      password2:'',
      address:'',
      cleaner: false,
      IconColor:'#8BC34A'

    }
    this.validateForm = this.validateForm.bind(this)
    this.registerUser = this.registerUser.bind(this)
  }
  componentDidMount(): void {
    this.setState({
      IconColor: "#8BC34A"})
  }

  validateForm(){
    if(this.state.password === '' || this.state.password !== this.state.password2){
      this.setState({IconColor: "#B80000" })
      this.setState({password:'',password2:''})
    }
    else {
      this.setState({IconColor: "#8BC34A" })
      this.registerUser()
    }
  }
  registerUser(){
    let newUser = {}
    if(this.state.cleaner){
      newUser = {
        name:this.state.name,
        email:this.state.email,
        password: this.state.password,
        address:this.state.address,
        cleaner: this.state.cleaner,
        available:false,
        avatar: 'https://www.w3schools.com/w3css/img_lights.jpg',
        about:'',
        rating:0,
      }
      fetch(Consts.host + '/createCleaner',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)})
        .then(response => {
         })
        .catch(error =>{
          })

    }
    else {
      newUser = {
        name:this.state.name,
        email:this.state.email,
        password: this.state.password,
        address:this.state.address,
        cleaner: this.state.cleaner,
        avatar:'',
        rating:0,
        description:"",
        favorite_cleaners: [],
        events: []
      }
      fetch(Consts.host + '/createUser',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)})
        .then(response => {
        })
        .catch(error =>{
         })

    }

    //send to register route


  }



  onClickListener = (viewId) => {
    if(viewId === 'submit') {
      this.validateForm()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image resizeMode='contain' style={{height:100,marginBottom:20}}  source={require('../assets/logo.png')}/>
        <View style={styles.inputContainer}>

            <Icon style={styles.inputIcon} name="ios-person" size={30} color="#8BC34A" />
            <TextInput style={styles.inputs}
                       placeholder="Name"
                       underlineColorAndroid='transparent'
                       onChangeText={(name) => this.setState({name})}/>
        </View>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name="ios-mail" size={30} color="#8BC34A" />
          <TextInput style={styles.inputs}
                     placeholder="Email"
                     keyboardType="email-address"
                     underlineColorAndroid='transparent'
                     onChangeText={(email) => this.setState({email})}/>
        </View>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name="ios-lock" size={30} color={this.state.IconColor} />
          <TextInput style={styles.inputs}
                     placeholder="Password"
                     secureTextEntry={true}
                     underlineColorAndroid='transparent'
                     onChangeText={(password) => this.setState({password})}/>
        </View>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name="ios-lock" size={30} color={this.state.IconColor} />
          <TextInput style={styles.inputs}
                     placeholder="Repeat password"
                     secureTextEntry={true}
                     underlineColorAndroid='transparent'
                     onChangeText={(password2) => this.setState({password2})}/>
        </View>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name="ios-home" size={30} color="#8BC34A" />
          <TextInput style={styles.inputs}
                     placeholder="Address"
                     underlineColorAndroid='transparent'
                     onChangeText={(address) => this.setState({address})}/>
        </View>
        <View style={styles.inputContainer}>
          <RadioForm
            style={{marginTop:8,marginLeft:10}}
            radio_props={[
              {label: 'Cleaner      ', value: true },
              {label: 'Customer', value: false }]
            }
            formHorizontal={true}
            labelHorizontal={true}
            buttonColor={'#8BC34A'}
            animation={true}
            onPress={(value) => {this.setState({cleaner:value})}}
          />
        </View>


        <TouchableHighlight style={[styles.buttonContainer, styles.registerButton]} onPress={() => this.onClickListener('submit')}>
          <Text style={styles.loginText}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:4,
    borderBottomWidth: 1,
    width:300,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center'
  },
  inputs:{
    height:45,
    marginLeft:16,
    flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#8BC34A",
  },
  registerButton:{
    backgroundColor: "#00BCD4",
  },
  loginText: {
    // color: 'white',
  }
});
