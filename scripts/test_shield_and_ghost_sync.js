import WebSocket from 'ws';

const SERVER_URL = 'ws://localhost:3000';

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
    console.log('--- STARTING SHIELD & GHOST SPECTATOR MULTIPLAYER TEST ---');

    // 1. Host Connects
    const hostWs = new WebSocket(SERVER_URL);
    let hostRoomCode = '';
    let hostPeerMap = new Map();

    await new Promise((resolve) => {
        hostWs.on('open', () => {
            console.log('Host connected to WebSocket server');
            hostWs.send(JSON.stringify({ type: 'create_room' }));
        });
        hostWs.on('message', (data) => {
            const msg = JSON.parse(data.toString());
            if (msg.type === 'room_created') {
                hostRoomCode = msg.roomCode;
                console.log(`Host created room: ${hostRoomCode}`);
                resolve();
            } else if (msg.type === 'partner_sync') {
                hostPeerMap.set(msg.peerId, msg.state);
            } else if (msg.type === 'partner_action') {
                if (msg.action === 'ghost_spectate') {
                    console.log(`[Host] Received ghost_spectate from peer ${msg.peerId}`);
                    const p = hostPeerMap.get(msg.peerId) || {};
                    p.isGhost = true;
                    hostPeerMap.set(msg.peerId, p);
                } else if (msg.action === 'revived') {
                    console.log(`[Host] Received revived from peer ${msg.peerId}`);
                    const p = hostPeerMap.get(msg.peerId) || {};
                    p.isGhost = false;
                    p.hp = 60;
                    hostPeerMap.set(msg.peerId, p);
                }
            }
        });
    });

    // 2. Peer Connects and joins Host's room
    const peerWs = new WebSocket(SERVER_URL);
    let peerEnemies = [];
    let peerJoined = false;

    await new Promise((resolve) => {
        peerWs.on('open', () => {
            console.log('Peer connected to WebSocket server');
            peerWs.send(JSON.stringify({ type: 'join_room', roomCode: hostRoomCode }));
        });
        peerWs.on('message', (data) => {
            const msg = JSON.parse(data.toString());
            if (msg.type === 'room_joined') {
                peerJoined = true;
                console.log(`Peer joined room: ${hostRoomCode} as P2`);
                resolve();
            } else if (msg.type === 'world_snapshot') {
                peerEnemies = msg.snapshot.enemies || [];
            }
        });
    });

    await wait(200);

    // 3. Test Shield Synchronization
    console.log('\n--- TEST 1: GARGOYLE SHIELD SYNCHRONIZATION ---');
    const mockHostGargoyle = {
        id: 0,
        type: 'gargoyle',
        sprite: 'gargoyle',
        x: 480,
        y: 270,
        hp: 110,
        maxHp: 110,
        vx: 0,
        vy: 0,
        facing: 1,
        flash: false,
        shielded: true,
        stunTimer: 0.0,
        isDummy: false,
        explodes: false,
        radius: 22,
        burrowed: false,
        isElite: false,
        isBoss: false,
        animFrame: 0,
        telegraphTimer: 0
    };

    hostWs.send(JSON.stringify({
        type: 'sync_world_snapshot',
        snapshot: {
            curX: 2,
            curY: 2,
            depth: 1,
            roomCleared: false,
            portalActive: false,
            enemies: [mockHostGargoyle],
            drops: [],
            mounds: [],
            pits: [],
            chests: []
        }
    }));

    await wait(250);

    if (peerEnemies.length === 0) {
        throw new Error('FAILED: Peer did not receive enemy snapshot from Host');
    }

    const peerGargoyle = peerEnemies[0];
    console.log('Peer received Gargoyle:', peerGargoyle);

    const shieldRendersOnPeer = peerGargoyle.shielded && (peerGargoyle.stunTimer || 0) <= 0;
    if (!shieldRendersOnPeer) {
        throw new Error(`FAILED: Gargoyle shield condition failed on peer! shielded: ${peerGargoyle.shielded}, stunTimer: ${peerGargoyle.stunTimer}`);
    }
    console.log('✅ TEST 1 PASSED: Gargoyle Shield is 100% active and synchronized on Peer!');

    // 4. Test Ghost Spectator Mode & Synchronization
    console.log('\n--- TEST 2: GHOST SPECTATOR SYNCHRONIZATION ---');
    // Peer dies and enters ghost spectator mode
    peerWs.send(JSON.stringify({
        type: 'player_action',
        action: 'ghost_spectate',
        data: { x: 300, y: 300 }
    }));
    peerWs.send(JSON.stringify({
        type: 'sync_player',
        t: Date.now(),
        state: {
            x: 300,
            y: 300,
            angle: 0,
            facing: 1,
            animFrame: 0,
            hp: 0,
            maxHp: 120,
            isDowned: false,
            isGhost: true,
            weaponId: 'rusty_spade'
        }
    }));

    await wait(250);

    const hostPeerState = Array.from(hostPeerMap.values())[0];
    if (!hostPeerState || !hostPeerState.isGhost) {
        throw new Error('FAILED: Host did not receive isGhost = true for Peer!');
    }
    console.log('✅ TEST 2 PASSED: Host successfully sees dead teammate as floating Ghost Spectator!');

    // 5. Test Watch Ad to Revive from Ghost Form
    console.log('\n--- TEST 3: RESURRECTION FROM GHOST FORM ---');
    peerWs.send(JSON.stringify({
        type: 'player_action',
        action: 'revived',
        data: { x: 320, y: 320 }
    }));
    peerWs.send(JSON.stringify({
        type: 'sync_player',
        t: Date.now(),
        state: {
            x: 320,
            y: 320,
            angle: 0,
            facing: 1,
            animFrame: 0,
            hp: 60,
            maxHp: 120,
            isDowned: false,
            isGhost: false,
            weaponId: 'rusty_spade'
        }
    }));

    await wait(250);

    const hostPeerRevivedState = Array.from(hostPeerMap.values())[0];
    if (!hostPeerRevivedState || hostPeerRevivedState.isGhost || hostPeerRevivedState.hp !== 60) {
        throw new Error('FAILED: Host did not update Peer to revived state!');
    }
    console.log('✅ TEST 3 PASSED: Peer revived with 50% HP (60/120) and ghost mode cleared on Host!');

    hostWs.close();
    peerWs.close();
    console.log('\n=======================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS! 🎉');
    console.log('=======================================================');
    process.exit(0);
}

runTest().catch(err => {
    console.error('TEST ERROR:', err);
    process.exit(1);
});
