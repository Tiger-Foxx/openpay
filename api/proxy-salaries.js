// api/proxy-salaries.js - Proxy pour contourner CORS de salaires.dev

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Répondre aux requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Faire la requête vers salaires.dev depuis le serveur
    const response = await fetch('https://salaires.dev/api/salaries', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'OpenPay/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('[Proxy] Erreur:', error);
    res.status(500).json({ 
      error: 'Impossible de récupérer les données',
      message: error.message 
    });
  }
}
