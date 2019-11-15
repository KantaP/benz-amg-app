import React from 'react';
import EventDetailScreen from '../components/EventDetail';
import { connect } from 'react-redux';
import { getEvent } from '../graphql/customQueries';
import { createUserJoinedEvent , deleteUserJoinedEvent } from '../graphql/mutations';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ToastRefService from '../services/ToastRefService';
import uuidv4 from 'uuid/v4';
import toastRefService from '../services/ToastRefService';
import { API , graphqlOperation } from 'aws-amplify';
import { Platform,Linking } from 'react-native';

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

    async componentDidMount() {
        let event = this.props.navigation.getParam("event", {});
        // console.log(event);
        if(event.hasOwnProperty('eventJoineds')) {
            let userJoined = event.eventJoineds.items.filter((item)=>item.userId === this.props.user.userProfile.id);
            this.setState({event: event , joinId: (userJoined.length > 0 ) ? userJoined[0].id : '' , countJoined: event.eventJoineds.items.length});
        } else {
            let eventData = await API.graphql(graphqlOperation(getEvent , {
                id: event.id
            }))
            this.setState({event: eventData.data.getEvent , countJoined: eventData.data.getEvent.eventJoineds.items.length});
        }
        
        if(event.hasOwnProperty('joinId')) {
            this.setState({joinId: event.joinId});
        }
    }

    onOpenMap = () => {
        let scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        let latLng = this.state.event.location.placeLatLng;
        let label = this.state.event.location.placeName;
        let url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }

    onCreateJoin = () => {
        
        let joinId = uuidv4();
        let event = this.props.navigation.getParam("event", {});
        if(event.quota && (event.quota <= this.state.countJoined))  {
            toastRefService.get().show('This event has already reached the maximum number of users.')
            return;
        }
        let joinItem = { 
            id : joinId,
            eventId: event.id,
            userId: this.props.user.userProfile.id ,
            userJoinedEventUserEventId: this.props.user.userProfile.id,
            userJoinedEventEventJoinedId:  event.id,
            eventStartTimeUnix: event.startTime,
            eventEndTime: event.endTime
        }
        if(this.props.createUserJoinedEvent) {
            this.props.createUserJoinedEvent(joinItem);
            this.setState({joinId , countJoined : this.state.countJoined + 1});
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
                this.setState({joinId: "" , countJoined: this.state.countJoined - 1});
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
                onOpenMap={this.onOpenMap}
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
                // console.log(joinItem);
                // console.log(error);
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
                // console.log(error);
                ToastRefService.get().show('Something went wrong.')
            })
        }
    })
})(withCreateUserJoinedEvent)

export default withDeleteUserJoinedEvent;