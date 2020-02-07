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
    ListView,
    Text
} from '@shoutem/ui';
import { navigatorBarStyle , navTitle } from '../styles';
import { FontAwesomeIcon } from '../Icon';
import { ScrollView } from 'react-native';
import PDFReader from 'rn-pdf-reader-js'
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
        <ScrollView contentContainerStyle={{flex: 1}}>
            <PDFReader
                source={{
                    uri: 'https://resources-static.s3-ap-southeast-1.amazonaws.com/pdf/AMG+T_C.pdf',
                }}
            />
        </ScrollView>
    </Screen>
)

export default TermScreen;