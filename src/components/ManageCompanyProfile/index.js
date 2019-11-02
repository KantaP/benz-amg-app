import React from 'react';
import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    Button ,
    Text ,
    Image,
    TextInput
    
} from '@shoutem/ui';

import { ScrollView , KeyboardAvoidingView , TouchableOpacity } from 'react-native';
import { navigatorBarStyle, formButtonStyle , navTitle } from '../styles';
import { FontAwesomeIcon  } from '../Icon'; 
import AutoExpandingTextInput from '../AutoExpandingTextInput';

import Spinner from 'react-native-loading-spinner-overlay';

const ManageCompanyProfileScreen = (
    {
        navigation , 
        onImagePicker,
        companyProfile,
        onStateChange,
        onUpdateCompany,
        onLogoPicker,
        state
    }
) => (
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
                        Company Profile
                    </Title>
                }
                style={navigatorBarStyle}
                styleName="inline"
            />
            <Spinner 
                visible={state.loading}
            />
            <ScrollView>
                <View styleName="horizontal h-center" style={{marginTop: 20}}>
                    <View 
                        styleName="horizontal h-center" 
                        style={{
                            flex: 0.75
                        }}
                    >
                            {/* <FontAwesomeIcon name="lock"  /> */}
                        <TouchableOpacity onPress={()=>{
                            if(onLogoPicker) {
                                onLogoPicker();
                            }
                        }}>
                            <View 
                                styleName="vertical v-center h-center"
                                style={{
                                    width:100 , 
                                    height: 100 , 
                                    borderRadius:50,
                                    borderWidth: 0.5,
                                    borderColor:'#bbb',
                                    backgroundColor:'#ccc'
                                }}
                            >
                                <Image
                                    style={{width:90 , height: 90 , borderRadius:45}}
                                    source={
                                        (companyProfile.logo) 
                                        ? {uri : companyProfile.logo}
                                        : require('../../assets/images/no-image.png')
                                    }
                                />
                                <View style={{
                                    position:'absolute',
                                    bottom:0,
                                    right:5,
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#fff',
                                    backgroundColor:'#999',
                                    display:'flex',
                                    justifyContent:'center'
                                }}>
                                    <FontAwesomeIcon name="picture-o" style={{color: '#fff' , fontSize: 12}} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{
                    if(onImagePicker){
                        onImagePicker();
                    }
                }}>
                    <View styleName="horizontal h-center" style={{marginTop: 10}}>
                        <Image 
                            styleName="large-wide"
                            source={
                                (companyProfile.image)
                                ? {uri : companyProfile.image}
                                :require('../../assets/images/no-image.png')
                            }
                        />
                        <View style={{
                            position:'absolute',
                            bottom:5,
                            right:5,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: '#fff',
                            backgroundColor:'#999',
                            display:'flex',
                            justifyContent:'center'
                        }}>
                            <FontAwesomeIcon name="picture-o" style={{color: '#fff' , fontSize: 16}} />
                        </View>
                    </View>
                </TouchableOpacity>
                <View styleName="vertical" style={{marginTop: 20 , paddingLeft: 20, paddingRight: 20}}>
                    <View styleName="horizontal v-center">
                        <View style={{flex: 0.26}}>
                            <Text>Name: </Text>
                        </View>
                        <TextInput
                            style={{flex: 0.74}}
                            placeholder="Company Name"
                            value={companyProfile.name}
                            onChangeText={(text)=>{
                                if(onStateChange){
                                    onStateChange('name' , text);
                                }
                            }}
                        />
                    </View>
                    <View styleName="horizontal v-center" style={{marginTop : 10}}>
                        <View style={{flex: 0.26}}>
                            <Text>Description: </Text>
                        </View>
                        <AutoExpandingTextInput
                            style={{flex: 0.74}}
                            placeholder="Company Description"
                            onChangeText={(text)=>{
                                if(onStateChange) onStateChange('description' , text);
                            }}
                            value={companyProfile.description}
                        />
                    </View>
                    <View styleName="horizontal v-center" style={{marginTop : 10}}>
                        <View style={{flex: 0.26}}>
                            <Text>Phone: </Text>
                        </View>
                        <TextInput
                            keyboardType="phone-pad"
                            style={{flex: 0.74}}
                            placeholder="Phone Number"
                            value={companyProfile.phone}
                            onChangeText={(text)=>{
                                if(onStateChange){
                                    onStateChange('phone' , text);
                                }
                            }}
                        />
                    </View>
                    <View styleName="horizontal v-center" style={{marginTop : 10}}>
                        <View style={{flex: 0.26}}>
                            <Text>Email: </Text>
                        </View>
                        <TextInput
                            style={{flex: 0.74}}
                            placeholder="Email"
                            value={companyProfile.email}
                            onChangeText={(text)=>{
                                if(onStateChange){
                                    onStateChange('email' , text);
                                }
                            }}
                        />
                    </View>
                    <View styleName="horizontal v-center" style={{marginTop : 10}}>
                        <View style={{flex: 0.26}}>
                            <Text>Website: </Text>
                        </View>
                        <TextInput
                            style={{flex: 0.74}}
                            placeholder="Website"
                            value={companyProfile.website}
                            onChangeText={(text)=>{
                                if(onStateChange){
                                    onStateChange('website' , text);
                                }
                            }}
                        />
                    </View>
                    <TouchableOpacity onPress={()=>{
                        navigation.push('MapView' , {onSelected: (place)=> {
                            if(onStateChange) {
                                // onStateChange('locationName' , locationName);
                                console.log(place);
                                onStateChange('address' , place.placeName);
                                onStateChange('latlng' , place.placeLatLng);
                            }
                        }});
                    }}>
                        <View styleName="horizontal v-center" style={{marginTop : 10}}>
                            <View styleName="wrap" style={{flex: 0.26}}>
                                <Text>Location: </Text>
                            </View>
                            <View styleName="horizontal v-center" style={{flex:0.74 ,padding: 15, backgroundColor:'#fff'}}>
                                {
                                    (companyProfile.address)
                                    ? <Text>{companyProfile.address}</Text>
                                    : <Text style={{color:'#bbb'}}>Location</Text>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View styleName="horizontal v-center h-center" style={{marginTop : 20}} >
                        <Button style={formButtonStyle} 
                        onPress={()=>{
                            if(onUpdateCompany){
                                onUpdateCompany();
                            }
                        }}>
                            <Text style={{color:'#fff' , fontWeight: 'bold'}}>SAVE</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    </KeyboardAvoidingView>
)

export default ManageCompanyProfileScreen;