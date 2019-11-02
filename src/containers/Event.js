import React from 'react';
import EventScreen from '../components/Event';
import { connect } from 'react-redux';

class EventContainer extends React.Component {
    static navigationOptions = { 
        header: null  ,
        // drawerLabel: 'Home',
    };
    render() {
        return <EventScreen {...this.props} />;
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile ,
    notification: state.notification
})

export default connect(mapStateToProps)(EventContainer);