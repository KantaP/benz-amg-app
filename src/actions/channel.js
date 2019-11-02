import { 
    SET_CHANNEL
} from './types';

export const setChannel = (channel) => {
    return {
        type: SET_CHANNEL,
        payload: channel
    };
}

