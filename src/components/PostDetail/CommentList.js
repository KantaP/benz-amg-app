import React from 'react';

import gql from 'graphql-tag';
import { getPost , listComments } from '../../graphql/queries';
import { onCreateComment  , onDeleteComment } from '../../graphql/subscriptions';
import { Query } from 'react-apollo';
// import { ListView } from '@shoutem/ui';
import CommentItem from './CommentItem';
import { FlatList } from 'react-native';
import _ from 'lodash';
import { getUnique } from '../../containers/utils';
const CommentList = ({postId}) => (
    <Query 
        query={gql(listComments)} 
        variables={{filter: {postId : { eq: postId}}}}
        fetchPolicy="network-only"
    >
        {
            ({data , loading , error , subscribeToMore , fetchMore }) => {
                
                if(loading) return null;
                return (
                    <CommentListComponent 
                        data={data}
                        loadMore={()=>{
                            // console.log('nextToken' , data.listPosts.nextToken);
                            fetchMore({
                                variables: {
                                    nextToken: data.listComments.nextToken
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;
                                    let concatArray = [...prev.listComments.items , ...fetchMoreResult.listComments.items];
                                    let uniqueValue = getUnique(concatArray , 'id');
                                    let newItems = Object.assign({}, prev, {
                                        listComments: Object.assign({} , prev.listComments , {
                                            items: [...uniqueValue] ,
                                            nextToken : fetchMoreResult.listComments.nextToken
                                        }),
                                        
                                    });
                                    // console.log(newItems.listPosts.items.map((item)=>item.id));
                                    return newItems;
                                }
                            })
                        }}
                        onCreateComment={()=>
                            subscribeToMore({
                                document: gql(onCreateComment),
                                updateQuery: (prev, { subscriptionData }) => {
                                    // console.log(this.props);
                                    // this.props.navigation.navigate('Home');
                                    if (!subscriptionData.data) return prev;
                                    const newCommentItem = subscriptionData.data.onCreateComment;
                                    // console.log('new comment' , newCommentItem);
                                    // if(prev.listComments.id !== newCommentItem.postComment.id) return prev;
                                    return Object.assign({}, prev, {
                                        listComments: Object.assign({} , prev.listComments , {
                                            items: [newCommentItem , ...prev.listComments.items ]
                                        })
                                    });
                                }
                            })
                        }
                        onDeleteComment={()=>
                            subscribeToMore({
                                document: gql(onDeleteComment),
                                updateQuery: (prev , { subscriptionData }) => {
                                    if (!subscriptionData.data) return prev;
                                    const deleteCommentItem = subscriptionData.data.onDeleteComment;
                                    // console.log('delete comment' , deleteCommentItem)
                                    return Object.assign({} , prev , {
                                        listComments: Object.assign({} , prev.listComments , {
                                            items: [...prev.listComments.items.filter((item)=>item.id !== deleteCommentItem.id)]
                                        })
                                    });
                                }
                            })
                        }
                    />
                )
            }
        }
    </Query>
)

class CommentListComponent extends React.Component {
    
    onCreateComment = null;
    onDeleteComment = null;

    componentDidMount() {
        this.onCreateComment = this.props.onCreateComment();
        this.onDeleteComment = this.props.onDeleteComment();
    }

    componentWillUnmount(){
        this.onCreateComment();
        this.onDeleteComment();
    }

    render() {
        // return (
        //     <ListView 
        //         data={this.props.data.getPost.postComments.items}
        //         renderRow={(comment, index)=>{
        //             return (<CommentItem commentId={comment.id} key={index} />)
        //         }}
        //     />
        // )

        return (
            <FlatList
                removeClippedSubViews
                data={_(this.props.data.listComments.items).orderBy('createdAtUnix' , 'desc').value()}
                keyExtractor={(item, index) => item.id}
                renderItem={({item}) => {
                    // console.log('comment' ,item);
                    return (<CommentItem commentId={item.id} />)
                }}
                initialNumToRender={8}
                maxToRenderPerBatch={2}
                onEndReachedThreshold={2}
                onEndReached={()=>{
                    this.props.loadMore();
                }}
                
            />
        )
    }
}


export default CommentList;