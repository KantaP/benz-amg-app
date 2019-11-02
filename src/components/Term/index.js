import React from 'react';

import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    TextInput ,
    Button ,
    DropDownMenu ,
    Row,
    ListView
} from '@shoutem/ui';
import { navigatorBarStyle , navTitle } from '../styles';
import { FontAwesomeIcon } from '../Icon';

const TermScreen = ({navigation}) => ( 
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
                <Title numberOfLines={1} style={Object.assign({} , navTitle , {color:'#fff'})}>
                    Term & Condition
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
    </Screen>
)

export default TermScreen;