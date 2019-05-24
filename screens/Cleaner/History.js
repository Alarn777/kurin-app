import * as React from "react";
import { View, BottomNavigation,TouchableOpacity ,Text, ScrollView, ActivityIndicator } from "react-native";
import Consts from '../../ENV_VARS'
import CleaningEventForCleaner from "./CleaningEventForCleaner";
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  addEvent,
  removeEvent,
  addCleaner,
  addSocket,
  reloadEvents,
} from '../../FriendActions';
import SocketIOClient from "socket.io-client";






class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cleaner: null,
      cleanEvents:[],
      navigation:this.props.navigation,
      userEmail:this.props.route.navigation.state.params.userEmail,
      isModalVisible: false,
      date:''
    };
   // this.cancelCleaner = this.cancelCleaner.bind(this)
    this.fetchEvents = this.fetchEvents.bind(this)
    this.dealWithUserData = this.dealWithUserData.bind(this)
    // this.addToStarredCleaner = this.addToStarredCleaner.bind(this)
    // this.fetchCleaner = this.fetchCleaner.bind(this)

  }



  componentDidMount(): void {

    this.fetchEvents({email:this.state.userEmail})
  }


  editEventByCleaner(event,data){

    data.email = this.state.userEmail
    event.status = data.newStatus
    // this.props.addEvent(event)
    // this.editEvent(event)
    this.editEvent(data)
    this.props.addEvent(event)
  }




  async editEvent(event) {


    let data = {notes:'',emial:'',id:''}
    console.log(event)
    // axios.post(Consts.host + '/editEventByCleaner', event)
    //   .then(res => {
    //
    //   })

  }

  async fetchEvents(data) {
    axios.post(Consts.host + '/findEventsByCleanerEmail', data)
      .then(res => {
        this.dealWithUserData(res.data)
      })
  }


  dealWithUserData(data){
    for (let i in data) {
      if (data[i].status !== 'Requested') {
        this.props.addEvent(data[i])
      }
    }
  }

  render() {
    if (this.props.cleaners.events.length === 0) {
      return (
        <View style={{ width: '80%', alignSelf: 'center' }}>
          <Text>
            We have found no events for you...
          </Text>
        </View>);
    }
    else {
      return (
        <View style={{flex:1}}>
          <Text style={{alignSelf:'center',fontSize:30}}>My Events</Text>
          <ScrollView>
            {
              this.props.cleaners.events.map((event) => {
                return <CleaningEventForCleaner
                  key={event._id}
                  event={event}
                  home={this}
                  navigation={this.state.navigation}
                  cancelCleaner={this.cancelCleaner}
                  addToStarredCleaner={this.addToStarredCleaner}
                />
              })
            }
          </ScrollView>
        </View>
      );
    }
  }
}




const mapStateToProps = (state) => {
  const { cleaners,events, socket} = state
  return { cleaners,events,socket }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addEvent,
    removeEvent,
    addCleaner,
    addSocket,
    reloadEvents
  }, dispatch)
);


export default connect(mapStateToProps,mapDispatchToProps)(History);