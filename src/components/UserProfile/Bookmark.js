import React from 'react';

import { Query } from 'react-apollo';
import { listPostBookmarks } from '../../graphql/queries';
import { onUpdatePost } from '../../graphql/subscriptions';
import gql from 'graphql-tag';
import { getUnique } from '../../containers/utils';
import { View , Title , Caption , Text } from '@shoutem/ui';
import PreloadPostCard from '../PreloadPostCard';
import { FlatList } from 'react-native'
import _ from 'lodash'; 
import { SimpleLineIcon } from '../Icon';
import { withNavigationFocus } from 'react-navigation';
import { PostPlaceHolder } from '../PostPlaceHolder';

let loadMore = false;

const BookmarkView = ({userId , isFocused}) => (
    (isFocused) 
    ? (
        <Query 
            variables={{filter: {userBookmarkCode: {eq: userId}}}} 
            query={gql(listPostBookmarks)}
            errorPolicy="ignore"
            fetchPolicy="network-only"
        >
            {
                ({subscribeToMore , data , loading , fetchMore , error}) => {
                    if(error) return <Text>{error.message}</Text>
                    if(loading) return <View style={{padding: 10}}><PostPlaceHolder /></View>;
                    // console.log('bookmark' , data , {filter: {userBookmarkCode: {eq: userId}} , limit: 5})
                    return (
                        <BookmarkList 
                            data={data}
                            loadMore={()=>{
                                if(data.listPostBookmarks.nextToken && !loadMore) {
                                    loadMore = true;
                                    fetchMore({
                                        variables: {
                                            nextToken: data.listPostBookmarks.nextToken
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            // console.log('fetch more' , fetchMoreResult)
                                            // console.log(result.data.listPosts.nextToken)
                                            if (!fetchMoreResult) return prev;
                                            let concatArray = [...prev.listPostBookmarks.items , ...fetchMoreResult.listPostBookmarks.items];
                                            let uniqueValue = getUnique(concatArray , 'id');
                                            loadMore = false;
                                            return Object.assign({}, prev, {
                                                listPostBookmarks: Object.assign({} , prev.listPostBookmarks , {
                                                    items: [...uniqueValue],
                                                    nextToken: fetchMoreResult.listPostBookmarks.nextToken
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

class BookmarkList extends React.Component {

    onUpdatePost = null

    componentDidMount() {
        // console.log('bookmark data' , this.props.data.listPostBookmarks.items.length);
        // this.onUpdatePost = this.props.onUpdatePost();
    }

    componentWillUnmount() {
        // this.onUpdatePost();
    }

    render() {

        let posts = _(this.props.data.listPostBookmarks.items)
                    .filter((item)=>item)
                    .filter((item)=>item.postBookmark.type.toLowerCase() === 'post' || item.postBookmark.type.toLowerCase() === 'broadcast').value()
        if(posts.length === 0) {
            return (
                <View styleName="vertical v-center h-center" style={{flex: 1}}>
                    <Title style={{color:'#ccc' , fontWeight:'bold'}}>No Bookmark</Title>
                    <Caption style={{color:'#ccc'}}>You can bookmark post from homepage</Caption>
                </View>
            )
        } 
        return (
            <FlatList 
                initialNumToRender={8}
                maxToRenderPerBatch={2}
                onEndReachedThreshold={0.5}
                onEndReached={()=>{
                    this.props.loadMore();
                }}
                keyExtractor={(item,index)=>item.id}
                data={posts} 
                renderItem={({item})=>{
                    return <PreloadPostCard id={item.postBookmark.id} showActivityTab showAction />
                }}
                ListFooterComponent={this.props.footerComponent}
            />
        )
    }
}

export default withNavigationFocus(BookmarkView);

