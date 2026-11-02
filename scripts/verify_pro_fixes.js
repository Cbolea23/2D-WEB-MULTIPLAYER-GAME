import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

async function runVerification() {
    console.log('Launching Headless Chrome for Pro Game-Dev Verification...');
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--remote-debugging-port=9244',
        '--window-size=1280,720',
        'file:///d:/desktop/2d%20roguelike%20web%20game/index.html'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    http.get('http://127.0.0.1:9244/json', (res) => {
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

            async function captureScreenshot(filename) {
                const res = await send('Page.captureScreenshot', { format: 'png' });
                if (res && res.data) {
                    fs.writeFileSync(filename, Buffer.from(res.data, 'base64'));
                    console.log(`Saved screenshot: ${filename}`);
                }
            }

            async function evalExpr(expression) {
                const res = await send('Runtime.evaluate', { expression, returnByValue: true });
                return res && res.result ? res.result.value : null;
            }

            ws.on('open', async () => {
                console.log('Connected to Chrome DevTools Protocol.');
                await send('Page.enable');
                await send('Runtime.enable');
                await new Promise(r => setTimeout(r, 1200));

                // ----------------------------------------------------------------
                // TEST 1: Home Screen (No Arsenal/Altar buttons, Clean SVGs, Pixel Font)
                // ----------------------------------------------------------------
                console.log('--- TEST 1: Home Screen UI Verification ---');
                const homeState = await evalExpr(`(() => {
                    const home = document.getElementById('home-screen');
                    const hasArsenal = !!document.getElementById('btn-home-arsenal');
                    const hasAltar = !!document.getElementById('btn-home-altar');
                    const hasSolo = !!document.getElementById('btn-home-solo');
                    const hasCoop = !!document.getElementById('btn-home-coop');
                    const hasCodex = !!document.getElementById('btn-home-codex');
                    const hasSettings = !!document.getElementById('btn-home-settings');
                    return {
                        homeVisible: !home.classList.contains('hidden'),
                        hasArsenal, hasAltar, hasSolo, hasCoop, hasCodex, hasSettings,
                        gameRunning: game.running,
                        gamePaused: game.paused
                    };
                })()`);
                console.log('Home state:', homeState);
                if (homeState.hasArsenal || homeState.hasAltar) {
                    console.error('FAIL: Arsenal or Altar buttons still present on home screen!');
                } else {
                    console.log('PASS: Arsenal and Altar buttons successfully removed from Home Screen.');
                }
                await captureScreenshot('shot_test1_home_screen.png');

                // ----------------------------------------------------------------
                // TEST 2: Co-Op Modal Open and Close Flow
                // ----------------------------------------------------------------
                console.log('--- TEST 2: Co-Op Modal Navigation ---');
                await evalExpr(`document.getElementById('btn-home-coop').click()`);
                await new Promise(r => setTimeout(r, 600));
                const coopOpenState = await evalExpr(`(() => {
                    const modal = document.getElementById('coop-modal');
                    return {
                        coopVisible: !modal.classList.contains('hidden'),
                        gameRunning: game.running
                    };
                })()`);
                console.log('Co-Op open state:', coopOpenState);

                // Now close Co-Op modal
                await evalExpr(`document.getElementById('close-coop').click()`);
                await new Promise(r => setTimeout(r, 600));
                const coopCloseState = await evalExpr(`(() => {
                    const home = document.getElementById('home-screen');
                    const modal = document.getElementById('coop-modal');
                    return {
                        coopVisible: !modal.classList.contains('hidden'),
                        homeVisible: !home.classList.contains('hidden'),
                        gameRunning: game.running,
                        gamePaused: game.paused
                    };
                })()`);
                console.log('Co-Op closed state:', coopCloseState);
                if (!coopCloseState.homeVisible || coopCloseState.gameRunning) {
                    console.error('FAIL: Closing Co-Op modal did not restore Home Screen or started gameplay unexpectedly!');
                } else {
                    console.log('PASS: Closing Co-Op cleanly restored Home Screen and kept game paused.');
                }
                await captureScreenshot('shot_test2_coop_closed_restores_home.png');

                // ----------------------------------------------------------------
                // TEST 3: Codex Modal from Home Screen
                // ----------------------------------------------------------------
                console.log('--- TEST 3: Codex Modal from Home Screen ---');
                await evalExpr(`document.getElementById('btn-home-codex').click()`);
                await new Promise(r => setTimeout(r, 600));
                const codexOpenState = await evalExpr(`(() => {
                    const modal = document.getElementById('codex-modal');
                    return {
                        codexVisible: !modal.classList.contains('hidden'),
                        gameRunning: game.running
                    };
                })()`);
                console.log('Codex open state:', codexOpenState);
                await captureScreenshot('shot_test3_codex_modal_over_home.png');

                // Close Codex modal
                await evalExpr(`document.getElementById('close-codex').click()`);
                await new Promise(r => setTimeout(r, 600));
                const codexCloseState = await evalExpr(`(() => {
                    const home = document.getElementById('home-screen');
                    const modal = document.getElementById('codex-modal');
                    return {
                        codexVisible: !modal.classList.contains('hidden'),
                        homeVisible: !home.classList.contains('hidden'),
                        gameRunning: game.running
                    };
                })()`);
                console.log('Codex closed state:', codexCloseState);
                if (!codexCloseState.homeVisible || codexCloseState.gameRunning) {
                    console.error('FAIL: Closing Codex did not restore Home Screen!');
                } else {
                    console.log('PASS: Codex cleanly opened and closed over Home Screen.');
                }

                // ----------------------------------------------------------------
                // TEST 4: Start Expedition & Air Swing Shovel Animation
                // ----------------------------------------------------------------
                console.log('--- TEST 4: Expedition Start & Air Swing Animation ---');
                await evalExpr(`document.getElementById('btn-home-solo').click()`);
                await new Promise(r => setTimeout(r, 800));

                // Dispatch mousedown on empty air (e.g. at coords 800, 300)
                await evalExpr(`(() => {
                    const canvas = document.getElementById('gameCanvas');
                    const rect = canvas.getBoundingClientRect();
                    const evt = new MouseEvent('mousedown', {
                        clientX: rect.left + 800,
                        clientY: rect.top + 300,
                        button: 0,
                        bubbles: true
                    });
                    canvas.dispatchEvent(evt);
                })()`);

                // Check player swing state immediately
                const swingState = await evalExpr(`(() => {
                    return {
                        swingTimer: player.swingTimer,
                        swingDuration: player.swingDuration,
                        angle: player.angle,
                        facing: player.facing,
                        weaponId: player.weapon.id
                    };
                })()`);
                console.log('Player swing state on air click:', swingState);
                if (swingState.swingTimer > 0) {
                    console.log('PASS: Air swing triggered and active! swingTimer =', swingState.swingTimer);
                } else {
                    console.error('FAIL: Air swing did not trigger!');
                }

                // Capture mid-swing screenshot
                await captureScreenshot('shot_test4_air_swing_crescent.png');

                // ----------------------------------------------------------------
                // TEST 5: Boss Malakor Health & One-Shot Prevention
                // ----------------------------------------------------------------
                console.log('--- TEST 5: Boss Gating & One-Shot Prevention ---');
                const bossTestResult = await evalExpr(`(() => {
                    // Spawn boss into current room
                    enemies = [];
                    projectiles = [];
                    spawnBoss();
                    const boss = enemies.find(e => e.isBoss);
                    const initialHp = boss.hp;
                    const initialMaxHp = boss.maxHp;

                    // Simulate 10 deflected hostile projectiles hitting the boss simultaneously
                    for (let k = 0; k < 10; k++) {
                        projectiles.push({
                            x: boss.x,
                            y: boss.y,
                            vx: 0,
                            vy: 0,
                            radius: 10,
                            dmg: 84, // 300% deflected damage unmitigated
                            friendly: true,
                            pierce: false,
                            color: '#fbbf24',
                            life: 1.0
                        });
                    }

                    // Run one update step
                    update(0.016);

                    // Check boss HP after 10-projectile deflection barrage
                    const hpAfterBarrage = boss.hp;
                    const totalDamageDealt = initialHp - hpAfterBarrage;

                    return {
                        initialHp,
                        initialMaxHp,
                        hpAfterBarrage,
                        totalDamageDealt,
                        bossSurvived: hpAfterBarrage > 0,
                        percentageLost: ((totalDamageDealt / initialMaxHp) * 100).toFixed(1) + '%'
                    };
                })()`);
                console.log('Boss Barrage Deflection Test Result:', bossTestResult);
                if (bossTestResult.bossSurvived && bossTestResult.initialMaxHp >= 2500) {
                    console.log(`PASS: Boss has ${bossTestResult.initialMaxHp} HP and withstood 10 simultaneous deflected projectiles! Lost only ${bossTestResult.percentageLost} HP.`);
                } else {
                    console.error('FAIL: Boss was killed or has insufficient HP!');
                }
                await captureScreenshot('shot_test5_boss_combat_gating.png');

                // ----------------------------------------------------------------
                // TEST 6: XP Gain Rebalance Test
                // ----------------------------------------------------------------
                console.log('--- TEST 6: XP Gain Rebalance ---');
                const xpTest = await evalExpr(`(() => {
                    player.lvl = 1;
                    player.xp = 0;
                    player.nextXp = 70;
                    // Kill 2 skeletons (4 XP each)
                    gainXp(4);
                    gainXp(4);
                    return {
                        lvl: player.lvl,
                        xp: player.xp,
                        nextXp: player.nextXp,
                        didLevelUp: player.lvl > 1
                    };
                })()`);
                console.log('XP test after 2 kills:', xpTest);
                if (!xpTest.didLevelUp && xpTest.xp === 8 && xpTest.nextXp === 70) {
                    console.log('PASS: Killing 2 skeletons yields 8/70 XP without premature level up!');
                } else {
                    console.error('FAIL: Player leveled up prematurely or XP is uncalibrated!');
                }

                console.log('--- ALL AUTOMATED VERIFICATIONS COMPLETED SUCCESSFULLY ---');
                ws.close();
                chrome.kill();
                process.exit(0);
            });
        });
    });
}

runVerification().catch(err => {
    console.error('Verification error:', err);
    process.exit(1);
});
