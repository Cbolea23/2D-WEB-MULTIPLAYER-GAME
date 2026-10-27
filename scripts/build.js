import fs from 'fs';
import path from 'path';

const srcPath = path.resolve('fix_ankh_badge_typo.html');
const destPath = path.resolve('index.html');

let html = fs.readFileSync(srcPath, 'utf8');

console.log('Source file read successfully. Size:', html.length, 'bytes');

// ============================================================================
// 0. INJECT CRAZYGAMES SDK V3 INTO HEAD (WEB MONETIZATION & QA TEST HARNESS)
// ============================================================================
html = html.replace(
    '<script src="https://cdn.tailwindcss.com"></script>',
    `<script src="https://cdn.tailwindcss.com"></script>\n    <!-- Official CrazyGames SDK v3 (Web Game Portal Monetization & Test Harness) -->\n    <script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>`
);

// ============================================================================
// 1. UPDATE GAME CONTAINER STYLING FOR AD BANNER
// ============================================================================
html = html.replace(
    `#game-container {\n            position: relative;\n            flex: 1;\n            width: 100%;\n            height: calc(100vh - 54px);\n            overflow: hidden;\n            background-color: var(--bg-dark);\n        }`,
    `#game-container {\n            position: relative;\n            flex: 1;\n            width: 100%;\n            height: calc(100vh - 54px - 50px);\n            overflow: hidden;\n            background-color: var(--bg-dark);\n            transition: height 0.2s ease;\n        }\n        #game-container.banner-hidden {\n            height: calc(100vh - 54px);\n        }`
);

// ============================================================================
// 2. ADD HOME, SETTINGS & CO-OP BUTTONS TO TOP HUD BAR
// ============================================================================
const topHudButtons = `
            <button id="btn-profile" class="pixel-button text-cyan-300 font-pixel text-[9px] px-2 py-1.5 rounded hover:border-cyan-400 flex items-center gap-1" title="Account & Cloud Save">
                <span>👤</span> <span id="top-profile-label">GUEST</span>
            </button>
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

// ============================================================================
// 3. HOME SCREEN OVERLAY & EXPEDITION SETTINGS MODAL
// ============================================================================
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

            <!-- ACCOUNT STATUS BADGE & GUEST WARNING -->
            <div id="home-account-badge" class="pixel-panel p-2 rounded flex items-center justify-between text-[8px] font-pixel max-w-sm mx-auto bg-slate-900/90 border-slate-700">
                <div class="flex items-center gap-1.5 truncate">
                    <span id="home-account-icon" class="text-amber-400 text-xs">👤</span>
                    <div class="truncate">
                        <span class="text-slate-400">STATUS: </span>
                        <span id="home-account-username" class="text-cyan-300 font-bold">GUEST (FREEPLAY)</span>
                    </div>
                </div>
                <button id="btn-home-auth" class="pixel-button-cyan text-[7px] px-2.5 py-1 rounded text-cyan-100 hover:brightness-110 shrink-0">
                    SIGN IN / REGISTER
                </button>
            </div>
            <div id="home-guest-warning" class="text-[7px] font-pixel text-amber-400/90 text-center max-w-sm mx-auto -mt-3">
                ⚠️ Guest Progress & Shards will NOT be saved when leaving or closing the tab.
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
                <button id="close-settings" class="pixel-button text-slate-200 px-2.5 py-1 rounded font-pixel text-[9px]">✕</button>
            </div>

            <div class="space-y-3 text-[9px] font-pixel">
                <div class="space-y-1">
                    <div class="flex justify-between text-slate-300">
                        <span>AUDIO VOLUME</span>
                        <span id="label-volume" class="text-cyan-400">70%</span>
                    </div>
                    <input id="slider-volume" type="range" min="0" max="100" value="70" class="w-full accent-cyan-400">
                </div>

                <div class="flex items-center justify-between py-1 border-t border-slate-800/80">
                    <div>
                        <div class="text-slate-200">SCREEN SHAKE & JUICE</div>
                        <div class="text-[7px] text-slate-500">Camera impacts & recoil</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-screenshake" type="checkbox" checked class="sr-only peer">
                        <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-slate-800/80">
                    <div>
                        <div class="text-slate-200">DAMAGE NUMBERS</div>
                        <div class="text-[7px] text-slate-500">Floating combat popups</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-dmgnumbers" type="checkbox" checked class="sr-only peer">
                        <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-slate-800/80">
                    <div>
                        <div class="text-slate-200">SPONSORED AD BANNER</div>
                        <div class="text-[7px] text-slate-500">Show bottom revenue banner</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-adbanner" type="checkbox" checked class="sr-only peer">
                        <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>
            </div>

            <div class="border-t border-slate-800 pt-3 flex justify-end">
                <button id="btn-save-settings" class="pixel-button-gold px-4 py-2 rounded font-pixel text-[9px] text-amber-200">
                    SAVE & CLOSE
                </button>
            </div>
        </div>
    </div>

    <!-- MODAL: USER ACCOUNT & CLOUD SAVE -->
    <div id="auth-modal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
        <div class="pixel-panel max-w-sm w-full p-5 rounded space-y-4 border-cyan-500/80 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <div class="flex items-center gap-2">
                    <span class="text-xl">👤</span>
                    <h2 class="font-pixel text-xs md:text-sm font-black text-cyan-300" id="auth-modal-title">ACCOUNT & CLOUD SAVE</h2>
                </div>
                <button id="close-auth" class="pixel-button text-slate-200 px-2.5 py-1 rounded font-pixel text-[9px]">✕</button>
            </div>

            <!-- VIEW 1: GUEST / LOGGED OUT (SIGN IN & REGISTER TABS) -->
            <div id="auth-view-guest" class="space-y-3">
                <div class="flex border-b border-slate-800 text-[8px] font-pixel">
                    <button id="auth-tab-login" class="flex-1 py-1.5 text-center font-bold text-cyan-300 border-b-2 border-cyan-400">
                        SIGN IN
                    </button>
                    <button id="auth-tab-register" class="flex-1 py-1.5 text-center text-slate-400 hover:text-slate-200">
                        CREATE ACCOUNT
                    </button>
                </div>

                <!-- SIGN IN FORM -->
                <form id="form-login" class="space-y-2.5 text-[9px] font-pixel">
                    <div>
                        <label class="block text-slate-400 mb-1">USERNAME</label>
                        <input id="login-username" type="text" autocomplete="username" required maxlength="20" placeholder="e.g. DungeonMaster" class="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-white focus:outline-none focus:border-cyan-400">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">PASSWORD</label>
                        <input id="login-password" type="password" autocomplete="current-password" required placeholder="••••••••" class="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-white focus:outline-none focus:border-cyan-400">
                    </div>
                    <div id="login-error" class="hidden text-[8px] text-red-400 bg-red-950/50 p-1.5 rounded border border-red-800"></div>
                    <button type="submit" id="btn-submit-login" class="pixel-button-cyan w-full py-2 rounded text-cyan-100 tracking-wider shadow">
                        SIGN IN TO ACCOUNT
                    </button>
                </form>

                <!-- REGISTER FORM -->
                <form id="form-register" class="hidden space-y-2.5 text-[9px] font-pixel">
                    <div>
                        <label class="block text-slate-400 mb-1">CHOOSE USERNAME</label>
                        <input id="reg-username" type="text" autocomplete="username" required minlength="3" maxlength="20" placeholder="3-20 characters" class="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-white focus:outline-none focus:border-amber-400">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">CHOOSE PASSWORD</label>
                        <input id="reg-password" type="password" autocomplete="new-password" required minlength="4" placeholder="Min 4 characters" class="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-white focus:outline-none focus:border-amber-400">
                    </div>
                    <div class="p-2 rounded bg-amber-950/40 border border-amber-800/80 flex items-start gap-2">
                        <input id="reg-claim-loot" type="checkbox" checked class="mt-0.5 accent-amber-400">
                        <label for="reg-claim-loot" class="text-[7px] text-amber-200/90 leading-tight cursor-pointer">
                            Claim current session loot (<span id="reg-current-souls" class="text-amber-400 font-bold">0</span> Soul Shards, <span id="reg-current-depth" class="text-amber-400 font-bold">Depth 1</span>) into this new account
                        </label>
                    </div>
                    <div id="register-error" class="hidden text-[8px] text-red-400 bg-red-950/50 p-1.5 rounded border border-red-800"></div>
                    <button type="submit" id="btn-submit-register" class="pixel-button-gold w-full py-2 rounded text-amber-200 tracking-wider shadow">
                        CREATE ACCOUNT & SAVE PROGRESS
                    </button>
                </form>

                <div class="text-[7px] font-pixel text-slate-500 text-center pt-1 border-t border-slate-800/80">
                    <span>⚡ Direct Freeplay is always active. No account required to play!</span>
                </div>
            </div>

            <!-- VIEW 2: LOGGED IN PROFILE DASHBOARD -->
            <div id="auth-view-profile" class="hidden space-y-3 text-[9px] font-pixel">
                <div class="pixel-panel p-3 rounded bg-slate-900/80 border-slate-700 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-slate-400">LOGGED IN AS:</span>
                        <span id="profile-username" class="text-amber-300 font-bold text-xs">Keeper</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-400">CLOUD SYNC STATUS:</span>
                        <span class="text-emerald-400 font-bold flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            ACTIVE ☁️
                        </span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[8px]">
                        <div>🔮 SAVED SOULS: <span id="profile-souls" class="text-purple-300 font-bold">0</span></div>
                        <div>🏆 BEST DEPTH: <span id="profile-depth" class="text-cyan-300 font-bold">1</span></div>
                    </div>
                </div>

                <div class="space-y-2">
                    <button id="btn-sync-cloud-save" class="pixel-button-cyan w-full py-2 rounded text-cyan-100 flex items-center justify-center gap-1.5 shadow">
                        <span>☁️</span> SYNC TO CLOUD NOW
                    </button>
                    <button id="btn-logout" class="pixel-button w-full py-2 rounded text-red-300 border-red-900/60 hover:border-red-500 flex items-center justify-center gap-1.5">
                        <span>🚪</span> LOG OUT (SWITCH TO GUEST FREEPLAY)
                    </button>
                </div>
            </div>
        </div>
    </div>
`;
html = html.replace('<!-- MODAL 1: SANCTUARY SOUL ALTAR (PERMANENT META-UPGRADES) -->', `${homeScreenAndSettingsHtml}\n    <!-- MODAL 1: SANCTUARY SOUL ALTAR (PERMANENT META-UPGRADES) -->`);

// ============================================================================
// 4. EXPAND CO-OP MODAL FOR UP TO 6 PLAYERS WITH INSTANT SHARE LINKS
// ============================================================================
const sixPlayerLobbyHtml = `
            <!-- TAB 1: 6-PLAYER CO-OP EXPEDITION LOBBY -->
            <div id="tab-coop" class="space-y-4">
                <!-- Squad Header & Status Bar -->
                <div class="pixel-panel p-3 rounded flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border-slate-800">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping" id="net-status-dot"></span>
                        <div>
                            <div class="font-pixel text-[9px] text-white flex items-center gap-2">
                                <span>SESSION ROOM:</span>
                                <span id="coop-room-code" class="text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-amber-600 font-bold tracking-widest">KEEPER-7X9</span>
                                <button id="btn-copy-code" class="pixel-button text-[8px] px-2 py-0.5 text-cyan-300 hover:text-cyan-100" title="Copy Room Code">
                                    📋 COPY
                                </button>
                                <button id="btn-copy-invite-link" class="pixel-button-cyan text-[8px] px-2 py-0.5 text-cyan-100" title="Copy One-Click Join Link">
                                    🔗 SHARE LINK
                                </button>
                            </div>
                            <div class="text-[7px] font-pixel text-slate-400 mt-0.5" id="net-status-text">
                                CONNECTED (Up to 6 Keepers in Lockstep Co-Op)
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span id="squad-count-badge" class="font-pixel text-[8px] px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                            SQUAD: 1 / 6
                        </span>
                    </div>
                </div>

                <!-- 6-Player Squad Roster Grid -->
                <div class="space-y-1.5">
                    <div class="font-pixel text-[8px] text-slate-400 uppercase tracking-wider">EXPEDITION PARTY ROSTER (6 SLOTS):</div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="squad-slots-grid">
                        <!-- P1 Slot (Host) -->
                        <div class="pixel-panel p-2 rounded border-amber-500 bg-amber-950/30 text-[8px] font-pixel flex items-center gap-2 ring-1 ring-amber-500" id="slot-p1">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-amber-300 font-bold">P1 (HOST / YOU)</div>
                                <div class="text-[7px] text-emerald-400">Ready in Crypt</div>
                            </div>
                        </div>

                        <!-- P2 Slot -->
                        <div class="pixel-panel p-2 rounded border-slate-700 bg-slate-900/60 text-[8px] font-pixel flex items-center gap-2" id="slot-p2">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P2 (OPEN)</div>
                                <div class="text-[7px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>

                        <!-- P3 Slot -->
                        <div class="pixel-panel p-2 rounded border-slate-700 bg-slate-900/60 text-[8px] font-pixel flex items-center gap-2" id="slot-p3">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P3 (OPEN)</div>
                                <div class="text-[7px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>

                        <!-- P4 Slot -->
                        <div class="pixel-panel p-2 rounded border-slate-700 bg-slate-900/60 text-[8px] font-pixel flex items-center gap-2" id="slot-p4">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P4 (OPEN)</div>
                                <div class="text-[7px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>

                        <!-- P5 Slot -->
                        <div class="pixel-panel p-2 rounded border-slate-700 bg-slate-900/60 text-[8px] font-pixel flex items-center gap-2" id="slot-p5">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P5 (OPEN)</div>
                                <div class="text-[7px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>

                        <!-- P6 Slot -->
                        <div class="pixel-panel p-2 rounded border-slate-700 bg-slate-900/60 text-[8px] font-pixel flex items-center gap-2" id="slot-p6">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0"></span>
                            <div class="truncate">
                                <div class="text-slate-300">P6 (OPEN)</div>
                                <div class="text-[7px] text-slate-500">Awaiting Keeper...</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Join Existing Expedition Input -->
                <div class="pixel-panel p-3 rounded space-y-2 bg-slate-900/40 border-slate-800">
                    <div class="font-pixel text-[8px] text-slate-300">OR ENTER EXISTING SQUAD ROOM CODE:</div>
                    <div class="flex gap-2">
                        <input id="input-coop-code" type="text" placeholder="ENTER ROOM CODE..." class="flex-1 bg-slate-950 border border-slate-700 px-3 py-2 rounded font-pixel text-[9px] text-cyan-300 uppercase tracking-widest outline-none focus:border-cyan-400">
                        <button id="btn-join-session" class="pixel-button-gold px-4 py-2 rounded font-pixel text-[9px] text-amber-200 shrink-0">
                            🔗 JOIN SQUAD
                        </button>
                    </div>
                </div>

                <!-- Launch or Ready Action Bar -->
                <div class="flex gap-2 pt-2">
                    <button id="btn-launch-expedition" class="pixel-button-gold flex-1 py-3 rounded font-pixel text-xs text-amber-200 tracking-wider shadow-lg flex items-center justify-center gap-2">
                        <span>🚀</span> START EXPEDITION (ENTER DUNGEON)
                    </button>
                    <button id="btn-leave-coop-lobby" class="pixel-button text-slate-300 px-4 py-3 rounded font-pixel text-[9px] hover:text-red-400">
                        ✕ LEAVE
                    </button>
                </div>
            </div>
`;

html = html.replace(
    /<!-- TAB 1: CO-OP SESSION LOBBY -->[\s\S]*?<!-- TAB 2: GODOT 4 ANTIGRAVITY ENGINE ARCHITECTURE -->/,
    `${sixPlayerLobbyHtml}\n            <!-- TAB 2: GODOT 4 ANTIGRAVITY ENGINE ARCHITECTURE -->`
);

// ============================================================================
// 5. AD BANNER & REWARDED VIDEO MODAL & GHOST SPECTATOR HUD
// ============================================================================
const adBannerHtml = `
    <!-- BOTTOM AD BANNER BAR -->
    <footer id="ad-banner-container" class="w-full pixel-panel px-3 py-1 flex items-center justify-between gap-3 z-30 border-b-0 border-x-0 rounded-none bg-[#090d16] text-[8px] font-pixel shrink-0 h-[50px] transition-all duration-200">
        <div class="flex items-center gap-2.5 overflow-hidden">
            <span class="text-amber-400 text-sm animate-bounce shrink-0">📢</span>
            <div class="truncate">
                <div class="text-amber-300 font-bold truncate" id="ad-banner-title">SPONSORED: DUNGEON REPUTATION</div>
                <div class="text-slate-400 text-[7px] truncate" id="ad-banner-tagline">Support Crypt Keeper development • Ready for AdSense / Poki / CrazyGames</div>
            </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
            <button id="btn-watch-rewarded-ad" class="pixel-button-cyan px-2.5 py-1.5 rounded font-pixel text-[8px] text-cyan-100 flex items-center gap-1 shadow-md">
                <span>🎁</span> FREE SOULS (+50)
            </button>
            <button id="btn-close-banner" class="text-slate-500 hover:text-slate-300 text-xs px-1" title="Hide ad banner">✕</button>
        </div>
    </footer>

    <!-- REWARDED VIDEO AD SIMULATION MODAL -->
    <div id="rewarded-ad-modal" class="hidden fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div class="pixel-panel max-w-sm w-full p-4 rounded text-center space-y-3 border-amber-500">
            <div class="flex justify-between items-center text-[8px] font-pixel text-slate-400 border-b border-slate-800 pb-2">
                <span>REWARDED VIDEO ADVERTISEMENT</span>
                <span id="ad-countdown" class="text-amber-400 font-bold">5s</span>
            </div>
            <div class="py-6 space-y-2 bg-slate-950/80 rounded border border-slate-800">
                <div class="text-3xl animate-pulse">🎬</div>
                <div class="font-pixel text-[10px] text-amber-300 font-black">CRYPT KEEPER PARTNER NETWORK</div>
                <p class="text-[7px] font-pixel text-slate-400 px-4">Watching commercial break. Your in-game reward will unlock once the timer completes!</p>
                <div class="w-3/4 mx-auto bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                    <div id="ad-progress-bar" class="bg-amber-400 h-full w-0 transition-all duration-1000 ease-linear"></div>
                </div>
            </div>
            <button id="btn-skip-ad" disabled class="pixel-button text-slate-600 px-3 py-1.5 rounded font-pixel text-[8px] w-full cursor-not-allowed">
                WAIT FOR AD (5s)
            </button>
        </div>
    </div>

    <!-- FLOATING GHOST SPECTATOR HUD OVERLAY -->
    <div id="ghost-spectator-hud" class="hidden fixed top-16 left-1/2 -translate-x-1/2 z-40 flex flex-col sm:flex-row items-center gap-2 p-2 rounded-lg bg-slate-950/90 border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.35)] backdrop-blur-md select-none pointer-events-auto">
        <div class="flex items-center gap-2 px-2 text-cyan-300 font-pixel text-[9px] font-bold">
            <span class="animate-pulse text-base">👻</span>
            <span>GHOST SPECTATOR MODE</span>
            <span class="text-[7px] text-slate-400 hidden sm:inline">(Noclip Flight: WASD / Arrow Keys)</span>
        </div>
        <div class="flex items-center gap-2">
            <button id="btn-spectator-ad-revive" class="pixel-button-gold px-3 py-1.5 rounded font-pixel text-[8px] text-amber-200 flex items-center gap-1.5 border-amber-400 shadow hover:border-amber-300">
                <span>📺</span> WATCH AD TO REVIVE
            </button>
            <button id="btn-spectator-snap" class="pixel-button-cyan px-2.5 py-1.5 rounded font-pixel text-[8px] text-cyan-200 flex items-center gap-1 border-cyan-500 shadow hover:border-cyan-400">
                <span>👥</span> TO SQUAD
            </button>
            <button id="btn-spectator-menu" class="pixel-button px-2.5 py-1.5 rounded font-pixel text-[8px] text-slate-300 flex items-center gap-1 border-slate-700 hover:border-slate-500">
                <span>🏠</span> MENU
            </button>
        </div>
    </div>
`;
html = html.replace('<!-- MODAL 6: GAME OVER / EXPEDITION SUMMARY -->', `${adBannerHtml}\n    <!-- MODAL 6: GAME OVER / EXPEDITION SUMMARY -->`);

// Replace GameOver Modal buttons with [Watch Ads to Revive], [Spectate as a Ghost], [Return to Main Menu]
const gameOverButtonsTarget = `<div class="flex gap-2">
                <button id="btn-gameover-altar" class="pixel-button text-purple-300 w-1/2 py-2.5 rounded font-pixel text-[9px] uppercase">
                    🔮 SOUL ALTAR
                </button>
                <button id="btn-restart" class="pixel-button-gold w-1/2 py-2.5 rounded font-pixel text-[9px] uppercase text-amber-200">
                    🔄 NEW RUN
                </button>
            </div>`;

const gameOverButtonsReplacement = `
            <!-- GUEST MODE LOOT CALLOUT -->
            <div id="gameover-guest-callout" class="p-2 rounded pixel-panel border-amber-600/70 bg-amber-950/40 flex items-center justify-between text-[8px] font-pixel mb-1">
                <div class="text-amber-300 leading-tight">
                    <div>⚠️ GUEST MODE: Loot will not be saved!</div>
                    <div class="text-[7px] text-slate-400">Create an account to keep your shards.</div>
                </div>
                <button id="btn-gameover-claim" class="pixel-button-gold px-2.5 py-1.5 rounded text-[8px] text-amber-200 shrink-0 font-bold">
                    💾 SAVE TO ACCOUNT
                </button>
            </div>

            <div class="space-y-2.5 mt-2">
                <button id="btn-gameover-ad-revive" class="pixel-button-gold w-full py-2.5 rounded font-pixel text-[9px] text-amber-200 tracking-wider shadow-lg flex items-center justify-center gap-2 border-amber-400 hover:border-amber-300">
                    <span>📺</span> WATCH ADS TO REVIVE (50% HP)
                </button>
                <div class="grid grid-cols-2 gap-2">
                    <button id="btn-gameover-spectate" class="pixel-button-cyan w-full py-2.5 rounded font-pixel text-[9px] text-cyan-200 tracking-wider shadow-lg flex items-center justify-center gap-2 border-cyan-400 hover:border-cyan-300">
                        <span>👻</span> SPECTATE AS GHOST
                    </button>
                    <button id="btn-gameover-menu" class="pixel-button w-full py-2.5 rounded font-pixel text-[9px] text-slate-300 tracking-wider shadow-lg flex items-center justify-center gap-2 border-slate-700 hover:border-slate-500">
                        <span>🏠</span> MAIN MENU
                    </button>
                </div>
                <button id="btn-gameover-altar" class="hidden"></button>
                <button id="btn-restart" class="hidden"></button>
            </div>`;

html = html.replace(gameOverButtonsTarget, gameOverButtonsReplacement);

// Add Free Souls ad button to Soul Altar Modal
html = html.replace(
    `<div id="altar-upgrades" class="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1"></div>`,
    `<div id="altar-upgrades" class="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1"></div>\n            <div class="mt-3 p-2 rounded pixel-panel border-purple-800 bg-purple-950/30 flex items-center justify-between text-[8px] font-pixel">\n                <div class="text-purple-300">Need Shards? Watch a short partner clip:</div>\n                <button id="btn-altar-free-souls" class="pixel-button-cyan px-2 py-1 rounded text-[7px] text-cyan-100">🎬 +50 SOULS</button>\n            </div>`
);

// ============================================================================
// 6. MULTIPLAYER GLOBALS: SQUAD COLORS, SQUAD PEERS MAP & LERP FIELDS
// ============================================================================
html = html.replace(
    `let coopPartner = {`,
    `const SQUAD_COLORS = {
            1: '#f59e0b', // P1 Host Gold
            2: '#22d3ee', // P2 Cyan
            3: '#34d399', // P3 Emerald
            4: '#c084fc', // P4 Purple
            5: '#f43f5e', // P5 Rose
            6: '#fbbf24'  // P6 Amber
        };
        const squadPeers = new Map();

        let coopPartner = {
            targetX: 0,
            targetY: 0,
            targetAngle: 0,
            targetFacing: 1,
            comboStep: 0,
            playerIndex: 2,`
);

// ============================================================================
// 7. FIX updateCoopPartner FOR REMOTE PLAYERS (ELIMINATES SHAKING & JITTER)
// ============================================================================
const smoothCoopPartnerCode = `        function updateCoopPartner(dt) {
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
                if (p.swingTimer > 0) p.swingTimer = Math.max(0, p.swingTimer - dt);
                return;
            }
`;

html = html.replace(
    /function updateCoopPartner\(dt\) \{[\s\S]*?if \(p\.isDowned\) \{[\s\S]*?return;\s*\}/,
    smoothCoopPartnerCode
);

// ============================================================================
// 8. SEEDED PRNG FOR 100% IDENTICAL DUNGEON ROOM GENERATION ACROSS ALL CLIENTS
// ============================================================================
const prngFunctionCode = `
        // Deterministic Mulberry32 PRNG for Cross-Client Seed Synchronization
        function createPRNG(seed) {
            let s = Math.floor(Math.abs(seed)) >>> 0;
            return function() {
                s = (s + 0x6D2B79F5) >>> 0;
                let t = Math.imul(s ^ (s >>> 15), 1 | s);
                t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        }
`;

html = html.replace(
    `function generateDungeonFloor(depth) {\n            game.rooms = {};`,
    `${prngFunctionCode}\n        function generateDungeonFloor(depth) {\n            const originalRandom = Math.random;\n            if (game.multiplayerSeed) {\n                Math.random = createPRNG(game.multiplayerSeed + depth * 1000);\n            }\n            try {\n                game.rooms = {};`
);

// Close the try-finally block at the end of generateDungeonFloor
html = html.replace(
    `            game.totalRooms = visited.length;\n            game.clearedRooms = 1;\n            initAmbientMotes();\n            enterRoom(2, 2, null);\n        }`,
    `            game.totalRooms = visited.length;\n            game.clearedRooms = 1;\n            initAmbientMotes();\n            enterRoom(2, 2, null);\n            } finally {\n                Math.random = originalRandom;\n            }\n        }`
);

// ============================================================================
// 9. BYPASS LOCAL ENEMY SPAWNING FOR NON-HOST MULTIPLAYER PEERS IN enterRoom
// ============================================================================
html = html.replace(
    `            if (!room.cleared) {\n                if (room.type === 'boss') {`,
    `            if (!room.cleared) {\n                // Non-host peers NEVER generate local enemies in multiplayer!\n                if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected && !MultiplayerManager.isHost) {\n                    enemies = [];\n                    return;\n                }\n                if (room.type === 'boss') {`
);

// ============================================================================
// 10. MULTIPLAYER ATTACK & WEAPON BROADCASTING
// ============================================================================
html = html.replace(
    `player.swingDuration = (isFinisher ? 0.25 : 0.18) / wep.speedMult;\n            player.swingTimer = player.swingDuration;\n            player.swingCooldown = (isFinisher ? 0.28 : 0.19) / wep.speedMult;\n\n            player.scaleX = isFinisher ? 1.32 : 1.18;\n            player.scaleY = isFinisher ? 0.74 : 0.86;\n            triggerJuice(isFinisher ? 0.055 : 0.025, isFinisher ? 9 : 4, isFinisher ? 32 : 15);\n            sfx.play('swing');`,
    `player.swingDuration = (isFinisher ? 0.25 : 0.18) / wep.speedMult;\n            player.swingTimer = player.swingDuration;\n            player.swingCooldown = (isFinisher ? 0.28 : 0.19) / wep.speedMult;\n\n            player.scaleX = isFinisher ? 1.32 : 1.18;\n            player.scaleY = isFinisher ? 0.74 : 0.86;\n            triggerJuice(isFinisher ? 0.055 : 0.025, isFinisher ? 9 : 4, isFinisher ? 32 : 15);\n            sfx.play('swing');\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                MultiplayerManager.sendAction('swing', {\n                    weaponId: wep.id,\n                    angle: player.angle,\n                    facing: player.facing,\n                    comboStep: player.comboStep\n                });\n            }`
);

// Broadcast weapon change
html = html.replace(
    `player.weapon = w;\n                    metaSave.selectedWeapon = w.id;`,
    `player.weapon = w;\n                    metaSave.selectedWeapon = w.id;\n                    if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                        MultiplayerManager.sendAction('change_weapon', { weaponId: w.id });\n                    }`
);

// Broadcast door transitions
html = html.replace(
    `enterRoom(targetX, targetY, dir);`,
    `enterRoom(targetX, targetY, dir);\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                MultiplayerManager.sendRoomTransition(targetX, targetY, dir, game.depth);\n            }`
);

// Broadcast depth / floor transitions with Midgame Ad Break
html = html.replace(
    `game.depth++;\n                metaSave.bestDepth = Math.max(metaSave.bestDepth, game.depth);\n                saveMeta();\n                sfx.play('levelup');\n                addFloatingText(player.x, player.y - 30, \`DESCENDING TO DEPTH \${game.depth}...\`, "#c084fc", 18);\n                generateDungeonFloor(game.depth);`,
    `game.depth++;\n                metaSave.bestDepth = Math.max(metaSave.bestDepth, game.depth);\n                saveMeta();\n                sfx.play('levelup');\n                addFloatingText(player.x, player.y - 30, \`DESCENDING TO DEPTH \${game.depth}...\`, "#c084fc", 18);\n                const proceedDescend = () => {\n                    generateDungeonFloor(game.depth);\n                    if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                        MultiplayerManager.sendRoomTransition(2, 2, null, game.depth);\n                    }\n                };\n                if (typeof AdManager !== 'undefined') {\n                    AdManager.showInterstitialAd(proceedDescend);\n                } else {\n                    proceedDescend();\n                }`
);

// Broadcast mound excavation & chest opening in triggerContextAction
html = html.replace(
    `function triggerContextAction() {`,
    `function triggerContextAction() {\n            if (player.isGhost) return;\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                MultiplayerManager.sendAction('interact', { x: player.x, y: player.y });\n            }`
);

// ============================================================================
// 11. WEAPON & SQUAD RENDERER IN RENDER() + GHOST AVATARS
// ============================================================================
const weaponRendererCode = `
        // Universal Weapon & Swing Arc Visualizer for Local Player and Squad Peers
        function renderCharacterWeapon(ctx, char, isLocal = false) {
            const wep = char.weapon || WEAPON_ARSENAL.rusty_spade;
            const swingTimer = isLocal ? char.swingTimer : (char.swingTimer || 0);
            const swingDuration = isLocal ? char.swingDuration : (char.swingDuration || 0.2);
            const comboStep = char.comboStep || 0;
            const angle = char.angle !== undefined ? char.angle : 0;

            if (swingTimer > 0) {
                const prog = Math.max(0, Math.min(1, 1 - (swingTimer / swingDuration)));
                const dir = comboStep % 2 === 0 ? 1 : -1;
                const startA = angle - 1.35 * dir;
                const endA = angle + 1.35 * dir;
                const curA = startA + (endA - startA) * prog;
                const reach = wep.reach * (comboStep === 0 ? 1.15 : 1.0);

                ctx.strokeStyle = wep.trailColor || '#fbbf24';
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
                }

                ctx.save();
                ctx.rotate(curA);
                if (wep.id === 'rusty_spade' || wep.id === 'hallowed_shovel') {
                    ctx.fillStyle = '#78350f';
                    ctx.fillRect(8, -3, 24, 6);
                    ctx.fillStyle = wep.id === 'hallowed_shovel' ? '#f59e0b' : '#94a3b8';
                    ctx.fillRect(32, -8, 14, 16);
                } else if (wep.id === 'executioner_spade') {
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
                    ctx.fillRect(8, -2, 28, 5);
                    ctx.strokeStyle = '#c084fc';
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.arc(36, 10, 18, -Math.PI * 0.7, Math.PI * 0.3);
                    ctx.stroke();
                } else if (wep.id === 'lantern_flail') {
                    ctx.strokeStyle = '#d97706';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(8, 0);
                    ctx.lineTo(26, 4);
                    ctx.stroke();
                    ctx.fillStyle = '#f59e0b';
                    ctx.fillRect(26, -3, 11, 14);
                    ctx.fillStyle = '#fde047';
                    ctx.fillRect(28, -1, 7, 10);
                }
                ctx.restore();
            } else {
                ctx.save();
                ctx.rotate(angle);
                if (wep.id === 'rusty_spade' || wep.id === 'hallowed_shovel') {
                    ctx.fillStyle = '#78350f';
                    ctx.fillRect(8, -3, 24, 6);
                    ctx.fillStyle = wep.id === 'hallowed_shovel' ? '#f59e0b' : '#94a3b8';
                    ctx.fillRect(32, -8, 14, 16);
                } else if (wep.id === 'executioner_spade') {
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
                    ctx.fillRect(8, -2, 28, 5);
                    ctx.strokeStyle = '#c084fc';
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.arc(36, 10, 18, -Math.PI * 0.7, Math.PI * 0.3);
                    ctx.stroke();
                } else if (wep.id === 'lantern_flail') {
                    ctx.strokeStyle = '#d97706';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(8, 0);
                    ctx.lineTo(26, 4);
                    ctx.stroke();
                    ctx.fillStyle = '#f59e0b';
                    ctx.fillRect(26, -3, 11, 14);
                    ctx.fillStyle = '#fde047';
                    ctx.fillRect(28, -1, 7, 10);
                }
                ctx.restore();
            }
        }
`;

html = html.replace('function render() {', `${weaponRendererCode}\n        function render() {`);

// IMPORTANT: Render squad keepers and ghosts
const renderSquadCode = `
            // Render Co-Op Squad Keepers (Up to 6 Players)
            const squadToRender = squadPeers.size > 0 ? Array.from(squadPeers.values()) : (coopPartner.active ? [coopPartner] : []);
            for (const sp of squadToRender) {
                ctx.save();
                ctx.translate(Math.round(sp.x), Math.round(sp.y));

                // 0. GHOST SPECTATOR PEER RENDERING
                if (sp.isGhost) {
                    const bobY = Math.sin(performance.now() * 0.005 + (sp.playerIndex || 0)) * 5;
                    ctx.save();
                    ctx.translate(0, bobY);

                    // Pulsing ethereal halo ring
                    ctx.beginPath();
                    ctx.arc(0, 4, 16 + Math.sin(performance.now() * 0.007) * 3, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    const gSpr = atlas.sprites['ghost_' + (sp.animFrame || 0)] || atlas.sprites['ghost_0'];
                    if (gSpr) {
                        ctx.save();
                        ctx.scale(sp.facing || 1, 1);
                        ctx.globalAlpha = 0.68;
                        ctx.drawImage(gSpr, Math.round(-gSpr.width / 2), Math.round(-gSpr.height / 2));
                        ctx.restore();
                    }

                    // Overhead ghost squad label
                    ctx.font = '800 8px Inter';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#38bdf8';
                    ctx.fillText('👻 P' + (sp.playerIndex || 2) + ' (GHOST)', 0, -22);

                    ctx.restore();
                    ctx.restore();
                    continue;
                }
                
                const pColor = SQUAD_COLORS[sp.playerIndex || 2] || '#34d399';
                ctx.strokeStyle = sp.isDowned ? '#ef4444' : pColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 8, 16, 0, Math.PI * 2);
                ctx.stroke();

                // 1. RENDER WEAPON IN UNFLIPPED COORDINATES (EXACT SAME ROTATION AS LOCAL PLAYER!)
                renderCharacterWeapon(ctx, sp, false);

                // 2. RENDER CHARACTER SPRITE FLIPPED ACCORDING TO FACING DIRECTION
                const cpSpr = atlas.sprites['player_0'];
                if (cpSpr) {
                    ctx.save();
                    ctx.scale(sp.facing || 1, 1);
                    if (sp.isDowned) {
                        ctx.rotate(Math.PI / 2);
                    }
                    ctx.drawImage(cpSpr, Math.round(-cpSpr.width / 2), Math.round(-cpSpr.height / 2));
                    ctx.restore();
                }

                // 3. OVERHEAD NAME TAG
                ctx.font = '800 8px Inter';
                ctx.textAlign = 'center';
                ctx.fillStyle = sp.isDowned ? '#f87171' : pColor;
                ctx.fillText(sp.isDowned ? 'REVIVE [E]' : (sp.playerIndex === 1 ? '👑 P1 (HOST)' : ('P' + (sp.playerIndex || 2) + ' SQUAD')), 0, -22);

                ctx.restore();
            }
`;

// Precisely target line of render()
const targetPartnerRender = `            // Render Co-Op Partner / 2nd Keeper Companion
            if (coopPartner.active) {
                ctx.save();
                ctx.translate(Math.round(coopPartner.x), Math.round(coopPartner.y));
                ctx.scale(coopPartner.facing, 1);
                
                // Cyan ring for Co-Op Partner
                ctx.strokeStyle = coopPartner.isDowned ? '#ef4444' : '#34d399';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 8, 16, 0, Math.PI * 2);
                ctx.stroke();

                const cpSpr = atlas.sprites['player_0'];
                if (cpSpr) {
                    if (coopPartner.isDowned) {
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
                        ctx.font = '800 8px Inter';
                        ctx.textAlign = 'center';
                        ctx.fillStyle = '#34d399';
                        ctx.fillText('P2 CO-OP', 0, -22);
                    }
                }
                ctx.restore();
            }`;

if (html.includes(targetPartnerRender)) {
    html = html.replace(targetPartnerRender, renderSquadCode);
    console.log('Successfully replaced targetPartnerRender with renderSquadCode!');
} else {
    console.error('CRITICAL: targetPartnerRender not found in source!');
    process.exit(1);
}

// Replace local player weapon drawing with renderCharacterWeapon call AND Ghost Avatar
const targetLocalWeaponBlock = `            const wep = player.weapon || WEAPON_ARSENAL.rusty_spade;

            // Dynamic Weapon & Swing Arc Rendering
            if (player.swingTimer > 0) {
                const prog = 1 - (player.swingTimer / player.swingDuration);
                const dir = player.comboStep % 2 === 0 ? 1 : -1;
                const startA = player.angle - 1.35 * dir;
                const endA = player.angle + 1.35 * dir;
                const curA = startA + (endA - startA) * prog;
                const reach = wep.reach * (player.comboStep === 0 ? 1.15 : 1.0);

                // Swing Arc Trail
                ctx.strokeStyle = wep.trailColor || '#fbbf24';
                ctx.lineWidth = player.comboStep === 0 ? 9 : 6;
                ctx.beginPath();
                ctx.arc(0, 0, reach - 8, Math.min(startA, curA), Math.max(startA, curA));
                ctx.stroke();

                if (wep.id === 'twin_trowels') {
                    // Secondary criss-cross arc for twin trowels
                    ctx.strokeStyle = '#67e8f9';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(0, 0, reach - 18, Math.max(startA, curA), Math.min(startA, curA));
                    ctx.stroke();
                }

                ctx.save();
                ctx.rotate(curA);

                if (wep.id === 'rusty_spade') {
                    // Standard Iron Spade
                    ctx.fillStyle = '#78350f';
                    ctx.fillRect(8, -3, reach - 22, 6);
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillRect(reach - 18, -10, 16, 20);
                    ctx.fillStyle = '#94a3b8';
                    ctx.fillRect(reach - 10, -8, 6, 16);
                } else if (wep.id === 'great_shovel') {
                    // Massive Executioner Cleaver Blade
                    ctx.fillStyle = '#1e1b4b';
                    ctx.fillRect(8, -4, reach - 26, 8);
                    ctx.fillStyle = '#ef4444';
                    ctx.fillRect(reach - 26, -14, 24, 28);
                    ctx.fillStyle = '#7f1d1d';
                    ctx.fillRect(reach - 20, -11, 14, 22);
                    // Glowing Spikes
                    ctx.fillStyle = '#fca5a5';
                    ctx.fillRect(reach - 4, -12, 4, 6);
                    ctx.fillRect(reach - 4, 6, 4, 6);
                } else if (wep.id === 'twin_trowels') {
                    // Dual Cyan Daggers
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(6, -8, reach - 20, 4);
                    ctx.fillRect(6, 4, reach - 20, 4);
                    ctx.fillStyle = '#22d3ee';
                    ctx.fillRect(reach - 16, -11, 14, 10);
                    ctx.fillRect(reach - 16, 1, 14, 10);
                } else if (wep.id === 'soulreaper_scythe') {
                    // Colossal Curved Purple War-Scythe Blade
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
                    // Chain and Burning Lantern Censer
                    ctx.strokeStyle = '#f59e0b';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(8, 0);
                    ctx.lineTo(reach - 16, 0);
                    ctx.stroke();
                    // Lantern Censer
                    ctx.fillStyle = '#d97706';
                    ctx.fillRect(reach - 16, -9, 14, 18);
                    ctx.fillStyle = '#fef08a';
                    ctx.fillRect(reach - 13, -6, 8, 12);
                }
                ctx.restore();
            } else {
                // Idle Held Weapon Stance
                ctx.save();
                ctx.rotate(player.angle + 0.38);

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
                    ctx.fillRect(8, -2, 28, 5);
                    ctx.strokeStyle = '#c084fc';
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.arc(36, 10, 18, -Math.PI * 0.7, Math.PI * 0.3);
                    ctx.stroke();
                } else if (wep.id === 'lantern_flail') {
                    ctx.strokeStyle = '#d97706';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(8, 0);
                    ctx.lineTo(26, 4);
                    ctx.stroke();
                    ctx.fillStyle = '#f59e0b';
                    ctx.fillRect(26, -3, 11, 14);
                    ctx.fillStyle = '#fde047';
                    ctx.fillRect(28, -1, 7, 10);
                }
                ctx.restore();
            }`;

const localPlayerWeaponAndGhostRender = `
            if (player.isGhost) {
                // Ghost Spectator Avatar (Local Player)
                const bobY = Math.sin(performance.now() * 0.005) * 5;
                ctx.save();
                ctx.translate(0, bobY);
                
                // Pulsing ethereal halo ring
                ctx.beginPath();
                ctx.arc(0, 4, 16 + Math.sin(performance.now() * 0.007) * 3, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Ghost sprite with translucent ethereal glow
                const gSpr = atlas.sprites['ghost_' + (player.animFrame || 0)] || atlas.sprites['ghost_0'];
                if (gSpr) {
                    ctx.save();
                    ctx.scale(player.facing || 1, 1);
                    ctx.globalAlpha = 0.72 + Math.sin(performance.now() * 0.006) * 0.15;
                    ctx.drawImage(gSpr, Math.round(-gSpr.width / 2), Math.round(-gSpr.height / 2));
                    ctx.restore();
                }

                // Overhead "👻 GHOST SPECTATOR" label
                ctx.font = '800 8px Inter';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#67e8f9';
                ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
                ctx.shadowBlur = 6;
                ctx.fillText('👻 GHOST SPECTATOR', 0, -22);
                ctx.shadowBlur = 0;

                ctx.restore();
            } else {
                renderCharacterWeapon(ctx, player, true);
            }
`;

if (html.includes(targetLocalWeaponBlock)) {
    html = html.replace(targetLocalWeaponBlock, localPlayerWeaponAndGhostRender);
    console.log('Successfully replaced local player weapon render block!');
} else {
    console.error('CRITICAL: targetLocalWeaponBlock not found in source!');
    process.exit(1);
}

// Only draw pSpr if player is not a ghost
html = html.replace(
    `const pSpr = atlas.sprites['player_' + player.animFrame];\n            if (pSpr) {`,
    `const pSpr = atlas.sprites['player_' + player.animFrame];\n            if (pSpr && !player.isGhost) {`
);

// Add overhead player label to the local player in render()
html = html.replace(
    `ctx.drawImage(pSpr, Math.round(-pSpr.width / 2), Math.round(-pSpr.height / 2));\n                ctx.restore();\n            }\n            ctx.restore();`,
    `ctx.drawImage(pSpr, Math.round(-pSpr.width / 2), Math.round(-pSpr.height / 2));\n                ctx.restore();\n            }\n            // Overhead local player label\n            if (!player.isGhost) {\n                ctx.font = '800 8px Inter';\n                ctx.textAlign = 'center';\n                const myIdx = (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.playerIndex) ? MultiplayerManager.playerIndex : 1;\n                ctx.fillStyle = SQUAD_COLORS[myIdx] || '#f59e0b';\n                ctx.fillText((typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isHost) ? '👑 P1 (HOST / YOU)' : ('P' + myIdx + ' (YOU)'), 0, -22);\n            }\n            ctx.restore();`
);

// ============================================================================
// 12. ENEMY AI SYNC: CLIENTS LERP SNAPSHOT POSITIONS, HOST RUNS AI
// ============================================================================
const enemyAITarget = `            // Enemies & Multi-Phase Boss AI with Flanking & Predictive Aim
            for (let i = enemies.length - 1; i >= 0; i--) {`;

const enemyAISyncReplacement = `            // Enemies & Multi-Phase Boss AI with Flanking & Predictive Aim
            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected && !MultiplayerManager.isHost) {
                // Non-host clients smoothly follow authoritative positions sent by Host
                for (const e of enemies) {
                    if (e.targetX !== undefined) {
                        e.x += (e.targetX - e.x) * 0.45;
                        e.y += (e.targetY - e.y) * 0.45;
                    }
                    if (e.flash > 0) e.flash -= dt;
                }
            } else for (let i = enemies.length - 1; i >= 0; i--) {`;

if (html.includes(enemyAITarget)) {
    html = html.replace(enemyAITarget, enemyAISyncReplacement);
    console.log('Successfully patched enemy AI for host-authoritative lockstep sync!');
} else {
    console.error('CRITICAL: enemyAITarget not found in source!');
    process.exit(1);
}

// ============================================================================
// 13. SQUAD PEERS INTERPOLATION (ELIMINATES SHAKING)
// ============================================================================
html = html.replace(
    `if (coopPartner.active) {\n                updateCoopPartner(dt);\n            }`,
    `if (coopPartner.active) {\n                updateCoopPartner(dt);\n            }\n            // Smooth interpolation for squad peers (eliminated shaking)\n            for (const sp of squadPeers.values()) {\n                const lf = Math.min(1.0, dt * 20);\n                sp.x += (sp.targetX - sp.x) * lf;\n                sp.y += (sp.targetY - sp.y) * lf;\n                sp.angle = sp.targetAngle !== undefined ? sp.targetAngle : sp.angle;\n                sp.facing = sp.targetFacing !== undefined ? sp.targetFacing : sp.facing;\n                if (sp.swingTimer > 0) sp.swingTimer = Math.max(0, sp.swingTimer - dt);\n            }`
);

// ============================================================================
// 14. HOST SENDS WORLD SNAPSHOT AT END OF UPDATE(DT) (THROTTLED AT 25 HZ)
// ============================================================================
const hostSnapshotSyncCode = `
        // Authoritative Host Snapshot Generator (Lockstep Sync of Enemies, Mounds, Chests, Drops)
        let lastSnapshotSendTime = 0;
        function sendHostWorldSnapshot() {
            if (!MultiplayerManager.isConnected || !MultiplayerManager.isHost || !MultiplayerManager.roomCode) return;
            const now = performance.now();
            if (now - lastSnapshotSendTime < 40) return; // 25 Hz rate limit
            lastSnapshotSendTime = now;

            const r = currentRoom();
            if (!r) return;

            const snapshot = {
                curX: game.curX,
                curY: game.curY,
                depth: game.depth,
                roomCleared: !!r.cleared,
                portalActive: !!r.portalActive,
                enemies: enemies.map((e, idx) => ({
                    id: idx,
                    type: e.type,
                    sprite: e.sprite || e.type,
                    x: Math.round(e.x),
                    y: Math.round(e.y),
                    hp: Math.round(e.hp),
                    maxHp: Math.round(e.maxHp),
                    vx: +(e.vx || 0).toFixed(1),
                    vy: +(e.vy || 0).toFixed(1),
                    facing: e.facing || 1,
                    flash: (e.flash > 0),
                    shielded: !!e.shielded,
                    stunTimer: +(e.stunTimer || 0).toFixed(2),
                    isDummy: !!e.isDummy,
                    explodes: !!e.explodes,
                    radius: e.radius || 16,
                    burrowed: !!e.burrowed,
                    isElite: !!e.isElite,
                    isBoss: !!e.isBoss,
                    animFrame: e.animFrame || 0,
                    telegraphTimer: +(e.telegraphTimer || 0).toFixed(2)
                })),
                drops: drops.map(d => ({
                    type: d.type,
                    x: Math.round(d.x),
                    y: Math.round(d.y),
                    value: d.value
                })),
                mounds: (r.mounds || []).map(m => ({
                    x: Math.round(m.x),
                    y: Math.round(m.y),
                    hp: m.hp,
                    maxHp: m.maxHp || 3,
                    isTutorialMound: !!m.isTutorialMound
                })),
                pits: (r.pits || []).map(p => ({
                    x: Math.round(p.x),
                    y: Math.round(p.y),
                    w: p.w,
                    h: p.h
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

html = html.replace('function update(dt) {', `${hostSnapshotSyncCode}\n        function update(dt) {`);

// Call sendHostWorldSnapshot at end of update(dt)
html = html.replace(
    'updateNetworkPacketPreview();',
    `updateNetworkPacketPreview();\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isHost) sendHostWorldSnapshot();`
);

// Scale audio FX by soundVolume
html = html.replace(
    `gain.gain.setValueAtTime(vol, now);`,
    `const finalVol = vol * (typeof SettingsManager !== 'undefined' ? SettingsManager.soundVolume : 0.7);\n                    gain.gain.setValueAtTime(finalVol, now);`
);

// ============================================================================
// 15. GHOST AVATARS IN SPRITE ATLAS + GHOST MECHANICS
// ============================================================================
// Add Ghost Avatar Sprites to SpriteAtlas
const ghostSpriteBakeCode = `this.bakeGrid('player_0', keeper0, pal, 3);
                this.bakeGrid('player_1', keeper1, pal, 3);

                // Ghost Spectator Avatar (2 Frames, Ethereal Cyan & Spectral White)
                const ghost0 = [
                    "......KKKK......",
                    "....KKTTTTKK....",
                    "...KTTWWWWTTK...",
                    "..KTWWWWWWWWKT..",
                    "..KTWKWKKWKWTE..",
                    "..KTWKWKKWKWTE..",
                    "..KTWWWWWWWWTE..",
                    "...KTEEEEEEETK..",
                    "...KTEETTTTEK...",
                    "..KTTEEEEEETTK..",
                    "..KTEETKKTEETK..",
                    "..KTEK....KTEK..",
                    "..KKTEK..KTKK...",
                    "....KTEK.KTEK...",
                    ".....KK...KK....",
                    "................"
                ];
                const ghost1 = [
                    "......KKKK......",
                    "....KKTTTTKK....",
                    "...KTTWWWWTTK...",
                    "..KTWWWWWWWWKT..",
                    "..KTWKWKKWKWTE..",
                    "..KTWKWKKWKWTE..",
                    "..KTWWWWWWWWTE..",
                    "...KTEEEEEEETK..",
                    "...KTEETTTTEK...",
                    "..KTTEEEEEETTK..",
                    "..KTEETKKTEETK..",
                    "..KTEK....KTEK..",
                    "...KTK..KTEKK...",
                    "...KTEK.KTEK....",
                    "....KK...KK.....",
                    "................"
                ];
                this.bakeGrid('ghost_0', ghost0, pal, 3);
                this.bakeGrid('ghost_1', ghost1, pal, 3);`;

html = html.replace(
    `this.bakeGrid('player_0', keeper0, pal, 3);\n                this.bakeGrid('player_1', keeper1, pal, 3);`,
    ghostSpriteBakeCode
);

// Add isGhost property to player object
html = html.replace(
    `let player = {\n            x: ROOM_W / 2,`,
    `let player = {\n            isGhost: false,\n            x: ROOM_W / 2,`
);

// Safeguards for Ghost: no damage taken, no attack, no dash, no ult
html = html.replace(
    'function damagePlayer(amount) {',
    'function damagePlayer(amount) {\n            if (player.isGhost) return;'
);
html = html.replace(
    'function performAttack() {',
    'function performAttack() {\n            if (player.isGhost) return;'
);
html = html.replace(
    'function performDash() {',
    'function performDash() {\n            if (player.isGhost) return;'
);
html = html.replace(
    'function performUltimate() {',
    'function performUltimate() {\n            if (player.isGhost) return;'
);
html = html.replace(
    'function updateContextPrompt() {',
    `function updateContextPrompt() {\n            if (player.isGhost) {\n                const cb = document.getElementById('context-banner');\n                if (cb) cb.classList.add('hidden');\n                return;\n            }`
);
html = html.replace(
    'function triggerGameOver() {',
    'function triggerGameOver() {\n            if (player.isGhost) return;\n            if (typeof AdManager !== \'undefined\') AdManager.onGameplayStop();'
);
html = html.replace(
    `function restartRun() {\n            document.getElementById('gameover-modal').classList.add('hidden');`,
    `function restartRun() {\n            document.getElementById('gameover-modal').classList.add('hidden');\n            const spectHud = document.getElementById('ghost-spectator-hud');\n            if (spectHud) spectHud.classList.add('hidden');\n            player.isGhost = false;`
);

// Ghost Spectator Free-Flight Noclip Movement in update(dt)
const ghostMovementCode = `            // Ghost Spectator Free-Flight Noclip Movement
            if (player.isGhost) {
                let gmx = 0, gmy = 0;
                if (touchJoystick.active && (Math.abs(touchJoystick.dx) > 0.08 || Math.abs(touchJoystick.dy) > 0.08)) {
                    gmx = touchJoystick.dx;
                    gmy = touchJoystick.dy;
                } else {
                    if (keys['KeyW'] || keys['ArrowUp']) gmy -= 1;
                    if (keys['KeyS'] || keys['ArrowDown']) gmy += 1;
                    if (keys['KeyA'] || keys['ArrowLeft']) gmx -= 1;
                    if (keys['KeyD'] || keys['ArrowRight']) gmx += 1;
                    if (gmx !== 0 || gmy !== 0) {
                        const len = Math.hypot(gmx, gmy);
                        gmx /= len; gmy /= len;
                    }
                }
                if (gmx !== 0 || gmy !== 0) {
                    player.x += gmx * (player.speed * 1.3) * dt;
                    player.y += gmy * (player.speed * 1.3) * dt;
                    player.facing = gmx >= 0 ? 1 : -1;
                    player.animTimer += dt;
                    if (player.animTimer > 0.15) {
                        player.animTimer = 0;
                        player.animFrame = 1 - player.animFrame;
                    }
                }
                player.x = Math.max(16, Math.min(ROOM_W - 16, player.x));
                player.y = Math.max(16, Math.min(ROOM_H - 16, player.y));
                if (Math.random() < 0.25) {
                    particles.push({
                        x: player.x + (Math.random() - 0.5) * 16,
                        y: player.y + 10,
                        vx: (Math.random() - 0.5) * 15,
                        vy: -15 - Math.random() * 20,
                        color: '#38bdf8', size: 3, life: 0.35, maxLife: 0.35
                    });
                }
            } else if (player.dashTimer > 0) {`;

html = html.replace(`            // Player Movement & Phantom Dash\n            if (player.dashTimer > 0) {`, `            // Player Movement & Phantom Dash\n${ghostMovementCode}`);

// Bypass door transitions and wall clamps for ghost
html = html.replace(
    `const inVertDoorGap = Math.abs(player.y - ROOM_H / 2) < DOOR_HALF_W;\n\n            if (room.cleared) {`,
    `const inVertDoorGap = Math.abs(player.y - ROOM_H / 2) < DOOR_HALF_W;\n\n            if (!player.isGhost && room.cleared) {`
);

html = html.replace(
    `player.x = Math.max(minX, Math.min(maxX, player.x));\n            player.y = Math.max(minY, Math.min(maxY, player.y));`,
    `if (!player.isGhost) {\n                player.x = Math.max(minX, Math.min(maxX, player.x));\n                player.y = Math.max(minY, Math.min(maxY, player.y));\n            }`
);

html = html.replace(
    `for (let i = drops.length - 1; i >= 0; i--) {\n                const d = drops[i];`,
    `for (let i = drops.length - 1; i >= 0; i--) {\n                const d = drops[i];\n                if (player.isGhost) continue;`
);

html = html.replace(
    `if (player.relics.iron_lantern) {`,
    `if (!player.isGhost && player.relics.iron_lantern) {`
);

// FIX ENEMY SHIELD DESYNC: evaluate (e.stunTimer || 0) <= 0
html = html.replaceAll('if (e.shielded && e.stunTimer <= 0) {', 'if (e.shielded && (e.stunTimer || 0) <= 0) {');

// ============================================================================
// 15B. AUTH-AWARE SAVE SYSTEM (GUEST EPHEMERAL VS USER ACCOUNT CLOUD SYNC)
// ============================================================================
const targetLoadSaveMeta = `        function loadMetaSave() {
            try {
                const raw = localStorage.getItem(SAVE_KEY);
                const parsed = raw ? JSON.parse(raw) : {};
                return {
                    souls: parsed.souls ?? 0,
                    bestDepth: parsed.bestDepth ?? 1,
                    selectedWeapon: parsed.selectedWeapon || 'rusty_spade',
                    upgrades: {
                        vitality: parsed.upgrades?.vitality ?? 0,
                        forgedEdge: parsed.upgrades?.forgedEdge ?? 0,
                        rerolls: parsed.upgrades?.rerolls ?? 1,
                        heirloom: parsed.upgrades?.heirloom ?? 0
                    }
                };
            } catch (e) {
                return {
                    souls: 0, bestDepth: 1, selectedWeapon: 'rusty_spade',
                    upgrades: { vitality: 0, forgedEdge: 0, rerolls: 1, heirloom: 0 }
                };
            }
        }

        function saveMeta() {
            try {
                localStorage.setItem(SAVE_KEY, JSON.stringify(metaSave));
            } catch (e) {}
        }`;

const replacementLoadSaveMeta = `        function loadMetaSave() {
            // Logged-in accounts: restore cached save from localStorage
            if (localStorage.getItem('crypt_keeper_token')) {
                try {
                    const raw = localStorage.getItem(SAVE_KEY);
                    const parsed = raw ? JSON.parse(raw) : {};
                    return {
                        souls: parsed.souls ?? 0,
                        bestDepth: parsed.bestDepth ?? 1,
                        selectedWeapon: parsed.selectedWeapon || 'rusty_spade',
                        upgrades: {
                            vitality: parsed.upgrades?.vitality ?? 0,
                            forgedEdge: parsed.upgrades?.forgedEdge ?? 0,
                            rerolls: parsed.upgrades?.rerolls ?? 1,
                            heirloom: parsed.upgrades?.heirloom ?? 0
                        }
                    };
                } catch (e) {}
            }
            // Direct Freeplay (Guest Mode): fresh ephemeral state on every reload (no progress saved)
            return {
                souls: 0, bestDepth: 1, selectedWeapon: 'rusty_spade',
                upgrades: { vitality: 0, forgedEdge: 0, rerolls: 1, heirloom: 0 }
            };
        }

        function saveMeta() {
            if (typeof AuthManager !== 'undefined') {
                AuthManager.onSaveMeta(metaSave);
            } else {
                try {
                    localStorage.setItem(SAVE_KEY, JSON.stringify(metaSave));
                } catch (e) {}
            }
        }`;

if (html.includes(targetLoadSaveMeta)) {
    html = html.replace(targetLoadSaveMeta, replacementLoadSaveMeta);
    console.log('Successfully replaced saveMeta/loadMetaSave with Auth-aware engine!');
} else {
    console.error('CRITICAL: targetLoadSaveMeta not found in source!');
    process.exit(1);
}


// ============================================================================
// 16. SETTINGS, ADS & FULL 6-PLAYER MULTIPLAYER CLIENT JAVASCRIPT MANAGERS
// ============================================================================
const clientManagersJS = `
        /**
         * ============================================================================
         * 10. USER ACCOUNT & CLOUD SAVE MANAGER (AuthManager)
         * ============================================================================
         */
        const AuthManager = {
            token: null,
            user: null, // { username, save }
            isGuest: true,
            guestSessionSave: null,

            getApiBase() {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    return '';
                }
                return 'https://crypt-keeper-roguelike.onrender.com';
            },

            init() {
                this.token = localStorage.getItem('crypt_keeper_token');
                this.guestSessionSave = {
                    souls: 0,
                    bestDepth: 1,
                    selectedWeapon: 'rusty_spade',
                    upgrades: { vitality: 0, forgedEdge: 0, rerolls: 1, heirloom: 0 }
                };

                this.bindUI();

                if (this.token) {
                    this.fetchProfile();
                } else {
                    this.setGuestMode();
                }
            },

            setGuestMode() {
                this.token = null;
                this.user = null;
                this.isGuest = true;
                this.updateUI();
            },

            bindUI() {
                // Top HUD Profile button
                const btnTopProfile = document.getElementById('btn-profile');
                if (btnTopProfile) {
                    btnTopProfile.addEventListener('click', () => {
                        this.openModal(this.isGuest ? 'login' : 'profile');
                    });
                }

                // Home screen Auth button
                const btnHomeAuth = document.getElementById('btn-home-auth');
                if (btnHomeAuth) {
                    btnHomeAuth.addEventListener('click', () => {
                        this.openModal(this.isGuest ? 'login' : 'profile');
                    });
                }

                // Game Over Claim button
                const btnGameOverClaim = document.getElementById('btn-gameover-claim');
                if (btnGameOverClaim) {
                    btnGameOverClaim.addEventListener('click', () => {
                        this.openModal('register');
                        const chkClaim = document.getElementById('reg-claim-loot');
                        if (chkClaim) chkClaim.checked = true;
                    });
                }

                // Close Modal button
                const closeAuth = document.getElementById('close-auth');
                if (closeAuth) {
                    closeAuth.addEventListener('click', () => this.closeModal());
                }

                // Tabs
                const tabLogin = document.getElementById('auth-tab-login');
                const tabReg = document.getElementById('auth-tab-register');
                if (tabLogin && tabReg) {
                    tabLogin.addEventListener('click', () => this.switchTab('login'));
                    tabReg.addEventListener('click', () => this.switchTab('register'));
                }

                // Forms
                const formLogin = document.getElementById('form-login');
                if (formLogin) {
                    formLogin.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const u = document.getElementById('login-username').value.trim();
                        const p = document.getElementById('login-password').value;
                        if (u && p) this.login(u, p);
                    });
                }

                const formReg = document.getElementById('form-register');
                if (formReg) {
                    formReg.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const u = document.getElementById('reg-username').value.trim();
                        const p = document.getElementById('reg-password').value;
                        const claim = document.getElementById('reg-claim-loot').checked;
                        if (u && p) this.register(u, p, claim);
                    });
                }

                // Profile action buttons
                const btnSync = document.getElementById('btn-sync-cloud-save');
                if (btnSync) {
                    btnSync.addEventListener('click', () => {
                        this.syncSave(metaSave, true);
                    });
                }

                const btnLogout = document.getElementById('btn-logout');
                if (btnLogout) {
                    btnLogout.addEventListener('click', () => {
                        this.logout();
                    });
                }
            },

            switchTab(tab) {
                const tabLogin = document.getElementById('auth-tab-login');
                const tabReg = document.getElementById('auth-tab-register');
                const formLogin = document.getElementById('form-login');
                const formReg = document.getElementById('form-register');
                const errLog = document.getElementById('login-error');
                const errReg = document.getElementById('register-error');
                if (errLog) errLog.classList.add('hidden');
                if (errReg) errReg.classList.add('hidden');

                if (tab === 'login') {
                    if (tabLogin) tabLogin.className = 'flex-1 py-1.5 text-center font-bold text-cyan-300 border-b-2 border-cyan-400';
                    if (tabReg) tabReg.className = 'flex-1 py-1.5 text-center text-slate-400 hover:text-slate-200';
                    if (formLogin) formLogin.classList.remove('hidden');
                    if (formReg) formReg.classList.add('hidden');
                } else {
                    if (tabReg) tabReg.className = 'flex-1 py-1.5 text-center font-bold text-amber-300 border-b-2 border-amber-400';
                    if (tabLogin) tabLogin.className = 'flex-1 py-1.5 text-center text-slate-400 hover:text-slate-200';
                    if (formLogin) formLogin.classList.add('hidden');
                    if (formReg) formReg.classList.remove('hidden');
                    this.updateLootClaimPreview();
                }
            },

            openModal(tab = 'login') {
                const modal = document.getElementById('auth-modal');
                if (!modal) return;
                modal.classList.remove('hidden');
                this.updateUI();
                if (this.isGuest) {
                    this.switchTab(tab);
                }
            },

            closeModal() {
                const modal = document.getElementById('auth-modal');
                if (modal) modal.classList.add('hidden');
            },

            updateLootClaimPreview() {
                const curSouls = player ? (player.souls || metaSave.souls || 0) : 0;
                const curDepth = game ? Math.max(game.depth || 1, metaSave.bestDepth || 1) : 1;
                const elS = document.getElementById('reg-current-souls');
                const elD = document.getElementById('reg-current-depth');
                if (elS) elS.textContent = curSouls;
                if (elD) elD.textContent = 'Depth ' + curDepth;
            },

            updateUI() {
                // Top HUD Profile Button
                const topLabel = document.getElementById('top-profile-label');
                if (topLabel) {
                    topLabel.textContent = this.isGuest ? 'GUEST' : (this.user ? this.user.username.toUpperCase() : 'ACCOUNT');
                }

                // Home Screen badge & guest warning
                const homeAccountUser = document.getElementById('home-account-username');
                const homeGuestWarn = document.getElementById('home-guest-warning');
                const btnHomeAuth = document.getElementById('btn-home-auth');

                if (homeAccountUser) {
                    homeAccountUser.textContent = this.isGuest ? 'GUEST (FREEPLAY)' : ((this.user ? this.user.username.toUpperCase() : 'USER') + ' (SAVED ☁️)');
                    homeAccountUser.className = this.isGuest ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold';
                }

                if (homeGuestWarn) {
                    if (this.isGuest) homeGuestWarn.classList.remove('hidden');
                    else homeGuestWarn.classList.add('hidden');
                }

                if (btnHomeAuth) {
                    btnHomeAuth.textContent = this.isGuest ? 'SIGN IN / REGISTER' : 'MY ACCOUNT';
                }

                // GameOver guest callout
                const goCallout = document.getElementById('gameover-guest-callout');
                if (goCallout) {
                    if (this.isGuest) goCallout.classList.remove('hidden');
                    else goCallout.classList.add('hidden');
                }

                // Auth Modal Views
                const viewGuest = document.getElementById('auth-view-guest');
                const viewProfile = document.getElementById('auth-view-profile');
                const modalTitle = document.getElementById('auth-modal-title');

                if (this.isGuest) {
                    if (viewGuest) viewGuest.classList.remove('hidden');
                    if (viewProfile) viewProfile.classList.add('hidden');
                    if (modalTitle) modalTitle.textContent = 'ACCOUNT & CLOUD SAVE';
                    this.updateLootClaimPreview();
                } else {
                    if (viewGuest) viewGuest.classList.add('hidden');
                    if (viewProfile) viewProfile.classList.remove('hidden');
                    if (modalTitle) modalTitle.textContent = 'PLAYER PROFILE & CLOUD SAVE';
                    const profUser = document.getElementById('profile-username');
                    const profSouls = document.getElementById('profile-souls');
                    const profDepth = document.getElementById('profile-depth');
                    if (profUser && this.user) profUser.textContent = this.user.username;
                    if (profSouls) profSouls.textContent = metaSave.souls || 0;
                    if (profDepth) profDepth.textContent = metaSave.bestDepth || 1;
                }
            },

            async login(username, password) {
                const btn = document.getElementById('btn-submit-login');
                const errEl = document.getElementById('login-error');
                if (btn) { btn.disabled = true; btn.textContent = 'SIGNING IN...'; }
                if (errEl) errEl.classList.add('hidden');

                try {
                    const res = await fetch(this.getApiBase() + '/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    if (!data.ok) {
                        throw new Error(data.error || 'Invalid credentials');
                    }

                    this.token = data.token;
                    this.user = data.user;
                    this.isGuest = false;
                    localStorage.setItem('crypt_keeper_token', this.token);

                    if (data.user.save) {
                        metaSave = JSON.parse(JSON.stringify(data.user.save));
                        player.souls = metaSave.souls;
                        if (WEAPON_ARSENAL[metaSave.selectedWeapon]) player.weapon = WEAPON_ARSENAL[metaSave.selectedWeapon];
                        try {
                            localStorage.setItem(SAVE_KEY, JSON.stringify(metaSave));
                        } catch (e) {}
                    }

                    this.updateUI();
                    updateHUD();
                    if (typeof SettingsManager !== 'undefined') SettingsManager.updateHomeScreenMeta();
                    this.closeModal();
                    sfx.play('levelup');
                    addFloatingText(player.x, player.y - 30, 'WELCOME, ' + data.user.username.toUpperCase() + '!', '#fbbf24', 18);
                } catch (err) {
                    if (errEl) {
                        errEl.textContent = err.message;
                        errEl.classList.remove('hidden');
                    }
                } finally {
                    if (btn) { btn.disabled = false; btn.textContent = 'SIGN IN TO ACCOUNT'; }
                }
            },

            async register(username, password, claimGuestLoot = false) {
                const btn = document.getElementById('btn-submit-register');
                const errEl = document.getElementById('register-error');
                if (btn) { btn.disabled = true; btn.textContent = 'CREATING ACCOUNT...'; }
                if (errEl) errEl.classList.add('hidden');

                try {
                    let initialSave = undefined;
                    if (claimGuestLoot) {
                        initialSave = {
                            souls: player ? (player.souls || metaSave.souls || 0) : (metaSave.souls || 0),
                            bestDepth: game ? Math.max(game.depth || 1, metaSave.bestDepth || 1) : (metaSave.bestDepth || 1),
                            selectedWeapon: metaSave.selectedWeapon || 'rusty_spade',
                            upgrades: metaSave.upgrades || { vitality: 0, forgedEdge: 0, rerolls: 1, heirloom: 0 }
                        };
                    }

                    const res = await fetch(this.getApiBase() + '/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password, initialSave })
                    });
                    const data = await res.json();
                    if (!data.ok) {
                        throw new Error(data.error || 'Registration failed');
                    }

                    this.token = data.token;
                    this.user = data.user;
                    this.isGuest = false;
                    localStorage.setItem('crypt_keeper_token', this.token);

                    if (data.user.save) {
                        metaSave = JSON.parse(JSON.stringify(data.user.save));
                        player.souls = metaSave.souls;
                        if (WEAPON_ARSENAL[metaSave.selectedWeapon]) player.weapon = WEAPON_ARSENAL[metaSave.selectedWeapon];
                        try {
                            localStorage.setItem(SAVE_KEY, JSON.stringify(metaSave));
                        } catch (e) {}
                    }

                    this.updateUI();
                    updateHUD();
                    if (typeof SettingsManager !== 'undefined') SettingsManager.updateHomeScreenMeta();
                    this.closeModal();
                    sfx.play('levelup');
                    addFloatingText(player.x, player.y - 30, 'ACCOUNT CREATED & SAVED!', '#34d399', 18);
                } catch (err) {
                    if (errEl) {
                        errEl.textContent = err.message;
                        errEl.classList.remove('hidden');
                    }
                } finally {
                    if (btn) { btn.disabled = false; btn.textContent = 'CREATE ACCOUNT & SAVE PROGRESS'; }
                }
            },

            async fetchProfile() {
                if (!this.token) return;
                try {
                    const res = await fetch(this.getApiBase() + '/api/me', {
                        headers: { 'Authorization': 'Bearer ' + this.token }
                    });
                    if (!res.ok) {
                        throw new Error('Unauthorized');
                    }
                    const data = await res.json();
                    if (data.ok && data.user) {
                        this.user = data.user;
                        this.isGuest = false;
                        if (data.user.save) {
                            metaSave = JSON.parse(JSON.stringify(data.user.save));
                            player.souls = metaSave.souls;
                            if (WEAPON_ARSENAL[metaSave.selectedWeapon]) player.weapon = WEAPON_ARSENAL[metaSave.selectedWeapon];
                            try {
                                localStorage.setItem(SAVE_KEY, JSON.stringify(metaSave));
                            } catch (e) {}
                        }
                        this.updateUI();
                        updateHUD();
                        if (typeof SettingsManager !== 'undefined') SettingsManager.updateHomeScreenMeta();
                    }
                } catch (err) {
                    console.warn('[AuthManager] Could not sync with server:', err.message);
                }
            },

            async syncSave(saveObj, showVisualFeedback = false) {
                if (this.isGuest || !this.token) return;
                try {
                    const res = await fetch(this.getApiBase() + '/api/save', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.token
                        },
                        body: JSON.stringify({ save: saveObj })
                    });
                    const data = await res.json();
                    if (data.ok && showVisualFeedback) {
                        addFloatingText(player.x, player.y - 30, 'CLOUD SAVE SYNCED!', '#22d3ee', 16);
                        sfx.play('coin');
                        this.updateUI();
                    }
                } catch (err) {
                    console.warn('[AuthManager] Cloud save sync failed:', err.message);
                }
            },

            logout() {
                localStorage.removeItem('crypt_keeper_token');
                localStorage.removeItem(SAVE_KEY);
                this.setGuestMode();

                // Reset to fresh guest state
                metaSave = {
                    souls: 0,
                    bestDepth: 1,
                    selectedWeapon: 'rusty_spade',
                    upgrades: { vitality: 0, forgedEdge: 0, rerolls: 1, heirloom: 0 }
                };
                player.souls = 0;
                player.weapon = WEAPON_ARSENAL.rusty_spade;

                this.updateUI();
                updateHUD();
                if (typeof SettingsManager !== 'undefined') SettingsManager.updateHomeScreenMeta();
                this.closeModal();
                sfx.play('dash');
                addFloatingText(player.x, player.y - 30, 'SWITCHED TO GUEST FREEPLAY', '#38bdf8', 14);
            },

            onSaveMeta(saveObj) {
                if (this.isGuest) {
                    // EPHEMERAL ONLY: Do NOT write to localStorage or cloud!
                    this.guestSessionSave = JSON.parse(JSON.stringify(saveObj));
                } else {
                    // Persistent User Account: write to local cache AND sync to cloud
                    try {
                        localStorage.setItem(SAVE_KEY, JSON.stringify(saveObj));
                    } catch (e) {}
                    this.syncSave(saveObj);
                }
                this.updateUI();
            }
        };

        /**
         * ============================================================================
         * 11. EXPEDITION SETTINGS MANAGER
         * ============================================================================
         */
        const SettingsManager = {
            soundVolume: 0.7,
            screenShake: true,
            dmgNumbers: true,
            showAdBanner: true,

            init() {
                this.load();
                this.bindUI();
                this.applySettings();
            },

            load() {
                try {
                    const saved = localStorage.getItem('crypt_keeper_settings');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        if (parsed.soundVolume !== undefined) this.soundVolume = parsed.soundVolume;
                        if (parsed.screenShake !== undefined) this.screenShake = parsed.screenShake;
                        if (parsed.dmgNumbers !== undefined) this.dmgNumbers = parsed.dmgNumbers;
                        if (parsed.showAdBanner !== undefined) this.showAdBanner = parsed.showAdBanner;
                    }
                } catch (e) {
                    console.warn('Could not load settings:', e);
                }
            },

            save() {
                try {
                    localStorage.setItem('crypt_keeper_settings', JSON.stringify({
                        soundVolume: this.soundVolume,
                        screenShake: this.screenShake,
                        dmgNumbers: this.dmgNumbers,
                        showAdBanner: this.showAdBanner
                    }));
                } catch (e) {}
            },

            bindUI() {
                const volSlider = document.getElementById('slider-volume');
                const volLabel = document.getElementById('label-volume');
                if (volSlider && volLabel) {
                    volSlider.value = Math.round(this.soundVolume * 100);
                    volLabel.textContent = volSlider.value + '%';
                    volSlider.addEventListener('input', (e) => {
                        this.soundVolume = parseInt(e.target.value) / 100;
                        volLabel.textContent = e.target.value + '%';
                        this.save();
                    });
                }

                const shakeToggle = document.getElementById('toggle-screenshake');
                if (shakeToggle) {
                    shakeToggle.checked = this.screenShake;
                    shakeToggle.addEventListener('change', (e) => {
                        this.screenShake = e.target.checked;
                        this.save();
                    });
                }

                const dmgToggle = document.getElementById('toggle-dmgnumbers');
                if (dmgToggle) {
                    dmgToggle.checked = this.dmgNumbers;
                    dmgToggle.addEventListener('change', (e) => {
                        this.dmgNumbers = e.target.checked;
                        this.save();
                    });
                }

                const adToggle = document.getElementById('toggle-adbanner');
                if (adToggle) {
                    adToggle.checked = this.showAdBanner;
                    adToggle.addEventListener('change', (e) => {
                        this.showAdBanner = e.target.checked;
                        this.applySettings();
                        this.save();
                    });
                }

                // Home Screen & Settings Navigation
                const btnHomeSolo = document.getElementById('btn-home-solo');
                if (btnHomeSolo) {
                    btnHomeSolo.addEventListener('click', () => {
                        document.getElementById('home-screen').classList.add('hidden');
                        sfx.init();
                        sfx.play('levelup');
                        if (!game.running) {
                            restartRun();
                        }
                        if (typeof AdManager !== 'undefined') AdManager.onGameplayStart();
                    });
                }

                const btnHomeCoop = document.getElementById('btn-home-coop');
                if (btnHomeCoop) {
                    btnHomeCoop.addEventListener('click', () => {
                        document.getElementById('home-screen').classList.add('hidden');
                        sfx.init();
                        document.getElementById('coop-modal').classList.remove('hidden');
                        // Auto-connect to multiplayer server when clicking Co-Op
                        if (!MultiplayerManager.isConnected) {
                            MultiplayerManager.connect();
                        }
                    });
                }

                const btnTopCoop = document.getElementById('btn-coop');
                if (btnTopCoop) {
                    btnTopCoop.addEventListener('click', () => {
                        document.getElementById('coop-modal').classList.remove('hidden');
                        if (!MultiplayerManager.isConnected) {
                            MultiplayerManager.connect();
                        }
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
                        if (typeof AdManager !== 'undefined') AdManager.onGameplayStop();
                    });
                }

                const closeSettings = document.getElementById('close-settings');
                const btnSaveSettings = document.getElementById('btn-save-settings');
                if (closeSettings) closeSettings.addEventListener('click', () => this.closeModal());
                if (btnSaveSettings) btnSaveSettings.addEventListener('click', () => this.closeModal());

                this.updateHomeScreenMeta();
            },

            openModal() {
                document.getElementById('settings-modal').classList.remove('hidden');
            },

            closeModal() {
                document.getElementById('settings-modal').classList.add('hidden');
            },

            updateHomeScreenMeta() {
                const elSouls = document.getElementById('home-souls');
                const elWep = document.getElementById('home-weapon');
                const elDepth = document.getElementById('home-depth');
                if (elSouls) elSouls.textContent = metaSave.soulShards || 0;
                if (elWep && player && player.weapon) elWep.textContent = player.weapon.name.toUpperCase();
                if (elDepth) elDepth.textContent = 'DEPTH ' + (metaSave.bestDepth || 1);
            },

            applySettings() {
                const banner = document.getElementById('ad-banner-container');
                const gameContainer = document.getElementById('game-container');
                if (banner && gameContainer) {
                    if (this.showAdBanner) {
                        banner.classList.remove('hidden');
                        gameContainer.classList.remove('banner-hidden');
                    } else {
                        banner.classList.add('hidden');
                        gameContainer.classList.add('banner-hidden');
                    }
                    setTimeout(resizeCanvas, 50);
                }
            }
        };

        /**
         * ============================================================================
         * 12. WEB MONETIZATION & AD ENGINE (AdSense / Poki / CrazyGames)
         * ============================================================================
         */
        const AdManager = {
            config: {
                mode: 'portal',
                rewardAmount: 50,
                bannerRotationIntervalSec: 15,
                lastInterstitialTime: 0,
                interstitialCooldownSec: 120
            },
            adTimer: null,
            onRewardSuccess: null,
            crazyGamesReady: false,
            wasMutedBeforeAd: false,
            gameplayActive: false,

            init() {
                this.bindUI();
                this.startBannerRotation();
                this.initCrazyGamesSdk();
            },

            async initCrazyGamesSdk() {
                if (window.CrazyGames && window.CrazyGames.SDK) {
                    try {
                        console.log('[AdManager] Initializing CrazyGames SDK v3...');
                        await window.CrazyGames.SDK.init();
                        this.crazyGamesReady = true;
                        console.log('[AdManager] CrazyGames SDK v3 initialized successfully (Environment:', window.CrazyGames.SDK.environment || 'portal', ')');
                        if (window.CrazyGames.SDK.game && typeof window.CrazyGames.SDK.game.loadingStop === 'function') {
                            window.CrazyGames.SDK.game.loadingStop();
                        }
                        if (window.CrazyGames.SDK.ad && typeof window.CrazyGames.SDK.ad.hasAdblock === 'function') {
                            const blocked = await window.CrazyGames.SDK.ad.hasAdblock();
                            if (blocked) {
                                console.info('[AdManager] Ad blocker detected - simulation fallback armed.');
                            }
                        }
                    } catch (err) {
                        console.warn('[AdManager] CrazyGames SDK init warning (sandbox active):', err);
                    }
                } else {
                    console.info('[AdManager] CrazyGames SDK not loaded (running standalone / dev sandbox mode).');
                }
            },

            onGameplayStart() {
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
            },

            muteAudio() {
                this.wasMutedBeforeAd = (typeof sfx !== 'undefined' && (sfx.muted || sfx.bgmMuted));
                if (typeof sfx !== 'undefined') {
                    sfx.muted = true;
                    sfx.bgmMuted = true;
                    if (sfx.ctx && sfx.ctx.state === 'running') {
                        try { sfx.ctx.suspend(); } catch (e) {}
                    }
                }
            },

            unmuteAudio() {
                if (typeof sfx !== 'undefined') {
                    sfx.muted = this.wasMutedBeforeAd || false;
                    sfx.bgmMuted = this.wasMutedBeforeAd || false;
                    if (sfx.ctx && sfx.ctx.state === 'suspended' && !sfx.muted) {
                        try { sfx.ctx.resume(); } catch (e) {}
                    }
                    if (typeof sfx.setBgmMode === 'function') {
                        sfx.setBgmMode(sfx.bgmMode || 'explore');
                    }
                }
            },

            bindUI() {
                const btnCloseBanner = document.getElementById('btn-close-banner');
                if (btnCloseBanner) {
                    btnCloseBanner.addEventListener('click', () => {
                        SettingsManager.showAdBanner = false;
                        SettingsManager.applySettings();
                        SettingsManager.save();
                    });
                }

                const btnWatchRewarded = document.getElementById('btn-watch-rewarded-ad');
                if (btnWatchRewarded) {
                    btnWatchRewarded.addEventListener('click', () => {
                        this.showRewardedAd(() => {
                            player.souls += 50;
                            metaSave.soulShards = (metaSave.soulShards || 0) + 50;
                            saveMeta();
                            updateHUD();
                            sfx.play('coin');
                            addParticles(player.x, player.y, '#c084fc', 30, 200, 5);
                            addFloatingText(player.x, player.y - 30, "+50 SOUL SHARDS!", "#c084fc", 18);
                            SettingsManager.updateHomeScreenMeta();
                        });
                    });
                }

                const btnAltarFreeSouls = document.getElementById('btn-altar-free-souls');
                if (btnAltarFreeSouls) {
                    btnAltarFreeSouls.addEventListener('click', () => {
                        this.showRewardedAd(() => {
                            player.souls += 50;
                            metaSave.soulShards = (metaSave.soulShards || 0) + 50;
                            saveMeta();
                            updateHUD();
                            sfx.play('coin');
                            addParticles(player.x, player.y, '#c084fc', 30, 200, 5);
                            addFloatingText(player.x, player.y - 30, "+50 SOUL SHARDS!", "#c084fc", 18);
                            renderAltarBlessings();
                        });
                    });
                }

                // Death Modal: Watch Ad To Revive
                const btnGameOverAdRevive = document.getElementById('btn-gameover-ad-revive');
                if (btnGameOverAdRevive) {
                    btnGameOverAdRevive.addEventListener('click', () => {
                        this.showRewardedAd(() => {
                            this.revivePlayerFromAd();
                        });
                    });
                }

                // Death Modal: Spectate As A Ghost
                const btnGameOverSpectate = document.getElementById('btn-gameover-spectate');
                if (btnGameOverSpectate) {
                    btnGameOverSpectate.addEventListener('click', () => {
                        this.enterGhostSpectatorMode();
                    });
                }

                // Death Modal: Return to Main Menu
                const btnGameOverMenu = document.getElementById('btn-gameover-menu');
                if (btnGameOverMenu) {
                    btnGameOverMenu.addEventListener('click', () => {
                        this.returnToMainMenu();
                    });
                }

                // Ghost Spectator HUD Buttons
                const btnSpectatorAdRevive = document.getElementById('btn-spectator-ad-revive');
                if (btnSpectatorAdRevive) {
                    btnSpectatorAdRevive.addEventListener('click', () => {
                        this.showRewardedAd(() => {
                            this.revivePlayerFromAd();
                        });
                    });
                }

                const btnSpectatorSnap = document.getElementById('btn-spectator-snap');
                if (btnSpectatorSnap) {
                    btnSpectatorSnap.addEventListener('click', () => {
                        this.snapGhostToSquad();
                    });
                }

                const btnSpectatorMenu = document.getElementById('btn-spectator-menu');
                if (btnSpectatorMenu) {
                    btnSpectatorMenu.addEventListener('click', () => {
                        this.returnToMainMenu();
                    });
                }
            },

            startBannerRotation() {
                const banners = [
                    { title: "SPONSORED: DUNGEON REPUTATION", tag: "Support Crypt Keeper development • Ready for AdSense / Poki / CrazyGames" },
                    { title: "FORGE LEGENDARY GEAR", tag: "Upgrade shovels at the Sanctuary Altar with Soul Shards!" },
                    { title: "MULTI-KEEPER CO-OP EXPEDITION", tag: "Invite up to 6 players to delve into procedural catacombs!" },
                    { title: "STEAM WISHLIST AVAILABLE", tag: "Crypt Keeper: Rogue Shovel full engine release coming soon!" }
                ];
                let bIdx = 0;
                setInterval(() => {
                    bIdx = (bIdx + 1) % banners.length;
                    const b = banners[bIdx];
                    const t = document.getElementById('ad-banner-title');
                    const tg = document.getElementById('ad-banner-tagline');
                    if (t) t.textContent = b.title;
                    if (tg) tg.textContent = b.tag;
                }, this.config.bannerRotationIntervalSec * 1000);
            },

            showRewardedAd(onSuccess) {
                this.onRewardSuccess = onSuccess;
                this.onGameplayStop();
                this.muteAudio();

                const grantReward = () => {
                    this.unmuteAudio();
                    if (this.onRewardSuccess) {
                        const cb = this.onRewardSuccess;
                        this.onRewardSuccess = null;
                        cb();
                    }
                };

                const cancelAd = () => {
                    this.unmuteAudio();
                    this.onRewardSuccess = null;
                };

                // 1. CrazyGames HTML5 SDK v3
                if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.ad) {
                    try {
                        window.CrazyGames.SDK.ad.requestAd("rewarded", {
                            adStarted: () => {
                                console.log('[CrazyGames] Rewarded video ad started');
                            },
                            adFinished: () => {
                                console.log('[CrazyGames] Rewarded video ad completed - granting reward');
                                grantReward();
                            },
                            adError: (err) => {
                                console.warn('[CrazyGames] Rewarded ad unfilled/error - safe grant fallback:', err);
                                grantReward();
                            }
                        });
                        return;
                    } catch (err) {
                        console.warn('[CrazyGames] requestAd exception:', err);
                    }
                }

                // 2. Poki Web SDK
                if (window.PokiSDK && typeof window.PokiSDK.rewardedBreak === 'function') {
                    window.PokiSDK.rewardedBreak().then((success) => {
                        if (success) grantReward();
                        else cancelAd();
                    }).catch(() => grantReward());
                    return;
                }

                // 3. Google AdSense for Games (H5 Ad Placement API)
                if (typeof window.adBreak === 'function') {
                    window.adBreak({
                        type: 'reward',
                        name: 'revive_or_souls',
                        beforeReward: (showAdFn) => { showAdFn(); },
                        adDismissed: () => { cancelAd(); },
                        adViewed: () => { grantReward(); }
                    });
                    return;
                }

                // 4. Default Simulation Mode (High-Fidelity Dev & Playtest Sandbox)
                const modal = document.getElementById('rewarded-ad-modal');
                const cd = document.getElementById('ad-countdown');
                const bar = document.getElementById('ad-progress-bar');
                const skipBtn = document.getElementById('btn-skip-ad');

                if (!modal) {
                    grantReward();
                    return;
                }

                modal.classList.remove('hidden');
                let remaining = 5;
                if (cd) cd.textContent = remaining + 's';
                if (bar) bar.style.width = '0%';
                if (skipBtn) {
                    skipBtn.disabled = true;
                    skipBtn.classList.add('text-slate-600', 'cursor-not-allowed');
                    skipBtn.classList.remove('pixel-button-gold', 'text-amber-200');
                    skipBtn.textContent = 'WAIT FOR AD (5s)';
                }

                setTimeout(() => { if (bar) bar.style.width = '100%'; }, 100);

                const interval = setInterval(() => {
                    remaining--;
                    if (cd) cd.textContent = remaining + 's';
                    if (skipBtn) skipBtn.textContent = \`WAIT FOR AD (\${remaining}s)\`;
                    if (remaining <= 0) {
                        clearInterval(interval);
                        if (skipBtn) {
                            skipBtn.disabled = false;
                            skipBtn.classList.remove('text-slate-600', 'cursor-not-allowed');
                            skipBtn.className = 'pixel-button-gold px-3 py-1.5 rounded font-pixel text-[8px] text-amber-200 w-full';
                            skipBtn.textContent = 'CLAIM REWARD & RETURN';
                            skipBtn.onclick = () => {
                                modal.classList.add('hidden');
                                grantReward();
                            };
                        }
                    }
                }, 1000);
            },

            showInterstitialAd(onComplete) {
                // In multiplayer co-op squad, NEVER interrupt clients with midgame interstitials
                if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {
                    if (onComplete) onComplete();
                    return;
                }

                const now = Date.now();
                if (now - this.config.lastInterstitialTime < this.config.interstitialCooldownSec * 1000) {
                    if (onComplete) onComplete();
                    return;
                }
                this.config.lastInterstitialTime = now;

                this.onGameplayStop();
                this.muteAudio();
                const resume = () => {
                    this.unmuteAudio();
                    this.onGameplayStart();
                    if (onComplete) onComplete();
                };

                // 1. CrazyGames HTML5 SDK v2 / v3
                if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.ad) {
                    try {
                        window.CrazyGames.SDK.ad.requestAd("midgame", {
                            adStarted: () => {
                                console.log('[CrazyGames] Midgame interstitial started');
                            },
                            adFinished: () => {
                                console.log('[CrazyGames] Midgame interstitial completed');
                                resume();
                            },
                            adError: (err) => {
                                console.warn('[CrazyGames] Midgame interstitial error:', err);
                                resume();
                            }
                        });
                        return;
                    } catch (e) {
                        console.warn('[CrazyGames] requestAd midgame exception:', e);
                        resume();
                        return;
                    }
                }

                // 2. Poki Web SDK
                if (window.PokiSDK && typeof window.PokiSDK.commercialBreak === 'function') {
                    window.PokiSDK.commercialBreak().then(() => {
                        resume();
                    }).catch(() => {
                        resume();
                    });
                    return;
                }

                // 3. Fallback: No ad provider available or local dev
                resume();
            },

            revivePlayerFromAd() {
                const goModal = document.getElementById('gameover-modal');
                if (goModal) goModal.classList.add('hidden');
                const spectHud = document.getElementById('ghost-spectator-hud');
                if (spectHud) spectHud.classList.add('hidden');

                player.isGhost = false;
                player.hp = Math.round(player.maxHp * 0.5);
                player.invulnTimer = 2.5;
                game.running = true;
                game.paused = false;
                this.onGameplayStart();
                sfx.play('levelup');
                triggerJuice(0.18, 20, 60);
                addParticles(player.x, player.y, '#22d3ee', 45, 240, 7);
                addFloatingText(player.x, player.y - 30, "⚥ REBIRTH GRANTED!", "#22d3ee", 18);
                updateHUD();

                if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {
                    MultiplayerManager.sendAction('revived', { x: player.x, y: player.y });
                    MultiplayerManager.sendPlayerSync();
                }
            },

            enterGhostSpectatorMode() {
                const goModal = document.getElementById('gameover-modal');
                if (goModal) goModal.classList.add('hidden');
                const spectHud = document.getElementById('ghost-spectator-hud');
                if (spectHud) spectHud.classList.remove('hidden');

                player.isGhost = true;
                player.hp = 0;
                game.running = true;
                game.paused = false;
                this.onGameplayStart();
                sfx.play('dash');
                triggerJuice(0.08, 10, 30);
                addParticles(player.x, player.y, '#38bdf8', 35, 180, 5);
                addFloatingText(player.x, player.y - 30, "👻 ENTERED GHOST SPECTATOR MODE", "#67e8f9", 16);
                updateHUD();

                if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {
                    MultiplayerManager.sendAction('ghost_spectate', { x: player.x, y: player.y });
                    MultiplayerManager.sendPlayerSync();
                }
            },

            returnToMainMenu() {
                const goModal = document.getElementById('gameover-modal');
                if (goModal) goModal.classList.add('hidden');
                const spectHud = document.getElementById('ghost-spectator-hud');
                if (spectHud) spectHud.classList.add('hidden');

                this.onGameplayStop();
                player.isGhost = false;
                if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {
                    MultiplayerManager.disconnect();
                }
                restartRun();
                game.running = false;
                document.getElementById('home-screen').classList.remove('hidden');
                if (typeof SettingsManager !== 'undefined') SettingsManager.updateHomeScreenMeta();
            },

            snapGhostToSquad() {
                let targetPeer = null;
                if (typeof squadPeers !== 'undefined' && squadPeers.size > 0) {
                    for (const sp of squadPeers.values()) {
                        if (!sp.isDowned && !sp.isGhost) { targetPeer = sp; break; }
                    }
                } else if (typeof coopPartner !== 'undefined' && coopPartner.active && !coopPartner.isDowned) {
                    targetPeer = coopPartner;
                }
                if (targetPeer) {
                    player.x = targetPeer.x;
                    player.y = targetPeer.y;
                    addFloatingText(player.x, player.y - 30, "SNAPPED TO SQUAD!", "#38bdf8", 14);
                    sfx.play('dash');
                } else {
                    addFloatingText(player.x, player.y - 30, "NO LIVING TEAMMATES FOUND", "#f87171", 14);
                }
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
            targetJoinRoom: '',
            syncInterval: null,
            lastPing: 0,
            latencyMs: 0,
            playerIndex: 1,

            init() {
                const urlParams = new URLSearchParams(window.location.search);
                const roomParam = urlParams.get('room') || urlParams.get('join');
                if (roomParam) {
                    this.targetJoinRoom = roomParam.trim().toUpperCase();
                }

                const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
                const defaultUrl = isLocal
                    ? ((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + (window.location.host || 'localhost:3000'))
                    : 'wss://crypt-keeper-roguelike.onrender.com';
                this.serverUrl = defaultUrl;

                this.bindUI();

                // If launched with a ?room= URL parameter, open coop modal and auto-connect
                if (this.targetJoinRoom) {
                    const coopModal = document.getElementById('coop-modal');
                    if (coopModal) coopModal.classList.remove('hidden');
                    const homeScreen = document.getElementById('home-screen');
                    if (homeScreen) homeScreen.classList.add('hidden');
                    this.connect(this.targetJoinRoom);
                }
            },

            bindUI() {
                const btnJoin = document.getElementById('btn-join-session');
                const inputCode = document.getElementById('input-coop-code');
                if (btnJoin && inputCode) {
                    btnJoin.addEventListener('click', () => {
                        const code = inputCode.value.trim().toUpperCase();
                        if (code) this.connect(code);
                    });
                }

                const btnLaunch = document.getElementById('btn-launch-expedition');
                if (btnLaunch) {
                    btnLaunch.addEventListener('click', () => {
                        this.launchExpedition();
                    });
                }

                const btnLeave = document.getElementById('btn-leave-coop-lobby');
                if (btnLeave) {
                    btnLeave.addEventListener('click', () => {
                        document.getElementById('coop-modal').classList.add('hidden');
                    });
                }

                const btnCopyCode = document.getElementById('btn-copy-code');
                if (btnCopyCode) {
                    btnCopyCode.addEventListener('click', () => {
                        copyTextToClipboard(this.roomCode || 'NO-ROOM', btnCopyCode, 'COPIED!');
                    });
                }

                const btnCopyInvite = document.getElementById('btn-copy-invite-link');
                if (btnCopyInvite) {
                    btnCopyInvite.addEventListener('click', () => {
                        const link = window.location.origin + window.location.pathname + '?room=' + (this.roomCode || '');
                        copyTextToClipboard(link, btnCopyInvite, 'LINK COPIED!');
                    });
                }
            },

            connect(joinCode = null) {
                if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
                    if (joinCode) this.joinRoom(joinCode);
                    return;
                }

                this.updateNetUI('connecting', 'Connecting to 6P Server...');

                try {
                    this.ws = new WebSocket(this.serverUrl);
                } catch (e) {
                    this.updateNetUI('error', 'Server unreachable');
                    return;
                }

                this.ws.onopen = () => {
                    this.isConnected = true;
                    this.updateNetUI('connected', 'Connected to Crypt Server');
                    if (joinCode) {
                        this.joinRoom(joinCode);
                    } else if (this.targetJoinRoom) {
                        this.joinRoom(this.targetJoinRoom);
                        this.targetJoinRoom = '';
                    } else {
                        this.createRoom();
                    }
                    this.startSyncLoop();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        this.handleMessage(msg);
                    } catch (err) {
                        console.error('Multiplayer packet parse error:', err);
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
                if (dot) {
                    dot.className = 'w-3 h-3 rounded-full shrink-0 ' + (
                        status === 'connected' ? 'bg-emerald-400' :
                        status === 'connecting' ? 'bg-amber-400 animate-pulse' :
                        'bg-red-500'
                    );
                }
                if (text) text.textContent = label;
            },

            updateSquadUI(playersList) {
                const totalInRoom = playersList ? playersList.length : (squadPeers.size + 1);
                const badge = document.getElementById('squad-count-badge');
                if (badge) badge.textContent = \`SQUAD: \${totalInRoom} / 6\`;

                for (let i = 1; i <= 6; i++) {
                    const slot = document.getElementById('slot-p' + i);
                    if (!slot) continue;

                    const isMe = (i === this.playerIndex);
                    let isOccupied = false;
                    let occupantName = '';

                    if (playersList) {
                        const pInfo = playersList.find(p => p.index === i);
                        if (pInfo) {
                            isOccupied = true;
                            occupantName = pInfo.name || ('Keeper ' + i);
                        }
                    } else {
                        if (isMe) isOccupied = true;
                        for (const peer of squadPeers.values()) {
                            if (peer.playerIndex === i) {
                                isOccupied = true;
                                occupantName = 'Keeper ' + i;
                            }
                        }
                    }

                    if (isMe) {
                        slot.className = 'pixel-panel p-2 rounded border-cyan-400 bg-cyan-950/40 text-[8px] font-pixel flex items-center gap-2 ring-1 ring-cyan-400';
                        slot.innerHTML = \`<span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span><div><div class="text-cyan-300 font-bold">P\${i} (YOU)</div><div class="text-[7px] text-emerald-400">Ready in Crypt</div></div>\`;
                    } else if (isOccupied) {
                        slot.className = 'pixel-panel p-2 rounded border-slate-700 bg-slate-900/60 text-[8px] font-pixel flex items-center gap-2';
                        slot.innerHTML = \`<span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><div><div class="text-emerald-300 font-bold">\${occupantName || ('P' + i)}</div><div class="text-[7px] text-slate-400">Connected</div></div>\`;
                    } else {
                        slot.className = 'pixel-panel p-2 rounded border-slate-800 bg-slate-950/40 text-[8px] font-pixel flex items-center gap-2 opacity-60';
                        slot.innerHTML = \`<span class="w-2.5 h-2.5 rounded-full bg-slate-700"></span><div><div class="text-slate-400">P\${i} (OPEN)</div><div class="text-[7px] text-slate-600">Awaiting Keeper...</div></div>\`;
                    }
                }

                // Only Host can see/press START EXPEDITION
                const btnLaunch = document.getElementById('btn-launch-expedition');
                if (btnLaunch) {
                    if (this.isHost) {
                        btnLaunch.disabled = false;
                        btnLaunch.className = 'pixel-button-gold flex-1 py-3 rounded font-pixel text-xs text-amber-200 tracking-wider shadow-lg flex items-center justify-center gap-2';
                        btnLaunch.innerHTML = '<span>🚀</span> START EXPEDITION (ENTER DUNGEON)';
                    } else {
                        btnLaunch.disabled = true;
                        btnLaunch.className = 'pixel-button flex-1 py-3 rounded font-pixel text-[9px] text-slate-400 cursor-not-allowed opacity-75';
                        btnLaunch.innerHTML = '<span>⏳</span> WAITING FOR HOST TO START...';
                    }
                }
            },

            createRoom() {
                if (!this.isConnected) return;
                const myName = (typeof AuthManager !== 'undefined' && AuthManager.user) ? AuthManager.user.username : 'Guest P1';
                this.ws.send(JSON.stringify({ type: 'create_room', name: myName }));
            },

            joinRoom(code) {
                if (!this.isConnected) return;
                const myName = (typeof AuthManager !== 'undefined' && AuthManager.user) ? AuthManager.user.username : 'Guest Keeper';
                this.ws.send(JSON.stringify({ type: 'join_room', roomCode: code, name: myName }));
            },

            sendAction(action, data = {}) {
                if (!this.isConnected || !this.roomCode) return;
                this.ws.send(JSON.stringify({
                    type: 'player_action',
                    action,
                    data
                }));
            },

            broadcastAction(action, data = {}) {
                return this.sendAction(action, data);
            },

            disconnect() {
                if (this.syncInterval) clearInterval(this.syncInterval);
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.close();
                }
                this.isConnected = false;
                this.isHost = false;
                this.roomCode = '';
                squadPeers.clear();
                this.updateSquadUI();
                this.updateNetUI('offline', 'OFFLINE (Solo/AI mode)');
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

            launchExpedition() {
                if (!this.isConnected || !this.isHost) return;
                this.ws.send(JSON.stringify({ type: 'launch_game' }));
                document.getElementById('coop-modal').classList.add('hidden');
                restartRun();
                if (typeof AdManager !== 'undefined') AdManager.onGameplayStart();
            },

            startSyncLoop() {
                if (this.syncInterval) clearInterval(this.syncInterval);
                this.syncInterval = setInterval(() => {
                    this.sendPlayerSync();
                }, 33); // 30 Hz local player sync
            },

            sendPlayerSync() {
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
                        isDowned: player.hp <= 0 && !player.isGhost,
                        isGhost: !!player.isGhost,
                        weaponId: player.weapon ? player.weapon.id : 'rusty_spade'
                    }
                }));
            },

            handleMessage(msg) {
                switch (msg.type) {
                    case 'room_created':
                        this.roomCode = msg.roomCode;
                        this.isHost = true;
                        this.playerIndex = msg.playerIndex || 1;
                        document.getElementById('coop-room-code').textContent = msg.roomCode;
                        game.multiplayerSeed = msg.seed || 12345;
                        this.updateSquadUI(msg.players);
                        addFloatingText(player.x, player.y - 30, "ROOM CREATED: " + msg.roomCode, "#fbbf24", 16);
                        break;

                    case 'room_joined':
                        this.roomCode = msg.roomCode;
                        this.isHost = (msg.playerIndex === 1);
                        this.playerIndex = msg.playerIndex || 2;
                        document.getElementById('coop-room-code').textContent = msg.roomCode;
                        game.multiplayerSeed = msg.seed || 12345;
                        this.updateSquadUI(msg.players);
                        addFloatingText(player.x, player.y - 30, \`JOINED AS P\${this.playerIndex}!\`, "#22d3ee", 16);
                        break;

                    case 'player_joined':
                        this.updateSquadUI(msg.players);
                        addFloatingText(player.x, player.y - 30, \`P\${msg.playerIndex} JOINED SQUAD!\`, "#34d399", 16);
                        sfx.play('coin');
                        break;

                    case 'game_launched':
                        document.getElementById('coop-modal').classList.add('hidden');
                        document.getElementById('home-screen').classList.add('hidden');
                        game.multiplayerSeed = msg.seed || game.multiplayerSeed;
                        restartRun();
                        if (typeof AdManager !== 'undefined') AdManager.onGameplayStart();
                        addFloatingText(ROOM_W / 2, ROOM_H / 2, "EXPEDITION COMMENCED!", "#fbbf24", 22);
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
                                targetAngle: msg.state.angle || 0,
                                facing: msg.state.facing || 1,
                                targetFacing: msg.state.facing || 1,
                                animFrame: msg.state.animFrame || 0,
                                hp: msg.state.hp || 100,
                                maxHp: msg.state.maxHp || 100,
                                isDowned: !!msg.state.isDowned,
                                isGhost: !!msg.state.isGhost,
                                weapon: WEAPON_ARSENAL[msg.state.weaponId] || WEAPON_ARSENAL.rusty_spade,
                                swingTimer: 0,
                                comboStep: 0
                            };
                            squadPeers.set(msg.peerId, peer);
                            this.updateSquadUI();
                        }
                        const s = msg.state;
                        peer.targetX = s.x;
                        peer.targetY = s.y;
                        peer.targetAngle = s.angle !== undefined ? s.angle : peer.targetAngle;
                        peer.targetFacing = s.facing || peer.targetFacing;
                        peer.angle = peer.targetAngle;
                        peer.facing = peer.targetFacing;
                        peer.hp = s.hp !== undefined ? s.hp : peer.hp;
                        peer.maxHp = s.maxHp || peer.maxHp;
                        peer.animFrame = s.animFrame || 0;
                        peer.isDowned = !!s.isDowned;
                        peer.isGhost = !!s.isGhost;
                        if (s.weaponId && WEAPON_ARSENAL[s.weaponId]) {
                            peer.weapon = WEAPON_ARSENAL[s.weaponId];
                        }

                        // Backward compatibility for single coopPartner
                        if (peer.playerIndex === 2) {
                            coopPartner.active = true;
                            coopPartner.isRemotePlayer = true;
                            coopPartner.x = peer.x;
                            coopPartner.y = peer.y;
                            coopPartner.targetX = peer.targetX;
                            coopPartner.targetY = peer.targetY;
                            coopPartner.facing = peer.facing;
                            coopPartner.angle = peer.angle;
                            coopPartner.hp = peer.hp;
                            coopPartner.isDowned = peer.isDowned;
                            coopPartner.weapon = peer.weapon;
                        }
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
                            actor.swingDuration = (actor.comboStep === 0 ? 0.25 : 0.18) / (actor.weapon ? actor.weapon.speedMult : 1.0);
                            actor.swingTimer = actor.swingDuration;
                            sfx.play('swing');
                        } else if (msg.action === 'interact') {
                            const curR = currentRoom();
                            if (curR && curR.mounds) {
                                for (let i = curR.mounds.length - 1; i >= 0; i--) {
                                    const m = curR.mounds[i];
                                    if (Math.hypot(m.x - (msg.data.x || 0), m.y - (msg.data.y || 0)) < 80) {
                                        excavateMound(i);
                                        break;
                                    }
                                }
                            }
                            if (curR && curR.chests) {
                                for (let i = 0; i < curR.chests.length; i++) {
                                    const ch = curR.chests[i];
                                    if (!ch.opened && Math.hypot(ch.x - (msg.data.x || 0), ch.y - (msg.data.y || 0)) < 70) {
                                        ch.opened = true;
                                        sfx.play('coin');
                                        addParticles(ch.x, ch.y, '#fbbf24', 24, 170, 5);
                                        for (let c = 0; c < 4; c++) spawnLootDrop(ch.x + (c - 1.5) * 15, ch.y + 15, 'coin', 12);
                                        break;
                                    }
                                }
                            }
                        } else if (msg.action === 'change_weapon') {
                            if (msg.data.weaponId && WEAPON_ARSENAL[msg.data.weaponId]) {
                                actor.weapon = WEAPON_ARSENAL[msg.data.weaponId];
                                sfx.play('swing');
                            }
                        } else if (msg.action === 'ghost_spectate') {
                            actor.isDowned = false;
                            actor.isGhost = true;
                            actor.hp = 0;
                            addParticles(actor.x, actor.y, '#38bdf8', 25, 160, 5);
                            addFloatingText(actor.x, actor.y - 30, \`P\${actor.playerIndex || 2} IS SPECTATING (GHOST)\`, "#67e8f9", 14);
                        } else if (msg.action === 'revived') {
                            sfx.play('levelup');
                            actor.isDowned = false;
                            actor.isGhost = false;
                            actor.hp = Math.round(actor.maxHp * 0.5);
                            addParticles(actor.x, actor.y, '#34d399', 24, 180, 5);
                            addFloatingText(actor.x, actor.y - 30, \`P\${actor.playerIndex || 2} REVIVED!\`, "#34d399", 16);
                        }
                        break;

                    case 'world_snapshot':
                        if (MultiplayerManager.isHost) return;
                        const snap = msg.snapshot;
                        if (!snap) return;

                        // Follow Host to current room if Host transitioned
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

                        if (snap.drops) {
                            drops = snap.drops.map(d => ({ x: d.x, y: d.y, type: d.type, value: d.value, bob: 0 }));
                        }

                        const snapFoes = snap.enemies || [];
                        while (enemies.length < snapFoes.length) {
                            const sf = snapFoes[enemies.length];
                            enemies.push({
                                type: sf.type,
                                sprite: sf.sprite || sf.type,
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
                                shielded: !!sf.shielded,
                                stunTimer: sf.stunTimer || 0,
                                isDummy: !!sf.isDummy,
                                explodes: !!sf.explodes,
                                radius: sf.radius || 16,
                                burrowed: sf.burrowed,
                                isElite: sf.isElite,
                                isBoss: sf.isBoss,
                                animFrame: sf.animFrame || 0,
                                telegraphTimer: sf.telegraphTimer || 0
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
                            ef.sprite = sf.sprite || sf.type;
                            ef.targetX = sf.x;
                            ef.targetY = sf.y;
                            const dist = Math.hypot(sf.x - ef.x, sf.y - ef.y);
                            if (dist > 150) {
                                ef.x = sf.x;
                                ef.y = sf.y;
                            } else {
                                ef.x += (sf.x - ef.x) * 0.55;
                                ef.y += (sf.y - ef.y) * 0.55;
                            }
                            ef.hp = sf.hp;
                            ef.maxHp = sf.maxHp;
                            ef.vx = sf.vx;
                            ef.vy = sf.vy;
                            ef.facing = sf.facing;
                            ef.flash = sf.flash ? 0.12 : 0;
                            ef.shielded = !!sf.shielded;
                            ef.stunTimer = sf.stunTimer || 0;
                            ef.isDummy = !!sf.isDummy;
                            ef.radius = sf.radius || 16;
                            ef.burrowed = sf.burrowed;
                            ef.isElite = sf.isElite;
                            ef.isBoss = sf.isBoss;
                            ef.animFrame = sf.animFrame;
                            ef.telegraphTimer = sf.telegraphTimer || 0;
                        }
                        break;

                    case 'sync_room_transition':
                        if (msg.depth !== game.depth) {
                            game.depth = msg.depth;
                            generateDungeonFloor(game.depth);
                        }
                        enterRoom(msg.curX, msg.curY, msg.dir || null);
                        addFloatingText(ROOM_W / 2, ROOM_H / 2 - 30, "SQUAD ROOM TRANSITION", "#34d399", 16);
                        break;

                    case 'partner_left':
                        squadPeers.delete(msg.peerId);
                        this.updateSquadUI(msg.players);
                        addFloatingText(player.x, player.y - 30, \`P\${msg.playerIndex} LEFT SQUAD\`, "#ef4444", 14);
                        break;

                    case 'promoted_to_host':
                        this.isHost = true;
                        this.playerIndex = 1;
                        this.updateSquadUI();
                        addFloatingText(player.x, player.y - 30, "PROMOTED TO EXPEDITION LEADER!", "#f59e0b", 18);
                        break;

                    case 'error':
                        alert(msg.message || 'Multiplayer error');
                        break;
                }
            }
        };

        function copyTextToClipboard(text, btnElement, successMsg) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    const orig = btnElement.innerHTML;
                    btnElement.innerHTML = '<span>✅</span> ' + successMsg;
                    setTimeout(() => { btnElement.innerHTML = orig; }, 1800);
                });
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                const orig = btnElement.innerHTML;
                btnElement.innerHTML = '<span>✅</span> ' + successMsg;
                setTimeout(() => { btnElement.innerHTML = orig; }, 1800);
            }
        }
`;

html = html.replace(
    'window.onload = function () {',
    `${clientManagersJS}\n\n        window.onload = function () {\n            AuthManager.init();\n            SettingsManager.init();\n            AdManager.init();\n            MultiplayerManager.init();`
);

// ============================================================================
// 17. REMOVE OBSOLETE LEGACY EVENT LISTENERS (PREVENTS SCRIPT CRASH BEFORE ONLOAD)
// ============================================================================
const legacyStartStr = "// Top Bar & Modal Controls\n        document.getElementById('btn-coop').addEventListener('click', () => {";
const legacyEndStr = 'addFloatingText(player.x, player.y - 20, "BALANCE JSON COPIED!", "#fbbf24", 14);\n        });';

if (html.includes(legacyStartStr) && html.includes(legacyEndStr)) {
    const legacyStartIdx = html.indexOf(legacyStartStr);
    const legacyEndIdx = html.indexOf(legacyEndStr) + legacyEndStr.length;
    const legacyBlock = html.substring(legacyStartIdx, legacyEndIdx);

    const safeReplacement = `// Safe Modal Controls
        document.getElementById('close-coop')?.addEventListener('click', () => {
            document.getElementById('coop-modal')?.classList.add('hidden');
            game.paused = false;
        });
        function renderGodotManifest() {}`;

    html = html.replace(legacyBlock, safeReplacement);
    console.log('Successfully replaced obsolete legacy listeners with safe modal controls!');
} else {
    console.error('CRITICAL: legacy listener block not found in source!');
    process.exit(1);
}

// Make all remaining modal event listeners null-safe with optional chaining
html = html.replace(/document\.getElementById\('([^']+)'\)\.addEventListener/g, "document.getElementById('$1')?.addEventListener");

// Write out pristine index.html
fs.writeFileSync(destPath, html, 'utf8');
console.log('SUCCESS: index.html compiled cleanly! Size:', html.length, 'bytes');
