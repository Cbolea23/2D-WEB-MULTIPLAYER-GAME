import { WebSocket } from 'ws';

const ws1 = new WebSocket('ws://localhost:3000');

ws1.on('open', () => {
    console.log('[Test] Client 1 connected. Creating room...');
    ws1.send(JSON.stringify({ type: 'create_room' }));
});

ws1.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('[Test Client 1 received]:', msg.type, msg.roomCode || '');

    if (msg.type === 'room_created') {
        const roomCode = msg.roomCode;
        console.log(`[Test] Connecting Client 2 to room ${roomCode}...`);

        const ws2 = new WebSocket('ws://localhost:3000');
        ws2.on('open', () => {
            ws2.send(JSON.stringify({ type: 'join_room', roomCode }));
        });

        ws2.on('message', (d2) => {
            const m2 = JSON.parse(d2.toString());
            console.log('[Test Client 2 received]:', m2.type);
            if (m2.type === 'room_joined') {
                console.log('[Test SUCCESS] Client 2 joined successfully! Sending sync packet...');
                ws2.send(JSON.stringify({
                    type: 'sync_player',
                    state: { x: 100, y: 150, hp: 120, facing: 1 }
                }));
            }
        });
    }

    if (msg.type === 'peer_joined') {
        console.log('[Test SUCCESS] Client 1 acknowledged peer joined!');
    }

    if (msg.type === 'partner_sync') {
        console.log('[Test SUCCESS] Client 1 received sync from Client 2:', msg.state);
        setTimeout(() => {
            ws1.close();
            process.exit(0);
        }, 500);
    }
});
