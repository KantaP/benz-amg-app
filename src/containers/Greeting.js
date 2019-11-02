import React from 'react';
import { connect } from 'react-redux';
import { greetingPost } from '../actions/firstTime';
import { createPost } from '../graphql/mutations';
import { graphql } from 'react-apollo';
import uuidV4 from 'uuid/v4';
import moment from 'moment';
import config from '../aws-exports';
import { Auth , Storage } from 'aws-amplify'
import gql from 'graphql-tag';
import toastRefService from '../services/ToastRefService';
import GreetingScreen from '../components/Greeting';
import { onStateChange } from './utils';
class GreetingContainer extends React.Component {
    state = {
        content: '' ,
        loading: false
    }

    createPost = () => {
        const id = uuidV4();
        const createdAt = moment().format();
        let place = {
            placeName:  'null' ,
            placeLatLng: 'null'
        }
        const postDetails = {
            id ,
            content: this.state.content , 
            enableComment: true ,
            tags: [] ,
            location: place ,
            postPostOfUserId: this.props.user.userProfile.id ,
            type: 'Post' ,
            radeemQuota: 0,
            createdAt,
        };
        // this.props.requestStarted();
        this.props.onAddPost(postDetails);
        this.props.greetingPost();
        if(this.props.callback) {
            this.props.callback();
        }
    }

    render() {
        return <GreetingScreen {...this.props} state={this.state} onCreate={this.createPost} onStateChange={onStateChange.bind(this)} />;
    }
}



const mapStateToProps = (state) => ({
    user: state.user ,
    request : state.request,
    notification: state.notification
})

const mapDispatchToProps = (dispatch) => ({
    greetingPost: () => dispatch(greetingPost())
})

const withConnect = connect(mapStateToProps , mapDispatchToProps)(GreetingContainer);

// export default createPostWithConnect;


const withCreatePost = graphql(gql(createPost) , {
    props: props => ({
        onAddPost: post => {
            props.mutate({
                variables: { input : post}
            })
            .then((result)=>{
                toastRefService.get().show('Create post success.')
            })
            .catch((error)=>{
                console.log(error);
                toastRefService.get().show('Something went wrong.')
            })
        }
    })
})(withConnect);

export default withCreatePost;