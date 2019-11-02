import React from 'react';
import EventDetailScreen from '../components/EventDetail';
import { connect } from 'react-redux';
import { listEvents } from '../graphql/queries';
import { createUserJoinedEvent , deleteUserJoinedEvent } from '../graphql/mutations';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ToastRefService from '../services/ToastRefService';
import uuidv4 from 'uuid/v4';
import toastRefService from '../services/ToastRefService';
class EventDetailContainer extends React.Component {
    static navigationOptions = { 
        header: null  ,
        // drawerLabel: 'Home',
    };

    state = {
        event: {},
        joinId: "",
        countJoined: 0
    }

    componentDidMount() {
        let event = this.props.navigation.getParam("event", {});
        if(event.hasOwnProperty('eventJoineds')) {
            let userJoined = event.eventJoineds.items.filter((item)=>item.userId === this.props.user.userProfile.id);
            console.log('user joined'  , event.eventJoineds);
            if(userJoined.length > 0) {
                this.setState({joinId: userJoined[0].id , countJoined: userJoined.length});
            }
        }
        
        if(event.hasOwnProperty('joinId')) {
            this.setState({joinId: event.joinId});
        }
    }

    onCreateJoin = () => {
        
        let joinId = uuidv4();
        let event = this.props.navigation.getParam("event", {});
        if(event.quota && (event.quota >= this.state.countJoined))  {
            toastRefService.get().show('This event has already reached the maximum number of users.')
        }
        let joinItem = { 
            id : joinId,
            eventId: event.id,
            userId: this.props.user.userProfile.id ,
            userJoinedEventUserEventId: this.props.user.userProfile.id,
            userJoinedEventEventJoinedId:  event.id,
            eventStartTimeUnix: event.startTime
        }
        if(this.props.createUserJoinedEvent) {
            this.props.createUserJoinedEvent(joinItem);
            this.setState({joinId});
        }
    }

    onDeleteJoined = () => {
        if(this.state.joinId) {
            let event = this.props.navigation.getParam("event", {});
            let joinItem = { 
                id : this.state.joinId,
                eventId: event.id
            }
            if(this.props.deleteUserJoinedEvent) {
                this.props.deleteUserJoinedEvent(joinItem);
                this.setState({joinId: ""});
            }
        }
    }

    setJoinId = (joinId) => {
        this.setState({joinId});
    }
    
    render() {
        let event = this.props.navigation.getParam("event", {});
        return <EventDetailScreen 
                {...this.props} 
                state={this.state} 
                event={event} 
                onCreateJoin={this.onCreateJoin} 
                onDeleteJoined={this.onDeleteJoined}
                setJoinId={this.setJoinId}
                userProfile={this.props.user.userProfile}
                />;
    }
}

const mapStateToProps = (state) => ({
    user: state.user ,
})

const withConnect =  connect(mapStateToProps)(EventDetailContainer);

const withCreateUserJoinedEvent = graphql(gql(createUserJoinedEvent), {
    props: props => ({
        createUserJoinedEvent: (joinItem) => {
            props.mutate({
                variables: { input: joinItem }
            })
            .then((result)=>{
                ToastRefService.get().show('Join event success.')
            })
            .catch((error)=>{
                console.log(error);
                ToastRefService.get().show('Something went wrong.')
            })
        }
    })
})(withConnect)

const withDeleteUserJoinedEvent = graphql(gql(deleteUserJoinedEvent), {
    props: props => ({
        deleteUserJoinedEvent: (joinItem) => {
            props.mutate({
                variables: { input: joinItem }
            })
            .then((result)=>{
                ToastRefService.get().show('Unjoin event success.')
            })
            .catch((error)=>{
                console.log(error);
                ToastRefService.get().show('Something went wrong.')
            })
        }
    })
})(withCreateUserJoinedEvent)

export default withDeleteUserJoinedEvent;