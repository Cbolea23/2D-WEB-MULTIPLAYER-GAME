import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

async function main() {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--remote-debugging-port=9222',
        '--window-size=1280,720',
        'file:///d:/desktop/2d%20roguelike%20web%20game/index.html'
    ]);

    await new Promise(r => setTimeout(r, 3500));

    http.get('http://127.0.0.1:9222/json', (res) => {
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
                
                // Wait for complete
                await send('Runtime.evaluate', {
                    expression: `
                        new Promise(resolve => {
                            if (document.readyState === 'complete') return resolve();
                            window.addEventListener('load', resolve);
                        })
                    `,
                    awaitPromise: true
                });

                // Click Start Expedition
                console.log('Clicking Start Expedition...');
                await send('Runtime.evaluate', {
                    expression: "document.getElementById('btn-home-solo').click()"
                });

                await new Promise(r => setTimeout(r, 1200));

                console.log('Capturing shot2_gameplay.png...');
                const snap = await send('Page.captureScreenshot', { format: 'png' });
                fs.writeFileSync('shot2_gameplay.png', Buffer.from(snap.data, 'base64'));

                // Move player right and trigger attack
                await send('Runtime.evaluate', {
                    expression: `
                        player.x += 120;
                        performAttack();
                    `
                });
                await new Promise(r => setTimeout(r, 400));

                console.log('Capturing shot3_combat.png...');
                const snap2 = await send('Page.captureScreenshot', { format: 'png' });
                fs.writeFileSync('shot3_combat.png', Buffer.from(snap2.data, 'base64'));

                chrome.kill();
                process.exit(0);
            });
        });
    });
}
main();
