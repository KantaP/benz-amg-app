import React from 'react';
import {
    View ,
    Text ,
    Button ,
    Screen ,
    Title
} from '@shoutem/ui';

import { ImageBackground , ScrollView } from 'react-native';
import { navTitle } from '../components/styles';
import { connect } from 'react-redux';
import { agreeTerm } from '../actions/firstTime';

const styles = {
    contentColor: {
        color: '#fff'
    },
    label : {   
        ...navTitle ,
        color: '#fff'
    }
}

class FirstTermContainer extends React.Component {
    render() {
        return (
            <Screen>
                <ImageBackground  
                    style={{
                    flex: 1,
                    width: null,
                    height: null,
                    resizeMode: 'cover'
                    }}
                    source={require('../assets/images/bg.jpg')}
                >
                    
                    <ScrollView style={{marginTop: 50 , marginBottom: 20 , padding: 10}}>
                        <View styleName="vertical">
                            <View styleName="horizontal h-center" style={{marginBottom: 20}}>
                                <Title style={styles.label}>Term & Condition</Title>
                            </View>

                            <Title style={styles.label}>Introduction</Title>
                            <View style={{marginTop: 5}}></View>
                            <Text style={styles.contentColor} numberOfLines={5}>
                                These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Webiste Name accessible at Website.com.
                            </Text>
                        </View>
                    </ScrollView>
                    <View styleName="horizontal h-center" style={{marginBottom: 30}}>
                        <Button 
                        onPress={()=>{
                            console.log('click');
                            this.props.agreeTerm();
                            this.props.navigation.navigate('Tutorial');
                        }}
                        style={{
                            // position:'absolute' , bottom: 30 ,
                            width: 300 , height: 50 ,
                            backgroundColor:'#000'
                        }}>
                            <Text style={{color:'#fff'}}>AGREE</Text>
                        </Button>
                    </View>
                    
                </ImageBackground>
            </Screen>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    agreeTerm: () => dispatch(agreeTerm())
})

export default connect(null , mapDispatchToProps)(FirstTermContainer);