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

    // Charger les dernières sessions pour le participant correspondant
    if (person === "jezabel") {
        chargerDernieresSessions('jezabel'); // Appeler la fonction pour Jezabel
    } else if (person === "eric") {
        chargerDernieresSessions('eric'); // Appeler la fonction pour Eric
    }
}

// Initialisation : afficher le premier onglet par défaut
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab-btn").click(); // Cliquer sur le premier bouton pour afficher l'onglet par défaut
});
