import React from 'react';
import HomeSearchScreen from '../components/HomeSearch';
import { onStateChange } from './utils';
import { listPosts } from '../graphql/queries';
import { API , graphqlOperation } from 'aws-amplify';

class HomeSearchContainer extends React.Component {
    static navigationOptions = { 
        header: null  ,
        // drawerLabel: 'Home',
    };

    state = {
        submitSearch: false,
        loading: false ,
        searchText: '',
        posts: [] , 
        nextToken: ''
    }

    loadMore = false

    onSearch = async() => {
        if(!this.state.searchText) {
            await this.setState({
                posts: [],
                nextToken: ''
            })
            return;
        }
        await this.setState({loading: true , submitSearch: true});
        let filter = {
            or: [
                {
                    content: {
                        contains: this.state.searchText
                    }
                },
                {
                    tags: {
                        contains: this.state.searchText
                    }
                }
            ]
        }
        let posts = await API.graphql(graphqlOperation(listPosts , {filter}));
        await this.setState({posts: posts.data.listPosts.items , nextToken: posts.data.listPosts.nextToken ,loading: false})
    }

    loadMore = async() => {
        if(this.state.nextToken && !this.loadMore) {
            this.loadMore = true;
            let loadMorePosts = await API.graphql(graphqlOperation(listPosts , {nextToken: this.state.nextToken}));
            await this.setState((prevState)=>{
                prevState.posts = [...this.state.posts , ...loadMorePosts.data.listPosts.items];
                prevState.nextToken = loadMorePosts.data.listPosts.nextToken;
                return prevState
            });
            this.loadMore = false;
        }
        
    }


    render() {
        return <HomeSearchScreen 
                    {...this.props} 
                    state={this.state} 
                    onStateChange={onStateChange.bind(this)} 
                    onSearch={this.onSearch}
                    onLoadMore={this.loadMore} 
                />;
    }
}

export default HomeSearchContainer;

