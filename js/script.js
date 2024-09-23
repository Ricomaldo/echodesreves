// ID de la feuille Google Sheets et clé API
const SHEET_ID = "1I-K-gzyfC2kKemyDVMk4XdySBWFXD5Fohp1FrtXCsIQ";
const API_KEY = "AIzaSyDO4nSbdDsfTy-F8KEOlodyhQRYBAJmYNM";

// URL pour récupérer les sessions et objectifs
const SESSION_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sessions?key=${API_KEY}`;
const OBJECTIVE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Objectifs?key=${API_KEY}`;

// Fonction pour récupérer les sessions depuis Google Sheets
async function fetchSessions() {
    try {
        const response = await fetch(SESSION_URL);
        const data = await response.json();

        if (!data.values) {
            console.error("Erreur : Aucune donnée récupérée pour les sessions");
            return [];
        }

        return data.values;
    } catch (error) {
        console.error("Erreur lors de la récupération des sessions : ", error);
    }
}

// Fonction pour récupérer les objectifs depuis Google Sheets
async function fetchObjectives() {
    try {
        const response = await fetch(OBJECTIVE_URL);
        const data = await response.json();

        if (!data.values) {
            console.error("Erreur : Aucune donnée récupérée pour les objectifs");
            return [];
        }

        return data.values;
    } catch (error) {
        console.error("Erreur lors de la récupération des objectifs : ", error);
    }
}

// Fonction pour afficher les sessions
function displaySessions(sessions, person, containerClass) {
    const sessionContainer = document.querySelector(`${containerClass} .session-content`);
    sessionContainer.innerHTML = '';

    sessions.forEach(session => {
        if (session[3] === person) {
            const sessionCard = document.createElement('div');
            sessionCard.classList.add('card', 'session-card');
            sessionCard.innerHTML = `
                <h3>${session[0]} - ${session[1]}</h3>
                <p>Status: ${session[1]}</p>
                <p>Notes: ${session[2] || "Pas encore de notes"}</p>
                <button onclick="takeNotes('${session[0]}')">Prendre des Notes</button>
            `;
            sessionContainer.appendChild(sessionCard);
        }
    });
}

// Fonction pour afficher les objectifs
function displayObjectives(objectives, person, containerClass) {
    const objectiveContainer = document.querySelector(`${containerClass} .objectif-content`);
    objectiveContainer.innerHTML = '';

    objectives.forEach(objective => {
        if (objective[4] === person) {
            const objectiveCard = document.createElement('div');
            objectiveCard.classList.add('card', 'objectif-card');
            objectiveCard.innerHTML = `
                <h3>${objective[0]}</h3>
                <p>Priorité: ${objective[1]}</p>
                <p>Statut: ${objective[3]}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${objective[2]}%;">${objective[2]}%</div>
                </div>
                <button>Marquer comme Terminé</button>
            `;
            objectiveContainer.appendChild(objectiveCard);
        }
    });
}

// Fonction pour prendre des notes
function takeNotes(sessionName) {
    const notes = prompt(`Prendre des notes pour ${sessionName}:`);
    if (notes) {
        console.log(`Notes pour ${sessionName} : ${notes}`);
        // Intégration avec Google Sheets à faire ici
    }
}

// Ajouter de nouvelles sessions et objectifs (logique basique pour le moment)
document.getElementById('add-session-eric').addEventListener('click', () => {
    alert('Ajouter une nouvelle session pour Eric');
    // Logique d'ajout de session ici
});

document.getElementById('add-session-jezabel').addEventListener('click', () => {
    alert('Ajouter une nouvelle session pour Jezabel');
    // Logique d'ajout de session ici
});

document.getElementById('add-objectif-eric').addEventListener('click', () => {
    alert('Ajouter un nouvel objectif pour Eric');
    // Logique d'ajout d’objectif ici
});

document.getElementById('add-objectif-jezabel').addEventListener('click', () => {
    alert('Ajouter un nouvel objectif pour Jezabel');
    // Logique d'ajout d’objectif ici
});

// Récupérer et afficher les sessions et objectifs
fetchSessions().then(sessions => {
    displaySessions(sessions, "Eric", ".sessions-eric");
    displaySessions(sessions, "Jezabel", ".sessions-jezabel");
});

fetchObjectives().then(objectives => {
    displayObjectives(objectives, "Eric", ".objectifs-eric");
    displayObjectives(objectives, "Jezabel", ".objectifs-jezabel");
});
