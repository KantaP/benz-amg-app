import React from 'react';
import ReportScreen from '../components/Report';
import { onStateChange } from '../containers/utils';

import { createReport } from '../graphql/mutations';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import ToastRefService from '../services/ToastRefService';

class ReportContainer extends React.Component {
    static navigationOptions = { header: null };
    state = {
        description: "" ,
        selectedType: "" ,
        types: [
            { title: "Please select type"},
            { title: "Fraud" } ,
            { title: "Others" } ,
            { title: "Hate Speech"} ,
            { title: "Unauthorized Sales"} ,
            { title: "Spam" } ,
            { title: "False News"} ,
            { title: "Incorrect Information"} 
        ],
    }
    render() {
        let postId = this.props.navigation.getParam('postId' , "");
        return <ReportScreen {...this.props} postId={postId} onStateChange={onStateChange.bind(this)} state={this.state} />
    }
}

const WithCreateReport = graphql(gql(createReport) , {
    props: props => ({
        createReport: reportItem => {
            props.mutate({
                variables: { input: reportItem }
            })
            .then((result)=>{
                ToastRefService.get().show('Send your report to admin.')
            })
            .catch((error)=>{
                console.log(error);
                ToastRefService.get().show('Something went wrong.')
            })
        }
    })
})(ReportContainer);

const mapStateToProps = (state) => ({
    user: state.user
})

const WithConnect = connect(mapStateToProps)(WithCreateReport)

export default WithConnect;