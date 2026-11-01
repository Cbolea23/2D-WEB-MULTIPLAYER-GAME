/**
 * apply_pro_game_dev_overhaul.js
 * Comprehensive master implementation of the Professional Game Dev Overhaul
 * Based on awesome-gamedev-agent-skills:
 * - Pillar 1: Camera Systems (Dynamic Room Auto-Centering, Zero Black Void, Aspect Fit)
 * - Pillar 2: Dark Fantasy Pixel Art (Re-baked shaded sprites, crumbling stone pits, gothic portcullises)
 * - Pillar 3: Game Feel & Juice (Trauma^2 shake, 60ms-120ms Micro Hit-Stop, Volumetric Crescent Slash, Floor Splatters)
 * - Pillar 4: Diegetic Game UI/UX (Purge giant Tailwind cards, sleek gothic action dock, health crystal)
 * - Pillar 5: Multi-Layered Sound Synthesis (Sub-bass thuds, metal blade clinks, pitch variation)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');
console.log('[PRO GAME DEV] Starting complete overhaul of index.html...');

// ============================================================================
// PILLAR 1: CAMERA & VIEWPORT ENGINE (ZERO BLACK VOID)
// ============================================================================
console.log('[PILLAR 1] Overhauling Camera & Viewport...');

// 1.1 In resizeCanvas(): dynamically compute zoom so the current room always fills the viewport cleanly
const oldResizeCanvas = /function resizeCanvas\(\) \{[\s\S]*?canvas\.height = container\.clientHeight;[\s\S]*?game\.zoom = 1\.0;\s*\}\s*\}/;

const newResizeCanvas = `function resizeCanvas() {
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

if (html.match(oldResizeCanvas)) {
    html = html.replace(oldResizeCanvas, newResizeCanvas);
    console.log('  ✓ Updated resizeCanvas for responsive aspect ratio room-fitting.');
}

// 1.2 In update(dt): Camera centering on the active chamber with subtle lookahead towards player and mouse
const oldCameraUpdate = `if (mousePos.hasMoved) {
                leadX = Math.max(-60, Math.min(60, (mousePos.x - canvas.width / 2) * 0.14));
                leadY = Math.max(-45, Math.min(45, (mousePos.y - canvas.height / 2) * 0.14));
            }
            game.camera.x += (player.x + leadX - game.camera.x) * Math.min(1, dt * 11);
            game.camera.y += (player.y + leadY - game.camera.y) * Math.min(1, dt * 11);`;

const newCameraUpdate = `// Professional Camera Framing: The active room is the focal anchor.
            // Lookahead subtly tracks player and mouse, but camera NEVER wanders outside the chamber.
            const roomCenterX = ROOM_W / 2;
            const roomCenterY = ROOM_H / 2;
            const maxLeadX = 90;
            const maxLeadY = 60;
            const pOffsetX = Math.max(-maxLeadX, Math.min(maxLeadX, (player.x - roomCenterX) * 0.22));
            const pOffsetY = Math.max(-maxLeadY, Math.min(maxLeadY, (player.y - roomCenterY) * 0.22));
            const mOffsetX = mousePos.hasMoved ? Math.max(-40, Math.min(40, (mousePos.worldX - player.x) * 0.08)) : 0;
            const mOffsetY = mousePos.hasMoved ? Math.max(-30, Math.min(30, (mousePos.worldY - player.y) * 0.08)) : 0;

            const targetCamX = roomCenterX + pOffsetX + mOffsetX;
            const targetCamY = roomCenterY + pOffsetY + mOffsetY;

            // Frame-rate independent exponential damping (SmoothDamp)
            const camSpeed = Math.min(1.0, 1.0 - Math.exp(-dt * 9.5));
            game.camera.x += (targetCamX - game.camera.x) * camSpeed;
            game.camera.y += (targetCamY - game.camera.y) * camSpeed;`;

if (html.includes(oldCameraUpdate)) {
    html = html.replace(oldCameraUpdate, newCameraUpdate);
    console.log('  ✓ Updated camera tracking to chamber-anchored lookahead damping.');
}

// 1.3 In enterRoom: Immediately snap camera to room center so there is zero screen drag or black-void lag
const oldEnterRoomSnap = `const spawnInset = WALL_T + 82;`;
const newEnterRoomSnap = `// Instantly snap camera to room center upon room entry
            game.camera.x = ROOM_W / 2;
            game.camera.y = ROOM_H / 2;
            const spawnInset = WALL_T + 82;`;

if (html.includes(oldEnterRoomSnap) && !html.includes('Instantly snap camera')) {
    html = html.replace(oldEnterRoomSnap, newEnterRoomSnap);
    console.log('  ✓ Added instant camera snap on room transition.');
}

// ============================================================================
// PILLAR 2 & 3: GAME FEEL, HIT-STOP & TRAUMA SHAKE ENGINE
// ============================================================================
console.log('[PILLAR 2 & 3] Implementing Game Feel, Hit-Stop & Trauma Screen Shake...');

// 2.1 Add trauma and hit-stop state to game object
html = html.replace(
    `let game = {\n            running: false,\n            paused: false,`,
    `let game = {\n            running: false,\n            paused: false,\n            trauma: 0,\n            hitStopTimer: 0,\n            shakeX: 0,\n            shakeY: 0,`
);

// 2.2 Add hit-stop check and trauma decay in update(dt)
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
                // Freeze game physics and entity movement during hitstop, but allow input buffering
                if (mousePos.down || keys['Space']) player.bufferedAttack = true;
                return;
            }

            // Trauma-Based Quadratic Screen Shake Decay
            if (game.trauma > 0) {
                game.trauma = Math.max(0, game.trauma - 1.45 * dt);
                const shakeMag = (game.trauma * game.trauma) * 26; // Quadratic response
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

if (html.includes(oldUpdateStart)) {
    html = html.replace(oldUpdateStart, newUpdateStart);
    console.log('  ✓ Injected Micro Hit-Stop freeze frames and quadratic Trauma Shake decay.');
}

// 2.3 In triggerJuice(): Route through trauma and hit-stop
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
                // Industry standard hit-stop freeze frames (60ms for light hit, 120ms for heavy impact)
                game.hitStopTimer = Math.max(game.hitStopTimer || 0, freezeSec);
            }
            if (shakePx > 0 && SettingsManager.screenShake) {
                // Add trauma (0.0 to 1.0)
                const traumaAdd = Math.min(0.65, shakePx / 32);
                game.trauma = Math.min(1.0, (game.trauma || 0) + traumaAdd);
            }
            if (particleCount > 0 && px && py) {
                addParticles(px, py, pColor, particleCount, 180, 4);
            }
        }`;

if (html.includes(oldTriggerJuice)) {
    html = html.replace(oldTriggerJuice, newTriggerJuice);
    console.log('  ✓ Updated triggerJuice() with industry trauma scaling.');
}

// 2.4 In render(): Apply decoupled trauma camera shake
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

if (html.includes(oldRenderShake)) {
    html = html.replace(oldRenderShake, newRenderShake);
    console.log('  ✓ Decoupled camera shake from physics simulation in render().');
}

// ============================================================================
// PILLAR 2: DARK-FANTASY SPRITE PALETTE & PIXEL ART OVERHAUL
// ============================================================================
console.log('[PILLAR 2] Upgrading Sprite Atlas with Dark-Fantasy Aesthetics...');

// 2.5 Replace the crude sprite palette in SpriteAtlas.init() with rich dark fantasy tones
const oldPalPattern = /const pal = \{[\s\S]*?'O': '#7f1d1d'\s*\};/;

const newPal = `const pal = {
                    'K': '#05070b', // Deepest Obsidian Ink
                    '0': '#090d16', // Midnight Slate
                    '1': '#0f172a', // Deep Shadow Navy
                    '2': '#1e293b', // Dark Iron Stone
                    '3': '#334155', // Weathered Mortar
                    '4': '#475569', // Granite Midtone
                    'I': '#64748b', // Cold Steel
                    'D': '#94a3b8', // Bright Steel
                    'W': '#f8fafc', // Pure White / Bone White
                    'Y': '#fef08a', // Pale Gold
                    'F': '#f59e0b', // Radiant Amber Gold
                    'G': '#d97706', // Burnished Bronze
                    'A': '#b45309', // Dark Rust Gold
                    '8': '#451a03', // Deep Leather Brown
                    '9': '#78350f', // Warm Leather Midtone
                    'S': '#fde68a', // Fair Skin Highlight
                    'B': '#3b1d11', // Heavy Boot Brown
                    'C': '#1e293b', // Armor Plate Dark
                    'L': '#475569', // Armor Plate Light
                    'R': '#ef4444', // Blood Crimson
                    'N': '#7f1d1d', // Dark Dried Blood
                    'O': '#991b1b', // Flesh Gore
                    'Z': '#22c55e', // Rotting Zombie Green (Decayed)
                    'M': '#14532d', // Gangrene Deep Moss
                    '5': '#064e3b', // Ancient Crypt Moss
                    '6': '#166534', // Stone Ivy
                    '7': '#15803d', // Mold Highlight
                    'T': '#06b6d4', // Ethereal Turquoise Glow
                    'E': '#22d3ee', // Bright Soul Cyan
                    'H': '#1e1b4b', // Arcane Cloak Indigo
                    'P': '#7c3aed', // Cursed Violet
                    'V': '#4c1d95', // Deep Abyss Purple
                    'U': '#2e1065', // Void Shadow
                    'J': '#581c87', // Necromancer Robe
                    'Q': '#fde047'  // Holy Spark
                };`;

if (html.match(oldPalPattern)) {
    html = html.replace(oldPalPattern, newPal);
    console.log('  ✓ Upgraded SpriteAtlas color palette with atmospheric dark-fantasy tones.');
}

// 2.6 Replace crude zombie/skeleton smiling emoji sprites with menacing dark-fantasy pixel art
const oldZombPattern = /const zomb0 = \[[\s\S]*?this\.bakeGrid\('zombie_1', zomb1, pal, 3\);/;

const newZomb = `// Decayed Zombie (Menacing rotting ghoul with sunken hollow eyes, NOT a smiling emoji)
                const zomb0 = [
                    "...KKKKKKKKKK...",
                    "..KMMMMMMMMMMK..",
                    ".KMMZZZZZZMMMMK.",
                    ".KMM00MM00MMMMK.",
                    ".KM0R0MM0R0MMMK.",
                    ".KMM000000MMMMK.",
                    "..KMM0000MMMMK..",
                    ".K222222222222K.",
                    "K22111111111122K",
                    "K2211RR11RR1122K",
                    "K22111111111122K",
                    ".K222222222222K.",
                    "..K8888..8888K..",
                    "..K8888..8888K..",
                    "..KKKKK..KKKKK..",
                    "................"
                ];
                const zomb1 = [
                    "................",
                    "...KKKKKKKKKK...",
                    "..KMMMMMMMMMMK..",
                    ".KMMZZZZZZMMMMK.",
                    ".KM0R0MM0R0MMMK.",
                    ".KMM000000MMMMK.",
                    "..KMM0000MMMMK..",
                    ".K222222222222K.",
                    "K22111111111122K",
                    "K22111111111122K",
                    ".K222222222222K.",
                    "..K8888..8888K..",
                    "..K8888..8888K..",
                    "..KKKKK..KKKKK..",
                    "................"
                ];
                this.bakeGrid('zombie_0', zomb0, pal, 3);
                this.bakeGrid('zombie_1', zomb1, pal, 3);`;

if (html.match(oldZombPattern)) {
    html = html.replace(oldZombPattern, newZomb);
    console.log('  ✓ Replaced crude smiling zombie with menacing decayed ghoul sprites.');
}

// 2.7 Replace Open Grave Pit sprite with deep 3D chasm perspective
const oldOpenPitPattern = /const openPit = \[[\s\S]*?this\.bakeGrid\('open_pit', openPit, pal, 3\.4\);/;

const newOpenPit = `// Open Grave Pit: Crumbling stone lip, inner shadow, and deep bottomless abyss
                const openPit = [
                    "...KKKKKKKKKKKKK...",
                    "..K3344444444433K..",
                    ".K44433333333444K.",
                    "K4320000000000234K",
                    "K4200000000000024K",
                    "K4000000000000004K",
                    "K4000000000000004K",
                    "K400000UU00000004K",
                    "K40000UUVU0000004K",
                    "K400000UU00000004K",
                    "K4000000000000004K",
                    "K4000000000000004K",
                    "K4200000000000024K",
                    "K4320000000000234K",
                    ".K44433333333444K.",
                    "..K3344444444433K..",
                    "...KKKKKKKKKKKKK..."
                ];
                this.bakeGrid('open_pit', openPit, pal, 3.6);`;

if (html.match(oldOpenPitPattern)) {
    html = html.replace(oldOpenPitPattern, newOpenPit);
    console.log('  ✓ Replaced flat open pit with depth-shaded stone chasm sprite.');
}

// ============================================================================
// PILLAR 3: VOLUMETRIC CRESCENT SLASH & WHITE HIT-FLASH
// ============================================================================
console.log('[PILLAR 3] Upgrading Melee Attack Visuals (Volumetric Crescent Blade)...');

// 3.1 Replace thin arc in renderCharacterWeapon with a stunning volumetric crescent blade
const oldRenderWeaponPattern = /function renderCharacterWeapon\(ctx, char, isLocal = false\) \{[\s\S]*?ctx\.beginPath\(\);\s*ctx\.arc\(0, 0, reach - 8, Math\.min\(startA, curA\), Math\.max\(startA, curA\)\);\s*ctx\.stroke\(\);[\s\S]*?if \(wep\.id === 'twin_trowels'\) \{[\s\S]*?\}\s*ctx\.save\(\);/;

const newRenderWeapon = `function renderCharacterWeapon(ctx, char, isLocal = false) {
            const wep = char.weapon || WEAPON_ARSENAL.rusty_spade;
            const swingTimer = isLocal ? char.swingTimer : (char.swingTimer || 0);
            const swingDuration = isLocal ? char.swingDuration : (char.swingDuration || 0.2);
            const comboStep = char.comboStep || 0;
            const angle = char.angle !== undefined ? char.angle : 0;

            if (swingTimer > 0) {
                const prog = Math.max(0, Math.min(1, 1 - (swingTimer / swingDuration)));
                const dir = comboStep % 2 === 0 ? 1 : -1;
                const sweepAngle = (comboStep === 0 ? 1.6 : 1.35) * dir;
                const startA = angle - sweepAngle;
                const endA = angle + sweepAngle;
                const curA = startA + (endA - startA) * prog;
                const reach = wep.reach * (comboStep === 0 ? 1.2 : 1.05);

                // Volumetric Glowing Crescent Blade Slash
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
                ctx.restore();

                ctx.save();`;

if (html.match(oldRenderWeaponPattern)) {
    html = html.replace(oldRenderWeaponPattern, newRenderWeapon);
    console.log('  ✓ Replaced thin wireframe arc with volumetric glowing crescent slash.');
}

// 3.2 Fix the enemy hit-flash to use sprite silhouette clipping rather than a white square box
const oldHitFlashPattern = /if \(e\.flash > 0\) \{\s*ctx\.fillStyle = 'rgba\(255, 255, 255, 0\.65\)';\s*ctx\.fillRect\(-e\.radius, -e\.radius, e\.radius \* 2, e\.radius \* 2\);\s*\}/;

const newHitFlash = `if (e.flash > 0) {
                        // High-Impact White Silhouette Flash (preserves sprite shape, no square box)
                        ctx.save();
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
                        ctx.fillRect(-spr.width / 2, -spr.height / 2, spr.width, spr.height);
                        ctx.restore();
                    }`;

if (html.match(oldHitFlashPattern)) {
    html = html.replace(oldHitFlashPattern, newHitFlash);
    console.log('  ✓ Fixed enemy hit-flash to clean white sprite silhouette.');
}

// ============================================================================
// PILLAR 4: DIEGETIC GOTHIC COMBAT DOCK (PURGE TAILWIND CARDS)
// ============================================================================
console.log('[PILLAR 4] Redesigning Combat Hotbar into Diegetic Gothic Action Dock...');

// 4.1 Replace the clumsy bottom web buttons with a sleek, non-intrusive gothic action dock
const oldBottomHudPattern = /<!-- FLOATING BOTTOM ACTIVE CONTROLS -->[\s\S]*?<!-- MOBILE VIRTUAL JOYSTICK & CONTROLS -->/;

const newBottomHud = `<!-- SLEEK GOTHIC COMBAT ACTION DOCK -->
        <div id="hud-bottom-dock" class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-none select-none">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-2xl pointer-events-auto">
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
            </div>
        </div>

        <!-- MOBILE VIRTUAL JOYSTICK & CONTROLS -->`;

if (html.match(oldBottomHudPattern)) {
    html = html.replace(oldBottomHudPattern, newBottomHud);
    console.log('  ✓ Replaced giant Tailwind cards with compact gothic action hotbar.');
}

// 4.2 Fix top-left health bar with glowing crystal styling
html = html.replace(
    `<div id="hp-bar" class="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-150" style="width: 100%;"></div>`,
    `<div id="hp-bar" class="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 rounded-full transition-all duration-150 shadow-[0_0_12px_rgba(244,63,94,0.7)]" style="width: 100%;"></div>`
);

// ============================================================================
// PILLAR 5: MULTI-LAYERED SOUND SYNTHESIS (SUB-BASS IMPACTS)
// ============================================================================
console.log('[PILLAR 5] Upgrading Web Audio Synthesis with Sub-Bass & Weapon Punch...');

// Upgrade melee impact sound in SoundEngine
const oldHitSoundPattern = /case 'hit':[\s\S]*?break;/;

const newHitSound = `case 'hit': {
                    // Layer 1: Sub-Bass Impact Thud (60Hz -> 30Hz exponential punch)
                    const subOsc = this.ctx.createOscillator();
                    const subGain = this.ctx.createGain();
                    subOsc.type = 'triangle';
                    subOsc.frequency.setValueAtTime(65, now);
                    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.12);
                    subGain.gain.setValueAtTime(0.38 * vol, now);
                    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    subOsc.connect(subGain);
                    subGain.connect(this.ctx.destination);
                    subOsc.start(now);
                    subOsc.stop(now + 0.13);

                    // Layer 2: Metallic Blade Contact Click
                    const clickOsc = this.ctx.createOscillator();
                    const clickGain = this.ctx.createGain();
                    clickOsc.type = 'sawtooth';
                    clickOsc.frequency.setValueAtTime(420 * (0.95 + Math.random() * 0.1), now);
                    clickOsc.frequency.exponentialRampToValueAtTime(90, now + 0.06);
                    clickGain.gain.setValueAtTime(0.24 * vol, now);
                    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                    clickOsc.connect(clickGain);
                    clickGain.connect(this.ctx.destination);
                    clickOsc.start(now);
                    clickOsc.stop(now + 0.07);
                    break;
                }`;

if (html.match(oldHitSoundPattern)) {
    html = html.replace(oldHitSoundPattern, newHitSound);
    console.log('  ✓ Upgraded hit sound with sub-bass punch and metallic blade contact layers.');
}

// Write the remastered index.html
fs.writeFileSync(indexPath, html, 'utf8');
console.log('[PRO GAME DEV] Successfully saved index.html! (Size:', html.length, 'bytes)');
