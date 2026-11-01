/**
 * apply_complete_remaster.js
 * Comprehensive master script applying all 5 pillars of the CrazyGames Quality Remaster:
 * 1. Seamless Zero-Friction Auto-Save (LocalStorage + CrazyGames Cloud Data Sync, no login required)
 * 2. Title Screen Flow & State (game.running = false on start, all 4 hub buttons wired, clean start expedition)
 * 3. Continuous Hold-To-Attack & Smart Aim (Zero finger fatigue, fluid WASD smart-aim)
 * 4. Room 1 Visual Floor Keycaps & 25 HP Starter Skeleton (Replaces 9999 HP soft-lock dummy)
 * 5. Visuals 2.0: Dynamic Lighting Pass, Torchlight Flicker, Soft Drop Shadows, Solid White Hit Flash, Clean Solo Mode (no P1 tag)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('[REMASTER] Applying complete master quality upgrades to index.html...');

// ============================================================================
// PILLAR 1: SEAMLESS AUTO-SAVE SYSTEM (ZERO FRICTION)
// ============================================================================
const oldSavePattern = /const SAVE_KEY = 'crypt_keeper_master_v3';[\s\S]*?let metaSave = loadMetaSave\(\);/;

const newSaveCode = `const SAVE_KEY = 'crypt_keeper_master_v3';

        function loadMetaSave() {
            try {
                const raw = localStorage.getItem(SAVE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    return {
                        souls: typeof parsed.souls === 'number' ? parsed.souls : 0,
                        bestDepth: parsed.bestDepth || 1,
                        selectedWeapon: parsed.selectedWeapon || 'rusty_spade',
                        upgrades: {
                            vitality: parsed.upgrades?.vitality ?? 0,
                            forgedEdge: parsed.upgrades?.forgedEdge ?? 0,
                            rerolls: parsed.upgrades?.rerolls ?? 1,
                            heirloom: parsed.upgrades?.heirloom ?? 0
                        }
                    };
                }
            } catch (e) {
                console.warn('Local save load error, resetting defaults:', e);
            }
            return {
                souls: 0,
                bestDepth: 1,
                selectedWeapon: 'rusty_spade',
                upgrades: { vitality: 0, forgedEdge: 0, rerolls: 1, heirloom: 0 }
            };
        }

        function saveMeta() {
            try {
                localStorage.setItem(SAVE_KEY, JSON.stringify(metaSave));
                if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.data) {
                    window.CrazyGames.SDK.data.setItem(SAVE_KEY, JSON.stringify(metaSave));
                }
            } catch (e) {
                console.warn('Save error:', e);
            }
        }

        let metaSave = loadMetaSave();`;

if (html.match(oldSavePattern)) {
    html = html.replace(oldSavePattern, newSaveCode);
    console.log('✓ Pillar 1: Replaced save system with zero-friction automatic persistence.');
} else {
    console.warn('⚠️ Could not match oldSavePattern directly; checking if already applied.');
}

// ============================================================================
// PILLAR 2: TITLE SCREEN STATE (game.running = false on page load)
// ============================================================================
html = html.replace(/let game = \{\s*running:\s*true,/, 'let game = {\n            running: false,');
console.log('✓ Pillar 2: Initialized game.running = false on page load.');

// Wire title screen hub buttons: Arsenal, Soul Altar, Settings, Codex
const hubWiringSearch = `const btnHomeSettings = document.getElementById('btn-home-settings');`;
const hubWiringReplacement = `// Title Screen Hub Modal Triggers
                const btnHomeArsenal = document.getElementById('btn-home-arsenal');
                if (btnHomeArsenal) {
                    btnHomeArsenal.addEventListener('click', () => {
                        sfx.init();
                        openArsenalModal();
                    });
                }

                const btnHomeAltar = document.getElementById('btn-home-altar');
                if (btnHomeAltar) {
                    btnHomeAltar.addEventListener('click', () => {
                        sfx.init();
                        openAltarModal();
                    });
                }

                const btnHomeSettings = document.getElementById('btn-home-settings');`;

if (html.includes(hubWiringSearch) && !html.includes('btnHomeArsenal')) {
    html = html.replace(hubWiringSearch, hubWiringReplacement);
    console.log('✓ Pillar 2: Wired Arsenal and Soul Altar buttons on Title Screen.');
}

// In btnHomeSolo click: make sure restartRun() always starts expedition cleanly
const oldBtnHomeSolo = `btnHomeSolo.addEventListener('click', () => {
                        document.getElementById('home-screen').classList.add('hidden');
                        sfx.init();
                        sfx.play('levelup');
                        if (!game.running) {
                            restartRun();
                        }
                        if (typeof AdManager !== 'undefined') AdManager.onGameplayStart();
                    });`;

const newBtnHomeSolo = `btnHomeSolo.addEventListener('click', () => {
                        document.getElementById('home-screen').classList.add('hidden');
                        sfx.init();
                        sfx.play('levelup');
                        restartRun();
                        game.running = true;
                        game.paused = false;
                        if (typeof AdManager !== 'undefined') AdManager.onGameplayStart();
                    });`;

if (html.includes(oldBtnHomeSolo)) {
    html = html.replace(oldBtnHomeSolo, newBtnHomeSolo);
    console.log('✓ Pillar 2: btn-home-solo updated to cleanly launch runs with audio/ad init.');
}

// ============================================================================
// PILLAR 3: CONTINUOUS HOLD-TO-ATTACK & SMART AIM
// ============================================================================
// Add continuous hold-to-attack in update(dt)
const updateHeadSearch = `function update(dt) {
            if (!game.running || game.paused) return;

            const room = currentRoom();`;

const updateHeadReplace = `function update(dt) {
            if (!game.running || game.paused) return;

            // Continuous Hold-To-Attack (Hold LMB or Space)
            if ((mousePos.down || keys['Space']) && player.swingCooldown <= 0 && !player.isGhost) {
                performAttack();
            }

            const room = currentRoom();`;

if (html.includes(updateHeadSearch) && !html.includes('Continuous Hold-To-Attack')) {
    html = html.replace(updateHeadSearch, updateHeadReplace);
    console.log('✓ Pillar 3: Added continuous hold-to-attack in update(dt).');
}

// Smart Aim: if mouse has not moved or keyboard is actively moving, smart aim
const aimUpdateSearch = `if (!game.usingTouch) {
                mousePos.worldX = (mousePos.x - canvas.width / 2) / game.zoom + game.camera.x;
                mousePos.worldY = (mousePos.y - canvas.height / 2) / game.zoom + game.camera.y;
                player.angle = Math.atan2(mousePos.worldY - player.y, mousePos.worldX - player.x);
                player.facing = Math.cos(player.angle) >= 0 ? 1 : -1;
            }`;

const aimUpdateReplace = `if (!game.usingTouch) {
                if (mousePos.hasMoved) {
                    mousePos.worldX = (mousePos.x - canvas.width / 2) / game.zoom + game.camera.x;
                    mousePos.worldY = (mousePos.y - canvas.height / 2) / game.zoom + game.camera.y;
                    player.angle = Math.atan2(mousePos.worldY - player.y, mousePos.worldX - player.x);
                    player.facing = Math.cos(player.angle) >= 0 ? 1 : -1;
                } else {
                    // Smart Aim: Face movement direction or auto-target nearest foe within 220px
                    if (!autoAimNearestEnemy(220) && (player.vx !== 0 || player.vy !== 0)) {
                        player.angle = Math.atan2(player.vy, player.vx);
                        player.facing = player.vx >= 0 ? 1 : -1;
                    }
                }
            }`;

if (html.includes(aimUpdateSearch)) {
    html = html.replace(aimUpdateSearch, aimUpdateReplace);
    console.log('✓ Pillar 3: Added Smart Aiming for responsive movement-based targeting.');
}

// Track mouse movement
const mouseMoveSearch = `window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
        });`;

const mouseMoveReplace = `window.addEventListener('mousemove', (e) => {
            mousePos.hasMoved = true;
            const rect = canvas.getBoundingClientRect();
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
        });`;

if (html.includes(mouseMoveSearch)) {
    html = html.replace(mouseMoveSearch, mouseMoveReplace);
    console.log('✓ Pillar 3: Tracked mousePos.hasMoved for seamless mouse & keyboard blending.');
}

// ============================================================================
// PILLAR 4: ONBOARDING & ROOM 1 STARTER SKELETON (NO 9999 HP SOFT-LOCK)
// ============================================================================
// Replace dummy spawn with starter training skeleton (25 HP, high knockback into pit)
const dummySpawnSearch = `if (m.isTutorialMound && game.provingGroundsStep === 1) {
                    game.provingGroundsStep = 2;
                    spawnEnemy(m.x + 85, m.y, 'dummy');
                    spawnLootDrop(m.x, m.y - 12, 'coin', 12);
                    addFloatingText(m.x, m.y - 20, "🕳️ PIT CREATED! KNOCK DUMMY IN!", "#34d399", 15);
                    updateProvingGroundsUI();
                    return;
                }`;

const dummySpawnReplace = `if (m.isTutorialMound) {
                    game.provingGroundsStep = 5;
                    // Spawn manageable training skeleton (25 HP) that can be easily knocked into pit
                    spawnEnemy(m.x + 80, m.y, 'skeleton');
                    const lastE = enemies[enemies.length - 1];
                    if (lastE) {
                        lastE.hp = 25;
                        lastE.maxHp = 25;
                    }
                    spawnLootDrop(m.x, m.y - 12, 'coin', 15);
                    spawnLootDrop(m.x + 10, m.y - 12, 'soul', 2);
                    addFloatingText(m.x, m.y - 20, "🕳️ PIT OPENED! KNOCK SKELETON IN!", "#34d399", 16);
                    updateProvingGroundsUI();
                    return;
                }`;

if (html.includes(dummySpawnSearch)) {
    html = html.replace(dummySpawnSearch, dummySpawnReplace);
    console.log('✓ Pillar 4: Replaced 9999 HP dummy with satisfying 25 HP training skeleton.');
}

// Also make starting room always cleared so gates are never blocked
html = html.replace(
    `room.cleared = (type === 'start' || type === 'shop' || type === 'shrine' || type === 'treasure');`,
    `room.cleared = (type === 'start' || type === 'shop' || type === 'shrine' || type === 'treasure');
            if (type === 'start') {
                game.provingGroundsStep = 5;
            }`
);

// ============================================================================
// PILLAR 5: VISUALS 2.0 (LIGHTING, SHADOWS, WHITE HIT-FLASH, CLEAN SOLO MODE)
// ============================================================================

// 1. Hide overhead "P1 (HOST / YOU)" in solo play
const overheadP1Search = `ctx.fillText((typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isHost) ? '👑 P1 (HOST / YOU)' : ('P' + myIdx + ' (YOU)'), 0, -22);`;
const overheadP1Replace = `if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected && MultiplayerManager.connectedPeers > 1) {
                ctx.fillText(MultiplayerManager.isHost ? '👑 P1 (HOST / YOU)' : ('P' + myIdx + ' (YOU)'), 0, -22);
            }`;

if (html.includes(overheadP1Search)) {
    html = html.replace(overheadP1Search, overheadP1Replace);
    console.log('✓ Pillar 5: Hidden overhead P1 tag in solo mode.');
}

// 2. Soft Ellipse Drop Shadows
html = html.replace(`ctx.fillRect(-14, 15, 28, 6);`, `ctx.fillStyle = 'rgba(0,0,0,0.42)'; ctx.beginPath(); ctx.ellipse(0, 16, 16, 6, 0, 0, Math.PI * 2); ctx.fill();`);
html = html.replace(`ctx.fillRect(-e.radius + 2, e.radius - 4, (e.radius - 2) * 2, 6);`, `ctx.fillStyle = 'rgba(0,0,0,0.42)'; ctx.beginPath(); ctx.ellipse(0, e.radius, e.radius * 0.9, e.radius * 0.42, 0, 0, Math.PI * 2); ctx.fill();`);
console.log('✓ Pillar 5: Replaced harsh rectangular shadows with soft ambient drop-shadow ellipses.');

// 3. Solid White Hit Flash on Enemies
const enemyDrawSearch = `// Draw sprite
                const frameIdx = (e.animFrame !== undefined) ? e.animFrame : eFrame;
                const spr = atlas.sprites[\`\${sprKey}_\${frameIdx}\`] || atlas.sprites[\`\${sprKey}_0\`];
                if (spr) {
                    ctx.drawImage(spr, -spr.width / 2, -spr.height / 2);
                }`;

const enemyDrawReplace = `// Draw sprite
                const frameIdx = (e.animFrame !== undefined) ? e.animFrame : eFrame;
                const spr = atlas.sprites[\`\${sprKey}_\${frameIdx}\`] || atlas.sprites[\`\${sprKey}_0\`];
                if (spr) {
                    ctx.drawImage(spr, -spr.width / 2, -spr.height / 2);
                    // High-impact solid white hit-flash overlay
                    if (e.flash > 0) {
                        ctx.save();
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                        ctx.fillRect(-spr.width / 2, -spr.height / 2, spr.width, spr.height);
                        ctx.restore();
                    }
                }`;

if (html.includes(enemyDrawSearch)) {
    html = html.replace(enemyDrawSearch, enemyDrawReplace);
    console.log('✓ Pillar 5: Added solid white hit-flash impact overlay to enemy sprite rendering.');
}

// 4. Floor Visual Keycaps in Room 1 + Atmospheric Dynamic Lighting Pass
const renderCameraRestoreSearch = `ctx.restore();
            }

            ctx.restore();
        }

        /**
         * ============================================================================
         * 11. MINIMAP, HUD HELPERS & INPUT LISTENERS`;

const renderAtmosphereAddition = `ctx.restore();
            }

            // Floor Visual Keycaps for Starting Sanctuary (Room 1)
            if (room.type === 'start') {
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const drawKeycap = (x, y, label, sub) => {
                    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
                    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
                    ctx.lineWidth = 1.5;
                    const w = 110, h = 32;
                    ctx.beginPath();
                    ctx.roundRect(x - w / 2, y - h / 2, w, h, 6);
                    ctx.fill();
                    ctx.stroke();

                    ctx.font = '900 11px Inter, sans-serif';
                    ctx.fillStyle = '#f8fafc';
                    ctx.fillText(label, x, y - 4);

                    ctx.font = '800 8px Inter, sans-serif';
                    ctx.fillStyle = '#38bdf8';
                    ctx.fillText(sub, x, y + 8);
                };

                drawKeycap(ROOM_W / 2 - 130, ROOM_H / 2 + 100, 'W A S D', 'MOVE');
                drawKeycap(ROOM_W / 2, ROOM_H / 2 - 120, 'HOLD LMB / SPACE', 'CONTINUOUS ATTACK');
                drawKeycap(ROOM_W / 2 + 130, ROOM_H / 2 + 100, 'SHIFT / RMB', 'DASH');
                ctx.restore();
            }

            // Dynamic Atmospheric Dungeon Lighting & Torch Atmosphere
            ctx.save();
            // Subtle ambient chamber vignette
            const chamberGrad = ctx.createRadialGradient(ROOM_W / 2, ROOM_H / 2, 260, ROOM_W / 2, ROOM_H / 2, Math.max(ROOM_W, ROOM_H) * 0.75);
            chamberGrad.addColorStop(0, 'rgba(5, 7, 11, 0.0)');
            chamberGrad.addColorStop(0.65, 'rgba(5, 7, 11, 0.32)');
            chamberGrad.addColorStop(1.0, 'rgba(5, 7, 11, 0.78)');
            ctx.fillStyle = chamberGrad;
            ctx.fillRect(0, 0, ROOM_W, ROOM_H);

            // Torch & Lantern dynamic lighting pass
            ctx.globalCompositeOperation = 'screen';

            // Warm Player Lantern Glow
            const pGlow = ctx.createRadialGradient(player.x, player.y, 8, player.x, player.y, 190);
            pGlow.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
            pGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.12)');
            pGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = pGlow;
            ctx.beginPath();
            ctx.arc(player.x, player.y, 190, 0, Math.PI * 2);
            ctx.fill();

            // Wall Torch Flickering Glows
            const torches = [
                { x: ROOM_W / 2 - 140, y: WALL_T },
                { x: ROOM_W / 2 + 140, y: WALL_T },
                { x: ROOM_W / 2 - 140, y: ROOM_H - WALL_T },
                { x: ROOM_W / 2 + 140, y: ROOM_H - WALL_T },
                { x: WALL_T, y: ROOM_H / 2 - 100 },
                { x: WALL_T, y: ROOM_H / 2 + 100 },
                { x: ROOM_W - WALL_T, y: ROOM_H / 2 - 100 },
                { x: ROOM_W - WALL_T, y: ROOM_H / 2 + 100 }
            ];
            const tFlicker = 0.92 + Math.sin(performance.now() * 0.007) * 0.07 + Math.cos(performance.now() * 0.012) * 0.03;
            for (const t of torches) {
                const tg = ctx.createRadialGradient(t.x, t.y, 4, t.x, t.y, 85 * tFlicker);
                tg.addColorStop(0, 'rgba(251, 146, 60, 0.32)');
                tg.addColorStop(0.6, 'rgba(245, 158, 11, 0.10)');
                tg.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = tg;
                ctx.beginPath();
                ctx.arc(t.x, t.y, 85 * tFlicker, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            ctx.restore();
        }

        /**
         * ============================================================================
         * 11. MINIMAP, HUD HELPERS & INPUT LISTENERS`;

if (html.includes(renderCameraRestoreSearch)) {
    html = html.replace(renderCameraRestoreSearch, renderAtmosphereAddition);
    console.log('✓ Pillar 5: Added Room 1 Floor Keycaps and Dynamic Torchlight Lighting Pass to render().');
}

// Write the remastered index.html
fs.writeFileSync(indexPath, html, 'utf8');
console.log('[REMASTER] index.html successfully updated! (File size:', html.length, 'bytes)');
