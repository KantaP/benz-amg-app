import React from 'react';

import {
    Screen ,
    NavigationBar ,
    View ,
    Title ,
    ListView,
    TextInput ,
    Button,
    Caption ,
    ImageBackground ,
    Tile ,
    Overlay ,
    Text,
    Touchable,
} from '@shoutem/ui';

import { navigatorBarStyle , formButtonStyle , formButtonDisableStyle , navTitle } from '../styles';
import { FontAwesomeIcon } from '../Icon';
import { ScrollView , TouchableOpacity , KeyboardAvoidingView , TouchableWithoutFeedback  , Dimensions} from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import AutoExpandingTextInput from '../AutoExpandingTextInput';
let facebook = <FontAwesomeIcon name={'facebook'} style={{color:'#fff' , fontSize: 32}} />
let twitter = <FontAwesomeIcon  name={'twitter'} style={{color:'#fff' , fontSize: 32}} />

const styles = {
    formGroup : {height: 50 , borderTopWidth: 1 , borderTopColor: '#ccc' , paddingTop: 10 , marginBottom: 15}
}

const ContactScreen = ({navigation , onStateChange , actions  , state , setSheetRef , setFeedbackSheetRef , openFacebook , openTwitter , onSubmit}) => (
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
                <Title style={Object.assign({} , navTitle , {color:'#fff'})}>
                    Contact
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <ScrollView>
            {/* <View styleName="horizontal v-center h-center" style={{padding: 10}}>
                <Title>
                    My Privilege
                </Title>
            </View>
            <View styleName="horizontal v-center h-center wrap" style={{padding: 5}}>
                <Caption>
                Unless otherwise stipulated, all brand names featured Websites are legally protected trademarks ...
                </Caption>
            </View> */}
            <View styleName="vertical" style={{paddingHorizontal: 10}}>
                <Touchable onPress={()=>{
                    actions('callcenter');
                }}>
                    <View style={{paddingVertical: 10 , flex: 1 , paddingHorizontal: 20}}>
                        <ImageBackground
                            style={{width: null , height: 150}}
                            // styleName="medium-portrait"
                            source={require('../../assets/images/contact-callcenter.jpg')}
                        >
                            <Tile>
                                <Overlay styleName="fill-parent image-overlay">
                                    <Title styleName="sm-gutter-bottom">Call Center</Title>
                                </Overlay>
                            </Tile>
                        </ImageBackground>
                    </View>
                </Touchable>
                <View styleName="horizontal space-between v-center" style={{paddingVertical: 10 , flex: 1 , paddingHorizontal: 20}}>
                    <Touchable onPress={()=>{
                        actions('address');
                    }}>
                       
                            <ImageBackground
                                style={{width: 150 , height: 150}}
                                // styleName="medium-square"
                                source={require('../../assets/images/contact-address.jpg')}
                            >
                                <Tile>
                                    <Overlay styleName="fill-parent image-overlay">
                                        <Title styleName="sm-gutter-bottom">Address</Title>
                                    </Overlay>
                                </Tile> 
                            </ImageBackground>
                        
                    </Touchable>
                    <Touchable onPress={()=>{
                        actions('social');
                    }}>
                        
                            <ImageBackground
                                style={{width: 150 , height: 150 }}
                                // styleName="medium-square"
                                source={require('../../assets/images/contact-social.jpg')}
                            >
                                <Tile>
                                    <Overlay styleName="fill-parent image-overlay">
                                        <Title styleName="sm-gutter-bottom">Social Media</Title>
                                    </Overlay>
                                </Tile>
                            </ImageBackground>
                        
                    </Touchable>
                </View>
                <Touchable onPress={()=>{
                    actions('feedback');
                }}>
                    <View style={{paddingVertical: 10 , flex: 1 , paddingHorizontal: 20}}>
                        <ImageBackground
                            style={{width:null , height: 150}}
                            // styleName="medium-portrait"
                            source={require('../../assets/images/contact-feedback.jpg')}
                        >
                            <Tile>
                                <Overlay styleName="fill-parent image-overlay">
                                    <Title styleName="sm-gutter-bottom">Feedback & Enquiry</Title>
                                </Overlay>
                            </Tile>
                        </ImageBackground>
                    </View>
                </Touchable>
            </View>
            <RBSheet
                ref={setFeedbackSheetRef}
                height={600}
                duration={250}
                closeOnDragDown={false}
                >
                    <KeyboardAvoidingView
                        style={{ flex: 1, backgroundColor: 'white' }}
                        behavior={"padding"}
                        keyboardVerticalOffset={0}>
                        <Screen style={{backgroundColor:'#fff'}}>
                            <ScrollView>
                                <View>
                                    <TextInput placeholder="* Topic" onChangeText={(text)=>{
                                        if(onStateChange) onStateChange('feedbackTopic' , text);
                                    }}  />
                                </View>
                                <View>
                                    <AutoExpandingTextInput
                                        
                                        placeholder="* Message"
                                        onChangeText={(text)=>{
                                            if(onStateChange) onStateChange('feedbackMessage' , text);
                                        }}
                                    />
                                </View>
                                <View styleName="horizontal h-center" style={{padding: 10}}>
                                    <Button style={(state.feedbackTopic.trim() && state.feedbackMessage.trim()) ? formButtonStyle : {...formButtonStyle , ...formButtonDisableStyle}} 
                                        onPress={()=>{
                                            if(onSubmit) {
                                                onSubmit()
                                            }
                                        }}>
                                            <Text style={{color:'#fff' , fontWeight: 'bold'}}>SEND</Text>
                                    </Button>
                                </View>
                            </ScrollView>
                        </Screen>
                    </KeyboardAvoidingView>
            </RBSheet>
            <RBSheet
                ref={setSheetRef}
                height={130}
                duration={250}
                // customStyles={{
                //     container: {
                //         paddingLeft: 15 ,
                //         paddingRight: 15,
                //         alignItems: "center"
                //     }
                // }}
                >
                    <View styleName="horizontal h-center" style={{padding: 10}}>
                        <Title>Social Media</Title>
                    </View>
                    <View styleName="horizontal v-center h-center" style={{padding: 10}}>
                        <Button 
                            style={{width: 64, height: 64 , borderRadius: 32 , backgroundColor: '#3C5A99'}}
                            onPress={openFacebook}
                        >
                            {facebook}
                        </Button>
                        <Button 
                            style={{marginLeft:10 , width: 64, height: 64 , borderRadius: 32 , backgroundColor: '#1DA1F2'}}
                            onPress={openTwitter}
                        >
                            {twitter}
                        </Button>
                    </View>
            </RBSheet>
        </ScrollView>
    </Screen>
)

export default ContactScreen;