import { 
    HAS_NOTIFICATION_CHAT
} from './types';

export const hasNotificationChat = (hasChat) => {
    return {
        type: HAS_NOTIFICATION_CHAT ,
        payload: hasChat
    }
}