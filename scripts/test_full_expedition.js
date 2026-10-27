import { WebSocket } from 'ws';

console.log('--- Starting Full Expedition End-to-End Test ---');

const ws1 = new WebSocket('ws://localhost:3000');

ws1.on('open', () => {
    console.log('[Host P1] Socket connected. Sending create_room...');
    ws1.send(JSON.stringify({ type: 'create_room', seed: 42 }));
});

ws1.on('message', (d1) => {
    const m1 = JSON.parse(d1.toString());
    
    if (m1.type === 'room_created') {
        const roomCode = m1.roomCode;
        console.log(`[Host P1] Room created: ${roomCode}. PlayerIndex: ${m1.playerIndex}, isHost: ${m1.isHost}`);
        if (m1.playerIndex !== 1 || !m1.isHost) {
            console.error('FAIL: Host should be P1 with isHost=true');
            process.exit(1);
        }

        // P2 joins
        const ws2 = new WebSocket('ws://localhost:3000');
        
        ws2.on('open', () => {
            console.log(`[Peer P2] Socket connected. Joining ${roomCode}...`);
            ws2.send(JSON.stringify({ type: 'join_room', roomCode }));
        });

        ws2.on('message', (d2) => {
            const m2 = JSON.parse(d2.toString());
            
            if (m2.type === 'room_joined') {
                console.log(`[Peer P2] Joined room! PlayerIndex: ${m2.playerIndex}, isHost: ${m2.isHost}`);
                if (m2.playerIndex !== 2 || m2.isHost !== false) {
                    console.error('FAIL: Joiner should be P2 with isHost=false');
                    process.exit(1);
                }
                if (m2.players.length !== 2) {
                    console.error('FAIL: Room should have 2 players in roster');
                    process.exit(1);
                }
                console.log('[Peer P2] Verified Roster: P1 is Host, P2 is Self.');

                // Host starts game
                setTimeout(() => {
                    console.log('[Host P1] Triggering start_game (Start Expedition button)...');
                    ws1.send(JSON.stringify({ type: 'start_game' }));
                }, 100);
            }

            if (m2.type === 'game_started') {
                console.log('[Peer P2] Received game_started event! Closing lobby and entering dungeon!');
            }

            if (m2.type === 'world_snapshot') {
                console.log(`[Peer P2] Received Host-Authoritative World Snapshot:
 - Cur Room: (${m2.snapshot.curX}, ${m2.snapshot.curY}) Depth: ${m2.snapshot.depth}
 - Enemies: ${m2.snapshot.enemies.length} (${m2.snapshot.enemies[0].type} HP: ${m2.snapshot.enemies[0].hp}/${m2.snapshot.enemies[0].maxHp})
 - Mounds: ${m2.snapshot.mounds.length}
 - Chests: ${m2.snapshot.chests.length}`);
                
                // Peer sends action / sync
                ws2.send(JSON.stringify({
                    type: 'sync_player',
                    state: {
                        x: 250,
                        y: 350,
                        angle: 1.57,
                        animFrame: 2,
                        swingProgress: 0.75,
                        hp: 80,
                        maxHp: 100,
                        weaponKey: 'bone_cleaver'
                    }
                }));
            }
        });

        ws1.on('message', (extraD1) => {
            const extraM1 = JSON.parse(extraD1.toString());
            if (extraM1.type === 'peer_joined') {
                console.log(`[Host P1] Peer joined notification: P${extraM1.playerIndex}. Total squad: ${extraM1.totalPlayers}`);
            }
            if (extraM1.type === 'game_started') {
                console.log('[Host P1] Received game_started broadcast. Host entering dungeon!');
                
                // Broadcast world snapshot from Host
                ws1.send(JSON.stringify({
                    type: 'sync_world_snapshot',
                    snapshot: {
                        curX: 2, curY: 2, depth: 1, roomCleared: false, portalActive: false,
                        enemies: [{ id: 0, type: 'mummy', x: 220, y: 310, hp: 60, maxHp: 60 }],
                        projectiles: [],
                        drops: [{ id: 'drop_1', type: 'gold', x: 200, y: 200, val: 50 }],
                        mounds: [{ x: 180, y: 220, hp: 3, maxHp: 3 }],
                        pits: [],
                        chests: [{ x: 420, y: 180, opened: false }]
                    }
                }));
            }
            if (extraM1.type === 'partner_sync') {
                console.log(`[Host P1] Received sync from P${extraM1.playerIndex} with weapon: ${extraM1.state.weaponKey}, swingProgress: ${extraM1.state.swingProgress}`);
                console.log('>>> ALL MULTIPLAYER & EXPEDITION SYNC CHECKS PASSED! <<<');
                setTimeout(() => {
                    ws1.close();
                    process.exit(0);
                }, 300);
            }
        });
    }
});
