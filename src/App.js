import React from 'react';
import { Image , AppState } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createAppContainer , createBottomTabNavigator } from 'react-navigation';
import { AppLoading , Updates } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import * as en from './i18n/en';

i18n.fallbacks = true;
i18n.translations = { en: en.content };
i18n.locale = Localization.locale;
// import { StyleProvider } from '@shoutem/theme';
// import theme from './theme'
// Reducer Store
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import { PersistGate } from 'redux-persist/integration/react'
const { store, persistor } = configureStore()

import SignInContainer from './containers/SignIn';
import AuthLoadingContainer from './containers/AuthLoading';
import HomeContainer from './containers/Home';
// import ProfileContainer from './containers/Profile';
import PostDetailContainer from './containers/PostDetail';
import ReportContainer from './containers/Report';
import CreatePostContainer from './containers/CreatePost';
import MapViewContainer from './containers/MapView';
import TagSearchContainer from './containers/TagSeach';
import ReferToContainer from './containers/ReferTo';
import DirectoryContainer from './containers/Directory';
import UserDetailContainer from './containers/UserDetail';
import UserProfileContainer from './containers/UserProfile';
import ContactContaienr from './containers/Contact';
import EventContainer from './containers/Event';
import EventDetailContainer from './containers/EventDetail';
import SettingContainer from './containers/Setting';
import ManageUserProfileContainer from './containers/ManageUserProfile';
import ManageCompanyProfileContainer from './containers/ManageCompanyProfile';
import BlockContaienr from './containers/Block';
import ChangePasswordContainer from './containers/ChangePassword';
import CompanyDetailContainer from './containers/CompanyDetail';
import TermContainer from './containers/Term';
import ConnectContainer from './containers/Connect';
import HomeSearchContainer from './containers/HomeSearch';
import ChatHistoriesContainer from './containers/ChatHistories';
// AWS
import { AWSAppSyncClient , AUTH_TYPE } from "aws-appsync";
import { ApolloProvider } from "react-apollo";
import { Rehydrated } from "aws-appsync-react";
import Amplify , { Auth , Api , graphqlOperation } from 'aws-amplify';

import config from './aws-exports'
Amplify.configure(config)

import { FontAwesomeIcon , AntDesignIcon , EntypoIcon } from './components/Icon';

import {
  View ,
  Text,
  Button
} from '@shoutem/ui';

import Toast from 'react-native-easy-toast';
import ToastRefService from './services/ToastRefService';
import FirstTermContainer from './containers/FirstTerm';
import TutorialContainer from './containers/Tutorial';
import RegisterContainer from './containers/Register';


console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

// mock component
const postComponent = () => (<View></View>);
const calendarComponent = () => (<View></View>);
const directoyComponent = () => (<View></View>);
// end

const PostStack = createStackNavigator({
  CreatePost: CreatePostContainer ,
  MapView: MapViewContainer ,
  TagSearch: TagSearchContainer ,
  Contact: ContactContaienr ,
})

const ConnectStack = createStackNavigator({
  Connect: ConnectContainer ,
})

const HomeStack = createStackNavigator({
  Home: HomeContainer ,
  PostDetail: PostDetailContainer ,
  Report: ReportContainer ,
  ReferTo: ReferToContainer ,
  Contact: ContactContaienr ,
  EditPost: CreatePostContainer,
  ChatHistories: ChatHistoriesContainer,
  HomeSearch: HomeSearchContainer,
  MapView: MapViewContainer ,
  TagSearch: TagSearchContainer ,
})

const UserDetailStack = createStackNavigator({
  UserDetail : UserDetailContainer ,
  ReferTo: ReferToContainer ,
  ChatHistories: ChatHistoriesContainer
})

const DirectoyStack = createStackNavigator({
  Directory: DirectoryContainer ,
  UserDetailTop: UserDetailStack,
  Contact: ContactContaienr ,
  CompanyDetail: CompanyDetailContainer,
  PostDetail: PostDetailContainer ,
},{
  defaultNavigationOptions: ({ navigation }) => ({
    mode: 'modal',
    header: null,
  })
})

const EventStack = createStackNavigator({
  Event: EventContainer,
  Contact: ContactContaienr,
  EventDetail: EventDetailContainer ,
  ChatHistories: ChatHistoriesContainer
})

const ProfileStack = createStackNavigator({
  Profile: UserProfileContainer,
  Setting: SettingContainer,
  ManageUser: ManageUserProfileContainer,
  ManageCompany: ManageCompanyProfileContainer,
  MapView: MapViewContainer,
  Block: BlockContaienr ,
  ChangePassword: ChangePasswordContainer ,
  Term : TermContainer,
  Contact: ContactContaienr,
  PostDetail: PostDetailContainer,
  ReferTo: ReferToContainer ,
  ChatHistories: ChatHistoriesContainer,
  MapView: MapViewContainer ,
  TagSearch: TagSearchContainer ,
  EditPost: CreatePostContainer,
})



const AppStack = createBottomTabNavigator({ 
  Home: HomeStack, 
  Post: PostStack ,
  Event: EventStack ,
  Directory : DirectoyStack ,
  Profile: ProfileStack ,
},{
  navigationOptions: ({navigation}) => ({
    tabBarVisible: navigation.state.index === 0
  }),
  tabBarOptions: {
    showLabel: false ,
    activeBackgroundColor : "#C43835" ,
    inactiveBackgroundColor: "#fff" ,
  } ,
  defaultNavigationOptions: ({ navigation }) => ({
    mode: 'modal',
    header: null,
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      // let iconName;
      let style = {
        fontSize: 25 , 
        color: (focused) ? '#fff' : '#000' ,
        fontWeight: '300'
      }
      if (routeName === 'Home') {
        // iconName = `home`;
        // Sometimes we want to add badges to some icons. 
        // You can check the implementation below.
        // IconComponent = HomeIconWithBadge; 
        return <FontAwesomeIcon name="home" style={style} />
      } else if (routeName === 'Post') {
        // iconName = 'file-document-box-outline'
        return <EntypoIcon name="text-document" style={style} />
      } else if (routeName === 'Profile') {
        // iconName = `user-o`;
        return <FontAwesomeIcon name="user-o" style={style} />
      } else if (routeName === 'Event') {
        // iconName = 'calendar'
        return <FontAwesomeIcon name="calendar" style={style} />
      } else if (routeName === 'Directory') {
        iconName = 'contacts'
        return <AntDesignIcon name="contacts" style={style} />
      }

      // You can return any component that you like here!
      // return <Icon name={iconName} style={style} />;
    },
  })
});


const AppTopStack = createStackNavigator({
   App: AppStack,
   Connect: ConnectStack
},{
  defaultNavigationOptions: ({ navigation }) => ({
    mode: 'modal',
    header: null,
  })
})

const AuthStack = createStackNavigator({ 
  SignIn: SignInContainer ,
  Register: RegisterContainer
});
const AppContainer = createAppContainer(createSwitchNavigator(
  {
    App: AppTopStack,
    Auth: AuthStack,
    AuthLoading: AuthLoadingContainer ,
    FirstTerm: FirstTermContainer,
    Tutorial: TutorialContainer,
    Post: PostStack,
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: "screen",
    // mode: "modal"
    // transitionConfig: TransitionConfiguration,
  }
));

const client = new AWSAppSyncClient({
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region ,
  disableOffline: true,
  auth: { 
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () => {
      let token = (await Auth.currentSession()).getIdToken().getJwtToken();
      // console.log(token);
      return token;
    }, 
  }
})

export default class App extends React.Component {
  state = {
      isReady: false ,
      locale: Localization.locale ,
      showUpdate: false
  }

  // cacheImages(images) {
  //   return images.map(image => {
  //     if (typeof image === 'string') {
  //       return Image.prefetch(image);
  //     } else {
  //       return Asset.fromModule(image).downloadAsync();
  //     }
  //   });
  // }

  setLocale = locale => {
    this.setState({ locale });
  };

  t = (scope, options) => {
    return i18n.t(scope, { locale: this.state.locale, ...options });
  };
  
  async _cacheResourcesAsync() {

    console.log('load asset');

    await Font.loadAsync({
      'Rubik-Regular': require('./assets/fonts/Rubik/Rubik-Regular.ttf'),
      'Rubik-Medium': require('./assets/fonts/Rubik/Rubik-Medium.ttf'),
      'rubicon-icon-font' : require('./assets/fonts/Rubik/rubicon-icon-font.ttf'),
      'FontAwesome' : require('./assets/fonts/FontAwesome.ttf'),
      'Roboto-Regular' : require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
      'CAR':  require('./assets/fonts/Corporate-A-Regular.otf')
    });

    await Asset.loadAsync([
      require('./assets/images/logo-alter.png'),
      require('./assets/images/contact-callcenter.jpg'),
      require('./assets/images/contact-social.jpg'),
      require('./assets/images/contact-feedback.jpg'),
      require('./assets/images/contact-address.jpg'),
      require('./assets/images/user-blank.jpg'),
      require('./assets/images/no-image.png'),
      require('./assets/images/bg.jpg'),
      require('./assets/images/tutorial.jpg'),
      require('./assets/images/logo.png'), 
      require('./assets/images/logo_50.png')
    ])

    
    
    // console.log(result);
    // console.log(client);
  } 
    
  componentDidMount() {
    // AppState.addEventListener('change', this._handleAppStateChange);
    Updates.checkForUpdateAsync().then(update => {
      if (update.isAvailable) {
        this.setState({showUpdate: true});
      }
    });
  }

  doUpdate = () => {
    Updates.reload();
  }

  render() {
    
    if (!this.state.isReady) {
        return (
          <AppLoading
            startAsync={this._cacheResourcesAsync}
            onFinish={() => {this.setState({ isReady: true })}}
            onError={console.warn}
          />
        );
      }
      return (
        <ApolloProvider client={client}>
          <Rehydrated>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                {/* <StyleProvider style={theme}> */}
                {/* <ActionSheetProvider> */}
                  <AppContainer 
                    screenProps={{
                      t: this.t,
                      locale: this.state.locale,
                      setLocale: this.setLocale,
                    }}
                  />
                  <Toast 
                    ref={ref=>{ToastRefService.set(ref)}}
                    position='top'
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                  />
                   
                  {/* </ActionSheetProvider> */}
                {/* </StyleProvider> */}
              </PersistGate>
            </Provider>
          </Rehydrated>
        </ApolloProvider>
      );
  }
}