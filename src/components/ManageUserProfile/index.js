import React from 'react';
import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    Button ,
    Text ,
    Image,
    TextInput,
    DropDownMenu
} from '@shoutem/ui';

import { ScrollView , KeyboardAvoidingView , TouchableOpacity } from 'react-native';
import { navigatorBarStyle, formButtonStyle  , navTitle , colorScheme} from '../styles';
import { FontAwesomeIcon  } from '../Icon'; 
import _ from 'lodash';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

const ManageUserProfileScreen = (
    {
        navigation , 
        userProfile , 
        onImagePicker , 
        datepicker , 
        onShowDatePicker ,
        onHideDatePicker ,
        onConfirmDatePicker,
        updateUser,
        onStateChange,
        state ,
        onStateChangeLocal ,
        onSelectProvince
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
                        User Profile
                    </Title>
                }
                style={navigatorBarStyle}
                styleName="inline"
            />
            <Spinner 
                visible={state.loading}
            />
            <ScrollView>
            {
                [
                    <View styleName="horizontal h-center" style={{marginTop: 20}}>
                        <View 
                            styleName="horizontal h-center" 
                            style={{
                                flex: 0.75
                            }}
                        >
                                {/* <FontAwesomeIcon name="lock"  /> */}
                            <TouchableOpacity onPress={()=>{
                                if(onImagePicker) {
                                    onImagePicker();
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
                                            (userProfile.image) 
                                            ? {uri : userProfile.image}
                                            : require('../../assets/images/user-blank.jpg')
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
                    </View>,
                    <View styleName="vertical" style={{marginTop: 20 , paddingLeft: 20, paddingRight: 20}}>
                        <View styleName="horizontal h-center v-center">
                            <View style={{flex: 0.25}}>
                                <Text>Name: </Text>
                            </View>
                            <TextInput
                                style={{flex: 0.75}}
                                placeholder="First Name"
                                value={userProfile.firstName}
                                onChangeText={(text)=>{
                                    if(onStateChange){
                                        onStateChange('firstName' , text);
                                    }
                                }}
                            />
                        </View>
                        <View styleName="horizontal h-center v-center" style={{marginTop : 10}}>
                            <View style={{flex: 0.25}}>
                                <Text>Lastname: </Text>
                            </View>
                            <TextInput
                                style={{flex: 0.75}}
                                placeholder="Last Name"
                                value={userProfile.lastName}
                                onChangeText={(text)=>{
                                    if(onStateChange){
                                        onStateChange('lastName' , text);
                                    }
                                }}
                            />
                        </View>
                        <View styleName="horizontal h-center v-center" style={{marginTop : 10}}>
                            <View style={{flex: 0.25}}>
                                <Text>Address: </Text>
                            </View>
                            <TextInput
                                style={{flex: 0.75}}
                                placeholder="Address"
                                value={userProfile.address}
                                onChangeText={(text)=>{
                                    if(onStateChange){
                                        onStateChange('address' , text);
                                    }
                                }}
                            />
                        </View>
                        <View styleName="horizontal v-center" style={{marginTop : 10}}>
                            <View style={{flex: 0.23}}>
                                <Text>Province: </Text>
                            </View>
                            <View styleName="horizontal" style={{backgroundColor:'#fff' , flex: 0.77}}>
                                <DropDownMenu
                                    options={state.changwats}
                                    selectedOption={state.selectedChangwat ? state.selectedChangwat : state.changwats[0]}
                                    onOptionSelected={(changwat) => {
                                        if(changwat.pid === '') return false;
                                        onSelectProvince(changwat)
                                    }}
                                    titleProperty="name"
                                    valueProperty="changwats"
                                />
                            </View>
                        </View>
                        {
                            (typeof state.selectedChangwat === 'object') &&
                            (
                                <View styleName="horizontal v-center" style={{marginTop : 10}}>
                                    <View style={{flex: 0.23}}>
                                        <Text>District: </Text>
                                    </View>
                                    <View styleName="horizontal" style={{backgroundColor:'#fff' , flex: 0.77}}>
                                        <DropDownMenu
                                            options={state.amphoes}
                                            selectedOption={state.selectedAmphoe ? state.selectedAmphoe : state.amphoes[0]}
                                            onOptionSelected={(amphoe) => {
                                                if(amphoe.pid === '') return false;
                                                onStateChangeLocal('selectedAmphoe' , amphoe)
                                            }}
                                            titleProperty="name"
                                            valueProperty="amphoes.name"
                                        />
                                    </View>
                                </View>
                            )
                        }
                        <TouchableOpacity onPress={()=>{
                            if(onShowDatePicker) {
                                onShowDatePicker();
                            }
                        }}>
                            <View styleName="horizontal v-center" style={{marginTop : 10}}>
                                <View style={{flex: 0.25}}>
                                    <Text>Birth Date: </Text>
                                </View>
                                <View 
                                styleName="horizontal v-center" 
                                style={{
                                    flex:0.75 ,
                                    padding: 15, 
                                    backgroundColor:'#fff'
                                }}>
                                    {
                                        (!userProfile.birthDate)
                                        ?<Text style={{color:'#ccc'}}>Birth Date</Text>
                                        :<Text>{moment(userProfile.birthDate).format('DD/MM/YYYY')}</Text>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View styleName="horizontal v-center" style={{marginTop : 10}}>
                            <View style={{flex: 0.25}}>
                                <Text>Mobile: </Text>
                            </View>
                            <TextInput
                                keyboardType="phone-pad"
                                style={{flex: 0.75}}
                                placeholder="Phone Number"
                                value={userProfile.mobilePhone}
                                onChangeText={(text)=>{
                                    if(onStateChange){
                                        onStateChange('mobilePhone' , text);
                                    }
                                }}
                            />
                        </View>
                        {/* <View styleName="horizontal h-center" style={{marginTop : 10}}>
                            <TextInput
                                style={{flex: 1}}
                                placeholder="Email"
                                editable={false}
                                value={userProfile.email}
                                onChangeText={(text)=>{
                                    if(onStateChange){
                                        onStateChange('email' , text);
                                    }
                                }}
                            />
                        </View> */}
                        <View styleName="horizontal v-center h-center" style={{marginTop : 20}} >
                            <Button style={formButtonStyle} 
                            onPress={()=>{
                                if(updateUser) {
                                    console.log('update user')
                                    updateUser();
                                }
                            }}>
                                <Text style={{color:'#fff' , fontWeight: 'bold'}}>SAVE</Text>
                            </Button>
                        </View>
                    </View>,
                    <DateTimePicker
                        isDarkModeEnabled={colorScheme === 'dark' ? true : false}
                        isVisible={datepicker.isDateTimePickerVisible}
                        onConfirm={onConfirmDatePicker}
                        onCancel={onHideDatePicker}
                    />
                ]
            }
            </ScrollView>
        </Screen>
    </KeyboardAvoidingView>
)


export default ManageUserProfileScreen;