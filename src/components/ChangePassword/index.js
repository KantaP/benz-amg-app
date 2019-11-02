import React from 'react';
import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    Button ,
    Text ,
    TextInput
} from '@shoutem/ui';

import { ScrollView , KeyboardAvoidingView } from 'react-native';
import { navigatorBarStyle, formButtonStyle, navTitle } from '../styles';
import { FontAwesomeIcon  } from '../Icon'; 
import Spinner from 'react-native-loading-spinner-overlay';

const ChangePasswordScreen = ({navigation , state , onChangePassword , onStateChange}) => (
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: 'white' }}
    behavior={"padding"}
    keyboardVerticalOffset={0}>
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
                        Change Password
                    </Title>
                }
                style={navigatorBarStyle}
                styleName="inline"
            />
            <Spinner 
                visible={state.loading}
            />
            <ScrollView>
                <View styleName="vertical h-center v-center" style={{marginTop: 20 , paddingLeft: 20, paddingRight: 20}}>
                    <View styleName="horizontal h-center">
                        <TextInput
                            style={{flex: 1}}
                            secureTextEntry
                            placeholder="Current Password"
                            onChangeText={(text)=>{
                                if(onStateChange){
                                    onStateChange('oldPassword' , text);
                                }
                            }}
                        />
                    </View>
                    <View styleName="horizontal h-center" style={{marginTop : 10}}>
                        <TextInput
                            style={{flex: 1}}
                            secureTextEntry
                            placeholder="New Password"
                            onChangeText={(text)=>{
                                if(onStateChange){
                                    onStateChange('newPassword' , text);
                                }
                            }}
                        />
                    </View>
                    <View styleName="horizontal h-center" style={{marginTop : 10}}>
                        <TextInput
                            style={{flex: 1}}
                            secureTextEntry
                            placeholder="Confirm New Password"
                            onChangeText={(text)=>{
                                if(onStateChange){
                                    onStateChange('confirmPassword' , text);
                                }
                            }}
                        />
                    </View>
                    <View styleName="horizontal v-center h-center" style={{marginTop : 20}} >
                        <Button style={formButtonStyle} 
                        onPress={()=>{
                            if(onChangePassword){
                                onChangePassword();
                            }
                        }}>
                            <Text style={{color:'#fff' , fontWeight: 'bold'}}>SUBMIT</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    </KeyboardAvoidingView>
)


export default ChangePasswordScreen;
