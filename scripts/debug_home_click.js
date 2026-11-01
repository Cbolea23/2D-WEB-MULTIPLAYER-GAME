import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function debug() {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--remote-debugging-port=9223',
        '--window-size=1280,720',
        'file:///d:/desktop/2d%20roguelike%20web%20game/index.html'
    ]);

    await new Promise(r => setTimeout(r, 1200));

    http.get('http://127.0.0.1:9223/json', (res) => {
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
                await send('Console.enable');

                ws.on('message', (msg) => {
                    const m = JSON.parse(msg);
                    if (m.method === 'Console.messageAdded') {
                        console.log('CONSOLE:', m.params.message.level, m.params.message.text);
                    }
                    if (m.method === 'Runtime.exceptionThrown') {
                        console.log('EXCEPTION:', JSON.stringify(m.params.exceptionDetails));
                    }
                });

                const res = await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            const btn = document.getElementById('btn-home-solo');
                            const home = document.getElementById('home-screen');
                            return {
                                btnExists: !!btn,
                                homeExists: !!home,
                                hasAuthManager: typeof AuthManager !== 'undefined',
                                hasSettingsManager: typeof SettingsManager !== 'undefined',
                                authInited: typeof AuthManager !== 'undefined' ? AuthManager.user : 'n/a',
                                readyState: document.readyState
                            };
                        })()
                    `,
                    returnByValue: true
                });
                console.log('INITIAL CHECK:', res.result.value);

                // Now simulate click
                console.log('Triggering click...');
                const clickRes = await send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            try {
                                const btn = document.getElementById('btn-home-solo');
                                btn.click();
                                const home = document.getElementById('home-screen');
                                return {
                                    afterClickClass: home.className,
                                    isHidden: home.classList.contains('hidden'),
                                    styleDisplay: window.getComputedStyle(home).display,
                                    gameRunning: game.running
                                };
                            } catch (e) {
                                return { error: e.message, stack: e.stack };
                            }
                        })()
                    `,
                    returnByValue: true
                });
                console.log('AFTER CLICK:', clickRes.result.value);

                chrome.kill();
                process.exit(0);
            });
        });
    });
}
debug();
