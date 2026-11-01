import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function test() {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--remote-debugging-port=9225',
        '--window-size=1280,720',
        'file:///d:/desktop/2d%20roguelike%20web%20game/index.html'
    ]);

    await new Promise(r => setTimeout(r, 4000));

    http.get('http://127.0.0.1:9225/json', (res) => {
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

                ws.on('message', msg => {
                    const m = JSON.parse(msg);
                    if (m.method === 'Runtime.consoleAPICalled') {
                        console.log('BROWSER LOG:', m.params.type, m.params.args.map(a => a.value || a.description).join(' '));
                    }
                    if (m.method === 'Runtime.exceptionThrown') {
                        console.log('UNCAUGHT EXCEPTION:', JSON.stringify(m.params.exceptionDetails));
                    }
                });

                const stateCheck = await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            return {
                                readyState: document.readyState,
                                hasWindowOnloadFired: typeof atlas !== 'undefined' && !!atlas.sprites['hero_0'],
                                gameRunning: game.running
                            };
                        })()
                    `,
                    returnByValue: true
                });
                console.log('State before click:', stateCheck.result.value);

                // Evaluate direct click on btn-home-solo
                const res = await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const btn = document.getElementById('btn-home-solo');
                            console.log('Button element:', btn ? btn.id : 'null');
                            btn.click();
                            return 'clicked';
                        })()
                    `
                });
                console.log('Evaluate result:', res);

                await new Promise(r => setTimeout(r, 4000));

                const check = await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const home = document.getElementById('home-screen');
                            return {
                                homeHidden: home.classList.contains('hidden'),
                                homeDisplay: window.getComputedStyle(home).display,
                                gameRunning: game.running
                            };
                        })()
                    `,
                    returnByValue: true
                });
                console.log('Check after 1.2s:', check.result.value);

                chrome.kill();
                process.exit(0);
            });
        });
    });
}
test();
