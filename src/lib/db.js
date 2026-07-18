import fs from 'fs/promises';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'src', 'data');
const DB_PATH = path.join(DB_DIR, 'messages.json');

async function ensureDb() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (err) {}
  
  try {
    await fs.access(DB_PATH);
  } catch (err) {
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function getMessages() {
  await ensureDb();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading messages database:', err);
    return [];
  }
}

export async function addMessage(message) {
  await ensureDb();
  try {
    const messages = await getMessages();
    const newMessage = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      createdAt: new Date().toISOString(),
      read: false
    };
    messages.push(newMessage);
    await fs.writeFile(DB_PATH, JSON.stringify(messages, null, 2), 'utf-8');
    return newMessage;
  } catch (err) {
    console.error('Error writing new message to database:', err);
    throw new Error('Database write error');
  }
}

export async function toggleRead(id) {
  await ensureDb();
  try {
    const messages = await getMessages();
    const updated = messages.map(m => {
      if (m.id === id) {
        return { ...m, read: !m.read };
      }
      return m;
    });
    await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error toggling read status for message ${id}:`, err);
    return false;
  }
}

export async function deleteMessage(id) {
  await ensureDb();
  try {
    const messages = await getMessages();
    const filtered = messages.filter(m => m.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error deleting message ${id}:`, err);
    return false;
  }
}
