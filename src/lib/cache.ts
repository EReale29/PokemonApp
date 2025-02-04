import NodeCache from 'node-cache';

// Ici, stdTTL définit le temps de vie par défaut en secondes (ici 60s)
// et checkperiod la fréquence (en secondes) à laquelle le cache est nettoyé.
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 3600 });

export default cache;