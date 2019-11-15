import { Platform } from 'react-native';
import { Appearance } from 'react-native-appearance';
import { getStatusBarHeight } from 'react-native-status-bar-height';
export const colorScheme = Appearance.getColorScheme();

export const redColor = '#C43835';
export const blackColor = '#191919';

export const textStyle = {
    color: '#fff'
}

export const buttonStyle = {
    backgroundColor: '#191919' ,
    borderColor: '#fff'
}

export const inputTextStyle = {
    // borderLeftColor: '#000',
    // borderRightColor: '#000',
    // borderTopColor: '#000',
    backgroundColor: 'transparent', 
    color: '#ffffff' ,
    borderWidth: 0, 
    borderBottomWidth : 1 ,
    borderBottomColor: '#fff',
    placeholderTextColor: '#fff'
}
 
export const iconStyle = {
    color:'#fff' ,
    fontSize: 16
}

export const navigatorBarStyle = {
    container: {
        backgroundColor: '#191919' ,
        paddingTop: (Platform.OS === 'ios') ? 30 : 30,
        // height: (Platform.OS === 'ios' ) ? 90 : 90,
        height: getStatusBarHeight() + 65,
    },
    centerComponent: {
        flex: 3,
    },
}

export const greetingButtonStyle = {width: 150 , padding: 0};
export const formButtonStyle =  {width: 300 , borderRadius: 20 , backgroundColor:'#C43835' , padding: 5}
export const formButtonDisableStyle = { backgroundColor:'#ccc'}

export const switchStyle = {
    container: {
        backgroundColor: 'white'
    },
    thumb: {
        backgroundColor: '#C43835'
    }
}

export const navTitle = {
    fontFamily: 'CAR',
    fontSize: 20
}