import admin from 'firebase-admin';

// Initialize Firebase Admin with the project ID
// It will use Application Default Credentials (ADC) automatically
admin.initializeApp({
  projectId: 'devthmsite'
});

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Erro na validação do token:', error);
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};
