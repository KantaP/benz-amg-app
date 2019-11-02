import React from 'react' ;
import {
    Card ,
    View ,
    Text ,
    Image ,
    Button , 
    InlineGallery,
    ImageGalleryOverlay,
    TouchableOpacity,
    Caption
} from '@shoutem/ui';
import { formButtonStyle } from '../styles';
import { Dimensions , Modal , Image as ImageRN , Platform } from 'react-native';
import { FontAwesomeIcon , EntypoIcon, AntDesignIcon , MaterialIcon } from '../Icon';
import ImageZoom from 'react-native-image-pan-zoom';
import moment from 'moment-timezone';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import AlertService from '../../services/AlertService';
import RBSheet from "react-native-raw-bottom-sheet";
import { API, graphqlOperation } from 'aws-amplify';
import { listPostConnects , listPostRadeemSeconds } from '../../graphql/queries';
import toastRefService from '../../services/ToastRefService';
const { width } = Dimensions.get('window');

class PostCard extends React.Component {

    constructor(props) {
        super(props);
        // console.log(this.props.post)
    }

    style = {
        photoNumberBlock : {
            position:'absolute' , 
            top: 5 , 
            right: 5 , 
            backgroundColor:'#ccc' ,
            padding: 5 ,
            borderRadius: 5
        } , 
        iconInStack: {
            width: 22 , 
            height: 22 , 
            borderRadius: 11 , 
            // paddingVertical: 5 , 
            display:'flex',
            flexDirection:'row',
            justifyContent: 'center',
            // paddingHorizontal: 6 , 
            backgroundColor:'#C43835' ,
            marginRight: 5
        },
        stack :{ 
            marginLeft: 5
        } ,
        actionButton : {
            borderColor: '#eee' ,
            borderTopWidth: 0.5,
            borderLeftWidth: 0.4,
            borderRightWidth: 0.4,
            borderBottomWidth: 0,
            padding: 0,
            height: 40,
        }
    }

    timer = null;
    updatePost = null;
    createPostImage = null;
    onCreatePostRadeem = null;
    setSheetRef = null;
    state = {
        imageViewModelVisible: false ,
        imageViewSelectedSource: null ,
        photoIndexSelected: 0 ,
        bookmark: false ,
        bookmarkId: "",
        radeemViewModalVisible: false,
        imageViewWidth: 0,
        imageViewHeight: 0,
        showPivilege: false,
    }

    shouldComponentUpdate(nextProps , nextState) {
        if(nextProps.post !== this.props.post) return true; 
        if(this.state.bookmark !== nextState.bookmark) return true;
        if(this.state.imageViewModelVisible !== nextState.imageViewModelVisible) return true;
        if(this.state.radeemViewModalVisible !== nextState.radeemViewModalVisible) return true;
        if(this.state.photoIndexSelected !== nextState.photoIndexSelected) return true;
        return false;
    }
    
    
    componentDidMount() {
        let { onUpdatePost , onCreatePostImage  } = this.props;
        if(onUpdatePost) this.updatePost = onUpdatePost();
        if(onCreatePostImage) this.createPostImage = onCreatePostImage();


        if(this.props.post.postBookmarks.items.length > 0) {
            // console.log('bookmark id' , this.props.post.postBookmarks.items[0].id);
            this.setState({bookmark: true , bookmarkId: this.props.post.postBookmarks.items[0].id});
        }
        // if(
        //     Array.isArray(this.props.post.bookmarks) &&
        //     this.props.post.bookmarks.includes(this.props.userProfile.id)
        //   )
        // {
        //     // console.log(this.props.post.id);
        //     this.setState({bookmark: true});
        // }
    }

    componentWillUnmount() {
        this.updatePost();
        this.createPostImage();
    }

    onBookmark = () => {
        this.setState({bookmark: !this.state.bookmark} , () => {
            if(this.state.bookmark) {
                // create bookmark
                let bookmarkId = uuidv4();
                this.props.createBookmark({
                    id: bookmarkId,
                    userBookmarkCode: this.props.userProfile.id,
                    postBookmarkPostBookmarkId: this.props.post.id ,
                    postBookmarkUserBookmarkId: this.props.userProfile.id
                })
                .then((result)=>{
                    // console.log('add bookmark');
                    this.setState({bookmarkId: bookmarkId});
                    this.props.updatePost({
                        id: this.props.post.id,
                        countBookmark: this.props.post.countBookmark + 1 || 1
                    })
                })
            } else {
                this.props.deleteBookmark({
                    id: this.state.bookmarkId,
                    userBookmarkCode: this.props.userProfile.id
                })
                .then((result)=>{
                    this.props.updatePost({
                        id: this.props.post.id,
                        countBookmark: this.props.post.countBookmark - 1
                    })
                    this.setState({bookmarkId: ""});
                    // console.log('delete bookmark ' , result);
                })
            }
        })
    }

    onRadeem = async() => {
        try {
            // if(this.props.post.postRadeem.items.length > 0) {
            //     toastRefService.get().show('You used this redeemed already.');
            //     return false;
            // }
            this.props.createPostRadeem({
                id: uuidv4(),
                postId: this.props.post.id ,
                userId:  this.props.userProfile.id,
                postRadeemSecondPostRadeemId: this.props.post.id ,
                postRadeemSecondUserRadeemId: this.props.userProfile.id
            })
            .then(()=>{
                this.props.updatePost({
                    id: this.props.post.id,
                    countRadeem: this.props.post.countRadeem + 1
                })
                toastRefService.get().show('Use redeem success.');
            })
            .catch((error)=>{
                toastRefService.get().show('Something went wrong.');
            })
        }catch(error){
            toastRefService.get().show('Something went wrong.');
        }
    }

    indexSelected = async(index) => {
        await this.setState({photoIndexSelected : index});
    }

    onViewImage = () => {
        // let photoSource = this.state.photos[this.state.photoIndexSelected].source;
        let photoSource = { uri : this.props.post.postImages.items[this.state.photoIndexSelected].uri }
        ImageRN.getSize( photoSource, async( Width, Height ) =>
        {
            // console.log('img width'  , Width) ;
            // console.log('img Height'  , Height)
            await this.setState({
                imageViewModelVisible: true , 
                imageViewSelectedSource: photoSource , 
                imageViewHeight: (Width * 30) / 100, 
                imageViewWidth: (Height * 30) / 100
            })

        },(errorMsg) =>
        {
            console.log( errorMsg );
        });
        
    }

    onCloseViewImage = () => {
        this.setState({imageViewModelVisible: false , imageViewHeight: 0 , imageViewWidth: 0});
    }

    onCloseViewRadeem = () => {
        this.setState({radeemViewModalVisible: false});
    }

    renderImageOverlayGallery = (photos , index) => {
        return (
            <ImageGalleryOverlay 
                title={photos.title} 
                description={photos.description}
            />
        )
    }

    

    render() {
        let photos = []
        if(this.props.post.postImages) {
           photos  = this.props.post.postImages.items.map((item)=>{
                return {source: { uri: item.uri}}
            });
        }
        
        // console.log(photos);
        // console.log(this.props.post.postOfUser);
       return ( 
       <Card style={{width , flex: 1 , borderBottomWidth: 10 , borderBottomColor:'#eee'}}>
           {/* Card header */}
            <View styleName="horizontal v-center space-between" style={{paddingLeft: 0 , paddingRight: 0}}>
                <View styleName="horizontal v-center" style={{paddingLeft: 5}}>
                    <View
                        styleName="horizontal h-center v-center"
                        style={{
                            width: 50 , 
                            height: 50 , 
                            borderRadius: 25 ,
                            borderWidth: (this.props.post.type === 'broadcast' || this.props.post.type === 'privilege') ? 3 : 0,
                            borderColor:'#C43835',
                            overflow: 'hidden' 
                            // backgroundColor:'#000', 
                        }}
                    >
                       
                            <Image 
                                style={{
                                    backgroundColor:'#000',
                                    width: 48 , 
                                    height: 48 , 
                                    borderRadius: 48 / 2,
                                    flex: 1
                                }}
                                resizeMode="contain"
                                source={
                                    (this.props.post.type === 'broadcast' || this.props.post.type === 'privilege')
                                    ? require('../../assets/images/logo.png')
                                    : (this.props.post.postOfUser.image) 
                                        ? { uri : this.props.post.postOfUser.image }
                                        : require('../../assets/images/user-blank.jpg')
                                }
                            />
                       
                    </View>
                    
                    <View styleName="vertical" style={{marginLeft : 20}}>
                        {
                            (this.props.post.type === 'broadcast' || this.props.post.type === 'privilege') 
                            ? <Text>AMG Club Thailand</Text>
                            : <Text>{this.props.post.postOfUser.firstName} {this.props.post.postOfUser.lastName}</Text>
                        }
                        
                        <View style={{marginTop: -7}}><Caption>{moment(this.props.post.createdAt).local().fromNow()}</Caption></View>
                    </View>
                </View>
                {
                    //  Activity Tab
                    (
                        (this.props.userProfile.id !== this.props.post.owner) &&
                        (this.props.showActivityTab)
                    ) &&
                    (
                        <View styleName="horizontal">
                            <Button onPress={()=>{
                                this.props.navigation.push('Report' , {postId: this.props.post.id});
                            }}>
                               <View
                                styleName="horizontal h-center v-center"
                                style={{
                                    backgroundColor:'#fff',
                                    padding: 3,
                                    borderRadius:17.5,
                                    width:35,
                                    height:35,
                                }}
                                >
                                    <FontAwesomeIcon 
                                        style={{fontSize: 16}} 
                                        name="bookmark-o" 
                                    />
                                </View>
                            </Button>
                            <Button 
                            onPress={()=>{
                                this.onBookmark();
                            }}>
                                <View
                                styleName="horizontal h-center v-center"
                                style={{
                                    // backgroundColor:(this.state.bookmark) ? '#C43835' : '#ccc',
                                    padding: 3,
                                    borderRadius:17.5,
                                    width:35,
                                    height:35,
                                }}
                                >
                                    <FontAwesomeIcon 
                                        style={{fontSize: 16,color:this.state.bookmark ? '#C43835' : '#000'}} 
                                        name={this.state.bookmark?'heart' :'heart-o'} 
                                    />
                                </View>
                                
                            </Button>
                        </View>
                    )
                }
                {
                    (this.props.userProfile.id === this.props.post.owner) &&
                    (
                        <View styleName="horizontal">
                            <Button onPress={()=>{
                                this.setSheetRef.open();
                            }}>
                                <EntypoIcon style={{fontSize: 16}} name="dots-three-vertical" />
                            </Button>
                        </View>
                    )
                }
            </View>
            {/* Card body */}
            <View styleName="vertical" style={{padding: 0 , margin:0 }}>
                {/* Image gallery */}
                {
                    this.props.post.postImages.items.length > 0 &&
                    [
                        <View style={{padding: 0}}>
                            <InlineGallery 
                                data={photos}
                                styleName="large-wide"
                                onIndexSelected={this.indexSelected}
                                onPress={this.onViewImage}
                                // renderImageOverlay={this.renderImageOverlayGallery}
                            />
                        </View> ,
                        <View style={this.style.photoNumberBlock}>
                            <Text>{(this.state.photoIndexSelected + 1)}/{this.props.post.postImages.items.length}</Text>
                        </View>
                    ]
                }

                {
                    this.props.post.type === 'privilege' &&
                    (
                        <View styleName="horizontal v-center space-between" style={{backgroundColor:'#eee' ,padding: 5}}>
                            <View styleName="horizontal  v-center"  style={this.style.stack}>
                                <View styleName="horizontal v-center" style={this.style.iconInStack}>
                                    <MaterialIcon name="content-cut" style={{fontSize: 12 , color:'#fff'}} />
                                </View>
                                <Caption>EXP {moment(this.props.post.expireRedeemAt).format('DD/MM/YYYY')}</Caption>
                            </View>
                            <View styleName="horizontal  v-center"  style={this.style.stack}>
                                <View styleName="horizontal v-center" style={this.style.iconInStack}>
                                    <FontAwesomeIcon name="user" style={{fontSize: 12 , color:'#fff'}} />
                                </View>
                                <Caption>Quata {this.props.post.countRadeem || 0}/{this.props.post.radeemQuota}</Caption>
                            </View>
                            
                            {
                                (moment(this.props.post.expireRedeemAt).isAfter(moment())) 
                                ? (this.props.post.postRadeem.items.length > 0)
                                
                                    ? (
                                        
                                        <View 
                                        styleName="horizontal  v-center h-end"  
                                        style={Object.assign({} , 
                                        this.style.stack, 
                                        {
                                            backgroundColor:'#C43835' , 
                                            paddingHorizontal: 7,
                                            borderRadius: 10
                                        })}>
                                            <View styleName="horizontal v-center" style={this.style.iconInStack}>
                                                <AntDesignIcon name="gift" style={{fontSize: 12 , color:'#fff'}} />
                                            </View>
                                            <Caption style={{color:'#fff'}}>Redeemed</Caption>
                                        </View>
                                    )
                                    : (
                                        <TouchableOpacity
                                            onPress={()=>{
                                                
                                                this.setState({radeemViewModalVisible: true}, ()=>{
                                                    // console.log('open redeem')
                                                })
                                            }}
                                        >
                                            <View 
                                            styleName="horizontal  v-center h-end"  
                                            style={Object.assign({} , 
                                            this.style.stack, 
                                            {
                                                backgroundColor:'#C43835' , 
                                                paddingHorizontal: 7,
                                                borderRadius: 10
                                            })}>
                                                <View styleName="horizontal v-center" style={this.style.iconInStack}>
                                                    <AntDesignIcon name="gift" style={{fontSize: 12 , color:'#fff'}} />
                                                </View>
                                                <Caption style={{color:'#fff'}}>Redeem Now</Caption>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                : 
                                (
                                    <View 
                                        styleName="horizontal  v-center h-end"  
                                        style={Object.assign({} , 
                                        this.style.stack, 
                                        {
                                            backgroundColor:'#C43835' , 
                                            paddingHorizontal: 7,
                                            borderRadius: 10
                                        })}>
                                            <View styleName="horizontal v-center" style={this.style.iconInStack}>
                                                <AntDesignIcon name="gift" style={{fontSize: 12 , color:'#fff'}} />
                                            </View>
                                            <Caption style={{color:'#fff'}}>Expired</Caption>
                                        </View>
                                )
                            }
                        </View> 
                    )
                }
                
                
                {/* Content */}
                <View style={{marginTop: 8 , paddingHorizontal: 11}}>
                    <Text>
                        {this.props.post.content}
                    </Text>
                </View>
                {/* status icon */}
                <View styleName="horizontal v-center" style={{paddingHorizontal: 5 , marginTop: 8}}>
                    {
                        this.props.post.enableComment &&
                        (
                            <View styleName="horizontal  v-center">
                                <View styleName="horizontal v-center" style={this.style.iconInStack}>
                                    <FontAwesomeIcon name="comment" style={{fontSize: 12 , color:'#fff'}} />
                                </View>
                                <Caption>{this.props.post.countComment || 0} Comment</Caption>
                            </View>
                        )
                    }
                    
                    <View styleName="horizontal  v-center"  style={this.style.stack}>
                        <View styleName="horizontal v-center" style={this.style.iconInStack}>
                            <FontAwesomeIcon name="share-alt" style={{fontSize: 12 , color:'#fff'}} />
                        </View>
                        <Caption>{this.props.post.countRefer || 0} Refer</Caption>
                    </View>

                    {
                        this.props.post.type !== 'privilege' &&
                        (
                            <View styleName="horizontal  v-center"  style={this.style.stack}>
                                <View styleName="horizontal v-center" style={this.style.iconInStack}>
                                    <FontAwesomeIcon name="comments" style={{fontSize: 12 , color:'#fff'}} />
                                </View>
                                <Caption>{this.props.post.countConnect || 0} Connected</Caption>
                            </View>
                        )
                    }
                    
                </View>
                {/* action button */}
                {
                    (this.props.showAction) &&
                    (
                        <View styleName="horizontal flexible" style={{padding: 0 , marginTop: 15}}>
                            {
                                this.props.post.enableComment &&
                                (
                                    <Button 
                                    onPress={()=>{
                                        if(this.props.focus !== 'comment') this.props.navigation.push('PostDetail' , {post:this.props.post});
                                    }}
                                    styleName="full-width"
                                     
                                    style={(this.props.focus === 'comment') 
                                            ? Object.assign({} , this.style.actionButton , {backgroundColor:'#C43835'}) 
                                            :this.style.actionButton}>
                                        <FontAwesomeIcon 
                                        name="comment" 
                                        style={{fontSize: 14 , color:(this.props.focus === 'comment')?'#fff':'#C43835'}} />
                                        <Text style={{color:(this.props.focus === 'comment')?'#fff':'#000'}}>Comment</Text>
                                    </Button>
                                )
                            }

                            {/* {
                                this.props.post.type === 'priviledge' && 
                                (
                                    <Button 
                                    styleName="full-width border" 
                                    style={this.style.actionButton}
                                    onPress={()=>{
                                        this.props.navigation.push('ReferTo' , {postId:this.props.post.id});
                                    }}
                                    >
                                        <FontAwesomeIcon name="share-alt" style={{fontSize: 14 , color:'#000'}} />
                                        <Text>Radeem</Text>
                                    </Button>
                                )   
                            } */}
                            
                            <Button 
                                styleName="full-width" 
                                style={this.style.actionButton}
                                onPress={()=>{
                                    this.props.navigation.push('ReferTo' , {ownerPost:this.props.post.owner  ,postId:this.props.post.id , countRefer: this.props.post.countRefer});
                                }}
                            >
                                <FontAwesomeIcon name="share-alt" style={{fontSize: 14 , color:'#C43835'}} />
                                <Text>Refer</Text>
                            </Button>
                            {
                                this.props.post.type !== 'privilege' && 
                                this.props.post.owner !== this.props.userProfile.id &&
                                (
                                    <Button 
                                        onPress={async()=>{
                                            // console.log(this.props.post.postOfUser);
                                            try {
                                                let postConnect = await API.graphql(graphqlOperation(listPostConnects), {
                                                    filter: {
                                                        userId: {
                                                            eq: this.props.userProfile.id
                                                        },
                                                        postId: {
                                                            eq: this.props.post.id
                                                        }
                                                    }
                                                });
                                                if(postConnect.data.listPostConnects.items.length === 0) {
                                                    this.props.createPostConnect({
                                                        userId: this.props.userProfile.id,
                                                        connectUserId: this.props.userProfile.id,
                                                        createdAtUnix: moment().valueOf(),
                                                        postId: this.props.post.id
                                                    })
                                                    this.props.updatePost({
                                                        id: this.props.post.id,
                                                        countConnect: this.props.post.countConnect + 1 || 1
                                                    })
                                                }
                                                this.props.navigation.push('Connect' , {chatTo: this.props.post.owner , pushTo: this.props.post.postOfUser.pushToken});
                                            } catch(error) {
                                                console.log(error);
                                            }
                                            
                                        }}
                                        styleName="full-width" 
                                        style={this.style.actionButton}
                                    >
                                        <FontAwesomeIcon name="comments" style={{fontSize: 14 , color:'#C43835'}} />
                                        <Text>Connect</Text>
                                    </Button>
                                )
                            }
                            
                        </View>
                    )   
                }
                {
                    (!this.props.showAction) &&
                    (
                        <View style={{marginTop: 30}}></View>
                    )
                }
            </View>
            {/* Modal for view image */}
            <Modal
            hardwareAccelerated
            animationType="slide"
            transparent={true}
            visible={this.state.imageViewModelVisible}
            onRequestClose={this.onCloseViewImage}>
                <View styleName="vertical h-start" style={{padding: 0 , paddingTop:15 , backgroundColor:'#000'}}>
                    <View styleName="horizontal" style={{marginTop: 30}}>
                        <Button styleName="clear" onPress={this.onCloseViewImage}>
                            <FontAwesomeIcon name="close" style={{color:'#fff'}}/>
                        </Button>
                    </View>
                    <ImageZoom 
                       cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={400}
                       imageHeight={400}>
                        <Image 
                            style={{width: '100%' , height: undefined , aspectRatio: 135 / 76}}
                            source={this.state.imageViewSelectedSource}
                        />
                    </ImageZoom>
                </View>
            </Modal>
            {/* Privilege Modal */}
            {
                this.props.post.type === 'privilege' &&
                (
                    <Modal
                    hardwareAccelerated
                    animationType="slide"
                    transparent={true}
                    visible={this.state.radeemViewModalVisible}
                    onRequestClose={this.onCloseViewRadeem}>
                        <View styleName="vertical h-start" 
                        style={{
                            padding: 0 ,
                            backgroundColor:'#fff'
                        }}>
                            <View styleName="horizontal" style={{marginTop: 30}}>
                                <Button styleName="clear" onPress={this.onCloseViewRadeem}>
                                    <FontAwesomeIcon name="close" style={{color:'#000'}}/>
                                </Button>
                            </View>
                            <View styleName="horizontal h-center" style={{marginTop: 20 , backgroundColor:'#191919'}}>
                                <Image 
                                    resizeMode="contain"
                                    styleName="large"
                                    // style={{width: '100%' , height: undefined , aspectRatio: 135 / 76}}
                                    source={{uri: this.props.post.redeemImage}}
                                />
                            </View>
                            <View styleName="horizontal" style={{paddingHorizontal: 10 , marginTop: 20}}>
                                <Text>
                                    {this.props.post.redeemDescription}
                                </Text>
                            </View>
                            <View styleName="horizontal h-center" style={{marginTop: 25, alignSelf: 'center'}}>
                                <Button style={formButtonStyle} 
                                onPress={()=>{
                                    AlertService.alert({
                                        title: 'Redeem' ,
                                        content: 'Use redeem?',
                                        buttons: [
                                            {
                                                text: 'Use', 
                                                onPress: () => {
                                                    this.onRadeem();
                                                }
                                            },
                                            {
                                                text: 'Cancel',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                        ]
                                    })
                                }}>
                                    <Text style={{color:'#fff' , fontWeight: 'bold'}}>REDEEM</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                )
            }
            {/* End */}
            <RBSheet
                ref={(ref)=>this.setSheetRef = ref}
                height={150}
                duration={250}
            >
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.push('EditPost' , { post: this.props.post })
                    }}
                >
                    <View styleName="horizontal" style={{padding: 10}}>
                        <View styleName="horizontal v-start" style={{padding: 5}}>
                            <FontAwesomeIcon style={{fontSize: 20 ,color: '#C43835'}} name="edit" />
                            <View styleName="vertical" style={{marginLeft: 5}}>
                                <Text style={{fontSize: 20}}>Edit</Text>
                                <Caption>
                                    Edit this post
                                </Caption>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{
                        AlertService.alert({
                            title: 'Delete post' ,
                            content: 'Are you sure to delete this post?',
                            buttons: [
                                {
                                    text: 'Delete', 
                                    onPress: () => {
                                        if(this.props.deletePost) {
                                            this.props.deletePost({
                                                id: this.props.post.id
                                            })
                                            
                                        }
                                        this.setSheetRef.close();
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
                    <View styleName="horizontal" style={{padding: 10 , borderBottomWidth: 0.5}}>
                        <View styleName="horizontal v-start" style={{padding: 5}}>
                            <FontAwesomeIcon style={{fontSize: 20 ,color: '#C43835'}} name="trash-o" />
                            <View styleName="vertical" style={{marginLeft: 5}}>
                                <Text style={{fontSize: 20}}>Delete</Text>
                                <Caption>
                                    Delete this post
                                </Caption>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </RBSheet>
        </Card>
       );
    }
}



export default PostCard;