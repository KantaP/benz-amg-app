import React from 'react';
import { WebView } from 'react-native-webview';
import {
    Text,
    Linking
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
class RegisterContainer extends React.Component  {
    componentDidMount() {
        // const site = 'https://app.amgclubthailand.com/signup';
        // Linking.openURL(site);
    }
    render() {
        const site = 'https://app.amgclubthailand.com/signup';
        return <WebView 
                    source={{ uri: site }} 
                    style={{ marginTop: 20 , flex: 1 }} 
                    onError={syntheticEvent => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                    }}
                    startInLoadingState={true} 
                    scalesPageToFit={true}
                    renderLoading={() => <Spinner />}
                    renderError={errorName => <Text>{errorName}</Text>}
                />;
    }
}

export default RegisterContainer;