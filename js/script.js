// ID de la feuille Google Sheets et clé API
const SHEET_ID = "1I-K-gzyfC2kKemyDVMk4XdySBWFXD5Fohp1FrtXCsIQ";
const API_KEY = "AIzaSyDO4nSbdDsfTy-F8KEOlodyhQRYBAJmYNM";

// URL pour récupérer les sessions et objectifs
const SESSION_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sessions?key=${API_KEY}`;
const OBJECTIVE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Objectifs?key=${API_KEY}`;

// URL pour ajouter des sessions et objectifs
const SESSION_APPEND_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sessions!A:D:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
const OBJECTIVE_APPEND_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Objectifs!A:E:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

// URL pour mettre à jour les notes dans la feuille Google Sheets
const SESSION_UPDATE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sessions!A1:D100:batchUpdate?valueInputOption=USER_ENTERED&key=${API_KEY}`;

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

// Fonction pour afficher les objectifs avec gestion du pourcentage et marquer comme terminé
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
        <div class="progress" style="width: ${parseInt(objective[2], 10)}%;">
            ${parseInt(objective[2], 10)}% <!-- Afficher le pourcentage -->
        </div>
    </div>
    <button onclick="markAsCompleted('${objective[0]}', '${person}')">Marquer comme Terminé</button>
`;

            objectiveContainer.appendChild(objectiveCard);
        }
    });
}

let currentSessionName = ""; // Pour stocker le nom de la session pour laquelle on prend des notes

function takeNotes(sessionName) {
    currentSessionName = sessionName; // Stocker le nom de la session pour soumettre les notes
    openModal('modal-notes'); // Ouvrir la modal pour prendre des notes
}

// Fonction pour soumettre les notes
async function submitNotes() {
    const notes = document.getElementById('notes-text').value;

    if (notes) {
        const sessions = await fetchSessions();
        const sessionIndex = sessions.findIndex(session => session[0] === currentSessionName);

        if (sessionIndex !== -1) {
            const row = sessionIndex + 1;
            const notesCell = `C${row}`;

            const updatePayload = {
                "valueInputOption": "USER_ENTERED",
                "data": [
                    {
                        "range": `Sessions!${notesCell}`,
                        "values": [[notes]]
                    }
                ]
            };

            try {
                const response = await fetch(SESSION_UPDATE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePayload)
                });

                if (response.ok) {
                    alert(`Notes pour ${currentSessionName} enregistrées avec succès.`);
                    closeModal('modal-notes');
                    fetchSessions().then(sessions => {
                        displaySessions(sessions, "Eric", ".sessions-eric");
                        displaySessions(sessions, "Jezabel", ".sessions-jezabel");
                    });
                } else {
                    document.getElementById('notes-error').style.display = "block";
                }
            } catch (error) {
                document.getElementById('notes-error').style.display = "block";
            }
        }
    }
}

// Fonction pour marquer un objectif comme terminé
// Fonction pour marquer un objectif comme terminé
async function markAsCompleted(objectiveName, person) {
    const updatedObjective = [[objectiveName, "Haute", "100%", "Terminé", person]];

    try {
        const response = await fetch(OBJECTIVE_APPEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: updatedObjective
            })
        });

        if (response.ok) {
            alert(`L'objectif "${objectiveName}" a été marqué comme terminé.`);
            // Actualiser l'affichage des objectifs après la mise à jour
            fetchObjectives().then(objectives => {
                displayObjectives(objectives, "Eric", ".objectifs-eric");
                displayObjectives(objectives, "Jezabel", ".objectifs-jezabel");
            });
        } else {
            console.error("Erreur lors de la mise à jour de l'objectif", await response.json());
            alert("Erreur lors de la mise à jour de l'objectif");
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'objectif", error);
    }
}


// Fonction pour mettre à jour la progression d'un objectif
async function updateProgress(objectiveName, person, newProgress) {
    const updatedObjective = [[objectiveName, "Haute", `${newProgress}%`, "En cours", person]];

    try {
        const response = await fetch(OBJECTIVE_APPEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: updatedObjective
            })
        });

        if (response.ok) {
            alert(`L'objectif "${objectiveName}" a été mis à jour à ${newProgress}%`);
        } else {
            console.error("Erreur lors de la mise à jour de la progression", await response.json());
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la progression", error);
    }
}

// Fonction pour ajouter une session via le formulaire modal
async function addSession(person) {
    const date = document.getElementById('session-date').value;
    const status = document.getElementById('session-status').value;
    const notes = document.getElementById('session-notes').value;

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
                fetchSessions().then(sessions => {
                    displaySessions(sessions, "Eric", ".sessions-eric");
                    displaySessions(sessions, "Jezabel", ".sessions-jezabel");
                });
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

// Fonction pour ajouter un objectif via le formulaire modal
async function addObjective(person) {
    const name = document.getElementById('objectif-name').value;
    const priority = document.getElementById('objectif-priority').value;
    const progress = document.getElementById('objectif-progress').value;
    const status = document.getElementById('objectif-status').value;

    if (name && priority && progress && status && progress >= 0 && progress <= 100) {
        const newObjective = [[name, priority, `${progress}%`, status, person]];

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
                fetchObjectives().then(objectives => {
                    displayObjectives(objectives, "Eric", ".objectifs-eric");
                    displayObjectives(objectives, "Jezabel", ".objectifs-jezabel");
                });
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
document.getElementById('form-session').addEventListener('submit', async function (event) {
    event.preventDefault();

    const date = document.getElementById('session-date').value;
    const status = document.getElementById('session-status').value;
    const notes = document.getElementById('session-notes').value;
    const person = "Eric"; // Change si nécessaire

    if (date && status) {
        const newSession = [[date, status, notes || "", person]];

        try {
            const response = await fetch(SESSION_APPEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ values: newSession })
            });

            if (response.ok) {
                alert("Session ajoutée !");
                closeModal('modal-session');
                fetchSessions().then(sessions => {
                    displaySessions(sessions, "Eric", ".sessions-eric");
                    displaySessions(sessions, "Jezabel", ".sessions-jezabel");
                });
            } else {
                document.getElementById('session-error').innerText = "Erreur lors de l'ajout.";
                document.getElementById('session-error').style.display = "block";
            }
        } catch (error) {
            document.getElementById('session-error').innerText = "Erreur lors de l'envoi.";
            document.getElementById('session-error').style.display = "block";
        }
    }
});

// Validation et soumission du formulaire d'objectif
document.getElementById('form-objectif').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('objectif-name').value;
    const priority = document.getElementById('objectif-priority').value;
    const progress = document.getElementById('objectif-progress').value;
    const status = document.getElementById('objectif-status').value;
    const person = "Eric"; // Change si nécessaire

    if (name && priority && progress && status && progress >= 0 && progress <= 100) {
        const newObjective = [[name, priority, `${progress}%`, status, person]];

        try {
            const response = await fetch(OBJECTIVE_APPEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ values: newObjective })
            });

            if (response.ok) {
                alert("Objectif ajouté !");
                closeModal('modal-objectif');
                fetchObjectives().then(objectives => {
                    displayObjectives(objectives, "Eric", ".objectifs-eric");
                    displayObjectives(objectives, "Jezabel", ".objectifs-jezabel");
                });
            } else {
                document.getElementById('objectif-error').innerText = "Erreur lors de l'ajout.";
                document.getElementById('objectif-error').style.display = "block";
            }
        } catch (error) {
            document.getElementById('objectif-error').innerText = "Erreur lors de l'envoi.";
            document.getElementById('objectif-error').style.display = "block";
        }
    } else {
        document.getElementById('objectif-error').innerText = "Veuillez vérifier les champs.";
        document.getElementById('objectif-error').style.display = "block";
    }
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
