import { 
    REQUEST_FINISHED ,
    REQUEST_STARTED
} from './types';

export const requestStarted = () => {
    return {
        type: REQUEST_STARTED
    }
}

export const requestFinished = () => {
    return {
        type: REQUEST_FINISHED
    }
}