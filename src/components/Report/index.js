import React from 'react';

import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    TextInput ,
    Button ,
    DropDownMenu ,
    Row,
    ListView
} from '@shoutem/ui';

import uuidv4 from 'uuid/v4';

import { withNavigation } from 'react-navigation';
import { navigatorBarStyle , navTitle } from '../styles';
import { FontAwesomeIcon  , MaterialIcon } from '../Icon';
import PreloadPostCard from '../PreloadPostCard';
import AutoExpandingTextInput from '../AutoExpandingTextInput';
import { KeyboardAvoidingView } from 'react-native';
const ReportScreen = ({navigation , user , onStateChange , state , postId , createReport }) => (
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
                <Title style={Object.assign({} , navTitle , {color:'#fff'})}>
                    Report
                </Title>
            }
            rightComponent={
                <Button styleName="clear" onPress={()=>{
                    if(!state.selectedType) {
                        alert('Please select type.')
                        return false;
                    }
                    createReport({
                        id: uuidv4() ,
                        description: state.description || "null",
                        type: state.selectedType.title ,
                        status: 'submit' , 
                        reportPostId: postId ,
                        reportReporterId: user.userProfile.id
                    })
                    navigation.goBack();
                }}>
                    <MaterialIcon  name="send" style={{color:'#fff'}} />
                </Button>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <View styleName="vertical">
            
            <AutoExpandingTextInput 
                placeholder="Description"
                onChangeText={(text)=>{
                    onStateChange('description' , text);
                }}
            />
            <DropDownMenu
                styleName="horizontal"
                options={state.types}
                selectedOption={state.selectedType ? state.selectedType : state.types[0]}
                onOptionSelected={(type) => {
                    if(type.title === 'Please select type') return false;
                    onStateChange('selectedType' , type)
                }}
                titleProperty="title"
                valueProperty="types.title"
            />
            <ListView
                data={[{id: postId}]}
                renderRow={(post)=>{
                    return <PreloadPostCard id={post.id} showAction={false} showActivityTab={false} />
                }}
            />
        </View>
    </Screen>
    </KeyboardAvoidingView>
)

export default withNavigation(ReportScreen);