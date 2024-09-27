function openTab(evt, person) {
    // Cacher toutes les tab-content
    var tabContents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Retirer la classe active de tous les boutons
    var tabButtons = document.getElementsByClassName("tab-btn");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // Afficher le contenu de l'onglet actuel et ajouter la classe active au bouton correspondant
    document.getElementById(person).style.display = "block";
    evt.currentTarget.classList.add("active");

    // Sauvegarder l'onglet sélectionné dans le localStorage
    localStorage.setItem('activeTab', person);
}

// Récupérer l'onglet actif du localStorage lors du chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    var activeTab = localStorage.getItem('activeTab');
    
    // Si aucun onglet n'est sauvegardé, on affiche le premier par défaut
    if (!activeTab) {
        activeTab = 'eric';  // Par défaut l'onglet d'Eric
    }

    // Simuler un clic sur l'onglet sauvegardé ou par défaut
    document.querySelector(`button[onclick*="${activeTab}"]`).click();
});
