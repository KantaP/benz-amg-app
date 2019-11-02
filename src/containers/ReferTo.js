import React from 'react';
import ReferToScreen from '../components/ReferTo';
import { graphql } from 'react-apollo';
import { createPostReferSecond , updatePost } from '../graphql/mutations';
import { getPost } from '../graphql/queries';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import ToastRefService from '../services/ToastRefService';

class ReferToContainer extends React.Component {
    static navigationOptions = { header: null };
    state = {
        search: '' ,
        selectedUsers: []
    }
    
    selectUser = (userId) => {
        if(this.state.selectedUsers.filter((item)=>item===userId).length > 0) {
            this.setState({selectedUsers: this.state.selectedUsers.filter((item)=>item!==userId)})
        } else {
            this.setState({selectedUsers: [...this.state.selectedUsers , userId]})
        }
    }



    render() {
        let owner = this.props.navigation.getParam('ownerPost' , 'null');
        let listUsers = this.props.listUsers.filter((item)=>(item.id !== this.props.userProfile.id) && (item.id !== owner) );
        return <ReferToScreen {...this.props} listUsers={listUsers} state={this.state} onSelectUser={this.selectUser} /> ;
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile,
    listUsers : state.user.listUsers
})

const withConnect = connect(mapStateToProps)(ReferToContainer);

const withCreateRefer = graphql(gql(createPostReferSecond), {
    props: props => ({
        onAddRefer: refer => {
            // console.log('refer item' , refer)
            props.mutate({
                variables: { input : refer }
            })
            .then((result)=>{
                ToastRefService.get().show('Refer success.');
                // console.log('result of create refer' , result)
            })
            .catch((error)=>{
                console.log('create refer error ' , error);
                ToastRefService.get().show('Something went wrong.');
            })
        }
    })
})(withConnect);

const WithUpdatePost = graphql(gql(updatePost) , {
    props: props => ({
        updatePost: updateItem => {
            props.mutate({
                variables: { input : updateItem }
            })
        }
    })
})(withCreateRefer)

export default WithUpdatePost;