import React from 'react';
import SettingScreen from '../components/Setting';
import { onStateChange } from '../containers/utils';
import { Auth } from 'aws-amplify';
import { hasNotificationChat } from '../actions/notification';
import { connect } from 'react-redux';
class SettingContainer extends React.Component {
    static navigationOptions = { header: null };

    state = {
        langs: [
            { title: "English" , value: "en"},
            { title: "Thai" , value: "th" } ,
        ],
        selectedLang: "",
        pushNotification: false
    }

    onSignOut = () => {
        this.props.hasNotificationChat(false);
        Auth.signOut();
        this.props.navigation.navigate('Auth');
    }

    render() {
        return <SettingScreen 
                    {...this.props} 
                    state={this.state} 
                    onStateChange={onStateChange.bind(this)} 
                    onSignOut={this.onSignOut}
                />;
    }
}

const mapDispatchToProps = (dispatch) => ({
    hasNotificationChat: (hasChat) => dispatch(hasNotificationChat(hasChat))
})

export default connect(null,mapDispatchToProps)(SettingContainer);