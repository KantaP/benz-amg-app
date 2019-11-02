import { 
    SET_CURRENT_LOCATION  , 
    SET_USER_PROFILE , 
    ADD_USER_LIST , 
    SET_LIST_USERS  ,
    SET_LIST_USER_BLOCKS,
    SET_LIST_USER_WHO_BLOCKS_CURRENT_USER
} from '../actions/types';

const initialState = {
    currentLocation: {} ,
    userProfile: {} ,
    listUsers: [],
    listUserBlocks: [] ,
    listUserWhoBlockCurrentUser: []
}

const userReducer = (state = initialState , action) => {
    if(action.type === SET_CURRENT_LOCATION) {
        return Object.assign({} , state , {
            currentLocation: action.payload
        })
    }

    if(action.type === SET_USER_PROFILE) {
        return Object.assign({} , state , {
            userProfile: action.payload
        })
    }
    
    if(action.type === ADD_USER_LIST) {
        return Object.assign({} , state , {
            listUsers: [...state.listUsers , action.payload]
        })
    }

    if(action.type === SET_LIST_USERS) {
        return Object.assign({} , state , {
            listUsers: [...action.payload]
        })
    }

    if(action.type === SET_LIST_USER_BLOCKS) {
        return Object.assign({} ,state , {
            listUserBlocks: [...action.payload]
        })
    }

    if(action.type === SET_LIST_USER_WHO_BLOCKS_CURRENT_USER) {
        return Object.assign({} ,state , {
            listUserWhoBlockCurrentUser: [...action.payload]
        })
    }

    return state;
}

export default userReducer;