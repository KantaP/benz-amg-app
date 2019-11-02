import React from 'react';
import { PROVIDER_GOOGLE } from 'expo';
import { 
    Screen ,
    NavigationBar,
    View,
    Button ,
    Title ,
    ListView ,
    Text,
    TextInput
} from '@shoutem/ui';
import { navigatorBarStyle , navTitle } from '../styles';
import { FontAwesomeIcon } from '../Icon';
import { withNavigation } from 'react-navigation';
import { Animated  , KeyboardAvoidingView , TouchableOpacity , ScrollView } from 'react-native';
// import { onStateChange } from '../../containers/utils';
import MapView from 'react-native-maps';


let timer = null;

const styles = {
    mapContainer : {
        width : '100%',
        height : 200
      },
     map : {
        width : '100%',
        height : '100%'
      }
}

const MapViewScreen = ({navigation , setCoordinate , state , onSearch , onLoadMore , onSelected , onMapReady, onMapLayout}) => (
    <KeyboardAvoidingView
				style={{ flex: 1, backgroundColor: 'white' }}
				behavior={"padding"}
                keyboardVerticalOffset={0}>
    <Screen>
        <NavigationBar
            hasHistory={true}
            leftComponent={
                <Button styleName="clear" onPress={()=>{
                    navigation.goBack();
                }}>
                    <FontAwesomeIcon  name="angle-left" style={{fontSize: 24 ,color:'#fff'}} />
                </Button>
            }
            centerComponent={
                <Title style={Object.assign({} , navTitle , {color:'#fff'})}>
                    Location
                </Title>
            }
            style={navigatorBarStyle}
            styleName="inline"
        />
        {/* <View style={styles.mapContainer}> */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{flex: 1 , marginBottom: state.marginBottom}}
                initialRegion={state.x}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onMapLayout={()=>{
                    if(onMapLayout) {
                        onMapLayout(); 
                    }
                }}
                onMapReady={()=>{
                    if(onMapReady) {
                        onMapReady();
                    }
                }}
            >
                {
                    state.isMapReady &&
                    (
                        <MapView.Marker 
                            draggable
                            coordinate={state.x}
                            onDragEnd={(e) => {
                                if(setCoordinate) setCoordinate(e);
                            }}
                        />
                    )
                }
                
            </MapView>
        {/* </View> */}
        <Animated.View style={{height: state.animation}}>
            <View styleName="horizontal v-center h-center" style={{padding : 20}}>
                <TextInput
                    onChangeText={(text)=>{
                        clearTimeout(timer);
                        if(!text) return false;
                        timer = setTimeout(()=>{
                            onSearch(text);
                            clearTimeout(timer);
                        }, 1000)
                    }}
                    style={{flex: 1}}
                    placeholder="Search"
                />
            </View>
            <ScrollView>
            {
                state.nearByResults.map((place)=>(
                    <TouchableOpacity onPress={()=>{
                        if(onSelected) {
                            let location = place.geometry.location;
                            onSelected(place.name, `${location.lat},${location.lng}`)
                            navigation.goBack();
                        }
                    }}>
                        <View styleName="horizontal v-center" style={{padding: 30 , borderBottomWidth: 1 , borderBottomColor: '#ccc'}}>
                            <Text>{place.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
            </ScrollView>
            {/* <ListView 
                data={state.nearByResults}
                onLoadMore={()=>{
                    if(onLoadMore) onLoadMore();
                }}
                renderHeader={()=>(
                    <View styleName="horizontal v-center h-center" style={{padding : 20}}>
                        <TextInput
                            onChangeText={(text)=>{
                                clearTimeout(timer);
                                if(!text) return false;
                                timer = setTimeout(()=>{
                                    onSearch(text);
                                    clearTimeout(timer);
                                }, 1000)
                            }}
                            style={{flex: 1}}
                            placeholder="Search"
                        />
                    </View>
                )}
                renderRow={(place)=>(
                    <TouchableOpacity onPress={()=>{
                        if(onSelected) {
                            let location = place.geometry.location;
                            onSelected(place.name, `${location.lat},${location.lng}`)
                            navigation.goBack();
                        }
                    }}>
                        <View styleName="horizontal v-center" style={{padding: 30 , borderBottomWidth: 1 , borderBottomColor: '#ccc'}}>
                            <Text>{place.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            /> */}
        </Animated.View>
    </Screen>
    </KeyboardAvoidingView>
) 

export default withNavigation(MapViewScreen); 