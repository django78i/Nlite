const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


var admin = require("firebase-admin");
admin.initializeApp();

exports.sendEmailConfirmation = functions.firestore.document('/users/{uid}').onWrite(async (change) => {

    const snapshot = change.after;

    return admin
        .firestore()
        .collection("mail")
        .add({
            to: "moustdiak@gmail.com",
            message: {
                subject: "Hello from Firebase!",
                text: "This is the plaintext section of the email body.",
                html: "This is the <code>HTML</code> section of the email body.",
            },
        })
        .then(() => console.log("Queued email for delivery!"));

});