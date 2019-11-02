import { 
    SET_CURRENT_LOCATION ,
    SET_USER_PROFILE ,
    ADD_USER_LIST ,
    SET_LIST_USERS ,
    SET_LIST_USER_BLOCKS ,
    SET_LIST_USER_WHO_BLOCKS_CURRENT_USER
} from './types';

export const setCurrentLocation = (coordinate) => {
    return {
        type: SET_CURRENT_LOCATION ,
        payload : coordinate
    }
}

export const setUserProfile = (userProfile) => {
    return {
        type: SET_USER_PROFILE ,
        payload: userProfile
    }
}

export const setListUsers = (listUsers) => {
    return {
        type: SET_LIST_USERS ,
        payload: listUsers
    }
}

export const addUserInList = (user) => {
    return {
        type: ADD_USER_LIST ,
        payload: user
    }
}

export const setListUserBlocks = (listUserBlocks) => {
    return {
        type: SET_LIST_USER_BLOCKS,
        payload: listUserBlocks
    }
}

export const setListUserWhoBlockCurrentUser = (listUsers) => {
    return {
        type: SET_LIST_USER_WHO_BLOCKS_CURRENT_USER,
        payload: listUsers
    }
}