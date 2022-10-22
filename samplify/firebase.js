const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount =  require('./samplify-4ad35-a91d829900b3.json');

initializeApp({
    credential: cert(serviceAccount)
});
  
const db = getFirestore();
module.exports = db;