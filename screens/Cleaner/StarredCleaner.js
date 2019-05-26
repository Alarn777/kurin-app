import React from 'react'
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { Text } from 'react-native-elements'
import CleanerCard from './UserCard'
import axios from 'axios'
import Consts from '../../ENV_VARS'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  addCleaner,
  removeCleaner
  // addEvent,
  // removeEvent
} from '../../FriendActions'

class Starred extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cleaners: [],
      data: this.props.cleaners,
      user: null,
      loadResults: false,
      userEmail: this.props.route.navigation.state.params.userEmail
    }
    this.pickCleaner = this.pickCleaner.bind(this)
    this.dealWithData = this.dealWithData.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.fetchUser = this.fetchUser.bind(this)
    this.dealWithUserData = this.dealWithUserData.bind(this)
    this.removeFromStarred = this.removeFromStarred.bind(this)
  }

  componentDidMount(): void {
    this.fetchUser({ email: this.state.userEmail })
  }

  async fetchData(data) {
    try {
      const response = await axios.post(Consts.host + '/getCleanerByEmail', data)
      this.dealWithData(response.data[0])
    } catch (err) {}
  }

  dealWithData(data) {
    this.props.addCleaner(data)

    this.setState({ cleaners: [...this.state.cleaners, data] })
  }

  async fetchUser(data) {
    axios.post(Consts.host + '/getUserByEmail', data).then(res => {
      this.dealWithUserData(res.data[0])
    })
  }

  dealWithUserData(data) {
    this.setState({
      user: data
    })

    this.state.user.favorite_cleaners.map(cleaner => {
      // this.fetchData({email:cleaner})

      this.fetchData({ email: cleaner })
    })
  }

  async removeFromStarred(data) {
    const params = {
      cleanerEmail: data.email,
      userEmail: this.state.userEmail
    }

    axios
      .post(Consts.host + '/removeFromStarred', params)
      .then(res => {
        // this.setState({cleaners:[]})
        // this.fetchUser({email:this.state.userEmail})
      })
      .catch(error => {})

    this.props.removeCleaner(data)
  }

  pickCleaner(cleaner) {}

  renderCleaners() {
    if (!this.state.user) {
      return <ActivityIndicator style={{ flex: 1 }} size="large" color="#8BC34A" />
    } else if (this.props.cleaners.favorite_cleaners.length === 0) {
      return (
        <View style={{ width: '80%', alignSelf: 'center' }}>
          <Text style={styles.text}>You have no starred cleaners, maybe add some?</Text>
        </View>
      )
    }

    //map on the results
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ alignSelf: 'center', fontSize: 30 }}>My Favorites</Text>
        <ScrollView>
          {this.props.cleaners.favorite_cleaners.map(cleaner => {
            return (
              <CleanerCard
                key={cleaner._id}
                starred
                cleaner={cleaner}
                pickCleaner={() => this.pickCleaner(cleaner)}
                removeFromStarred={this.removeFromStarred}
              />
            )
          })}
        </ScrollView>
      </View>
    )
  }

  render() {
    return <ScrollView>{this.renderCleaners()}</ScrollView>
  }
}

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column'
  },
  image: {},
  name: {},
  user: {},
  header: {
    backgroundColor: '#8BC34A',
    height: 200
  },
  text: {
    fontSize: 20,
    margin: 5
  }
})

const mapStateToProps = state => {
  const { friends, cleaners } = state
  return { friends, cleaners }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addCleaner,
      removeCleaner
      // addEvent,
      // removeEvent
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Starred)
