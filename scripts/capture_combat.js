import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

async function testCombat() {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--remote-debugging-port=9230',
        '--window-size=1280,720',
        'file:///d:/desktop/2d%20roguelike%20web%20game/index.html'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    http.get('http://127.0.0.1:9230/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', async () => {
            const list = JSON.parse(data);
            const page = list.find(t => t.type === 'page');
            const ws = new WebSocket(page.webSocketDebuggerUrl);

            let id = 1;
            function send(method, params = {}) {
                return new Promise(resolve => {
                    const reqId = id++;
                    const handler = (msg) => {
                        const parsed = JSON.parse(msg);
                        if (parsed.id === reqId) {
                            ws.off('message', handler);
                            resolve(parsed.result);
                        }
                    };
                    ws.on('message', handler);
                    ws.send(JSON.stringify({ id: reqId, method, params }));
                });
            }

            ws.on('open', async () => {
                await send('Runtime.enable');
                await send('Page.enable');

                // Start game
                await send('Runtime.evaluate', {
                    expression: "document.getElementById('btn-home-solo').click()"
                });
                await new Promise(r => setTimeout(r, 600));

                // Find open door and transition to combat room
                console.log('Transitioning to combat room...');
                const transRes = await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const r = currentRoom();
                            const d = Object.keys(r.doors).find(k => r.doors[k]);
                            changeRoom(d);
                            return { dir: d, roomType: currentRoom().type, enemies: enemies.length };
                        })()
                    `,
                    returnByValue: true
                });
                console.log('Transitioned:', JSON.stringify(transRes.result.value));

                // Allow 600ms for room render and enemy positions to settle
                await new Promise(r => setTimeout(r, 600));

                console.log('Capturing shot4_room2_combat.png...');
                const snap = await send('Page.captureScreenshot', { format: 'png' });
                fs.writeFileSync('shot4_room2_combat.png', Buffer.from(snap.data, 'base64'));

                // Move closer to nearest enemy and trigger attack
                await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            if (enemies.length > 0) {
                                const e = enemies[0];
                                player.x = e.x - 38;
                                player.y = e.y;
                                player.angle = 0; // aim directly right at enemy
                                performAttack();
                            } else {
                                player.angle = 0;
                                performAttack();
                            }
                        })()
                    `
                });

                // Wait 60ms to capture mid-swing crescent slash arc
                await new Promise(r => setTimeout(r, 60));

                console.log('Capturing shot5_mid_swing.png...');
                const snap2 = await send('Page.captureScreenshot', { format: 'png' });
                fs.writeFileSync('shot5_mid_swing.png', Buffer.from(snap2.data, 'base64'));

                chrome.kill();
                process.exit(0);
            });
        });
    });
}
testCombat();
