import React from 'react';
// import { deleteUserBlock } from '../graphql/mutations';
// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';
import { connect } from 'react-redux';

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
    userProfile: state.user.userProfile ,
})

const withConnect = connect(mapStateToProps)(BlockContainer);




export default withConnect;