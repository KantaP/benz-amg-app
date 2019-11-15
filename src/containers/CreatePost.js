import React from 'react';
import PropTypes from 'prop-types';
import CreatePostScreen from '../components/CreatePost';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { createPost , createPostImage , updatePost } from '../graphql/mutations';
import { listPosts } from '../graphql/queries';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import uuidV4 from 'uuid/v4';
import moment from 'moment';
import config from '../aws-exports';
import { Auth , Storage } from 'aws-amplify'
import { requestStarted , requestFinished } from '../actions/request';
import gql from 'graphql-tag';
import toastRefService from '../services/ToastRefService';
import { Platform } from 'react-native'; 
class CreatePostContainer extends React.Component {
    static navigationOptions = { header: null };
    state = {
        content: '' ,
        commentFeature: true ,
        location: {
            placeName: '' ,
            placeLatLng: ''
        } ,
        tags: [] ,
        photos: [] ,
        formChange: false ,
        identity: {},
        edit: false,
        id: "",
        loading: false
    }
    willBlurSubscription = null;
    componentDidMount() {
        Auth.currentAuthenticatedUser()
        .then(user => {
            this.setState({ identity: user.signInUserSession.accessToken.payload })
        })
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
            //   console.debug('willBlur', payload);
              if(payload.action.type === 'Navigation/NAVIGATE') {
                if(this.state.formChange) {
                    // alert('Do you want to leave this post?');
                    this.setState({
                        content: '' ,
                        commentFeature: true ,
                        location: {
                            placeName: '',
                            placeLatLng: ''
                        } ,
                        tags: [] ,
                        photos: [] ,
                        formChange: false
                    })
                }
              }
              
            }
        );
        let post = this.props.navigation.getParam('post' , undefined);
        // console.log('edit ,post' , post);
        if(post) {
            this.setState((state)=>{
                state = Object.assign({} , state , post);
                state['edit'] = true;
                return state;
            }, ()=> {
                console.log(this.state);
            })
        }
    }
    customAddTag = (text) => {
        if(!this.state.formChange) this.setState({formChange: true});
        this.setState(state=>{
            state['tags'].push(text);
            return state;
        })
    }

    customOnChange = (key , value) => {
        // console.log('custom on change' , key , value);
        if(!this.state.formChange) this.setState({formChange: true});
        this.setState(state=>{
            state[key] = value;
            return state;
        })
    }

    componentWillUnmount() {
        this.willBlurSubscription.remove();
    }
    

    pickImage = async() => {

        if(this.state.photos.length === 5) {
            alert('Maximum upload image is 5.')
            return false;
        }

        if (Platform.OS === 'ios') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
              return false;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            if(!this.state.formChange) this.setState({formChange: true});
            this.setState(state=>{
                state['photos'].push(result.uri);
                // console.log(state);
                return state;
            });
        }
    }  

    removeImage = (removeIndex) => {
        this.setState(state=>{
            state['photos'] = state['photos'].filter((item, index)=> index !== removeIndex);
            return state;
        });
    }

    async blobUploadImage(id , fileUri) {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", fileUri, true);
            xhr.send(null);
        });
        const { name, type } = blob._data;
        const options = {
            ACL: 'public-read',
            level: "public",
            contentType: type
        };
        try {
            let result = await Storage.put(name , blob , options);
            console.log('add image');
            this.props.onAddPostImage({
                postImagePostImageId: id,
                uri: `https://${config.aws_user_files_s3_bucket}.s3-${config.aws_user_files_s3_bucket_region}.amazonaws.com/public/${result.key}`
            })
            return true;
        } catch(error) {
            return false;
        }
    }

    async uploadImage(id) {
        for(let photo of this.state.photos) {
            await this.blobUploadImage(id , photo);
        }
        return true;
    }

    render() {

        return (
            <CreatePostScreen
                {...this.props}
                state={this.state} 
                onStateChange={this.customOnChange}
                onAddTag={this.customAddTag}
                onPickImage={this.pickImage}
                onRemoveImage={this.removeImage}
                loading={this.props.request.loading}
                onSubmit={async()=>{
                    // console.log(this.state.identity)
                    await this.setState({loading: true});
                    const id = uuidV4();
                    const createdAt = moment().format();
                    let place = (!this.state.location.placeName)
                                ? {
                                    placeName:  'null' ,
                                    placeLatLng: 'null'
                                } : this.state.location
                    const postDetails = {
                        id ,
                        content: this.state.content , 
                        enableComment: this.state.commentFeature ,
                        tags: this.state.tags ,
                        location: place ,
                        postPostOfUserId: this.props.user.userProfile.id ,
                        type: 'post' ,
                        radeemQuota: 0,
                        createdAt,
                        pin:'off'
                    };
                    // console.log(postDetails);
                    // this.props.requestStarted();
                    this.props.onAddPost(postDetails);
                    // createPost({variables: {input: postDetails}});
                    if(this.state.photos.length) {
                        await this.uploadImage(id);
                    }
                    this.setState({
                        content: '' ,
                        commentFeature: true ,
                        place: {
                            placeName: '',
                            placeLatLng: ''
                        } ,
                        tags: [] ,
                        photos: [] ,
                        formChange: false
                    }); 
                    setTimeout( ()=> {
                        this.setState({loading: false} , () => {
                            this.props.navigation.navigate('Home') 
                        });
                        
                    }, 500 );
                }}
                onUpdate={async()=>{
                    await this.setState({loading: true});
                    // console.log(this.state.identity)
                    const id = this.state.id
                    let place = (!this.state.location.placeName)
                                ? {
                                    placeName:  'null' ,
                                    placeLatLng: 'null'
                                } : this.state.location
                    const postDetails = {
                        id ,
                        content: this.state.content , 
                        enableComment: this.state.commentFeature ,
                        tags: this.state.tags ,
                        location: place ,
                        postPostOfUserId: this.props.user.userProfile.id ,
                        type: 'post' ,
                        radeemQuota: 0,
                    };
                    // console.log('edit post detail' , postDetails);
                    // this.props.requestStarted();
                    this.props.updatePost(postDetails);
                    this.setState({
                        content: '' ,
                        commentFeature: true ,
                        place: {
                            placeName: '',
                            placeLatLng: ''
                        } ,
                        tags: [] ,
                        photos: [] ,
                        formChange: false
                    }); 
                    setTimeout( ()=> {
                        this.setState({loading: false} , () => {
                            this.props.navigation.navigate('Home') 
                        });
                        
                    }, 500 );
                }}
            />
           
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user ,
    request : state.request,
    notification: state.notification
})

const mapDispatchToProps = (dispatch) => ({
    requestStarted: () => dispatch(requestStarted()),
    requestFinished: () => dispatch(requestFinished())
})

const withConnect = connect(mapStateToProps , mapDispatchToProps)(CreatePostContainer);

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

const withCreatePostImage = graphql(gql(createPostImage) , {
    props: props => ({
        onAddPostImage: postImage => {
            props.mutate({
                variables: { input: postImage }
            })
            
        }
    })
})(withCreatePost);

const withUpdatePost = graphql(gql(updatePost) , {
    props: props => ({
        updatePost: updateItem => {
            props.mutate({
                variables: { input : updateItem }
            })
            .then((result)=>{
                toastRefService.get().show('Edit post success.')
            })
            .catch((error)=>{
                console.log(error);
                toastRefService.get().show('Something went wrong.')
            })
        }
    })
})(withCreatePostImage)

export default withUpdatePost

CreatePostContainer.propTypes = {
    onAddPost : PropTypes.func.isRequired ,
    onAddPostImage: PropTypes.func.isRequired
}