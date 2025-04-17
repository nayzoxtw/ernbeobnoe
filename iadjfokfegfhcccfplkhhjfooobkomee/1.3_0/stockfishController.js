// Créer une instance de Stockfish.js
const stockfish = new Worker('stockfish.js');  // Chemin vers ton fichier Stockfish.js

// Fonction pour ajuster la puissance du moteur Stockfish
function adjustStockfishPower(depth, movetime) {
    if (depth) {
        stockfish.postMessage(`go depth ${depth}`);  // Limite la profondeur de recherche
    }
    if (movetime) {
        stockfish.postMessage(`go movetime ${movetime}`);  // Limite le temps d'analyse
    }
}

// Fonction pour démarrer le moteur avec une puissance limitée
function startEasyMode() {
    adjustStockfishPower(5, 1000);  // Profondeur de 5 coups et temps d'analyse de 1 seconde
}

function startHardMode() {
    adjustStockfishPower(20, 5000);  // Profondeur de 20 coups et temps d'analyse de 5 secondes
}

// Fonction pour écouter les messages venant du popup.js
chrome.storage.local.get(['enabled', 'difficulty'], ({ enabled, difficulty }) => {
    if (enabled) {
        if (difficulty === 'easy') {
            startEasyMode();
        } else if (difficulty === 'hard') {
            startHardMode();
        }
    }
});

// Fonction pour envoyer un message au moteur (Stockfish) pour démarrer la recherche
function startAnalysis(position) {
    stockfish.postMessage(`position fen ${position}`);
    stockfish.postMessage('go depth 10');  // Exemple d'analyse à profondeur 10
}

// Fonction pour arrêter le moteur
function stopAnalysis() {
    stockfish.postMessage('stop');
}

// Exposer les fonctions nécessaires à l'extension
export { startAnalysis, stopAnalysis, startEasyMode, startHardMode };
