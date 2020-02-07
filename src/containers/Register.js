import React from 'react';
import { WebView } from 'react-native-webview';
import {
    Text,
    Dimensions
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
class RegisterContainer extends React.Component  {
    componentDidMount() {
        // const site = 'https://app.amgclubthailand.com/signup';
        // Linking.openURL(site);
        console.log(this.webview);
    }
    render() {
        const { height , width } = Dimensions.get('window');
        const style = {
            webview: {
                flex: 1,
                backgroundColor: 'yellow',
                width: width,
                height: height
            }
        }
        const site = 'https://app.amgclubthailand.com/signup';
        return <WebView
                    useWebKit 
                    allowUniversalAccessFromFileURLs 
                    mixedContentMode = "always" 
                    originWhitelist = {['*']} 
                    ref={ref => (this.webview = ref)}
                    domStorageEnabled={ true }
                    javaScriptEnabled={ true }
                    source={{ uri: site }} 
                    style={style.webview} 
                    startInLoadingState={true} 
                />;
    }
}

export default RegisterContainer;