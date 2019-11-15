import React from 'react';
import { connect } from 'react-redux';
import { setUserProfile } from '../actions/user';
import { greetingPost } from '../actions/firstTime';
import { createPost , updateUser } from '../graphql/mutations';
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
            type: 'post' ,
            radeemQuota: 0,
            createdAt,
            pin:'off'
        };
        // this.props.requestStarted();
        this.props.onAddPost(postDetails);
        let userBody = {
            id: this.props.user.userProfile.id ,
            firstLogin: true
        }
        this.props.updateUser(userBody)
        .then((userProfile)=>{
            this.props.setUserProfile({
                ...this.props.user.userProfile ,
                firstLogin: true
            })
        });
        
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
    greetingPost: () => dispatch(greetingPost()),
    setUserProfile: (profile) => dispatch(setUserProfile(profile))
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

const withUpdateUser = graphql(gql(updateUser) , {
    props: props => ({
        updateUser: updateItem => {
            // console.log('upadte item' , updateItem);
            return props.mutate({
                variables: { input : updateItem }
            })
            
        }
    })
})(withCreatePost)

export default withUpdateUser;