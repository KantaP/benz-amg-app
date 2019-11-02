import { 
    AGREE_TERM ,
    READ_TUTORIAL ,
    GREETING_POST
} from '../actions/types';

const initialState = {
    agreeTerm : false ,
    readTutorial: false,
    greetingPost: false,
}

const firstTime = (state = initialState , action ) => {
    if(action.type === AGREE_TERM) {
        return {
            ...state ,
            agreeTerm: true
        }
    }

    if(action.type === READ_TUTORIAL) {
        return {
            ...state ,
            readTutorial: true
        }
    }

    if(action.type === GREETING_POST) {
        return {
            ...state ,
            greetingPost: true
        }
    }

    return state;
}

export default firstTime;