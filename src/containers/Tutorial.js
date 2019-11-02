import React from 'react';
import {
    View ,
    Text ,
    Button ,
    Screen ,
    Title ,
    Image ,
    Caption
} from '@shoutem/ui';

import { navTitle } from '../components/styles';
import { connect } from 'react-redux';
import { readTutorial } from '../actions/firstTime';

const styles = {
    contentColor: {
        color: '#fff'
    },
    label : {   
        ...navTitle ,
        color: '#fff'
    }
}

class TutorialContainer extends React.Component {
    render() {
        return (
            <Screen style={{backgroundColor:'#000'}}>
                <View styleName="vertical v-center" style={{height: '100%'}}>
                    <Image
                        styleName="large-wide"
                        source={require('../assets/images/tutorial.jpg')}
                    />
                    <View styleName="horizontal h-center">
                        <Title style={styles.label}>My Privilege</Title>
                    </View>
                    <View styleName="horizontal h-center" style={{marginTop: 5, paddingHorizontal: 20}}>
                        <Caption style={styles.contentColor} numberOfLines={3}>
                            LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING AND TYPESETTING INDUSTRY. LOREM IPSUM HAS BEEN THE INDUSTRY'S STANDARD
                        </Caption>
                    </View>
                    <View styleName="horizontal h-center" style={{marginTop: 20}}>
                        <Button 
                        onPress={()=>{
                            this.props.readTutorial();
                            this.props.navigation.navigate('Auth');
                        }}
                        style={{
                            backgroundColor:'#000'
                        }}>
                            <Text style={{color:'#fff'}}>OK</Text>
                        </Button>
                    </View>
                </View>
            </Screen>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    readTutorial: () => dispatch(readTutorial())
})

export default connect(null,mapDispatchToProps)(TutorialContainer);