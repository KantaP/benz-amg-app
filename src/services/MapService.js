import { Platform  , Linking } from 'react-native';

class MapService {
    constructor() {
        this.scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    }

    open({lat , lng , label}) {
        const latLng = `${lat},${lng}`;
        const url = Platform.select({
            ios: `${this.scheme}${label}@${latLng}`,
            android: `${this.scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }
}

const mapService = new MapService();

Object.freeze(mapService);

export default mapService;