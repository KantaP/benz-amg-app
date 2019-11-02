import { REQUEST_FINISHED , REQUEST_STARTED } from '../actions/types';

const initialState = {
    loading: false
}

const requestReducer = (state = initialState, action) => {
    if(action.type === REQUEST_STARTED) {
        return {
            loading: true
        }
    }

    if(action.type === REQUEST_FINISHED) {
        return {
            loading: false
        }
    }

    return state;
}

export default requestReducer;