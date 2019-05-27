import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Consts from '../../ENV_VARS'
import CleaningEvent from './CleaningEvent'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addEvent, removeEvent, addCleaner, addSocket, reloadEvents } from '../../FriendActions'
import SocketIOClient from 'socket.io-client'

class History extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cleaner: null,
      cleanEvents: [],
      navigation: this.props.navigation,
      userEmail: this.props.route.navigation.state.params.userEmail,
      isModalVisible: false,
      date: ''
    }
    this.cancelCleaner = this.cancelCleaner.bind(this)
    this.fetchUser = this.fetchUser.bind(this)
    this.dealWithUserData = this.dealWithUserData.bind(this)
    this.addToStarredCleaner = this.addToStarredCleaner.bind(this)
    this.fetchCleaner = this.fetchCleaner.bind(this)
    this.submitRating = this.submitRating.bind(this)
    try {
      this.socket = SocketIOClient(Consts.host)
    } catch (e) {}
  }

  componentDidMount(): void {
    this.props.addSocket(this.socket)
    this.props.cleaners.socket[0].on('changedStatus', message => {
      console.log('Message: ' + message)
      this.props.reloadEvents()
      this.fetchUser({ email: this.state.userEmail })
      console.log(this.props)
    })

    // this.props.cleaners.socket[0].emit('bla','Fuck this')

    this.fetchUser({ email: this.state.userEmail })
  }

  async fetchCleaner(data) {
    try {
      const response = await axios.post(Consts.host + '/getCleanerByEmail', data)
      // this.dealWithCleaner(response.data[0])
      this.props.addCleaner(response.data[0])
    } catch (err) {}
  }

  async fetchUser(data) {
    axios.post(Consts.host + '/findEventsByUserEmail', data).then(res => {
      this.dealWithUserData(res.data)
    })
  }
  async addToStarredCleaner(data) {
    try {
      const response = await axios.post(Consts.host + '/addToStarred', data)
    } catch (err) {}
    this.fetchCleaner({ email: data.cleanerEmail })
  }

  async submitRating(data) {
    console.log(data)
    axios.post(Consts.host + '/submitRating', data).then(res => {
      this.props.reloadEvents()
      this.fetchUser({ email: this.state.userEmail })
    })
  }

  dealWithUserData(data) {
    for (const event in data) {
      this.props.addEvent(data[event])
    }
  }

  cancelCleaner(data) {
    this.props.removeEvent(data)

    // this.fetchUser({email:this.state.userEmail})
  }

  render() {
    if (this.props.cleaners.events.length === 0) {
      return (
        <View style={{ width: '80%', alignSelf: 'center' }}>
          <Text>We have found no events for you...</Text>
        </View>
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <Text style={{ alignSelf: 'center', fontSize: 30 }}>My Events</Text>
        <ScrollView>
          {this.props.cleaners.events.map(event => {
            return (
              <CleaningEvent
                submitRating={this.submitRating}
                key={event._id}
                event={event}
                navigation={this.state.navigation}
                cancelCleaner={this.cancelCleaner}
                addToStarredCleaner={this.addToStarredCleaner}
              />
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { cleaners, events, socket } = state
  return { cleaners, events, socket }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addEvent,
      removeEvent,
      addCleaner,
      addSocket,
      reloadEvents
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History)
