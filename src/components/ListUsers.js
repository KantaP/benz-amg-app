import React from 'react';
import { connect } from 'react-redux';
import { View  , Image , Title , TextInput , Caption } from '@shoutem/ui';
import { AntDesignIcon } from './Icon';
import { TouchableOpacity , FlatList } from 'react-native';
import _ from 'lodash';
import { getUser } from '../graphql/queries';
import gql from 'graphql-tag';
import { Query } from 'react-apollo'; 

class ListUsers extends React.Component { 


    state = {
        search: ''
    }

    timer = null

    setSearchText = (text) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            this.setState({search: text})
        }, 1000)
    }

    render() {
        
        return (
            <View>
                <View styleName="horizontal h-center" style={{padding: 5 , marginBottom : 20}}>
                    <View style={{flex: 0.9 , borderBottomWidth: 0.5 , borderBottomColor: '#ccc'}}>
                        <TextInput
                            onChangeText={this.setSearchText}
                            placeholder="Search"
                        />
                    </View>
                </View>
                <FlatList
                    removeClippedSubViews
                    data={
                        (this.state.search) 
                        ? _(this.props.listUsers)
                            .filter((item)=>item.firstName.toLowerCase() === this.state.search.toLowerCase()) 
                            .value() 
                        : this.props.listUsers
                    }
                    keyExtractor={(item , index)=>item.id}
                    renderItem={({item}) => {
                        return <ListUserItem user={item} enableSelect={this.props.enableSelect} onSelectUser={this.props.onSelectUser} />
                    }}
                    initialNumToRender={8}
                    maxToRenderPerBatch={2}
                />
            </View>
        )
    }
}

mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(ListUsers);


class ListUserItem extends React.Component {
    state = {
        toggleSelected: false
    }
    render() {
        return (
            <Query query={gql(getUser)} variables={{id: this.props.user.id}}>
                {
                    ({data , loading , error}) => {
                        if(loading) return null;
                        
                        let user = data.getUser;
                        return (
                            <TouchableOpacity onPress={()=>{
                                if(this.props.onSelectUser && this.props.enableSelect) this.props.onSelectUser(user.id)
                                this.setState({toggleSelected: !this.state.toggleSelected})
                            }}>
                                <View styleName="horizontal v-center space-between" style={{padding: 10 , backgroundColor: '#fff'}}>
                                    <View styleName="horizontal v-center">
                                        <Image 
                                            // styleName="small-avatar"
                                            style={{width: 64, height: 64 , borderRadius: 32}}
                                            source={
                                                (user.image) 
                                                ? { uri: user.image } 
                                                : require('../assets/images/user-blank.jpg')
                                            }
                                        />
                                        <View styleName="vertical" style={{marginLeft : 15}}>
                                            <Title>{user.firstName} {user.lastName}</Title>
                                            <View style={{marginTop: -7}}>
                                                <Caption>
                                                    {
                                                        (user.companies.items.length > 0) 
                                                        ? `${user.companies.items[0].name}`
                                                        : null
                                                    }
                                                </Caption>
                                            </View>
                                            <View style={{marginTop: -8}}>
                                                <Caption>
                                                    {
                                                        (user.district && user.province) 
                                                        ? `${user.district} , ${user.province}`
                                                        : (user.district && !user.province) 
                                                            ? `${user.district}`
                                                            : (!user.district && user.province) 
                                                                ? `${user.province}`
                                                                : ``
                                                    }
                                                </Caption>
                                            </View>
                                        </View>
                                    </View>
                                    {
                                        (this.props.enableSelect) &&
                                        (<View 
                                        style={{
                                            width: 32, 
                                            height: 32 , 
                                            borderRadius: 16 , 
                                            borderWidth: 1, 
                                            borderColor: '#b21e23' ,
                                            backgroundColor: (this.state.toggleSelected) ? '#b21e23' : '#fff'
                                        }}>
                                            {
                                                (this.state.toggleSelected) 
                                                ?  <AntDesignIcon name="check" style={{color:'#fff'}} />
                                                : null
                                            }
                                        </View>)
                                    }
                                    
                                </View>
                            </TouchableOpacity>
                        )
                    }
                }
            </Query>
            
        )
    }
}