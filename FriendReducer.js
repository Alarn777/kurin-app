import { combineReducers } from 'redux';
import axios from "axios";
import Consts from "./ENV_VARS";

const INITIAL_STATE = {
  current: [],
  possible: [],
  favorite_cleaners: [],
  cleaners:[],
  events:[],
  socket: []
};

const friendReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_FRIEND':
      // Pulls current and possible out of previous state
      // We do not want to alter state directly in case
      // another action is altering it at the same time
      const {
        current,
        possible,
      } = state;

      // Pull friend out of friends.possible
      // Note that action.payload === friendIndex



      current.push(action.payload)

      // const addedFriend = possible.splice(action.payload, 1);
      //
      // // And put friend in friends.current
      // current.push(addedFriend);

      // Finally, update our redux state
      const newState = { current, possible };
      return newState;
    default:
      return state;
  }
};


const cleanerReducer = (state = INITIAL_STATE, action) => {
  const {
    favorite_cleaners,
    events,
    socket
  } = state;
  // let {
  //   favorite_cleaners,
  //   events,
  //   socket
  // } = state;


  switch (action.type) {

    case 'ADD_SOCKET':
      // let newSocket = action.payload
      socket.push(action.payload)
      const newState3 =  { events,favorite_cleaners, socket };
      // console.log(newState3)
      return newState3


    case 'RELOAD_EVENTS':
      for( let event in events){
        events.pop()
      }

      return  { events,favorite_cleaners,socket };

    case 'REMOVE_EVENT':
      if(events.includes(action.payload)) {
        let index = events.indexOf(action.payload);
        if (index > -1) {
          events.splice(index, 1);
        }
      }
      const newState0 =  { events,favorite_cleaners,socket };
      return newState0

    case 'ADD_EVENT':
      let flag = true
      for( let event in events){
        if(events[event]._id === action.payload._id)
          flag = false

      }

      if(flag) {
        events.push(action.payload)
      }

      const newState1 =  { events,favorite_cleaners,socket };
      return newState1

    case 'REMOVE_CLEANER':
      if(favorite_cleaners.includes(action.payload)) {
        let index = favorite_cleaners.indexOf(action.payload);
        if (index > -1) {
          favorite_cleaners.splice(index, 1);
        }
      }
      const newState2 = { events,favorite_cleaners,socket };

      return newState2;

    case 'ADD_CLEANER':

      flag = true
      for( let cleaner in favorite_cleaners){
        if(favorite_cleaners[cleaner]._id === action.payload._id)
          flag = false

      }

      if(flag) {
        favorite_cleaners.push(action.payload)
      }


      // if(!favorite_cleaners.includes(action.payload)) {
      //   favorite_cleaners.push(action.payload)
      // }

      const newState = { events,favorite_cleaners,socket };
      return newState;
    default:
      return state;
  }
};


export default combineReducers({
  // friends: friendReducer,
  cleaners: cleanerReducer,
});