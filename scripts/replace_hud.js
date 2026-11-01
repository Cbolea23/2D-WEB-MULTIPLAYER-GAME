import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

const targetStart = '<!-- Active Weapon & Skill Controls -->';
const startIdx = html.indexOf(targetStart);
const ultIdx = html.indexOf('id="act-ult"');
const endDivIdx = html.indexOf('</div>', ultIdx);
const containerEndIdx = html.indexOf('</div>', endDivIdx + 6);

console.log('startIdx:', startIdx, 'containerEndIdx:', containerEndIdx);

if (startIdx !== -1 && containerEndIdx !== -1) {
    const newBottomHud = `<!-- SLEEK GOTHIC COMBAT ACTION DOCK -->
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
    html = html.substring(0, startIdx) + newBottomHud + html.substring(containerEndIdx + 6);
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✓ Successfully replaced bottom weapon cards with compact gothic action dock!');
}
