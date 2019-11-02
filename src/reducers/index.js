import { combineReducers } from 'redux'
import auth from './auth';
import user from './user';
import request from './request';
import channel from './channel';
import notification from './notification';
import firstTime from './firstTime';
import forms from './forms';
export default combineReducers({
    auth,
    user ,
    request,
    channel,
    notification ,
    firstTime ,
    forms
});