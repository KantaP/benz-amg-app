import { Alert  , Platform } from 'react-native';

class AlertService {

    constructor() {
        this.alertItem = Platform.select({
            ios: () => Alert,
            android: () => Alert,
          })();
    }

    alert({
        title = '' , 
        content = '' , 
        buttons = [{text: 'OK', onPress: () => console.log('OK Pressed')}] , 
        options = {},
        timeOut = 0
    }) {
        if(timeOut > 0) {
            setTimeout(()=>{
                this.alertItem.alert(title,content,buttons,options);
            },timeOut)
        } else {
            this.alertItem.alert(title,content,buttons,options);
        }
        
    }
}

const alertService = new AlertService();

Object.freeze(alertService);

export default alertService;