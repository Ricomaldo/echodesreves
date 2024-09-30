document.addEventListener('DOMContentLoaded', function () {
    const objectifContentEric = document.querySelector('.objectif-content-eric');
    const objectifContentJezabel = document.querySelector('.objectif-content-jezabel');

    // Fonction pour charger les objectifs atteints
    function chargerObjectifsAtteints(participant, container) {
        db.collection("Objectifs").where("participant", "==", participant).where("progression", "==", 100)
            .get()
            .then(querySnapshot => {
                container.innerHTML = ''; // Réinitialiser le contenu
                const objectifCount = querySnapshot.size; // Nombre d'objectifs atteints

                if (querySnapshot.empty) {
                    container.innerHTML += `<p>Aucun objectif atteint pour ${participant}</p>`;
                } else {
                    const starLine = document.createElement('div');
                    starLine.classList.add('star-line');
                    for (let i = 0; i < objectifCount; i++) {
                        const star = document.createElement('span');
                        star.innerHTML = '⭐'; // Étoile jaune
                        starLine.appendChild(star);
                    }
                    container.appendChild(starLine);

                    querySnapshot.forEach(doc => {
                        const objectif = doc.data();
                        const moisCourts = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

                        // Créer une carte pour chaque objectif
                        const objectifCard = document.createElement('div');
                        objectifCard.classList.add('card', 'objectif-card');
                        objectifCard.innerHTML = `
                            <h3>${objectif.titre}</h3>
                            <p><em>${objectif.description}</em></p>
                            <p style="font-size: 0.9em;">- Atteint en ${moisCourts[new Date(objectif.deadline.seconds * 1000).getMonth()]} ${new Date(objectif.deadline.seconds * 1000).getFullYear()} -</p>
                        `;
                        container.appendChild(objectifCard);
                    });
                }
            }).catch(error => {
                console.error(`Erreur lors du chargement des objectifs pour ${participant} :`, error);
            });
    }

    // Charger les objectifs atteints d'Eric et de Jezabel
    chargerObjectifsAtteints('eric', objectifContentEric);
    chargerObjectifsAtteints('jezabel', objectifContentJezabel);
});
