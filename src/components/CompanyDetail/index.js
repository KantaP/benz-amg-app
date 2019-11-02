import React from 'react';

import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    Button ,
    Text ,
    TextInput,
    Image
} from '@shoutem/ui';
import { ScrollView } from 'react-native';
import { navigatorBarStyle , iconStyle , navTitle } from '../styles';
import { FontAwesomeIcon , MaterialIcon  } from '../Icon'; 

const CompanyDetailScreen = ({navigation , companyProfile , onPressEmail , onPressCall }) => (
    <Screen>
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
                <Title style={Object.assign({} , navTitle , {color:'#fff'})} numberOfLines={1}>
                    {companyProfile.name}
                </Title>
            }
            rightComponent={
                <View styleName="horizontal h-center v-center">
                    <Button
                        styleName="clear"
                        onPress={()=>{
                            if(onPressEmail) {
                                onPressEmail();
                            }
                        }}
                    >
                    <MaterialIcon name="email" style={iconStyle} />
                    </Button>
                    <Button
                        styleName="clear"
                        onPress={()=>{
                            if(onPressCall){
                                onPressCall();
                            }
                        }}
                    >
                    <FontAwesomeIcon name="phone" style={iconStyle} />
                    </Button>
                </View>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <ScrollView>
            <Image 
                styleName="large-wide"
                source={
                    (companyProfile.image)
                    ? {uri : companyProfile.image}
                    :require('../../assets/images/no-image.png')
                }
            />
            <View styleName="horizontal space-between v-start" style={{paddingLeft: 20 , paddingRight: 20 , marginTop: 20}}>
                <View 
                    styleName="vertical v-center h-center"
                    style={{flex: 0.25}}
                >
                    <Image
                        style={{width:70 , height: 70 , borderRadius:35}}
                        source={
                            (companyProfile.logo) 
                            ? {uri : companyProfile.logo}
                            : require('../../assets/images/no-image.png')
                        }
                    />
                </View>
                <View styleName="vertical" style={{flex: 0.75 , paddingLeft: 10 , paddingRight: 15}}>
                    <View style={{paddingBottom: 5 , borderBottomWidth: 1,borderBottomColor:'#ccc'}}>
                        <Title>{companyProfile.name}</Title>
                    </View>
                    <View styleName="wrap" style={{marginTop: 5}}>
                        <Text>{companyProfile.description}</Text>
                    </View>
                </View>
            </View>
            <View styleName="horizontal" style={{marginTop: 10}}>
                <View styleName="vertical" style={{flex: 1 , paddingLeft: 10 , paddingRight: 15}}>
                    <View style={{paddingBottom: 5 , borderBottomWidth: 1,borderBottomColor:'#ccc'}}>
                        <Title>Location</Title>
                    </View>
                    <View styleName="wrap" style={{marginTop: 5}}>
                        <Text>{companyProfile.address || '-'}</Text>
                    </View>
                </View>
            </View>
            <View styleName="horizontal" style={{marginTop: 10}}>
                <View styleName="vertical" style={{flex: 1 , paddingLeft: 10 , paddingRight: 15}}>
                    <View style={{paddingBottom: 5 , borderBottomWidth: 1,borderBottomColor:'#ccc'}}>
                        <Title>Website</Title>
                    </View>
                    <View styleName="wrap" style={{marginTop: 5}}>
                        <Text>{companyProfile.website || '-'}</Text>
                    </View>
                </View>
            </View>
            {/* <View styleName="horizontal">
                <View styleName="vertical" style={{flex: 0.75 , paddingLeft: 10 , paddingRight: 15}}>
                    <View style={{paddingBottom: 5 , borderBottomWidth: 1,borderBottomColor:'#ccc'}}>
                        <Title>Location</Title>
                    </View>
                    <View styleName="wrap" style={{marginTop: 5}}>
                        <Text>{companyProfile.address}</Text>
                    </View>
                </View>
            </View> */}
        </ScrollView>
    </Screen>
)

export default CompanyDetailScreen;