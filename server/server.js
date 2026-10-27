import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;
const MAX_SQUAD_SIZE = 6;

// MIME types dictionary for static file serving
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg'
};

// HTTP Static Server
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/' || reqUrl === '') {
        reqUrl = '/index.html';
    }

    const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(ROOT_DIR, safePath);

    if (reqUrl === '/index.html' && !fs.existsSync(filePath)) {
        filePath = path.join(ROOT_DIR, 'fix_ankh_badge_typo.html');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

// WebSocket Multiplayer Server (Up to 6 Players per Expedition Room)
const wss = new WebSocketServer({ server });

/**
 * Room Schema:
 * {
 *   code: string,
 *   seed: number,
 *   maxPlayers: number (6),
 *   clients: Map<string, { id: string, playerIndex: number, ws: WebSocket, isHost: boolean }>,
 *   created: number
 * }
 */
const rooms = new Map();

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'KEEPER-';
    for (let i = 0; i < 3; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function broadcastToRoom(room, senderWs, data) {
    const raw = JSON.stringify(data);
    for (const client of room.clients.values()) {
        if (client.ws !== senderWs && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(raw);
        }
    }
}

wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.clientId = 'P_' + Math.random().toString(36).substring(2, 7);
    ws.roomCode = null;
    ws.playerIndex = 1;
    ws.isHost = false;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString());
            handleMessage(ws, msg);
        } catch (e) {
            console.error('Failed to parse WS message:', e.message);
        }
    });

    ws.on('close', () => {
        handleDisconnect(ws);
    });

    ws.on('error', (err) => {
        console.warn('Socket error:', err.message);
    });

    // Welcome handshake
    ws.send(JSON.stringify({
        type: 'connected',
        clientId: ws.clientId,
        serverTime: Date.now(),
        activeRooms: rooms.size
    }));
});

function handleMessage(ws, msg) {
    switch (msg.type) {
        case 'create_room': {
            handleDisconnect(ws);

            let code = msg.roomCode || generateRoomCode();
            while (rooms.has(code)) {
                code = generateRoomCode();
            }

            const room = {
                code,
                seed: msg.seed || Math.floor(Math.random() * 1000000),
                maxPlayers: MAX_SQUAD_SIZE,
                clients: new Map(),
                created: Date.now()
            };

            ws.roomCode = code;
            ws.isHost = true;
            ws.playerIndex = 1;

            room.clients.set(ws.clientId, {
                id: ws.clientId,
                playerIndex: 1,
                ws,
                isHost: true
            });

            rooms.set(code, room);

            ws.send(JSON.stringify({
                type: 'room_created',
                roomCode: code,
                seed: room.seed,
                playerId: ws.clientId,
                playerIndex: 1,
                isHost: true,
                maxPlayers: MAX_SQUAD_SIZE,
                players: [{ id: ws.clientId, playerIndex: 1, isHost: true }]
            }));
            console.log(`[Multiplayer] Room created: ${code} by ${ws.clientId} (Max: ${MAX_SQUAD_SIZE})`);
            break;
        }

        case 'join_room': {
            const code = (msg.roomCode || '').trim().toUpperCase();
            const room = rooms.get(code);

            if (!room) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: `Expedition "${code}" not found. Check the code and try again.`
                }));
                return;
            }

            if (room.clients.size >= room.maxPlayers) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: `Expedition "${code}" is full (${room.clients.size}/${room.maxPlayers} Keepers).`
                }));
                return;
            }

            // Assign lowest available player index (2 to 6)
            const usedIndices = new Set(Array.from(room.clients.values()).map(c => c.playerIndex));
            let assignedIndex = 2;
            for (let i = 2; i <= MAX_SQUAD_SIZE; i++) {
                if (!usedIndices.has(i)) {
                    assignedIndex = i;
                    break;
                }
            }

            ws.roomCode = code;
            ws.isHost = false;
            ws.playerIndex = assignedIndex;

            room.clients.set(ws.clientId, {
                id: ws.clientId,
                playerIndex: assignedIndex,
                ws,
                isHost: false
            });

            // Send full squad info to joiner
            const playersList = Array.from(room.clients.values()).map(c => ({
                id: c.id,
                playerIndex: c.playerIndex,
                isHost: c.isHost
            }));

            ws.send(JSON.stringify({
                type: 'room_joined',
                roomCode: code,
                seed: room.seed,
                playerId: ws.clientId,
                playerIndex: assignedIndex,
                isHost: false,
                maxPlayers: MAX_SQUAD_SIZE,
                players: playersList
            }));

            // Notify everyone else in the room
            broadcastToRoom(room, ws, {
                type: 'peer_joined',
                peerId: ws.clientId,
                playerIndex: assignedIndex,
                roomCode: code,
                totalPlayers: room.clients.size
            });

            console.log(`[Multiplayer] Player ${ws.clientId} joined room ${code} as P${assignedIndex} (${room.clients.size}/${MAX_SQUAD_SIZE})`);
            break;
        }

        case 'sync_player': {
            if (!ws.roomCode) return;
            const room = rooms.get(ws.roomCode);
            if (!room) return;

            broadcastToRoom(room, ws, {
                type: 'partner_sync',
                peerId: ws.clientId,
                playerIndex: ws.playerIndex,
                state: msg.state,
                t: msg.t || Date.now()
            });
            break;
        }

        case 'sync_world_snapshot': {
            // Authoritative Host World State Broadcast (Enemies, Objects, Drops, Pits, Mounds)
            if (!ws.roomCode) return;
            const room = rooms.get(ws.roomCode);
            if (!room || !ws.isHost) return;

            broadcastToRoom(room, ws, {
                type: 'world_snapshot',
                snapshot: msg.snapshot,
                t: Date.now()
            });
            break;
        }

        case 'player_action': {
            if (!ws.roomCode) return;
            const room = rooms.get(ws.roomCode);
            if (!room) return;

            broadcastToRoom(room, ws, {
                type: 'partner_action',
                peerId: ws.clientId,
                playerIndex: ws.playerIndex,
                action: msg.action,
                data: msg.data
            });
            break;
        }

        case 'room_transition': {
            if (!ws.roomCode) return;
            const room = rooms.get(ws.roomCode);
            if (!room) return;

            broadcastToRoom(room, ws, {
                type: 'sync_room_transition',
                peerId: ws.clientId,
                playerIndex: ws.playerIndex,
                curX: msg.curX,
                curY: msg.curY,
                depth: msg.depth,
                dir: msg.dir || null
            });
            break;
        }

        case 'ping': {
            ws.send(JSON.stringify({ type: 'pong', t: Date.now() }));
            break;
        }
    }
}

function handleDisconnect(ws) {
    if (!ws.roomCode) return;
    const room = rooms.get(ws.roomCode);
    if (!room) return;

    room.clients.delete(ws.clientId);
    console.log(`[Multiplayer] Player ${ws.clientId} (P${ws.playerIndex}) left room ${ws.roomCode}. Remaining: ${room.clients.size}`);

    if (room.clients.size === 0) {
        rooms.delete(ws.roomCode);
        console.log(`[Multiplayer] Room closed (empty): ${ws.roomCode}`);
    } else {
        // If host left, elect next player as host
        if (ws.isHost) {
            const nextClient = room.clients.values().next().value;
            if (nextClient) {
                nextClient.isHost = true;
                nextClient.ws.isHost = true;
                nextClient.ws.send(JSON.stringify({
                    type: 'promoted_to_host',
                    message: 'Host has left. You are now Expedition Leader!'
                }));
            }
        }

        broadcastToRoom(room, ws, {
            type: 'partner_left',
            peerId: ws.clientId,
            playerIndex: ws.playerIndex,
            totalPlayers: room.clients.size,
            message: `Keeper P${ws.playerIndex} disconnected.`
        });
    }
    ws.roomCode = null;
}

// Keep-alive heartbeat interval (every 25 seconds)
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 25000);

wss.on('close', () => {
    clearInterval(interval);
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Crypt Keeper Web Server • 6-Player Co-Op Hub Ready`);
    console.log(` HTTP & WebSocket Server running at: http://localhost:${PORT}`);
    console.log(` WebSocket URL: ws://localhost:${PORT}`);
    console.log(`=======================================================`);
});
