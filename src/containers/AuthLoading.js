import React from 'react';
import { connect } from 'react-redux'
import AuthLoadingScreen from '../components/AuthLoading';
import { setCurrentLocation , setUserProfile, setListUsers , setListUserBlocks , setListUserWhoBlockCurrentUser } from '../actions/user';
import { getUser , listUserBlocks } from '../graphql/queries';
import { listUsers } from '../graphql/customQueries';
import { updateUser } from '../graphql/mutations';
import Amplify, { API, graphqlOperation , Auth } from 'aws-amplify';
import _ from 'lodash';
import sendBirdService from '../services/SendBirdService';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions'
import { hasNotificationChat } from '../actions/notification';
// raw_data
import changwats from '../raw_data/changwats';
import amphoes from '../raw_data/amphoes';
import tambons  from '../raw_data/tambons';
import { setChangwats , setAmphoes , setTambons } from '../actions/forms';
import moment from 'moment'
import toastRefService from '../services/ToastRefService';
class AuthLoadingContainer extends React.Component {
    static navigationOptions = { header: null };

    async componentDidMount() {
        try {
            if(!this.props.firstTime.agreeTerm) {
                this.props.navigation.navigate('FirstTerm');
                return;
            }
            
            let userData = await this.getUser();
            // console.log('user data' , userData)
            if(!userData) {
                this.props.navigation.navigate('Auth');
                return;
            }

            // console.log(userData);
            let myProfile = await this.userProfile(userData.username);
            let expiredAt = moment(myProfile.data.getUser.memberExpiredAt);
            if(
                !myProfile.data.getUser.active ||
                (
                    myProfile.data.getUser.memberExpiredAt !== null &&
                    moment().isAfter(expiredAt, 'day')
                )
            ) {
                toastRefService.get().show('Your username has not been activated or already expired');
                this.props.navigation.navigate('Auth');
                // this.setState({ showSpinner: false });
                return false;
            }
            // console.log(myProfile.data.getUser);
            this.props.setUserProfile(myProfile.data.getUser);
            
            let listUsersWithoutMyId = await this.listUserWithOutMyId(myProfile.data.getUser.id);
            let listUserBlocks = await this.listUserBlocks(myProfile.data.getUser.id);
            let listUserWhoBlockCurrentUser = await this.listUserWhoBlockCurrentUser(myProfile.data.getUser.id);
            // console.log(listUsersWithoutMyId);

            this.props.setListUsers(listUsersWithoutMyId);
            this.props.setListUserBlocks(listUserBlocks);
            this.props.setListUserWhoBlockCurrentUser(listUserWhoBlockCurrentUser);
            // console.log(listUserWhoBlockCurrentUser);
            
            this._notificationSubscription = Notifications.addListener(this._handleNotification);
            console.log(myProfile.data.getUser.image);
            sendBirdService.connect(myProfile.data.getUser.id);
            sendBirdService.updateProfile(myProfile.data.getUser.id , {
                nickname: myProfile.data.getUser.firstName + ' ' + myProfile.data.getUser.lastName,
                profile_url: myProfile.data.getUser.image || 'https://resources-static.s3-ap-southeast-1.amazonaws.com/images/user-blank.jpg'
            })
            .then((json)=>{
                console.log('update sendbird profile');
            })
    
            this.registerPushNotifications()
            .then((token)=>{
                // console.log('pushtoken' , token);
                // console.log('variable' , {input: { id:myProfile.data.getUser.id , pushToken: token}})
                API.graphql(graphqlOperation(updateUser , {input: { id:myProfile.data.getUser.id , pushToken: token}}));
            })
            .catch((error)=>{
                console.log(error);
            })

            this.getCurrentPosition();

            // initial data
            this.props.setChangwats(changwats);
            this.props.setAmphoes(amphoes);
            this.props.setTambons(tambons);

            this.ready(); 
             
        }catch(error) {
            console.log(error);
            console.log(`Error: ${error.message}`)
            this.props.navigation.navigate('Auth');
        }
        
    }

    _handleNotification = (notification) => {
        this.props.hasNotificationChat(true);
    }

    getUser = () => {
        return Auth.currentAuthenticatedUser()
    };

    getCurrentPosition() {
        return new Promise( (resolve , reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                // console.log('current location' , position);
                this.props.setCurrentLocation({
                    longitude: position.coords.longitude, 
                    latitude: position.coords.latitude , 
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                resolve({})
            }, (error) => {
                console.log(error);
                this.getCurrentPosition();
                reject(error);
                // alert(JSON.stringify(error))
            }, {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            });
        })
    }

    registerPushNotifications = async() => {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
      
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
          // Android remote notification permissions are granted during the app
          // install, so this will only ask on iOS
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
      
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
          return;
        }
    
        // Get the token that uniquely identifies this device
        return Notifications.getExpoPushTokenAsync();
    } 

    ready() {
        // setTimeout(()=>{
            // console.log(this.props.auth.user);
            if(!this.props.auth.user.hasOwnProperty('username')) {
                this.props.navigation.navigate('Auth');
                return false;
            }
            this.props.navigation.navigate('App');
        // }, 1000)
    }

    userProfile = (id) => {
        const filter = {
            id: id
        };
        
        return API.graphql(graphqlOperation(getUser , filter));
    }

    listUserBlocks = (myId) => {
        return new Promise(async(resolve)=> {
            let nextToken = null;
            let results = []
            let loop = true
            while(loop) {
                const filter = {
                    userId: {
                        eq: myId
                    }
                }
                let variables = {
                    filter ,
                    limit: 10
                }
                if(!_.isNull(nextToken)) { 
                    variables['nextToken'] = nextToken;
                }
                let response = await API.graphql(graphqlOperation(listUserBlocks,variables));
                results = [ ...results ,...response.data.listUserBlocks.items];
                if(!_.isNull(response.data.listUserBlocks.nextToken)) {
                    nextToken = response.data.listUserBlocks.nextToken
                } else {
                    loop = false;
                }
            }
            resolve(results);
        })
    }

    listUserWhoBlockCurrentUser = (myId) => {
        return new Promise(async(resolve)=> {
            let nextToken = null;
            let results = []
            let loop = true
            while(loop) {
                const filter = {
                    blockUserId: {
                        eq: myId
                    }
                }
                let variables = {
                    filter ,
                    limit: 10
                }
                if(!_.isNull(nextToken)) { 
                    variables['nextToken'] = nextToken;
                }
                let response = await API.graphql(graphqlOperation(listUserBlocks,variables));
                results = [ ...results ,...response.data.listUserBlocks.items];
                if(!_.isNull(response.data.listUserBlocks.nextToken)) {
                    nextToken = response.data.listUserBlocks.nextToken
                } else {
                    loop = false;
                }
            }
            resolve(results);
        })
    }

    listUserWithOutMyId = (myId) => {
        return new Promise(async(resolve)=> {
            let nextToken = null;
            let results = []
            let loop = true
            while(loop) {
                const filter = {
                    id: {
                        ne: myId
                    },
                    level: {
                        eq: 'user'
                    },
                    active: {
                        eq: true
                    }
                }
                let variables = {
                    filter ,
                    limit: 10
                }
                if(!_.isNull(nextToken)) { 
                    variables['nextToken'] = nextToken;
                }
                let response = await API.graphql(graphqlOperation(listUsers,variables));
                results = [ ...results ,...response.data.listUsers.items];
                if(!_.isNull(response.data.listUsers.nextToken)) {
                    nextToken = response.data.listUsers.nextToken
                } else {
                    loop = false;
                }
            }
            resolve(results);
        });
    }

    render() {
        return (<AuthLoadingScreen />);
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth ,
        firstTime: state.firstTime
    }
}

const mapDispatchToProps = (dispatch) => ({
    setCurrentLocation: (coordinate) => dispatch(setCurrentLocation(coordinate)),
    setUserProfile: (userProfile) => dispatch(setUserProfile(userProfile)),
    setListUsers: (listUsers) => dispatch(setListUsers(listUsers)),
    setListUserBlocks: (listUserBlocks) => dispatch(setListUserBlocks(listUserBlocks)),
    setListUserWhoBlockCurrentUser: (listUsers) => dispatch(setListUserWhoBlockCurrentUser(listUsers)),
    hasNotificationChat: (hasChat) => dispatch(hasNotificationChat(hasChat)),
    setChangwats: (changwats) => dispatch(setChangwats(changwats)),
    setAmphoes: (amphoes) => dispatch(setAmphoes(amphoes)),
    setTambons: (tambons) => dispatch(setTambons(tambons)),
})


const AuthLoadingWithStore = connect(mapStateToProps,mapDispatchToProps)(AuthLoadingContainer);

export default AuthLoadingWithStore;
// export default AuthLoadingContainer;
