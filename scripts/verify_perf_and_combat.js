import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

async function verifyPerfAndCombat() {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--remote-debugging-port=9231',
        '--window-size=1280,720',
        'file:///d:/desktop/2d%20roguelike%20web%20game/index.html'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    http.get('http://127.0.0.1:9231/json', (res) => {
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
                await send('Console.enable');

                ws.on('message', m => {
                    const d = JSON.parse(m);
                    if (d.method === 'Runtime.exceptionThrown') {
                        console.error('[BROWSER EXCEPTION]', d.params.exceptionDetails.text, d.params.exceptionDetails.exception?.description);
                    }
                });

                // Start game
                await send('Runtime.evaluate', {
                    expression: "document.getElementById('btn-home-solo').click()"
                });
                await new Promise(r => setTimeout(r, 600));

                // Transition to combat room
                await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const r = currentRoom();
                            const d = Object.keys(r.doors).find(k => r.doors[k]);
                            changeRoom(d);
                        })()
                    `
                });
                await new Promise(r => setTimeout(r, 500));

                // Profile 120 frames of continuous combat & rendering
                console.log('Benchmarking 120 frames in active combat...');
                const benchResult = await send('Runtime.evaluate', {
                    expression: `
                        new Promise(resolve => {
                            const frameTimes = [];
                            let count = 0;
                            let last = performance.now();

                            function sample() {
                                const now = performance.now();
                                frameTimes.push(now - last);
                                last = now;
                                count++;

                                // Simulate continuous player combat & input
                                if (count % 15 === 0) performAttack();

                                if (count < 120) {
                                    requestAnimationFrame(sample);
                                } else {
                                    const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
                                    const max = Math.max(...frameTimes);
                                    const fps = 1000 / avg;
                                    resolve({
                                        avgFrameTimeMs: avg.toFixed(2),
                                        maxFrameTimeMs: max.toFixed(2),
                                        estimatedFps: Math.round(fps),
                                        enemiesAlive: enemies.length,
                                        playerHp: player.hp
                                    });
                                }
                            }
                            requestAnimationFrame(sample);
                        })
                    `,
                    awaitPromise: true,
                    returnByValue: true
                });

                console.log('BENCHMARK RESULTS:', JSON.stringify(benchResult.result.value));

                console.log('Picking boon if draft opened...');
                await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const modal = document.getElementById('relic-modal');
                            if (modal && !modal.classList.contains('hidden')) {
                                const btn = modal.querySelector('.pixel-button-cyan, .pixel-button-gold, button');
                                if (btn) btn.click();
                            }
                        })()
                    `
                });
                await new Promise(r => setTimeout(r, 600));

                console.log('Capturing shot8_active_combat_post_boon.png...');
                const snap1 = await send('Page.captureScreenshot', { format: 'png' });
                fs.writeFileSync('shot8_active_combat_post_boon.png', Buffer.from(snap1.data, 'base64'));

                // Move towards an enemy and swing shovel
                await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            if (enemies.length > 0) {
                                const e = enemies[0];
                                player.x = e.x - 30;
                                player.y = e.y;
                                player.angle = 0;
                                performAttack();
                            }
                        })()
                    `
                });
                await new Promise(r => setTimeout(r, 80));

                console.log('Capturing shot9_combat_clash.png...');
                const snap2 = await send('Page.captureScreenshot', { format: 'png' });
                fs.writeFileSync('shot9_combat_clash.png', Buffer.from(snap2.data, 'base64'));

                chrome.kill();
                process.exit(0);
            });
        });
    });
}

verifyPerfAndCombat();
