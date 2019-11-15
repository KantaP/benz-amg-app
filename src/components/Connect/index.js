import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'

import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    Button ,
} from '@shoutem/ui';
import { navigatorBarStyle  , navTitle} from '../styles';
import { FontAwesomeIcon } from '../Icon'; 
import { KeyboardAvoidingView , Platform } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const ChatView = Platform.select({
    android: KeyboardAvoidingView,
    ios: View
})

const ConnectScreen = ({navigation , state , onSend , userProfile , onPickImage}) => (
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
            />
        </Screen>
    </ChatView>
)

export default ConnectScreen;