import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function debugRuntime() {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--remote-debugging-port=9229',
        'file:///d:/desktop/2d%20roguelike%20web%20game/index.html'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    http.get('http://127.0.0.1:9229/json', (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', async () => {
            const list = JSON.parse(data);
            const page = list.find(t => t.type === 'page');
            const ws = new WebSocket(page.webSocketDebuggerUrl);

            let id = 1;
            function send(m, p = {}) {
                return new Promise(r => {
                    const reqId = id++;
                    const h = msg => {
                        const d = JSON.parse(msg);
                        if (d.id === reqId) {
                            ws.off('message', h);
                            r(d.result);
                        }
                    };
                    ws.on('message', h);
                    ws.send(JSON.stringify({ id: reqId, method: m, params: p }));
                });
            }

            ws.on('open', async () => {
                await send('Runtime.enable');
                await send('Console.enable');

                ws.on('message', m => {
                    const d = JSON.parse(m);
                    if (d.method === 'Runtime.consoleAPICalled') {
                        console.log('[BROWSER LOG]', d.params.args.map(a => a.value || a.description).join(' '));
                    }
                    if (d.method === 'Runtime.exceptionThrown') {
                        console.error('[BROWSER EXCEPTION]', d.params.exceptionDetails.text, d.params.exceptionDetails.exception?.description);
                    }
                });

                // Check if home screen is visible
                const homeState = await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const home = document.getElementById('home-screen');
                            const btn = document.getElementById('btn-home-solo');
                            return {
                                homeHidden: home.classList.contains('hidden'),
                                hasBtn: !!btn,
                                gameRunning: game.running
                            };
                        })()
                    `,
                    returnByValue: true
                });
                console.log('HOME STATE BEFORE CLICK:', JSON.stringify(homeState.result.value));

                // Click Start Expedition
                await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const btn = document.getElementById('btn-home-solo');
                            btn.click();
                            return {
                                homeHidden: document.getElementById('home-screen').classList.contains('hidden'),
                                gameRunning: game.running
                            };
                        })()
                    `,
                    returnByValue: true
                });

                await new Promise(r => setTimeout(r, 600));

                const d1 = await send('Runtime.evaluate', {
                    expression: "({ running: game.running, paused: game.paused, curX: game.curX, curY: game.curY, enemies: enemies.length, pos: [player.x, player.y] })",
                    returnByValue: true
                });
                console.log('STATUS 1:', JSON.stringify(d1.result.value));

                const transition = await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const r = currentRoom();
                            const d = Object.keys(r.doors).find(k => r.doors[k]);
                            const ok = changeRoom(d);
                            return { ok, d, curX: game.curX, curY: game.curY, roomType: currentRoom().type, enemies: enemies.length };
                        })()
                    `,
                    returnByValue: true
                });
                console.log('TRANSITION:', JSON.stringify(transition.result.value));

                await new Promise(r => setTimeout(r, 800));

                const d2 = await send('Runtime.evaluate', {
                    expression: "({ running: game.running, paused: game.paused, curX: game.curX, curY: game.curY, enemies: enemies.length, pos: [player.x, player.y] })",
                    returnByValue: true
                });
                console.log('STATUS 2:', JSON.stringify(d2.result.value));

                chrome.kill();
                process.exit(0);
            });
        });
    });
}

debugRuntime();
