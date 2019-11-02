import React from 'react';
import ConnectScreen from '../components/Connect';
import { connect } from 'react-redux';
import sendbirdService from '../services/SendBirdService';
import { setChannel } from '../actions/channel';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import pushNotificationSevice from '../services/PushNotificationService';
import uuidv4 from 'uuid/v4';
import { Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import { Storage } from 'aws-amplify';
import config from '../aws-exports';

class ConnectContainer extends React.Component {

    static navigationOptions = {
        header: null,
        // drawerLabel: 'Home',
    };

    state = {
        messages: [],
        messageQuery: [],
        lastMessage: {},
        loading: false,
        channel: null,
    }

    componentDidMount() {
        
        this._createChannel()
        .then(()=>{ 
            this._getChannelMessage(true);
            if (this.state.channel.channelType == 'group') {
                this.state.channel.markAsRead();
            }
            const sb = sendbirdService.get();
            try {
                var ChannelHandler = new sb.ChannelHandler();
                ChannelHandler.onMessageReceived =  (channel, message) => {
                    // console.log('connect page' , channel);
                    let messageObj = {
                        _id: uuidv4(),
                        
                        createdAt: new Date(message.createdAt),
                        user: {
                            _id: message._sender.userId,
                            name: message._sender.nickname,
                            avatar: (message._sender.profileUrl) ? message._sender.profileUrl : require('../assets/images/user-blank.jpg'),
                        },
                    }
                    if(message.data === 'image') {
                        messageObj['image'] = message.message;
                    }else{
                        messageObj['text'] = message.message;
                    }
                    // console.log('message obj' , messageObj);
                    this.setState(previousState => {
                        previousState.messages = [messageObj , ...previousState.messages]
                        return previousState
                    })
                };
                sb.addChannelHandler('ConnectView', ChannelHandler);
            }catch(error) {
                console.log(erorr);
            }
        });
    }

    componentWillUnmount() {
        const sb = sendbirdService.get();
        sb.removeChannelHandler('ConnectView');
    }

    _createChannel = async () => {

        let chatTo = this.props.navigation.getParam('chatTo', "");
        if (!chatTo) {
            this.props.navigation.goBack();
            return;
        }


        let channel = await sendbirdService.createChannel({
            receiverId: [chatTo]
        })

        // console.log('channel' , channel);

        this.state.channel = channel;
        return;
        // this.props.setChannel(channel);
    }

    _getChannelMessage = async (refresh) => {
        if (!this.state.channel) return;
        
        if (refresh) {
            let messageQuery = this.state.channel.createPreviousMessageListQuery();
            this.state.messageQuery = messageQuery;
            this.state.messages = [];
        }

        if (!this.state.messageQuery.hasMore) {
            return;
        }
        this.state.messageQuery.load(20, false,  (response, error) => {
            if (error) {
                console.log('Get Message List Fail.', error);
                return;
            }

            var _messages = [];
            for (var i = 0; i < response.length; i++) {
                var _curr = response[i];
                console.log('curr' , _curr);
                let messageObj = {
                    _id: uuidv4(),
                    
                    createdAt: new Date(_curr.createdAt),
                    user: {
                        _id: _curr._sender.userId,
                        name: _curr._sender.nickname,
                        avatar: (_curr._sender.profileUrl) ? _curr._sender.profileUrl : require('../assets/images/user-blank.jpg'),
                    },
                }
                if(_curr.data === 'image') {
                    messageObj['image'] = _curr.message;
                }else{
                    messageObj['text'] = _curr.message;
                }
                _messages.push(messageObj);
                this.state.lastMessage = messageObj;
            }

            // console.log('previous messages' , _messages)

            // var _newMessageList = _SELF.state.messages.concat(_messages.reverse());
            this.setState(previousState => {
                previousState.messages = [..._messages.reverse()];
                return previousState
            });
        });
    }


    _onSend = (messages = []) => {


        // if (!this.state.text){
        //   return;
        // }
        let sendText = messages.reverse()[0].text;

        this.state.channel.sendUserMessage(sendText, '',  (message, error) => {
            if (error) {
                console.log(error);
                return;
            }
            // console.log('send message' , message);
            let pushTo = this.props.navigation.getParam('pushTo', "");
            pushNotificationSevice.send({
                to: pushTo,
                title: `${this.props.userProfile.firstName} says`,
                body: sendText ,
            })
        });

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))

    }

    _pickImage = async() => {
        // console.log(Constants.platform.ios)
        if (Platform.OS === 'ios') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
              return false;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            // result.uri
            this.blobUploadImage(result.uri)
        }

    }  

    async blobUploadImage(fileUri) {
        await this.setState({loading: true});
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
        Storage.put(name , blob , options)
        .then (result => {
            let imageUrl = `https://${config.aws_user_files_s3_bucket}.s3-${config.aws_user_files_s3_bucket_region}.amazonaws.com/public/${result.key}`;
            // console.log('image' , imageUrl );
            let messageObj = {
                _id: uuidv4(),
                createdAt: new Date(),
                user: {
                    _id: this.props.userProfile.id,
                    name: this.props.userProfile.firstName + ' ' + this.props.userProfile.lastName,
                    avatar: (this.props.userProfile.image) ? this.props.userProfile.image : require('../assets/images/user-blank.jpg'),
                },
                image: imageUrl
            }
            
            this.state.channel.sendUserMessage(imageUrl , 'image' , (message, error) => {
                if (error) {
                    console.log(error);
                    return;
                }
                let pushTo = this.props.navigation.getParam('pushTo', "");
                pushNotificationSevice.send({
                    to: pushTo,
                    title: `${this.props.userProfile.firstName}`,
                    body: 'Send image to you' ,
                })
                this.setState(previousState => ({
                    loading: false,
                    messages: GiftedChat.append(previousState.messages, [messageObj]),
                }))
            });
            
        })
        .catch(err => {
            console.log(err)
            this.setState({loading: false})
        });
    }

    render() {
        return (<ConnectScreen
            {...this.props}
            onSend={this._onSend}
            state={this.state}
            onPickImage={this._pickImage}
        />)
    }
}

ConnectContainer.propTypes = {
    navigation: PropTypes.any.isRequired,
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile,
})

const mapDispatchToProps = (dispatch) => ({
    setChannel: (channel) => dispatch(setChannel(channel)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectContainer);