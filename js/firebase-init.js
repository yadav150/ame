// js/firebase-init.js
// Firebase initialization using CDN compat SDKs
const firebaseConfig = {
  apiKey: "AIzaSyBLX-DBrAZZgi7OGRW3-oeno0PJsZ9hzEg",
  authDomain: "its-me-ame.firebaseapp.com",
  projectId: "its-me-ame",
  storageBucket: "its-me-ame.firebasestorage.app",
  messagingSenderId: "832380884001",
  appId: "1:832380884001:web:0c9239588ceb8d8995bf60",
  measurementId: "G-L12EEJG7L9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
