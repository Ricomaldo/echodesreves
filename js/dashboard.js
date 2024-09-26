function chargerDernieresSessions(participant) {
    const sessionContent = participant === "eric" ? document.getElementById('eric-session-content') : document.getElementById('jezabel-session-content');
    sessionContent.innerHTML = ''; // Réinitialiser le contenu

    const today = new Date().setHours(0, 0, 0, 0); // Date d'aujourd'hui sans l'heure
    let upcomingSessionAdded = false; // Flag pour savoir si on a ajouté la prochaine session à venir

    // Requête Firestore pour récupérer les sessions du participant
    db.collection("Sessions").where("participant", "==", participant)
        .orderBy("date", "desc") // Trier par date (les plus récentes en premier)
        .limit(3) // Limiter à 3 résultats
        .get()
        .then(querySnapshot => {
            console.log(`Nombre de sessions trouvées pour ${participant} : `, querySnapshot.size); // Log pour le nombre de sessions
            if (querySnapshot.empty) {
                sessionContent.innerHTML = `<p>Aucune session récente trouvée pour ${participant}</p>`;
            } else {
                let pastSessionCount = 0;

                querySnapshot.forEach(doc => {
                    const session = doc.data();
                    const sessionDate = new Date(session.date.seconds * 1000); // Date de la session
                    const isPast = sessionDate.getTime() < today; // Vérifier si la session est passée

                    // Créer une carte pour chaque session
                    const sessionCard = document.createElement('div');
                    sessionCard.classList.add('card', 'session-card');
                    
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
                        <h3>${sessionDate.toLocaleDateString()}</h3>
                        <p>Lieu: ${session.lieu}</p>
                        <div class="notes-container">
                            <div class="notes-content">${session.notes}</div>
                        </div>
                    `;

                    // Ajouter la carte dans le conteneur
                    sessionContent.appendChild(sessionCard);

                    if (isPast) pastSessionCount++;
                });
            }
        }).catch(error => {
            console.error(`Erreur lors du chargement des sessions pour ${participant} :`, error);
        });
}

// Appel pour Jezabel
chargerDernieresSessions('jezabel');

// Appel pour Eric
chargerDernieresSessions('eric');
