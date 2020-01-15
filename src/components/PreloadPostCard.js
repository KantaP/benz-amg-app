import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@shoutem/ui';
import { Query } from 'react-apollo';
import { getPost } from '../graphql/customQueries';
import { onUpdatePost , onCreatePostImage , onCreatePostRadeemSecond } from '../graphql/subscriptions';
import gql from 'graphql-tag'; 
import PostCard from './PostCard';
import { graphql } from 'react-apollo';
import { updatePost , createPostBookmark , deletePostBookmark , createPostRadeemSecond , deletePost , createPostConnect } from '../graphql/mutations';
import { connect } from 'react-redux';
import ToastRefService from '../services/ToastRefService';
// import PostCardPreview from './PostCardPreview';
// import { Facebook } from 'react-content-loader';
// const MyFacebookLoader = () => <Facebook />
import { withNavigation } from 'react-navigation';

const query = gql(getPost);

class PreloadPostCard extends React.PureComponent {

    render() {
        let props = this.props;
        return(
            <Query 
                query={query} 
                variables={{
                    id:props.id , 
                    sortImage: 'ASC',
                    filterPostBookmark: {
                        userBookmarkCode: {
                            eq: props.userProfile.id
                        }
                    },
                    filterPostRadeem: {
                        userId: {
                            eq: props.userProfile.id
                        }
                    }
                }}
                fetchPolicy="network-only"
                notifyOnNetworkStatusChange
            >
                {
                    ({data , loading , error , subscribeToMore , networkStatus}) => {
                        
                        // if(networkStatus === 4) return (<MyFacebookLoader />);
                        if(loading) return null
                        if(error || !data) {
                            throw new Error(error);
                        }
                        // return (<MyFacebookLoader />);
                        // console.log(data);
                        return (
                        <PostCard 
                            {...props} 
                            post={data.getPost} 
                            onUpdatePost={()=>
                                subscribeToMore({
                                    document: gql(onUpdatePost),
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) return prev;
                                        const updateItem = subscriptionData.data.onUpdatePost;
                                        // console.log('update item' , updateItem);
                                        if(prev.getPost.id !== updateItem.id) return prev;
                                        let newItem = Object.assign({}, prev, {
                                            getPost: Object.assign({} , prev.getPost , updateItem)
                                        });
                                        return newItem;
                                    }
                                }) 
                            }
                            onCreatePostImage={()=>
                                subscribeToMore({
                                    document: gql(onCreatePostImage),
                                    updateQuery: (prev, { subscriptionData}) => {
                                        if (!subscriptionData.data) return prev;
                                        // console.log(subscriptionData.data.onCreatePostImage)
                                        const newPostImagesItem = subscriptionData.data.onCreatePostImage;
                                        if(prev.getPost.id !== newPostImagesItem.postImage.id) return prev;
                                        if(prev.getPost.postImages.items.filter((item)=>item.id === newPostImagesItem.id).length) return prev;
                                        return Object.assign({} , prev , {
                                            getPost: Object.assign({} , prev.getPost , {
                                                postImages: Object.assign({} , prev.getPost.postImages , {
                                                    items: [newPostImagesItem , ...prev.getPost.postImages.items]
                                                })
                                            })
                                        })
                                    }
                                })
                            }
                            onCreatePostRadeemSecond={()=>
                                subscribeToMore({
                                    document: gql(onCreatePostRadeemSecond),
                                    updateQuery: (prev, { subscriptionData}) => {
                                        if (!subscriptionData.data) return prev;
                                        console.log(subscriptionData.data.onCreatePostRadeemSecond)
                                        const newPostItem = subscriptionData.data.onCreatePostRadeemSecond;
                                        if(prev.getPost.id !== newPostItem.postRadeem.id) return prev;
                                        if(prev.getPost.postRadeem.items.filter((item)=>item.id === newPostItem.id).length) return prev;
                                        return Object.assign({} , prev , {
                                            getPost: Object.assign({} , prev.getPost , {
                                                postRadeem: Object.assign({} , prev.getPost.postRadeem , {
                                                    items: [newPostItem , ...prev.getPost.postRadeem.items]
                                                })
                                            })
                                        })
                                    }
                                })}
                        />);
                    }
                }
            </Query>
        )
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile
})

PreloadPostCard.propTypes = {
    showActivityTab: PropTypes.bool,
    showAction: PropTypes.bool
}

const PreloadPostCardwithConnect = connect(mapStateToProps)(PreloadPostCard);


const PreloadPostCardwithUpdatePost = graphql(gql(updatePost) , {
    props: props => ({
        updatePost: updateItem => {
            console.log('update post' , updateItem)
            props.mutate({
                variables: { input : updateItem }
            })
        },
    }),
})(PreloadPostCardwithConnect);

const PreloadPostCardwithCreateBookmark = graphql(gql(createPostBookmark) , {
    props: props => ({
        createBookmark: bookmarkItem => {
            return props.mutate({
                variables: { input : bookmarkItem}
            })
        }
    })
})(PreloadPostCardwithUpdatePost)

const PreloadPostCardwithDeleteBookmark = graphql(gql(deletePostBookmark) , {
    props: props => ({
        deleteBookmark: bookmarkItem => {
            return props.mutate({
                variables: { input: bookmarkItem }
            })
        }
    })
})(PreloadPostCardwithCreateBookmark)

const PreloadPostCardwithCreatePostRadeem = graphql(gql(createPostRadeemSecond) , {
    props: props => ({
        createPostRadeem: radeemItem => {
            return props.mutate({
                variables: { input : radeemItem }
            })
            .then((result)=>{
                ToastRefService.get().show('Use redeem success.')
            })
            .catch((error)=>{
                ToastRefService.get().show('Failed to use redeem.')
            })
        }
    })
})(PreloadPostCardwithDeleteBookmark)

const PreloadPostCardwithDeletePost = graphql(gql(deletePost) , {
    props: props => ({
        deletePost: deleteItem => {
            props.mutate({
                variables: { input : deleteItem }
            })
            .then((result)=>{
                ToastRefService.get().show('Delete post success.')
            })
            .catch((error)=>{
                ToastRefService.get().show('Something went wrong.')
            })
        }
    })
})(PreloadPostCardwithCreatePostRadeem)

const PreloadPostCardwithCreatePostConnect = graphql(gql(createPostConnect), {
    props: props => ({
        createPostConnect: postConnectItem => {
            props.mutate({
                variables: {input: postConnectItem}
            })
        }
    })
})(PreloadPostCardwithDeletePost)



export default withNavigation(PreloadPostCardwithCreatePostConnect);