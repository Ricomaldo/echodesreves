// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAMRZ9XTk2tQ0erwkH6Z6nsAY8mlJiJCyI",
    authDomain: "echodesreves-55484.firebaseapp.com",
    projectId: "echodesreves-55484",
    storageBucket: "echodesreves-55484.appspot.com",
    messagingSenderId: "1045743649044",
    appId: "1:1045743649044:web:3cdca072730b9aad9ac201",
    measurementId: "G-3GYJDXK5VR"
  };
  
  // Initialiser Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialiser Analytics
  if (typeof firebase.analytics === "function") {
    firebase.analytics();
  }
  
  // Initialiser Firestore
  const db = firebase.firestore();
  