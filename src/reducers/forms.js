import {
     SET_CHANGWATS,
     SET_AMPHOES ,
     SET_TAMBONS
} from '../actions/types';

const initialState = {
    changwats:  [],
    amphoes: [],
    tambons: []
}

const channelReducer = (state = initialState , action) => {
    if(action.type === SET_CHANGWATS) {
        return {
            ...state ,
            changwats: action.payload
        };
    }
    if(action.type === SET_AMPHOES) {
        return {
            ...state ,
            amphoes: action.payload
        };
    } 
    if(action.type === SET_TAMBONS) {
        return {
            ...state ,
            tambons: action.payload
        };
    } 

    return state;
}

export default channelReducer;