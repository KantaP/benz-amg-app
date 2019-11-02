import { 
    AGREE_TERM ,
    READ_TUTORIAL ,
    GREETING_POST
} from './types';


export const agreeTerm = () => {
    return {
        type: AGREE_TERM
    }
}

export const readTutorial = () => {
    return {
        type: READ_TUTORIAL
    }
}

export const greetingPost = () => {
    return {
        type: GREETING_POST
    }
}