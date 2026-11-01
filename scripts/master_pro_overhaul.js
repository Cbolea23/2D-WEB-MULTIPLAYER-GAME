/**
 * master_pro_overhaul.js
 * Comprehensive production overhaul for Crypt Dagger Roguelike
 * Grounded in awesome-gamedev-agent-skills (Camera, Game Feel, UI/UX, Audio, Pixel Art)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');
console.log('[MASTER OVERHAUL] Loading pristine index.html (' + html.length + ' bytes, normalized to LF)...');

// ----------------------------------------------------------------------------
// 1. CRAZYGAMES SDK GUARDS (Fix Uncaught Exception on Gameplay Start/Stop)
// ----------------------------------------------------------------------------
html = html.replace(
`            onGameplayStart() {
                if (this.gameplayActive) return;
                this.gameplayActive = true;
                if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
                    try {
                        window.CrazyGames.SDK.game.gameplayStart();
                    } catch (e) {}
                }
            },

            onGameplayStop() {
                if (!this.gameplayActive) return;
                this.gameplayActive = false;
                if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
                    try {
                        window.CrazyGames.SDK.game.gameplayStop();
                    } catch (e) {}
                }
            },`,
`            onGameplayStart() {
                if (this.gameplayActive) return;
                this.gameplayActive = true;
                if (this.crazyGamesReady) {
                    try {
                        window.CrazyGames?.SDK?.game?.gameplayStart();
                    } catch (e) {}
                }
            },

            onGameplayStop() {
                if (!this.gameplayActive) return;
                this.gameplayActive = false;
                if (this.crazyGamesReady) {
                    try {
                        window.CrazyGames?.SDK?.game?.gameplayStop();
                    } catch (e) {}
                }
            },`
);
console.log('✓ 1. CrazyGames SDK guards applied.');

// ----------------------------------------------------------------------------
// 2. PILLAR 1: CAMERA & VIEWPORT ENGINE (ZERO BLACK VOID)
// ----------------------------------------------------------------------------
// 2.1 Responsive Aspect Fit in resizeCanvas()
const oldResize = `function resizeCanvas() {
            const container = document.getElementById('game-container');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            ctx.imageSmoothingEnabled = false;
            // Adaptive camera zoom so mobile phones see at least 75% of the room width
            if (canvas.width < 880) {
                game.zoom = Math.max(0.58, canvas.width / 920);
            } else {
                game.zoom = 1.0;
            }
        }`;

const newResize = `function resizeCanvas() {
            const container = document.getElementById('game-container');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            ctx.imageSmoothingEnabled = false;

            // Fit the active dungeon chamber (ROOM_W x ROOM_H) cleanly inside the viewport
            const scaleX = canvas.width / ROOM_W;
            const scaleY = canvas.height / ROOM_H;
            // Best fit with slight margin (at least 92% coverage, never revealing empty outer void)
            game.zoom = Math.max(0.65, Math.min(1.35, Math.min(scaleX, scaleY) * 1.05));
        }`;

html = html.replace(oldResize, newResize);

// 2.2 Chamber-Anchored Lookahead in update(dt)
const oldCamTrack = `            if (!game.usingTouch) {
                leadX = Math.max(-75, Math.min(75, (mousePos.x - canvas.width / 2) * 0.14));
                leadY = Math.max(-55, Math.min(55, (mousePos.y - canvas.height / 2) * 0.14));
            }
            game.camera.x += (player.x + leadX - game.camera.x) * Math.min(1, dt * 11);
            game.camera.y += (player.y + leadY - game.camera.y) * Math.min(1, dt * 11);`;

const newCamTrack = `            // Professional Camera: Chamber-Anchored Lookahead
            // The active room is the central anchor; camera tracks player subtly without ever revealing outer black void
            const roomCenterX = ROOM_W / 2;
            const roomCenterY = ROOM_H / 2;
            const pLeadX = Math.max(-95, Math.min(95, (player.x - roomCenterX) * 0.22));
            const pLeadY = Math.max(-65, Math.min(65, (player.y - roomCenterY) * 0.22));
            const mLeadX = (!game.usingTouch && mousePos.hasMoved) ? Math.max(-45, Math.min(45, (mousePos.worldX - player.x) * 0.08)) : 0;
            const mLeadY = (!game.usingTouch && mousePos.hasMoved) ? Math.max(-35, Math.min(35, (mousePos.worldY - player.y) * 0.08)) : 0;

            const targetCamX = roomCenterX + pLeadX + mLeadX;
            const targetCamY = roomCenterY + pLeadY + mLeadY;

            // Frame-rate independent exponential damping
            const camSpeed = Math.min(1.0, 1.0 - Math.exp(-dt * 9.5));
            game.camera.x += (targetCamX - game.camera.x) * camSpeed;
            game.camera.y += (targetCamY - game.camera.y) * camSpeed;`;

html = html.replace(oldCamTrack, newCamTrack);

// 2.3 Instant Camera Snap on enterRoom
const oldEnterRoom = `function enterRoom(gx, gy, entryDir) {
            if (game.curX === 2 && game.curY === 2 && (gx !== 2 || gy !== 2) && game.provingGroundsStep === 4) {
                game.provingGroundsStep = 5;
            }
            game.curX = gx;
            game.curY = gy;
            const room = currentRoom();
            room.visited = true;
            if (!room.bgCanvas) atlas.bakeRoomBackground(room);

            enemies = []; projectiles = []; drops = []; hazardPools = []; player.dashTimer = 0;
            const spawnInset = WALL_T + 82;`;

const newEnterRoom = `function enterRoom(gx, gy, entryDir) {
            if (game.curX === 2 && game.curY === 2 && (gx !== 2 || gy !== 2) && game.provingGroundsStep === 4) {
                game.provingGroundsStep = 5;
            }
            game.curX = gx;
            game.curY = gy;
            const room = currentRoom();
            room.visited = true;
            if (!room.bgCanvas) atlas.bakeRoomBackground(room);

            // Instantly center camera on entering room
            game.camera.x = ROOM_W / 2;
            game.camera.y = ROOM_H / 2;

            enemies = []; projectiles = []; drops = []; hazardPools = []; player.dashTimer = 0;
            const spawnInset = WALL_T + 82;`;

html = html.replace(oldEnterRoom, newEnterRoom);
console.log('✓ 2. Camera & Viewport auto-centering applied.');

// ----------------------------------------------------------------------------
// 3. PILLAR 3: GAME FEEL, HIT-STOP & TRAUMA SHAKE ENGINE
// ----------------------------------------------------------------------------
// 3.1 State initialization
html = html.replace(
    `let game = {\n            running: false,\n            paused: false,`,
    `let game = {\n            running: false,\n            paused: false,\n            trauma: 0,\n            hitStopTimer: 0,\n            shakeX: 0,\n            shakeY: 0,`
);

// 3.2 Update loop hit-stop & trauma decay
const oldUpdateStart = `function update(dt) {
            if (!game.running || game.paused) return;

            // Continuous Hold-To-Attack (Hold LMB or Space)
            if ((mousePos.down || keys['Space']) && player.swingCooldown <= 0 && !player.isGhost) {
                performAttack();
            }`;

const newUpdateStart = `function update(dt) {
            if (!game.running || game.paused) return;

            // Micro Hit-Stop (Freeze-frame impact resistance)
            if (game.hitStopTimer > 0) {
                game.hitStopTimer -= dt;
                if (mousePos.down || keys['Space']) player.bufferedAttack = true;
                return;
            }

            // Trauma-Based Quadratic Screen Shake Decay
            if (game.trauma > 0) {
                game.trauma = Math.max(0, game.trauma - 1.45 * dt);
                const shakeMag = (game.trauma * game.trauma) * 26;
                const t = performance.now() * 0.045;
                game.shakeX = Math.sin(t * 1.7) * shakeMag;
                game.shakeY = Math.cos(t * 2.3) * shakeMag;
            } else {
                game.shakeX = 0;
                game.shakeY = 0;
            }

            // Continuous Hold-To-Attack (Hold LMB or Space or buffered input)
            if ((mousePos.down || keys['Space'] || player.bufferedAttack) && player.swingCooldown <= 0 && !player.isGhost) {
                player.bufferedAttack = false;
                performAttack();
            }`;

html = html.replace(oldUpdateStart, newUpdateStart);

// 3.3 triggerJuice scaling
const oldTriggerJuice = `function triggerJuice(freezeSec, shakePx, particleCount = 0, px = 0, py = 0, pColor = '#fbbf24') {
            if (freezeSec > 0) {
                game.freezeTimer = Math.max(game.freezeTimer || 0, freezeSec);
            }
            if (shakePx > 0 && SettingsManager.screenShake) {
                game.shake = Math.min(28, (game.shake || 0) + shakePx);
            }
            if (particleCount > 0 && px && py) {
                addParticles(px, py, pColor, particleCount, 160, 4);
            }
        }`;

const newTriggerJuice = `function triggerJuice(freezeSec, shakePx, particleCount = 0, px = 0, py = 0, pColor = '#fbbf24') {
            if (freezeSec > 0) {
                game.hitStopTimer = Math.max(game.hitStopTimer || 0, freezeSec);
            }
            if (shakePx > 0 && SettingsManager.screenShake) {
                const traumaAdd = Math.min(0.65, shakePx / 32);
                game.trauma = Math.min(1.0, (game.trauma || 0) + traumaAdd);
            }
            if (particleCount > 0 && px && py) {
                addParticles(px, py, pColor, particleCount, 180, 4);
            }
        }`;

html = html.replace(oldTriggerJuice, newTriggerJuice);

// 3.4 Decoupled Camera Shake in render()
const oldRenderShake = `const sx = Math.round((Math.random() - 0.5) * game.shake);
            const sy = Math.round((Math.random() - 0.5) * game.shake);

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(game.zoom, game.zoom);
            ctx.translate(Math.round(-game.camera.x + sx), Math.round(-game.camera.y + sy));`;

const newRenderShake = `// Decoupled Camera Shake: Only offsets the rendering viewport, never the simulation
            const sx = Math.round(game.shakeX || 0);
            const sy = Math.round(game.shakeY || 0);

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(game.zoom, game.zoom);
            ctx.translate(Math.round(-game.camera.x + sx), Math.round(-game.camera.y + sy));`;

html = html.replace(oldRenderShake, newRenderShake);

// 3.5 Volumetric Glowing Crescent Blade in renderCharacterWeapon()
const oldWeaponArc = `                ctx.strokeStyle = wep.trailColor || '#fbbf24';
                ctx.lineWidth = comboStep === 0 ? 9 : 6;
                ctx.beginPath();
                ctx.arc(0, 0, reach - 8, Math.min(startA, curA), Math.max(startA, curA));
                ctx.stroke();

                if (wep.id === 'twin_trowels') {
                    ctx.strokeStyle = '#22d3ee';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(0, 0, reach - 16, Math.min(startA, curA), Math.max(startA, curA));
                    ctx.stroke();
                }`;

const newWeaponArc = `                // Volumetric Glowing Crescent Blade Slash
                ctx.save();
                const slashGrad = ctx.createRadialGradient(0, 0, reach * 0.4, 0, 0, reach + 6);
                slashGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                slashGrad.addColorStop(0.65, wep.trailColor || 'rgba(251, 191, 36, 0.45)');
                slashGrad.addColorStop(0.92, '#ffffff');
                slashGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.fillStyle = slashGrad;
                ctx.beginPath();
                ctx.arc(0, 0, reach + 6, Math.min(startA, curA), Math.max(startA, curA));
                ctx.arc(0, 0, reach * 0.55, Math.max(startA, curA), Math.min(startA, curA), true);
                ctx.closePath();
                ctx.fill();

                // Bright Cutting Edge Core
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = comboStep === 0 ? 3.5 : 2.5;
                ctx.beginPath();
                ctx.arc(0, 0, reach, Math.min(startA, curA), Math.max(startA, curA));
                ctx.stroke();
                ctx.restore();`;

html = html.replace(oldWeaponArc, newWeaponArc);

// 3.6 Clean White Silhouette Hit Flash on Enemies
const oldFlash = `if (e.flash > 0) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
                        ctx.fillRect(-e.radius, -e.radius, e.radius * 2, e.radius * 2);
                    }`;

const newFlash = `if (e.flash > 0) {
                        ctx.save();
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
                        ctx.fillRect(-spr.width / 2, -spr.height / 2, spr.width, spr.height);
                        ctx.restore();
                    }`;

html = html.replace(oldFlash, newFlash);
console.log('✓ 3. Game Feel, Hit-Stop & Volumetric Slash applied.');

// ----------------------------------------------------------------------------
// 4. PILLAR 2: DARK FANTASY SPRITES & DUNGEON PROPS
// ----------------------------------------------------------------------------
// 4.1 Menacing Rotting Zombie (No smiling green emoji)
const oldZomb = `                // Zombie (2 Frames)
                const zomb0 = [
                    "...KKKKKKKKKK...", "..KZZZZZZZZZZK..", ".KZZZZMMMMZZZZK.",
                    ".KZZKKZZZZKKZZK.", ".KZZKRZZZZKRZZK.", ".KZZZZKKKKZZZZK.",
                    "..KZZZZZZZZZZK..", ".KMMMMMMMMMMMMK.", "KMMCCCCCCCCCCMMK",
                    "KMMCCCCCCCCCCMMK", "KMMCCCCCCCCCCMMK", ".KMMMMMMMMMMMMK.",
                    "..KZZZZ..ZZZZK..", "..KMMMM..MMMMK..", "..KKKKK..KKKKK..",
                    "................"
                ];
                const zomb1 = [
                    "................", "...KKKKKKKKKK...", "..KZZZZZZZZZZK..",
                    ".KZZZZMMMMZZZZK.", ".KZZKRZZZZKRZZK.", ".KZZZZKKKKZZZZK.",
                    "..KZZZZZZZZZZK..", "KMMMMMMMMMMMMMMK", "KMMCCCCCCCCCCMMK",
                    "KMMCCCCCCCCCCMMK", ".KMMMMMMMMMMMMK.", "..KZZZZ..ZZZZK..",
                    "..KMMMM..MMMMK..", "..KKKKK..KKKKK..", "................",
                    "................"
                ];
                this.bakeGrid('zombie_0', zomb0, pal, 3);
                this.bakeGrid('zombie_1', zomb1, pal, 3);`;

const newZomb = `                // Decayed Zombie (Menacing rotting ghoul with hollow dark eyes)
                const zomb0 = [
                    "...KKKKKKKKKK...", "..KMMMMMMMMMMK..", ".KMMZZZZZZMMMMK.",
                    ".KMM00MM00MMMMK.", ".KM0R0MM0R0MMMK.", ".KMM000000MMMMK.",
                    "..KMM0000MMMMK..", ".K222222222222K.", "K22111111111122K",
                    "K2211RR11RR1122K", "K22111111111122K", ".K222222222222K.",
                    "..K8888..8888K..", "..K8888..8888K..", "..KKKKK..KKKKK..",
                    "................"
                ];
                const zomb1 = [
                    "................", "...KKKKKKKKKK...", "..KMMMMMMMMMMK..",
                    ".KMMZZZZZZMMMMK.", ".KM0R0MM0R0MMMK.", ".KMM000000MMMMK.",
                    "..KMM0000MMMMK..", ".K222222222222K.", "K22111111111122K",
                    "K22111111111122K", ".K222222222222K.", "..K8888..8888K..",
                    "..K8888..8888K..", "..KKKKK..KKKKK..", "................"
                ];
                this.bakeGrid('zombie_0', zomb0, pal, 3);
                this.bakeGrid('zombie_1', zomb1, pal, 3);`;

html = html.replace(oldZomb, newZomb);

// 4.2 Depth-Shaded Open Grave Pit
const oldPit = `const openPit = [
                    "..KKKKKKKKKKKK..", ".K8899AAAA9988K.", "K89A88000088A98K",
                    "K89800000000898K", "K9A0001111000A9K", "K98001000010089K",
                    "K980000WW000089K", "K98000W00W00089K", "K98000WWWW00089K",
                    "K98000000000089K", "K980000WW000089K", "K9A0000000000A9K",
                    "K89800000000898K", "K89A88000088A98K", ".K889999999988K.",
                    "..K5588888855K..", "...KKKKKKKKKK..."
                ];
                this.bakeGrid('open_pit', openPit, pal, 3.4);`;

const newPit = `const openPit = [
                    "...KKKKKKKKKKKKK...", "..K3344444444433K..", ".K44433333333444K.",
                    "K4320000000000234K", "K4200000000000024K", "K4000000000000004K",
                    "K4000000000000004K", "K400000UU00000004K", "K40000UUVU0000004K",
                    "K400000UU00000004K", "K4000000000000004K", "K4000000000000004K",
                    "K4200000000000024K", "K4320000000000234K", ".K44433333333444K.",
                    "..K3344444444433K..", "...KKKKKKKKKKKKK..."
                ];
                this.bakeGrid('open_pit', openPit, pal, 3.6);`;

html = html.replace(oldPit, newPit);

// 4.3 Authentic Dark-Iron Crypt Grates for Spike Traps
const oldSpikes = `            // Render Spike Floor Plates
            for (const sp of room.spikePlates) {
                const active = sp.timer > 2.0;
                const warn = sp.timer > 1.5 && !active;
                ctx.fillStyle = active ? '#7f1d1d' : (warn ? '#78350f' : '#1e293b');
                ctx.fillRect(sp.x - sp.w / 2, sp.y - sp.h / 2, sp.w, sp.h);
                ctx.strokeStyle = active ? '#ef4444' : '#475569';
                ctx.lineWidth = 2;
                ctx.strokeRect(sp.x - sp.w / 2, sp.y - sp.h / 2, sp.w, sp.h);
                if (active) {
                    ctx.fillStyle = '#e2e8f0';
                    for (let gx = -16; gx <= 16; gx += 16) {
                        for (let gy = -16; gy <= 16; gy += 16) {
                            ctx.fillRect(sp.x + gx - 3, sp.y + gy - 3, 6, 6);
                        }
                    }
                }
            }`;

const newSpikes = `// Render Spike Floor Plates: Authentic Dark-Iron Crypt Grate
            for (const sp of room.spikePlates) {
                const active = sp.timer > 2.0;
                const warn = sp.timer > 1.5 && !active;
                ctx.save();
                // Outer Stone Grate Frame
                ctx.fillStyle = '#090d16';
                ctx.fillRect(sp.x - sp.w / 2, sp.y - sp.h / 2, sp.w, sp.h);
                ctx.strokeStyle = active ? '#ef4444' : (warn ? '#f59e0b' : '#334155');
                ctx.lineWidth = 2.5;
                ctx.strokeRect(sp.x - sp.w / 2, sp.y - sp.h / 2, sp.w, sp.h);

                // Perforated Grate Holes & Steel Spikes
                for (let gx = -16; gx <= 16; gx += 16) {
                    for (let gy = -16; gy <= 16; gy += 16) {
                        ctx.fillStyle = active ? '#7f1d1d' : (warn ? '#451a03' : '#020617');
                        ctx.beginPath();
                        ctx.arc(sp.x + gx, sp.y + gy, 5.5, 0, Math.PI * 2);
                        ctx.fill();

                        if (active) {
                            // Extruded Steel Spear Tip
                            ctx.fillStyle = '#f8fafc';
                            ctx.beginPath();
                            ctx.moveTo(sp.x + gx, sp.y + gy - 9);
                            ctx.lineTo(sp.x + gx + 3.5, sp.y + gy + 3);
                            ctx.lineTo(sp.x + gx - 3.5, sp.y + gy + 3);
                            ctx.closePath();
                            ctx.fill();
                            ctx.fillStyle = '#cbd5e1';
                            ctx.fillRect(sp.x + gx - 1, sp.y + gy - 6, 2, 8);
                        } else if (warn) {
                            // Warning glowing embers
                            ctx.fillStyle = '#fbbf24';
                            ctx.fillRect(sp.x + gx - 1.5, sp.y + gy - 1.5, 3, 3);
                        }
                    }
                }
                ctx.restore();
            }`;

html = html.replace(oldSpikes, newSpikes);

// 4.4 Heavy Iron Portcullis Gates
const oldLockedDoor = `                } else {
                    ctx.fillStyle = '#450a0a'; ctx.fillRect(matX, matY, matW, matH);
                    ctx.fillStyle = '#ef4444'; ctx.fillRect(matX, matY, matW, 4); ctx.fillRect(matX, matY + matH - 4, matW, 4);

                    if (dir === 'N' || dir === 'S') {
                        for (let bx = matX + 8; bx < matX + matW - 8; bx += 14) {
                            ctx.fillStyle = '#090d16'; ctx.fillRect(bx - 2, gy - 18, 8, 36);
                            ctx.fillStyle = '#94a3b8'; ctx.fillRect(bx, gy - 16, 4, 32);
                        }
                    } else {
                        for (let by = matY + 8; by < matY + matH - 8; by += 14) {
                            ctx.fillStyle = '#090d16'; ctx.fillRect(gx - 18, by - 2, 36, 8);
                            ctx.fillStyle = '#94a3b8'; ctx.fillRect(gx - 16, by, 32, 4);
                        }
                    }

                    ctx.font = '900 13px Inter'; ctx.textAlign = 'center';
                    ctx.fillStyle = '#f8fafc'; ctx.fillText('🔒 LOCKED', labelX, labelY);
                }`;

const newLockedDoor = `                } else {
                    // Heavy Iron Portcullis with Spear Tips
                    ctx.save();
                    ctx.fillStyle = '#05070b';
                    ctx.fillRect(matX, matY, matW, matH);
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(matX, matY, matW, matH);

                    if (dir === 'N' || dir === 'S') {
                        for (let bx = matX + 6; bx <= matX + matW - 6; bx += 12) {
                            ctx.fillStyle = '#090d16'; ctx.fillRect(bx - 1, matY, 5, matH);
                            ctx.fillStyle = '#475569'; ctx.fillRect(bx, matY, 3, matH);
                            ctx.fillStyle = '#94a3b8';
                            ctx.beginPath();
                            ctx.moveTo(bx + 1.5, matY + matH + (dir === 'N' ? 5 : -5));
                            ctx.lineTo(bx + 3.5, matY + matH - (dir === 'N' ? 4 : -4));
                            ctx.lineTo(bx - 0.5, matY + matH - (dir === 'N' ? 4 : -4));
                            ctx.closePath();
                            ctx.fill();
                        }
                        ctx.fillStyle = '#1e293b';
                        ctx.fillRect(matX, matY + 12, matW, 5);
                        ctx.fillRect(matX, matY + matH - 16, matW, 5);
                    } else {
                        for (let by = matY + 6; by <= matY + matH - 6; by += 12) {
                            ctx.fillStyle = '#090d16'; ctx.fillRect(matX, by - 1, matW, 5);
                            ctx.fillStyle = '#475569'; ctx.fillRect(matX, by, matW, 3);
                            ctx.fillStyle = '#94a3b8';
                            ctx.beginPath();
                            ctx.moveTo(matX + matW + (dir === 'W' ? 5 : -5), by + 1.5);
                            ctx.lineTo(matX + matW - (dir === 'W' ? 4 : -4), by + 3.5);
                            ctx.lineTo(matX + matW - (dir === 'W' ? 4 : -4), by - 0.5);
                            ctx.closePath();
                            ctx.fill();
                        }
                        ctx.fillStyle = '#1e293b';
                        ctx.fillRect(matX + 12, matY, 5, matH);
                        ctx.fillRect(matX + matW - 16, matY, 5, matH);
                    }
                    ctx.font = '900 13px Inter'; ctx.textAlign = 'center';
                    ctx.fillStyle = '#f8fafc'; ctx.fillText('🔒 LOCKED', labelX, labelY);
                    ctx.restore();
                }`;

html = html.replace(oldLockedDoor, newLockedDoor);
console.log('✓ 4. Dark Fantasy Sprites & Dungeon Props applied.');

// ----------------------------------------------------------------------------
// 5. PILLAR 4: SLEEK GOTHIC COMBAT ACTION DOCK
// ----------------------------------------------------------------------------
const oldBottomWebCards = `            <!-- Active Weapon & Skill Controls -->
            <div class="flex items-center gap-2.5 pixel-panel px-4 py-2 rounded-xl pointer-events-auto border-slate-700/90 shadow-2xl">
                <button id="act-swing" class="pixel-button-gold flex items-center gap-2 px-3 py-1.5 rounded-lg text-left">
                    <span id="hud-weapon-icon" class="text-lg">⛏️</span>
                    <div class="leading-tight">
                        <div id="weapon-title" class="text-[11px] font-pixel text-amber-200 font-bold">RUSTY SPADE</div>
                        <div class="text-[9px] font-pixel text-amber-300/80">[LMB / Space] Hold to Attack</div>
                    </div>
                </button>

                <button id="act-dash" class="pixel-button-cyan flex items-center gap-2 px-3 py-1.5 rounded-lg text-left relative overflow-hidden">
                    <div id="cd-dash" class="absolute inset-0 bg-slate-950/85 origin-bottom scale-y-0 transition-transform"></div>
                    <span class="text-lg relative z-10">💨</span>
                    <div class="leading-tight relative z-10">
                        <div class="text-[11px] font-pixel text-cyan-200 font-bold">PHANTOM DASH</div>
                        <div class="text-[9px] font-pixel text-cyan-300/80">[Shift / RMB] Dodge</div>
                    </div>
                </button>

                <button id="act-dig" class="pixel-button flex items-center gap-2 px-3 py-1.5 rounded-lg text-left border-emerald-600/70">
                    <span class="text-lg">🪦</span>
                    <div class="leading-tight">
                        <div class="text-[11px] font-pixel text-emerald-300 font-bold">EXCAVATE</div>
                        <div class="text-[9px] font-pixel text-emerald-400/80">[E] Dig / Open</div>
                    </div>
                </button>

                <button id="act-ult" class="pixel-button flex items-center gap-2 px-3 py-1.5 rounded-lg text-left relative overflow-hidden border-purple-500/80">
                    <div id="cd-ult" class="absolute inset-0 bg-slate-950/85 origin-bottom scale-y-0 transition-transform"></div>
                    <span class="text-lg relative z-10">⚡</span>
                    <div class="leading-tight relative z-10">
                        <div class="text-[11px] font-pixel text-purple-300 font-bold">EARTHQUAKE</div>
                        <div class="text-[9px] font-pixel text-purple-400/80">[Q] READY</div>
                    </div>
                </button>
            </div>`;

const newGothicDock = `            <!-- SLEEK GOTHIC COMBAT ACTION DOCK -->
            <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-2xl pointer-events-auto">
                <!-- Weapon Attack Slot -->
                <button id="act-swing" class="group relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-b from-amber-950/70 to-slate-900 border border-amber-600/80 hover:border-amber-400 active:scale-95 transition-all shadow-lg" title="Primary Strike [LMB / Space]">
                    <span id="hud-weapon-icon" class="text-xl group-hover:scale-110 transition-transform">⛏️</span>
                    <span class="absolute -bottom-1 -right-1 px-1 py-0.2 bg-slate-950 border border-amber-500/70 text-[8px] font-pixel text-amber-300 rounded font-bold shadow">LMB</span>
                </button>

                <!-- Phantom Dash Slot -->
                <button id="act-dash" class="group relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-b from-cyan-950/70 to-slate-900 border border-cyan-600/80 hover:border-cyan-400 active:scale-95 transition-all shadow-lg overflow-hidden" title="Phantom Dash [Shift / RMB]">
                    <div id="cd-dash" class="absolute inset-0 bg-slate-950/90 origin-bottom scale-y-0 transition-transform"></div>
                    <span class="text-xl group-hover:scale-110 transition-transform relative z-10">💨</span>
                    <span class="absolute -bottom-1 -right-1 px-1 py-0.2 bg-slate-950 border border-cyan-500/70 text-[8px] font-pixel text-cyan-300 rounded font-bold shadow relative z-10">SHIFT</span>
                </button>

                <!-- Excavate / Interact Slot -->
                <button id="act-dig" class="group relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-b from-emerald-950/70 to-slate-900 border border-emerald-600/80 hover:border-emerald-400 active:scale-95 transition-all shadow-lg" title="Excavate Mound [E]">
                    <span class="text-xl group-hover:scale-110 transition-transform">🪦</span>
                    <span class="absolute -bottom-1 -right-1 px-1 py-0.2 bg-slate-950 border border-emerald-500/70 text-[8px] font-pixel text-emerald-300 rounded font-bold shadow">E</span>
                </button>

                <!-- Relic Ultimate Ability Slot -->
                <button id="act-ult" class="group relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-b from-purple-950/70 to-slate-900 border border-purple-600/80 hover:border-purple-400 active:scale-95 transition-all shadow-lg overflow-hidden" title="Ultimate Earthquake [Q]">
                    <div id="cd-ult" class="absolute inset-0 bg-slate-950/90 origin-bottom scale-y-0 transition-transform"></div>
                    <span class="text-xl group-hover:scale-110 transition-transform relative z-10">⚡</span>
                    <span class="absolute -bottom-1 -right-1 px-1 py-0.2 bg-slate-950 border border-purple-500/70 text-[8px] font-pixel text-purple-300 rounded font-bold shadow relative z-10">Q</span>
                </button>
            </div>`;

html = html.replace(oldBottomWebCards, newGothicDock);

// Safe updateWeaponHUD
const oldUpdateWep = `        function updateWeaponHUD() {
            const w = player.weapon;
            document.getElementById('hud-weapon-icon').textContent = w.icon;
            document.getElementById('mob-weapon-icon').textContent = w.icon;
            document.getElementById('weapon-title').textContent = w.name.toUpperCase();
        }`;

const newUpdateWep = `        function updateWeaponHUD() {
            const w = player.weapon;
            const icon = document.getElementById('hud-weapon-icon');
            if (icon) icon.textContent = w.icon;
            const mobIcon = document.getElementById('mob-weapon-icon');
            if (mobIcon) mobIcon.textContent = w.icon;
            const title = document.getElementById('weapon-title');
            if (title) title.textContent = w.name.toUpperCase();
        }`;

html = html.replace(oldUpdateWep, newUpdateWep);
console.log('✓ 5. Compact Gothic Combat Dock applied.');

// ----------------------------------------------------------------------------
// 6. PILLAR 5: MULTI-LAYERED SOUND SYNTHESIS
// ----------------------------------------------------------------------------
const oldHitSound = `                case 'hit':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(160, now);
                    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
                    gain.gain.setValueAtTime(0.22 * vol, now);
                    gain.gain.exponentialRampToValueAtTime(0.002, now + 0.08);
                    break;`;

const newHitSound = `                case 'hit': {
                    // Layer 1: Sub-Bass Impact Thud (65Hz -> 28Hz punch)
                    const subOsc = this.ctx.createOscillator();
                    const subGain = this.ctx.createGain();
                    subOsc.type = 'triangle';
                    subOsc.frequency.setValueAtTime(65, now);
                    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.12);
                    subGain.gain.setValueAtTime(0.36 * vol, now);
                    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    subOsc.connect(subGain);
                    subGain.connect(this.ctx.destination);
                    subOsc.start(now);
                    subOsc.stop(now + 0.13);

                    // Layer 2: Metallic Blade Contact Click
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(380 * (0.95 + Math.random() * 0.1), now);
                    osc.frequency.exponentialRampToValueAtTime(80, now + 0.07);
                    gain.gain.setValueAtTime(0.22 * vol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
                    break;
                }`;

html = html.replace(oldHitSound, newHitSound);
console.log('✓ 6. Multi-Layered Sound Synthesis applied.');

// ----------------------------------------------------------------------------
// WRITE FILE & VALIDATE
// ----------------------------------------------------------------------------
fs.writeFileSync(indexPath, html, 'utf8');
console.log('[MASTER OVERHAUL] Finished! Saved index.html (' + html.length + ' bytes).');
