import * as React from 'react'
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import axios from 'axios'
import {
  Card,
  Input,
  Text,
  ListItem,
  Divider,
  Button,
  Icon,
  CheckBox,
  ThemeProvider
} from 'react-native-elements'
import AwesomeButton from 'react-native-really-awesome-button'
import StarRating from 'react-native-star-rating'
import Consts from '../../ENV_VARS'
import { bindActionCreators } from 'redux'
import {
  addCleaner,
  addEvent,
  addSocket,
  removeCleaner,
  removeEvent,
  reloadEvents
} from '../../FriendActions'
import { connect } from 'react-redux'
import CleaningEventForCleaner from './CleaningEventForCleaner'
import RadioForm from 'react-native-simple-radio-button'
import CleaningEvent from '../User/CleaningEvent'
import SocketIOClient from 'socket.io-client'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      userEmail: this.props.route.navigation.state.params.userEmail,
      user: null,
      text: '',
      apSize: '',
      floorNum: '0',
      about: '',
      available: false,
      edit: false,
      floor: false,
      windows: false,
      bathroom: false,
      loadingEventsTrigger: false,
      loadResults: false
    }

    this.renderEvents = this.renderEvents.bind(this)
    this.editMode = this.editMode.bind(this)
    this.returnToMainScreen = this.returnToMainScreen.bind(this)
    this.loadingEvents = this.loadingEvents.bind(this)
    // this.chooseCleaner = this.chooseCleaner.bind(this)
    this.dealWithData = this.dealWithData.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.fetchUser = this.fetchUser.bind(this)
    this.dealWithUserData = this.dealWithUserData.bind(this)

    try {
      this.socket = SocketIOClient(Consts.host)
    } catch (e) {}
  }

  componentDidMount(): void {
    this.props.addSocket(this.socket)
    this.props.cleaners.socket[0].on('changedStatus', message => {
      console.log('Message: ' + message)
      this.props.reloadEvents()
      this.fetchData({ email: this.state.userEmail })
    })

    this.fetchUser({ email: this.state.userEmail })
  }

  editMode() {
    this.setState({ edit: !this.state.edit })
  }

  async fetchUser(data) {
    axios.post(Consts.host + '/getCleanerByEmail', data).then(res => {
      this.dealWithUserData(res.data[0])
    })
  }

  dealWithUserData(data) {
    const user = {
      about: data.about,
      name: data.name,
      stars: data.rating,
      floor: data.floor,
      windows: data.windows,
      bathroom: data.bathroom,
      available: data.available
    }
    this.setState({
      about: user.about,
      user,
      floor: data.floor,
      windows: data.windows,
      bathroom: data.bathroom,
      available: data.available
    })
  }

  loadingEvents() {
    this.setState({ loadingEventsTrigger: true })
    // this.fetchData()
    this.enterQueue()
    setTimeout(() => {
      this.ToggleBackEventsTrigger()
    }, 2000)

    //now load results
  }

  async enterQueue() {

    console.log(this.state)
    try {
      await axios.post(Consts.host + '/enterQueue', {
        email: this.state.userEmail,
        floor: this.state.floor,
        bathroom: this.state.bathroom,
        windows: this.state.windows,
        available: this.state.available
      })
      this.fetchData()
    } catch (err) {}
  }

  async fetchData() {
    try {
      const response = await axios.post(Consts.host + '/findEventsByCleanerEmail', {
        email: this.state.userEmail
      })
      this.dealWithData(response.data)
    } catch (err) {}
  }

  dealWithData(data) {
    const goodEvents = []
    for (const i in data) {
      if (data[i].status === 'Requested') {
        goodEvents.push(data[i])
        // console.log(data[i])
      } else {
        this.props.addEvent(data[i])
      }
    }
    // console.log(goodEvents)
    this.setState({ events: goodEvents })
    // console.log(this.state)
  }

  ToggleBackEventsTrigger() {
    this.setState({ loadingEventsTrigger: false })
    this.setState({ loadResults: true })
  }

  returnToMainScreen() {
    this.setState({ loadResults: !this.state.loadResults })
  }

  chooseCleaner(cleaner) {
    //cleaner pikced route

    console.log(cleaner)
    if (cleaner === null) return
    // this.createEvent({
    //   cleanFloor: this.state.floor,
    //   eventUser:this.state.userEmail,
    //   eventCleaner:cleaner.email,
    //   eventCleanerName:cleaner.name,
    //   cleanWindows: this.state.windows,
    //   cleanBathroom: this.state.bathroom,
    //   sizeOfTheAppt:this.state.apSize,
    //   floor:this.state.floorNum,
    // })
  }

  cancelCleaner(event, need_delete) {
    const arrEvents = []
    this.setState({ events: [] })
    if (!event) {
      return
    }
    for (const i in this.state.events) {
      if (this.state.events[i]._id !== event._id) {
        arrEvents.push(this.state.events[i])
      }
    }
    // console.log(arrCleaners)
    if (arrEvents === []) {
      this.setState({ events: [] })
    }
    this.setState({ events: arrEvents })
    if (need_delete) this.deleteEvent(event._id)
  }

  async deleteEvent(id) {
    // this.toggleModal()
    try {
      const response = await axios.post(Consts.host + '/deleteEvent', {
        id
      })
    } catch (err) {}
  }

  editEventByCleaner(event, data) {
    console.log(event)
    console.log(data)
    data.email = this.state.userEmail
    event.status = data.newStatus
    // this.props.addEvent(event)
    // this.editEvent(event)
    this.editEvent(data)
    this.props.addEvent(event)
  }

  async editEvent(event) {
    axios.post(Consts.host + '/editEventByCleaner', event).then(res => {})
  }

  renderEvents() {
    if (this.state.events.length === 0) {
      return (
        <View style={{ width: '80%', alignSelf: 'center' }}>
          <Text style={styles.text}>
            We have found no events waiting for you... Please try again later.
          </Text>
          <Button
            buttonStyle={{ backgroundColor: '#8BC34A' }}
            title="Back to Main"
            onPress={this.returnToMainScreen}
          />
        </View>
      )
    }

    //map on the results
    return (
      <View>
        {this.state.events.map(event => {
          return (
            <CleaningEventForCleaner
              key={event._id}
              event={event}
              home={this}
              cancelCleaner={this.cancelCleaner}
              editEventByCleaner={this.editEventByCleaner}
            />
          )
        })}
        <Button
          buttonStyle={{
            alignSelf: 'center',
            width: '75%',
            margin: 20,
            backgroundColor: '#8BC34A'
          }}
          title="Back to Main"
          onPress={this.returnToMainScreen}
        />
      </View>
    )
  }

  render() {
    if (this.state.loadResults) {
      return <ScrollView>{this.renderEvents()}</ScrollView>
    }
    if (this.state.loadingEventsTrigger) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column'
          }}
        >
          <Image
            style={{ height: 200, width: 200 }}
            source={{
              uri: 'http://www.animatedimages.org/data/media/1095/animated-cleaning-image-0048.gif'
            }}
          />
          <Text style={styles.text}>Finding best jobs...</Text>
        </View>
      )
    }
    if (this.state.user) {
      if (this.state.edit) {
        return (
          <ThemeProvider>
            <ScrollView>
              <Card title="My Home">
                <Input
                  containerStyle={{ margin: 10 }}
                  label="About me"
                  placeholder="City,street,house,apartment..."
                  value={this.state.about}
                  onChangeText={about => this.setState({ about })}
                />
                <View style={styles.inputContainer}>
                  <RadioForm
                    initial={this.state.available}
                    style={{ marginTop: 8, marginLeft: 10 }}
                    radio_props={[
                      { label: 'Available      ', value: true },
                      { label: 'Not Available', value: false }
                    ]}
                    formHorizontal
                    labelHorizontal
                    buttonColor={'#8BC34A'}
                    animation
                    onPress={value => {
                      this.setState({ available: value })
                    }}
                  />
                </View>
                {/*<Input*/}
                {/*  containerStyle={{margin:10}}*/}
                {/*  label='Size of the apartment'*/}
                {/*  placeholder='Size in meters'*/}
                {/*  onChangeText={(apSize) => this.setState({apSize})}*/}
                {/*  // errorMessage='Must be numerical value'*/}
                {/*/>*/}
                <Text style={{ fontSize: 20, margin: 10 }} h5>
                  I can clean:
                </Text>
                <CheckBox
                  title="Floor"
                  checked={this.state.floor}
                  onPress={() => this.setState({ floor: !this.state.floor })}
                />
                <CheckBox
                  title="Windows"
                  checked={this.state.windows}
                  onPress={() => this.setState({ windows: !this.state.windows })}
                />
                <CheckBox
                  title="Bathroom"
                  checked={this.state.bathroom}
                  onPress={() => this.setState({ bathroom: !this.state.bathroom })}
                />
                <Button
                  buttonStyle={{ backgroundColor: '#8BC34A' }}
                  title="Save"
                  onPress={this.editMode}
                />
              </Card>
            </ScrollView>
          </ThemeProvider>
        )
      }

      let iconFloor = 'close'
      let colorFloor = 'red'
      let iconWindows = 'close'
      let colorWindows = 'red'
      let iconBathroom = 'close'
      let colorBathroom = 'red'
      let available = ''
      let availableColor = 'red'
      if (this.state.floor) {
        iconFloor = 'check'
        colorFloor = '#8BC34A'
      }
      if (this.state.windows) {
        iconWindows = 'check'
        colorWindows = '#8BC34A'
      }
      if (this.state.bathroom) {
        iconBathroom = 'check'
        colorBathroom = '#8BC34A'
      }

      if (this.state.available) {
        available = 'Yes'
        availableColor = '#8BC34A'
      } else {
        available = 'No'
        availableColor = 'red'
      }

      return (
        <ThemeProvider style={styles.main}>
          <ScrollView>
            <Card title="My Home">
              <ListItem title={'About me: ' + this.state.user.about} />
              <ListItem
                titleStyle={{ color: availableColor }}
                title={'Avalibility: ' + available}
              />
              <Divider style={{ backgroundColor: 'gray' }} />
              <Card title="I can Clean">
                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Floor</Text>
                  <Icon style={styles.inputIcon} name={iconFloor} size={30} color={colorFloor} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Windows</Text>
                  <Icon
                    style={styles.inputIcon}
                    name={iconWindows}
                    size={30}
                    color={colorWindows}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Bathroom</Text>
                  <Icon
                    style={styles.inputIcon}
                    name={iconBathroom}
                    size={30}
                    color={colorBathroom}
                  />
                </View>
              </Card>
              <Button
                buttonStyle={{ backgroundColor: '#8BC34A', marginTop: 10 }}
                title="Edit"
                onPress={this.editMode}
              />
            </Card>

            <AwesomeButton
              style={styles.mainButton}
              activityColor="#8BC34A"
              backgroundColor="#8BC34A"
              backgroundDarker="#689F38"
              progressLoadingTime={250}
              progress
              onPress={next => {
                /** Do Something **/
                //

                next(this.loadingEvents)
              }}
            >
              Enter queue
            </AwesomeButton>
          </ScrollView>
        </ThemeProvider>
      )
    }

    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#8BC34A" />
  }
}

const mapStateToProps = state => {
  const { friends, cleaners } = state
  return { friends, cleaners }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addCleaner,
      removeCleaner,
      addEvent,
      removeEvent,
      addSocket,
      reloadEvents
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

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
  },
  mainButton: {
    alignSelf: 'center',
    margin: 50,
    // backgroundColor: "#00BFFF",
    // width:'100%',
    // height:200
    // color:"#00BFFF",
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00BFFF'
  },
  inputIcon: {
    width: 30,
    height: 30
    // justifyContent: 'center'
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderBottomWidth: 1,
    width: '100%',
    height: 30,
    // margin:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
