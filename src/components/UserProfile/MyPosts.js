import React from 'react';
import { FlatList } from 'react-native'
import { Query } from 'react-apollo';
import { listPosts , itemsByPostType } from '../../graphql/queries';
import gql from 'graphql-tag';
import { getUnique } from '../../containers/utils';
// import { ListView } from '@shoutem/ui';
import PreloadPostCard from '../PreloadPostCard';
import { withNavigationFocus } from 'react-navigation';
import { View , Title , Caption } from '@shoutem/ui';
const MyPostsView = ({userId , isFocused}) => (
    (isFocused)
    ? (
        <Query query={gql(itemsByPostType)} variables={{type: 'Post' , filter: {owner: {eq: userId}} , limit: 100}}>
        {
            ({data , loading , error , fetchMore }) => {
                if(loading) return null 
                if(data.itemsByPostType.items.length === 0) {
                    return (
                        <View styleName="vertical v-center h-center" style={{flex: 1}}>
                            <Title style={{color:'#ccc' , fontWeight:'bold'}}>No Post</Title>
                            <View styleName="horizontal h-center">
                                <Caption style={{color:'#ccc', textAlign:'center'}} numberOfLines={2}>
                                    You can create post from create post page
                                </Caption>
                            </View>
                        </View>
                    )
                } 
                // console.log('mypost' , data.listPosts.items , {filter: {owner: {eq: userId}}});
                return (
                    <FlatList 
                        initialNumToRender={8}
                        maxToRenderPerBatch={2}
                        onEndReachedThreshold={0.5}
                        onEndReached={()=>{
                            fetchMore({
                                variables: {
                                    nextToken: data.itemsByPostType.nextToken
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;
                                    let concatArray = [...prev.itemsByPostType.items , ...fetchMoreResult.itemsByPostType.items];
                                    let uniqueValue = getUnique(concatArray , 'id');
                                    return Object.assign({}, prev, {
                                        itemsByPostType: Object.assign({} , prev.itemsByPostType , {
                                            items: [...uniqueValue],
                                            nextToken: fetchMoreResult.itemsByPostType.nextToken  
                                        })
                                    });
                                }
                            })
                        }}
                        keyExtractor={(item,index)=>item.id}
                        data={data.itemsByPostType.items} 
                        renderItem={({item})=>{
                            return <PreloadPostCard id={item.id} showAction showActivityTab />
                        }}                  
                    />
                )
            }
        }
        </Query>
    )
    : null
    
)

export default withNavigationFocus(MyPostsView);