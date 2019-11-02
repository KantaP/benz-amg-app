import React from 'react';
import {
    Screen ,
    View , 
    NavigationBar ,
    Button ,
    TextInput ,
    Image ,
    TouchableOpacity,
    Title ,
    Caption
} from '@shoutem/ui' ; 

import { FlatList } from 'react-native';
import { FontAwesomeIcon , EntypoIcon}  from '../Icon';
import { navigatorBarStyle , navTitle } from '../styles';

import { Query } from 'react-apollo';
import { listUserBlocks } from '../../graphql/queries';
import gql from 'graphql-tag';

import { withNavigationFocus } from 'react-navigation';
import { getUnique } from '../../containers/utils';

import { deleteUserBlock } from '../../graphql/mutations';
import { graphql } from 'react-apollo';


const BlockScreen = ({navigation , userProfile , deleteUserBlock  , isFocused}) => (
    <Screen style={{backgroundColor: '#fff'}}>
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
                <Title style={Object.assign({} , navTitle , {color:'#fff'})} numOfLines={1}>
                    Block
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        {
            (isFocused) &&
            (
                <Query fetchPolicy="network-only" query={gql(listUserBlocks)} variables={{filter:{userId:{eq:userProfile.id}}}}>
                {
                    ({data , loading , error , fetchMore}) => {
                        if(loading) return null;
                        return (
                            <FlatList
                                removeClippedSubViews
                                data={data.listUserBlocks.items}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({item}) => {
                                    return <UserItemWithDeleteUserBlock blockId={item.id} user={item.blockUser} userProfile={userProfile} navigation={navigation} />
                                }}
                                initialNumToRender={8}
                                maxToRenderPerBatch={2}
                                onEndReachedThreshold={0.5}
                                onEndReached={()=>{
                                    fetchMore({
                                        variables: {
                                            nextToken: data.listUserBlocks.nextToken
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            if (!fetchMoreResult) return prev;
                                            let concatArray = [...prev.listUserBlocks.items , ...fetchMoreResult.listUserBlocks.items];
                                            let uniqueValue = getUnique(concatArray , 'id');
                                            let newItems = Object.assign({}, prev, {
                                                listUserBlocks: Object.assign({} , prev.listUserBlocks , {
                                                    items: [...uniqueValue] ,
                                                    nextToken : fetchMoreResult.listUserBlocks.nextToken
                                                }),
                                                
                                            });
                                            // console.log(newItems.listPosts.items.map((item)=>item.id));
                                            return newItems;
                                        }
                                    })
                                }}
                            />
                        )
                    }
                } 
                </Query>
            )
        }
        
    </Screen>
);

class UserItem extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={()=>{}}>
                <View styleName="horizontal v-center space-between" style={{padding: 10 , backgroundColor: '#fff'}}>
                    <View styleName="horizontal v-center">
                        <Image 
                            // styleName="small-avatar"
                            style={{width: 64, height: 64 , borderRadius: 32}}
                            source={
                                (this.props.user.image) 
                                ? { uri: this.props.user.image } 
                                : require('../../assets/images/user-blank.jpg')
                            }
                        />
                        <View styleName="vertical" style={{marginLeft : 15}}>
                            <Title>{this.props.user.firstName} {this.props.user.lastName}</Title>
                            <View style={{marginTop:-7}}>
                                <Caption>
                                    {
                                        (this.props.user.district && this.props.user.province) 
                                        ? `${this.props.user.district} , ${this.props.user.province}`
                                        : (this.props.user.district && !this.props.user.province) 
                                            ? `${this.props.user.district}`
                                            : (!this.props.user.district && this.props.user.province) 
                                                ? `${this.props.user.province}`
                                                : ``
                                    }
                                </Caption>
                            </View>
                        </View>
                    </View>
                    <Button styleName="clear" onPress={()=>{
                        if(this.props.deleteUserBlock) {
                            // console.log('blcokid' , this.props.blockId);
                            this.props.deleteUserBlock({id: this.props.blockId});
                            this.props.navigation.goBack();
                        }
                    }}>
                        <EntypoIcon style={{fontSize: 18 ,color: '#C43835'}} name="block" />
                    </Button>
                </View>
            </TouchableOpacity>
        )
    }
}

const UserItemWithDeleteUserBlock = graphql(gql(deleteUserBlock) , {
    props: props => ({
        deleteUserBlock: blockItem => {
            return props.mutate({
                variables: {input: blockItem}
            })
        }
    }),
    // options: props => ({
    //     update: (proxy, { data: { deleteUserBlock } }) => {
    //       console.log('delete user blcok id' , deleteUserBlock)
    //       let data = proxy.readQuery({ query: gql(listUserBlocks) , variables: {filter:{userId:{eq:props.userProfile.id}}} });
    //       let filterItem =  data.listUserBlocks.items.filter((item)=>item.id !== deleteUserBlock.id);
    //       data = Object.assign({},data.listUserBlocks, {
    //         listUserBlocks: Object.assign({} , data.listUserBlocks.items , {
    //             items: [...filterItem]
    //         })
    //       })
    //       proxy.writeQuery({ query: gql(listUserBlocks) , variables: {filter:{userId:{eq:props.userProfile.id}}} , data });
    //     },
    // }),
})(UserItem);

export default withNavigationFocus(BlockScreen);