import React from 'react';
// import { deleteUserBlock } from '../graphql/mutations';
// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { setListUserBlocks } from '../actions/user';
import BlockScreen from '../components/Block';

class BlockContainer extends React.Component {
    static navigationOptions = { 
        header: null  ,
        // drawerLabel: 'Home',
    };
    render() {
        return <BlockScreen {...this.props} />;
    }
}

const mapStateToProps = (state) => ({
    listUserBlocksData: state.user.listUserBlocks,
    userProfile: state.user.userProfile ,
})

const mapDispatchToProps = (dispatch) => ({
    setListUserBlocks: (listUserBlocks) => dispatch(setListUserBlocks(listUserBlocks)),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)(BlockContainer);




export default withConnect;