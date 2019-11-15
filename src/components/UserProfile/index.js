import React from 'react';
import {
    Screen ,
    View ,
    NavigationBar , 
    Button as BT , 
    Image ,
    Title ,
    Text ,
    Caption
} from '@shoutem/ui';

import { FontAwesomeIcon , AntDesignIcon , FeatherIcon } from '../Icon';
import { navigatorBarStyle , iconStyle } from '../styles';
import MyPostsView from './MyPosts';
import BookmarkView from './Bookmark';
import PriviledgeView from './Priviledge';
import ReferView from './Refer';
import WithPreventDoubleClick from '../WithPreventDoubleClick';

const Button = WithPreventDoubleClick(BT);

const UserProfileScreen = ({navigation , userProfile , state , onSelectTab , onSignOut , notification }) => (
    <Screen style={{backgroundColor:'#fff'}}>
        <NavigationBar 
            style={navigatorBarStyle}
            styleName="inline"
            // leftComponent={
            //     <Button
            //         onPress={()=>{

            //         }}
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
        <View 
        styleName="horizontal v-start space-between" 
        style={{padding: 10 , borderBottomWidth:1 , borderBottomColor: '#eee'}}>
            <View styleName="horizontal v-center">
                <Image 
                    style={{width : 64, height: 64 , borderRadius: 32}} 
                    source={
                        (userProfile.image) 
                        ? {uri: userProfile.image}
                        : require('../../assets/images/user-blank.jpg')}
                />
                <View styleName="vertical" style={{marginLeft: 10}}>
                    <Text numberOfLines={1}>{userProfile.firstName} {userProfile.lastName}</Text>
                    <View style={{marginTop:-7}}>
                        <Caption>
                            {
                                (userProfile.companies.items.length > 0) 
                                ? `${userProfile.companies.items[0].name}`
                                : null
                            }
                        </Caption>
                    </View>
                    <View style={{marginTop: -8}}>
                        <Caption>
                            {
                                (userProfile.district && userProfile.province) 
                                ? `${userProfile.district} , ${userProfile.province}`
                                : (userProfile.district && !userProfile.province) 
                                    ? `${userProfile.district}`
                                    : (!userProfile.district && userProfile.province) 
                                        ? `${userProfile.province}`
                                        : ``
                            }
                        </Caption>
                    </View>
                </View>
            </View>
            <View styleName="vertical h-start">
                <Button styleName="clear" onPress={()=>{
                    navigation.push('Setting')
                }}>
                    <AntDesignIcon name="setting" />
                </Button>
            </View>
        </View>
        <View styleName="horizontal h-center" style={{padding: 10 , borderBottomColor: '#eee' , borderBottomWidth: 1}}>
            <Button styleName="clear" onPress={()=>{
                if(onSelectTab) onSelectTab(0);
            }}>
                <Text style={{color: (state.tabSelected === 0) ? '#b21e23' : '#000'}}>My Posts</Text>
            </Button>
            <Button styleName="clear" onPress={()=>{
                if(onSelectTab) onSelectTab(1);
            }}>
                <Text style={{color: (state.tabSelected === 1) ? '#b21e23' : '#000'}}>Bookmark</Text>
            </Button>
            <Button styleName="clear" onPress={()=>{
                if(onSelectTab) onSelectTab(2);
            }}>
                <Text style={{color: (state.tabSelected === 2) ? '#b21e23' : '#000'}}>Privilege</Text>
            </Button>
            <Button styleName="clear" onPress={()=>{
                if(onSelectTab) onSelectTab(3);
            }}>
                <Text style={{color: (state.tabSelected === 3) ? '#b21e23' : '#000'}}>Refer</Text>
            </Button>
        </View>
        {
            (state.tabSelected === 0) &&
            ( <MyPostsView userId={userProfile.id} />)
        }
        {
            (state.tabSelected === 1) &&
            ( <BookmarkView userId={userProfile.id} />)
        }
        {
            (state.tabSelected === 2) &&
            ( <PriviledgeView userId={userProfile.id} />)
        }
        {
            (state.tabSelected === 3) &&
            ( <ReferView userId={userProfile.id} />)
        }
    </Screen>
)

export default UserProfileScreen;