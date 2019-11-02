import React from 'react';

import {
    View ,
    Text ,
    Image ,
    Title, 
    Caption
} from '@shoutem/ui';
import { TouchableOpacity } from 'react-native';
import { getComment } from '../../graphql/queries';
import gql from 'graphql-tag' ;
import { Query } from 'react-apollo';
// import { Platform } from 'react-native'
// import { Facebook } from 'react-content-loader'

import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from 'react-redux';
import { Mutation } from 'react-apollo';
import { deleteComment , updatePost , createReportComment } from '../../graphql/mutations';
import alertService from '../../services/AlertService';
import toastRefService from '../../services/ToastRefService';
import uuidv4 from 'uuid/v4';
import moment from 'moment-timezone';
import { FontAwesomeIcon , MaterialIcon } from '../Icon';

class CommentItem extends React.PureComponent {
    setSheetRef = null
    render() {
        let { data , updatePost } = this.props;
        
        return [
            <TouchableOpacity
                onLongPress={()=>{
                    this.setSheetRef.open();
                }}
            >
                <View styleName="horizontal v-start" style={{padding: 15 , borderBottomWidth: 0.6 , borderBottomColor: '#ccc'}}>
                    <Image 
                        style={{
                            borderWidth: 0 ,
                            overflow: 'hidden' ,
                            width: 50 ,
                            height: 50 ,
                            borderRadius: 25
                        }}
                        // styleName="medium-avatar"
                        source={
                            (data.getComment.userComment.image)
                            ? { uri: data.getComment.userComment.image}
                            : require('../../assets/images/user-blank.jpg')
                        }
                    />
                    <View styleName="vertical" style={{marginLeft: 15 , padding : 0 , flex : 1}}>
                        <Title>{data.getComment.userComment.firstName} {data.getComment.userComment.lastName}</Title>
                        <Text multiline={true}>
                            {data.getComment.content}
                        </Text>
                        <Caption>
                            {moment(`${data.getComment.createdAt}`).local().fromNow()}
                        </Caption>
                    </View>
                </View>
            </TouchableOpacity>, 
            <RBSheet
                ref={(ref)=>this.setSheetRef = ref}
                height={100}
                duration={250}
                >
                    {
                        (this.props.userProfile.id !== data.getComment.userId) &&
                        (
                            <Mutation mutation={gql(createReportComment)}>
                                {
                                    (createReportComment) => (
                                        <TouchableOpacity 
                                            onPress={()=>{
                                                alertService.alert({
                                                    title: 'Report comment',
                                                    content: 'Are you sure report this comment?',
                                                    buttons: [
                                                        {
                                                            text: 'Report', 
                                                            onPress: () => {
                                                                createReportComment({
                                                                    variables: {
                                                                        input: {
                                                                            id: uuidv4(),
                                                                            commentId: data.getComment.id,
                                                                            reporterId: this.props.userProfile.id ,
                                                                            reportCommentCommentId: data.getComment.id,
                                                                            reportCommentReporterId: this.props.userProfile.id ,
                                                                            createdAtUnix: moment().valueOf(),
                                                                        }
                                                                    }
                                                                })
                                                                .then((result)=>{
                                                                    
                                                                    toastRefService.get().show('Report comment success.')
                                                                    this.setSheetRef.close();
                                                                })
                                                                .catch((error)=>{
                                                                    console.log(error);
                                                                    toastRefService.get().show('Something went wrong.');
                                                                    this.setSheetRef.close();
                                                                })
                                                            }
                                                        },
                                                        {
                                                            text: 'Cancel',
                                                            onPress: () => console.log('Cancel Pressed'),
                                                            style: 'cancel',
                                                        },
                                                    ]
                                                })
                                            }}
                                        >
                                           <View styleName="horizontal v-start" style={{padding: 5}}>
                                                <MaterialIcon style={{fontSize: 20 ,color: '#C43835'}} name="report-problem" />
                                                <View styleName="vertical" style={{marginLeft: 5}}>
                                                    <Text style={{fontSize: 20}}>Report</Text>
                                                    <Caption>
                                                        Report this comment
                                                    </Caption>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            </Mutation>
                        )   
                    }
                    {
                        (this.props.userProfile.id === data.getComment.userId) &&
                        [
                            <Mutation mutation={gql(deleteComment)}>
                                {(deleteComment) => (
                                    <TouchableOpacity
                                        onPress={()=>{
                                            alertService.alert({
                                                title: 'Delete comment',
                                                content: 'Are you sure delete this comment?',
                                                buttons: [
                                                    {
                                                        text: 'Delete', 
                                                        onPress: () => {
                                                            deleteComment({
                                                                variables: {
                                                                    input: {
                                                                        id: this.props.data.getComment.id
                                                                    }
                                                                }
                                                            })
                                                            .then((result)=>{
                                                                console.log('Delete success');
                                                                toastRefService.get().show('Delete comment success.');
                                                                updatePost({
                                                                    variables: {
                                                                        input: {
                                                                            id: this.props.data.getComment.postId,
                                                                            countComment: this.props.data.getComment.postComment.countComment - 1
                                                                        }
                                                                    }
                                                                })
                                                                this.setSheetRef.close();
                                                            })
                                                            .catch((error)=>{
                                                                console.log(error);
                                                                toastRefService.get().show('Something went wrong.');
                                                                this.setSheetRef.close();
                                                            })
                                                        }
                                                    },
                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel',
                                                    },
                                                ]
                                            })
                                        }}
                                    >
                                        <View styleName="horizontal v-start" style={{padding: 5}}>
                                            <FontAwesomeIcon style={{fontSize: 20 ,color: '#C43835'}} name="trash-o" />
                                            <View styleName="vertical" style={{marginLeft: 5}}>
                                                <Text style={{fontSize: 20}}>Delete</Text>
                                                <Caption>
                                                    Remove this comment
                                                </Caption>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </Mutation>,
                            
                        ]
                    }
            </RBSheet>
        ]
    }
}


const mapStateToProps = (state) => ({
    userProfile: state.user.userProfile
})

const CommentItemWithConnect = connect(mapStateToProps)(CommentItem);

const CommentItemWithQuery = ({commentId}) => {
    // console.log('comment' , commentId)
    return (
        <Query query={gql(getComment)} variables={{id: commentId}} fetchPolicy="network-only">
            {
                ({data , loading ,error}) => {
                    if(loading) return null;
                    if(error) {
                        return <Text>{error.message}</Text>
                    }
                    if(!data.getComment) return null;
                    return (
                        <Mutation mutation={gql(updatePost)}>
                            {
                                (updatePost) => (
                                    <CommentItemWithConnect updatePost={updatePost} data={data} {...this.props} />
                                )
                            }
                        </Mutation>
                        
                    )
                }
            }
        </Query>
    )
}


export default CommentItemWithQuery;