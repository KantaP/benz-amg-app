import React from 'react';
import PostDetailScreen from '../components/PostDetail';
import { goBack } from './utils';
import { graphql } from 'react-apollo';
import { createComment , updatePost } from '../graphql/mutations';
import gql from 'graphql-tag';
import uuidV4 from 'uuid/v4';
import { onStateChange } from './utils';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import moment from 'moment';
import toastRefService from '../services/ToastRefService';
// import moment from 'moment';
class PostDetailContainer extends React.Component {
    static navigationOptions = { header: null };
    state = {
        message : '',
        loading: false,
    }
    submit = false;
    render() {
        let post = this.props.navigation.state.params.post;
        // console.log(post);
        return (
            <PostDetailScreen 
            {...this.props}
            onAddComment={()=>{
                if(!this.submit) {
                    this.submit = true;
                } else {
                    return false;
                }
                this.setState({loading: true});
                const id = uuidV4();
                const comment = {
                    id ,
                    content: this.state.message , 
                    postId: post.id ,
                    userId: this.props.user.userProfile.id ,
                    createdAtUnix : moment().valueOf(),
                    commentPostCommentId: post.id ,
                    commentUserCommentId: this.props.user.userProfile.id
                };
                // console.log(comment);
                this.props.onAddComment(comment)
                .then((result)=>{
                    this.props.updatePost({
                        id: post.id ,
                        countComment: post.countComment + 1
                    })
                    this.setState({loading: false});
                    this.submit = false
                })
                .catch((error)=>{
                    console.log(error);
                    this.setState({loading: false});
                    toastRefService.get().show('Something went wrong');
                    this.submit = false
                })
                
                this.setState({
                    message: ''
                });
                Keyboard.dismiss();
            }}
            state={this.state}
            onStateChange={onStateChange.bind(this)}
            onGoBack={goBack.bind(this)} 
            post={post} />
        )
        
    }
}

const mapStateToProps = (state) => ({
    user: state.user ,
})

const withConnect = connect(mapStateToProps)(PostDetailContainer);

const withCreateComment = graphql(gql(createComment), {
    props: props => ({
        onAddComment: comment => {
            if(!comment.content) return false;
            return props.mutate({
                variables: { input: comment }
            })
        }
    })
})(withConnect)

const withUpdatePost = graphql(gql(updatePost), {
    props: props => ({
        updatePost: updateItem => {
            return props.mutate({
                variables: { input : updateItem }
            })
        }
    })
})(withCreateComment)



export default withUpdatePost;

