import React from 'react';
import {
    Screen ,
    View , 
    NavigationBar ,
    Button ,
    TextInput ,
    Title ,
    Text,
    ListView
} from '@shoutem/ui' ;
import uuidv4 from 'uuid/v4';
import ListUsers from '../ListUsers';
import { FontAwesomeIcon } from '../Icon';
import { navigatorBarStyle , navTitle } from '../styles';
// import { withNavigation } from 'react-navigation';

const ReferToScreen = ({onAddRefer , userProfile , navigation , state , onSelectUser , updatePost , listUsers}) => (
    <Screen style={{backgroundColor: '#fff'}}>
        <NavigationBar
            hasHistory={true}
            leftComponent={
                <Button styleName="clear" onPress={()=>{
                    navigation.popToTop();
                }}>
                    <FontAwesomeIcon  name="angle-left" style={{color:'#fff'}} />
                </Button>
            }
            centerComponent={
                <Title style={Object.assign({} , navTitle , {color:'#fff'})}>
                    Refer to
                </Title>
            }
            rightComponent={
                <Button 
                onPress={async ()=>{
                    if(state.selectedUsers.length > 0) {
                        let postId = navigation.getParam('postId' , 'null');
                        let countRefer = navigation.getParam('countRefer' , 0);
                        let promises = []
                        for(let item of state.selectedUsers) {
                            
                            promises.push(onAddRefer({
                                id: uuidv4() ,
                                postReferSecondPostId: postId ,
                                referrer: userProfile.id ,
                                receiver: item ,
                                postReferSecondReferrerPostUserId: userProfile.id ,
                                postReferSecondReceiverPostUserId: item
                            }));
                        }
                        promises.push(updatePost({
                            id: postId,
                            countRefer:  countRefer + state.selectedUsers.length
                        }))
                        await Promise.all(promises);
                        
                        navigation.goBack();
                    }
                }}
                styleName="clear">
                    <Text style={{color: '#fff'}}>Send ({state.selectedUsers.length})</Text>
                </Button>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <ListUsers
            listUsers={listUsers}
            enableSelect={true}
            onSelectUser={onSelectUser}
        />
    </Screen>
)

export default ReferToScreen;