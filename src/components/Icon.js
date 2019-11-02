import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import { connectStyle } from '@shoutem/theme';

export const FontAwesomeIcon  = connectStyle('shoutem.ui.Icon')(FontAwesome);
export const AntDesignIcon = connectStyle('shoutem.ui.Icon')(AntDesign);
export const EntypoIcon = connectStyle('shoutem.ui.Icon')(Entypo);
export const MaterialIcon = connectStyle('shoutem.ui.Icon')(MaterialIcons);
export const FoundationIcon = connectStyle('shoutem.ui.Icon')(Foundation);
export const SimpleLineIcon = connectStyle('shoutem.ui.Icon')(SimpleLineIcons);
export const FeatherIcon = connectStyle('shoutem.ui.Icon')(Feather);