class PushNotificationService {
    send({to , title = "" , body = "" , data = {}}) {
        return fetch(`https://exp.host/--/api/v2/push/send` , {
            headers: {
                'host': 'exp.host',
                'accept' : 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            },
            method: 'POST' ,
            body: JSON.stringify({to , title , body , data ,sound: "default", priority: "high"})
        })
    }
}

const pushNotificationSevice = new PushNotificationService();

Object.freeze(pushNotificationSevice);

export default pushNotificationSevice;