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

// URL pour ajouter des sessions
const SESSION_APPEND_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sessions!A:D:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

// URL pour ajouter des objectifs
const OBJECTIVE_APPEND_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Objectifs!A:E:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

// Fonction pour ajouter une session à Google Sheets depuis le formulaire modal
async function addSession() {
    const date = document.getElementById('session-date').value;
    const status = document.getElementById('session-status').value;
    const notes = document.getElementById('session-notes').value;
    const person = "Eric"; // Personne à ajuster selon le formulaire

    if (date && status) {
        const newSession = [[date, status, notes || "", person]];

        try {
            const response = await fetch(SESSION_APPEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: newSession
                })
            });

            if (response.ok) {
                alert(`Session ajoutée pour ${person}`);
                closeModal('modal-session');
            } else {
                console.error("Erreur lors de l'ajout de la session", await response.json());
                alert("Erreur lors de l'ajout de la session");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête", error);
        }
    } else {
        alert("La date et le statut sont obligatoires.");
    }
}

// Fonction pour ajouter un objectif à Google Sheets depuis le formulaire modal
async function addObjective() {
    const name = document.getElementById('objectif-name').value;
    const priorite = document.getElementById('objectif-priority').value;
    const progression = document.getElementById('objectif-progress').value;
    const statut = document.getElementById('objectif-status').value;
    const person = "Eric"; // Personne à ajuster selon le formulaire

    if (name && priorite && progression && statut && progression >= 0 && progression <= 100) {
        const newObjective = [[name, priorite, `${progression}%`, statut, person]];

        try {
            const response = await fetch(OBJECTIVE_APPEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: newObjective
                })
            });

            if (response.ok) {
                alert(`Objectif ajouté pour ${person}`);
                closeModal('modal-objectif');
            } else {
                console.error("Erreur lors de l'ajout de l'objectif", await response.json());
                alert("Erreur lors de l'ajout de l'objectif");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête", error);
        }
    } else {
        alert("Tous les champs sont obligatoires.");
    }
}

// Afficher et cacher les modaux
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Ouvrir les modaux lors du clic sur les boutons
document.getElementById('add-session-eric').addEventListener('click', () => openModal('modal-session'));
document.getElementById('add-session-jezabel').addEventListener('click', () => openModal('modal-session'));
document.getElementById('add-objectif-eric').addEventListener('click', () => openModal('modal-objectif'));
document.getElementById('add-objectif-jezabel').addEventListener('click', () => openModal('modal-objectif'));

// Fermer les modaux lors du clic sur le bouton de fermeture
document.getElementById('close-modal-session').addEventListener('click', () => closeModal('modal-session'));
document.getElementById('close-modal-objectif').addEventListener('click', () => closeModal('modal-objectif'));

// Validation et soumission du formulaire de session
document.getElementById('form-session').addEventListener('submit', function (event) {
    event.preventDefault();
    addSession();
});

// Validation et soumission du formulaire d'objectif
document.getElementById('form-objectif').addEventListener('submit', function (event) {
    event.preventDefault();
    addObjective();
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
