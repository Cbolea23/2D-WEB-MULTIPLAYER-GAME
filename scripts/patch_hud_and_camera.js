import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Camera Chamber-Anchored lookahead damping
const oldCamBlock = `            if (!game.usingTouch) {
                leadX = Math.max(-75, Math.min(75, (mousePos.x - canvas.width / 2) * 0.14));
                leadY = Math.max(-55, Math.min(55, (mousePos.y - canvas.height / 2) * 0.14));
            }
            game.camera.x += (player.x + leadX - game.camera.x) * Math.min(1, dt * 11);
            game.camera.y += (player.y + leadY - game.camera.y) * Math.min(1, dt * 11);`;

const newCamBlock = `            // Professional Camera: Chamber-Anchored Lookahead
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

if (html.includes(oldCamBlock)) {
    html = html.replace(oldCamBlock, newCamBlock);
    console.log('✓ Replaced old camera block with Chamber-Anchored Lookahead');
} else {
    console.warn('⚠️ Could not find exact oldCamBlock');
}

// 2. Bottom HUD: Replace giant Tailwind cards with compact gothic action dock
const oldBottomHudMatch = html.match(/<!-- FLOATING BOTTOM ACTIVE CONTROLS -->[\s\S]*?<!-- MOBILE VIRTUAL JOYSTICK & CONTROLS -->/);
if (oldBottomHudMatch) {
    const newBottomHud = `<!-- SLEEK GOTHIC COMBAT ACTION DOCK -->
        <div id="hud-bottom-dock" class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-none select-none">
            <div class="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-2xl pointer-events-auto">
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
    html = html.replace(oldBottomHudMatch[0], newBottomHud);
    console.log('✓ Successfully replaced old bottom HUD with sleek gothic combat action dock');
} else {
    console.warn('⚠️ Could not match oldBottomHudMatch');
}

// 3. Sub-Bass Web Audio Hit Sound
const hitSoundSearch = "case 'hit':\n                    osc.type = 'square';\n                    osc.frequency.setValueAtTime(160, now);\n                    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);\n                    gain.gain.setValueAtTime(0.22 * vol, now);\n                    gain.gain.exponentialRampToValueAtTime(0.002, now + 0.08);\n                    break;";

const newHitSoundCode = `case 'hit': {
                    // Layer 1: Sub-Bass Impact Thud (65Hz -> 28Hz punch)
                    const subOsc = this.ctx.createOscillator();
                    const subGain = this.ctx.createGain();
                    subOsc.type = 'triangle';
                    subOsc.frequency.setValueAtTime(65, now);
                    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.12);
                    subGain.gain.setValueAtTime(0.35 * vol, now);
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

if (html.includes(hitSoundSearch)) {
    html = html.replace(hitSoundSearch, newHitSoundCode);
    console.log('✓ Successfully injected multi-layered Sub-Bass impact sound');
} else {
    // Try regex
    const hitMatch = html.match(/case 'hit':[\s\S]*?break;/);
    if (hitMatch) {
        html = html.replace(hitMatch[0], newHitSoundCode);
        console.log('✓ Successfully replaced hit sound using regex match');
    }
}

// 4. Save and validate
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Saved index.html (Bytes:', html.length, ')');
