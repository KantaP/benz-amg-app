import React from 'react';
import { 
    View ,
    Text ,
    Title ,
    Subtitle ,
    Caption,
    TouchableOpacity
} from '@shoutem/ui';

import moment from 'moment';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

class EventItem extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        // console.log(this.props.event);
    }

    render() {
        console.log(this.props.event);
        let startEventTime = moment(this.props.event.startTime);
        return (
        <TouchableOpacity onPress={()=>{this.props.navigation.push('EventDetail', {event: this.props.event})}}>
            <View styleName="horizontal v-center" style={{backgroundColor:'#fff' ,borderWidth: 1 , borderColor: '#eee' , padding: 10}}>
                <View styleName="vertical v-center" style={{flex: 0.15}}>
                    <Text>{startEventTime.format('DD')}</Text>
                    <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{startEventTime.format('MMM')}</Caption>
                    <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{startEventTime.format('YYYY')}</Caption>
                </View>
                <View styleName="vertical v-center" 
                style={{
                    marginLeft: 20 , 
                    paddingLeft: 30 , 
                    borderLeftWidth: 1 , 
                    borderLeftColor: 'red', 
                    paddingRight: 10,
                    flex: 0.85
                }}>
                    <Text numberOfLines={1}>{this.props.event.title}</Text>
                    <Caption numberOfLines={3} style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 17}}>{this.props.event.location.placeName}</Caption>
                </View>
                {/* {
                    this.props.event.quota &&
                    this.props.event.hasOwnProperty('eventJoineds')
                    (
                        <View styleName="vertical h-center" style={{flex: 0.25}}>
                            <Title>Quata</Title>
                            <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{this.props.event.eventJoineds.items.length} / {this.props.event.quota}</Caption>
                        </View>
                    )
                } */}
            </View>
        </TouchableOpacity>
        )
    }
}

EventItem.propTypes = {
    event: PropTypes.any.isRequired,
    navigation: PropTypes.any.isRequired
}

export default EventItem;