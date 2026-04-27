import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');
const CLIENTS_FILE = path.join(DB_PATH, 'clients.json');

async function ensureDb() {
    try {
        await fs.mkdir(DB_PATH, { recursive: true });
        try {
            await fs.access(CLIENTS_FILE);
        } catch {
            await fs.writeFile(CLIENTS_FILE, JSON.stringify([]));
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
    }
};
