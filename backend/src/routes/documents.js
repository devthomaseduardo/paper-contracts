import { Router } from 'express';
import { db } from '../services/db.js';

export const documentsRouter = Router();

documentsRouter.get('/', async (req, res, next) => {
    try {
        // req.user comes from authMiddleware
        const userId = req.user?.uid;
        if (!userId) return res.status(401).json({ error: 'Não autenticado' });
        
        const docs = await db.getDocuments(userId);
        res.json(docs);
    } catch (e) {
        next(e);
    }
});

documentsRouter.post('/', async (req, res, next) => {
    try {
        const userId = req.user?.uid;
        if (!userId) return res.status(401).json({ error: 'Não autenticado' });

        const doc = await db.saveDocument({ ...req.body, userId });
        res.json(doc);
    } catch (e) {
        next(e);
    }
});

documentsRouter.delete('/:id', async (req, res, next) => {
    try {
        const userId = req.user?.uid;
        if (!userId) return res.status(401).json({ error: 'Não autenticado' });

        await db.deleteDocument(req.params.id, userId);
        res.status(204).end();
    } catch (e) {
        next(e);
    }
});
