import React from 'react';
import AlphabetListView from './react-native-alphabetlistview';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View , Text, TouchableOpacity , Divider  , Image , Title , Caption , TextInput} from '@shoutem/ui';
import _ from 'lodash';
import { ScrollView } from 'react-native';
const initLists = {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    G: [],
    H: [],
    I: [],
    J: [],
    K: [],
    L: [],
    M: [],
    N: [],
    O: [],
    P: [],
    Q: [],
    R: [],
    S: [],
    T: [],
    U: [],
    V: [],
    W: [],
    X: [],
    Y: [],
    Z: [],
  }

class SectionHeader extends React.PureComponent {
    render() {
      // inline styles used for brevity, use a stylesheet when possible
      var textStyle = {
        color:'#000',
        fontSize: 18 
      };
  
      var viewStyle = {
        backgroundColor: '#f6f6f6',
        paddingVertical: 4,
        paddingLeft: 10,
        flex: 0.90
      };
      return (
        // <Divider styleName="section-header">
            <View styleName="horizontal" style={viewStyle}>
                <Text style={textStyle}>{this.props.title}</Text>
            </View>
        // </Divider>
      );
    }
  }
  
  class SectionItem extends React.PureComponent {
    componentDidMount() {
        console.log('SectionItem' , this.props);
    }
    render() {
      return (
        <View style={{padding: 5}}>
            <Text style={{color:'#000'}}>{this.props.title}</Text>
        </View>
      );
    }
  }

class Cell extends React.PureComponent {
    componentDidMount() {
        // console.log('Cell' , this.props);
    }
    render() {
      return (
        <TouchableOpacity onPress={()=>{
            if(this.props.onSelect) {
                this.props.onSelect(this.props.item);
            }
        }}>
            <View styleName="horizontal v-center space-between" style={{height: 100 ,padding: 10 , backgroundColor: '#fff'}}>
                <View styleName="horizontal v-center">
                    <Image 
                        // styleName="small-avatar"
                        style={{width: 64, height: 64 , borderRadius: 32}}
                        source={
                            (this.props.item.image) 
                            ? { uri: this.props.item.image}
                            : require('../assets/images/user-blank.jpg')
                        }
                    />
                    <View styleName="vertical" style={{marginLeft : 15}}>
                        <Text style={{fontWeight:'bold'}}>{this.props.item.firstName} {this.props.item.lastName}</Text>
                        <View style={{marginTop: -7}}>
                            <Caption>
                            {
                                (this.props.item.companies.items.length > 0) 
                                ? `${this.props.item.companies.items[0].name}`
                                : null
                            }
                            </Caption>
                        </View> 
                        <View style={{marginTop: -8}}>
                            <Caption>
                                {
                                    (this.props.item.district && this.props.item.province) 
                                    ? `${this.props.item.district} , ${this.props.item.province}`
                                    : (this.props.item.district && !this.props.item.province) 
                                        ? `${this.props.item.district}`
                                        : (!this.props.item.district && this.props.item.province) 
                                            ? `${this.props.item.province}`
                                            : ``
                                }
                            </Caption>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
      );
    }
}


class DirectoryListView extends React.Component  {

    state = {
        listUsers: {
            data: initLists
                    
        },
        beforeGroup: this.props.listUsers
    }

    timer = null;

    componentDidMount() {
        // console.log(this.props.listUsers);
        // console.log(this.state.listUsers.data);
        let mixedBlockUser = [...this.props.listUserBlocks, ...this.props.listUserWhoBlockCurrentUser];
        // console.log(mixedBlockUser)
        let hideUsers = mixedBlockUser.map((item)=>item.blockUserId);
        // console.log('hideusers' , hideUsers)
        this.setState({
            listUsers: {
                data: Object.assign(
                    {} , 
                    initLists , 
                    _(this.props.listUsers)
                    .filter((user)=>!_.isNull(user.firstName) && !_.isNull(user.lastName) && user.id.toLowerCase() !== 'admin')
                    .filter((user)=>!hideUsers.includes(user.id))
                    .orderBy(['firstName'],['asc'])
                    .groupBy( user => user.firstName.substring(0,1).toUpperCase())
                    .value()
                )
            },
            beforeGroup : this.props.listUsers
        })
    }
    searchUser = (text) => {
        clearTimeout(this.timer);
        if(text) {
            this.timer = setTimeout(()=>{
                let listUsers = _(this.state.beforeGroup);
                listUsers = listUsers
                            .filter((user)=>!_.isNull(user.firstName) && !_.isNull(user.lastName) && user.id.toLowerCase() !== 'admin')
                            .filter((item)=>{
                                return item.firstName.toLowerCase().includes(text.toLowerCase()) || item.lastName.toLowerCase().includes(text.toLowerCase())
                            })
                            .value();
                this.setState({
                    listUsers: {
                        data: Object.assign(
                            {} , 
                            initLists , 
                            _(listUsers)
                            .orderBy(['firstName'],['asc'])
                            .groupBy( user => user.firstName.substring(0,1).toUpperCase())
                            .value()
                        )
                    }
                })
            },500)
        } else {
            let listUsers = _(this.state.beforeGroup);
                listUsers = listUsers
                            .filter((user)=>!_.isNull(user.firstName) && !_.isNull(user.lastName) && user.id.toLowerCase() !== 'admin')
                            .value();
                this.setState({
                    listUsers: {
                        data: Object.assign(
                            {} , 
                            initLists , 
                            _(listUsers)
                            .orderBy(['firstName'],['asc'])
                            .groupBy( user => user.firstName.substring(0,1).toUpperCase())
                            .value()
                        )
                    }
                })
        }
    }

    render() {
        return (
            <ScrollView style={{marginBottom: 10 , flex: 1}}>
                 <View styleName="horizontal h-center" style={{padding: 5 , marginBottom : 20}}>
                    <View style={{flex: 0.9 , borderBottomWidth: 0.5 , borderBottomColor: '#ccc'}}>
                        <TextInput 
                            onChangeText={this.searchUser}
                            placeholder="Search"
                        />
                    </View>
                </View>
                <AlphabetListView 
                    data={this.state.listUsers.data}
                    cell={Cell}
                    cellHeight={100}
                    sectionListItem={SectionItem}
                    sectionHeader={SectionHeader}
                    headerHeight={22.5}
                    onCellSelect={(user)=>{
                        if(this.props.onCellSelect) this.props.onCellSelect(user);
                    }}
                    hideSectionList={true}
                />
            </ScrollView>
        )
    }
}


const mapStateToProps = state => ({
    listUsers : state.user.listUsers,
    listUserBlocks: state.user.listUserBlocks,
    listUserWhoBlockCurrentUser: state.user.listUserWhoBlockCurrentUser
})

export default connect(mapStateToProps)(DirectoryListView);