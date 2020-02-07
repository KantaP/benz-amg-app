import { AUTHENTICATED } from './types';

export const authenticated = (user) => {
    return {
        type: AUTHENTICATED ,
        payload: user
    }
}



