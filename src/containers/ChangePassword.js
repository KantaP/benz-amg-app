import React from 'react';
import { Auth } from 'aws-amplify';
import { onStateChange } from './utils';
import ChangePasswordScreen from '../components/ChangePassword';
import toastRefService from '../services/ToastRefService';


class ChangePasswordContainer extends React.Component {

    static navigationOptions = { 
        header: null  ,
    };

    state = {
        oldPassword: '' ,
        newPassword: '' ,
        confirmPassword: '',
        submit: false,
        loading: false,
    }

    onChangePassword = () => {
        
        if(
            (!this.state.newPassword) ||
            (!this.state.confirmPassword) ||
            (!this.state.oldPassword) ||
            (this.state.newPassword !== this.state.confirmPassword)
         ) {
            return;
        }
        this.setState({submit: true , loading: true});
        Auth.currentAuthenticatedUser()
            .then(user => {
                return Auth.changePassword(user, this.state.oldPassword, this.state.newPassword);
            })
            .then(data => {
                console.log(data);
                if(data === 'SUCCESS') {
                    toastRefService.get().show('Change password success.');
                }
                this.setState({loading: false , submit: false});
            })
            .catch(err => {
                toastRefService.get().show('Change password failed.');
                this.setState({loading: false , submit: false});
            });
    }

    render() {
        return <ChangePasswordScreen {...this.props} state={this.state} onStateChange={onStateChange.bind(this)} onChangePassword={this.onChangePassword} />;
    }
}

export default ChangePasswordContainer;