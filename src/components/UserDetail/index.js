import React from 'react';
import {
    Screen ,
    NavigationBar ,
    View , 
    Button as BT ,
    Title ,
    Image ,
    Text,
    Caption,
    TouchableOpacity as TouchEx
} from '@shoutem/ui';
import { FlatList } from 'react-native';
import { Query } from 'react-apollo';
import { getUser  } from '../../graphql/queries';
import { FontAwesomeIcon , FoundationIcon, SimpleLineIcon , EntypoIcon } from '../Icon';
import { navigatorBarStyle , navTitle } from '../styles';
import PreloadPostCard from '../PreloadPostCard';
import gql from 'graphql-tag';
import RBSheet from "react-native-raw-bottom-sheet";
import WithPreventDoubleClick from '../WithPreventDoubleClick';

const Button = WithPreventDoubleClick(BT);
const TouchableOpacity = WithPreventDoubleClick(TouchEx);

const styles = {
    actionButton: {
        borderColor:'#C43835' ,
        padding: 0 , 
        paddingLeft: 10,
        width: 35 , 
        height: 35 , 
        borderRadius: 17.5
    }
}

const UserDetailScreen = (
    {
        navigation , 
        userSelected , 
        onToggleBlock , 
        state , 
        setSheetRef , 
        onOpenSheet ,
        onCloseSheet
    }
) => (
    <Screen style={{backgroundColor:'#fff'}}>
        <NavigationBar
            leftComponent={
                <Button styleName="clear" onPress={()=>{
                    navigation.popToTop();
                }}>
                    <FontAwesomeIcon  name="angle-left" style={{fontSize: 24 ,color:'#fff'}} />
                </Button>
            }
            centerComponent={
                <Title style={Object.assign({} , navTitle , {color:'#fff'})} numberOfLines={1}>
                    {userSelected.firstName || ''} {userSelected.lastName || ''}
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <Query query={gql(getUser)} variables={{id: userSelected.id}}>
            {
                ({data , loading , error , fetchMore}) => {
                    if(loading) return null;
                    let user = data.getUser;
                    return [
                        <View 
                        styleName="horizontal space-between" 
                        style={{padding: 10 , borderBottomWidth:1 , borderBottomColor: '#eee'}}>
                            <View styleName="horizontal h-start v-start">
                                <View style={{flex: 1}}>
                                    <Image 
                                        style={{width : 64, height: 64 , borderRadius: 32}} 
                                        source={
                                            (user.image)
                                            ? {uri: user.image}
                                            : require('../../assets/images/user-blank.jpg')}
                                    />
                                </View>
                                <View styleName="vertical" style={{marginLeft: 10 , flex: 3}}>
                                    <Text numberOfLines={1}>{user.firstName} {user.lastName}</Text>
                                    <View style={{marginTop:-7}}>
                                        <Caption>
                                            {
                                                (user.companies.items.length > 0) 
                                                ? `${user.companies.items[0].name}`
                                                : null
                                            }
                                        </Caption>
                                    </View>
                                    <View style={{marginTop:-8}}>
                                        <Caption>
                                            {
                                                (user.district && user.province) 
                                                ? `${user.district} , ${user.province}`
                                                : (user.district && !user.province) 
                                                    ? `${user.district}`
                                                    : (!user.district && user.province) 
                                                        ? `${user.province}`
                                                        : ``
                                            }
                                        </Caption>
                                    </View>
                                    <View styleName="horizontal v-start h-start">
                                        <View styleName="vertical v-center  h-center" style={{paddingVertical:5 , paddingHorizontal: 8}}>
                                            <Button 
                                                style={styles.actionButton}
                                                onPress={()=>{
                                                    navigation.push('Connect' , {
                                                        chatTo: user.id , 
                                                        pushTo: user.pushToken
                                                    });
                                                }}
                                            >
                                                <FoundationIcon style={{ fontSize: 18 ,color: '#C43835'}} name="comments" />
                                            </Button>
                                            <View style={{marginTop: 5}}><Text style={{fontSize: 10}}>Connect</Text></View>
                                        </View>
                                        {
                                            user.companies.items.length > 0 &&
                                            (
                                                <View styleName="vertical v-center  h-center" style={{padding: 5}}>
                                                    <Button
                                                        onPress={()=>{
                                                            navigation.push('CompanyDetail' , {companyProfile: user.companies.items[0]})
                                                        }}
                                                        style={styles.actionButton}
                                                    >
                                                        <FontAwesomeIcon style={{fontSize: 14 ,color: '#C43835'}} name="building-o" />
                                                    </Button>
                                                    <View style={{marginTop: 5}}><Text style={{fontSize: 10}}>Company</Text></View>
                                                </View>
                                            )
                                        }
                                        
                                    </View> 
                                </View>
                                <View styleName="vertical" style={{flex: 1}}>
                                    <View styleName="horizontal h-end">
                                        <Button
                                            onPress={()=>{
                                                if(onOpenSheet) {
                                                    onOpenSheet();
                                                }
                                            }}
                                            styleName="clear"
                                        >
                                            <EntypoIcon name="dots-three-vertical" style={{fontSize: 20}} />
                                        </Button>
                                    </View>
                                    
                                </View>
                            </View>
                        </View>
                        ,
                        // {
                            (user.postsOfUser.items.length === 0) &&
                            (
                                <View styleName="vertical v-center h-center" style={{flex: 1 , paddingHorizontal: 10}}>
                                    <Title style={{color:'#ccc' , fontWeight:'bold'}}>No Post</Title>
                                    <View styleName="horizontal h-center">
                                        <Caption style={{color:'#ccc', textAlign:'center'}} numberOfLines={2}>
                                            This page will contain information when this user created post
                                        </Caption>
                                    </View>
                                </View>
                            ) ,
                        // } ,
                        // {
                            (user.postsOfUser.items.length > 0) &&
                            [
                                
                                <View styleName="horizontal" style={{
                                    padding:10 , 
                                    borderTopWidth: 1 , 
                                    borderTopColor:'#eee',
                                    borderBottomWidth: 1 , 
                                    borderBottomColor:'#eee'
                                }}>
                                    <Title>Post</Title>
                                </View>
                                ,
                                <FlatList
                                    removeClippedSubViews
                                    data={user.postsOfUser.items}
                                    keyExtractor={(item, index)=>item.id}
                                    renderItem={({item}) => {
                                        return <PreloadPostCard id={item.id} navigation={navigation} showAction={true} showActivityTab={true} />
                                    }}
                                    initialNumToRender={8}
                                    maxToRenderPerBatch={2}
                                    onEndReachedThreshold={0.5}
                                    onEndReached={()=>{
                                        // fetchMore({
                                        //     variables: {
                                        //         nextToken: data.listPosts.nextToken
                                        //     },
                                        //     updateQuery: (prev, { fetchMoreResult }) => {
                                        //         if (!fetchMoreResult) return prev;
                                        //         let concatArray = [...prev.listPosts.items , ...fetchMoreResult.listPosts.items];
                                        //         let uniqueValue = getUnique(concatArray , 'id');
                                        //         let newItems = Object.assign({}, prev, {
                                        //             listPosts: Object.assign({} , prev.listPosts , {
                                        //                 items: [...uniqueValue] ,
                                        //                 nextToken : fetchMoreResult.listPosts.nextToken
                                        //             }),
                                                    
                                        //         });
                                        //         // console.log(newItems.listPosts.items.map((item)=>item.id));
                                        //         return newItems;
                                        //     }
                                        // })
                                    }}
                                />
                                
                            ]
                        // }
                    ]
                }
            }
        </Query>
        <RBSheet
            ref={setSheetRef}
            height={100}
            duration={250}
            customStyles={{}}
            >
                <View style={{padding: 15}}>
                    <TouchableOpacity onPress={()=>{
                        if(onToggleBlock) { 
                            onToggleBlock();
                        }
                        if(onCloseSheet) {
                            onCloseSheet();
                        }
                    }}>
                        <View styleName="horizontal v-start" style={{padding: 5}}>
                            <EntypoIcon style={{fontSize: 20 ,color: '#C43835'}} name="block" />
                            <View styleName="vertical" style={{marginLeft: 5}}>
                                <Text style={{fontSize: 20}}>{(state.block)? 'Unblock' : 'Block'}</Text>
                                <Caption>
                                    {
                                        (state.block)
                                        ? 'UnBlock this user'
                                        : 'block this user'
                                    }
                                </Caption>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
        </RBSheet>
    </Screen>
)

export default UserDetailScreen;