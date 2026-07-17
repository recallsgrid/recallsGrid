import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAztE00aD9ynr9su2jBOfdGURI08iMMep4',
  authDomain: 'recallsgrid.firebaseapp.com',
  projectId: 'recallsgrid',
  storageBucket: 'recallsgrid.firebasestorage.app',
  messagingSenderId: '924220851541',
  appId: '1:924220851541:web:a5612636089f47a7435bdc',
  measurementId: 'G-7BVDSJL5LP',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firebaseAnalytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
