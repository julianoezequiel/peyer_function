/**
 * Firebase Cloud Messaging (FCM) can be used to send messages to clients on iOS, Android and Web.
 *
 * This sample uses FCM to send two types of messages to clients that are subscribed to the `news`
 * topic. One type of message is a simple notification message (display message). The other is
 * a notification message (display notification) with platform specific customizations. For example,
 * a badge is added to messages that are sent to iOS devices.
 */
const axios = require('axios');
const { google } = require('googleapis');

const CLIENTE_EMAIL = 'firebase-adminsdk-zbm8z@peyer-e1597.iam.gserviceaccount.com'
const PROJECT_ID = 'peyer-e1597';
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCetbQrn3feIY7O\nLTh6g/Lp4K9ni3lKIhsfb+LP+s0khZ6j29x02Nxa8GMr5EWRW6Iv6gGjsXNNHv7K\nLEyrNz9Bm7GdHN/76UdzQnxhFB3liImmCLYnoxEZOvn1tXf1ufO3z3KQwARrosuZ\nudMpy5tbzYxp44mvvO7ZZps5LEw2/iaWuIKhVhGKSJBeDdgRyRtreBQCvpExiQn4\n8Odxt+Mff/xOM+DOmmDDRPZ0Xw5RDwzw49buZswlrY9HAdm/mizOcbV8d6q/OPbG\nkit/K7SJs9wtYAcJBKaxWefBE7zNTrrUer47B+aY/5A0cE9J0f3jqh6RqhNLlgnm\nY0SSrU9vAgMBAAECggEADfvnpKJX7vgY+5yracwfhrD385Er/ja0GhiDLR0lny6w\n1DJGofsLq22b512lLZIb38noHBLCHIz7GTg/ByUGi1LbGwNUzv72fzbf+7PIkJVv\nv3PsDOEG3CjApoA3UizwxwTdzNhGa298Lg7cBsY8aaHaWeglFRl6GCi8y5RWINAv\nc5uewhUSO40iEq7CrCmNvZklUmqiFRem4M2xaIEleo9PqeLpwtZmu6hjWwR4yt6t\nPzBWZll2y1MUDBWd1ljma8vO+pDRUQLvd4nJTCVsSR0WWVu40VSB5HlFnbur803d\nlQMxu6dEKg7pnEifxUK/5Xc31aUBFuYemrtxyhoyyQKBgQDLCg+EWla1NT+x9L3I\n8wGxI12r6myo3hDT6WE/9CLsx5ZSNXCw54cspwN19aOY5IxhKgneEYNNIN00Sjl4\nayJL6Vx1Mrr+UwYWjZpDN2Ur+GAagbeJTa76LHCB2WVI43e8VWEtkb1DLmBGErue\nVZgrPHG2Ohux0yjyOCQHLCCh+QKBgQDIG4qs8JQEU3d+8uKKi9mS4kDkHQVu9HQz\nSr4KCKEh5CtEY3AOdu2KKGXPWF6tsHOua6ex2wKzOufV2UPOaZrBrQOSgkU5Ueuc\nnbnIOxB70gOxbMqCQFz08A6RMiAuOSjQwBoKt2OxycHRP90qKkRHSIrgIqya+XKW\n8dSNSUpWpwKBgEcCFbsr/PcS0FvkRBtrIURaIgBl0+qa/zedfy1mrHAyvRezKN41\nmsi7ADLY3YYzKAUzNpA7f7gRrksDSmYa0bvKuVMjktIvJwnsK+8mCHQAQVwD0bRr\nPq6vrAk9hnafVti+42WUeqRsK69WDdeqB7XXRc19NQJT3xYXHEKF5EPBAoGAQaQX\nN2erhkfC+Re/jGcXtgEV/D4w3BbAT1sDP9NY1/862jIsPfJxNVLPItcAJ8WsDNkv\npz4KgrSd/B5LCdjGdSXF+DdXcdgXi8aJfM8zNwrLP1ZKj7OBSq+8d5CT0dXaN6/s\nWvuRbm6ab4OdjwlSYHfBZoi5ShTtq+okKTyTcB0CgYA8+Ol4Nuz7bASgBBJ2i9pw\nAQqFo77Dxf8UHAh/rdrkeScygY9JiZFablxPnVkI9ocCZJ9Fm8g1aaUezuOgIbCP\nkq3zc/bV4A6Wnj8Fp6DVRH8zvEgeSr+rKS+FXgEq2Oc9vZecvEpSRMQkVwnAyeMm\nmTFE5mvxe2TrECKl5on5aQ==\n-----END PRIVATE KEY-----\n'


const HOST = 'https://fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const ALL_PATH = 'https://fcm.googleapis.com/v1/projects/' + PROJECT_ID + '/messages:send'

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

/**
 * Get a valid access token.
 */
// [START retrieve_access_token]
function getAccessToken() {
    return new Promise(function (resolve, reject) {
        const jwtClient = new google.auth.JWT(
            CLIENTE_EMAIL,
            null,
            PRIVATE_KEY,
            SCOPES,
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}
// [END retrieve_access_token]


const clientsTokens = ['dHis9LAGTb2LY1OPa9lNVK:APA91bG8j-QaUTGbnixkZqRX8L8nem9BceiaTB1BVD5Gw5fzfaXDz9d3oYuyd1xZideBPXOdgCnJQsXjra_iArSvQj2uHFaTQk8QLsuxxN1YOyMwtWbEguMTeqn5OrfSdxIb53uZ79BZ']

const notificationPaylod = {
    title: 'Titulo Notificação',
    body: 'Corpo notoficação'
}

function sendMessage(baererToken) {
    const metadata = {
        type: 'RECIIVED PIX',
        transactionId: 123
    }


    const notificationData = {
        ...notificationPaylod,
        metadata: JSON.stringify(metadata),
    };

    return Promise.all(
        clientsTokens.map(clientToken => {
            return axios.post(ALL_PATH, {
                validate_only: false,
                message: {
                    data: notificationData,
                    notification: notificationPaylod,
                    token: clientToken
                },
            },
                {
                    headers: {
                        Authorization: `Bearer ${baererToken}`
                    },
                }
            );
        }),
    );

}

(async () => {
    try {
        const tokens = await getAccessToken();

        console.log('tokens', tokens);

        const responses = await sendMessage(tokens)
        console.warn({ responseData: responses.map(response => response.data) })
    } catch (err) {
        console.log(err);

    }
})();


