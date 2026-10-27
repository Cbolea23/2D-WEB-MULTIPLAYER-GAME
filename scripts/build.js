import fs from 'fs';
import path from 'path';

const srcPath = path.resolve('fix_ankh_badge_typo.html');
const destPath = path.resolve('index.html');

let html = fs.readFileSync(srcPath, 'utf8');

// 1. Update Game Container style to accommodate bottom ad banner
html = html.replace(
    `#game-container {\n            position: relative;\n            flex: 1;\n            width: 100%;\n            height: calc(100vh - 54px);\n            overflow: hidden;\n            background-color: var(--bg-dark);\n        }`,
    `#game-container {\n            position: relative;\n            flex: 1;\n            width: 100%;\n            height: calc(100vh - 54px - 50px);\n            overflow: hidden;\n            background-color: var(--bg-dark);\n            transition: height 0.2s ease;\n        }\n        #game-container.banner-hidden {\n            height: calc(100vh - 54px);\n        }`
);

// 2. Add HOME and SETTINGS buttons to Top HUD Bar
const topHudButtons = `
            <button id="btn-home" class="pixel-button text-amber-300 font-pixel text-[9px] px-2 py-1.5 rounded hover:border-amber-400" title="Return to Home Screen">
                🏠 HOME
            </button>
            <button id="btn-settings" class="pixel-button text-slate-200 font-pixel text-[9px] px-2 py-1.5 rounded hover:border-slate-300" title="Game Settings">
                ⚙️
            </button>
            <button id="btn-coop" class="pixel-button text-emerald-300 font-pixel text-[9px] px-2 py-1.5 rounded hover:border-emerald-400" title="Multiplayer Co-Op Squad (Up to 6 Players)">
                🌐 CO-OP [6P]
            </button>
`;
html = html.replace(
    `<button id="btn-coop" class="pixel-button text-emerald-300 font-pixel text-[9px] px-2 py-1.5 rounded hover:border-emerald-400" title="Multiplayer Co-Op & Godot Export Engine">\n                🌐 CO-OP\n            </button>`,
    topHudButtons
);

// 3. Add HOME SCREEN and SETTINGS MODAL HTML
const homeScreenAndSettingsHtml = `
    <!-- FULLSCREEN TITLE / HOME SCREEN OVERLAY -->
    <div id="home-screen" class="fixed inset-0 bg-[#05070b]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 select-none">
        <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10 max-w-lg w-full text-center space-y-6">
            <div class="space-y-2">
                <div class="flex items-center justify-center gap-3 mb-1">
                    <span class="text-3xl animate-bounce">⚰️</span>
                    <h1 class="font-pixel text-2xl md:text-4xl text-amber-400 tracking-wider font-black drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
                        CRYPT KEEPER
                    </h1>
                    <span class="text-3xl animate-bounce">⛏️</span>
                </div>
                <div class="font-gothic text-sm md:text-base text-cyan-300 tracking-widest uppercase font-semibold">
                    ROGUE SHOVEL • 6-PLAYER EXPEDITION
                </div>
                <p class="text-[8px] font-pixel text-slate-400 max-w-md mx-auto leading-relaxed pt-1">
                    Unearth tombs, deflect cursed projectile orbs, and delve through procedurally generated catacombs with up to 6 players in lockstep online co-op!
                </p>
            </div>

            <div class="space-y-2.5 max-w-xs mx-auto">
                <button id="btn-home-solo" class="pixel-button-gold w-full py-3 rounded font-pixel text-xs text-amber-200 tracking-wider shadow-lg flex items-center justify-center gap-2">
                    <span>⚔️</span> START SOLO GAME
                </button>
                <button id="btn-home-coop" class="pixel-button-cyan w-full py-3 rounded font-pixel text-xs text-cyan-100 tracking-wider shadow-lg flex items-center justify-center gap-2">
                    <span>🌐</span> CO-OP SQUAD (UP TO 6 PLAYERS)
                </button>
                <div class="grid grid-cols-2 gap-2">
                    <button id="btn-home-settings" class="pixel-button py-2.5 rounded font-pixel text-[9px] text-slate-200 flex items-center justify-center gap-1.5">
                        <span>⚙️</span> SETTINGS
                    </button>
                    <button id="btn-home-codex" class="pixel-button py-2.5 rounded font-pixel text-[9px] text-purple-300 flex items-center justify-center gap-1.5">
                        <span>📜</span> CODEX
                    </button>
                </div>
            </div>

            <div class="pixel-panel p-2.5 rounded flex items-center justify-around text-[8px] font-pixel text-slate-300 max-w-sm mx-auto bg-slate-950/80 border-slate-800">
                <div>🔮 SOULS: <span id="home-souls" class="text-purple-400 font-bold">0</span></div>
                <div>⛏️ WEAPON: <span id="home-weapon" class="text-amber-400 font-bold">IRON SPADE</span></div>
                <div>🏆 BEST DEPTH: <span id="home-depth" class="text-cyan-400 font-bold">DEPTH 1</span></div>
            </div>

            <div class="text-[7px] font-pixel text-slate-500 flex items-center justify-center gap-4">
                <span>VER 1.3.0 • WEB ROGUELIKE</span>
                <span>DESKTOP & MOBILE TOUCH</span>
            </div>
        </div>
    </div>

    <!-- MODAL: GAME SETTINGS -->
    <div id="settings-modal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
        <div class="pixel-panel max-w-md w-full p-5 rounded space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <div class="flex items-center gap-2">
                    <span class="text-xl">⚙️</span>
                    <h2 class="font-pixel text-xs md:text-sm font-black text-amber-400">EXPEDITION SETTINGS</h2>
                </div>
                <button id="close-settings" class="pixel-button text-slate-300 px-2 py-0.5 rounded font-pixel text-[9px]">✕ [ESC]</button>
            </div>

            <div class="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                <div class="pixel-panel p-3 rounded flex items-center justify-between">
                    <div>
                        <div class="font-pixel text-[9px] text-slate-200">MASTER AUDIO</div>
                        <div class="text-[7px] font-pixel text-slate-400">Toggle all sounds & synthesizers</div>
                    </div>
                    <button id="setting-toggle-audio" class="pixel-button-cyan px-3 py-1 rounded font-pixel text-[8px]">
                        🔊 ENABLED
                    </button>
                </div>

                <div class="pixel-panel p-3 rounded space-y-1.5">
                    <div class="flex justify-between items-center">
                        <span class="font-pixel text-[9px] text-cyan-300">🎵 BGM CHIPTUNE SYNTH</span>
                        <span id="setting-bgm-val" class="font-pixel text-[8px] text-cyan-400">70%</span>
                    </div>
                    <input id="setting-slider-bgm" type="range" min="0" max="100" value="70" class="w-full accent-cyan-400 cursor-pointer">
                </div>

                <div class="pixel-panel p-3 rounded space-y-1.5">
                    <div class="flex justify-between items-center">
                        <span class="font-pixel text-[9px] text-amber-300">💥 SOUND EFFECTS (SFX)</span>
                        <span id="setting-sfx-val" class="font-pixel text-[8px] text-amber-400">80%</span>
                    </div>
                    <input id="setting-slider-sfx" type="range" min="0" max="100" value="80" class="w-full accent-amber-400 cursor-pointer">
                </div>

                <div class="pixel-panel p-3 rounded flex items-center justify-between">
                    <div>
                        <div class="font-pixel text-[9px] text-slate-200">SCREEN SHAKE & TRAUMA</div>
                        <div class="text-[7px] font-pixel text-slate-400">Camera impact kick on finishers</div>
                    </div>
                    <button id="setting-toggle-shake" class="pixel-button-gold px-3 py-1 rounded font-pixel text-[8px]">
                        FULL (100%)
                    </button>
                </div>

                <div class="pixel-panel p-3 rounded flex items-center justify-between">
                    <div>
                        <div class="font-pixel text-[9px] text-slate-200">VIRTUAL TOUCH CONTROLS</div>
                        <div class="text-[7px] font-pixel text-slate-400">On-screen analog stick & buttons</div>
                    </div>
                    <button id="setting-toggle-touch" class="pixel-button px-3 py-1 rounded font-pixel text-[8px] text-slate-300">
                        AUTO-DETECT
                    </button>
                </div>

                <div class="pixel-panel p-3 rounded space-y-1.5">
                    <div class="flex justify-between items-center">
                        <span class="font-pixel text-[9px] text-purple-300">📢 AD MONETIZATION MODE</span>
                        <span id="setting-ad-mode-val" class="font-pixel text-[8px] text-purple-400">SIMULATED (TEST)</span>
                    </div>
                    <p class="text-[7px] font-pixel text-slate-400 leading-relaxed">
                        Test ads work on localhost. Switch to Google AdSense, Poki, or CrazyGames when deploying to your public domain!
                    </p>
                </div>
            </div>

            <div class="flex gap-2 pt-1 border-t border-slate-800">
                <button id="btn-save-settings" class="pixel-button-gold w-full py-2 rounded font-pixel text-[9px] text-amber-200 uppercase">
                    ✓ SAVE & CLOSE
                </button>
            </div>
        </div>
    </div>
`;

html = html.replace('<body class="bg-[#05070b] text-slate-100 select-none">', `<body class="bg-[#05070b] text-slate-100 select-none">\n${homeScreenAndSettingsHtml}`);

// 4. Update the Co-Op Modal to display 6 squad player slots
const sixPlayerLobbyHtml = `
            <!-- TAB 1: CO-OP SESSION LOBBY (UP TO 6 PLAYERS) -->
            <div id="tab-content-lobby" class="space-y-3 overflow-y-auto pr-1 flex-1">
                <div class="pixel-panel p-2.5 rounded flex flex-wrap items-center justify-between gap-2 border-cyan-800 bg-cyan-950/20">
                    <div class="flex items-center gap-2">
                        <span id="net-status-dot" class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                        <span id="net-status-text" class="text-[8px] font-pixel text-cyan-200">SERVER: CONNECTING (ws://localhost:3000)...</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <input id="input-server-url" type="text" value="ws://localhost:3000" class="bg-slate-950 border border-slate-700 px-2 py-1 rounded text-cyan-300 font-pixel text-[8px] w-36 outline-none focus:border-cyan-400">
                        <button id="btn-reconnect-server" class="pixel-button-cyan px-2 py-1 rounded font-pixel text-[8px] text-cyan-100">
                            CONNECT
                        </button>
                    </div>
                </div>

                <div class="pixel-panel p-3 rounded space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="font-pixel text-[9px] text-white">EXPEDITION ROOM CODE:</span>
                        <span id="coop-room-code" class="font-pixel text-xs text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-amber-600 tracking-widest font-black">KEEPER-7X9</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <input id="input-coop-code" type="text" placeholder="ENTER 6P ROOM CODE..." class="flex-1 bg-slate-950 border border-slate-700 px-3 py-1.5 rounded font-pixel text-[9px] text-cyan-300 uppercase tracking-widest outline-none focus:border-cyan-400">
                        <button id="btn-join-session" class="pixel-button-gold px-3 py-1.5 rounded font-pixel text-[8px] text-amber-200 shrink-0">
                            🔗 JOIN EXPEDITION
                        </button>
                        <button id="btn-new-code" class="pixel-button px-3 py-1.5 rounded font-pixel text-[8px] text-slate-300 shrink-0">
                            🎲 NEW CODE
                        </button>
                    </div>
                </div>

                <!-- 6-PLAYER SQUAD ROSTER -->
                <div class="pixel-panel p-3 rounded space-y-2">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <div class="font-pixel text-[9px] text-cyan-300 flex items-center gap-1.5">
                            <span>🛡️</span>
                            <span>EXPEDITION SQUAD (MAX 6 PLAYERS)</span>
                        </div>
                        <span id="squad-count-badge" class="font-pixel text-[8px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            1 / 6 KEEPERS
                        </span>
                    </div>

                    <div id="squad-slots-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div id="slot-p1" class="pixel-panel p-2 rounded border-amber-500 bg-amber-950/20 text-[8px] font-pixel flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                            <div>
                                <div class="text-amber-300 font-bold">P1 (HOST/YOU)</div>
                                <div class="text-[7px] text-slate-400">Ready in Crypt</div>
                            </div>
                        </div>
                        <div id="slot-p2" class="pixel-panel p-2 rounded border-slate-800 bg-slate-950/40 text-[8px] font-pixel flex items-center gap-2 opacity-60">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                            <div>
                                <div class="text-cyan-300">P2 KEEPER</div>
                                <div class="text-[7px] text-slate-500">Waiting...</div>
                            </div>
                        </div>
                        <div id="slot-p3" class="pixel-panel p-2 rounded border-slate-800 bg-slate-950/40 text-[8px] font-pixel flex items-center gap-2 opacity-60">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                            <div>
                                <div class="text-emerald-300">P3 KEEPER</div>
                                <div class="text-[7px] text-slate-500">Waiting...</div>
                            </div>
                        </div>
                        <div id="slot-p4" class="pixel-panel p-2 rounded border-slate-800 bg-slate-950/40 text-[8px] font-pixel flex items-center gap-2 opacity-60">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                            <div>
                                <div class="text-purple-300">P4 KEEPER</div>
                                <div class="text-[7px] text-slate-500">Waiting...</div>
                            </div>
                        </div>
                        <div id="slot-p5" class="pixel-panel p-2 rounded border-slate-800 bg-slate-950/40 text-[8px] font-pixel flex items-center gap-2 opacity-60">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                            <div>
                                <div class="text-rose-300">P5 KEEPER</div>
                                <div class="text-[7px] text-slate-500">Waiting...</div>
                            </div>
                        </div>
                        <div id="slot-p6" class="pixel-panel p-2 rounded border-slate-800 bg-slate-950/40 text-[8px] font-pixel flex items-center gap-2 opacity-60">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                            <div>
                                <div class="text-amber-200">P6 KEEPER</div>
                                <div class="text-[7px] text-slate-500">Waiting...</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div class="text-[7px] font-pixel text-slate-400">
                            Solo or small squads can activate an AI companion partner bot:
                        </div>
                        <button id="btn-toggle-coop-bot" class="pixel-button-cyan px-2.5 py-1 rounded font-pixel text-[7px] text-cyan-100">
                            ACTIVATE AI BOT
                        </button>
                    </div>
                </div>

                <div class="pixel-panel p-3 rounded">
                    <div class="font-pixel text-[8px] text-cyan-300 uppercase tracking-wider mb-1.5">⚡ LIVE SQUAD NETWORK SYNC (JSON)</div>
                    <pre id="net-packet-preview" class="bg-slate-950 p-2 rounded text-[7px] font-mono text-emerald-400 overflow-x-auto border border-slate-800 leading-tight max-h-24"></pre>
                </div>
            </div>
`;

html = html.replace(
    /<!-- TAB 1: CO-OP SESSION LOBBY -->[\s\S]*?<!-- TAB 2: GODOT 4 ANTIGRAVITY ENGINE ARCHITECTURE -->/,
    `${sixPlayerLobbyHtml}\n            <!-- TAB 2: GODOT 4 ANTIGRAVITY ENGINE ARCHITECTURE -->`
);

// 5. Add Ad Banner HTML and Rewarded Modal
const adBannerHtml = `
    <!-- BOTTOM AD BANNER BAR -->
    <footer id="ad-banner-container" class="w-full pixel-panel px-3 py-1 flex items-center justify-between gap-3 z-30 border-b-0 border-x-0 rounded-none bg-[#090d16] text-[8px] font-pixel shrink-0 h-[50px] transition-all duration-200">
        <div class="flex items-center gap-2.5 overflow-hidden">
            <span class="text-amber-400 text-sm animate-bounce shrink-0">📢</span>
            <div class="truncate">
                <div id="ad-banner-headline" class="text-amber-300 font-bold tracking-wide truncate">ROGUE AD SPONSOR: UNEARTH LEGENDARY GEAR</div>
                <div id="ad-banner-subtext" class="text-slate-400 text-[7px] truncate">Support Crypt Keeper • Ready for Poki / CrazyGames / Google AdSense</div>
            </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
            <button id="btn-ad-banner-action" class="pixel-button-gold text-amber-200 px-2.5 py-1 rounded text-[8px] hover:border-amber-400">
                VISIT SPONSOR
            </button>
            <button id="btn-toggle-ad-banner" class="pixel-button text-slate-400 px-1.5 py-0.5 rounded text-[8px]" title="Minimize Ad Banner">
                ✕
            </button>
        </div>
    </footer>

    <!-- MODAL: REWARDED AD OVERLAY (VIDEO SIMULATOR / AD SDK HOOK) -->
    <div id="rewarded-ad-modal" class="hidden fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4">
        <div class="pixel-panel-gold max-w-md w-full p-6 text-center rounded space-y-4">
            <div class="flex items-center justify-between border-b border-amber-900 pb-2">
                <div class="flex items-center gap-2">
                    <span class="text-xl">📺</span>
                    <span class="font-pixel text-[10px] text-amber-300 font-bold">SPONSORED REWARD TRANSMISSION</span>
                </div>
                <span id="ad-countdown" class="font-pixel text-[10px] text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-amber-800">5s</span>
            </div>
            
            <div id="ad-video-mockup" class="w-full h-44 bg-slate-950 border-2 border-slate-800 rounded flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div class="text-4xl mb-2 animate-pulse">⚔️ 🛡️ 🔮</div>
                <div id="ad-reward-title" class="font-pixel text-xs text-cyan-300 mb-1">REBIRTH TRANSMISSION</div>
                <p id="ad-reward-desc" class="text-[8px] font-pixel text-slate-400 max-w-xs leading-relaxed">Broadcast in progress... Complete to receive your expedition bonus!</p>
                <div class="w-full bg-slate-900 h-2 rounded mt-4 overflow-hidden border border-slate-700">
                    <div id="ad-progress-bar" class="h-full bg-amber-400 transition-all duration-1000" style="width: 0%;"></div>
                </div>
            </div>

            <div class="flex justify-between items-center text-[7px] font-pixel text-slate-500">
                <span>Poki / CrazyGames / Google AdSense Plug-and-Play</span>
                <button id="btn-skip-ad" class="hidden text-amber-300 underline hover:text-amber-200">CLAIM REWARD</button>
            </div>
        </div>
    </div>
`;
html = html.replace('<!-- MODAL 6: GAME OVER / EXPEDITION SUMMARY -->', `${adBannerHtml}\n    <!-- MODAL 6: GAME OVER / EXPEDITION SUMMARY -->`);

// 6. Add "Watch Ad to Rebirth" button in Game Over modal
const rewardedDeathBtn = `
            <button id="btn-watch-ad-rebirth" class="pixel-button-cyan w-full py-2.5 rounded font-pixel text-[9px] uppercase text-cyan-200 mb-2 flex items-center justify-center gap-1.5 shadow-lg border-cyan-400">
                <span>📺</span> WATCH AD TO REBIRTH (50% HP REVIVE)
            </button>
`;
html = html.replace(
    `<div id="gameover-stats" class="pixel-panel rounded p-3 mb-4 text-[9px] space-y-1.5 text-left font-pixel text-slate-300"></div>`,
    `<div id="gameover-stats" class="pixel-panel rounded p-3 mb-3 text-[9px] space-y-1.5 text-left font-pixel text-slate-300"></div>\n${rewardedDeathBtn}`
);

// 7. Add "Watch Ad for +50 Souls" button in Sanctuary Altar modal
const rewardedAltarBtn = `
                <div class="pixel-panel p-2.5 rounded flex items-center justify-between border-amber-700 bg-amber-950/20">
                    <div>
                        <div class="text-[9px] font-pixel text-amber-300">📺 SPONSOR TRIBUTE: SOUL GRANT</div>
                        <div class="text-[7px] font-pixel text-slate-400">Watch short sponsored clip for +50 instant Soul Shards!</div>
                    </div>
                    <button id="btn-watch-ad-souls" class="pixel-button-gold px-3 py-1.5 rounded font-pixel text-[8px] text-amber-200 shrink-0">
                        +50 SOULS
                    </button>
                </div>
`;
html = html.replace(
    `<div id="altar-blessings" class="space-y-2 mb-4"></div>`,
    `<div id="altar-blessings" class="space-y-2 mb-3"></div>\n${rewardedAltarBtn}`
);

// 8. Enhance coopPartner state object with squad array for up to 6 players
html = html.replace(
    `let coopPartner = {`,
    `const SQUAD_COLORS = {
            1: '#f59e0b', // P1 Host: Gold
            2: '#22d3ee', // P2: Cyan
            3: '#34d399', // P3: Emerald
            4: '#c084fc', // P4: Purple
            5: '#fb7185', // P5: Rose
            6: '#fbbf24'  // P6: Amber
        };
        const squadPeers = new Map(); // peerId -> squadMember

        let coopPartner = {\n            isRemotePlayer: false,\n            targetX: ROOM_W / 2 - 40,\n            targetY: ROOM_H / 2 + 70,\n            targetAngle: 0,\n            targetFacing: 1,\n            comboStep: 0,\n            playerIndex: 2,`
);

// 9. Fix updateCoopPartner so that when isRemotePlayer is true, AI logic is completely disabled to eliminate shaking!
const updateCoopPartnerPatch = `        function updateCoopPartner(dt) {
            if (!coopPartner.active) return;
            const p = coopPartner;

            if (p.isDowned) {
                if (Math.hypot(player.x - p.x, player.y - p.y) < 70) {
                    p.reviveTimer += dt;
                    if (p.reviveTimer >= 2.0) {
                        p.isDowned = false;
                        p.hp = Math.round(p.maxHp * 0.5);
                        p.reviveTimer = 0;
                        sfx.play('levelup');
                        addParticles(p.x, p.y, '#34d399', 24, 180, 5);
                        addFloatingText(p.x, p.y - 25, "✨ KEEPER REVIVED!", "#34d399", 16);
                        if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {
                            MultiplayerManager.sendAction('revived');
                        }
                    }
                } else {
                    p.reviveTimer = Math.max(0, p.reviveTimer - dt * 0.5);
                }
                return;
            }

            // SMOOTH NETWORK INTERPOLATION FOR REMOTE HUMAN PLAYER (NO AI SHAKING!)
            if (p.isRemotePlayer) {
                const lerpFactor = Math.min(1.0, dt * 18);
                p.x += (p.targetX - p.x) * lerpFactor;
                p.y += (p.targetY - p.y) * lerpFactor;
                p.angle = p.targetAngle !== undefined ? p.targetAngle : p.angle;
                p.facing = p.targetFacing !== undefined ? p.targetFacing : p.facing;

                if (Math.hypot(p.targetX - p.x, p.targetY - p.y) > 2) {
                    p.animTimer += dt;
                    if (p.animTimer >= 0.14) {
                        p.animTimer = 0;
                        p.animFrame = (p.animFrame + 1) % 2;
                    }
                }

                if (p.swingTimer > 0) p.swingTimer = Math.max(0, p.swingTimer - dt);
                if (p.attackCd > 0) p.attackCd = Math.max(0, p.attackCd - dt);
                if (p.dashTimer > 0) p.dashTimer = Math.max(0, p.dashTimer - dt);
                return;
            }`;
html = html.replace(
    /function updateCoopPartner\(dt\) \{[\s\S]*?if \(p\.isDowned\) \{[\s\S]*?return;\s*\}/,
    updateCoopPartnerPatch
);

// 10. Add Seeded Pseudo-Random Number Generator for Dungeon Floors
const prngCode = `
        // Deterministic Pseudo-Random Generator for Synchronized Procedural Stages
        let _seedRngVal = 1234567;
        function seedDungeonRng(s) { _seedRngVal = (s >>> 0) || 1234567; }
        function seededRandom() {
            let t = _seedRngVal += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        }
        function dRand() {
            if (game.multiplayerSeed) return seededRandom();
            return Math.random();
        }
`;
html = html.replace('function generateDungeonFloor(depth) {', `${prngCode}\n        function generateDungeonFloor(depth) {\n            seedDungeonRng((game.multiplayerSeed || 1337) + depth * 7919);`);

// Replace Math.random inside generateDungeonFloor room layout loop
html = html.replace(
    `const base = visited[Math.floor(Math.random() * visited.length)];\n                const d = dirs[Math.floor(Math.random() * dirs.length)];`,
    `const base = visited[Math.floor(dRand() * visited.length)];\n                const d = dirs[Math.floor(dRand() * dirs.length)];`
);

// 11. Sync attack swings in performAttack
html = html.replace(
    `player.swingDuration = (isFinisher ? 0.25 : 0.18) / wep.speedMult;\n            player.swingTimer = player.swingDuration;`,
    `player.swingDuration = (isFinisher ? 0.25 : 0.18) / wep.speedMult;\n            player.swingTimer = player.swingDuration;\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                MultiplayerManager.sendAction('swing', {\n                    angle: +(player.angle.toFixed(3)),\n                    facing: player.facing,\n                    comboStep: player.comboStep,\n                    weaponId: player.weapon.id,\n                    x: Math.round(player.x),\n                    y: Math.round(player.y)\n                });\n            }`
);

// 12. Sync weapon changes in Arsenal modal
html = html.replace(
    `player.weapon = w;\n                    metaSave.selectedWeapon = w.id;`,
    `player.weapon = w;\n                    metaSave.selectedWeapon = w.id;\n                    if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                        MultiplayerManager.sendAction('change_weapon', { weaponId: w.id });\n                    }`
);

// 13. Sync room changes in changeRoom(dir)
html = html.replace(
    `enterRoom(targetX, targetY, dir);\n            return true;`,
    `enterRoom(targetX, targetY, dir);\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                MultiplayerManager.sendRoomTransition(targetX, targetY, dir, game.depth);\n            }\n            return true;`
);

// 14. Sync floor portal transitions
html = html.replace(
    `game.depth++;\n                generateDungeonFloor(game.depth);`,
    `game.depth++;\n                generateDungeonFloor(game.depth);\n                if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                    MultiplayerManager.sendRoomTransition(2, 2, null, game.depth);\n                }`
);

// 15. Sync Context Action (Dig Mounds, Open Chests) across network
html = html.replace(
    `function triggerContextAction() {`,
    `function triggerContextAction() {\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                MultiplayerManager.sendAction('interact', { x: Math.round(player.x), y: Math.round(player.y) });\n            }`
);

// 16. Reusable Weapon and Attack Slash Renderer
const weaponRendererCode = `
        function renderCharacterWeapon(ctx, entity, isPlayer = false) {
            const wep = entity.weapon || WEAPON_ARSENAL.rusty_spade;
            const comboStep = entity.comboStep || 0;
            const isFinisher = comboStep === 0;

            if (entity.swingTimer > 0) {
                const dur = entity.swingDuration || (0.2 / (wep.speedMult || 1));
                const prog = 1 - (entity.swingTimer / dur);
                const dir = comboStep % 2 === 0 ? 1 : -1;
                const startA = entity.angle - 1.35 * dir;
                const endA = entity.angle + 1.35 * dir;
                const curA = startA + (endA - startA) * prog;
                const reach = (wep.reach || 42) * (isFinisher ? 1.15 : 1.0);

                // Swing Arc Trail
                ctx.strokeStyle = wep.trailColor || '#fbbf24';
                ctx.lineWidth = isFinisher ? 9 : 6;
                ctx.beginPath();
                ctx.arc(0, 0, reach - 8, Math.min(startA, curA), Math.max(startA, curA));
                ctx.stroke();

                if (wep.id === 'twin_trowels') {
                    ctx.strokeStyle = '#67e8f9';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(0, 0, reach - 18, Math.max(startA, curA), Math.min(startA, curA));
                    ctx.stroke();
                }

                ctx.save();
                ctx.rotate(curA);
                drawWeaponBladeGraphic(ctx, wep, reach);
                ctx.restore();
            } else {
                // Idle Held Weapon Stance
                ctx.save();
                ctx.rotate((entity.angle || 0) + 0.38);
                drawWeaponIdleGraphic(ctx, wep);
                ctx.restore();
            }
        }

        function drawWeaponBladeGraphic(ctx, wep, reach) {
            if (wep.id === 'rusty_spade') {
                ctx.fillStyle = '#78350f';
                ctx.fillRect(8, -3, reach - 22, 6);
                ctx.fillStyle = '#cbd5e1';
                ctx.fillRect(reach - 18, -10, 16, 20);
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(reach - 10, -8, 6, 16);
            } else if (wep.id === 'great_shovel') {
                ctx.fillStyle = '#1e1b4b';
                ctx.fillRect(8, -4, reach - 26, 8);
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(reach - 26, -14, 24, 28);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(reach - 20, -11, 14, 22);
                ctx.fillStyle = '#fca5a5';
                ctx.fillRect(reach - 4, -12, 4, 6);
                ctx.fillRect(reach - 4, 6, 4, 6);
            } else if (wep.id === 'twin_trowels') {
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(6, -8, reach - 20, 4);
                ctx.fillRect(6, 4, reach - 20, 4);
                ctx.fillStyle = '#22d3ee';
                ctx.fillRect(reach - 16, -11, 14, 10);
                ctx.fillRect(reach - 16, 1, 14, 10);
            } else if (wep.id === 'soulreaper_scythe') {
                ctx.fillStyle = '#3b0764';
                ctx.fillRect(8, -3, reach - 16, 6);
                ctx.strokeStyle = '#c084fc';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(reach - 16, 12, 28, -Math.PI * 0.7, Math.PI * 0.3);
                ctx.stroke();
                ctx.fillStyle = '#e879f9';
                ctx.fillRect(reach - 18, -8, 8, 16);
            } else if (wep.id === 'lantern_flail') {
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(8, 0);
                ctx.lineTo(reach - 16, 0);
                ctx.stroke();
                ctx.fillStyle = '#d97706';
                ctx.fillRect(reach - 16, -9, 14, 18);
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(reach - 13, -6, 8, 12);
            }
        }

        function drawWeaponIdleGraphic(ctx, wep) {
            if (wep.id === 'rusty_spade') {
                ctx.fillStyle = '#78350f';
                ctx.fillRect(8, -2, 24, 5);
                ctx.fillStyle = '#cbd5e1';
                ctx.fillRect(30, -7, 12, 15);
            } else if (wep.id === 'great_shovel') {
                ctx.fillStyle = '#1e1b4b';
                ctx.fillRect(8, -3, 30, 7);
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(36, -12, 18, 24);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(40, -9, 10, 18);
            } else if (wep.id === 'twin_trowels') {
                ctx.fillStyle = '#22d3ee';
                ctx.fillRect(10, -8, 16, 6);
                ctx.fillRect(10, 3, 16, 6);
            } else if (wep.id === 'soulreaper_scythe') {
                ctx.fillStyle = '#3b0764';
                ctx.fillRect(8, -2, 26, 5);
                ctx.strokeStyle = '#c084fc';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(32, 10, 20, -Math.PI * 0.6, Math.PI * 0.2);
                ctx.stroke();
            } else if (wep.id === 'lantern_flail') {
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(8, 0);
                ctx.lineTo(24, 8);
                ctx.stroke();
                ctx.fillStyle = '#d97706';
                ctx.fillRect(24, 4, 12, 14);
            }
        }
`;

html = html.replace(
    /const wep = player\.weapon \|\| WEAPON_ARSENAL\.rusty_spade;[\s\S]*?ctx\.fillRect\(24, 4, 12, 14\);\s*\}\s*ctx\.restore\(\);\s*\}/,
    `renderCharacterWeapon(ctx, player, true);`
);

const renderSquadCode = `
            // Render Co-Op Squad Keepers (Up to 6 Players)
            const squadToRender = squadPeers.size > 0 ? Array.from(squadPeers.values()) : (coopPartner.active ? [coopPartner] : []);
            for (const sp of squadToRender) {
                ctx.save();
                ctx.translate(Math.round(sp.x), Math.round(sp.y));
                ctx.scale(sp.facing || 1, 1);
                
                const pColor = SQUAD_COLORS[sp.playerIndex || 2] || '#34d399';
                ctx.strokeStyle = sp.isDowned ? '#ef4444' : pColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 8, 16, 0, Math.PI * 2);
                ctx.stroke();

                const cpSpr = atlas.sprites['player_0'];
                if (cpSpr) {
                    if (sp.isDowned) {
                        ctx.save();
                        ctx.rotate(Math.PI / 2);
                        ctx.drawImage(cpSpr, Math.round(-cpSpr.width / 2), Math.round(-cpSpr.height / 2));
                        ctx.restore();
                        ctx.font = '800 8px Inter';
                        ctx.textAlign = 'center';
                        ctx.fillStyle = '#f87171';
                        ctx.fillText('REVIVE [E]', 0, -22);
                    } else {
                        ctx.drawImage(cpSpr, Math.round(-cpSpr.width / 2), Math.round(-cpSpr.height / 2));
                        renderCharacterWeapon(ctx, sp, false);
                        ctx.font = '800 8px Inter';
                        ctx.textAlign = 'center';
                        ctx.fillStyle = pColor;
                        ctx.fillText(\`P\${sp.playerIndex || 2} SQUAD\`, 0, -22);
                    }
                }
                ctx.restore();
            }
`;

html = html.replace(
    /if \(coopPartner\.active\) \{[\s\S]*?ctx\.fillText\('P2 CO-OP', 0, -22\);\s*\}\s*\}\s*ctx\.restore\(\);\s*\}/,
    renderSquadCode
);

html = html.replace('function render() {', `${weaponRendererCode}\n        function render() {`);

// 17. Host-Authoritative Simulation & Lockstep Snapshot Syncing
const hostSnapshotSyncCode = `
        // Authoritative Host Snapshot Generator
        function sendHostWorldSnapshot() {
            if (!MultiplayerManager.isConnected || !MultiplayerManager.isHost || !MultiplayerManager.roomCode) return;
            const r = currentRoom();
            if (!r) return;

            const snapshot = {
                curX: game.curX,
                curY: game.curY,
                depth: game.depth,
                roomCleared: !!r.cleared,
                portalActive: !!r.portalActive,
                enemies: enemies.map((e, idx) => ({
                    id: e.id || idx,
                    type: e.type,
                    x: Math.round(e.x),
                    y: Math.round(e.y),
                    hp: Math.round(e.hp),
                    maxHp: e.maxHp,
                    vx: Math.round(e.vx || 0),
                    vy: Math.round(e.vy || 0),
                    facing: e.facing || 1,
                    flash: e.flash > 0,
                    burrowed: !!e.burrowed,
                    isElite: !!e.isElite,
                    isBoss: !!e.isBoss,
                    animFrame: e.animFrame || 0
                })),
                projectiles: projectiles.map(p => ({
                    x: Math.round(p.x),
                    y: Math.round(p.y),
                    vx: Math.round(p.vx),
                    vy: Math.round(p.vy),
                    radius: p.radius,
                    color: p.color,
                    isHostile: p.isHostile
                })),
                drops: drops.map((d, idx) => ({
                    id: idx,
                    x: Math.round(d.x),
                    y: Math.round(d.y),
                    type: d.type,
                    value: d.value
                })),
                mounds: (r.mounds || []).map(m => ({
                    x: Math.round(m.x),
                    y: Math.round(m.y),
                    hp: m.hp,
                    maxHp: m.maxHp,
                    rich: !!m.rich
                })),
                pits: (r.pits || []).map(p => ({
                    x: Math.round(p.x),
                    y: Math.round(p.y),
                    radius: p.radius
                })),
                chests: (r.chests || []).map(c => ({
                    x: Math.round(c.x),
                    y: Math.round(c.y),
                    opened: !!c.opened
                }))
            };

            MultiplayerManager.ws.send(JSON.stringify({
                type: 'sync_world_snapshot',
                snapshot
            }));
        }
`;

// Insert sendHostWorldSnapshot before update()
html = html.replace('function update(dt) {', `${hostSnapshotSyncCode}\n        function update(dt) {`);

// Call sendHostWorldSnapshot inside update loop
html = html.replace(
    'updateNetworkPacketPreview();',
    'updateNetworkPacketPreview();\n            if (MultiplayerManager.isHost) sendHostWorldSnapshot();'
);

// Disable local AI enemies pursuit when connected as peer
html = html.replace(
    'for (let i = enemies.length - 1; i >= 0; i--) {',
    'if (MultiplayerManager.isConnected && !MultiplayerManager.isHost) {\n                // Remote clients smoothly lerp authoritative enemies from host snapshot\n                for (const e of enemies) {\n                    if (e.targetX !== undefined) {\n                        e.x += (e.targetX - e.x) * 0.45;\n                        e.y += (e.targetY - e.y) * 0.45;\n                    }\n                }\n            } else for (let i = enemies.length - 1; i >= 0; i--) {'
);

// 18. Settings Manager & Home Screen Controller
const homeAndSettingsJS = `
        /**
         * ============================================================================
         * 14. SETTINGS ENGINE & HOME SCREEN MANAGER
         * ============================================================================
         */
        const SettingsManager = {
            settings: {
                audioEnabled: true,
                bgmVolume: 70,
                sfxVolume: 80,
                screenShake: 100,
                touchControls: 'auto',
                adMode: 'simulated'
            },

            init() {
                this.load();
                this.bindUI();
                this.updateHomeScreenMeta();
            },

            load() {
                try {
                    const saved = localStorage.getItem('crypt_keeper_settings');
                    if (saved) {
                        this.settings = Object.assign(this.settings, JSON.parse(saved));
                    }
                } catch (e) {}
                this.apply();
            },

            save() {
                try {
                    localStorage.setItem('crypt_keeper_settings', JSON.stringify(this.settings));
                } catch (e) {}
                this.apply();
            },

            apply() {
                game.shakeMultiplier = this.settings.screenShake / 100;
                if (typeof sfx !== 'undefined') {
                    sfx.muted = !this.settings.audioEnabled;
                    sfx.bgmVolume = (this.settings.bgmVolume / 100);
                    sfx.sfxVolume = (this.settings.sfxVolume / 100);
                }
                const mobControls = document.getElementById('mobile-controls');
                if (mobControls) {
                    if (this.settings.touchControls === 'always') mobControls.classList.remove('hidden');
                    else if (this.settings.touchControls === 'hidden') mobControls.classList.add('hidden');
                }
            },

            bindUI() {
                const btnHomeSolo = document.getElementById('btn-home-solo');
                if (btnHomeSolo) {
                    btnHomeSolo.addEventListener('click', () => {
                        document.getElementById('home-screen').classList.add('hidden');
                        sfx.init();
                        sfx.play('levelup');
                        game.paused = false;
                        game.running = true;
                    });
                }

                const btnHomeCoop = document.getElementById('btn-home-coop');
                if (btnHomeCoop) {
                    btnHomeCoop.addEventListener('click', () => {
                        document.getElementById('home-screen').classList.add('hidden');
                        sfx.init();
                        document.getElementById('coop-modal').classList.remove('hidden');
                        game.paused = true;
                    });
                }

                const btnHomeSettings = document.getElementById('btn-home-settings');
                const btnTopSettings = document.getElementById('btn-settings');
                if (btnHomeSettings) btnHomeSettings.addEventListener('click', () => this.openModal());
                if (btnTopSettings) btnTopSettings.addEventListener('click', () => this.openModal());

                const btnHomeCodex = document.getElementById('btn-home-codex');
                if (btnHomeCodex) {
                    btnHomeCodex.addEventListener('click', () => {
                        document.getElementById('codex-modal').classList.remove('hidden');
                    });
                }

                const btnTopHome = document.getElementById('btn-home');
                if (btnTopHome) {
                    btnTopHome.addEventListener('click', () => {
                        document.getElementById('home-screen').classList.remove('hidden');
                        this.updateHomeScreenMeta();
                    });
                }

                const closeSettings = document.getElementById('close-settings');
                const btnSaveSettings = document.getElementById('btn-save-settings');
                if (closeSettings) closeSettings.addEventListener('click', () => this.closeModal());
                if (btnSaveSettings) btnSaveSettings.addEventListener('click', () => this.closeModal());

                const toggleAudio = document.getElementById('setting-toggle-audio');
                if (toggleAudio) {
                    toggleAudio.addEventListener('click', () => {
                        this.settings.audioEnabled = !this.settings.audioEnabled;
                        toggleAudio.textContent = this.settings.audioEnabled ? '🔊 ENABLED' : '🔇 MUTED';
                        toggleAudio.className = this.settings.audioEnabled ? 'pixel-button-cyan px-3 py-1 rounded font-pixel text-[8px]' : 'pixel-button px-3 py-1 rounded font-pixel text-[8px] text-red-400';
                    });
                }

                const sliderBgm = document.getElementById('setting-slider-bgm');
                const valBgm = document.getElementById('setting-bgm-val');
                if (sliderBgm) {
                    sliderBgm.addEventListener('input', (e) => {
                        this.settings.bgmVolume = parseInt(e.target.value);
                        if (valBgm) valBgm.textContent = this.settings.bgmVolume + '%';
                    });
                }

                const sliderSfx = document.getElementById('setting-slider-sfx');
                const valSfx = document.getElementById('setting-sfx-val');
                if (sliderSfx) {
                    sliderSfx.addEventListener('input', (e) => {
                        this.settings.sfxVolume = parseInt(e.target.value);
                        if (valSfx) valSfx.textContent = this.settings.sfxVolume + '%';
                    });
                }

                const toggleShake = document.getElementById('setting-toggle-shake');
                if (toggleShake) {
                    toggleShake.addEventListener('click', () => {
                        if (this.settings.screenShake === 100) this.settings.screenShake = 40;
                        else if (this.settings.screenShake === 40) this.settings.screenShake = 0;
                        else this.settings.screenShake = 100;
                        toggleShake.textContent = this.settings.screenShake === 100 ? 'FULL (100%)' : (this.settings.screenShake === 40 ? 'REDUCED (40%)' : 'OFF (0%)');
                    });
                }

                const toggleTouch = document.getElementById('setting-toggle-touch');
                if (toggleTouch) {
                    toggleTouch.addEventListener('click', () => {
                        if (this.settings.touchControls === 'auto') this.settings.touchControls = 'always';
                        else if (this.settings.touchControls === 'always') this.settings.touchControls = 'hidden';
                        else this.settings.touchControls = 'auto';
                        toggleTouch.textContent = this.settings.touchControls.toUpperCase();
                    });
                }
            },

            openModal() {
                const modal = document.getElementById('settings-modal');
                if (modal) modal.classList.remove('hidden');
                const toggleAudio = document.getElementById('setting-toggle-audio');
                if (toggleAudio) {
                    toggleAudio.textContent = this.settings.audioEnabled ? '🔊 ENABLED' : '🔇 MUTED';
                    toggleAudio.className = this.settings.audioEnabled ? 'pixel-button-cyan px-3 py-1 rounded font-pixel text-[8px]' : 'pixel-button px-3 py-1 rounded font-pixel text-[8px] text-red-400';
                }
                const sliderBgm = document.getElementById('setting-slider-bgm');
                const valBgm = document.getElementById('setting-bgm-val');
                if (sliderBgm && valBgm) {
                    sliderBgm.value = this.settings.bgmVolume;
                    valBgm.textContent = this.settings.bgmVolume + '%';
                }
                const sliderSfx = document.getElementById('setting-slider-sfx');
                const valSfx = document.getElementById('setting-sfx-val');
                if (sliderSfx && valSfx) {
                    sliderSfx.value = this.settings.sfxVolume;
                    valSfx.textContent = this.settings.sfxVolume + '%';
                }
            },

            closeModal() {
                this.save();
                const modal = document.getElementById('settings-modal');
                if (modal) modal.classList.add('hidden');
            },

            updateHomeScreenMeta() {
                const s = document.getElementById('home-souls');
                const w = document.getElementById('home-weapon');
                const d = document.getElementById('home-depth');
                if (s) s.textContent = player.souls || metaSave.souls || 0;
                if (w) w.textContent = (player.weapon ? player.weapon.name : 'IRON SPADE').toUpperCase();
                if (d) d.textContent = 'DEPTH ' + (metaSave.bestDepth || 1);
            }
        };
`;

// 19. 6-Player Multiplayer Engine with World Snapshot Reconciliation
const jsModules = `
        /**
         * ============================================================================
         * 12. WEB MONETIZATION & AD ENGINE (AdManager)
         * ============================================================================
         */
        const AdManager = {
            config: {
                mode: 'simulated',
                bannerEnabled: true,
                bannerVisible: true,
                adsenseClientId: 'ca-pub-XXXXXXXXXXXXXXXX',
                adsenseBannerSlot: '1234567890',
                interstitialCooldownSec: 120,
                lastInterstitialTime: 0,
                rewardedClaimsThisRun: 0
            },

            bannerAds: [
                { title: "⚔️ ROGUE DUNGEON CRAWLER", sub: "Forge your legend with epic pixel-art artifacts! Play now." },
                { title: "🛡️ MYTHIC SHIELDS & BLADES", sub: "Deflect enemy projectile orbs with timing precision!" },
                { title: "🔮 CRYPT KEEPER MERCH STORE", sub: "Grab the official Shovel Knight pin & Grave Altar desk mat." },
                { title: "🌐 HOST YOUR MULTIPLAYER EXPEDITIONS", sub: "Low-latency WebSocket servers ready for co-op crawler squads." }
            ],

            init() {
                const btnAction = document.getElementById('btn-ad-banner-action');
                if (btnAction) {
                    btnAction.addEventListener('click', () => {
                        window.open('https://github.com', '_blank');
                    });
                }

                const btnToggle = document.getElementById('btn-toggle-ad-banner');
                if (btnToggle) {
                    btnToggle.addEventListener('click', () => {
                        this.toggleBanner();
                    });
                }

                const btnAdRebirth = document.getElementById('btn-watch-ad-rebirth');
                if (btnAdRebirth) {
                    btnAdRebirth.addEventListener('click', () => {
                        this.showRewarded('rebirth', 'ANKH OF REBIRTH BROADCAST', 'Complete sponsored broadcast to cheat death & revive with 50% HP!', () => {
                            this.revivePlayerFromAd();
                        });
                    });
                }

                const btnAdSouls = document.getElementById('btn-watch-ad-souls');
                if (btnAdSouls) {
                    btnAdSouls.addEventListener('click', () => {
                        this.showRewarded('souls', 'ANCIENT SOUL HARVEST', 'Complete broadcast to receive +50 persistent Soul Shards!', () => {
                            player.souls += 50;
                            metaSave.souls += 50;
                            saveMeta();
                            updateHUD();
                            sfx.play('coin');
                            addParticles(player.x, player.y, '#c084fc', 30, 200, 5);
                            addFloatingText(player.x, player.y - 25, "🔮 +50 SOULS GRANTED!", "#c084fc", 16);
                            btnAdSouls.disabled = true;
                            btnAdSouls.classList.add('opacity-50');
                            btnAdSouls.textContent = 'CLAIMED';
                        });
                    });
                }

                setInterval(() => {
                    this.rotateBanner();
                }, 20000);
            },

            rotateBanner() {
                if (this.config.mode !== 'simulated') return;
                const ad = this.bannerAds[Math.floor(Math.random() * this.bannerAds.length)];
                const h = document.getElementById('ad-banner-headline');
                const s = document.getElementById('ad-banner-subtext');
                if (h) h.textContent = ad.title;
                if (s) s.textContent = ad.sub;
            },

            toggleBanner() {
                this.config.bannerVisible = !this.config.bannerVisible;
                const banner = document.getElementById('ad-banner-container');
                const container = document.getElementById('game-container');
                if (banner && container) {
                    if (this.config.bannerVisible) {
                        banner.classList.remove('hidden');
                        container.classList.remove('banner-hidden');
                    } else {
                        banner.classList.add('hidden');
                        container.classList.add('banner-hidden');
                    }
                    resizeCanvas();
                }
            },

            showRewarded(rewardType, title, desc, onRewardSuccess) {
                const modal = document.getElementById('rewarded-ad-modal');
                const titleEl = document.getElementById('ad-reward-title');
                const descEl = document.getElementById('ad-reward-desc');
                const countdownEl = document.getElementById('ad-countdown');
                const progressBar = document.getElementById('ad-progress-bar');
                const skipBtn = document.getElementById('btn-skip-ad');

                if (titleEl) titleEl.textContent = title;
                if (descEl) descEl.textContent = desc;
                if (progressBar) progressBar.style.width = '0%';
                if (skipBtn) skipBtn.classList.add('hidden');

                if (this.config.mode === 'poki' && window.PokiSDK) {
                    window.PokiSDK.rewardedBreak().then((success) => {
                        if (success && onRewardSuccess) onRewardSuccess();
                    });
                    return;
                }

                if (this.config.mode === 'crazygames' && window.CrazyGames && window.CrazyGames.SDK) {
                    window.CrazyGames.SDK.ad.requestAd("rewarded", {
                        adFinished: () => { if (onRewardSuccess) onRewardSuccess(); },
                        adError: () => { if (onRewardSuccess) onRewardSuccess(); }
                    });
                    return;
                }

                if (modal) modal.classList.remove('hidden');
                let timeLeft = 5;
                if (countdownEl) countdownEl.textContent = timeLeft + 's';
                if (progressBar) progressBar.style.width = '10%';

                const timer = setInterval(() => {
                    timeLeft--;
                    if (countdownEl) countdownEl.textContent = timeLeft + 's';
                    if (progressBar) progressBar.style.width = ((5 - timeLeft) / 5 * 100) + '%';

                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        if (modal) modal.classList.add('hidden');
                        sfx.play('levelup');
                        this.config.rewardedClaimsThisRun++;
                        if (onRewardSuccess) onRewardSuccess();
                    }
                }, 1000);
            },

            showInterstitial(reason) {
                const now = Date.now() / 1000;
                if (now - this.config.lastInterstitialTime < this.config.interstitialCooldownSec) return;
                this.config.lastInterstitialTime = now;

                if (this.config.mode === 'poki' && window.PokiSDK) {
                    window.PokiSDK.commercialBreak();
                } else if (this.config.mode === 'crazygames' && window.CrazyGames && window.CrazyGames.SDK) {
                    window.CrazyGames.SDK.ad.requestAd("midgame");
                }
            },

            revivePlayerFromAd() {
                document.getElementById('gameover-modal').classList.add('hidden');
                player.hp = Math.round(player.maxHp * 0.5);
                game.running = true;
                game.paused = false;
                sfx.play('levelup');
                addParticles(player.x, player.y, '#22d3ee', 40, 220, 6);
                addFloatingText(player.x, player.y - 30, "☥ REBIRTH GRANTED!", "#22d3ee", 18);
                updateHUD();
            }
        };

        /**
         * ============================================================================
         * 13. REAL-TIME 6-PLAYER MULTIPLAYER NETWORKING ENGINE (MultiplayerManager)
         * ============================================================================
         */
        const MultiplayerManager = {
            ws: null,
            isConnected: false,
            isHost: false,
            roomCode: '',
            syncInterval: null,
            lastPing: 0,
            latencyMs: 0,
            playerIndex: 1,

            init() {
                const defaultUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + (window.location.host || 'localhost:3000');
                const urlInput = document.getElementById('input-server-url');
                if (urlInput) urlInput.value = defaultUrl;

                const btnConnect = document.getElementById('btn-reconnect-server');
                if (btnConnect) {
                    btnConnect.addEventListener('click', () => {
                        const targetUrl = (document.getElementById('input-server-url').value || '').trim() || defaultUrl;
                        this.connect(targetUrl);
                    });
                }

                const btnNewCode = document.getElementById('btn-new-code');
                if (btnNewCode) {
                    btnNewCode.addEventListener('click', () => {
                        this.createRoom();
                    });
                }

                const btnJoin = document.getElementById('btn-join-session');
                if (btnJoin) {
                    btnJoin.addEventListener('click', () => {
                        const code = (document.getElementById('input-coop-code').value || '').trim().toUpperCase();
                        if (code) this.joinRoom(code);
                    });
                }

                setTimeout(() => {
                    this.connect(defaultUrl);
                }, 400);
            },

            connect(url) {
                if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
                    this.ws.close();
                }

                this.updateNetUI('connecting', \`Connecting to \${url}...\`);
                try {
                    this.ws = new WebSocket(url);
                } catch (err) {
                    this.updateNetUI('offline', 'OFFLINE (Solo/AI mode)');
                    return;
                }

                this.ws.onopen = () => {
                    this.isConnected = true;
                    this.updateNetUI('online', \`CONNECTED (\${url})\`);
                    this.lastPing = Date.now();
                    this.ws.send(JSON.stringify({ type: 'ping', t: this.lastPing }));
                    this.startSyncLoop();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        this.handleMessage(msg);
                    } catch (e) {
                        console.error('WS parse error:', e);
                    }
                };

                this.ws.onclose = () => {
                    this.isConnected = false;
                    coopPartner.isRemotePlayer = false;
                    squadPeers.clear();
                    this.updateSquadUI();
                    this.updateNetUI('offline', 'OFFLINE (Solo/AI mode)');
                    if (this.syncInterval) clearInterval(this.syncInterval);
                };

                this.ws.onerror = () => {
                    this.isConnected = false;
                    coopPartner.isRemotePlayer = false;
                    this.updateNetUI('offline', 'OFFLINE (Solo/AI mode)');
                };
            },

            updateNetUI(status, label) {
                const dot = document.getElementById('net-status-dot');
                const text = document.getElementById('net-status-text');
                if (!dot || !text) return;

                if (status === 'online') {
                    dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse';
                    text.className = 'text-[8px] font-pixel text-emerald-300';
                    text.textContent = \`SERVER: \${label} \${this.latencyMs ? '(' + this.latencyMs + 'ms)' : ''}\`;
                } else if (status === 'connecting') {
                    dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse';
                    text.className = 'text-[8px] font-pixel text-amber-300';
                    text.textContent = \`SERVER: \${label}\`;
                } else {
                    dot.className = 'w-2.5 h-2.5 rounded-full bg-red-500 inline-block';
                    text.className = 'text-[8px] font-pixel text-slate-400';
                    text.textContent = \`SERVER: \${label}\`;
                }
            },

            updateSquadUI() {
                const countBadge = document.getElementById('squad-count-badge');
                const total = 1 + squadPeers.size;
                if (countBadge) countBadge.textContent = \`\${total} / 6 KEEPERS\`;

                for (let i = 2; i <= 6; i++) {
                    const slot = document.getElementById('slot-p' + i);
                    if (!slot) continue;
                    let member = null;
                    for (const m of squadPeers.values()) {
                        if (m.playerIndex === i) { member = m; break; }
                    }
                    if (member) {
                        slot.className = 'pixel-panel p-2 rounded border-cyan-500 bg-cyan-950/30 text-[8px] font-pixel flex items-center gap-2';
                        slot.innerHTML = \`<span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span><div><div class="text-cyan-300 font-bold">P\${i} KEEPER</div><div class="text-[7px] text-emerald-400">In Crypt Sector</div></div>\`;
                    } else {
                        slot.className = 'pixel-panel p-2 rounded border-slate-800 bg-slate-950/40 text-[8px] font-pixel flex items-center gap-2 opacity-50';
                        slot.innerHTML = \`<span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span><div><div class="text-slate-400">P\${i} KEEPER</div><div class="text-[7px] text-slate-600">Waiting...</div></div>\`;
                    }
                }
            },

            createRoom() {
                if (!this.isConnected) {
                    game.multiplayer.roomCode = 'KEEPER-' + Math.random().toString(36).substring(2, 5).toUpperCase();
                    document.getElementById('coop-room-code').textContent = game.multiplayer.roomCode;
                    sfx.play('coin');
                    return;
                }
                this.ws.send(JSON.stringify({ type: 'create_room' }));
            },

            joinRoom(code) {
                if (!this.isConnected) {
                    game.multiplayer.roomCode = code;
                    document.getElementById('coop-room-code').textContent = code;
                    coopPartner.active = true;
                    updateCoopPartnerStatus();
                    sfx.play('levelup');
                    addFloatingText(player.x, player.y - 30, \`OFFLINE ROOM: \${code}\`, "#34d399", 16);
                    return;
                }
                this.ws.send(JSON.stringify({ type: 'join_room', roomCode: code }));
            },

            sendAction(action, data = {}) {
                if (!this.isConnected || !this.roomCode) return;
                this.ws.send(JSON.stringify({
                    type: 'player_action',
                    action,
                    data
                }));
            },

            sendRoomTransition(curX, curY, dir, depth) {
                if (!this.isConnected || !this.roomCode) return;
                this.ws.send(JSON.stringify({
                    type: 'room_transition',
                    curX,
                    curY,
                    dir,
                    depth
                }));
            },

            startSyncLoop() {
                if (this.syncInterval) clearInterval(this.syncInterval);
                this.syncInterval = setInterval(() => {
                    if (!this.isConnected || !this.roomCode) return;
                    this.ws.send(JSON.stringify({
                        type: 'sync_player',
                        t: Date.now(),
                        state: {
                            x: Math.round(player.x),
                            y: Math.round(player.y),
                            angle: +(player.angle.toFixed(3)),
                            facing: player.facing,
                            animFrame: player.animFrame,
                            hp: player.hp,
                            maxHp: player.maxHp,
                            weaponId: player.weapon.id,
                            isDowned: player.hp <= 0,
                            curX: game.curX,
                            curY: game.curY
                        }
                    }));
                }, 35);
            },

            handleMessage(msg) {
                switch (msg.type) {
                    case 'connected':
                        break;

                    case 'pong':
                        this.latencyMs = Math.round(Date.now() - (msg.t || this.lastPing));
                        this.updateNetUI('online', \`ONLINE\`);
                        break;

                    case 'room_created':
                        this.roomCode = msg.roomCode;
                        this.isHost = true;
                        this.playerIndex = 1;
                        game.multiplayer.roomCode = msg.roomCode;
                        game.multiplayerSeed = msg.seed;
                        generateDungeonFloor(game.depth);
                        document.getElementById('coop-room-code').textContent = msg.roomCode;
                        this.updateSquadUI();
                        sfx.play('coin');
                        addFloatingText(player.x, player.y - 30, \`6P EXPEDITION \${msg.roomCode} CREATED!\`, "#f59e0b", 16);
                        break;

                    case 'room_joined':
                        this.roomCode = msg.roomCode;
                        this.isHost = false;
                        this.playerIndex = msg.playerIndex || 2;
                        game.multiplayer.roomCode = msg.roomCode;
                        game.multiplayerSeed = msg.seed;
                        generateDungeonFloor(game.depth);
                        document.getElementById('coop-room-code').textContent = msg.roomCode;
                        
                        if (msg.players) {
                            for (const p of msg.players) {
                                if (p.id !== this.ws.clientId) {
                                    squadPeers.set(p.id, {
                                        id: p.id,
                                        playerIndex: p.playerIndex,
                                        x: ROOM_W / 2 - 40,
                                        y: ROOM_H / 2 + 70,
                                        targetX: ROOM_W / 2 - 40,
                                        targetY: ROOM_H / 2 + 70,
                                        angle: 0,
                                        facing: 1,
                                        animFrame: 0,
                                        hp: 120,
                                        maxHp: 120,
                                        weapon: WEAPON_ARSENAL.rusty_spade,
                                        isDowned: false
                                    });
                                }
                            }
                        }
                        this.updateSquadUI();
                        sfx.play('levelup');
                        addFloatingText(player.x, player.y - 30, \`JOINED SQUAD AS P\${this.playerIndex}!\`, "#34d399", 16);
                        break;

                    case 'peer_joined':
                        sfx.play('levelup');
                        squadPeers.set(msg.peerId, {
                            id: msg.peerId,
                            playerIndex: msg.playerIndex,
                            x: ROOM_W / 2 - 40,
                            y: ROOM_H / 2 + 70,
                            targetX: ROOM_W / 2 - 40,
                            targetY: ROOM_H / 2 + 70,
                            angle: 0,
                            facing: 1,
                            animFrame: 0,
                            hp: 120,
                            maxHp: 120,
                            weapon: WEAPON_ARSENAL.rusty_spade,
                            isDowned: false
                        });
                        this.updateSquadUI();
                        addFloatingText(player.x, player.y - 30, \`🤝 KEEPER P\${msg.playerIndex} JOINED SQUAD!\`, "#34d399", 18);
                        addParticles(player.x, player.y, '#34d399', 25, 200, 5);
                        break;

                    case 'partner_sync':
                        let peer = squadPeers.get(msg.peerId);
                        if (!peer) {
                            peer = {
                                id: msg.peerId,
                                playerIndex: msg.playerIndex || 2,
                                x: msg.state.x,
                                y: msg.state.y,
                                targetX: msg.state.x,
                                targetY: msg.state.y,
                                angle: msg.state.angle || 0,
                                facing: msg.state.facing || 1,
                                animFrame: 0,
                                hp: msg.state.hp || 120,
                                maxHp: msg.state.maxHp || 120,
                                weapon: WEAPON_ARSENAL.rusty_spade,
                                isDowned: false
                            };
                            squadPeers.set(msg.peerId, peer);
                            this.updateSquadUI();
                        }
                        const s = msg.state;
                        peer.targetX = s.x;
                        peer.targetY = s.y;
                        peer.targetAngle = s.angle !== undefined ? s.angle : peer.targetAngle;
                        peer.targetFacing = s.facing || peer.targetFacing;
                        peer.hp = s.hp !== undefined ? s.hp : peer.hp;
                        peer.maxHp = s.maxHp || peer.maxHp;
                        peer.isDowned = !!s.isDowned;
                        if (s.weaponId && WEAPON_ARSENAL[s.weaponId]) {
                            peer.weapon = WEAPON_ARSENAL[s.weaponId];
                        }
                        
                        const lerpFactor = 0.55;
                        peer.x += (peer.targetX - peer.x) * lerpFactor;
                        peer.y += (peer.targetY - peer.y) * lerpFactor;
                        peer.angle = peer.targetAngle;
                        peer.facing = peer.targetFacing;
                        if (peer.swingTimer > 0) peer.swingTimer = Math.max(0, peer.swingTimer - 0.035);
                        break;

                    case 'partner_action':
                        const actionPeer = squadPeers.get(msg.peerId);
                        const actor = actionPeer || coopPartner;

                        if (msg.action === 'swing') {
                            const d = msg.data || {};
                            if (d.weaponId && WEAPON_ARSENAL[d.weaponId]) {
                                actor.weapon = WEAPON_ARSENAL[d.weaponId];
                            }
                            actor.comboStep = d.comboStep !== undefined ? d.comboStep : 0;
                            actor.angle = d.angle !== undefined ? d.angle : actor.angle;
                            actor.facing = d.facing !== undefined ? d.facing : actor.facing;
                            const isFinisher = actor.comboStep === 0;
                            actor.swingDuration = (isFinisher ? 0.25 : 0.18) / (actor.weapon.speedMult || 1);
                            actor.swingTimer = actor.swingDuration;

                            sfx.play('swing');
                            const reach = (actor.weapon.reach || 42) * (isFinisher ? 1.15 : 1.0);
                            const slashX = actor.x + Math.cos(actor.angle) * (reach * 0.7);
                            const slashY = actor.y + Math.sin(actor.angle) * (reach * 0.7);
                            addParticles(slashX, slashY, actor.weapon.trailColor || '#22d3ee', isFinisher ? 16 : 8, 140, 4);

                            // Authoritative damage check if host
                            if (MultiplayerManager.isHost) {
                                for (let i = enemies.length - 1; i >= 0; i--) {
                                    const foe = enemies[i];
                                    if (!foe.burrowed && Math.hypot(foe.x - actor.x, foe.y - actor.y) < reach + 20) {
                                        foe.hp -= 28;
                                        foe.flash = 0.12;
                                        const kb = Math.atan2(foe.y - actor.y, foe.x - actor.x);
                                        foe.vx = Math.cos(kb) * 220;
                                        foe.vy = Math.sin(kb) * 220;
                                        addParticles(foe.x, foe.y, '#22d3ee', 6, 110, 3);
                                        addFloatingText(foe.x, foe.y - 12, "-28", "#67e8f9", 12);
                                        if (foe.hp <= 0) killEnemy(i);
                                    }
                                }
                            }
                        } else if (msg.action === 'interact') {
                            if (MultiplayerManager.isHost) {
                                const ix = msg.data.x;
                                const iy = msg.data.y;
                                const r = currentRoom();
                                if (r && r.mounds) {
                                    for (let i = r.mounds.length - 1; i >= 0; i--) {
                                        if (Math.hypot(r.mounds[i].x - ix, r.mounds[i].y - iy) < 85) {
                                            excavateMound(i);
                                            break;
                                        }
                                    }
                                }
                                if (r && r.chests) {
                                    for (const ch of r.chests) {
                                        if (!ch.opened && Math.hypot(ch.x - ix, ch.y - iy) < 85) {
                                            ch.opened = true;
                                            sfx.play('levelup');
                                            addParticles(ch.x, ch.y, '#fbbf24', 24, 170, 5);
                                            for (let c = 0; c < 4; c++) spawnLootDrop(ch.x + (c - 1.5) * 15, ch.y + 15, 'coin', 12);
                                            break;
                                        }
                                    }
                                }
                            }
                        } else if (msg.action === 'change_weapon') {
                            if (msg.data.weaponId && WEAPON_ARSENAL[msg.data.weaponId]) {
                                actor.weapon = WEAPON_ARSENAL[msg.data.weaponId];
                                sfx.play('swing');
                            }
                        } else if (msg.action === 'dash') {
                            sfx.play('dash');
                            addParticles(actor.x, actor.y, '#94a3b8', 12, 120, 4);
                        } else if (msg.action === 'deflect') {
                            sfx.play('deflect');
                            addParticles(actor.x, actor.y, '#f59e0b', 16, 160, 5);
                        } else if (msg.action === 'revived') {
                            sfx.play('levelup');
                            actor.isDowned = false;
                            actor.hp = Math.round(actor.maxHp * 0.5);
                            addParticles(actor.x, actor.y, '#34d399', 24, 180, 5);
                        }
                        break;

                    case 'world_snapshot':
                        // LOCKSTEP AUTHORITATIVE RECONCILIATION FOR PEERS
                        if (MultiplayerManager.isHost) return;
                        const snap = msg.snapshot;
                        if (!snap) return;

                        // Room and Depth sync
                        if (snap.depth !== game.depth || snap.curX !== game.curX || snap.curY !== game.curY) {
                            if (snap.depth !== game.depth) {
                                game.depth = snap.depth;
                                generateDungeonFloor(game.depth);
                            }
                            enterRoom(snap.curX, snap.curY, null);
                        }

                        const curR = currentRoom();
                        if (curR) {
                            curR.cleared = snap.roomCleared;
                            curR.portalActive = snap.portalActive;
                            if (snap.mounds) curR.mounds = snap.mounds;
                            if (snap.pits) curR.pits = snap.pits;
                            if (snap.chests && curR.chests) {
                                curR.chests.forEach((c, idx) => {
                                    if (snap.chests[idx]) c.opened = snap.chests[idx].opened;
                                });
                            }
                        }

                        // Reconcile drops
                        if (snap.drops) {
                            drops = snap.drops.map(d => ({ x: d.x, y: d.y, type: d.type, value: d.value, bob: 0 }));
                        }

                        // Reconcile projectiles
                        if (snap.projectiles) {
                            projectiles = snap.projectiles;
                        }

                        // Reconcile Enemies perfectly
                        const snapFoes = snap.enemies || [];
                        while (enemies.length < snapFoes.length) {
                            const sf = snapFoes[enemies.length];
                            enemies.push({
                                type: sf.type,
                                x: sf.x,
                                y: sf.y,
                                targetX: sf.x,
                                targetY: sf.y,
                                hp: sf.hp,
                                maxHp: sf.maxHp,
                                vx: sf.vx,
                                vy: sf.vy,
                                facing: sf.facing,
                                flash: sf.flash ? 0.12 : 0,
                                burrowed: sf.burrowed,
                                isElite: sf.isElite,
                                isBoss: sf.isBoss,
                                animFrame: sf.animFrame || 0,
                                radius: sf.type === 'wraith' ? 18 : 16
                            });
                        }
                        while (enemies.length > snapFoes.length) {
                            const deadFoe = enemies.pop();
                            addParticles(deadFoe.x, deadFoe.y, '#94a3b8', 10, 120, 4);
                        }
                        for (let i = 0; i < snapFoes.length; i++) {
                            const sf = snapFoes[i];
                            const ef = enemies[i];
                            ef.type = sf.type;
                            ef.targetX = sf.x;
                            ef.targetY = sf.y;
                            ef.x += (sf.x - ef.x) * 0.6;
                            ef.y += (sf.y - ef.y) * 0.6;
                            ef.hp = sf.hp;
                            ef.maxHp = sf.maxHp;
                            ef.facing = sf.facing;
                            ef.flash = sf.flash ? 0.12 : 0;
                            ef.burrowed = sf.burrowed;
                            ef.isElite = sf.isElite;
                            ef.isBoss = sf.isBoss;
                            ef.animFrame = sf.animFrame;
                        }
                        break;

                    case 'sync_room_transition':
                        if (msg.depth !== game.depth) {
                            game.depth = msg.depth;
                            generateDungeonFloor(game.depth);
                        }
                        enterRoom(msg.curX, msg.curY, msg.dir || null);
                        addFloatingText(ROOM_W / 2, ROOM_H / 2 - 30, "SQUAD TRANSITION", "#34d399", 16);
                        break;

                    case 'partner_left':
                        squadPeers.delete(msg.peerId);
                        this.updateSquadUI();
                        addFloatingText(player.x, player.y - 30, \`P\${msg.playerIndex} LEFT SQUAD\`, "#ef4444", 14);
                        break;

                    case 'promoted_to_host':
                        this.isHost = true;
                        this.playerIndex = 1;
                        this.updateSquadUI();
                        addFloatingText(player.x, player.y - 30, "👑 YOU ARE EXPEDITION LEADER!", "#f59e0b", 18);
                        break;

                    case 'error':
                        alert(msg.message || 'Multiplayer error');
                        break;
                }
            }
        };
`;

// Inject JS modules into window.onload
html = html.replace(
    'window.onload = function () {',
    `${homeAndSettingsJS}\n${jsModules}\n\n        window.onload = function () {\n            SettingsManager.init();\n            AdManager.init();\n            MultiplayerManager.init();`
);

fs.writeFileSync(destPath, html, 'utf8');
console.log('Successfully compiled index.html with Home Screen, Settings & Host-Authoritative 6P Sync!');
