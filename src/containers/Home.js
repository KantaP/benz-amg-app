import React from 'react';
import HomeScreen from '../components/Home';
import { onStateChange } from './utils';
// import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { API , graphqlOperation } from 'aws-amplify';
import { itemsByPostType , itemsByPin } from '../graphql/queries';
import moment from 'moment';
import { Updates } from 'expo';

class HomeContainer extends React.Component {
    static navigationOptions = { 
        header: null  ,
        // drawerLabel: 'Home',
    };

    state = {
        loading: false,
        posts: [] ,
        readyToQuery: false ,
        refreshing: false,
        showGreeting: false,
        showError: false ,
        pinPost: [] ,
        showUpdate: false
    }

    componentDidMount() {
        // console.log(this.props.firstTime.greetingPost);
        this.setState({readyToQuery: true});
        if(!this.props.userProfile.firstLogin || this.props.userProfile.firstLogin === null) {
            this.setState({showGreeting: true})
        }
        this.fetchPost();
        // setInterval(()=>{
        //     Updates.checkForUpdateAsync().then(async update => {
        //         if (update.isAvailable) {
        //             await Updates.fetchUpdateAsync();
        //             // ... notify user of update ...
        //             Updates.reloadFromCache();
        //         }
        //     });
        // }, 300000)
    }

    doUpdate = () => {
        Updates.reload();
    }

    fetchPost = async() => {
        try {
            let mixedBlock = [...this.props.listUserBlocks,...this.props.listUserWhoBlockCurrentUser];
            let filter = {}
            if(mixedBlock.length > 0) { 
                filter = {
                    and: mixedBlock.map((item)=>{
                        return {
                            owner: {
                                ne: item.userId
                            }
                        }
                    })
                }
            }
            let pinPost = await API.graphql(graphqlOperation(itemsByPin, {
                pin: 'on',
                expireAt: {
                    ge: moment().format()
                },
                limit: 5,
                sortDirection: 'DESC'
            }));
            // let userPost = await API.graphql(graphqlOperation(itemsByPostType, {
            //     type: 'Post',
            //     createdAt: {
            //         beginsWith: moment().format('YYYY')
            //     },
            //     filter: filter
            // }))
            this.setState({pinPost: pinPost.data.itemsByPin.items});
            // console.log('pin post' , pinPost.data.itemsByPin.items.length);
            // console.log('user post' , userPost.data.itemsByPostType.items.length);
        }catch(error) {
            console.log(error);
        }
    }

    componentWillReceiveProps(nextProps) {
        // if(this.props.firstTime.greetingPost !== nextProps.firstTime.greetingPost) {
        //     this.setState({showGreeting: !this.state.showGreeting});
        // }
    }

    render() {
        // console.log(this.props.data)
        // console.log(this.state)
        // console.log('home render')
        return(
            <HomeScreen 
            {...this.props} 
            state={this.state} 
            onStateChange={onStateChange.bind(this)} 
            refetchPost={this.fetchPost} 
            doUpdate={this.doUpdate}
            userProfile={this.props.userProfile}
            />
        ) 
    }
}

const mapStateToProps = (state) => ({
    firstTime: state.firstTime,
    notification: state.notification,
    userProfile: state.user.userProfile ,
    listUserBlocks: state.user.listUserBlocks,
    listUserWhoBlockCurrentUser: state.user.listUserWhoBlockCurrentUser
})


export default connect(mapStateToProps)(withNavigationFocus(HomeContainer));