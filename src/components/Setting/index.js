import React from 'react';
import {
    Screen ,
    View ,
    NavigationBar ,
    Title ,
    Button as BT ,
    DropDownMenu ,
    Text ,
    Switch,
    TouchableOpacity as TouchEX,
    Caption
} from '@shoutem/ui';

import { ScrollView } from 'react-native';
import { navigatorBarStyle , switchStyle  , navTitle} from '../styles';
import { FontAwesomeIcon  } from '../Icon';
import WithPreventDoubleClick from '../WithPreventDoubleClick';

const Button = WithPreventDoubleClick(BT);
const TouchableOpacity = WithPreventDoubleClick(TouchEX);

const styles = {
    blockView: {
        height: 70,
        borderColor:'#ccc' , 
        borderBottomWidth: 0.5,
        paddingLeft: 10,
        paddingRight: 10
    }
}

const SettingScreen = ({navigation , state , onStateChange , onSignOut}) => (
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
                <Title style={Object.assign({} , navTitle , {color:'#fff'})}>
                    Setting
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        <ScrollView>

            {/* <View 
                styleName="horizontal space-between v-center" 
                style={styles.blockView}>
                <View>
                    <Text>
                        Language 
                    </Text>
                </View>
                <View >
                    <DropDownMenu
                        options={state.langs}
                        selectedOption={state.selectedLang ? state.selectedLang : state.langs[0]}
                        onOptionSelected={(lang) => onStateChange('selectedLang' , lang)}
                        titleProperty="title"
                        valueProperty="langs.value"
                    />
                </View>
            </View> */}
            {/* <View 
                styleName="horizontal space-between v-center" 
                style={styles.blockView}>
                <View>
                    <Text> 
                        Push Notification 
                    </Text>
                </View>
                <View >
                    <Switch
                        onValueChange={value => {
                            onStateChange('pushNotification' , value);
                        }}
                        style={switchStyle}
                        value={state.pushNotification}
                    />
                </View>
            </View> */}
            <TouchableOpacity onPress={()=>{navigation.push('ManageUser')}}>
                <View 
                    styleName="horizontal v-center" 
                    style={styles.blockView}>
                    
                        <View>
                            <Text> 
                                Manage Personal Profile 
                            </Text>
                        </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.push('ManageCompany')}}>
                <View 
                    styleName="horizontal v-center" 
                    style={styles.blockView}>
                    
                        <View>
                            <Text> 
                                Manage Company Profile 
                            </Text>
                        </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.push('Block')}}>
                <View 
                    styleName="horizontal v-center" 
                    style={styles.blockView}>
                    
                        <View>
                            <Text> 
                                Block
                            </Text>
                        </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.push('ChangePassword')}}>
                <View 
                    styleName="horizontal v-center" 
                    style={styles.blockView}>
                    
                        <View>
                            <Text> 
                                Change Password 
                            </Text>
                        </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.push('Term')}}>
                <View 
                    styleName="horizontal v-center" 
                    style={styles.blockView}>
                    
                        <View>
                            <Text> 
                                Term and conditions
                            </Text>
                        </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                if(onSignOut) {
                    onSignOut();
                }
            }}>
                <View 
                    styleName="horizontal v-center" 
                    style={styles.blockView}>
                    
                        <View>
                            <Text> 
                                Sign out
                            </Text>
                        </View>
                    
                </View>
            </TouchableOpacity>
            <View
                styleName="horizontal v-center" 
                style={styles.blockView}
            >
                <Caption>Version 1.0.1</Caption>
            </View>
        </ScrollView>
    </Screen>
)

export default SettingScreen;