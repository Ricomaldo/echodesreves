function chargerScript(url) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Charger les scripts avec des promesses
chargerScript('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js')
    .then(() => chargerScript('https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js'))
    .then(() => chargerScript('js/firebaseConfig.js'))
    .then(() => chargerScript('js/afficherObjectifs.js'))
    .then(() => chargerScript('js/afficherSessions.js'))
    .catch((error) => {
        console.error("Erreur lors du chargement des scripts : ", error);
    });
