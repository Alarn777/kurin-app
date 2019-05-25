import React from "react";
import { PropTypes } from 'react'
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as Progress from 'react-native-progress';
import { Button, Card, Text, ListItem, Icon, Input } from "react-native-elements";
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import axios from "axios";
import Consts from "../../ENV_VARS";

export default class CleaningEventForCleaner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      about:'',
      isModalVisible: false,
      canRate:false,
      isModalVisibleOK:false,
      starCount: this.props.event.rating,
      progress:0
    };

    // this.cancelEvent = this.cancelEvent.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.button = this.button.bind(this)
    // this.cancelCleaner = this.cancelCleaner.bind(this)
    // this.addToStarredCleaner = this.addToStarredCleaner.bind(this)
    // this.cancelEvent = this.cancelEvent.bind(this)
  }




  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  addToStarredCleaner() {
    this.props.addToStarredCleaner({userEmail: this.state.event.eventUser, cleanerEmail: this.state.event.eventCleaner})
  }


  componentDidMount(): void {
    this.setState({
      event: this.props.event,
      starCount:this.props.event.feedBack,
      about:this.props.event.notesByCleaner,
    })
  }

  // cancelCleaner(){
  //   this.props.cancelCleaner(this.state.event)
  // }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleModalOK = () => {
    this.setState({ isModalVisibleOK: !this.state.isModalVisibleOK });
  };

  cancelEvent = () => {
    this.toggleModal()
    // this.cancelEvent()
    this.props.home.cancelCleaner(this.state.event,true)
  }


  // async cancelEvent() {
  //     // this.toggleModal()
  //     try {
  //       const response = await axios.post(Consts.host + '/deleteEvent',
  //         {
  //           id: this.state.event._id
  //         });
  //     } catch (err) {
  //     }
  //   }


  editEventByCleaner = () =>{
    this.toggleModalOK()

    this.props.home.editEventByCleaner(this.state.event,{email:'',id:this.state.event._id,newStatus:'Approved'})
    this.props.home.cancelCleaner(this.state.event,false)
  }

  finilizeEventByCleaner = () =>{
    this.toggleModalOK()
     this.props.home.editEventByCleaner(this.state.event,{email:'',id:this.state.event._id,newStatus:'Finished'},{email:'',id:this.state.event._id,notes:this.state.about})
    // this.props.home.cancelCleaner(this.state.event,false)
  }


  closeModal(){
    this.toggleModal()
  }

  eventStatus(){
    if(this.state.event.status === 'Finished'){
      return false
    }
    else
      return true
  }

  button(){
    if(this.state.event.status === 'Approved'){
      return (
        <View>
          <Button
            backgroundColor='#03A9F4'
            buttonStyle={{
              borderRadius: 1,
              margin: 5,
              backgroundColor: "#ffc107"
            }}
            onPress ={this.toggleModalOK}
            title='Submit Job'/>
          <Modal style={{justifyContent:'center' }} isVisible={this.state.isModalVisibleOK}>
            <Card
              title={'Add notes and complete ' + this.state.event.date + ' ' + this.state.event.time}
            >
              <Input
                containerStyle={{margin:10}}
                label='Notes'
                placeholder='Add notes...'
                value={this.state.about}
                onChangeText={(about) => this.setState({about})}
              />

              <Button
                backgroundColor='#03A9F4'
                buttonStyle={{
                  borderRadius: 1,
                  margin: 5,
                  backgroundColor: "#ffc107"
                }}
                onPress={this.finilizeEventByCleaner}
                title='OK'/>
            </Card>
          </Modal>
        </View>
      )
    }
    if(this.state.event.status === 'Finished'){
      return (
        <Card
          title={'Event Rating'}
        >
        <StarRating
        style={{ marginTop: 100 }}
        disabled={true}
        emptyStar={'ios-star-outline'}
        fullStar={'ios-star'}
        halfStar={'ios-star-half'}
        iconSet={'Ionicons'}
        maxStars={5}
        rating={this.state.event.rating}
        selectedStar={(rating) => this.onStarRatingPress(rating)}
        fullStarColor={'gold'}
        />
        </Card>)
    }
    if(this.state.event.status === 'Requested'){
      return (
        <View>
          <Button
            backgroundColor='#03A9F4'
            buttonStyle={{
              borderRadius: 1,
              margin: 5,
              backgroundColor: "#FF5722"
            }}
            onPress={this.toggleModal}
            title='Decline Job'/>
          <Modal style={{justifyContent:'center' }} isVisible={this.state.isModalVisible}>
            <Card
              title={'Decline Request ?'}
            >
              <Button
                backgroundColor='#03A9F4'
                buttonStyle={{
                  borderRadius: 1,
                  margin: 5,
                  backgroundColor: "#8BC34A"
                }}
                onPress ={this.cancelEvent}
                title='Yes'/>
              <Button
                backgroundColor='#03A9F4'
                buttonStyle={{
                  borderRadius: 1,
                  margin: 5,
                  backgroundColor: "red"
                }}
                onPress ={this.closeModal}
                title='No'/>
            </Card>
          </Modal>
          <Button
            backgroundColor='#03A9F4'
            buttonStyle={{
              borderRadius: 1,
              margin: 5,
              backgroundColor: "#ffc107"
            }}
            onPress ={this.toggleModalOK}
            title='Accept Job'/>
          <Modal style={{justifyContent:'center' }} isVisible={this.state.isModalVisibleOK}>
            <Card
              title={'Added ' + this.state.event.date + ' ' + this.state.event.time}
            >
              <ListItem
              title="You can see it in My Cleans"
              />
              <Button
                backgroundColor='#03A9F4'
                buttonStyle={{
                  borderRadius: 1,
                  margin: 5,
                  backgroundColor: "#ffc107"
                }}
                // onPress ={() =>{
                //   this.toggleModalOK()
                //   this.addToStarredCleaner()
                // }}
                onPress={this.editEventByCleaner}
                title='OK'/>
            </Card>
          </Modal>
        </View>
      );
    }
  }


  render() {
    if (this.state.event) {

      const progressStyles = {
        color: '',
        value: 0,
      };

      if(this.state.event.status === 'Requested')
      {
        progressStyles.color = '#FF5722'
        progressStyles.value = 0.3

      }
      if(this.state.event.status === 'Approved')
      {
        progressStyles.color = "#ffc107"
        progressStyles.value = 0.6

      }
      if(this.state.event.status === 'Finished')
      {
        progressStyles.color = "#8BC34A"
        progressStyles.value = 1

      }

      let iconFloor = 'close'
      let colorFloor = 'red'
      let iconWindows = 'close'
      let colorWindows = 'red'
      let iconBathroom = 'close'
      let colorBathroom = 'red'
      let available = ''
      let availableColor = 'red'
      if(this.state.event.cleanFloor){
        iconFloor = 'check'
        colorFloor = "#8BC34A"
      }
      if(this.state.event.cleanWindows){
        iconWindows = 'check'
        colorWindows = "#8BC34A"
      }
      if(this.state.event.cleanBathroom){
        iconBathroom = 'check'
        colorBathroom = "#8BC34A"
      }


      return (
        <Card  title={'Event ' + this.state.event.date + ' ' + this.state.event.time}>
          <ListItem
            title={'Agent name: ' + this.state.event.eventCleanerName}
          />
          <ListItem
            title={'Request status: ' + this.state.event.status}
          >
          </ListItem>


          <Progress.Bar
            progress={progressStyles.value}
            width={300}
            style={{alignSelf:'center',width:'90%'}}
            color={progressStyles.color}
          />

          <ListItem
            title={'Agent notes: ' + this.state.event.notesByCleaner}
          />
          <ListItem
            title={'Floor: ' + this.state.event.floor}
          >
          </ListItem>
          <ListItem
            title={'Apartment size: ' + this.state.event.sizeOfTheAppt}
          >
          </ListItem>
          <Card title="Need to Clean">
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Floor</Text>
              <Icon style={styles.inputIcon} name={iconFloor} size={30} color={colorFloor}/>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Windows</Text>
              <Icon style={styles.inputIcon} name={iconWindows} size={30} color={colorWindows} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Bathroom</Text>
              <Icon style={styles.inputIcon} name={iconBathroom} size={30} color={colorBathroom}/>
            </View>
          </Card>


          {this.button()}
        </Card>
      );

    } else {
      return <ActivityIndicator style={{flex:1}} size="large" color="#8BC34A"/>
    }
  }
}


const styles = StyleSheet.create({
  main:{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  image:{},
  name:{},
  user:{},
  header: {
    backgroundColor: "#8BC34A",
    height: 200,
  },
  text:{
    fontSize:20,
    margin:5
  },
  mainButton:{
    alignSelf:'center',
    margin:50,
    // backgroundColor: "#00BFFF",
    // width:'100%',
    // height:200
    // color:"#00BFFF",
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: "#00BFFF",
  },
  inputIcon:{
    width:30,
    height:30,
    // justifyContent: 'center'
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:4,
    borderBottomWidth: 1,
    width:'100%',
    height:30,
    // margin:15,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
})