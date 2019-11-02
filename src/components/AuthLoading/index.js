import React from 'react';
import {
    View ,
    Screen ,
    NavigationBar ,
    Spinner ,
    Image
} from '@shoutem/ui';
import { Dimensions } from 'react-native';


const { height } = Dimensions.get('window');
const AuthLoadingScreen = () => (
    <Screen style={{backgroundColor:'#191919'}}>
        <NavigationBar
            // title="TELEMED"
            styleName="clear"
        />
        <View styleName="vertical v-center" style={{height: (height * 90) / 100}}>
            <View 
                styleName="horizontal h-center v-center"
            >
                <Image styleName="medium-wide" resizeMode="contain" source={require('../../assets/images/logo.png')}/>
            </View>
            <View 
                styleName="horizontal h-center v-center"
                style={{marginTop: 10}}
            >
                <Spinner />
            </View>
        </View>
    </Screen>
)

export default AuthLoadingScreen;