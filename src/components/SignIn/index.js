import React from 'react';
import {
    View ,
    Text ,
    TextInput ,
    Button ,
    Screen ,
    NavigationBar ,
    Spinner ,
    Image 
} from '@shoutem/ui';

import Icon from '../Icon';
import { textStyle , buttonStyle  , inputTextStyle } from '../styles';

import { Dimensions , ImageBackground as RNImage } from 'react-native';

const { height } = Dimensions.get('window');

const mainHeight = (height * 90) / 100
const block1Style = { 
  mainBlock : {
    height: mainHeight
  } ,
  logoBlock : {
    height: (mainHeight * 30) / 100 ,
    marginTop : 20
  } ,
  inputBlock : {
    height: (mainHeight * 10) / 100
  } ,
  buttonBlock : {
    height: (mainHeight * 50) / 100
  }
}

const loginButton = {
  width: 300 ,
  height: 50 ,
  fontFamily: 'CAR',
}

const SignInComponent = ({onSignIn , onChangeText , onShowSpinner , screenProps , onOpenWeb}) => (
    <Screen>
      <NavigationBar
        // title="TELEMED"
        styleName="clear"
      />
      <RNImage  
        style={{
          flex: 1,
          width: null,
          height: null,
          resizeMode: 'cover'
        }}
        source={require('../../assets/images/bg.jpg')}
      >

      <View style={block1Style.mainBlock}>
          <View styleName="vertical h-center v-center" style={block1Style.logoBlock}>
            <Image
              styleName="medium-wide"
              resizeMode="contain"
              source={require('../../assets/images/logo.png')}
            />
          </View>
          <View 
            style={block1Style.inputBlock}
            styleName="vertical h-center v-center"
          >
              {/* <Icon name="user" /> */}
              <TextInput 
                keyboardType="email-address"
                onChangeText={(text)=>{
                  if(onChangeText) onChangeText('username' , text);
                }}
                style={Object.assign(inputTextStyle , {width: 300})}
                placeholder={screenProps.t('email')}
                placeholderTextColor="white"
              />
          </View>
          <View 
            style={block1Style.inputBlock}
            styleName="vertical h-center v-center"
          >
              {/* <Icon name="lock"  /> */}
              <TextInput 
                onChangeText={(text)=>{
                  if(onChangeText) onChangeText('password' , text);
                }}
                style={Object.assign(inputTextStyle, {width: 300})}
                placeholder={screenProps.t('password')}
                secureTextEntry
                placeholderTextColor="white"
              />
          </View>
          <View 
            styleName="vertical h-center v-center"
            style={block1Style.buttonBlock}
          >
            {
              (onShowSpinner) &&
              onShowSpinner() &&
              <Button styleName="border" 
              style={Object.assign(buttonStyle , loginButton)}>
                <Spinner style={{color: '#fff'}} />
              </Button>
            }
            {
              (
                ((onShowSpinner) && !onShowSpinner()) ||
                (!onShowSpinner)
              )  
              &&
              <Button 
              styleName="border" 
              style={Object.assign(buttonStyle , loginButton)}
              onPress={()=>{
                if(onSignIn) {
                  onSignIn()
                }
              }}
              >
                <Text style={textStyle}>
                  {screenProps.t('login')}
                </Text>
              </Button>
            }
          </View>
      </View>
      <View styleName="horizontal v-center space-between" style={{height: (height * 10) / 100 , paddingBottom: 30}}>
        <Button styleName="clear" onPress={()=>{
          if(onOpenWeb) {
            onOpenWeb('forgotpassword')
          }
        }}>
          <Text style={textStyle}>{screenProps.t('forgotpassword')}</Text>
        </Button>
        <Button styleName="clear" onPress={()=>{
          if(onOpenWeb) {
            onOpenWeb('signup')
          }
        }}>
          <Text style={textStyle}>{screenProps.t('registration')}</Text>
        </Button>
      </View>
      </RNImage>
    </Screen>
);

export default SignInComponent;