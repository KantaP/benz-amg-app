import React from 'react';
import UserDetailScreen from '../components/UserDetail';
import { createUserBlock , deleteUserBlock } from '../graphql/mutations';
import { listUserBlocks } from '../graphql/queries';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import {API, graphqlOperation} from 'aws-amplify';
import toastRefService from '../services/ToastRefService';
import { setListUserBlocks } from '../actions/user';

class UserDetailContainer extends React.Component {
    static navigationOptions = { header: null };

    state = {
        block: false,
        blockId: ''
    }

    sheetRef = null;

    setSheetRef = (ref) => {
        this.sheetRef = ref;
    }

    async componentWillMount() {
        let user = this.props.navigation.getParam('user' , {})
        let variables = {
            filter: {
                blockUserId: {
                    eq: user.id
                }
            },
            limit: 1
        }
        let response = await API.graphql(graphqlOperation(listUserBlocks,variables));
        // console.log('list user block' , response);
        if(response.data.listUserBlocks.items.length > 0) {
            this.setState({block: true , blockId: response.data.listUserBlocks.items[0].id})
        }
    }

    onOpenSheet = () => {
        this.sheetRef.open();
    }

    onCloseSheet = () => {
        this.sheetRef.close();
    }

    onToggleBlock = () => {
        let user = this.props.navigation.getParam('user' , {})
        if(this.state.block) {
            this.props.deleteUserBlock({id: this.state.blockId})
            .then((result)=>{
                console.log('before remove'  , this.props.listUserBlocks);
                let removeBlockUserId = this.props.listUserBlocks.filter((item)=>item.id !== this.state.blockId);
                this.props.setListUserBlocks(removeBlockUserId);
                this.setState({block: false , blockId: ''});
                toastRefService.get().show('Unblock user.');
            })
            .catch((error)=>{
                throw new Error(error);
            })
        } else {
            let body = {
                id: uuidv4(),
                userId: this.props.userProfile.id,
                blockUserId: user.id,
                createdAtUnix: moment(),
                userBlockBlockUserId: user.id
            }
            this.props.createUserBlock(body)
            .then((result)=>{
                this.setState({block: true , blockId: body.id});
                let addNewBlock = [result.data.createUserBlock , ...this.props.listUserBlocks];
                this.props.setListUserBlocks(addNewBlock);
                toastRefService.get().show('Blocked user.');
            })
            .catch((error)=>{
                throw new Error(error);
            })
        }
        
    }
    
    render() {
        let user = this.props.navigation.getParam('user' , {})
        return <UserDetailScreen 
                {...this.props} 
                state={this.state}
                userSelected={user} 
                onToggleBlock={this.onToggleBlock}
                setSheetRef={this.setSheetRef}
                onOpenSheet={this.onOpenSheet}
                onCloseSheet={this.onCloseSheet}
                />;
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile,
    listUserBlocks: state.user.listUserBlocks
})

const mapDispatchToProps = (dispatch) => ({
    setListUserBlocks: (listUsers) => dispatch(setListUserBlocks(listUsers)) 
})

const withConnect = connect(mapStateToProps , mapDispatchToProps)(UserDetailContainer);

const withCreateUserBlock = graphql(gql(createUserBlock) , {
    props: props => ({
        createUserBlock: blockItem => {
            return props.mutate({
                variables: {input: blockItem}
            })
        }
    })
})(withConnect);

const withDeleteUserBlock = graphql(gql(deleteUserBlock) , {
    props: props => ({
        deleteUserBlock: blockItem => {
            return props.mutate({
                variables: {input: blockItem}
            })
        }
    })
})(withCreateUserBlock);

export default withDeleteUserBlock;