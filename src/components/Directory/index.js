import React from 'react';
import {
    Screen ,
    View , 
    NavigationBar ,
    Button ,
    TextInput ,
    Image
} from '@shoutem/ui' ;


import DirectoryListView from '../DirectoryListView';
import { FontAwesomeIcon , FeatherIcon } from '../Icon';
import { navigatorBarStyle , iconStyle } from '../styles';
// import { withNavigation } from 'react-navigation';

const DirectoryScreen = ({navigation , notification}) => (
    <Screen style={{backgroundColor: '#fff'}}>
        <NavigationBar 
            style={navigatorBarStyle}
            styleName="inline"
            // leftComponent={
            //     <Button
            //         onPress={()=>{}}
            //     >
            //         <FontAwesomeIcon name="search" style={iconStyle} />
            //     </Button>
            // }
            centerComponent={
                <Image resizeMode="contain" styleName="medium" source={require('../../assets/images/logo.png')}/>
            }
            rightComponent={
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
                
            }
        />
        
        <DirectoryListView
            onCellSelect={(user)=>{
                // console.log(user);
                navigation.push('UserDetailTop' , {user})
            }}
        />
    </Screen>
)

export default DirectoryScreen;