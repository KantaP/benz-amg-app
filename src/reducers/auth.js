import { AUTHENTICATED } from '../actions/types';

const initialState = {
    user: {},
}

const authReducer = (state = initialState, action) => {

    if(action.type === AUTHENTICATED) {
        return Object.assign({} , state , {
            user: action.payload
        })
    }

    return state;
}

export default authReducer;