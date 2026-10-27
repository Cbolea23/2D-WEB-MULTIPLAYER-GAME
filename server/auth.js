import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory user database cache backed by JSON
class UserStore {
    constructor() {
        this.users = new Map(); // username.toLowerCase() -> UserObject
        this.tokens = new Map(); // token -> username.toLowerCase()
        this.load();
    }

    load() {
        if (!fs.existsSync(USERS_FILE)) {
            this.saveToDisk();
            return;
        }
        try {
            const raw = fs.readFileSync(USERS_FILE, 'utf8');
            const data = JSON.parse(raw);
            if (data.users && Array.isArray(data.users)) {
                for (const u of data.users) {
                    if (u.username) {
                        this.users.set(u.username.toLowerCase(), u);
                    }
                }
            }
            if (data.tokens && typeof data.tokens === 'object') {
                for (const [tok, uName] of Object.entries(data.tokens)) {
                    this.tokens.set(tok, uName.toLowerCase());
                }
            }
            console.log(`[AuthStore] Loaded ${this.users.size} registered users from ${USERS_FILE}`);
        } catch (err) {
            console.error('[AuthStore] Error loading users.json:', err);
        }
    }

    saveToDisk() {
        try {
            const serializableUsers = Array.from(this.users.values());
            const serializableTokens = Object.fromEntries(this.tokens.entries());
            const data = {
                users: serializableUsers,
                tokens: serializableTokens,
                updatedAt: Date.now()
            };
            const tmpFile = USERS_FILE + '.tmp';
            fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
            fs.renameSync(tmpFile, USERS_FILE);
        } catch (err) {
            console.error('[AuthStore] Failed to write users to disk:', err);
        }
    }

    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.scryptSync(password, salt, 64).toString('hex');
        return `${salt}:${hash}`;
    }

    verifyPassword(password, stored) {
        if (!stored || !stored.includes(':')) return false;
        const [salt, key] = stored.split(':');
        const keyBuffer = Buffer.from(key, 'hex');
        const derivedKey = crypto.scryptSync(password, salt, 64);
        return crypto.timingSafeEqual(keyBuffer, derivedKey);
    }

    createToken(username) {
        const token = 'ck_' + crypto.randomBytes(32).toString('hex');
        this.tokens.set(token, username.toLowerCase());
        this.saveToDisk();
        return token;
    }

    getUserByToken(token) {
        if (!token) return null;
        const usernameLower = this.tokens.get(token);
        if (!usernameLower) return null;
        return this.users.get(usernameLower) || null;
    }

    register(username, password, initialSave = null) {
        const cleanName = (username || '').trim();
        if (cleanName.length < 3 || cleanName.length > 20) {
            return { error: 'Username must be between 3 and 20 characters.' };
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(cleanName)) {
            return { error: 'Username may only contain letters, numbers, hyphens, and underscores.' };
        }
        if (!password || password.length < 4) {
            return { error: 'Password must be at least 4 characters long.' };
        }

        const lower = cleanName.toLowerCase();
        if (this.users.has(lower)) {
            return { error: 'Username is already taken. Please choose another.' };
        }

        const defaultSave = {
            souls: 0,
            bestDepth: 1,
            selectedWeapon: 'rusty_spade',
            unlockedWeapons: ['rusty_spade'],
            blessings: {},
            stats: { kills: 0, pitKills: 0, moundsDug: 0, goldEarned: 0 }
        };

        const userObj = {
            id: 'u_' + crypto.randomBytes(8).toString('hex'),
            username: cleanName,
            passwordHash: this.hashPassword(password),
            createdAt: Date.now(),
            save: initialSave ? { ...defaultSave, ...initialSave } : defaultSave
        };

        this.users.set(lower, userObj);
        const token = this.createToken(cleanName);
        this.saveToDisk();

        return {
            ok: true,
            token,
            user: {
                username: userObj.username,
                save: userObj.save
            }
        };
    }

    login(username, password) {
        const cleanName = (username || '').trim();
        const lower = cleanName.toLowerCase();
        const user = this.users.get(lower);

        if (!user || !this.verifyPassword(password, user.passwordHash)) {
            return { error: 'Invalid username or password.' };
        }

        const token = this.createToken(user.username);
        return {
            ok: true,
            token,
            user: {
                username: user.username,
                save: user.save
            }
        };
    }

    updateSave(token, newSaveData) {
        const user = this.getUserByToken(token);
        if (!user) {
            return { error: 'Unauthorized or invalid session.' };
        }

        if (typeof newSaveData === 'object' && newSaveData !== null) {
            user.save = {
                ...user.save,
                ...newSaveData,
                souls: Math.max(0, Number(newSaveData.souls || user.save.souls || 0)),
                bestDepth: Math.max(1, Number(newSaveData.bestDepth || user.save.bestDepth || 1)),
                updatedAt: Date.now()
            };
            this.saveToDisk();
            return { ok: true, save: user.save };
        }

        return { error: 'Invalid save payload.' };
    }
}

export const authStore = new UserStore();
