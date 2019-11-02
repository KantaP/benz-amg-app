import { Alert  , Platform } from 'react-native';

class AlertService {

    constructor() {
        this.alertItem = Platform.select({
            ios: () => Alert,
            android: () => Alert,
          })();
    }

    alert({title = '' , content = '' , buttons = [] , options = {}}) {
        this.alertItem.alert(title,content,buttons,options);
    }
}

const alertService = new AlertService();

Object.freeze(alertService);

export default alertService;