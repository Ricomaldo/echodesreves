// Initialiser Firebase (remplacer par votre config)
const firebaseConfig = {
  apiKey: "AIzaSyAMRZ9XTk2tQ0erwkH6Z6nsAY8mlJiJCyI",
  authDomain: "echodesreves-55484.firebaseapp.com",
  projectId: "echodesreves-55484",
  storageBucket: "echodesreves-55484.appspot.com",
  messagingSenderId: "1045743649044",
  appId: "1:1045743649044:web:3cdca072730b9aad9ac201",
  measurementId: "G-3GYJDXK5VR"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  firebase.initializeApp(firebaseConfig);
  
  // Références à la base de données
  const db = firebase.firestore();
  
  // Fonction pour afficher les sessions d'un utilisateur
  function displaySessions(person) {
    // Ici, vous ajouterez la logique pour récupérer et afficher les sessions depuis Firebase.
  }
  
  // Fonction pour ajouter une session
  function addSession(person) {
    // Ici, vous ajouterez la logique pour ajouter une session à Firebase.
  }
  
  // Fonction pour afficher les objectifs d'un utilisateur
  function displayObjectives(person) {
    // Ici, vous ajouterez la logique pour récupérer et afficher les objectifs depuis Firebase.
  }
  
  // Fonction pour ajouter un objectif
  function addObjective(person) {
    // Ici, vous ajouterez la logique pour ajouter un objectif à Firebase.
  }
  
  // Ajouter des événements pour les boutons (vous pourrez ajouter la logique plus tard)
  document.getElementById('add-session-eric').addEventListener('click', () => {
    // Ajouter la fonction d'ajout de session ici
  });
  
  document.getElementById('add-session-jezabel').addEventListener('click', () => {
    // Ajouter la fonction d'ajout de session ici
  });
  
  document.getElementById('add-objectif-eric').addEventListener('click', () => {
    // Ajouter la fonction d'ajout d'objectif ici
  });
  
  document.getElementById('add-objectif-jezabel').addEventListener('click', () => {
    // Ajouter la fonction d'ajout d'objectif ici
  });
  