import React from 'react';
import TermScreen from '../components/Term';

class TermContainer extends React.Component {
    static navigationOptions = { header: null };
    render() {
        return <TermScreen {...this.props} />;
    }
}

export default TermContainer;