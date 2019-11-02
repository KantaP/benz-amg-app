import React from 'react';
import SignInComponent from '../components/SignIn';
import { onStateChange } from './utils';
import { Auth } from 'aws-amplify'
import { authenticated } from '../actions/auth';
import { connect } from 'react-redux';
import { API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../graphql/queries'; 
import toastRefService from '../services/ToastRefService';
import { Linking } from 'react-native';
class SignInContainer extends React.Component {

    static navigationOptions = { header: null };
    state = {
        username: '',
        password: '',
        user: null,
        showSpinner: false
    }

    
    onOpenWeb = (path) => {
        const site = 'http://mup-env-amgclubthailand.ium2ebz7mx.ap-southeast-1.elasticbeanstalk.com';
        Linking.openURL(site + '/' + path);
    }

    signIn = async () => {
        await this.setState({showSpinner : true});
        const { username, password } = this.state
        // console.log('user data ' , username , password);
        setTimeout(async()=>{
            try {
                const user = await Auth.signIn(username, password)
                // console.log('user successfully signed in!', user)
                const userProfile = await API.graphql(graphqlOperation(getUser , {id: user.attributes.sub}));
                if(!userProfile.data.getUser.active) {
                    toastRefService.get().show('Username or password is incorrect');
                    this.setState({ showSpinner: false });
                    return false;
                }
                this.props.authenticated(user);
                this.setState({ showSpinner: false });
                this.props.navigation.navigate('AuthLoading');
            } catch (err) {
                console.log('error:', err)
                this.setState({ showSpinner: false});
                toastRefService.get().show('Username or password incorrect.');
            }
        },1000)
    }

    onShowSpinner = () => {
        return this.state.showSpinner
    }
    
    render() { 
         
        return (
            <SignInComponent
                screenProps={this.props.screenProps}
                onShowSpinner={this.onShowSpinner}
                onSignIn={this.signIn}
                onChangeText={onStateChange.bind(this)}
                onOpenWeb={this.onOpenWeb}
            />
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    authenticated: (user) => dispatch(authenticated(user))
})

export default connect(null, mapDispatchToProps)(SignInContainer);