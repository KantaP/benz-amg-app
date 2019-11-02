import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { searchEvents , listEvents } from '../../graphql/customQueries';
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

const ListUpcomingEvent = ({navigation  , userProfile}) => (
    <Query 
        query={gql(listEvents)} 
        variables={
            {
                filter: {
                    or: [
                        {
                            startTime: {
                                ge: moment().format()
                            },
                        } ,
                        {
                            endTime: { 
                                ge: moment().format()
                            }
                        }
                    ]
                }
            }
        }
        fetchPolicy="network-only"
    >
        {
            ({data , loading , error , fetchMore }) => {
                if(loading) return null;
                if(error) return <Text>{error.message}</Text>
                // console.log({limit: 10 , filter: {createdAtUnix: {ge: createdAtUnix}}});
                if(data.listEvents.items.length === 0) {
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
                        data={data.listEvents.items}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item}) => {
                            return <EventItem event={item} navigation={navigation} />
                        }} 
                        initialNumToRender={8}
                        maxToRenderPerBatch={2} 
                        onEndReachedThreshold={0.5}
                        onEndReached={()=>{
                            fetchMore({
                                variables: {
                                    nextToken: data.listEvents.nextToken
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;
                                    let concatArray = [...prev.listEvents.items , ...fetchMoreResult.listEvents.items];
                                    let uniqueValue = getUnique(concatArray , 'id');
                                    let newItems = Object.assign({}, prev, {
                                        listEvents: Object.assign({} , prev.listEvents , {
                                            items: [...uniqueValue] ,
                                            nextToken : fetchMoreResult.listEvents.nextToken
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

ListUpcomingEvent.propTypes = {
    navigation: PropTypes.any.isRequired ,
    startTimeUnix: PropTypes.any.isRequired,
}

export default ListUpcomingEvent;