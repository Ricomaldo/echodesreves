// Fonction pour gérer l'ouverture des onglets et appliquer les couleurs en fonction de la sélection
function openTab(evt, person) {
    // Cacher toutes les tab-content
    var tabContents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Retirer la classe active de tous les boutons
    var tabButtons = document.getElementsByClassName("tab-btn");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active", "eric-active", "jezabel-active");
    }

    // Afficher le contenu de l'onglet sélectionné
    document.getElementById(person).style.display = "block";
    evt.currentTarget.classList.add("active");

    // Appliquer la classe de couleur en fonction du participant sélectionné
    if (person === 'eric') {
        evt.currentTarget.classList.add('eric-active');  // Changement de couleur du bouton
        document.getElementById(person).classList.add('eric-selected');  // Changement de couleur du bloc
    } else if (person === 'jezabel') {
        evt.currentTarget.classList.add('jezabel-active');  // Changement de couleur du bouton
        document.getElementById(person).classList.add('jezabel-selected');  // Changement de couleur du bloc
    }

    // Sauvegarder l'onglet sélectionné dans le localStorage
    localStorage.setItem('activeTab', person);
}

// Récupérer l'onglet actif du localStorage lors du chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    var activeTab = localStorage.getItem('activeTab');
    
    // Si aucun onglet n'est sauvegardé, on affiche Eric par défaut
    if (!activeTab) {
        activeTab = 'eric';  // Par défaut l'onglet d'Eric
    }

    // Simuler un clic sur l'onglet sauvegardé ou par défaut
    document.querySelector(`button[onclick*="${activeTab}"]`).click();
});
