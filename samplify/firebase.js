const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount =  require('./samplify-4ad35-a91d829900b3.json');

// const firebaseConfig = {
//     apiKey: "AIzaSyDQ-PZGYrgs0kmqoFDOSiz9FtFf10WQ0fg",
//     authDomain: "samplify-4ad35.firebaseapp.com",
//     databaseURL: "https://samplify-4ad35-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "samplify-4ad35",
//     storageBucket: "samplify-4ad35.appspot.com",
//     messagingSenderId: "611779178684",
//     appId: "1:611779178684:web:2fd323298e0ba24f04e0b9",
//     measurementId: "G-DGYHP8WEEB"
// };

initializeApp({
    credential: cert(serviceAccount)
});
  
const db = getFirestore();
module.exports = db;