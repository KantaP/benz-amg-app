import React from 'react';
import { withNavigation } from 'react-navigation';
import { 
    Screen ,
    NavigationBar,
    View,
    Button ,
    Title ,
    ListView ,
    Text,
    TextInput
} from '@shoutem/ui';
import { navigatorBarStyle , formButtonStyle } from '../styles';
import { FontAwesomeIcon } from '../Icon';
import { KeyboardAvoidingView , TouchableOpacity } from 'react-native';
let timer = null;
const TagSearchScreen = ({navigation , state , onSearch , onAddTag , onStateChange}) => (
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
                        <FontAwesomeIcon  name="angle-left" style={{fontSize: 24 ,color:'#fff'}} />
                    </Button>
                }
                centerComponent={
                    <Title style={{color:'#fff'}}>
                        Tags
                    </Title>
                }
                style={navigatorBarStyle}
                styleName="inline"
            />
            <View styleName="horizontal v-center h-center" style={{padding : 20}}>
                {/* <View styleName="fill-parent" style={{left: 0 , top: 10}}>
                    <FontAwesomeIcon name="search" />
                </View> */}
                <TextInput
                    onChangeText={(text)=>{
                        if(onStateChange) onStateChange('tagText' , text);
                        clearTimeout(timer);
                        if(!text) return false;
                        timer = setTimeout(()=>{
                            
                            if(onSearch) onSearch(text);
                            clearTimeout(timer);
                        }, 1000)
                    }}
                    style={{flex: 1}}
                    placeholder="Tag"
                />
            </View>
            {
                state.tags.map((tag)=>(
                    <View styleName="horizontal v-center" style={{padding: 30 , borderBottomWidth: 1 , borderBottomColor: '#ccc'}}>
                        <Text>{tag.name}</Text>
                    </View>
                ))
            }
            <View styleName="horizontal v-center h-center">
                <Button 
                style={formButtonStyle}
                onPress={()=>{
                    // console.log(onAddTag)
                    if(onAddTag) onAddTag();
                }}
                >
                    <Text style={{color:'#fff' , fontWeight: 'bold'}}>ADD TAG</Text>
                </Button>
            </View>
            {/* <ListView 
                data={state.tags}
                onLoadMore={()=>{
                }}
                renderFooter={()=>{
                    return (
                        <View styleName="horizontal v-center h-center">
                            <Button 
                            style={formButtonStyle}
                            onPress={()=>{
                                if(onAddTag) onAddTag();
                            }}
                            >
                                <Text style={{color:'#fff' , fontWeight: 'bold'}}>ADD TAG</Text>
                            </Button>
                        </View>
                    )
                }}
                renderHeader={()=>(
                    <View styleName="horizontal v-center h-center" style={{padding : 20}}>
                        
                        <TextInput
                            onChangeText={(text)=>{
                                if(onStateChange) onStateChange('tagText' , text);
                                clearTimeout(timer);
                                if(!text) return false;
                                timer = setTimeout(()=>{
                                    
                                    if(onSearch) onSearch(text);
                                    clearTimeout(timer);
                                }, 1000)
                            }}
                            style={{flex: 1}}
                            placeholder="Tag"
                        />
                    </View>
                )}
                renderRow={(tag)=>(
                    <TouchableOpacity onPress={()=>{
                        
                    }}>
                        <View styleName="horizontal v-center" style={{padding: 30 , borderBottomWidth: 1 , borderBottomColor: '#ccc'}}>
                            <Text>{tag.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            /> */}
        </Screen>
    </KeyboardAvoidingView>
)

export default withNavigation(TagSearchScreen);

