import React from 'react';
import DirectoryScreen from '../components/Directory'
import { connect } from 'react-redux';

class DirectoryContainer extends React.Component {
    static navigationOptions = { header: null };
    render() {
        return <DirectoryScreen {...this.props} />;
    }
}

const mapStateToProps = (state) => ({
    notification : state.notification,
})

export default connect(mapStateToProps)(DirectoryContainer);
