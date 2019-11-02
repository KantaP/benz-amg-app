import React from 'react';
import sendBirdService from '../services/SendBirdService';
import ChatHistoriesScreen from '../components/ChatHistories';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { hasNotificationChat } from '../actions/notification';
class ChatHistoriesContainer extends React.Component {

    static navigationOptions = {
        header: null,
        // drawerLabel: 'Home',
    };

    state = {
        channelList: []
    }

    componentDidMount(){
        this.props.hasNotificationChat(false);
        this.getChannelList();
    }
    getChannelList = () => {
        sendBirdService.getListGroupChannel()
        .then((channelList) => {
            // console.log(channelList);
            let channelListWithOutBlocker = [...channelList];
            // console.log('list block' , this.props.listUserBlocks);
            this.props.listUserBlocks.forEach((item , index) => {
                channelListWithOutBlocker = channelListWithOutBlocker.filter((filterItem)=>{
                    return !filterItem.memberMap[item.blockUserId]
                })
            })
            this.props.listUserWhoBlockCurrentUser.forEach((item, index)=>{
                channelListWithOutBlocker = channelListWithOutBlocker.filter((filterItem)=>{
                    return !filterItem.memberMap[item.blockUserId]
                })
            })
            // console.log('channelist' ,channelListWithOutBlocker)
            this.setState({channelList: channelListWithOutBlocker});
        })
        .catch((error)=> {
            console.log(error);
            this.props.navigation.goBack();
        })
    }



    render() {
        return <ChatHistoriesScreen 
                    {...this.props} 
                    state={this.state} 
                    onCallback={this.getChannelList} 
                    onGetChannel={this.getChannelList}
                />;
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile,
    listUserBlocks: state.user.listUserBlocks,
    listUserWhoBlockCurrentUser: state.user.listUserWhoBlockCurrentUser
})

const mapDispatchToProps = (dispatch) => ({
    hasNotificationChat: (hasChat) => dispatch(hasNotificationChat(hasChat))
})

export default withNavigationFocus(connect(mapStateToProps , mapDispatchToProps)(ChatHistoriesContainer));