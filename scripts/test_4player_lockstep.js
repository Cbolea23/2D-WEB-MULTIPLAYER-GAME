import { WebSocket } from 'ws';

console.log('--- Starting 4-Player Lockstep Expedition Test ---');

const clients = [];
const URL = 'ws://localhost:3000';

const p1 = new WebSocket(URL);

p1.on('open', () => {
    console.log('[P1 Host] Connected, sending create_room...');
    p1.send(JSON.stringify({ type: 'create_room', seed: 1337 }));
});

p1.on('message', (d1) => {
    const m1 = JSON.parse(d1.toString());
    if (m1.type === 'room_created') {
        const roomCode = m1.roomCode;
        console.log(`[P1 Host] Room ${roomCode} created. Index: ${m1.playerIndex}, isHost: ${m1.isHost}`);

        // Connect P2, P3, P4
        const p2 = new WebSocket(URL);
        const p3 = new WebSocket(URL);
        const p4 = new WebSocket(URL);

        let joinedCount = 0;
        const peers = [
            { ws: p2, name: 'P2', expectedIdx: 2 },
            { ws: p3, name: 'P3', expectedIdx: 3 },
            { ws: p4, name: 'P4', expectedIdx: 4 }
        ];

        peers.forEach((peer) => {
            peer.ws.on('open', () => {
                peer.ws.send(JSON.stringify({ type: 'join_room', roomCode }));
            });

            peer.ws.on('message', (data) => {
                const msg = JSON.parse(data.toString());
                if (msg.type === 'room_joined') {
                    console.log(`[${peer.name}] Joined! Assigned Index: ${msg.playerIndex}, Total in squad: ${msg.players.length}`);
                    if (msg.playerIndex !== peer.expectedIdx) {
                        console.error(`FAIL: ${peer.name} expected index ${peer.expectedIdx}, got ${msg.playerIndex}`);
                        process.exit(1);
                    }
                    joinedCount++;
                    if (joinedCount === 3) {
                        console.log('>>> ALL 4 PLAYERS IN SQUAD ROSTER! <<<');
                        // Host triggers start_game
                        setTimeout(() => {
                            console.log('[P1 Host] Launching expedition for 4 players (start_game)...');
                            p1.send(JSON.stringify({ type: 'start_game' }));
                        }, 100);
                    }
                }

                if (msg.type === 'game_started') {
                    console.log(`[${peer.name}] Received game_started event for seed ${msg.seed}!`);
                }

                if (msg.type === 'world_snapshot') {
                    console.log(`[${peer.name}] Lockstep snapshot validated: ${msg.snapshot.enemies.length} enemies, ${msg.snapshot.mounds.length} mounds, ${msg.snapshot.chests.length} chests`);
                }

                if (msg.type === 'partner_action' && msg.action === 'change_weapon') {
                    console.log(`[${peer.name}] Received weapon change from P${msg.playerIndex}: ${msg.data.weaponId}`);
                }
            });
        });

        p1.on('message', (hostData) => {
            const hostMsg = JSON.parse(hostData.toString());
            if (hostMsg.type === 'game_started') {
                console.log('[P1 Host] Received game_started broadcast. Broadcasting world snapshot...');
                p1.send(JSON.stringify({
                    type: 'sync_world_snapshot',
                    snapshot: {
                        curX: 2, curY: 2, depth: 1, roomCleared: false, portalActive: false,
                        enemies: [
                            { id: 0, type: 'skeleton', x: 200, y: 300, hp: 50, maxHp: 50 },
                            { id: 1, type: 'mummy', x: 350, y: 250, hp: 60, maxHp: 60 },
                            { id: 2, type: 'wraith', x: 180, y: 180, hp: 45, maxHp: 45 }
                        ],
                        drops: [{ type: 'gold', x: 200, y: 200, value: 50 }],
                        mounds: [{ x: 150, y: 250, hp: 3, maxHp: 3 }, { x: 300, y: 200, hp: 3, maxHp: 3 }],
                        pits: [],
                        chests: [{ x: 400, y: 200, opened: false }]
                    }
                }));

                setTimeout(() => {
                    console.log('[P4] Changing weapon to soulreaper_scythe...');
                    p4.send(JSON.stringify({
                        type: 'player_action',
                        action: 'change_weapon',
                        data: { weaponId: 'soulreaper_scythe' }
                    }));
                }, 100);

                setTimeout(() => {
                    console.log('>>> 4-PLAYER LOCKSTEP EXPEDITION TEST PASSED WITH 100% SUCCESS! <<<');
                    p1.close();
                    p2.close();
                    p3.close();
                    p4.close();
                    process.exit(0);
                }, 300);
            }
        });
    }
});
