import React from 'react';
import CompanyDetailScreen from '../components/CompanyDetail';
import { Linking , Platform } from 'react-native';

class CompanyDetailContainer extends React.Component {

    static navigationOptions = { 
        header: null  ,
    };

    onPressEmail = () => {
        let companyProfile = this.props.navigation.getParam('companyProfile' , {});
        if(companyProfile.email) {
            let emailLink = `mailto:${companyProfile.email}`
            Linking.openURL(emailLink);
        }
    }

    onPressCall = () => {
        let companyProfile = this.props.navigation.getParam('companyProfile' , {});
        if(companyProfile.phone) {
            Linking.openURL(`tel:${companyProfile.phone}`);
        }
    }

    render() {
        let companyProfile = this.props.navigation.getParam('companyProfile' , {});
        if(!companyProfile) this.props.navigation.goBack();

        return <CompanyDetailScreen 
                {...this.props} 
                companyProfile={companyProfile} 
                onPressEmail={this.onPressEmail}
                onPressCall={this.onPressCall}
                />;
    }
}

export default CompanyDetailContainer;