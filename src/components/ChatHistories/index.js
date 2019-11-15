import React from 'react';


import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    Button as BT ,
    Text,
    Caption,
    Image,
    TouchableOpacity as TouchEx
} from '@shoutem/ui';
import { navigatorBarStyle , navTitle , redColor } from '../styles';
import { FontAwesomeIcon } from '../Icon'; 
import { FlatList } from 'react-native';
import { Query } from 'react-apollo';
import { getUser } from '../../graphql/queries';

import moment from 'moment';
import Swipeable from 'react-native-swipeable';
import gql from 'graphql-tag';
import alertService from '../../services/AlertService';
import WithPreventDoubleClick from '../WithPreventDoubleClick';

const Button = WithPreventDoubleClick(BT);
const TouchableOpacity = WithPreventDoubleClick(TouchEx);

const ChatHistoriesScreen = ({navigation , userProfile , state , onCallback , onGetChannel}) => (
    <Screen>
        <NavigationBar
            hasHistory={true}
            leftComponent={
                <Button styleName="clear" onPress={()=>{
                    navigation.goBack();
                }}>
                    <FontAwesomeIcon  name="angle-left" style={{color:'#fff'}} />
                </Button>
            }
            centerComponent={
                <Title style={Object.assign({} , navTitle , {color:'#fff'})} numberOfLines={1}>
                    Chat
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        {
            state.channelList.length === 0 &&
            (
                <View styleName="vertical v-center h-center" style={{flex: 1}}>
                    <Title style={{color:'#ccc' , fontWeight:'bold'}}>No Chat History</Title>
                    <Caption style={{color:'#ccc'}}>This page will show data after you have chat history</Caption>
                </View>
            )
        }
        {
            state.channelList.length > 0 &&
            <FlatList
                removeClippedSubViews
                data={state.channelList}
                keyExtractor={(item, index)=>index}
                renderItem={({item}) => {
                    return (
                        <ChatItem 
                            channelItem={item} 
                            userProfile={userProfile} 
                            navigation={navigation} 
                            onCallback={onCallback}
                            onGetChannel={onGetChannel}
                        />
                    )
                }}
                initialNumToRender={8}
                maxToRenderPerBatch={2}
                // onEndReachedThreshold={0.5}
                // onEndReached={()=>{
                //     // this.props.loadMore();
                // }}
                // refreshing={this.props.refreshing}
                // onRefresh={()=>{ 
                //     // this.props.refetch();
                // }}
            />
        }
        
    </Screen>
)

class ChatItem extends React.PureComponent {

    render() {
        let opponent = this.props.channelItem.members.filter((item)=>item.userId !== this.props.userProfile.id)[0];
        let lastMessage = this.props.channelItem.lastMessage;
        const rightButtons = [
            <TouchableOpacity onPress={()=>{
                alertService.alert({
                    title:'Delete Chat?',
                    content: 'Are you sure to delete chat?',
                    buttons: [
                        {
                            text: 'OK', 
                            onPress: () => {
                                this.props.channelItem.hide(true);
                                this.props.onGetChannel();
                            }
                        },
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                    ]
                })
            }}>
                <View styleName="horizontal v-center h-center" style={{backgroundColor: redColor , width: 75 , height: '100%'}}>
                    <Text style={{color: '#fff'}}>Delete</Text>
                </View>
            </TouchableOpacity>
        ];
        if(!opponent) {
            // console.log(this.props.channelItem.members)
            return null
        }
        return (
            <Query query={gql(getUser)} variables={{id: opponent.userId}}>
                {
                    ({data , loading , error}) =>{
                        if(loading) return false;

                        return (
                            <Swipeable rightButtons={rightButtons}>
                                <TouchableOpacity onPress={()=>{
                                    this.props.navigation.push('Connect' , {
                                        chatTo: opponent.userId , 
                                        pushTo: data.getUser.pushToken ,
                                        onCallback: this.props.onCallback
                                    })
                                }}>
                                    <View 
                                    styleName="horizontal v-start space-between" 
                                    style={{padding: 10 , backgroundColor:'#fff' , borderBottomWidth: 1 , borderBottomColor: '#ccc'}}
                                    >
                                        <View styleName="horizontal v-start" style={{padding: 5}} >
                                            <Image
                                                style={{width: 50 , height: 50 , borderRadius: 25 , borderColor:'#ccc' , borderWidth: 1}}
                                                source={
                                                    (opponent.profileUrl)
                                                    ? { uri : opponent.profileUrl }
                                                    : require('../../assets/images/user-blank.jpg') 
                                                }
                                            />
                                            <View styleName="vertical v-start" style={{marginLeft: 10}}>
                                                <Text>{opponent.nickname}</Text>
                                                {
                                                    lastMessage &&
                                                    (
                                                    <Caption numberOfLines={1}>{
                                                        (lastMessage.data === 'image')
                                                        ? `Send image`
                                                        : lastMessage.message
                                                    }</Caption>
                                                    )
                                                }
                                            </View>
                                        </View>
                                        {
                                            lastMessage &&
                                            (
                                                <View styleName="horizontal v-start" style={{padding: 5}} >
                                                    <Caption>{moment(lastMessage.createdAt).fromNow()}</Caption>
                                                </View>
                                            )
                                        }
                                        
                                    </View>
                                </TouchableOpacity>
                            </Swipeable>
                        )
                    }
                }
            </Query>
            
        )
    }
}

export default ChatHistoriesScreen;