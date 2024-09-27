function chargerDernieresSessions(participant) {
    const sessionContent = participant === "eric" ? document.getElementById('eric-session-content') : document.getElementById('jezabel-session-content');
    sessionContent.innerHTML = ''; // Réinitialiser le contenu

    const today = new Date().setHours(0, 0, 0, 0); // Date d'aujourd'hui sans l'heure
    let upcomingSessionAdded = false; // Flag pour savoir si on a ajouté la prochaine session à venir

    // Log pour vérifier que la fonction est bien appelée une seule fois
    console.log(`Appel de la fonction chargerDernieresSessions pour ${participant}`);

    // Requête Firestore pour récupérer les sessions du participant
    db.collection("Sessions").where("participant", "==", participant)
        .orderBy("date", "desc") // Trier par date (les plus récentes en premier)
        .limit(3) // Limiter à 3 résultats
        .get()
        .then(querySnapshot => {
            console.log(`Nombre de sessions trouvées pour ${participant} : `, querySnapshot.size);

            if (querySnapshot.empty) {
                sessionContent.innerHTML = `<p>Aucune session récente trouvée pour ${participant}</p>`;
            } else {
                let pastSessionCount = 0;

                querySnapshot.forEach(doc => {
                    const session = doc.data();
                    const sessionDate = new Date(session.date.seconds * 1000); // Date de la session
                    const isPast = sessionDate.getTime() < today; // Vérifier si la session est passée

                    // Filtrage des doublons en fonction de l'ID du document
                    if (!sessionContent.querySelector(`[data-id='${doc.id}']`)) {
                        // Créer une carte pour chaque session
                        const sessionCard = document.createElement('div');
                        sessionCard.classList.add('card', 'session-card');
                        sessionCard.setAttribute('data-id', doc.id); // Associer l'ID de session pour éviter les doublons

                        // Ajouter "Prochaine session" pour la prochaine session à venir
                        if (!isPast && !upcomingSessionAdded) {
                            const upcomingTitle = document.createElement('h2');
                            upcomingTitle.textContent = "Prochaine session";
                            sessionContent.appendChild(upcomingTitle);
                            upcomingSessionAdded = true;
                        }

                        // Ajouter "Dernières sessions" pour les deux dernières sessions passées
                        if (isPast && pastSessionCount === 0) {
                            const pastTitle = document.createElement('h2');
                            pastTitle.textContent = "Dernières sessions";
                            sessionContent.appendChild(pastTitle);
                        }

                        // Remplir la carte avec les données de la session
                        sessionCard.innerHTML = `
                            <h3>${sessionDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                            <p>Lieu: ${session.lieu}</p>
                            <div class="notes-container">
                                <div class="notes-content">${session.notes}</div>
                            </div>
                        `;

                        // Ajouter la carte dans le conteneur
                        sessionContent.appendChild(sessionCard);

                        if (isPast) pastSessionCount++;
                    }
                });
            }
        }).catch(error => {
            console.error(`Erreur lors du chargement des sessions pour ${participant} :`, error);
        });
}

function chargerObjectifsEnCours(participant) {
    const objectifContent = participant === "eric" ? document.getElementById('eric-objectif-content') : document.getElementById('jezabel-objectif-content');
    objectifContent.innerHTML = ''; // Réinitialiser le contenu

    // Requête Firestore pour récupérer les objectifs en cours du participant
    db.collection("Objectifs").where("participant", "==", participant).where("progression", "<", 100)
        .get()
        .then(querySnapshot => {
            console.log(`Nombre d'objectifs en cours trouvés pour ${participant} : `, querySnapshot.size);

            if (querySnapshot.empty) {
                objectifContent.innerHTML = `<p>Aucun objectif en cours pour ${participant}</p>`;
            } else {
                querySnapshot.forEach(doc => {
                    const objectif = doc.data();

                    // Créer une carte pour chaque objectif
                    const objectifCard = document.createElement('div');
                    objectifCard.classList.add('card', 'objectif-card');

                    // Créer l'input range pour la progression
                    const rangeInput = document.createElement('input');
                    rangeInput.type = 'range';
                    rangeInput.min = 0;
                    rangeInput.max = 100;
                    rangeInput.value = objectif.progression;

                    // Vérifier si la progression est à 100% pour appliquer la classe "completed"
                    if (objectif.progression === 100) {
                        rangeInput.classList.add('completed');
                    }

                    // Remplir la carte avec les informations de l'objectif
                    objectifCard.innerHTML = `
                        <h3>${objectif.titre}</h3>
                        <p style="font-size: 0.9em;">${objectif.description}</p>
                        <p>Échéance: ${new Date(objectif.deadline.seconds * 1000).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</p>
                    `;

                    // Ajouter l'input range à la carte
                    objectifCard.appendChild(rangeInput);

                    // Ajouter la carte dans le conteneur
                    objectifContent.appendChild(objectifCard);
                });
            }
        }).catch(error => {
            console.error(`Erreur lors du chargement des objectifs pour ${participant} :`, error);
        });
}

// Appel pour Jezabel - Sessions et Objectifs
chargerDernieresSessions('jezabel');
chargerObjectifsEnCours('jezabel');

// Appel pour Eric - Sessions et Objectifs
chargerDernieresSessions('eric');
chargerObjectifsEnCours('eric');
