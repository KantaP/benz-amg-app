import React from 'react';
import TagSearchScreen from '../components/TagSearch';
import { onStateChange } from './utils';
class TagSearchContainer extends React.Component {
    static navigationOptions = { header: null };
    state = {
        tags: [] ,
        search: '' ,
        tagText: ''
    }
    onAddTag = () => {
        // console.log(this.props.navigation.state.params)
        if(this.props.navigation.state.params.onAddTag) {
            // console.log('tag' , this.state.tagText);
            this.props.navigation.state.params.onAddTag(this.state.tagText);
            this.props.navigation.goBack();
        }
    }
    onSearch = (text) => {

    }
    render() {
        return <TagSearchScreen onStateChange={onStateChange.bind(this)} onSearch={this.onSearch} state={this.state} onAddTag={this.onAddTag}  />;
    }
}

export default TagSearchContainer;