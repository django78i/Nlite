// import * as functions from 'firebase-functions';

// // // Start writing Firebase Functions
// // // https://firebase.google.com/docs/functions/typescript
// //
// // export const helloWorld = functions.https.onRequest((request, response) => {
// //   functions.logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

// import * as admin from 'firebase-admin';
// admin.initializeApp();
// // const db = admin.firestore();

// // Sendgrid Config
// import * as sgMail from '@sendgrid/mail';

// const API_KEY = functions.config().sendgrid.key;
// const TEMPLATE_ID = functions.config().sendgrid.template;
// sgMail.setApiKey(API_KEY);


// // Sends email to user after signup
// export const welcomeEmail = functions.firestore.document('/users/{uid}').onWrite(async (change) => {

//     //const snapshot = change.after;
//     console.log('TemplateID'+TEMPLATE_ID);
//     console.log('APIKey'+API_KEY);
//     //const val = snapshot;

//     const msg = {
//         // to: user.email,
//         to: 'dmoustapha@hotmail.fr',
//         from: 'hello@fireship.io',
//         templateId: TEMPLATE_ID,
//         // dynamic_template_data: {
//         //     // subject: 'Welcome to my awesome app!',
//         //   //  name: user.displayName,
//         // },
//     };

//     return sgMail.send(msg);

// });

