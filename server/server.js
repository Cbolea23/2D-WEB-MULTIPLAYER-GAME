import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

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
    // Add permissive CORS for development
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

    // Fallback if index.html doesn't exist yet, try fix_ankh_badge_typo.html
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

// WebSocket Multiplayer Server
const wss = new WebSocketServer({ server });

/**
 * Room Schema:
 * {
 *   code: string,
 *   seed: number,
 *   host: WebSocket,
 *   peer: WebSocket | null,
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

wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.roomCode = null;
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
        serverTime: Date.now(),
        activeRooms: rooms.size
    }));
});

function handleMessage(ws, msg) {
    switch (msg.type) {
        case 'create_room': {
            // Clean up any old room this client was in
            handleDisconnect(ws);

            let code = msg.roomCode || generateRoomCode();
            while (rooms.has(code)) {
                code = generateRoomCode();
            }

            const room = {
                code,
                seed: msg.seed || Math.floor(Math.random() * 1000000),
                host: ws,
                peer: null,
                created: Date.now()
            };

            rooms.set(code, room);
            ws.roomCode = code;
            ws.isHost = true;

            ws.send(JSON.stringify({
                type: 'room_created',
                roomCode: code,
                seed: room.seed,
                isHost: true
            }));
            console.log(`[Multiplayer] Room created: ${code}`);
            break;
        }

        case 'join_room': {
            const code = (msg.roomCode || '').trim().toUpperCase();
            const room = rooms.get(code);

            if (!room) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: `Room "${code}" not found. Verify code and try again.`
                }));
                return;
            }

            if (room.peer && room.peer.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: `Room "${code}" is already full (2/2 players).`
                }));
                return;
            }

            // Bind peer
            room.peer = ws;
            ws.roomCode = code;
            ws.isHost = false;

            // Notify peer
            ws.send(JSON.stringify({
                type: 'room_joined',
                roomCode: code,
                seed: room.seed,
                isHost: false
            }));

            // Notify host
            if (room.host && room.host.readyState === WebSocket.OPEN) {
                room.host.send(JSON.stringify({
                    type: 'peer_joined',
                    roomCode: code
                }));
            }
            console.log(`[Multiplayer] Peer joined room: ${code}`);
            break;
        }

        case 'sync_player': {
            // Relay position, orientation, health, weapon, animation to partner
            if (!ws.roomCode) return;
            const room = rooms.get(ws.roomCode);
            if (!room) return;

            const target = ws.isHost ? room.peer : room.host;
            if (target && target.readyState === WebSocket.OPEN) {
                target.send(JSON.stringify({
                    type: 'partner_sync',
                    state: msg.state,
                    t: msg.t || Date.now()
                }));
            }
            break;
        }

        case 'player_action': {
            // Relay attacks, dashes, deflections, digs, revives
            if (!ws.roomCode) return;
            const room = rooms.get(ws.roomCode);
            if (!room) return;

            const target = ws.isHost ? room.peer : room.host;
            if (target && target.readyState === WebSocket.OPEN) {
                target.send(JSON.stringify({
                    type: 'partner_action',
                    action: msg.action,
                    data: msg.data
                }));
            }
            break;
        }

        case 'room_transition': {
            // Sync when host/peer changes room or depth
            if (!ws.roomCode) return;
            const room = rooms.get(ws.roomCode);
            if (!room) return;

            const target = ws.isHost ? room.peer : room.host;
            if (target && target.readyState === WebSocket.OPEN) {
                target.send(JSON.stringify({
                    type: 'sync_room_transition',
                    curX: msg.curX,
                    curY: msg.curY,
                    depth: msg.depth
                }));
            }
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

    if (ws.isHost) {
        // Host left - notify peer and tear down room
        if (room.peer && room.peer.readyState === WebSocket.OPEN) {
            room.peer.send(JSON.stringify({
                type: 'partner_left',
                message: 'Host has left the expedition.'
            }));
            room.peer.roomCode = null;
        }
        rooms.delete(ws.roomCode);
        console.log(`[Multiplayer] Host disconnected. Room closed: ${ws.roomCode}`);
    } else if (room.peer === ws) {
        // Peer left - notify host
        room.peer = null;
        if (room.host && room.host.readyState === WebSocket.OPEN) {
            room.host.send(JSON.stringify({
                type: 'partner_left',
                message: 'Companion disconnected. AI Partner will take over if enabled.'
            }));
        }
        console.log(`[Multiplayer] Peer disconnected from room: ${ws.roomCode}`);
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
    console.log(` Crypt Keeper: Rogue Shovel Web & Multiplayer Server`);
    console.log(` HTTP & WebSocket Server running at: http://localhost:${PORT}`);
    console.log(` WebSocket URL: ws://localhost:${PORT}`);
    console.log(`=======================================================`);
});
