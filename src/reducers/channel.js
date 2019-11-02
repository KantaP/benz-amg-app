import {
    SET_CHANNEL 
} from '../actions/channel';

const initialState = {
    channel:  null
}

const channelReducer = (state = initialState , action) => {
    if(action.type === SET_CHANNEL) {
        return {
            ...state ,
            channel: action.payload
        };
    } 

    return state;
}

export default channelReducer;