import React from 'react';
import {
    Screen,
    View,
    NavigationBar,
    Button,
    TextInput,
    Image,
    TouchableOpacity,
    Title,
    Caption
} from '@shoutem/ui';

import { FlatList } from 'react-native';
import { FontAwesomeIcon, EntypoIcon } from '../Icon';
import { navigatorBarStyle, navTitle } from '../styles';

import { Query } from 'react-apollo';
import { listUserBlocks } from '../../graphql/queries';
import gql from 'graphql-tag';

import { withNavigationFocus } from 'react-navigation';
import { getUnique } from '../../containers/utils';

import { deleteUserBlock } from '../../graphql/mutations';
import { graphql } from 'react-apollo';
import alertService from '../../services/AlertService';

let loadMore = false


const BlockScreen = ({ navigation, userProfile, deleteUserBlock, isFocused , setListUserBlocks , listUserBlocksData }) => (
    <Screen style={{ backgroundColor: '#fff' }}>
        <NavigationBar
            hasHistory={true}
            leftComponent={
                <Button styleName="clear" onPress={() => {
                    navigation.goBack();
                }}>
                    <FontAwesomeIcon name="angle-left" style={{ color: '#fff' }} />
                </Button>
            }
            centerComponent={
                <Title style={Object.assign({}, navTitle, { color: '#fff' })} numOfLines={1}>
                    Block
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        {
            (isFocused) &&
            (
                <Query fetchPolicy="network-only" query={gql(listUserBlocks)} variables={{ filter: { userId: { eq: userProfile.id } } }}>
                    {
                        ({ data, loading, error, fetchMore }) => {
                            if (loading) return null;
                            if (data.listUserBlocks.items.length === 0) {
                                return (
                                    <View styleName="vertical v-center h-center" style={{ flex: 1 }}>
                                        <Title style={{ color: '#ccc', fontWeight: 'bold' }}>No Block</Title>
                                        <Caption style={{ color: '#ccc' }}>This page will show data after you have blocked user</Caption>
                                    </View>
                                )
                            }
                            return (
                                <FlatList
                                    removeClippedSubViews
                                    data={data.listUserBlocks.items}
                                    keyExtractor={(item, index) => item.id}
                                    renderItem={({ item }) => {
                                        return <UserItemWithDeleteUserBlock blockId={item.id} user={item.blockUser} userProfile={userProfile} navigation={navigation} setListUserBlocks={setListUserBlocks} listUserBlocksData={listUserBlocksData} />
                                    }}
                                    initialNumToRender={8}
                                    maxToRenderPerBatch={2}
                                    onEndReachedThreshold={0.5}
                                    onEndReached={() => {
                                        if (data.listUserBlocks.nextToken && !loadMore) {
                                            loadMore = true;
                                            fetchMore({
                                                variables: {
                                                    nextToken: data.listUserBlocks.nextToken
                                                },
                                                updateQuery: (prev, { fetchMoreResult }) => {
                                                    if (!fetchMoreResult) return prev;
                                                    let concatArray = [...prev.listUserBlocks.items, ...fetchMoreResult.listUserBlocks.items];
                                                    let uniqueValue = getUnique(concatArray, 'id');
                                                    let newItems = Object.assign({}, prev, {
                                                        listUserBlocks: Object.assign({}, prev.listUserBlocks, {
                                                            items: [...uniqueValue],
                                                            nextToken: fetchMoreResult.listUserBlocks.nextToken
                                                        }),

                                                    });
                                                    loadMore = false;
                                                    // console.log(newItems.listPosts.items.map((item)=>item.id));
                                                    return newItems;
                                                }
                                            })
                                        }

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
            <TouchableOpacity onPress={() => { }}>
                <View styleName="horizontal v-center space-between" style={{ padding: 10, backgroundColor: '#fff' }}>
                    <View styleName="horizontal v-center">
                        <Image
                            // styleName="small-avatar"
                            style={{ width: 64, height: 64, borderRadius: 32 }}
                            source={
                                (this.props.user.image)
                                    ? { uri: this.props.user.image }
                                    : require('../../assets/images/user-blank.jpg')
                            }
                        />
                        <View styleName="vertical" style={{ marginLeft: 15 }}>
                            <Title>{this.props.user.firstName} {this.props.user.lastName}</Title>
                            <View style={{ marginTop: -7 }}>
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
                    <Button styleName="clear" onPress={() => {
                        if (this.props.deleteUserBlock) {
                            // console.log('blcokid' , this.props.blockId);
                            alertService.alert({
                                content: "Do you want to unblock this user?",
                                buttons: [
                                    {
                                        text: 'Unblock',
                                        onPress: () => {
                                            this.props.deleteUserBlock({ id: this.props.blockId });
                                            this.props.navigation.goBack();
                                        }
                                    },
                                    {
                                        text: "Cancel",
                                        onPress: () => { }
                                    }
                                ]
                            })

                        }
                    }}>
                        <EntypoIcon style={{ fontSize: 18, color: '#C43835' }} name="block" />
                    </Button>
                </View>
            </TouchableOpacity>
        )
    }
}

const UserItemWithDeleteUserBlock = graphql(gql(deleteUserBlock), {
    props: props => ({
        deleteUserBlock: blockItem => {
            return props.mutate({
                variables: { input: blockItem }
            })
        }
    }),
    options: props => ({
        update: (proxy, { data: { deleteUserBlock } }) => {
            // console.log('delete user blcok id', deleteUserBlock)
            // let data = proxy.readQuery({ query: gql(listUserBlocks), variables: { filter: { userId: { eq: props.userProfile.id } } } });
            // console.log('data', data)
            // let filterItem = data.listUserBlocks.items.filter((item) => item.blockUser.id !== deleteUserBlock.blockUser.id);
            // data = Object.assign({}, data.listUserBlocks, {
            //     listUserBlocks: Object.assign({}, data.listUserBlocks.items, {
            //         items: [...filterItem]
            //     })
            // })
            let removeBlockUserId = props.listUserBlocksData.filter((item)=>{
                // console.log(item);
                // console.log(item.userId , deleteUserBlock.blockUser.id);
                return item.blockUserId !== deleteUserBlock.blockUser.id
            });
            // console.log('remove' , removeBlockUserId)
             props.setListUserBlocks(removeBlockUserId);
            // proxy.writeQuery({
            //     query: gql(listUserBlocks),
            //     variables: {
            //         filter: {
            //             userId: {
            //                 eq: props.userProfile.id
            //             }
            //         }
            //     }, 
            //     data: {
            //         listUserBlocks: data
            //     }
            // });
            // console.log('data after remove' , data)
           
        },
    }),
})(UserItem);

export default withNavigationFocus(BlockScreen);