import { WebSocket } from 'ws';

const ws1 = new WebSocket('ws://localhost:3000');

ws1.on('open', () => {
    console.log('[Host P1] Connected. Creating 6P room...');
    ws1.send(JSON.stringify({ type: 'create_room' }));
});

ws1.on('message', (d1) => {
    const m1 = JSON.parse(d1.toString());
    if (m1.type === 'room_created') {
        const code = m1.roomCode;
        console.log(`[Host P1] Room created: ${code}. Connecting P2 & P3...`);

        const ws2 = new WebSocket('ws://localhost:3000');
        ws2.on('open', () => {
            ws2.send(JSON.stringify({ type: 'join_room', roomCode: code }));
        });

        const ws3 = new WebSocket('ws://localhost:3000');
        ws3.on('open', () => {
            ws3.send(JSON.stringify({ type: 'join_room', roomCode: code }));
        });

        ws2.on('message', (d2) => {
            const m2 = JSON.parse(d2.toString());
            if (m2.type === 'room_joined') {
                console.log(`[P2] Successfully joined room as P${m2.playerIndex}`);
            }
            if (m2.type === 'world_snapshot') {
                console.log(`[P2 SUCCESS] Received authoritative world snapshot with ${m2.snapshot.enemies.length} enemies & ${m2.snapshot.mounds.length} mounds!`);
            }
        });

        ws3.on('message', (d3) => {
            const m3 = JSON.parse(d3.toString());
            if (m3.type === 'room_joined') {
                console.log(`[P3] Successfully joined room as P${m3.playerIndex}`);
                // P1 broadcasts world snapshot
                ws1.send(JSON.stringify({
                    type: 'sync_world_snapshot',
                    snapshot: {
                        curX: 2, curY: 2, depth: 1, roomCleared: false, portalActive: false,
                        enemies: [{ id: 0, type: 'skeleton', x: 200, y: 300, hp: 50, maxHp: 50 }],
                        projectiles: [], drops: [], mounds: [{ x: 150, y: 250, hp: 3, maxHp: 3 }],
                        pits: [], chests: [{ x: 400, y: 200, opened: false }]
                    }
                }));
            }
            if (m3.type === 'world_snapshot') {
                console.log(`[P3 SUCCESS] Received authoritative world snapshot with ${m3.snapshot.enemies.length} enemies!`);
                setTimeout(() => {
                    console.log('[MULTI-PLAYER TEST COMPLETED SUCCESSFULLY!]');
                    ws1.close();
                    ws2.close();
                    ws3.close();
                    process.exit(0);
                }, 300);
            }
        });
    }
});
