import admin from 'firebase-admin';
import serviceAccount from './myappfcm-3c6ea-firebase-adminsdk-fbsvc-36c2b3ea25.json'; 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
