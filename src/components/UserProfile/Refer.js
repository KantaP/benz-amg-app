import React from 'react';

import { Query } from 'react-apollo';
import { listPostReferSeconds } from '../../graphql/queries';
import { onUpdatePost } from '../../graphql/subscriptions';
import gql from 'graphql-tag';
import { getUnique } from '../../containers/utils';
import { View , Title , Image , Text  , Caption} from '@shoutem/ui';
import PreloadPostCard from '../PreloadPostCard';
import { FlatList } from 'react-native'
import _ from 'lodash'; 
import { SimpleLineIcon } from '../Icon';
import moment from 'moment-timezone';
import { withNavigationFocus } from 'react-navigation';
import { PostPlaceHolder } from '../PostPlaceHolder';

let loadMore = false;

const ReferView = ({userId , isFocused}) => (
    (isFocused)
    ? (
        <Query 
            variables={{filter: {receiver: {eq: userId}} , limit: 5}} 
            query={gql(listPostReferSeconds)}
            fetchPolicy="network-only"
            errorPolicy="ignore"
        >
            {
                ({subscribeToMore , data , loading , error , fetchMore}) => {
                    
                    if(loading) return <View style={{padding: 10}}><PostPlaceHolder /></View>; 
                    if(error) return (<Text>{error.message}</Text>)
                    // console.log('bookmark' , data , {filter: {userBookmarkCode: {eq: userId}} , limit: 5})
                    return (
                        <ReferList 
                            data={data.listPostReferSeconds.items}
                            loadMore={()=>{
                                if(data.listPostReferSeconds.nextToken && !loadMore) {
                                    loadMore = true;
                                    fetchMore({
                                        variables: {
                                            nextToken: data.listPostReferSeconds.nextToken
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            // console.log('fetch more' , fetchMoreResult)
                                            // console.log(result.data.listPosts.nextToken)
                                            if (!fetchMoreResult) return prev;
                                            let concatArray = [...prev.listPostReferSeconds.items , ...fetchMoreResult.listPostReferSeconds.items];
                                            let uniqueValue = getUnique(concatArray , 'id');
                                            loadMore = false;
                                            return Object.assign({}, prev, {
                                                listPostReferSeconds: Object.assign({} , prev.listPostReferSeconds , {
                                                    items: [...uniqueValue],
                                                    nextToken: fetchMoreResult.listPostReferSeconds.nextToken
                                                })
                                            });
                                        }
                                    })
                                }
                                
                            }}
                            footerComponent={()=>{
                                if(loadMore) {
                                    return (
                                        <PostPlaceHolder />
                                    )
                                }
                                return null;
                            }}
                        />
                    )
                }
            }
        </Query>
    )
    : null
    
)

class ReferList extends React.Component {

    onUpdatePost = null

    componentDidMount() {
        // console.log('bookmark data' , this.props.data.listPostBookmarks.items.length);
        // this.onUpdatePost = this.props.onUpdatePost();
    }

    componentWillUnmount() {
        // this.onUpdatePost();
    }

    render() {

        
        if(this.props.data.length === 0) {
            return (
                <View styleName="vertical v-center h-center" style={{flex: 1}}>
                    <Title style={{color:'#ccc' , fontWeight:'bold'}}>No Refer</Title>
                    <Caption style={{color:'#ccc'}}>This page will contain information when</Caption>
                    <Caption style={{color:'#ccc'}}>you received refer from other users</Caption>
                </View>
            )
        }
        let posts = _(this.props.data)
                    .filter((item)=>item)
                    .value();
        // console.log(posts); 
        return (
            <FlatList 
                initialNumToRender={8}
                maxToRenderPerBatch={2}
                onEndReachedThreshold={0.5}
                onEndReached={()=>{
                    this.props.loadMore();
                }}
                keyExtractor={(item,index)=>item.id}
                data={[].concat(posts)} 
                renderItem={({item})=>{
                    return <ReferItem post={item.post} referrer={item.referrerPostUser} createdAt={item.createdAt} />
                }}
                ListFooterComponent={this.props.footerComponent}
            />
        )
    }
}

class ReferItem extends React.PureComponent {
    
    render() {
        if(!this.props.referrer) {
            return null;
        }
        return (<View styleName="vertical">
            <View styleName="horizontal v-center" style={{padding: 10 , borderBottomColor:'#eee' , borderBottomWidth: 1}}>
                <Image 
                    styleName="small-avatar"
                    source={
                        (this.props.referrer.image)
                        ? { uri : this.props.referrer.image }
                        : require('../../assets/images/user-blank.jpg')
                    }
                />
                <View styleName="vertical" style={{marginLeft : 5}}>
                    <Text>{this.props.referrer.firstName} {this.props.referrer.lastName} refer post to you</Text>
                    <Text>{moment(this.props.createdAt).local().fromNow()}</Text>
                </View>
            </View>
            <PreloadPostCard id={this.props.post.id} showActivityTab showAction />
        </View>)
       
    }
}

export default withNavigationFocus(ReferView);

