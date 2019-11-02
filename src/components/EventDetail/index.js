import React from 'react';
import { 
    Screen ,
    View ,
    Image ,
    NavigationBar ,
    Button ,
    Text ,
    Title ,
    Caption,
    InlineGallery,
    ImageGalleryOverlay ,
    TouchableOpacity
} from '@shoutem/ui';
import { FontAwesomeIcon }  from '../Icon';
import { iconStyle , navigatorBarStyle  , formButtonStyle , navTitle} from '../styles';
import { ScrollView , Platform} from 'react-native';
import { Query } from 'react-apollo';
import { getEvent } from '../../graphql/queries';
import gql from 'graphql-tag';
import moment from 'moment';


const EventDetailScreen = ({navigation , state , event , onCreateJoin , onDeleteJoined , userProfile , setJoinId}) => (
    <Screen style={{backgroundColor: '#fff'}}>
        <NavigationBar
            hasHistory={true}
            leftComponent={
                <Button styleName="clear" onPress={()=>{
                    navigation.goBack();
                }}>
                    <FontAwesomeIcon  name="angle-left" style={{color:'#fff'}} />
                </Button>
            }
            centerComponent={
                <Title style={Object.assign({} , navTitle , {color:'#fff'})} numOfLines={1}>
                    {event.title}
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <ScrollView>
            <Query 
            query={gql(getEvent)} 
            variables={{
                id: event.id , 
                filterUser: {
                    userId: {
                        eq: userProfile.id
                    }
                }
            }}>
                {
                    ({data , loading , error}) => {
                        if(loading) return null;
                        if(error) return <Text>{error.message}</Text>
                        let startEventTime = moment(data.getEvent.startTime)
                        return [
                            (data.getEvent.image)
                             ? (<View style={{padding: 0}}>
                                <Image 
                                    styleName="large-wide"
                                    source={{uri: data.getEvent.image}}
                                />
                             </View>)
                             : null,
                            <View styleName="horizontal v-center" style={{backgroundColor:'#fff' ,borderWidth: 1 , borderColor: '#eee' , padding: 10}}>
                                <View styleName="vertical v-center">
                                    <Title>{startEventTime.format('DD')}</Title>
                                    <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{startEventTime.format('MMM')}</Caption>
                                    <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{startEventTime.format('YYYY')}</Caption>
                                </View>
                                <View styleName="vertical v-center" style={{marginLeft: 30 , paddingLeft: 30 , borderLeftWidth: 1 , borderLeftColor: 'red' , paddingRight: 10}}>
                                    <Title numberOfLines={1}>{data.getEvent.title}</Title>
                                    <TouchableOpacity>
                                        <Caption numberOfLines={3} style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>
                                        {data.getEvent.location.placeName}</Caption></TouchableOpacity>
                                </View>
                            </View>, 
                            <View styleName="wrap" style={{padding: 5}}>
                                <Text>
                                    {data.getEvent.description}
                                </Text>
                            </View>,
                        ]
                    }
                }
            </Query>
        </ScrollView>
        {
            (state.joinId) 
            ? (
                <View style={{marginBottom: 10}}>
                    <View styleName="horizontal h-center">
                        <Button 
                            style={formButtonStyle}
                            onPress={()=>{
                                if(onDeleteJoined) {
                                    onDeleteJoined()
                                }
                            }}
                        >
                            <Text style={{color:'#fff' , fontWeight: 'bold'}}>UNJOIN</Text>
                        </Button>
                    </View>
                </View>
            )
            : (
                <View style={{marginBottom: 10}}>
                    <View styleName="horizontal h-center">
                        <Button 
                            style={formButtonStyle}
                            onPress={()=>{
                                if(onCreateJoin) {
                                    onCreateJoin()
                                }
                            }}
                        >
                            <Text style={{color:'#fff' , fontWeight: 'bold'}}>JOIN</Text>
                        </Button>
                    </View>
                </View>
            )
        }
        {/* <View style={this.style.photoNumberBlock}>
        <Text>{(this.state.photoIndexSelected + 1)}/{this.props.post.postImages.items.length}</Text> */}
        {/* </View> */}
    </Screen>
)

export default EventDetailScreen;