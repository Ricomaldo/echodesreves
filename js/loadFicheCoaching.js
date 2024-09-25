document.addEventListener('DOMContentLoaded', function () {
    const participantSelect = document.getElementById('participant-select');
    const dateSelect = document.getElementById('date-select');
    const notesTextarea = document.getElementById('notes-textarea');
    const today = new Date().setHours(0, 0, 0, 0); // Date du jour sans heure

    // Définition des fonctions chargerDates, chargerNotes, chargerObjectifs, etc.
    function chargerDates() {
        const participant = participantSelect.value === "eric" ? ["Eric", "eric"] : ["Jezabel", "jezabel"];
        console.log("Participants sélectionnés :", participant);
    
        dateSelect.innerHTML = ''; // Réinitialiser les options
    
        // Requête Firestore pour récupérer toutes les sessions pour les deux variantes de participant
        const promises = [
            db.collection("Sessions").where("participant", "==", participant[0]).get(),
            db.collection("Sessions").where("participant", "==", participant[1]).get()
        ];
    
        Promise.all(promises)
            .then(querySnapshots => {
                let allSessions = [];
    
                // Combiner les résultats des deux requêtes
                querySnapshots.forEach(querySnapshot => {
                    allSessions = allSessions.concat(querySnapshot.docs);
                });
    
                // Filtrer les doublons en fonction de l'ID du document (Firestore attribue des ID uniques)
                const uniqueSessions = allSessions.filter((session, index, self) =>
                    index === self.findIndex((s) => (
                        s.id === session.id
                    ))
                );
    
                let lastPastSessionIndex = -1; // Variable pour stocker l'index de la dernière session passée
    
                // Parcourir toutes les sessions (passées et futures)
                uniqueSessions.forEach((doc, index) => {
                    const session = doc.data();
                    const sessionDate = session.date.seconds * 1000;
    
                    // Vérifier si la session est passée
                    if (sessionDate <= today) {
                        lastPastSessionIndex = index; // Stocker l'index de la dernière session passée
                    }
    
                    // Ajouter l'option au menu déroulant
                    if (session.date && session.date.seconds) {
                        const option = document.createElement('option');
                        option.value = doc.id;
                        option.textContent = new Date(session.date.seconds * 1000).toLocaleDateString();
                        dateSelect.appendChild(option);
                    }
                });
    
                // Sélectionner la dernière session passée (si elle existe)
                if (lastPastSessionIndex !== -1) {
                    dateSelect.selectedIndex = lastPastSessionIndex;
                    chargerNotes(); // Charger les notes de la dernière session passée
                } else if (dateSelect.options.length > 0) {
                    // Si aucune session passée, sélectionner la première future
                    dateSelect.selectedIndex = 0;
                    chargerNotes();
                }
            }).catch(error => {
                console.error("Erreur lors du chargement des sessions :", error);
            });
    }

    function chargerNotes() {
        const sessionId = dateSelect.value;
        if (!sessionId) return;

        db.collection("Sessions").doc(sessionId).get().then((doc) => {
            if (doc.exists) {
                const sessionData = doc.data();
                notesTextarea.value = sessionData.notes || "";
            } else {
                console.log("Aucune donnée trouvée pour la session sélectionnée.");
            }
        }).catch(error => {
            console.error("Erreur lors du chargement des notes :", error);
        });
    }

    function chargerObjectifs() {
        const participant = participantSelect.value === "eric" ? ["Eric", "eric"] : ["Jezabel", "jezabel"];
        const objectifContent = document.getElementById('objectif-content');
        objectifContent.innerHTML = ''; // Réinitialiser le contenu

        // Requête Firestore pour récupérer les objectifs du participant
        db.collection("Objectifs").where("participant", "in", participant)
            .get()
            .then(querySnapshot => {
                console.log(`Nombre d'objectifs trouvés pour ${participant} : `, querySnapshot.size); // Log pour le nombre d'objectifs
                if (querySnapshot.empty) {
                    console.log("Aucun objectif trouvé pour :", participant);
                    objectifContent.innerHTML = '<p>Aucun objectif trouvé</p>';
                } else {
                    querySnapshot.forEach(doc => {
                        const objectif = doc.data();
                        console.log("Objectif data :", objectif); // Log des objectifs récupérés

                        // Créer une carte pour chaque objectif
                        const objectifCard = document.createElement('div');
                        objectifCard.classList.add('card', 'objectif-card');
                        objectifCard.innerHTML = `
                            <h3>${objectif.titre}</h3>
                            <p>Description: ${objectif.description}</p>
                            <p>Progression: ${objectif.progression}%</p>
                            <p>Deadline: ${new Date(objectif.deadline.seconds * 1000).toLocaleDateString()}</p>
                        `;
                        objectifContent.appendChild(objectifCard);
                    });
                }
            }).catch(error => {
                console.error("Erreur lors du chargement des objectifs :", error);
            });
    }

    // Charger les dates et les objectifs dès que la page se charge pour le participant sélectionné par défaut
    chargerDates();
    chargerObjectifs();

    // Événements pour changer de participant et recharger les données
    participantSelect.addEventListener('change', chargerDates);
    dateSelect.addEventListener('change', chargerNotes);
    participantSelect.addEventListener('change', function() {
        chargerDates(); // Charger les dates des sessions
        chargerObjectifs(); // Charger les objectifs
    });

    // Ajouter un bouton de sauvegarde
    document.getElementById('save-notes').addEventListener('click', sauvegarderNotes);
});
