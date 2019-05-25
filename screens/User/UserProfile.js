import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  ActivityIndicator
} from 'react-native';
import StarRating from "react-native-star-rating";
import axios from "axios";
import Consts from "../../ENV_VARS";

const user = {
  name:'John Doe',
  description:'UX Designer / Mobile developer',
  stars:3.5,
}

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user:null,
      email:this.props.route.navigation.state.params.userEmail,
      name:'',
      description:'',
      stars:0
    };
    this.logOut =this.logOut.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.dealWithData = this.dealWithData.bind(this)

  }

  componentDidMount(): void {
    //api User fetch
    console.log(this.state)
    this.fetchData({email:this.state.email})
  }

  async fetchData(data) {
    axios.post(Consts.host + '/getUserByEmail', data)
      .then(res => {
        // console.log(res);
        // console.log(res.data);
        this.dealWithData(res.data[0])
      })
  }



  dealWithData(data){
    console.log(data)
    let user = {
      name:data.name,
      description:data.description,
      stars:data.rating,
      avatar:data.avatar
    }
    this.setState({
      user:user
    })
  }


  logOut(){
    //api Call logout
    this.props.route.navigation.navigate('Login')
  }

  render() {
    if(this.state.user) {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.header}/>
          <Image style={styles.avatar} source={{ uri: this.state.user.avatar}}/>
          <View style={styles.bodyContent}>
            <StarRating
              style={{ marginTop: 100 }}
              disabled={true}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              rating={this.state.user.stars}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={'gold'}
            />
            <Text style={styles.name}>{this.state.user.name}</Text>
            <Text style={styles.info}>{this.state.user.description}</Text>

            <TouchableOpacity onPress={this.logOut} style={styles.buttonContainer}>
              <Text>Log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }
    else return  <ActivityIndicator style={{flex:1}} size="large" color="#8BC34A" />
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#8BC34A",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  // name:{
  //   fontSize:22,
  //   color:"#FFFFFF",
  //   fontWeight:'600',
  // },
  body:{

  },
  bodyContent: {
    // flex: 1,
    marginTop:40,
    alignItems: 'center',
    padding:30,
  },
  name:{
    marginTop:40,
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#FF5722",
  },
});
