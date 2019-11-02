import React from 'react';
import { 
    Screen ,
    NavigationBar ,
    Title ,
    Button ,
    View ,
    TextInput, 
    Caption
} from '@shoutem/ui';
import { FontAwesomeIcon }  from '../Icon';
import { navigatorBarStyle ,  navTitle} from '../styles';
import { FlatList , ActivityIndicator } from 'react-native';
import PreloadPostCard from '../PreloadPostCard';


const HomeSearchScreen = ({navigation , state , onStateChange , onSearch , onLoadMore}) => (
    <Screen style={{backgroundColor:'#fff'}}>
        <NavigationBar
            hasHistory={true}
            leftComponent={
                <Button styleName="clear" onPress={()=>{
                    navigation.goBack()
                }}>
                    <FontAwesomeIcon  name="angle-left" style={{color:'#fff'}} />
                </Button>
            }
            centerComponent={
                <Title style={Object.assign({} , navTitle , {color:'#fff'})}>
                    Search
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <View styleName="horizontal h-center" style={{padding: 5 , marginBottom : 20, marginTop: 10}}>
            <View style={{flex: 0.9 , borderBottomWidth: 0.5 , borderBottomColor: '#ccc'}}>
                <TextInput
                    placeholder="Search"
                    onChangeText={(text)=>{
                        onStateChange('searchText' , text);
                    }}
                    onSubmitEditing={()=>{
                        onSearch();
                    }}
                />
            </View>
        </View>
        {
            state.loading &&
            (
                <View styleName="horizontal h-center v-center" style={{padding: 10}}>
                    <ActivityIndicator />
                </View>
            )
        }
        {
            state.submitSearch &&
            !state.loading &&
            state.posts.length > 0 &&
            (
                <FlatList
                    removeClippedSubViews
                    data={state.posts}
                    keyExtractor={(item ,index) => item.id}
                    renderItem={({item}) => {
                        return <PreloadPostCard id={item.id} navigation={navigation} showAction={true} showActivityTab={true} />
                    }}
                    initialNumToRender={8}
                    maxToRenderPerBatch={2}
                    onEndReachedThreshold={0.5}
                    onEndReached={()=>{
                        if(onLoadMore) {
                            onLoadMore();
                        }
                    }}
                    // refreshing={this.props.refreshing}
                    // onRefresh={()=>{ 
                    //     this.props.refetch();
                    // }}
                />
            )
        }
        {
            state.submitSearch &&
            !state.loading &&
            state.posts.length === 0 &&
            (
                <View styleName="vertical v-center h-center" style={{flex: 1}}>
                    <Title style={{color:'#ccc' , fontWeight:'bold'}}>No Post</Title>
                    <Caption style={{color:'#ccc'}}></Caption>
                </View>
            )
        }
    </Screen>
)   

export default HomeSearchScreen;