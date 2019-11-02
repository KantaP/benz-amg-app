import React from 'react';
import { 
    Screen ,
    View ,
    Image ,
    NavigationBar ,
    Button ,
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
import { listPosts , itemsByPostType } from '../../graphql/queries';
import gql from 'graphql-tag';
import moment from 'moment';
import GreetingContainer from '../../containers/Greeting';

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
        listUserWhoBlockCurrentUser
    }
) => {
    let queryVairables = {};
    queryVairables['type'] = 'Post';
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
                (isFocused) &&
                (
                    <Query 
                        query={gql(itemsByPostType)} 
                        variables={queryVairables} 
                        fetchPolicy="network-only"
                    >
                    {
                        ({ subscribeToMore , fetchMore , refetch , data , ...result }) => {
                            
                            if(result.loading) return null;
                            if(result.error) return new Error(result.error);
                            return (
                                <PostList
                                    data={[...state.pinPost , ...data.itemsByPostType.items]}
                                    navigation={navigation}
                                    refreshing={state.refreshing}
                                    refetch={()=>{
                                        refetch();
                                    }}
                                    loadMore={()=>{
                                        // console.log('nextToken' , data.itemsByPostType.nextToken);
                                        fetchMore({
                                            variables: {
                                                nextToken: data.itemsByPostType.nextToken
                                            },
                                            updateQuery: (prev, { fetchMoreResult }) => {
                                                if (!fetchMoreResult) return prev;
                                                let concatArray = [...prev.itemsByPostType.items , ...fetchMoreResult.itemsByPostType.items];
                                                let uniqueValue = getUnique(concatArray , 'id');
                                                let newItems = Object.assign({}, prev, {
                                                    itemsByPostType: Object.assign({} , prev.itemsByPostType , {
                                                        items: [...uniqueValue] ,
                                                        nextToken : fetchMoreResult.itemsByPostType.nextToken
                                                    }),
                                                    
                                                });
                                                // console.log(newItems.listPosts.items.map((item)=>item.id));
                                                return newItems;
                                            }
                                        })
                                    }}
                                    onCreatePostSubScribe={()=>
                                        subscribeToMore({
                                            document: gql(onCreatePost),
                                            updateQuery: (prev, { subscriptionData }) => {
                                                if (!subscriptionData.data) return prev;
                                                const newPostItem = subscriptionData.data.onCreatePost;
                                                const idAlreadyExists =
                                                                        prev.itemsByPostType.items.filter(item => {
                                                                            return item.id === newPostItem.id;
                                                                        }).length > 0;
                                                if(idAlreadyExists) return prev;
                    
                                                return Object.assign({}, prev, {
                                                    listPosts: Object.assign({} , prev.itemsByPostType , {
                                                        items: [newPostItem, ...prev.itemsByPostType.items]
                                                    })
                                                });
                                            }
                                        }) 
                                    }
                                    onDeletePostSubScribe={()=>
                                        subscribeToMore({
                                            document: gql(onDeletePost),
                                            updateQuery: (prev, {subscriptionData})=>{
                                                if (!subscriptionData.data) return prev;
                                                const deletePostItem = subscriptionData.data.onDeletePost;
                                                console.log('delete post')
                                                return Object.assign({}, prev, {
                                                    listPosts: Object.assign({} , prev.listPosts , {
                                                        items: prev.listPosts.items.filter((item)=>item.id!==deletePostItem.id)
                                                    })
                                                });
                                            }
                                        })
                                    }
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
        this.onCreatePostSubScribe();
        this.onDeletePostSubScribe();
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
            maxToRenderPerBatch={2}
            onEndReachedThreshold={0.5}
            onEndReached={()=>{
                this.props.loadMore();
            }}
            refreshing={this.props.refreshing}
            onRefresh={()=>{ 
                this.props.refetch();
            }}
        />)
    }
}

export default HomeScreen;