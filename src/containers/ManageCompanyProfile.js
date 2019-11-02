import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { createCompany , updateCompany } from '../graphql/mutations';
import imageService from '../services/ImageService';
import toastRefService from '../services/ToastRefService';
import ManageCompanyProfileScreen from '../components/ManageCompanyProfile';
import gql from 'graphql-tag';
import uuidv4 from 'uuid/v4';
import config from '../aws-exports';
import { setUserProfile } from '../actions/user';
// import { Image } from 'react-native';

class ManageCompanyProfileContainer extends React.Component {

    static navigationOptions = { 
        header: null  ,
        // drawerLabel: 'Home',
    };

    state = {
        actions: {} ,
        loading: false ,
        companyProfile: (this.props.userProfile.companies.items.length > 0) 
                            ?{...this.props.userProfile.companies.items[0]}
                            :{
                                id: '',
                                name: '',
                                address: '',
                                latlng: '',
                                website: '',
                                phone: '',
                                email: '',
                                image: '',
                                description: '',
                                logo: ''
                            }
    }

    updateKey = [
        "address" ,
        "name",
        "description",
        "latlng",
        "website",
        "phone",
        "email",
        "image",
        "logo"
    ]


    componentDidMount() {
        // console.log(this.state.companyProfile);
        this.setState((state)=>{
            state.actions.onImagePicker = () => imageService.onImagePicker(this.callbackImagePicker);
            state.actions.onLogoPicker = () => imageService.onImagePicker(this.callbackLogoPicker);
            return state;
        })
    }

    callbackImagePicker = (result) => {
        if (!result.cancelled) {
            this.setState((state)=>{
                state.companyProfile.image = result.uri
                return state;
            })
        }
    }

    callbackLogoPicker = (result) => {
        if (!result.cancelled) {
            this.setState((state)=>{
                state.companyProfile.logo = result.uri
                return state;
            })
        }
    }

    onProfileChange = (key , text ) => {
        this.setState((state)=>{
            state.companyProfile[key] = text;
            return state
        })
    }

    onUpdateCompany = async() => {
        await this.setState({loading: true});
        const { companyProfile } = this.state;
        let body = {
            id: companyProfile.id,
            companyUserId: this.props.userProfile.id
        }
        Object.keys(companyProfile).forEach((key)=>{
            if(companyProfile[key] && this.updateKey.includes(key)) {
                body[key] = companyProfile[key];
            }
        })
        // console.log('props image ' , this.props.userProfile.image)
        // console.log('state image ', this.state.userProfile.image)
        if(this.state.companyProfile.image.includes('file://')) {
            // upload image to s3
            try {
                let result = await imageService.blobUploadImage(this.state.companyProfile.image);
                body.image = `https://${config.aws_user_files_s3_bucket}.s3-${config.aws_user_files_s3_bucket_region}.amazonaws.com/public/${result.key}`
            }
            catch(error) {
                console.log(error);
                toastRefService.get().show(error.message);
                return false;
            }
        }

        if(this.state.companyProfile.logo.includes('file://')) {
            try {
                let result = await imageService.blobUploadImage(this.state.companyProfile.logo);
                body.logo = `https://${config.aws_user_files_s3_bucket}.s3-${config.aws_user_files_s3_bucket_region}.amazonaws.com/public/${result.key}`
            }
            catch(error) {
                console.log(error);
                toastRefService.get().show(error.message);
                return false;
            }
        }

        let result = {};

        try {
            if(!body.id) {
                body.id = uuidv4();
                // console.log(body);
                let createResult = await this.props.createCompany(body);
                result = createResult.data.createCompany;
            } else {
                // console.log('update body' , body)
                let updateResult = await this.props.updateCompany(body);
                // console.log(updateResult);
                result = updateResult.data.updateCompany
            }
            // console.log(result);
            let newUserProfile = {...this.props.userProfile};
            newUserProfile.companies.items = [result];
            this.props.setUserProfile(newUserProfile)
            toastRefService.get().show('Update company success.');
            this.setState({loading: false});
        }catch(error){
            console.log(error);
            toastRefService.get().show('Something went wrong.');
            this.setState({loading: false});
        }
    }

    render() {
        return <ManageCompanyProfileScreen 
                    {...this.props} 
                    {...this.state.actions}
                    state={this.state}
                    onStateChange={this.onProfileChange}
                    companyProfile={this.state.companyProfile} 
                    onUpdateCompany={this.onUpdateCompany}
                />;
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile ,
    forms: state.forms
})

const mapDispatchToProps = (dispatch) => ({
    setUserProfile: (userProfile) => dispatch(setUserProfile(userProfile)),
})

const withConnect = connect(mapStateToProps , mapDispatchToProps)(ManageCompanyProfileContainer);

const withCreateCompany = graphql(gql(createCompany), {
    props: props => ({
        createCompany: companyItem => {
            return props.mutate({
                variables: { input: companyItem }
            })
        }
    })
})(withConnect)

const withUpdateCompany = graphql(gql(updateCompany), {
    props: props => ({
        updateCompany: companyItem => {
            return props.mutate({
                variables: { input: companyItem }
            })
        }
    })
})(withCreateCompany)

export default withUpdateCompany;