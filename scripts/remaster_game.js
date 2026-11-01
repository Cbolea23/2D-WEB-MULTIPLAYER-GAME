import fs from 'fs';
import path from 'path';
import vm from 'vm';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('Original index.html size:', html.length);

// ============================================================================
// 1. UPDATE CSS & STYLING FOR SLEEK RETRO-COMMERCIAL ACTION GAME LOOK
// ============================================================================
// Replace the styling block to support full 100vh viewport and crisp typography
const oldStyleStart = '<style>';
const oldStyleEnd = '</style>';
const styleStartIdx = html.indexOf(oldStyleStart);
const styleEndIdx = html.indexOf(oldStyleEnd);

if (styleStartIdx === -1 || styleEndIdx === -1) {
    console.error('Could not find <style> block');
    process.exit(1);
}

const newStyles = `<style>
        :root {
            --bg-dark: #05070b;
            --gold: #f59e0b;
            --soul-cyan: #22d3ee;
            --danger: #ef4444;
        }

        * {
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg-dark);
            color: #f1f5f9;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-direction: column;
            image-rendering: pixelated;
        }

        .font-gothic {
            font-family: 'Cinzel', serif;
            letter-spacing: 0.05em;
        }

        .font-pixel {
            font-family: 'Inter', sans-serif;
            font-weight: 800;
            letter-spacing: 0.04em;
        }

        /* High-Definition Glassmorphic Pixel Panels */
        .pixel-panel {
            background: rgba(9, 13, 22, 0.90);
            border: 2px solid #334155;
            box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
        }

        .pixel-panel-gold {
            background: rgba(15, 17, 23, 0.92);
            border: 2px solid #d97706;
            box-shadow: inset 1px 1px 0px rgba(251, 191, 36, 0.2), 0 8px 24px rgba(217, 119, 6, 0.25);
            backdrop-filter: blur(8px);
        }

        .pixel-panel-cyan {
            background: rgba(8, 17, 28, 0.92);
            border: 2px solid #0891b2;
            box-shadow: inset 1px 1px 0px rgba(34, 211, 238, 0.2), 0 8px 24px rgba(8, 145, 178, 0.25);
            backdrop-filter: blur(8px);
        }

        .pixel-panel-purple {
            background: rgba(18, 11, 32, 0.92);
            border: 2px solid #9333ea;
            box-shadow: inset 1px 1px 0px rgba(168, 85, 247, 0.2), 0 8px 24px rgba(147, 51, 234, 0.28);
            backdrop-filter: blur(8px);
        }

        /* Polished Interactive Buttons */
        .pixel-button {
            background: #1e293b;
            border: 2px solid #475569;
            box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.15), 0 4px 10px rgba(0, 0, 0, 0.5);
            transition: transform 0.08s ease, background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
            cursor: pointer;
            font-weight: 700;
        }

        .pixel-button:hover {
            background: #334155;
            border-color: #22d3ee;
            transform: translateY(-1px);
        }

        .pixel-button:active, .pixel-button.active-depress {
            transform: translateY(2px);
            box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.6);
        }

        .pixel-button-gold {
            background: linear-gradient(180deg, #92400e 0%, #78350f 100%);
            border: 2px solid #fbbf24;
            box-shadow: inset 1px 1px 0px rgba(254, 240, 138, 0.35), 0 4px 12px rgba(217, 119, 6, 0.35);
            transition: transform 0.08s ease, filter 0.12s ease, border-color 0.12s ease;
            cursor: pointer;
            font-weight: 800;
        }

        .pixel-button-gold:hover {
            filter: brightness(1.15);
            border-color: #fde047;
            transform: translateY(-1px);
        }

        .pixel-button-gold:active, .pixel-button-gold.active-depress {
            transform: translateY(2px);
            filter: brightness(0.95);
        }

        .pixel-button-cyan {
            background: linear-gradient(180deg, #0e7490 0%, #155e75 100%);
            border: 2px solid #38bdf8;
            box-shadow: inset 1px 1px 0px rgba(186, 230, 253, 0.35), 0 4px 12px rgba(8, 145, 178, 0.35);
            transition: transform 0.08s ease, filter 0.12s ease;
            cursor: pointer;
            font-weight: 800;
        }

        .pixel-button-cyan:hover {
            filter: brightness(1.15);
            transform: translateY(-1px);
        }

        .pixel-button-cyan:active, .pixel-button-cyan.active-depress {
            transform: translateY(2px);
        }

        .pixel-button-purple {
            background: linear-gradient(180deg, #7e22ce 0%, #581c87 100%);
            border: 2px solid #c084fc;
            box-shadow: inset 1px 1px 0px rgba(243, 232, 255, 0.35), 0 4px 12px rgba(147, 51, 234, 0.35);
            transition: transform 0.08s ease, filter 0.12s ease;
            cursor: pointer;
            font-weight: 800;
        }

        .pixel-button-purple:hover {
            filter: brightness(1.15);
            transform: translateY(-1px);
        }

        .pixel-button-purple:active {
            transform: translateY(2px);
        }

        .pixel-button-red {
            background: linear-gradient(180deg, #991b1b 0%, #7f1d1d 100%);
            border: 2px solid #f87171;
            box-shadow: inset 1px 1px 0px rgba(254, 202, 202, 0.3), 0 4px 12px rgba(239, 68, 68, 0.35);
            cursor: pointer;
            font-weight: 800;
        }

        .pixel-button-red:hover {
            filter: brightness(1.15);
        }

        #game-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background-color: var(--bg-dark);
        }

        #gameCanvas {
            display: block;
            width: 100%;
            height: 100%;
            cursor: crosshair;
        }

        /* Floating Virtual Analog Joystick */
        .joystick-base {
            position: absolute;
            width: 116px;
            height: 116px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(15, 23, 42, 0.65) 0%, rgba(9, 13, 22, 0.85) 100%);
            border: 3px solid rgba(34, 211, 238, 0.55);
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.25);
            pointer-events: none;
            transform: translate(-50%, -50%);
            display: none;
            z-index: 25;
        }

        .joystick-thumb {
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: radial-gradient(circle, #67e8f9 0%, #0891b2 100%);
            border: 3px solid #cffafe;
            pointer-events: none;
            transform: translate(-50%, -50%);
            display: none;
            z-index: 26;
            box-shadow: 0 0 14px rgba(34, 211, 238, 0.9);
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #090d16;
            border-left: 1px solid #1e293b;
        }

        ::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
        }
    </style>`;

html = html.substring(0, styleStartIdx) + newStyles + html.substring(styleEndIdx + oldStyleEnd.length);
console.log('Updated <style> block successfully.');

// ============================================================================
// 2. REPLACE TOP BAR & VIEWPORT OVERLAYS WITH MODERN IN-GAME FLOATING HUD
// ============================================================================
// Find from <body ...> down to </main>
const bodyStart = html.indexOf('<body');
const mainEnd = html.indexOf('</main>');

if (bodyStart === -1 || mainEnd === -1) {
    console.error('Could not find <body> or </main>');
    process.exit(1);
}

// Find opening <body...> tag close
const bodyOpenEnd = html.indexOf('>', bodyStart) + 1;

const newBodyAndViewportHtml = `
    <!-- MAIN 100VH GAME VIEWPORT -->
    <main id="game-container">
        <canvas id="gameCanvas"></canvas>

        <!-- FLOATING TOP-LEFT IN-GAME COMBAT HUD -->
        <div id="hud-top-left" class="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none select-none">
            <!-- Vitals Panel (HP, Level & XP) -->
            <div class="pixel-panel px-3 py-2 rounded-lg flex items-center gap-3 pointer-events-auto border-slate-700/80 shadow-2xl">
                <!-- Heart & HP Bar -->
                <div class="flex items-center gap-2">
                    <span class="text-red-400 text-sm font-black animate-pulse">❤️</span>
                    <div class="flex flex-col">
                        <div class="flex items-center justify-between text-[11px] font-pixel text-slate-200 leading-none mb-1">
                            <span class="text-red-400">HEALTH</span>
                            <span id="hp-text" class="text-slate-100 font-bold ml-2">120/120</span>
                        </div>
                        <div class="w-32 md:w-40 h-3.5 bg-slate-950 overflow-hidden relative rounded border border-red-950">
                            <div id="hp-drain-bar" class="absolute inset-y-0 left-0 bg-amber-200 transition-all duration-500 rounded" style="width: 100%;"></div>
                            <div id="hp-bar" class="relative z-10 h-full bg-gradient-to-r from-red-700 via-rose-600 to-red-500 transition-all duration-150 rounded" style="width: 100%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Soul Level & XP Gauge -->
                <div class="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
                    <div class="flex flex-col">
                        <div class="flex items-center justify-between text-[11px] font-pixel leading-none mb-1">
                            <span id="lvl-badge" class="text-cyan-400 font-bold">LV.1</span>
                            <span id="xp-text" class="text-cyan-300/80 text-[10px] ml-2">0/50 XP</span>
                        </div>
                        <div class="w-24 md:w-28 h-3.5 bg-slate-950 overflow-hidden rounded border border-cyan-950">
                            <div id="xp-bar" class="h-full bg-gradient-to-r from-cyan-600 to-teal-400 transition-all duration-200 rounded" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Currencies & Status Indicators -->
            <div class="flex items-center gap-2 flex-wrap">
                <!-- Gold Coins -->
                <div class="pixel-panel px-2.5 py-1 rounded-md flex items-center gap-1.5 pointer-events-auto border-amber-900/60" title="Gold Coins Collected This Run">
                    <span class="text-amber-400 text-xs">🪙</span>
                    <span id="coin-count" class="font-pixel text-amber-300 text-xs font-bold">40</span>
                </div>

                <!-- Persistent Soul Shards -->
                <div class="pixel-panel px-2.5 py-1 rounded-md flex items-center gap-1.5 pointer-events-auto border-purple-900/60" title="Persistent Soul Shards for Permanent Upgrades">
                    <span class="text-purple-400 text-xs">🔮</span>
                    <span id="soul-count" class="font-pixel text-purple-300 text-xs font-bold">0</span>
                </div>

                <!-- Threat Badge -->
                <div id="threat-badge" class="hidden sm:flex pixel-panel px-2 py-1 rounded-md items-center gap-1.5 border-red-900/60" title="Crypt Threat Level">
                    <span class="text-red-400 text-[10px] font-pixel">THREAT</span>
                    <span id="threat-level-txt" class="font-pixel text-amber-300 text-[11px] font-bold">1.0x</span>
                </div>

                <!-- Combo Gauge -->
                <div id="combo-badge" class="hidden md:flex pixel-panel px-2.5 py-1 rounded-md items-center gap-1.5 border-amber-600/70" title="Style Combo Rank">
                    <span id="combo-rank" class="font-pixel text-xs text-amber-400 font-black">RANK D</span>
                    <span id="combo-count" class="font-pixel text-[11px] text-cyan-300 font-bold">0x</span>
                    <div class="w-10 h-2 bg-slate-950 overflow-hidden border border-amber-900/80 rounded-sm">
                        <div id="combo-bar" class="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-100" style="width: 0%;"></div>
                    </div>
                </div>

                <!-- Ankh Cheat Death Badge -->
                <div id="ankh-badge" class="hidden items-center gap-1 pixel-panel px-2 py-1 rounded-md border-yellow-500 pointer-events-auto" title="Ankh of Rebirth Active">
                    <span class="text-yellow-400 text-xs">☥</span>
                    <span class="font-pixel text-yellow-300 text-[10px] font-bold">REBIRTH</span>
                </div>
            </div>
        </div>

        <!-- FLOATING TOP-CENTER DUNGEON ROOM STATUS & BOSS HEALTH BAR -->
        <div id="hud-top-center" class="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none select-none">
            <!-- Biome & Room Badge -->
            <div class="pixel-panel px-3 py-1 rounded-full flex items-center gap-2 border-slate-700/80 shadow-lg">
                <span id="depth-badge" class="font-pixel text-[11px] text-purple-300 font-bold">DEPTH 1: GRAVEYARD</span>
                <span class="text-slate-600">•</span>
                <span id="room-type-badge" class="font-pixel text-[10px] text-cyan-300 uppercase font-semibold">COURTYARD</span>
            </div>

            <!-- Boss Health Bar -->
            <div id="boss-hud" class="hidden w-80 md:w-96 pixel-panel border-2 border-red-600 rounded-lg p-2.5 shadow-2xl">
                <div class="flex items-center justify-between text-[11px] font-pixel mb-1.5">
                    <span id="boss-name" class="text-red-400 font-black">💀 MALAKOR, THE BONE TITAN</span>
                    <span id="boss-phase-badge" class="px-1.5 py-0.5 bg-red-950 text-amber-300 border border-red-500 rounded text-[9px] font-bold">PHASE 1</span>
                    <span id="boss-hp-text" class="text-slate-300 text-[10px]">800 / 800</span>
                </div>
                <div class="w-full h-3.5 bg-slate-950 overflow-hidden rounded border border-red-950">
                    <div id="boss-hp-bar" class="h-full bg-gradient-to-r from-red-700 via-red-500 to-amber-500 transition-all duration-150 rounded" style="width: 100%;"></div>
                </div>
            </div>
        </div>

        <!-- FLOATING TOP-RIGHT RADAR & PAUSE BUTTON -->
        <div id="hud-top-right" class="absolute top-3 right-3 z-20 flex items-start gap-2.5 pointer-events-none select-none">
            <!-- Minimap Panel -->
            <div id="minimap-panel" class="pixel-panel rounded-lg p-2 shadow-2xl pointer-events-auto border-slate-700/80">
                <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="text-[9px] font-pixel text-slate-400 font-bold tracking-wider">RADAR</span>
                    <span id="rooms-cleared-txt" class="text-[9px] font-pixel text-emerald-400 font-bold">1/9</span>
                    <button id="btn-toggle-map" class="text-xs font-pixel text-cyan-400 hover:text-white px-1 leading-none" title="Expand Radar">⛶</button>
                </div>
                <canvas id="minimapCanvas" width="76" height="76" class="rounded bg-slate-950 border border-slate-800 cursor-pointer hover:border-cyan-400 transition-colors"></canvas>
                <div id="minimap-legend" class="hidden mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8px] font-pixel text-slate-400">
                    <div class="flex items-center gap-1"><span class="w-2 h-2 bg-emerald-400 inline-block rounded-xs"></span>You</div>
                    <div class="flex items-center gap-1"><span class="w-2 h-2 bg-red-500 inline-block rounded-xs"></span>Boss</div>
                    <div class="flex items-center gap-1"><span class="w-2 h-2 bg-amber-400 inline-block rounded-xs"></span>Vault</div>
                    <div class="flex items-center gap-1"><span class="w-2 h-2 bg-cyan-400 inline-block rounded-xs"></span>Shrine</div>
                </div>
            </div>

            <!-- Quick Pause Button -->
            <button id="btn-pause" class="pixel-button-gold text-amber-100 font-pixel text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xl pointer-events-auto border-amber-400" title="Pause Game [ESC]">
                <span class="text-sm">⏸️</span>
                <span>PAUSE</span>
            </button>
        </div>

        <!-- Floating Mobile Analog Joystick Elements -->
        <div id="joy-base" class="joystick-base"></div>
        <div id="joy-thumb" class="joystick-thumb"></div>

        <!-- SYNERGY EVOLUTION TOAST BANNER -->
        <div id="synergy-banner" class="hidden absolute top-20 left-1/2 -translate-x-1/2 z-30 pixel-panel-gold px-5 py-3 rounded-lg text-center shadow-2xl pointer-events-none animate-bounce border-amber-400">
            <div class="text-[10px] font-pixel text-amber-300 uppercase tracking-widest font-black">⚡ RELIC SYNERGY FORGED ⚡</div>
            <div id="synergy-title" class="font-gothic text-base text-white font-black mt-0.5">TEMPEST CRESCENT</div>
            <div id="synergy-desc" class="text-xs font-pixel text-cyan-300 mt-0.5">Finisher waves electrify and stun all enemies in their path!</div>
        </div>

        <!-- CONTEXT INTERACTION BANNER -->
        <div id="context-banner" class="hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pixel-panel-gold rounded-full px-5 py-2 shadow-2xl pointer-events-none border-amber-400 animate-pulse">
            <div id="context-text" class="text-xs font-pixel text-amber-200 font-bold flex items-center gap-2">
                <span>⛏️</span> <span>Press [E] or Space to Excavate Dirt Mound</span>
            </div>
        </div>

        <!-- BOTTOM SKILL & RELIC BAR (DESKTOP) -->
        <div class="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1.5 pointer-events-none select-none">
            <!-- Collected Relics Strip -->
            <div id="relic-strip" class="flex items-center gap-1.5 flex-wrap justify-center min-h-[30px] px-3.5 py-1 pixel-panel rounded-lg pointer-events-auto border-slate-700/80">
                <span class="text-[10px] font-pixel text-slate-400 italic">Unearth burial mounds to harvest Cursed Relics & Synergies...</span>
            </div>

            <!-- Active Weapon & Skill Controls -->
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
                        <div class="text-[11px] font-pixel text-purple-200 font-bold">EARTHQUAKE</div>
                        <div id="ult-status" class="text-[9px] font-pixel text-purple-300/80">[Q] READY</div>
                    </div>
                </button>
            </div>
        </div>

        <!-- MOBILE ERGONOMIC RADIAL BUTTON CLUSTER -->
        <div id="mobile-radial-controls" class="md:hidden absolute bottom-5 right-5 z-20 pointer-events-auto select-none">
            <div class="relative w-44 h-44">
                <button id="mob-strike" class="absolute bottom-0 right-0 w-20 h-20 rounded-full pixel-button-gold flex flex-col items-center justify-center shadow-2xl border-2 border-amber-300">
                    <span id="mob-weapon-icon" class="text-2xl">⛏️</span>
                    <span class="text-[9px] font-pixel text-amber-100 font-bold mt-0.5">STRIKE</span>
                </button>
                <button id="mob-dash" class="absolute top-4 right-1 w-14 h-14 rounded-full pixel-button-cyan flex flex-col items-center justify-center shadow-xl relative overflow-hidden border-2 border-cyan-300">
                    <div id="cd-dash-mob" class="absolute inset-0 bg-slate-950/85 origin-bottom scale-y-0 transition-transform"></div>
                    <span class="text-lg relative z-10">💨</span>
                    <span class="text-[8px] font-pixel text-cyan-100 font-bold relative z-10">DASH</span>
                </button>
                <button id="mob-dig" class="absolute bottom-1 left-2 w-14 h-14 rounded-full pixel-button flex flex-col items-center justify-center shadow-xl border-2 border-emerald-400">
                    <span class="text-lg">🪦</span>
                    <span class="text-[8px] font-pixel text-emerald-200 font-bold">DIG</span>
                </button>
                <button id="mob-ult" class="absolute top-6 left-8 w-14 h-14 rounded-full pixel-button flex flex-col items-center justify-center shadow-xl relative overflow-hidden border-2 border-purple-400">
                    <div id="cd-ult-mob" class="absolute inset-0 bg-slate-950/85 origin-bottom scale-y-0 transition-transform"></div>
                    <span class="text-lg relative z-10">⚡</span>
                    <span id="mob-ult-txt" class="text-[8px] font-pixel text-purple-200 font-bold relative z-10">QUAKE</span>
                </button>
            </div>
        </div>
    </main>
`;

html = html.substring(0, bodyOpenEnd) + newBodyAndViewportHtml + html.substring(mainEnd + '</main>'.length);
console.log('Replaced top bar and viewport with modern floating action HUD.');

// ============================================================================
// 3. TITLE / HOME SCREEN REMASTER & HUB ACCESS (ARSENAL, ALTAR, CODEX, SETTINGS)
// ============================================================================
// Replace the Title Screen and remove #auth-modal completely
const homeScreenStart = html.indexOf('<div id="home-screen"');
const authModalEnd = html.indexOf('</div>\n    </div>\n\n    <!-- MODAL: IN-GAME PAUSE MENU -->');

if (homeScreenStart !== -1 && authModalEnd !== -1) {
    const newHomeScreenAndModals = `<div id="home-screen" class="fixed inset-0 bg-[#05070b]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 select-none">
        <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10 max-w-lg w-full text-center space-y-6">
            <div class="space-y-2">
                <div class="flex items-center justify-center gap-3 mb-1">
                    <span class="text-4xl animate-bounce">⚰️</span>
                    <h1 class="font-gothic text-3xl md:text-5xl text-amber-400 tracking-wider font-black drop-shadow-[0_4px_20px_rgba(245,158,11,0.5)]">
                        CRYPT KEEPER
                    </h1>
                    <span class="text-4xl animate-bounce">⛏️</span>
                </div>
                <div class="font-gothic text-sm md:text-base text-cyan-300 tracking-widest uppercase font-semibold">
                    ROGUE SHOVEL • 2D ACTION DUNGEON CRAWLER
                </div>
                <p class="text-xs font-pixel text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
                    Unearth buried loot, deflect cursed magic orbs, and battle ruthless undead hordes through shifting catacombs!
                </p>
            </div>

            <!-- Primary Action Buttons -->
            <div class="space-y-3 max-w-sm mx-auto">
                <button id="btn-home-solo" class="pixel-button-gold w-full py-3.5 rounded-xl font-pixel text-sm text-amber-100 tracking-wider shadow-2xl flex items-center justify-center gap-2.5 border-amber-400">
                    <span class="text-lg">⚔️</span> <span>START EXPEDITION</span>
                </button>
                <button id="btn-home-coop" class="pixel-button-cyan w-full py-3 rounded-xl font-pixel text-xs text-cyan-100 tracking-wider shadow-xl flex items-center justify-center gap-2 border-cyan-400">
                    <span class="text-base">🌐</span> <span>CO-OP SQUAD (UP TO 6 PLAYERS)</span>
                </button>

                <!-- Hub Quick-Access Grid -->
                <div class="grid grid-cols-2 gap-2.5 pt-1">
                    <button id="btn-home-arsenal" class="pixel-button py-2.5 rounded-lg font-pixel text-xs text-amber-300 flex items-center justify-center gap-2 border-amber-700/60 hover:border-amber-400">
                        <span>⛏️</span> <span>ARSENAL</span>
                    </button>
                    <button id="btn-home-altar" class="pixel-button py-2.5 rounded-lg font-pixel text-xs text-purple-300 flex items-center justify-center gap-2 border-purple-700/60 hover:border-purple-400">
                        <span>🔮</span> <span>SOUL ALTAR</span>
                    </button>
                    <button id="btn-home-codex" class="pixel-button py-2.5 rounded-lg font-pixel text-xs text-slate-200 flex items-center justify-center gap-2 border-slate-700 hover:border-cyan-400">
                        <span>📜</span> <span>CODEX</span>
                    </button>
                    <button id="btn-home-settings" class="pixel-button py-2.5 rounded-lg font-pixel text-xs text-cyan-300 flex items-center justify-center gap-2 border-cyan-700/60 hover:border-cyan-400">
                        <span>⚙️</span> <span>SETTINGS</span>
                    </button>
                </div>
            </div>

            <!-- Auto-Save Status Banner -->
            <div class="pixel-panel p-2.5 rounded-lg flex items-center justify-between text-xs font-pixel max-w-sm mx-auto bg-slate-900/90 border-slate-700">
                <div class="flex items-center gap-2 text-emerald-400 font-bold">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span id="save-status-text">AUTO-SAVE ACTIVE</span>
                </div>
                <div id="portal-user-tag" class="text-slate-400 text-[11px] font-semibold">
                    LOCAL & CLOUD SYNCED
                </div>
            </div>

            <!-- Player Meta Stats Preview -->
            <div class="pixel-panel p-2.5 rounded-lg flex items-center justify-around text-xs font-pixel text-slate-200 max-w-sm mx-auto bg-slate-950/80 border-slate-800">
                <div>🔮 SOULS: <span id="home-souls" class="text-purple-400 font-black">0</span></div>
                <div>⛏️ WEAPON: <span id="home-weapon" class="text-amber-400 font-black">RUSTY SPADE</span></div>
                <div>🏆 BEST: <span id="home-depth" class="text-cyan-400 font-black">DEPTH 1</span></div>
            </div>

            <div class="text-[10px] font-pixel text-slate-500 flex items-center justify-center gap-4">
                <span>VER 1.4.0 • CRAZYGAMES EDITION</span>
                <span>KEYBOARD, MOUSE & TOUCH</span>
            </div>
        </div>
    </div>

    <!-- MODAL: GAME SETTINGS -->
    <div id="settings-modal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
        <div class="pixel-panel max-w-md w-full p-5 rounded-xl space-y-4 border-slate-700">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div class="flex items-center gap-2">
                    <span class="text-xl">⚙️</span>
                    <h2 class="font-gothic text-base font-black text-amber-400">EXPEDITION SETTINGS</h2>
                </div>
                <button id="close-settings" class="pixel-button text-slate-200 px-3 py-1 rounded font-pixel text-xs">✕</button>
            </div>

            <div class="space-y-3.5 text-xs font-pixel">
                <div class="space-y-1.5">
                    <div class="flex justify-between text-slate-200">
                        <span>MASTER AUDIO VOLUME</span>
                        <span id="label-volume" class="text-cyan-400 font-bold">70%</span>
                    </div>
                    <input id="slider-volume" type="range" min="0" max="100" value="70" class="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer">
                </div>

                <div class="flex items-center justify-between py-2 border-t border-slate-800">
                    <div>
                        <div class="text-slate-100 font-bold">SCREEN SHAKE & IMPACT JUICE</div>
                        <div class="text-[10px] text-slate-400">Camera recoil on weapon swings and explosions</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-screenshake" type="checkbox" checked class="sr-only peer">
                        <div class="w-10 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between py-2 border-t border-slate-800">
                    <div>
                        <div class="text-slate-100 font-bold">FLOATING COMBAT NUMBERS</div>
                        <div class="text-[10px] text-slate-400">Damage popups, crits, and deflected damage</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-dmgnumbers" type="checkbox" checked class="sr-only peer">
                        <div class="w-10 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between py-2 border-t border-slate-800">
                    <div>
                        <div class="text-slate-100 font-bold">AUTO-AIM TARGET ASSIST</div>
                        <div class="text-[10px] text-slate-400">Smart shovel target lock when attacking with keyboard</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-autoaim" type="checkbox" checked class="sr-only peer">
                        <div class="w-10 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>
            </div>

            <div class="border-t border-slate-800 pt-3 flex justify-end">
                <button id="btn-save-settings" class="pixel-button-gold px-5 py-2.5 rounded-lg font-pixel text-xs text-amber-100 font-bold">
                    SAVE & CLOSE
                </button>
            </div>
        </div>
    </div>`;

    html = html.substring(0, homeScreenStart) + newHomeScreenAndModals + html.substring(authModalEnd + 21);
    console.log('Replaced Home Screen and purged #auth-modal successfully.');
} else {
    console.warn('Could not cleanly slice homeScreen to authModalEnd. Investigating indices:', { homeScreenStart, authModalEnd });
}

// ============================================================================
// 4. CLEAN UP CO-OP MODAL (PURGE ALL GODOT MANIFEST AND TECH-DEMO DEBUG UI)
// ============================================================================
const coopModalStart = html.indexOf('<div id="coop-modal"');
const rewardedModalStart = html.indexOf('<!-- REWARDED VIDEO AD SIMULATION MODAL -->');

if (coopModalStart !== -1 && rewardedModalStart !== -1) {
    const cleanCoopModalHtml = `<div id="coop-modal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex items-center justify-center p-4">
        <div class="pixel-panel-cyan max-w-2xl w-full p-6 rounded-2xl max-h-[90vh] flex flex-col border-cyan-500/80 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
            <div class="flex items-center justify-between border-b-2 border-cyan-900 pb-3 mb-4">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">🌐</span>
                    <div>
                        <h2 class="font-gothic text-base md:text-lg font-black text-cyan-300">CRYPT CO-OP EXPEDITION LOBBY</h2>
                        <p class="text-xs font-pixel text-slate-300 mt-0.5">Explore catacombs together with up to 6 players in real-time online co-op.</p>
                    </div>
                </div>
                <button id="close-coop" class="pixel-button text-slate-200 px-3 py-1.5 rounded-lg font-pixel text-xs">✕ [ESC]</button>
            </div>

            <div class="space-y-4">
                <!-- Squad Header & Status Bar -->
                <div class="pixel-panel p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border-slate-700">
                    <div class="flex items-center gap-3">
                        <span class="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse shrink-0" id="net-status-dot"></span>
                        <div>
                            <div class="font-pixel text-xs text-white flex items-center gap-2 flex-wrap">
                                <span class="text-slate-300">SESSION ROOM:</span>
                                <span id="coop-room-code" class="text-amber-300 bg-slate-950 px-2.5 py-1 rounded border border-amber-500 font-black tracking-widest text-sm">KEEPER-7X9</span>
                                <button id="btn-copy-code" class="pixel-button text-[10px] px-2.5 py-1 text-cyan-300 hover:text-cyan-100 rounded" title="Copy Room Code">
                                    📋 COPY
                                </button>
                                <button id="btn-copy-invite-link" class="pixel-button-cyan text-[10px] px-2.5 py-1 text-cyan-100 rounded" title="Copy One-Click Join Link">
                                    🔗 SHARE LINK
                                </button>
                            </div>
                            <div class="text-[10px] font-pixel text-slate-400 mt-1" id="net-status-text">
                                CONNECTED (Up to 6 Keepers in Lockstep Co-Op)
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span id="squad-count-badge" class="font-pixel text-xs px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                            SQUAD: 1 / 6
                        </span>
                    </div>
                </div>

                <!-- 6-Player Squad Roster Grid -->
                <div class="space-y-2">
                    <div class="font-pixel text-[11px] text-slate-300 uppercase tracking-wider font-bold">EXPEDITION PARTY ROSTER:</div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="squad-slots-grid">
                        <div class="pixel-panel p-2.5 rounded-lg border-amber-500 bg-amber-950/30 text-xs font-pixel flex items-center gap-2.5 ring-1 ring-amber-500" id="slot-p1">
                            <span class="w-3 h-3 rounded-full bg-amber-400 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-amber-300 font-bold">P1 (HOST / YOU)</div>
                                <div class="text-[10px] text-emerald-400">Ready in Crypt</div>
                            </div>
                        </div>
                        <div class="pixel-panel p-2.5 rounded-lg border-slate-700 bg-slate-900/60 text-xs font-pixel flex items-center gap-2.5" id="slot-p2">
                            <span class="w-3 h-3 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P2 (OPEN)</div>
                                <div class="text-[10px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>
                        <div class="pixel-panel p-2.5 rounded-lg border-slate-700 bg-slate-900/60 text-xs font-pixel flex items-center gap-2.5" id="slot-p3">
                            <span class="w-3 h-3 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P3 (OPEN)</div>
                                <div class="text-[10px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>
                        <div class="pixel-panel p-2.5 rounded-lg border-slate-700 bg-slate-900/60 text-xs font-pixel flex items-center gap-2.5" id="slot-p4">
                            <span class="w-3 h-3 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P4 (OPEN)</div>
                                <div class="text-[10px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>
                        <div class="pixel-panel p-2.5 rounded-lg border-slate-700 bg-slate-900/60 text-xs font-pixel flex items-center gap-2.5" id="slot-p5">
                            <span class="w-3 h-3 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P5 (OPEN)</div>
                                <div class="text-[10px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>
                        <div class="pixel-panel p-2.5 rounded-lg border-slate-700 bg-slate-900/60 text-xs font-pixel flex items-center gap-2.5" id="slot-p6">
                            <span class="w-3 h-3 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P6 (OPEN)</div>
                                <div class="text-[10px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Join Existing Expedition Input -->
                <div class="pixel-panel p-3.5 rounded-xl space-y-2 bg-slate-900/50 border-slate-800">
                    <div class="font-pixel text-[11px] text-slate-300 font-bold">OR ENTER EXISTING SQUAD ROOM CODE:</div>
                    <div class="flex gap-2">
                        <input id="input-coop-code" type="text" placeholder="ENTER ROOM CODE..." class="flex-1 bg-slate-950 border border-slate-700 px-3 py-2.5 rounded-lg font-pixel text-xs text-cyan-300 uppercase tracking-widest outline-none focus:border-cyan-400">
                        <button id="btn-join-session" class="pixel-button-gold px-5 py-2.5 rounded-lg font-pixel text-xs text-amber-100 font-bold shrink-0">
                            🔗 JOIN SQUAD
                        </button>
                    </div>
                </div>

                <!-- Launch or Ready Action Bar -->
                <div class="flex gap-2.5 pt-2">
                    <button id="btn-launch-expedition" class="pixel-button-gold flex-1 py-3.5 rounded-xl font-pixel text-sm text-amber-100 tracking-wider shadow-xl flex items-center justify-center gap-2.5">
                        <span>🚀</span> START EXPEDITION (ENTER DUNGEON)
                    </button>
                    <button id="btn-leave-coop-lobby" class="pixel-button text-slate-300 px-5 py-3.5 rounded-xl font-pixel text-xs hover:text-red-400">
                        ✕ LEAVE
                    </button>
                </div>
            </div>
        </div>
    </div>

    `;

    html = html.substring(0, coopModalStart) + cleanCoopModalHtml + html.substring(rewardedModalStart);
    console.log('Cleaned up Co-Op modal and purged Godot manifest tabs.');
}

// ============================================================================
// 5. CLEAN UP GAMEOVER MODAL (REMOVE GUEST LOOT WARNING)
// ============================================================================
html = html.replace(/<!-- GUEST MODE LOOT CALLOUT -->[\s\S]*?<\/div>\s*<\/div>/, '');
console.log('Purged game-over guest callout.');

// Write intermediate clean HTML
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated HTML structure in index.html!');
