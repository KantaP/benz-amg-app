import { 
    HAS_NOTIFICATION_CHAT
} from '../actions/types';

const initialState = {
    hasNotificationChat: false
}

const notification = (state = initialState , action) => {
    if(action.type  === HAS_NOTIFICATION_CHAT) {
        return {
            ...state,
            hasNotificationChat: action.payload
        }
    }
    return state;
}

export default notification;