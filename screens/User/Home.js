import React from 'react'
import { View, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
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
import CleanerCard from './CleanerCard'
import Consts from '../../ENV_VARS'
import { bindActionCreators } from 'redux'
import { addCleaner, addEvent, removeCleaner, removeEvent } from '../../FriendActions'
import { connect } from 'react-redux'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cleaners: [],
      userEmail: this.props.route.navigation.state.params.userEmail,
      user: null,
      text: '',
      apSize: '',
      floorNum: '0',
      address: '',
      edit: false,
      floor: false,
      windows: false,
      bathroom: false,
      loadingCleanersTrigger: false,
      loadResults: false
    }
    this.editMode = this.editMode.bind(this)
    this.returnToMainScreen = this.returnToMainScreen.bind(this)
    this.loadingCleaners = this.loadingCleaners.bind(this)
    this.chooseCleaner = this.chooseCleaner.bind(this)
    this.dealWithData = this.dealWithData.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.fetchUser = this.fetchUser.bind(this)
    this.dealWithUserData = this.dealWithUserData.bind(this)
    // this.addToProps = this.addToProps(this)
    // this.createEvent = this.createEvent(this)
  }

  componentDidMount(): void {
    this.fetchUser({ email: this.state.userEmail })
  }

  editMode() {
    this.setState({ edit: !this.state.edit })
  }

  async fetchUser(data) {
    axios.post(Consts.host + '/getUserByEmail', data).then(res => {
      this.dealWithUserData(res.data[0])
    })
  }

  dealWithUserData(data) {
    const user = {
      address: data.address,
      name: data.name,
      description: data.description,
      stars: data.rating
    }
    this.setState({
      address: user.address,
      user
    })
  }

  loadingCleaners() {
    this.setState({ loadingCleanersTrigger: true })
    this.fetchData()

    setTimeout(() => {
      this.ToggleBackcleanersTrigger()
    }, 3000)

    //now load results
  }

  async fetchData() {
    try {
      const response = await axios.post(Consts.host + '/findMatchingCleaners', {
        floor: this.state.floor,
        windows: this.state.windows,
        bathroom: this.state.bathroom,
        available: true
      })
      this.dealWithData(response.data)
    } catch (err) {}
  }

  dealWithData(data) {
    this.setState({ cleaners: data })
  }

  ToggleBackcleanersTrigger() {
    this.setState({ loadingCleanersTrigger: false })
    this.setState({ loadResults: true })
  }

  returnToMainScreen() {
    this.setState({ loadResults: !this.state.loadResults })
  }

  chooseCleaner(cleaner) {
    //cleaner pikced route

    const temp = this.state.cleaners
    for (const i in temp) if (cleaner._id === temp[i]._id) temp.splice(i, 1)

    this.setState({ cleaners: temp })

    if (cleaner === null) return
    this.createEvent({
      cleanFloor: this.state.floor,
      eventUser: this.state.userEmail,
      eventCleaner: cleaner.email,
      eventCleanerName: cleaner.name,
      cleanWindows: this.state.windows,
      cleanBathroom: this.state.bathroom,
      sizeOfTheAppt: this.state.apSize,
      floor: this.state.floorNum,
      address: this.state.address
    })
  }

  async createEvent(data) {
    axios.post(Consts.host + '/addNewEvent', data).then(res => {
      this.addToProps()
    })
  }

  async addToProps() {
    axios
      .post(Consts.host + '/findEventsByUserEmail', { email: this.state.userEmail })
      .then(res => {
        for (const event in res.data) {
          this.props.addEvent(res.data[event])
        }
      })
  }

  renderCleaners() {
    if (this.state.cleaners.length === 0) {
      return (
        <View style={{ width: '80%', alignSelf: 'center' }}>
          <Text style={styles.text}>
            We have found no one matching your search... Please try again later.
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
        {this.state.cleaners.map(cleaner => {
          return (
            <CleanerCard
              key={cleaner._id}
              cleaner={cleaner}
              starred={false}
              chooseCleaner={this.chooseCleaner}
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
      return <ScrollView>{this.renderCleaners()}</ScrollView>
    }
    if (this.state.loadingCleanersTrigger) {
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
          <Text style={styles.text}>Looking...</Text>
        </View>
      )
    }
    if (this.state.user) {
      if (this.state.edit) {
        return (
          <ScrollView>
            <ThemeProvider>
              <Card title="My Home">
                <Input
                  containerStyle={{ margin: 10 }}
                  label="Address"
                  placeholder="City,street,house,apartment..."
                  value={this.state.address}
                  onChangeText={address => this.setState({ address })}
                />
                <Input
                  containerStyle={{ margin: 10 }}
                  label="Size of the apartment"
                  placeholder="Size in meters"
                  onChangeText={apSize => this.setState({ apSize })}
                  // errorMessage='Must be numerical value'
                />
                <Input
                  containerStyle={{ margin: 10 }}
                  label="Floor"
                  placeholder="#"
                  value={this.state.floorNum}
                  onChangeText={floorNum => this.setState({ floorNum })}
                />
                <Text style={{ fontSize: 20, margin: 10 }} h5>
                  To clean:
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
            </ThemeProvider>
          </ScrollView>
        )
      }

      let iconFloor = 'close'
      let colorFloor = 'red'
      let iconWindows = 'close'
      let colorWindows = 'red'
      let iconBathroom = 'close'
      let colorBathroom = 'red'
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

      return (
        <ThemeProvider style={styles.main}>
          <ScrollView>
            <Card title="My Home">
              <ListItem title={'Address: ' + this.state.user.address} />
              <ListItem title={'Size of the apartment: ' + this.state.apSize} />
              <ListItem title={'Floor: ' + this.state.floorNum} />
              <Divider style={{ backgroundColor: 'gray' }} />
              <Card title="To Clean">
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

                next(this.loadingCleaners)
              }}
            >
              Find me a cleaner
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
      removeEvent
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
