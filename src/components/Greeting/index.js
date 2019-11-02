import React from 'react';
import {
    Screen,
    View ,
    Button ,
    Text ,
    Spinner
} from '@shoutem/ui';
import {  formButtonStyle , formButtonDisableStyle , greetingButtonStyle } from '../styles';
import AutoExpandingTextInput from '../AutoExpandingTextInput';

import { Dimensions } from 'react-native';

const GreetingScreen  = ({onCreate , state , onStateChange }) => (
    <Screen style={{backgroundColor:'transparent'}}>
        <View styleName="vertical h-center v-center" style={{height: Dimensions.get('window').height , backgroundColor:'rgba(0,0,0,0.5)'} }>
            <View style={{width: (Dimensions.get('window').width * 80 ) / 100  , backgroundColor:'#fff'}}>
                <View styleName="horizontal h-center" style={{padding: 10 , backgroundColor:'#000'}}>
                    <View styleName="vertical v-center h-center">
                        <Text style={{color:'#fff' , fontSize: 20}}>Welcome</Text>
                        <Text style={{color:'#fff' , fontSize: 12}}>
                            and thanks for joining us at AMG Club Thailand
                        </Text>
                    </View>
                </View>
                <View styleName="horizontal" style={{paddingHorizontal: 5}} >
                    <AutoExpandingTextInput
                        style={{width: '100%'}}
                        placeholder="* Description" 
                        onChangeText={(text)=>{
                            if(onStateChange) {
                                onStateChange('content' , text);
                            }
                        }}
                        // value={state.content}
                    />
                </View>
                <View styleName="horizontal h-center" style={{paddingHorizontal: 15 , paddingVertical: 5}} >
                    <Button style={(state.content.trim()) ? { ...formButtonStyle , ...greetingButtonStyle } : {...formButtonStyle , ...formButtonDisableStyle , ...greetingButtonStyle}} 
                    onPress={()=>{
                        if(onCreate && state.content.trim() && !state.loading) {
                            onCreate()
                        }
                    }}>
                        {
                            (state.loading) 
                            ?   <Spinner style={{color: '#fff'}} />
                            :   <Text style={{color:'#fff' , fontWeight: 'bold'}}>CREATE</Text>
                        }
                    </Button>
                </View>
            </View>
        </View>
    </Screen>
)

export default GreetingScreen;
