document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();

    // Fonction pour ajouter un Objectif
    document.getElementById('add-objectif-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const participant = document.getElementById('participant-objectif').value;
        const titre = document.getElementById('titre-objectif').value;
        const description = document.getElementById('description-objectif').value;
        const progression = document.getElementById('progression-objectif').value;
        const deadline = document.getElementById('deadline-objectif').value;

        db.collection('Objectifs').add({
            participant: participant,
            titre: titre,
            description: description,
            progression: parseInt(progression),
            deadline: new Date(deadline)
        }).then(() => {
            alert('Objectif ajouté avec succès');
            document.getElementById('add-objectif-form').reset();
        }).catch(error => {
            console.error('Erreur lors de l\'ajout de l\'objectif : ', error);
        });
    });

    // Fonction pour ajouter une Session
    document.getElementById('add-session-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const participant = document.getElementById('participant-session').value;
        const lieu = document.getElementById('lieu-session').value;
        const date = document.getElementById('date-session').value;
        const notes = document.getElementById('notes-session').value;

        db.collection('Sessions').add({
            participant: participant,
            lieu: lieu,
            date: new Date(date),
            notes: notes
        }).then(() => {
            alert('Session ajoutée avec succès');
            document.getElementById('add-session-form').reset();
        }).catch(error => {
            console.error('Erreur lors de l\'ajout de la session : ', error);
        });
    });
});
