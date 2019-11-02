import React from 'react';
import ProfileScreen from '../components/Profile';
import { goBack } from './utils';
import { Auth} from 'aws-amplify';

class ProfileContainer extends React.Component {
    static navigationOptions = { header: null };

    onSignOut = () => {
        Auth.signOut();
        this.props.navigation.navigate('Auth');
    }
    
    render() {
        return <ProfileScreen {...this.props} />
    }
}

export default ProfileContainer;

