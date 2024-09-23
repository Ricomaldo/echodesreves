// ID de la feuille Google Sheets et clé API
const SHEET_ID = "1I-K-gzyfC2kKemyDVMk4XdySBWFXD5Fohp1FrtXCsIQ";
const API_KEY = "AIzaSyDO4nSbdDsfTy-F8KEOlodyhQRYBAJmYNM";

// URL pour récupérer les sessions
const SESSION_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sessions?key=${API_KEY}`;


// Fonction pour récupérer les sessions depuis Google Sheets
async function fetchSessions() {
    try {
        const response = await fetch(SESSION_URL);
        const data = await response.json();
        
        // Vérifier si les données sont bien récupérées
        if (!data.values) {
            console.error("Erreur : Aucune donnée récupérée");
            return [];
        }
        
        console.log("Données récupérées : ", data.values); // Affiche les données récupérées dans la console
        return data.values; // Retourner les valeurs des sessions récupérées
    } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
    }
}

// Fonction pour afficher les sessions dans le DOM, filtrées par personne
function displaySessions(sessions, person, containerClass) {
    const sessionContainer = document.querySelector(containerClass);
    sessionContainer.innerHTML = ''; // Vider le contenu existant
    
    // Filtrer et afficher les sessions de la personne spécifiée
    sessions.forEach(session => {
        if (session[3] === person) { // La colonne 3 est celle qui contient la "Personne"
            const sessionCard = document.createElement('div');
            sessionCard.classList.add('card', 'session-card');
            sessionCard.innerHTML = `
                <h3>${session[0]} - ${session[1]}</h3>
                <p>Status: ${session[1]}</p>
                <p>Notes: ${session[2]}</p>
                <button>Prendre des Notes</button>
            `;
            sessionContainer.appendChild(sessionCard);
        }
    });
}

// Récupérer et afficher les sessions pour "Eric"
fetchSessions().then(sessions => {
    displaySessions(sessions, "Eric", ".sessions-eric"); // Filtrer et afficher les sessions d'Eric
});

// Récupérer et afficher les sessions pour "Jezabel"
fetchSessions().then(sessions => {
    displaySessions(sessions, "Jezabel", ".sessions-jezabel"); // Filtrer et afficher les sessions de Jezabel
});

// URL pour récupérer les objectifs (avec la bonne clé API)
const OBJECTIVE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Objectifs?key=${API_KEY}`;

// Fonction pour récupérer les objectifs depuis Google Sheets
async function fetchObjectives() {
    try {
        const response = await fetch(OBJECTIVE_URL);
        const data = await response.json();
        
        // Vérifier si les données sont bien récupérées
        if (!data.values) {
            console.error("Erreur : Aucune donnée récupérée pour les objectifs");
            return [];
        }
        
        console.log("Données des objectifs récupérées : ", data.values); // Affiche les données récupérées dans la console
        return data.values; // Retourner les valeurs des objectifs récupérées
    } catch (error) {
        console.error("Erreur lors de la récupération des objectifs : ", error);
    }
}

// Fonction pour afficher les objectifs dans le DOM
function displayObjectives(objectives, person, containerClass) {
    const objectiveContainer = document.querySelector(containerClass);
    objectiveContainer.innerHTML = ''; // Vider le contenu existant
    
    // Filtrer et afficher les objectifs de la personne spécifiée
    objectives.forEach(objective => {
        if (objective[4] === person) { // La colonne 4 est celle qui contient la "Personne"
            const objectiveCard = document.createElement('div');
            objectiveCard.classList.add('card', 'objectif-card');
            objectiveCard.innerHTML = `
                <h3>${objective[0]}</h3> <!-- Nom de l'objectif -->
                <p>Priorité: ${objective[1]}</p> <!-- Priorité -->
                <p>Statut: ${objective[3]}</p> <!-- Statut -->
                <div class="progress-bar">
                    <div class="progress" style="width: ${objective[2]}%;">${objective[2]}%</div> <!-- Progression -->
                </div>
                <button>Marquer comme Terminé</button>
            `;
            objectiveContainer.appendChild(objectiveCard);
        }
    });
}

// Récupérer et afficher les objectifs pour "Eric"
fetchObjectives().then(objectives => {
    displayObjectives(objectives, "Eric", ".objectifs-eric"); // Filtrer et afficher les objectifs d'Eric
});

// Récupérer et afficher les objectifs pour "Jezabel"
fetchObjectives().then(objectives => {
    displayObjectives(objectives, "Jezabel", ".objectifs-jezabel"); // Filtrer et afficher les objectifs de Jezabel
});
