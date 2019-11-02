import React from 'react';
import MapViewScreen from '../components/Map';
import { Animated } from 'react-native';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
// import { onStateChange } from './utils';
class MapViewContainer extends React.Component {
    static navigationOptions = { header: null };

    state = {
        x: {} ,
        // isReady: false ,
        loading: false ,
        nearByResults: [] ,
        animation   : new Animated.Value(100),
        maxHeight: 200 ,
        minHeight: 100 ,
        nextPageToken : '',
        search: '',
        marginBottom: 0 ,
        isMapReady: false
    }

    componentWillMount() {
        console.log(this.props.user.currentLocation)
        this.setState({x: this.props.user.currentLocation});
    }

    setCoordinate = (e) => {
        // console.log('coordinate'  , e.nativeEvent.coordinate)
        this.setState({ x: e.nativeEvent.coordinate }, ()=>{
            this.nearBySearch();
        });
        // if(this.props.navigation.state.params.onSelected) {
        //     this.props.navigation.state.params.onSelected(e.nativeEvent.coordinate);
        // }
    }

    toggleSlide = () => {
        let initialValue    = this.state.nearByResults.length ? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
        finalValue      = this.state.nearByResults.length  ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;
        this.state.animation.setValue(initialValue); 
        Animated.spring(    
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start(); 
    }

    nearBySearch = (text = "") => {
        text = text.replace(/ /g, "+");
        
        // console.log(googleUrl)
        this.setState({loading: true , search: text ,nearByResults: []} , () => {
            this.toggleSlide();
            let searchBy = `nearbysearch/json?location=${this.state.x.latitude},${this.state.x.longitude}&radius=1500&keyword=${this.state.search}&key=AIzaSyAa9KPr8XL8hMrW3PhevivdIZL1yFr7kyE` 
            let googleUrl = `https://maps.googleapis.com/maps/api/place/${searchBy}`;
            fetch(googleUrl)
            .then((response)=>response.json())
            .then((json)=>{
                // console.log(json);
                this.setState({loading: false , nearByResults: json.results , nextPageToken: json.next_page_token} ,()=>{
                    // this.toggleSlide();
                });
            })
            .catch((error)=>{
                // console.log(error);
                this.setState({loading: false , nearByResults: []});
            })
        });
    }

    loadMore = () => {
        let searchBy = `nearbysearch/json?pageToken=${this.state.nextPageToken}` 
            let googleUrl = `https://maps.googleapis.com/maps/api/place/${searchBy}`;
            fetch(googleUrl)
            .then((response)=>response.json())
            .then((json)=>{
                // console.log(json.results.map((item)=>item.name));
                this.setState({loading: false , nearByResults: [...this.state.nearByResults , ...json.results] , nextPageToken: json.next_page_token} ,()=>{
                    // this.toggleSlide();
                });
            })
            .catch((error)=>{
                // console.log(error);
                this.setState({loading: false});
            })
    }

    selectedPlace = (placeName , placeLatLng) => {
        if(this.props.navigation.state.params.onSelected) {
            this.props.navigation.state.params.onSelected({placeName , placeLatLng});
        }
    }

    onMapLayout = () => {
        this.setState({isMapReady: true})
    }

    onMapReady = () => {
        
        Permissions.askAsync(Permissions.LOCATION)
        .then(permission => {
            if (permission.status !== 'granted') {
                alert('Sorry, we need map permissions to make this work!');
                this.props.navigation.goBack();
                // return false;
            }
            // console.log('permission location' , granted);
            this.setState({marginBottom: 0})
        });
    }

    render() {
        // console.log(this.state);
        // if(!this.state.isReady) return null;
        return <MapViewScreen 
        setCoordinate={this.setCoordinate} 
        state={this.state} 
        onSearch={this.nearBySearch} 
        onSelected={this.selectedPlace}
        onLoadMore={this.loadMore} 
        onMapReady={this.onMapReady}
        onMapLayout={this.onMapLayout}
        />
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(MapViewContainer);