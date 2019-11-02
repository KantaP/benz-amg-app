import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { listUserJoinedEvents } from '../../graphql/customQueries';
import { FlatList , Platform } from 'react-native';
import EventItem from './EventItem';
import PropTypes from 'prop-types';
import { getUnique } from '../../containers/utils';

import { 
    View,
    Title
} from '@shoutem/ui';
import { SimpleLineIcon } from '../Icon';


const ListMyEvent = ({navigation , startTimeUnix , userProfile}) => (
    <Query 
        query={gql(listUserJoinedEvents)} 
        variables={{
            filter: {
                userId: {
                    eq: userProfile.id
                }
            }
        }}
        fetchPolicy="network-only"
    >
        {
            ({data , loading , error , fetchMore }) => {
                if(loading) return null;
                // console.log({limit: 10 , filter: {createdAtUnix: {ge: createdAtUnix}}});
                if(data.listUserJoinedEvents.items.length === 0) {
                    return (
                        <View styleName="vertical v-center h-center" style={{flex: 0.50, backgroundColor:'#fff'}}>
                            <Title style={{color:'#ccc'}}>No Event</Title>
                            <SimpleLineIcon style={{fontSize: 30, color: '#ccc'}} name="calendar" /> 
                        </View>
                    )
                }
                return (
                    <FlatList 
                        style={{flexGrow: 0}}
                        removeClippedSubViews
                        data={data.listUserJoinedEvents.items}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item}) => {
                            // let mappedItem = Object.assign({} , item);
                            // mappedItem['eventJoineds']['items'] = [mappedItem.eventJoined];
                            // console.log('mappeditem' , mappedItem)
                            item.eventJoined.joinId = item.id;
                            return <EventItem event={item.eventJoined} navigation={navigation} />
                        }} 
                        initialNumToRender={8}
                        maxToRenderPerBatch={2} 
                        onEndReachedThreshold={0.5}
                        onEndReached={()=>{
                            fetchMore({
                                variables: {
                                    nextToken: data.listUserJoinedEvents.nextToken
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;
                                    let concatArray = [...prev.listUserJoinedEvents.items , ...fetchMoreResult.listUserJoinedEvents.items];
                                    let uniqueValue = getUnique(concatArray , 'id');
                                    let newItems = Object.assign({}, prev, {
                                        listUserJoinedEvents: Object.assign({} , prev.listUserJoinedEvents , {
                                            items: [...uniqueValue] ,
                                            nextToken : fetchMoreResult.listUserJoinedEvents.nextToken
                                        }),
                                        
                                    });
                                    return newItems;
                                }
                            })
                        }}
                        
                    />
                )
            }
        }
    </Query>
)

ListMyEvent.propTypes = {
    navigation: PropTypes.any.isRequired ,
    startTimeUnix: PropTypes.any.isRequired,
    userProfile: PropTypes.any
}

export default ListMyEvent;