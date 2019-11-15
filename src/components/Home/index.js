import React from 'react';
import { 
    Screen ,
    View ,
    Image ,
    NavigationBar ,
    Button as BT ,
    Title ,
    Text
} from '@shoutem/ui';
import { FontAwesomeIcon , FeatherIcon }  from '../Icon';

import { iconStyle , navigatorBarStyle } from '../styles';
import { FlatList , Modal } from 'react-native';

// import PostCard from '../PostCard';
import PreloadPostCard from '../PreloadPostCard'

// import { withNavigation } from 'react-navigation';
// import Spinner from 'react-native-loading-spinner-overlay';
// import moment from 'moment';
import _ from 'lodash';
import { getUnique } from '../../containers/utils';
import { Query } from 'react-apollo';
import { onCreatePost , onCreatePostImage , onDeletePost } from '../../graphql/subscriptions';
import { itemsByPinCreated } from '../../graphql/queries';
import gql from 'graphql-tag';
import moment from 'moment';
import GreetingContainer from '../../containers/Greeting';
import WidthPreventDoubleClick from '../WithPreventDoubleClick';
import { PostPlaceHolder } from '../PostPlaceHolder';

const Button = WidthPreventDoubleClick(BT);

// const renderRow = (post) => (
//     <PreloadPostCard id={post.id} showAction={true} showActivityTab={true} />
// )

const HomeScreen = (
    {
        state  , 
        navigation , 
        onStateChange , 
        isFocused , 
        notification ,
        listUserBlocks,
        listUserWhoBlockCurrentUser,
        refetchPost ,
        doUpdate,
        userProfile
    }
) => {
    let queryVairables = {};
    queryVairables['pin'] = 'off';
    queryVairables['sortDirection'] = 'DESC';
    queryVairables['createdAt'] = {
        beginsWith: moment().format('YYYY')
    }
    queryVairables['limit'] = 5;
    let mixedBlock = [...listUserBlocks,...listUserWhoBlockCurrentUser]
    if(mixedBlock.length > 0) {
        queryVairables['filter'] = {
            and: mixedBlock.map((item)=>{
                return {
                    owner: {
                        ne: item.userId
                    }
                }
            })
        }
    }
    let nextToken = '';
    let loadMore = false;
    // console.log(queryVairables)
    // console.log(state.pinPost);
    return ( 
        <Screen>
             {/* <Spinner 
                visible={loading}
                textContent={'Loading...'}
                textStyle={{color: '#fff'}}
            /> */}
            <NavigationBar 
                style={navigatorBarStyle}
                styleName="inline"
                leftComponent={
                    <Button
                        onPress={()=>{
                            navigation.push('HomeSearch');
                        }}
                    >
                      <FontAwesomeIcon name="search" style={iconStyle} />
                    </Button>
                }
                centerComponent={
                    <View>
                        <Image resizeMode="contain" styleName="medium" source={require('../../assets/images/logo.png')}/>
                        {/* <Title style={Object.assign({} , navTitle , {color:'#fff'})}>
                            AMG
                        </Title> */}
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
            {
                state.showUpdate &&
                (
                    <View styleName="horizontal h-center v-center" style={{backgroundColor:'#191919' , padding: 5 , borderWidth: 0}}>
                        <Button styleName="clear" onPress={doUpdate}> 
                            <Text style={{color:'#fff'}}>A new update is available, click!</Text>
                        </Button>
                    </View>
                )
            }
            {
                (isFocused) &&
                (
                    <Query 
                        query={gql(itemsByPinCreated)} 
                        variables={queryVairables} 
                        fetchPolicy="network-only"
                    >
                    {
                        ({ subscribeToMore , fetchMore , refetch , data , ...result }) => {
                            
                            if(result.loading) return <View style={{padding: 10}}><PostPlaceHolder /></View>;
                            if(result.error) return new Error(result.error);
                            return (
                                <PostList
                                    data={[...state.pinPost , ...data.itemsByPinCreated.items]}
                                    navigation={navigation}
                                    refreshing={state.refreshing}
                                    refetch={()=>{
                                        refetchPost();
                                        refetch();
                                    }}
                                    loadMore={()=>{
                                        if(data.itemsByPinCreated.nextToken && !loadMore) {
                                            // nextToken = data.itemsByPinCreated.nextToken;
                                            // console.log('nextToken' , data.itemsByPinCreated.nextToken);
                                            loadMore = true;
                                            fetchMore({
                                                variables: {
                                                    nextToken: data.itemsByPinCreated.nextToken
                                                },
                                                updateQuery: (prev, { fetchMoreResult }) => {
                                                    if (!fetchMoreResult) return prev;
                                                    // if(nextToken === fetchMoreResult.itemsByPinCreated.nextToken) return prev;
                                                    let concatArray = [...prev.itemsByPinCreated.items , ...fetchMoreResult.itemsByPinCreated.items];
                                                    let uniqueValue = getUnique(concatArray , 'id');
                                                    let newItems = Object.assign({}, prev, {
                                                        itemsByPinCreated: Object.assign({} , prev.itemsByPinCreated , {
                                                            items: [...uniqueValue] ,
                                                            nextToken : fetchMoreResult.itemsByPinCreated.nextToken
                                                        }),
                                                        
                                                    });
                                                    loadMore = false;
                                                    // console.log(newItems.itemsByPinCreated.items.map((item)=>item.id));
                                                    return newItems;
                                                }
                                            })
                                        }   
                                        
                                    }}
                                    onCreatePostImageSubScribe={()=>
                                        subscribeToMore({
                                            document: gql(onCreatePostImage),
                                            variables: {
                                                owner: userProfile.id
                                            },
                                            updateQuery: (prev, { subscriptionData }) => {
                                                // loadMore = false
                                                console.log(subscriptionData);
                                                // console.log('subscription data create post' , subscriptionData)
                                                // if (!subscriptionData.data) return prev;
                                                // const newPostItem = subscriptionData.data.onCreatePostImage;
                                                // let post = prev.itemsByPinCreated.items.filter(item => {
                                                //     return item.id === newPostItem.id;
                                                // })[0]
                                                // post.image = newPostItem
                                                // return Object.assign({}, prev, {
                                                //     itemsByPinCreated: Object.assign({} , prev.itemsByPinCreated , {
                                                //         items: [newPostItem, ...prev.itemsByPinCreated.items]
                                                //     })
                                                // });
                                                return prev;
                                            }
                                        }) 
                                    }
                                    onCreatePostSubScribe={()=>
                                        subscribeToMore({
                                            document: gql(onCreatePost),
                                            variables: {
                                                owner: userProfile.id
                                            },
                                            updateQuery: (prev, { subscriptionData }) => {
                                                // loadMore = false
                                                // console.log('subscription data create post' , subscriptionData)
                                                if (!subscriptionData.data) return prev;
                                                const newPostItem = subscriptionData.data.onCreatePost;
                                                const idAlreadyExists =
                                                                        prev.itemsByPinCreated.items.filter(item => {
                                                                            return item.id === newPostItem.id;
                                                                        }).length > 0;
                                                if(idAlreadyExists) return prev;
                                                
                                                return Object.assign({}, prev, {
                                                    itemsByPinCreated: Object.assign({} , prev.itemsByPinCreated , {
                                                        items: [newPostItem, ...prev.itemsByPinCreated.items]
                                                    })
                                                });
                                            }
                                        }) 
                                    }
                                    onDeletePostSubScribe={()=>
                                        subscribeToMore({
                                            document: gql(onDeletePost),
                                            variables: {
                                                owner: userProfile.id
                                            },
                                            updateQuery: (prev, {subscriptionData})=>{
                                                // loadMore = false;
                                                if (!subscriptionData.data) return prev;
                                                const deletePostItem = subscriptionData.data.onDeletePost;
                                                // console.log('delete post')
                                                return Object.assign({}, prev, {
                                                    itemsByPinCreated: Object.assign({} , prev.itemsByPinCreated , {
                                                        items: prev.itemsByPinCreated.items.filter((item)=>item.id!==deletePostItem.id)
                                                    })
                                                });
                                            }
                                        })
                                    }
                                    footerComponent={()=>{
                                        if(loadMore) {
                                            return (
                                                <PostPlaceHolder />
                                            )
                                        }
                                        return null;
                                    }}
                                />
                            )
                        }
                    }
                    </Query>
                )
            }
            {
                (!isFocused) &&
                null
            }
            <Modal
            // presentationStyle="pageSheet"
            hardwareAccelerated
            animationType="slide"
            transparent
            visible={state.showGreeting}>
                <GreetingContainer callback={()=>{
                    onStateChange('showGreeting' , false);
                }} />
            </Modal>
        </Screen>
    )
}

class PostList extends React.Component {

    onCreatePostSubScribe = null;
    onDeletePostSubScribe = null;

    componentDidMount() {
        this.onCreatePostSubScribe = this.props.onCreatePostSubScribe();
        this.onDeletePostSubScribe = this.props.onDeletePostSubScribe();
    }

    componentWillUnmount() {
        this.onCreatePostSubScribe = null;
        this.onDeletePostSubScribe = null;
    }

    _keyExtractor = (item, index) => index;

    render() {

        return (<FlatList
            style={{marginTop: 10}}
            removeClippedSubViews
            data={this.props.data}
            keyExtractor={this._keyExtractor}
            renderItem={({item}) => {
                return <PreloadPostCard id={item.id} navigation={this.props.navigation} showAction={true} showActivityTab={true} />
            }}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={10}
            onEndReached={()=>{
                this.props.loadMore();
            }}
            refreshing={this.props.refreshing}
            onRefresh={()=>{ 
                this.props.refetch();
            }}
            ListFooterComponent={this.props.footerComponent}
        />)
    }
}

export default HomeScreen;