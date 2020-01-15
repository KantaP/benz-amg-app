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
import { iconStyle , navigatorBarStyle  , formButtonStyle , navTitle, redColor} from '../styles';
import { ScrollView , Platform} from 'react-native';
import { Query } from 'react-apollo';
import { getEvent } from '../../graphql/customQueries';
import gql from 'graphql-tag';
import moment from 'moment';


const EventDetailScreen = ({navigation , state , event , onCreateJoin , onDeleteJoined , userProfile , setJoinId, count , onOpenMap}) => (
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
            {
                (event)
                ? 
                (
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
                                let startEventTime = moment(data.getEvent.startTime);
                                let endEventTime = moment(data.getEvent.endTime);
                                // console.log('diff' , endEventTime.diff(startEventTime, 'days'));
                                return [
                                    (data.getEvent.image)
                                    ? (<View key={1} style={{padding: 0}}>
                                        <Image 
                                            styleName="large-wide"
                                            source={{uri: data.getEvent.image}}
                                        />
                                    </View>)
                                    : null,
                                    <View key={0} styleName="horizontal v-start" style={{backgroundColor:'#fff' ,borderWidth: 1 , borderColor: '#eee' , padding: 10}}>
                                        <View styleName="vertical v-center" style={{flex: 0.15 , paddingLeft: 1}}>
                                            {
                                                (endEventTime.diff(startEventTime, 'days') > 0)
                                                ? (
                                                    <View styleName="horizontal h-start">
                                                        <Title>{startEventTime.format('DD')}</Title>
                                                        <Title> - </Title>
                                                        <Title>{endEventTime.format('DD')}</Title>
                                                    </View>
                                                )
                                                :   <View styleName="horizontal h-start">
                                                        <Title>{startEventTime.format('DD')}</Title>
                                                    </View>
                                            }
                                            {
                                                (!endEventTime.isSame(startEventTime, 'months'))
                                                ? (
                                                    <View styleName="horizontal h-start">
                                                        <View styleName="vertical">
                                                            <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{startEventTime.format('MMM')}</Caption>
                                                            <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{startEventTime.format('YYYY')}</Caption>
                                                        </View>
                                                        <Caption> - </Caption>
                                                        <View styleName="vertical">
                                                            <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{endEventTime.format('MMM')}</Caption>
                                                            <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{endEventTime.format('YYYY')}</Caption>
                                                        </View>
                                                    </View>
                                                )
                                                : (
                                                    <View styleName="horizontal h-start">
                                                        <View styleName="vertical">
                                                            <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{startEventTime.format('MMM')}</Caption>
                                                            <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{startEventTime.format('YYYY')}</Caption>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                            
                                        </View>
                                        <View styleName="vertical v-center" 
                                        style={{
                                            marginLeft: 40 , 
                                            paddingLeft: 10 , 
                                            borderLeftWidth: 1 , 
                                            borderLeftColor: redColor , 
                                            paddingRight: 10,
                                            flex: (data.getEvent.quota) ? 0.60 : 0.85 ,
                                            borderRightWidth: (data.getEvent.quota) ? 1 : 0 ,
                                            borderRightColor: redColor
                                        }}>
                                            <Title numberOfLines={1}>{data.getEvent.title}</Title>
                                            <TouchableOpacity onPress={()=>{
                                                if(onOpenMap) onOpenMap();
                                            }}>
                                                <Caption numberOfLines={3} style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 17}}>
                                                {data.getEvent.location.placeName}</Caption></TouchableOpacity>
                                        </View>
                                        {
                                            data.getEvent.quota &&
                                            (
                                                <View styleName="vertical h-center" style={{flex: 0.25}}>
                                                    <Title>Quota</Title>
                                                    <Caption style={(Platform.OS === 'ios') ? {lineHeight: 0} : {lineHeight: 12}}>{state.countJoined} / {data.getEvent.quota}</Caption>
                                                </View>
                                            )
                                        }
                                    </View>, 
                                    <View key={3} styleName="horizontal v-center" style={{borderBottomWidth: 0.5 , borderBottomColor: '#ccc', paddingVertical: 10}}>
                                        <View style={{marginHorizontal: 10}}>
                                            <FontAwesomeIcon name="clock-o" />
                                        </View>
                                        <Caption>{moment(data.getEvent.startTime).format('DD MMM HH:mm')}</Caption>
                                        <Caption> - </Caption>
                                        <Caption>{moment(data.getEvent.endTime).format('DD MMM HH:mm')}</Caption>
                                    </View>,
                                    <View key={2} styleName="wrap" style={{padding: 10}}>
                                        <Text>
                                            {data.getEvent.description}
                                        </Text>
                                    </View>,
                                ]
                            }
                        }
                    </Query>
                )
                : null
            }
            
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