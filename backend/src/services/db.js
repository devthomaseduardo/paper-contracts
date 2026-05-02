import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');
const CLIENTS_FILE = path.join(DB_PATH, 'clients.json');
const DOCUMENTS_FILE = path.join(DB_PATH, 'documents.json');

async function ensureDb() {
    try {
        await fs.mkdir(DB_PATH, { recursive: true });
        for (const file of [CLIENTS_FILE, DOCUMENTS_FILE]) {
            try {
                await fs.access(file);
            } catch {
                await fs.writeFile(file, JSON.stringify([]));
            }
        }
    } catch (err) {
        console.error('Error initializing DB:', err);
    }
}

export const db = {
    async getClients() {
        await ensureDb();
        const data = await fs.readFile(CLIENTS_FILE, 'utf-8');
        return JSON.parse(data);
    },
    async saveClient(client) {
        await ensureDb();
        const clients = await this.getClients();
        const index = clients.findIndex(c => c.clientDoc === client.clientDoc);
        if (index !== -1) {
            clients[index] = client;
        } else {
            clients.push(client);
        }
        await fs.writeFile(CLIENTS_FILE, JSON.stringify(clients, null, 2));
        return client;
    },
    async deleteClient(doc) {
        await ensureDb();
        const clients = await this.getClients();
        const filtered = clients.filter(c => c.clientDoc !== doc);
        await fs.writeFile(CLIENTS_FILE, JSON.stringify(filtered, null, 2));
    },

    // Documents Logic
    async getDocuments(userId) {
        await ensureDb();
        const data = await fs.readFile(DOCUMENTS_FILE, 'utf-8');
        const allDocs = JSON.parse(data);
        return allDocs.filter(d => d.userId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    async saveDocument(doc) {
        await ensureDb();
        const data = await fs.readFile(DOCUMENTS_FILE, 'utf-8');
        const allDocs = JSON.parse(data);
        
        const id = doc.id || Date.now().toString();
        const newDoc = { ...doc, id, timestamp: new Date().toISOString() };
        
        const index = allDocs.findIndex(d => d.id === id);
        if (index !== -1) {
            allDocs[index] = newDoc;
        } else {
            allDocs.push(newDoc);
        }
        
        await fs.writeFile(DOCUMENTS_FILE, JSON.stringify(allDocs, null, 2));
        return newDoc;
    },
    async deleteDocument(id, userId) {
        await ensureDb();
        const data = await fs.readFile(DOCUMENTS_FILE, 'utf-8');
        const allDocs = JSON.parse(data);
        const filtered = allDocs.filter(d => d.id !== id || d.userId !== userId);
        await fs.writeFile(DOCUMENTS_FILE, JSON.stringify(filtered, null, 2));
    }
};
