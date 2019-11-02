import React from 'react';

import {
    Screen ,
    NavigationBar ,
    View ,
    Title ,
    ListView,
    TextInput ,
    Button
} from '@shoutem/ui';



import { ScrollView  , TouchableOpacity , SafeAreaView , KeyboardAvoidingView } from 'react-native';

// import PostCard from '../PostCard';
import PreloadPostCard from '../PreloadPostCard';
import { withNavigation } from 'react-navigation';
import CommentList from './CommentList';
import { MaterialIcon , FontAwesomeIcon } from '../Icon';
import { navigatorBarStyle , navTitle } from '../styles';
import Spinner from 'react-native-loading-spinner-overlay';
// const mockList = ['test' , 'test']

const PostDetailScreen = ({user , navigation , post , onAddComment , onStateChange , state}) => (
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
                    Post Detail
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <Spinner 
            visible={state.loading}
        />
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{backgroundColor:'#eee' , flex: 0.8}}>
                <PreloadPostCard id={post.id} focus="comment" showAction showActivityTab />
                <CommentList postId={post.id} />
            </ScrollView>
            <View styleName="horizontal v-center" style={{flex:0.2 , backgroundColor: '#eee'}}>
                <View style={{flex: 0.8 , padding: 15}}>
                    <TextInput 
                        value={state.message}
                        onChangeText={(text)=>{
                            onStateChange('message' , text);
                        }}
                        placeholder="Message"
                    />
                </View>
                <View style={{flex: 0.2}}>
                    <TouchableOpacity 
                        onPress={()=>{
                            if(onAddComment) onAddComment()
                        }}
                        style={{
                            width: 35 , 
                            height: 35 , 
                            paddingLeft : 3, 
                            borderRadius: 17.5,
                            borderWidth: 0.5,
                            borderColor: '#000',
                        }}
                    >
                        <View styleName="vertical v-center h-center" style={{flex: 1 , paddingRight: 5}}>
                            <MaterialIcon name="send" style={{fontSize: 12}} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    </Screen>
    </KeyboardAvoidingView>
)

export default withNavigation(PostDetailScreen);