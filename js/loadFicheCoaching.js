document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().setHours(0, 0, 0, 0); // Date du jour sans heure

    // Fonction pour charger les dates des sessions
    function chargerDates(participant, dateSelect, notesContent) {
        console.log(`Participant sélectionné : ${participant}`);

        // Réinitialiser le contenu du sélecteur de dates pour éviter les doublons
        dateSelect.innerHTML = ''; 
        dateSelect.options.length = 0; // Supprimer toutes les options

        // Requête Firestore pour récupérer les sessions du participant
        db.collection("Sessions").where("participant", "==", participant)
            .get()
            .then(querySnapshot => {
                let sessions = [];
                let uniqueSessions = {}; // Utiliser un objet pour éviter les doublons
                let lastPastSessionIndex = -1;

                querySnapshot.forEach((doc) => {
                    const session = doc.data();
                    const sessionDate = session.date.seconds * 1000;

                    if (!uniqueSessions[doc.id]) {
                        uniqueSessions[doc.id] = true;
                        sessions.push({ ...session, id: doc.id });
                    }
                });

                // Trier les sessions par date
                sessions.sort((a, b) => a.date.seconds - b.date.seconds);

                // Ajouter les sessions au menu déroulant
                sessions.forEach((session, index) => {
                    const sessionDate = session.date.seconds * 1000;
            
                    const option = document.createElement('option');
                    option.value = session.id;
                    option.textContent = new Date(sessionDate).toLocaleDateString();
                    dateSelect.appendChild(option);
                });
            
                // Ajout du gestionnaire d'événements pour le changement de date
                dateSelect.addEventListener('change', function() {
                    chargerNotes(participant, dateSelect, notesContent);
                });

                // Sélectionner la dernière session passée
                if (lastPastSessionIndex !== -1) {
                    dateSelect.selectedIndex = lastPastSessionIndex;
                    chargerNotes(participant, dateSelect, notesContent);
                } else if (dateSelect.options.length > 0) {
                    dateSelect.selectedIndex = 0;
                    chargerNotes(participant, dateSelect, notesContent);
                }
            }).catch(error => {
                console.error(`Erreur lors du chargement des sessions pour ${participant} :`, error);
            });
    }

    // Fonction pour charger les notes
    function chargerNotes(participant, dateSelect, notesTextarea) {
        const sessionId = dateSelect.value;
        if (!sessionId) return;

        db.collection("Sessions").doc(sessionId).get().then((doc) => {
            if (doc.exists) {
                const sessionData = doc.data();

                // Injecter les notes directement dans le div avec la classe 'notes-content'
                notesTextarea.value = sessionData.notes || "";
            } else {
                console.log(`Aucune donnée trouvée pour la session sélectionnée : ${sessionId}`);
            }
        }).catch(error => {
            console.error(`Erreur lors du chargement des notes pour ${participant} :`, error);
        });
    }

    // Fonction pour charger les objectifs
    function chargerObjectifs(participant, objectifContent) {
        objectifContent.innerHTML = ''; // Réinitialiser le contenu

        db.collection("Objectifs").where("participant", "==", participant)
            .where("progression", "<", 100)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    objectifContent.innerHTML = '<p>Aucun objectif trouvé</p>';
                } else {
                    querySnapshot.forEach(doc => {
                        const objectif = doc.data();
                        const objectifCard = document.createElement('div');
                        objectifCard.classList.add('card', 'objectif-card');

                        const rangeInput = document.createElement('input');
                        rangeInput.type = 'range';
                        rangeInput.min = 0;
                        rangeInput.max = 100;
                        rangeInput.value = parseInt(objectif.progression);

                        if (objectif.progression === 100) {
                            rangeInput.classList.add('completed');
                        }

                        rangeInput.addEventListener('input', function () {
                            const newValue = parseInt(this.value);
                            db.collection("Objectifs").doc(doc.id).update({
                                progression: newValue
                            }).then(() => {
                                if (newValue === 100) {
                                    this.classList.add('completed');
                                    setTimeout(() => {
                                        alert(`Bravo ${participant.charAt(0).toUpperCase() + participant.slice(1)} ! Objectif atteint : ${objectif.titre}`);
                                    }, 500);
                                    window.addEventListener('beforeunload', function() {
                                        objectifCard.remove();
                                    });
                                } else {
                                    this.classList.remove('completed');
                                }
                            }).catch(error => {
                                console.error(`Erreur lors de la mise à jour de la progression pour ${participant} :`, error);
                            });
                        });

                        objectifCard.innerHTML = `
                            <h3>${objectif.titre}</h3>
                            <p>${objectif.description} avant le ${new Date(objectif.deadline.seconds * 1000).toLocaleDateString()}.</p>
                        `;

                        objectifCard.appendChild(rangeInput);
                        objectifContent.appendChild(objectifCard);
                    });
                }
            }).catch(error => {
                console.error(`Erreur lors du chargement des objectifs pour ${participant} :`, error);
            });
    }

    function sauvegarderNotes(participant, dateSelect, notesTextarea) {
        const sessionId = dateSelect.value;
        if (!sessionId) return;
    
        const notes = notesTextarea.value; // Utiliser `.value` pour le contenu d'un textarea
        db.collection("Sessions").doc(sessionId).update({
            notes: notes
        }).then(() => {
            console.log(`Notes mises à jour pour ${participant} !`);
        }).catch(error => {
            console.error(`Erreur lors de la mise à jour des notes pour ${participant} :`, error);
        });
    }
    

    // Gestion des onglets
    document.querySelectorAll(".tab-btn").forEach(button => {
        button.addEventListener('click', function(event) {
            const participant = event.target.textContent.toLowerCase();
            const dateSelect = document.getElementById(`date-select-${participant}`);
            const notesContent = document.getElementById(`notes-textarea-${participant}`);
            const objectifContent = document.getElementById(`objectif-content-${participant}`);

            chargerDates(participant, dateSelect, notesContent);
            chargerObjectifs(participant, objectifContent);
        });
    });

    // Gestion du bouton sauvegarder
    document.querySelectorAll('[id^=save-notes]').forEach(button => {
        button.addEventListener('click', function () {
            const participant = button.id.split('-').pop();
            const dateSelect = document.getElementById(`date-select-${participant}`);
            const notesContent = document.getElementById(`notes-textarea-${participant}`);
            sauvegarderNotes(participant, dateSelect, notesContent);
        });
    });
});
