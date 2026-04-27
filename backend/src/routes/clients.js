import { Router } from 'express';
import { db } from '../services/db.js';

export const clientsRouter = Router();

clientsRouter.get('/', async (req, res, next) => {
    try {
        const clients = await db.getClients();
        res.json(clients);
    } catch (e) {
        next(e);
    }
});

clientsRouter.post('/', async (req, res, next) => {
    try {
        const client = await db.saveClient(req.body);
        res.json(client);
    } catch (e) {
        next(e);
    }
});

clientsRouter.delete('/:doc', async (req, res, next) => {
    try {
        await db.deleteClient(req.params.doc);
        res.status(204).end();
    } catch (e) {
        next(e);
    }
});
