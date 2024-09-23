const { google } = require('googleapis');
const fs = require('fs');

// Charger les identifiants du compte de service
const credentials = JSON.parse(fs.readFileSync('duodreams.json'));

// Configurer l'authentification
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// ID de la feuille Google Sheets
const SHEET_ID = '1I-K-gzyfC2kKemyDVMk4XdySBWFXD5Fohp1FrtXCsIQ';

// Fonction pour lire les données depuis Google Sheets
async function readSheet() {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Sessions!A1:C10',  // Modifier la plage en fonction de tes données
    });

    const rows = response.data.values;
    if (rows.length) {
        console.log('Données récupérées :');
        console.log(rows);
    } else {
        console.log('Aucune donnée trouvée.');
    }
}

// Appel de la fonction pour lire les données
readSheet();
