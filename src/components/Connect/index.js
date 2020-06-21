import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'

import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    Button ,
    TouchableOpacity as TouchEx,
    Text,
    Caption
} from '@shoutem/ui';
import { navigatorBarStyle  , navTitle} from '../styles';
import { FontAwesomeIcon } from '../Icon'; 
import { KeyboardAvoidingView , Platform } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import RBSheet from "react-native-raw-bottom-sheet";
import WithPreventDoubleClick from '../WithPreventDoubleClick';
import alertService from '../../services/AlertService';
const TouchableOpacity = WithPreventDoubleClick(TouchEx);
const ChatView = Platform.select({
    android: KeyboardAvoidingView,
    ios: View
})

let setSheetRef = null;
let setSheetRef2= null;


const ConnectScreen = ({navigation , state , onSend , userProfile , onPickImage , _onRemoveMessage}) => (
    <ChatView
    style={{ flex: 1 , backgroundColor: 'white' }}
    behavior={"padding"}
    keyboardVerticalOffset={1}>
        <Spinner 
            visible={state.loading}
        />
        <Screen>
            <NavigationBar 
                hasHistory={true}
                leftComponent={
                    <Button styleName="clear" onPress={()=>{
                        let onCallback = navigation.getParam('onCallback' , null);
                        if(onCallback) {
                            onCallback();
                        }
                        console.log(navigation)
                        navigation.popToTop();
                    }}>
                        <FontAwesomeIcon  name="angle-left" style={{color:'#fff'}} />
                    </Button>
                }
                centerComponent={
                    <Title style={Object.assign({} , navTitle , {color:'#fff'})} numberOfLines={1}>
                        Connect
                    </Title>
                }
                style={navigatorBarStyle}
                styleName="inline"
            />
            <GiftedChat 
                messages={state.messages}
                onSend={onSend}
                user={{
                    _id: userProfile.id
                }}
                renderActions={()=>(
                    <Button style={{alignSelf: 'center'}} onPress={()=>{
                        if(onPickImage) {
                            onPickImage();
                        }
                    }}>
                        <FontAwesomeIcon name="picture-o" />
                    </Button>
                )}
                onLongPress={(context , message)=>{
                    console.log(message);
                    if(message.user._id !== userProfile.id) {
                        setSheetRef.open();
                    } else {
                        setSheetRef2.open();
                        state.deleteMessageId = message.messageId;
                    }
                    
                }}
            />
            <RBSheet
                ref={(ref)=>setSheetRef = ref}
                height={150}
                duration={250}
            >
                <TouchableOpacity
                    onPress={()=>{
                        alertService.alert({
                            content: 'Do you wannt to report this user?' ,
                            buttons: [
                                {
                                    text: 'ok',
                                    onPress: () => {
                                        setSheetRef.close();
                                         setTimeout(()=>alertService.alert({content:'Report this user success.'}), 1000);
                                    } 
                                },
                                {
                                    text: 'cancel',
                                    onPress: () => {
                                        setSheetRef2.close();
                                        state.deleteMessageId = '';
                                    }
                                }
                            ]
                        })
                        
                        
                    }}
                >
                    <View styleName="horizontal" style={{padding: 10}}>
                        <View styleName="horizontal v-start" style={{padding: 5}}>
                            <FontAwesomeIcon style={{fontSize: 20 ,color: '#C43835'}} name="edit" />
                            <View styleName="vertical" style={{marginLeft: 5}}>
                                <Text style={{fontSize: 20}}>Report</Text>
                                <Caption>
                                   Report this user
                                </Caption>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </RBSheet>
            <RBSheet
                ref={(ref)=>setSheetRef2 = ref}
                height={150}
                duration={250}
            >
                <TouchableOpacity
                    onPress={()=>{
                        // this.props.navigation.push('EditPost' , { post: this.props.post })
                        
                        alertService.alert({
                            content: 'Do you wannt to remove this message?' ,
                            buttons: [
                                {
                                    text: 'ok',
                                    onPress: () => {
                                        setSheetRef2.close();
                                        _onRemoveMessage();
                                    } 
                                },
                                {
                                    text: 'cancel',
                                    onPress: () => {
                                        setSheetRef2.close();
                                        state.deleteMessageId = '';
                                    }
                                }
                            ]
                        })
                    }}
                >
                    <View styleName="horizontal" style={{padding: 10}}>
                        <View styleName="horizontal v-start" style={{padding: 5}}>
                            <FontAwesomeIcon style={{fontSize: 20 ,color: '#C43835'}} name="edit" />
                            <View styleName="vertical" style={{marginLeft: 5}}>
                                <Text style={{fontSize: 20}}>Delete</Text>
                                <Caption>
                                   Delete your message  
                                </Caption>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </RBSheet>
        </Screen>
    </ChatView>
)

export default ConnectScreen;