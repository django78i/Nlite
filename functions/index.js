const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.notifyUser = functions.firestore
    .document('messages/{messageId}')
    .onCreate((snap, context) => {

        const messages = snap.data();
        const userId = messages.recipientId;



        // const payload = {
        //     notification: {
        //         title: 'nouveaux message',
        //         body: `${message.sendername} vous a envoyer un message`
        //     },
        //     token : '',
        //     webpush : {
        //         fcmOptions : {
        //             link : "http://localhost:4200/"
        //         }
        //     }
        // }

        const db = admin.firestore();
        const userRef = db.collection('users').doc(userId);

        return userRef.get()
            .then(snsapshot => snsapshot.data())
            .then(user => {
                const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : [];
                const message = {
                    token: `${tokens}`,
                    notification: {
                        title: 'nouveaux message',
                        body: `${messages.sendername} vous a envoyer un message`
                    },
                    webpush: {
                        fcmOptions: {
                            link: "http://localhost:4200/"
                        }
                    }
                };
                if (!tokens.length) {
                    throw new Error('User does not have any tokens!')
                }

                // payload.token = tokens;
                return admin.messaging().send(message)
                // return admin.messaging().sendToDevice(tokens, payload)
            })

            .catch(err => console.log(err))

    });


exports.rdvNotify = functions.firestore
    .document('users/{userId}/rdv/{rdvId}')
    .onCreate((snap, context) => {

        const message = snap.data();
        const userId = message.contact.freeUid;

        const payload = {
            notification: {
                title: 'Vous avez reçus un nouveau rendez-vous',
                body: `${message.contact.prenomClient} à pris rendez-vous`
            }
        }


        const db = admin.firestore();
        const userRef = db.collection('users').doc(userId);

        return userRef.get()
            .then(snsapshot => snsapshot.data())
            .then(user => {
                const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []

                if (!tokens.length) {
                    throw new Error('User does not have any tokens!')
                }

                return admin.messaging().sendToDevice(tokens, payload)
            })

            .catch(err => console.log(err))

    });
