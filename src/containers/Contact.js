import React from 'react';
import ContactScreen from '../components/Contact';
import {Linking , Platform} from 'react-native'
import { onStateChange } from './utils';
import { API , graphqlOperation } from 'aws-amplify';
import { createFeedback } from '../graphql/mutations';
import { connect } from 'react-redux';
import moment from 'moment';
import toastRefService from '../services/ToastRefService';

class ContactContainer extends React.Component {
    static navigationOptions = { 
        header: null  ,
        // drawerLabel: 'Home',
    };

    state = {
        feedbackTopic: "" ,
        feedbackMessage: "" ,
        loading: false ,
        selectedType: "",
        types: [
            { title: "Please select type"},
            { title: "Rally" } ,
            { title: "Wine & Cigar Tasting" } ,
            { title: "Shopping & Fashion"} ,
            { title: "Traveling"} ,
            { title: "Cooking Class" } ,
            { title: "Movie"} ,
            { title: "Mercedes-AMG Site Visit Program in Affalterbach"} ,
            { title: "Other"} ,
        ]
    }

    sheetRef = null;
    feedbackSheetRef = null;

    setSheetRef = (ref) => {
        this.sheetRef = ref;
    }

    setFeedbackSheetRef = (ref) => {
        this.feedbackSheetRef = ref;
    }

    openFacebook = () => {
        Linking.openURL('https://www.facebook.com/AMGBrandCenterBangkok/');
        this.sheetRef.close();
    }

    openTwitter = () =>{
        Linking.openURL(`https://www.twitter.com/amgclubthailand`);
        this.sheetRef.close();
    }

    openIG = () => {
        Linking.openURL(`https://instagram.com/amgbrandcenter?igshid=arxxwwmlm3xw`);
        this.sheetRef.close();
    }

    onSubmit = async() => {
        await this.setState({loading: true});
        try {
            let variables = {
                input: {
                    topic: this.state.selectedType.title,
                    message: this.state.feedbackMessage,
                    feedbackUserId: this.props.userProfile.id,
                    createdAtUnix: moment().valueOf(),
                }
            }
            let result = await API.graphql(graphqlOperation(createFeedback ,variables));
            toastRefService.get().show('Send feedback success.');
            this.setState({loading: true});
            this.feedbackSheetRef.close();
        }catch(error) {
            console.log(error);
            toastRefService.get().show('Something went wrong.');
            this.setState({loading: false});
            this.feedbackSheetRef.close();
        }
    }

    actions = (type) =>{
        if(type === 'callcenter'){ 
            Linking.openURL(`tel:+66812345678`);
        }
        if(type === 'address') {
            // go to address link
            const lat = 13.7364735;
            const lng = 100.6376782;
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${lat},${lng}`;
            const label = 'Benz TTC Motor';
            const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            });
            Linking.openURL(url);
        }
        if(type === 'social') {
           if(this.sheetRef) {
               this.sheetRef.open();
           }
        }

        if(type === 'feedback') {
            if(this.feedbackSheetRef){
                this.feedbackSheetRef.open();
            }
        }
    }

    render() {
        return <ContactScreen
                 {...this.props} 
                 actions={this.actions} 
                 setSheetRef={this.setSheetRef}  
                 state={this.state} 
                 openFacebook={this.openFacebook} 
                 openTwitter={this.openTwitter} 
                 setFeedbackSheetRef={this.setFeedbackSheetRef}
                 onSubmit={this.onSubmit}
                 onStateChange={onStateChange.bind(this)}
                 openIG={this.openIG}
                />;
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile
})

export default connect(mapStateToProps)(ContactContainer);