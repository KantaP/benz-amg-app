import React from 'react';
import { 
    Screen ,
    View ,
    Image ,
    NavigationBar ,
    Button ,
    Text ,
    Title
} from '@shoutem/ui';
import { FontAwesomeIcon  , FeatherIcon}  from '../Icon';
import { iconStyle , navigatorBarStyle } from '../styles';

import moment from 'moment';
import ListUpcomingEvent from './ListUpcomingEvent';
import ListMyEvent from './ListMyEvent';
import { withNavigationFocus } from 'react-navigation';

const EventScreen = ({navigation,  userProfile, isFocused , notification}) => (
    <Screen style={{backgroundColor:'#fff'}}>
            {/* <Spinner 
            visible={loading}
            textContent={'Loading...'}
            textStyle={{color: '#fff'}}
        /> */}
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
                <View>
                    <Image resizeMode="contain" styleName="medium" source={require('../../assets/images/logo.png')}/>
                </View>
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
        <View style={{marginTop: 5}}></View>
        <View style={{padding: 10 , backgroundColor:'#f6f6f6'}}>
            <Text>My Event</Text>
        </View>
        {
            (isFocused)
            ? (<ListMyEvent navigation={navigation} startTimeUnix={moment().toISOString()} userProfile={userProfile} />)
            : null
        }
        <View style={{padding: 10 , backgroundColor:'#f6f6f6'}}>
            <Text style={{color:'red'}}>Upcoming Event</Text>
        </View>
        {
            (isFocused)
            ? (<ListUpcomingEvent navigation={navigation} startTimeUnix={moment().toISOString()} userProfile={userProfile} />)
            : null
        }
    </Screen>
)

export default withNavigationFocus(EventScreen);