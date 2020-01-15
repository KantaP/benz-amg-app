
import SendBird from 'sendbird';

class SendBirdService {
    constructor() {
        this.appId = 'ACAF974F-C0BD-49CD-B782-D7A95CF2612F'
        this.appToken = 'c770d11cb182de628db4a89b6be2d422dcfe112b';
        this.defaultProfileUrl = 'https://resources-static.s3-ap-southeast-1.amazonaws.com/images/user-blank.jpg';
        this.sb =  new SendBird({appId: this.appId});
    }

    get() {
        // console.log('Sendbird instance' , SendBird.getInstance());
        return SendBird.getInstance();
    }

    createUser({user_id , nickname , profile_url}) {
        return fetch(`https://api-${this.appId}.sendbird.com/v3/users`,{
            method:'POST',
            body: JSON.stringify({user_id , nickname , profile_url}),
            headers: {
                'Content-Type': 'application/json, charset=utf8',
                'Api-Token' : this.appToken
            }
        })
        .then((res)=>res.json());
    }

    createChannel = ({receiverId}) => {
        return new Promise((resolve ,reject) => {
            this.sb.GroupChannel.createChannelWithUserIds(
                receiverId ,
                true ,
            function (channel, error) {
                if (error) {
                    console.log('Create GroupChannel Fail.', error);
                    reject(error.message);
                }
                resolve(channel);
            });
        })
    }

    getListGroupChannel = () => {
        return new Promise((resolve , reject) => {
            const channelListQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
            channelListQuery.includeEmpty = false;
            channelListQuery.limit = 20;    // The value of pagination limit could be set up to 100.

            if (channelListQuery.hasNext) {
                channelListQuery.next((channelList, error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(channelList);
                });
            }
        });
    }

    updateProfile = (user_id, {nickname , profile_url}) => {
        if(profile_url === null || !profile_url) {
            profile_url = this.defaultProfileUrl;
        }
        return fetch(`https://api-${this.appId}.sendbird.com/v3/users/${user_id}` , {
            headers: {
                'Content-Type': 'application/json, charset=utf8',
                'Api-Token' : this.appToken
            },
            method: 'PUT' ,
            body: JSON.stringify({nickname , profile_url})
        })
        .then((res)=>res.json());
    }

    connect(userId) {
        this.sb.connect(userId);
    }
}

const sendBirdService = new SendBirdService();

Object.freeze(sendBirdService);

export default sendBirdService;