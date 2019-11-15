import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { searchEvents , listEvents } from '../../graphql/customQueries';
import { eventsSortByStartTime } from '../../graphql/queries';
import { FlatList } from 'react-native';
import EventItem from './EventItem';
import PropTypes from 'prop-types';
import { getUnique } from '../../containers/utils';
import moment from 'moment';
import { 
    View,
    Title,
    Text
} from '@shoutem/ui';
import { SimpleLineIcon } from '../Icon';
import { PostPlaceHolder } from '../PostPlaceHolder';

let loadMore = false;

const ListUpcomingEvent = ({navigation  , userProfile}) => (
    <Query 
        query={gql(eventsSortByStartTime)} 
        variables={
            {
                hashStatus: 'ok',
                sortDirection: 'ASC',
                startTime: {
                    ge: moment().format()
                }
            }
        }
        fetchPolicy="network-only"
        // errorPolicy="ignore"
    >
        {
            ({data , loading , error , fetchMore }) => {
                if(loading) return <View style={{padding: 10}}><PostPlaceHolder /></View>;;
                if(error) return <Text>{error.message}</Text>
                if(!data.eventsSortByStartTime) return <Text>{JSON.stringify(data.eventsSortByStartTime)}</Text>
                let events = data.eventsSortByStartTime.items.filter((item)=>{
                    console.log(item);
                    if(item.hasOwnProperty('eventJoineds')) {
                        let findJoined = item.eventJoineds.items.findIndex((fItem)=>fItem.userId === userProfile.id);
                        return findJoined < 0;
                    }
                    return false;
                })
                if(events.length === 0) {
                    return (
                        <View styleName="vertical v-center h-center" style={{flex: 0.50, backgroundColor:'#fff'}}>
                            <Title style={{color:'#ccc'}}>No Upcoming Event</Title>
                            <SimpleLineIcon style={{fontSize: 30, color: '#ccc'}} name="calendar" /> 
                        </View>
                    )
                }
                return (
                    <FlatList 
                        style={{flexGrow: 0}}
                        removeClippedSubViews
                        data={events}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item}) => {
                            console.log(item)
                            return <EventItem event={item} navigation={navigation} />
                        }} 
                        initialNumToRender={8}
                        maxToRenderPerBatch={2} 
                        onEndReachedThreshold={0.5}
                        onEndReached={()=>{
                            if(data.eventsSortByStartTime.nextToken && !loadMore) {
                                loadMore = true;
                                fetchMore({
                                    variables: {
                                        nextToken: data.eventsSortByStartTime.nextToken
                                    },
                                    updateQuery: (prev, { fetchMoreResult }) => {
                                        if (!fetchMoreResult) return prev;
                                        let concatArray = [...prev.eventsSortByStartTime.items , ...fetchMoreResult.eventsSortByStartTime.items];
                                        let uniqueValue = getUnique(concatArray , 'id');
                                        let newItems = Object.assign({}, prev, {
                                            eventsSortByStartTime: Object.assign({} , prev.eventsSortByStartTime , {
                                                items: [...uniqueValue] ,
                                                nextToken : fetchMoreResult.eventsSortByStartTime.nextToken
                                            }),
                                            
                                        });
                                        loadMore = false;
                                        return newItems;
                                    }
                                })
                            }
                            
                        }}
                        ListFooterComponent={()=>{
                            if(loadMore) {
                                return <PostPlaceHolder />
                            }
                            return null
                        }}
                    />
                )
            }
        }
    </Query>
)

ListUpcomingEvent.propTypes = {
    navigation: PropTypes.any.isRequired ,
    startTimeUnix: PropTypes.any.isRequired,
}

export default ListUpcomingEvent;