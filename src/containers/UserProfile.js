import React from 'react';
import UserProfileScreen from '../components/UserProfile';
import { connect } from 'react-redux';
import { Auth} from 'aws-amplify';

class UserProfileContainer extends React.Component {
    static navigationOptions = { header: null };

    state = { 
        tabSelected: 0
    }

    selectTab = (index) => {
        this.setState({tabSelected : index});
    }

    onSignOut = () => {
        Auth.signOut();
        this.props.navigation.navigate('Auth');
    }

    render() {
        return (
        <UserProfileScreen 
            {...this.props} 
            state={this.state} 
            onSelectTab={this.selectTab}
            onSignOut={this.onSignOut} 
        />
        )
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile,
    notification: state.notification
})

export default connect(mapStateToProps)(UserProfileContainer);