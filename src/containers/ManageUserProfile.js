import React from 'react';
import { connect } from 'react-redux';
import ManageUserProfileScreen from '../components/ManageUserProfile';
import imageService from '../services/ImageService';
import moment from 'moment';
import { updateUser  } from '../graphql/mutations';
import { graphql } from 'react-apollo';
import toastRefService from '../services/ToastRefService';
import gql from 'graphql-tag';
import config from '../aws-exports';
import { setUserProfile } from '../actions/user';
import sendBirdService from '../services/SendBirdService';
import { onStateChange } from './utils';

class ManageUserProfileContainer extends React.Component {
    static navigationOptions = { 
        header: null  ,
        // drawerLabel: 'Home',
    };

    updateKey = [
        "address" ,
        "firstName",
        "lastName",
        "birthDate",
        "subDistrict",
        "district",
        "province",
        "mobilePhone",
    ]

    state = {
        userProfile: {...this.props.userProfile} ,
        actions: {} ,
        datepicker : {
            isDateTimePickerVisible: false
        },
        loading : false ,
        selectedChangwat: (this.props.userProfile.province) 
                            ? this.props.forms.changwats.filter((item)=>item.name === this.props.userProfile.province)[0]
                            : "" ,
        selectedAmphoe: "" ,
        selectedTambon: "" ,
        changwats: [{pid: "" , name: "Please select province"} , ...this.props.forms.changwats],
        amphoes: [{pid: "" , name:"Please select district" , changwat_pid: ""}],
        tambons: this.props.forms.tambons
    }

    componentDidMount() {
        if(this.state.selectedChangwat) {

            const { amphoes } = this.props.forms;
            const filterAmphoes = amphoes.filter((item)=>item.changwat_pid === this.state.selectedChangwat.pid);
            const selectedAmphoe = amphoes.filter((item)=>item.name.trim() === this.props.userProfile.district.trim())[0]
            this.setState(state=>{
                if(state.userProfile.district) {
                    state.selectedAmphoe = selectedAmphoe;
                }
                state.amphoes = [state.amphoes[0] , ...filterAmphoes]
                return state;
            })
        }
    }

    async componentWillMount() {
        // console.log(this.state.userProfile);

        this.setState((state)=>{
            if(!state.userProfile.email) state.userProfile.email = this.props.userCognito.attributes.email;
            state.actions.onImagePicker = () => imageService.onImagePicker(this.callbackImagePicker);
            state.actions.onShowDatePicker = () => this.setState((state)=>{
                state.datepicker.isDateTimePickerVisible = true;
                return state
            })
            state.actions.onHideDatePicker = () => this.setState((state)=>{
                state.datepicker.isDateTimePickerVisible = false;
                return state
            })
            state.actions.onConfirmDatePicker = (date) => this.setState((state)=>{
                state.userProfile.birthDate = moment(date).format('YYYY-MM-DD');
                state.datepicker.isDateTimePickerVisible = false;
                return state;
            })
            return state;
        })
    }

    

    callbackImagePicker = (result) => {
        console.log(result);
        if (!result.cancelled) {
            this.setState((state)=>{
                state.userProfile.image = result.uri
                return state;
            })
        }
    }



    onProfileChange = (key , text ) => {
        this.setState((state)=>{
            state.userProfile[key] = text;
            return state
        })
    }

    onUpdateUser = async() => {
        await this.setState({loading: true});
        const { userProfile } = this.state;
        let body = {
            id: userProfile.id
        }
        Object.keys(userProfile).forEach((key)=>{
            if(userProfile[key] && this.updateKey.includes(key)) {
                body[key] = userProfile[key];
            }
        })
        if(typeof this.state.selectedChangwat !== 'string') {
            body['province'] = this.state.selectedChangwat.name;
        }
        if(typeof this.state.selectedAmphoe !== 'string') {
            body['district'] = this.state.selectedAmphoe.name;
        }
        // console.log('props image ' , this.props.userProfile.image)
        // console.log('state image ', this.state.userProfile.image)
        if(this.props.userProfile.image !== this.state.userProfile.image) {
            // upload image to s3
            try {
                let result = await imageService.blobUploadImage(this.state.userProfile.image);
                body.image = `https://${config.aws_user_files_s3_bucket}.s3-${config.aws_user_files_s3_bucket_region}.amazonaws.com/public/${result.key}`
            }
            catch(error) {
                console.log(error);
                toastRefService.get().show(error.message);
                return false;
            }
        }

        sendBirdService.updateProfile(userProfile.id , {
            nickname: body.firstName + ' ' + body.lastName,
            profile_url: body.image
        })
        .then((json)=>{
            console.log('update sendbird profile');
        })

        this.props.updateUser(body)
        .then((result)=>{
            // console.log('update result' , result);
            this.props.setUserProfile(result.data.updateUser)
            toastRefService.get().show('Update profile success.');
            this.setState({loading: false});
        })
        .catch((error)=>{
            console.log(error);
            toastRefService.get().show('Something went wrong.');
            this.setState({loading: false});
        })
        
    }

    onSelectProvince = (province) => {
        const { amphoes } = this.props.forms;
        const filterAmphoes = amphoes.filter((item)=>item.changwat_pid === province.pid);
        this.setState(state=>{
            state.selectedChangwat = province;
            state.amphoes =  [state.amphoes[0] , ...filterAmphoes];
            state.selectedAmphoe = ""
            return state;
        })
    }

    render() {
        return <ManageUserProfileScreen 
                    navigation={this.props.navigation} 
                    userProfile={this.state.userProfile} 
                    datepicker={this.state.datepicker}
                    state={this.state}
                    onStateChange={this.onProfileChange}
                    updateUser={this.onUpdateUser}
                    onSelectProvince={this.onSelectProvince}
                    onStateChangeLocal={onStateChange.bind(this)}
                    {...this.state.actions}  
                    
                />;
    }
}



const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile ,
    userCognito: state.auth.user,
    forms: state.forms
})

const mapDispatchToProps = (dispatch) => ({
    setUserProfile: (userProfile) => dispatch(setUserProfile(userProfile)),
})

const withConnect = connect(mapStateToProps , mapDispatchToProps)(ManageUserProfileContainer);

const withUpdateUser = graphql(gql(updateUser) , {
    props: props => ({
        updateUser: updateItem => {
            // console.log('upadte item' , updateItem);
            return props.mutate({
                variables: { input : updateItem }
            })
            
        }
    })
})(withConnect)


export default withUpdateUser;