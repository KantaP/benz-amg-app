import React from 'react';
import { withNavigation } from 'react-navigation';
import {
    Screen ,
    NavigationBar ,
    View ,
    Button ,
    Title ,
    Image ,
    Text ,
    TextInput ,
    Switch ,
    Caption ,
    ListView ,
    ImageBackground ,
    Divider
} from '@shoutem/ui';

import { FontAwesomeIcon , EntypoIcon , FeatherIcon} from '../Icon';
import { navigatorBarStyle , iconStyle , formButtonStyle , switchStyle , formButtonDisableStyle } from '../styles';
import AutoExpandingTextInput from '../AutoExpandingTextInput';
import { TouchableOpacity , KeyboardAvoidingView  } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
const styles = {
    iconInSymbol : {fontSize: 14 , color:'#fff'} ,
    symbolIcon: {backgroundColor:'#C43835' , width: 32, height: 32 , borderRadius: 16} ,
    formGroup : {height: 50 , borderTopWidth: 1 , borderTopColor: '#ccc' , paddingTop: 10 , marginBottom: 15}
}

const CreatePostScreen = ({navigation , onStateChange , state , onAddTag , onPickImage , onSubmit , loading , onRemoveImage , onUpdate , notification}) => (
    <KeyboardAvoidingView
				style={{ flex: 1, backgroundColor: 'white' }}
				behavior={"padding"}
                keyboardVerticalOffset={0}>
    <Screen style={{backgroundColor: '#fff'}}>
        <NavigationBar 
            style={navigatorBarStyle}
            styleName="inline"
            leftComponent={
                (state.edit) 
                ?(
                    <Button styleName="clear" onPress={()=>{
                        navigation.goBack();
                    }}>
                        <FontAwesomeIcon  name="angle-left" style={{color:'#fff'}} />
                    </Button>
                )
                : null
                
            }
            centerComponent={
                (state.edit) 
                ? (
                    <Title style={{color:'#fff'}} numOfLines={1}>
                        Edit post
                    </Title>
                )
                : (
                    <View>
                     <Image resizeMode="contain" styleName="medium" source={require('../../assets/images/logo.png')}/>
                    </View>
                )
                
            }
            rightComponent={
                (!state.edit)
                 ? (
                    <View styleName="horizontal h-center v-center">
                        <Button
                            styleName="clear"
                            onPress={()=>{ 
                                navigation.push('Contact');
                            }}
                        >
                            <FeatherIcon name="phone-call" style={iconStyle} />
                        </Button>
                        <Button
                            styleName="clear"
                            onPress={()=>{
                                navigation.push('ChatHistories');
                            }}
                        >
                            {
                                notification.hasNotificationChat &&
                                (
                                    <View style={{
                                        position:'absolute',
                                        bottom: -2,
                                        right: 10,
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'red' 
                                    }}></View>
                                )
                            }
                            <FontAwesomeIcon name="comments" style={iconStyle} />
                        </Button>
                    </View>
                 )
                 : null                
            }
        />
        <ScrollView>
        <View styleName="vertical" style={{padding :20}}>
            <View styleName="horizontal v-center" style={{height: 50}}>
                {
                    (state.edit)
                    ? (<Text style={{fontWeight: 'bold'}}>Edit Post</Text>)
                    : (<Text style={{fontWeight: 'bold'}}>Create Post</Text>)
                }
                
            </View>
            <View styleName="horizontal v-center" style={{borderTopWidth: 1 , borderTopColor: '#ccc' , paddingTop: 10}}>
                <AutoExpandingTextInput
                    style={{paddingLeft: 0, width: '100%'}}
                    placeholder="* Description"
                    onChangeText={(text)=>{
                        if(onStateChange) onStateChange('content' , text);
                    }}
                    value={state.content}
                />
            </View>
            <View styleName="horizontal v-center space-between" style={styles.formGroup}>
                <Text>Location</Text>
                {
                    state.place.placeName 
                    ? <View styleName="horizontal v-center" style={{flex: 0.7}}><Text style={{flex: 1}} numberOfLines={1}>{state.place.placeName}</Text></View>
                    : null
                }
                <TouchableOpacity onPress={()=>{
                    navigation.push('MapView' , {onSelected: (place)=> {
                        if(onStateChange) {
                            // onStateChange('locationName' , locationName);
                            onStateChange('place' , place);
                            
                        }
                    }});
                }}>
                    <View styleName="horizontal v-center h-center" style={styles.symbolIcon}>
                        <EntypoIcon name="location-pin" style={styles.iconInSymbol} />
                    </View>
                </TouchableOpacity>
            </View>
            <View styleName="horizontal v-center space-between" style={styles.formGroup}>
                <Text>Tags</Text>
                <View styleName="horizontal v-center h-center wrap" style={{flex: 1 }}>
                    {
                        (state.tags) &&
                        state.tags.map((tag)=>(
                            <View 
                            styleName="horizontal v-center space-between" 
                            style={{marginLeft:5 , backgroundColor:'#ccc', padding: 8 , borderRadius: 10}}>
                                <Text 
                                style={{color:'#fff'}}>
                                    {tag}
                                </Text>
                                <View 
                                styleName="horizontal v-center h-center" 
                                style={{marginLeft: 3 , width: 16 , height: 16 , borderRadius: 8 , backgroundColor: '#fff'}}>
                                    <FontAwesomeIcon name="close" style={{color: '#ccc' , fontSize: 12}} />
                                </View>
                            </View>
                        ))
                    }
                </View>
                <TouchableOpacity onPress={()=>{
                    navigation.push('TagSearch' , {
                        onAddTag: (tag)=> {
                        if(onAddTag) {
                            // onStateChange('locationName' , locationName);
                            onAddTag(tag);
                            
                        }
                    }});
                }}>
                    <View styleName="horizontal v-center h-center" style={styles.symbolIcon}>
                        <EntypoIcon name="plus" style={styles.iconInSymbol} />
                    </View>
                </TouchableOpacity>
            </View>
            {
                (!state.edit) && 
                (
                    <View styleName="horizontal v-center space-between" style={styles.formGroup}>
                        <Text>Upload (Photo)</Text>
                        <TouchableOpacity onPress={()=>{
                            if(onPickImage) {
                                onPickImage();
                            }
                        }}>
                            <View styleName="horizontal v-center h-center" style={styles.symbolIcon}>
                                <FontAwesomeIcon name="paperclip" style={styles.iconInSymbol} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
            {
                (state.photos.length > 0) &&
                <View styleName="horizontal v-center" style={{flex: 1 , paddingTop: 10 , paddingBottom: 10}}>
                    {
                        state.photos.map((photo , key)=>(
                            <TouchableOpacity onPress={()=>{
                                if(onRemoveImage) onRemoveImage(key)
                            }}>
                            <View key={key} styleName="vertical v-center h-center" style={{marginRight: 5}}>
                                <ImageBackground
                                    styleName="small"
                                    source={{ uri: photo }}                    
                                >
                                    <View style={{position:'absolute', top: 0 , left: 0}}>
                                        
                                            <View 
                                                styleName="horizontal v-center h-center" 
                                                style={{width: 16 , height: 16 , borderRadius: 8 , backgroundColor: '#C43835'}}>
                                                    <FontAwesomeIcon name="close" style={{color: '#fff' , fontSize: 14}} />
                                            </View>
                                        
                                    </View>
                                </ImageBackground>
                                <Divider styleName="line" />
                            </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            }
            <View styleName="horizontal v-center space-between" style={styles.formGroup}>
                <Text>Comment Feature</Text>
                <Switch
                    onValueChange={value => {
                        onStateChange('commentFeature' , value);
                    }}
                    style={switchStyle}
                    value={state.commentFeature}
                />
            </View>
            <View styleName="horizontal v-center space-between" style={styles.formGroup}>
                <Caption>* Required Field</Caption>
            </View>
            {
                (state.edit)
                ? (
                    <View styleName="horizontal v-center h-center" >
                        <Button style={(state.content.trim()) ? formButtonStyle : {...formButtonStyle , ...formButtonDisableStyle}} 
                        onPress={()=>{
                            if(onUpdate && state.content.trim()){
                                onUpdate()
                            } 
                        }}>
                            <Text style={{color:'#fff' , fontWeight: 'bold'}}>Edit</Text>
                        </Button>
                    </View>
                )
                : (
                    <View styleName="horizontal v-center h-center" >
                        <Button style={(state.content.trim()) ? formButtonStyle : {...formButtonStyle , ...formButtonDisableStyle}} 
                        onPress={()=>{
                            if(onSubmit && state.content.trim()) {
                                onSubmit()
                            }
                        }}>
                            <Text style={{color:'#fff' , fontWeight: 'bold'}}>CREATE</Text>
                        </Button>
                    </View>
                )
            }
            
            {/* <View style={{marginTop: 30}}>
            
            </View> */}
        </View>
        </ScrollView>
    </Screen>
    </KeyboardAvoidingView>
)

export default withNavigation(CreatePostScreen);

