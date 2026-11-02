const fs = require('fs');

console.log('Reading index.html...');
let html = fs.readFileSync('index.html', 'utf8');

// ============================================================================
// 1. HEAD & FONTS: Add Press Start 2P and Silkscreen, Fix .font-pixel CSS
// ============================================================================
html = html.replace(
    /fonts\.googleapis\.com\/css2\?[^"']+/g,
    'fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap'
);

// Fix .font-pixel to strictly use 'Press Start 2P', monospace
html = html.replace(
    /\.font-pixel\s*\{\s*font-family:\s*'Inter',\s*sans-serif;\s*\}/g,
    `.font-pixel {
            font-family: 'Press Start 2P', monospace;
            letter-spacing: 0.03em;
        }`
);

// ============================================================================
// 2. MODAL Z-INDEX: Elevate all modals to z-[60] so they are never behind home-screen (z-50)
// ============================================================================
html = html.replace(/id="altar-modal"\s+class="([^"]*)\bz-40\b([^"]*)"/g, 'id="altar-modal" class="$1z-[60]$2"');
html = html.replace(/id="arsenal-modal"\s+class="([^"]*)\bz-40\b([^"]*)"/g, 'id="arsenal-modal" class="$1z-[60]$2"');
html = html.replace(/id="draft-modal"\s+class="([^"]*)\bz-40\b([^"]*)"/g, 'id="draft-modal" class="$1z-[60]$2"');
html = html.replace(/id="shop-modal"\s+class="([^"]*)\bz-40\b([^"]*)"/g, 'id="shop-modal" class="$1z-[60]$2"');
html = html.replace(/id="codex-modal"\s+class="([^"]*)\bz-40\b([^"]*)"/g, 'id="codex-modal" class="$1z-[60]$2"');
html = html.replace(/id="coop-modal"\s+class="([^"]*)\bz-40\b([^"]*)"/g, 'id="coop-modal" class="$1z-[60]$2"');
html = html.replace(/id="settings-modal"\s+class="([^"]*)\bz-50\b([^"]*)"/g, 'id="settings-modal" class="$1z-[60]$2"');

// ============================================================================
// 3. HOME SCREEN: Remove Arsenal and Soul Altar buttons, Clean layout, Real SVGs
// ============================================================================
// Replace title bounce emojis with dark fantasy SVG badges
html = html.replace(
    /<span class="text-4xl animate-bounce">⚰️<\/span>\s*<h1 class="font-gothic text-3xl md:text-5xl text-amber-400 tracking-wider font-black drop-shadow-\[0_4px_20px_rgba\(245,158,11,0.5\)\]">\s*CRYPT KEEPER\s*<\/h1>\s*<span class="text-4xl animate-bounce">⛏️<\/span>/g,
    `<div class="flex items-center gap-3">
                    <svg class="w-8 h-8 md:w-10 md:h-10 text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 3.31 1.61 6.24 4.09 8.04l.41.3V22h11v-1.66l.41-.3A9.96 9.96 0 0 0 22 12c0-5.52-4.48-10-10-10zm-3 12c-.83 0-1.5-.67-1.5-1.5S8.17 11 9 11s1.5.67 1.5 1.5S9.83 14 9 14zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                    <h1 class="font-gothic text-3xl md:text-5xl text-amber-400 tracking-wider font-black drop-shadow-[0_4px_20px_rgba(245,158,11,0.5)]">
                        CRYPT KEEPER
                    </h1>
                    <svg class="w-8 h-8 md:w-10 md:h-10 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.5 2.5l2 2L6 15l-3.5.5.5-3.5L14.5 2.5zM19 7l2.5-2.5-2-2L17 5l2 2z"/>
                    </svg>
                </div>`
);

// Replace the primary action buttons and quick-access grid
const oldHomeButtonsPattern = /<!-- Primary Action Buttons -->[\s\S]*?<!-- Account \/ Cloud Save Session Bar -->/;
const newHomeButtons = `<!-- Primary Action Buttons -->
            <div class="space-y-3 max-w-sm mx-auto">
                <button id="btn-home-solo" class="pixel-button-gold w-full py-3.5 rounded-xl font-pixel text-xs md:text-sm text-amber-100 tracking-wider shadow-2xl flex items-center justify-center gap-2.5 border-amber-400">
                    <svg class="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 2.5l2 2L6 15l-3.5.5.5-3.5L14.5 2.5zM19 7l2.5-2.5-2-2L17 5l2 2z"/></svg>
                    <span>START EXPEDITION</span>
                </button>
                <button id="btn-home-coop" class="pixel-button-cyan w-full py-3 rounded-xl font-pixel text-[11px] md:text-xs text-cyan-100 tracking-wider shadow-xl flex items-center justify-center gap-2 border-cyan-400">
                    <svg class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    <span>CO-OP SQUAD (UP TO 6 PLAYERS)</span>
                </button>

                <!-- Hub Quick-Access Grid (Arsenal & Altar diegetically accessed in Sanctuary) -->
                <div class="grid grid-cols-2 gap-2.5 pt-1">
                    <button id="btn-home-codex" class="pixel-button py-2.5 rounded-lg font-pixel text-[10px] md:text-xs text-slate-200 flex items-center justify-center gap-2 border-slate-700 hover:border-cyan-400">
                        <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
                        <span>CODEX</span>
                    </button>
                    <button id="btn-home-settings" class="pixel-button py-2.5 rounded-lg font-pixel text-[10px] md:text-xs text-cyan-300 flex items-center justify-center gap-2 border-cyan-700/60 hover:border-cyan-400">
                        <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                        <span>SETTINGS</span>
                    </button>
                </div>
            </div>

            <!-- Account / Cloud Save Session Bar -->`;

html = html.replace(oldHomeButtonsPattern, newHomeButtons);

// ============================================================================
// 4. IN-GAME HUD: Replace emojis with SVG icons
// ============================================================================
// Health Heart
html = html.replace(
    /<span class="text-red-400 text-sm font-black animate-pulse">❤️<\/span>/g,
    `<svg class="w-4 h-4 text-rose-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
);

// Gold Coin
html = html.replace(
    /<span class="text-amber-400 text-xs">🪙<\/span>/g,
    `<svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6" stroke="#000" stroke-width="1.5"/></svg>`
);

// Soul Shard
html = html.replace(
    /<span class="text-purple-400 text-xs">🔮<\/span>/g,
    `<svg class="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 9l8 13 8-13-8-7zm0 3.5L17.2 9 12 17.5 6.8 9 12 5.5z"/></svg>`
);

// Rebirth Ankh
html = html.replace(
    /<span class="text-yellow-400 text-xs">☥<\/span>/g,
    `<svg class="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a4 4 0 0 0-4 4c0 2.21 1.79 4 4 4a4 4 0 0 0 4-4c0-2.21-1.79-4-4-4zm-1 9V9h2v2h4v2h-4v9h-2v-9H7v-2h4z"/></svg>`
);

// Action Dock Icons
html = html.replace(
    /<span id="hud-weapon-icon" class="text-xl group-hover:scale-110 transition-transform">⛏️<\/span>/g,
    `<svg id="hud-weapon-icon" class="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 2.5l2 2L6 15l-3.5.5.5-3.5L14.5 2.5zM19 7l2.5-2.5-2-2L17 5l2 2z"/></svg>`
);

html = html.replace(
    /<span class="text-xl group-hover:scale-110 transition-transform relative z-10">💨<\/span>/g,
    `<svg class="w-6 h-6 text-cyan-300 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8v-2H3v2zm0-4h12V7H3v2zm0 8h4v-2H3v2zm16-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`
);

html = html.replace(
    /<span class="text-xl group-hover:scale-110 transition-transform">🪦<\/span>/g,
    `<svg class="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3a6 6 0 0 1 12 0v17H6V3zm3 4v3h6V7H9zm0 5v2h6v-2H9z"/></svg>`
);

html = html.replace(
    /<span class="text-xl group-hover:scale-110 transition-transform relative z-10">⚡<\/span>/g,
    `<svg class="w-6 h-6 text-purple-300 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`
);

// Mobile Radial Buttons
html = html.replace(
    /<span id="mob-weapon-icon" class="text-2xl">⛏️<\/span>/g,
    `<svg id="mob-weapon-icon" class="w-7 h-7 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 2.5l2 2L6 15l-3.5.5.5-3.5L14.5 2.5zM19 7l2.5-2.5-2-2L17 5l2 2z"/></svg>`
);

html = html.replace(
    /<span class="text-lg relative z-10">💨<\/span>/g,
    `<svg class="w-5 h-5 text-cyan-200 relative z-10" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8v-2H3v2zm0-4h12V7H3v2zm0 8h4v-2H3v2zm16-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`
);

html = html.replace(
    /<span class="text-lg">🪦<\/span>/g,
    `<svg class="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3a6 6 0 0 1 12 0v17H6V3zm3 4v3h6V7H9zm0 5v2h6v-2H9z"/></svg>`
);

html = html.replace(
    /<span class="text-lg relative z-10">⚡<\/span>/g,
    `<svg class="w-5 h-5 text-purple-200 relative z-10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`
);

// Pause Button
html = html.replace(
    /<span class="text-sm">⏸️<\/span>/g,
    `<svg class="w-3.5 h-3.5 text-amber-200" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
);

// Context banner
html = html.replace(/<span>⛏️<\/span>/g, '');

// ============================================================================
// 5. MODAL CLOSING & NAVIGATION: Fix Co-Op & Codex closing dumping to in-game
// ============================================================================
// Close Codex listener
html = html.replace(
    /document\.getElementById\('close-codex'\)\?\.addEventListener\('click',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);/,
    `document.getElementById('close-codex')?.addEventListener('click', () => {
            document.getElementById('codex-modal')?.classList.add('hidden');
            if (!game.running) {
                document.getElementById('home-screen')?.classList.remove('hidden');
                game.paused = true;
            } else {
                game.paused = false;
            }
        });`
);

// Close Co-Op listener
html = html.replace(
    /document\.getElementById\('close-coop'\)\?\.addEventListener\('click',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);/,
    `document.getElementById('close-coop')?.addEventListener('click', () => {
            document.getElementById('coop-modal')?.classList.add('hidden');
            if (!game.running) {
                document.getElementById('home-screen')?.classList.remove('hidden');
                game.paused = true;
            } else {
                game.paused = false;
            }
        });`
);

// Leave Co-Op Lobby listener
html = html.replace(
    /const btnLeave = document\.getElementById\('btn-leave-coop-lobby'\);[\s\S]*?btnLeave\.addEventListener\('click',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);[\s\S]*?\}/,
    `const btnLeave = document.getElementById('btn-leave-coop-lobby');
                if (btnLeave) {
                    btnLeave.addEventListener('click', () => {
                        document.getElementById('coop-modal').classList.add('hidden');
                        if (!game.running) {
                            document.getElementById('home-screen')?.classList.remove('hidden');
                            game.paused = true;
                        }
                    });
                }`
);

// Close Settings listener
html = html.replace(
    /closeSettings\?\.addEventListener\('click',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);/,
    `closeSettings?.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('hidden');
            if (!game.running) {
                document.getElementById('home-screen')?.classList.remove('hidden');
                game.paused = true;
            } else {
                game.paused = false;
            }
        });`
);

// Save Settings listener
html = html.replace(
    /btnSaveSettings\?\.addEventListener\('click',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);/,
    `btnSaveSettings?.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('hidden');
            if (!game.running) {
                document.getElementById('home-screen')?.classList.remove('hidden');
                game.paused = true;
            } else {
                game.paused = false;
            }
        });`
);

// ============================================================================
// 6. WEAPON SWING ANIMATION ON EMPTY AIR: Fix mouse listeners, draw order & duration
// ============================================================================
// In mousemove: set mousePos.hasMoved = true and calculate worldX / worldY / player.angle
const oldMouseMove = `canvas.addEventListener('mousemove', (e) => {
            game.usingTouch = false;
            const rect = canvas.getBoundingClientRect();
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
        });`;

const newMouseMove = `canvas.addEventListener('mousemove', (e) => {
            game.usingTouch = false;
            const rect = canvas.getBoundingClientRect();
            mousePos.hasMoved = true;
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
            mousePos.worldX = (mousePos.x - canvas.width / 2) / game.zoom + game.camera.x;
            mousePos.worldY = (mousePos.y - canvas.height / 2) / game.zoom + game.camera.y;
            if (game.running && !game.paused) {
                player.angle = Math.atan2(mousePos.worldY - player.y, mousePos.worldX - player.x);
                player.facing = Math.cos(player.angle) >= 0 ? 1 : -1;
            }
        });`;

html = html.replace(oldMouseMove, newMouseMove);

// In mousedown: calculate angle immediately before performAttack()
const oldMouseDown = `canvas.addEventListener('mousedown', (e) => {
            game.usingTouch = false;
            if (e.button === 0) { mousePos.down = true; performAttack(); }
            else if (e.button === 2) { e.preventDefault(); performDash(); }
        });`;

const newMouseDown = `canvas.addEventListener('mousedown', (e) => {
            game.usingTouch = false;
            const rect = canvas.getBoundingClientRect();
            mousePos.hasMoved = true;
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
            mousePos.worldX = (mousePos.x - canvas.width / 2) / game.zoom + game.camera.x;
            mousePos.worldY = (mousePos.y - canvas.height / 2) / game.zoom + game.camera.y;
            if (game.running && !game.paused) {
                player.angle = Math.atan2(mousePos.worldY - player.y, mousePos.worldX - player.x);
                player.facing = Math.cos(player.angle) >= 0 ? 1 : -1;
            }
            if (e.button === 0) { mousePos.down = true; performAttack(); }
            else if (e.button === 2) { e.preventDefault(); performDash(); }
        });`;

html = html.replace(oldMouseDown, newMouseDown);

// Fix weapon drawing depth in render(): player sprite first, then renderCharacterWeapon
const oldRenderPlayerBlock = `            if (player.isGhost) {
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


            const pSpr = atlas.sprites['player_' + player.animFrame];
            if (pSpr && !player.isGhost) {
                ctx.save();
                ctx.scale(player.facing, 1);
                if (player.invulnTimer > 0 && Math.floor(performance.now() / 60) % 2 === 0) ctx.globalAlpha = 0.55;
                ctx.drawImage(pSpr, Math.round(-pSpr.width / 2), Math.round(-pSpr.height / 2));
                ctx.restore();
            }`;

const newRenderPlayerBlock = `            if (player.isGhost) {
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

                const gSpr = atlas.sprites['ghost_' + (player.animFrame || 0)] || atlas.sprites['ghost_0'];
                if (gSpr) {
                    ctx.save();
                    ctx.scale(player.facing || 1, 1);
                    ctx.globalAlpha = 0.72 + Math.sin(performance.now() * 0.006) * 0.15;
                    ctx.drawImage(gSpr, Math.round(-gSpr.width / 2), Math.round(-gSpr.height / 2));
                    ctx.restore();
                }

                ctx.font = '800 8px "Press Start 2P", monospace';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#67e8f9';
                ctx.fillText('GHOST SPECTATOR', 0, -22);

                ctx.restore();
            } else {
                // 1. Draw Player Body Sprite
                const pSpr = atlas.sprites['player_' + player.animFrame];
                if (pSpr) {
                    ctx.save();
                    ctx.scale(player.facing, 1);
                    if (player.invulnTimer > 0 && Math.floor(performance.now() / 60) % 2 === 0) ctx.globalAlpha = 0.55;
                    ctx.drawImage(pSpr, Math.round(-pSpr.width / 2), Math.round(-pSpr.height / 2));
                    ctx.restore();
                }
                // 2. Draw Weapon & Luminous Crescent Swing Arc on top so it is ALWAYS visible
                renderCharacterWeapon(ctx, player, true);
            }`;

html = html.replace(oldRenderPlayerBlock, newRenderPlayerBlock);

// In renderCharacterWeapon: fix great_shovel check and ensure robust swing sweep
html = html.replace(
    /else if \(wep\.id === 'executioner_spade'\)/g,
    `else if (wep.id === 'great_shovel' || wep.id === 'executioner_spade')`
);

// Boost swing duration in performAttack() so it is visibly clear
html = html.replace(
    /player\.swingDuration = \(isFinisher \? 0\.25 : 0\.18\) \/ wep\.speedMult;/g,
    `player.swingDuration = (isFinisher ? 0.28 : 0.22) / wep.speedMult;`
);

// ============================================================================
// 7. BOSS ONE-SHOT PREVENTION & GATING
// ============================================================================
// Increase Boss maxHp
html = html.replace(
    /const maxHp = Math\.round\(\(1150 \+ \(game\.depth - 1\) \* 650\) \* Math\.min\(2\.5, diff \* 0\.85\)\);/g,
    `const maxHp = Math.round((2800 + (game.depth - 1) * 1400) * Math.min(2.5, diff * 0.9));`
);

// Deflected Projectile Damage Cap (Prevent 840+ instant burst on boss)
html = html.replace(
    /p\.dmg \*= 3;/g,
    `p.dmg = Math.min(32, Math.round(p.dmg * 1.5));`
);

// Deflection text
html = html.replace(/addFloatingText\(p\.x, p\.y - 14, "⚡ 300% DEFLECTED!", "#fbbf24", 15\);/g,
    `addFloatingText(p.x, p.y - 14, "[DEFLECTED]", "#fbbf24", 15);`);

// In Projectile Collision with Boss: Cap damage per reflected orb
html = html.replace(
    /if \(!e\.isDummy\) e\.hp -= p\.dmg;/g,
    `let pDmg = p.dmg;
                            if (e.isBoss) {
                                pDmg = Math.min(24, Math.round(pDmg * 0.45));
                                pDmg = Math.min(pDmg, Math.round(e.maxHp * 0.03));
                                if (e.invulnTimer > 0) pDmg = 0;
                            }
                            if (!e.isDummy) e.hp -= pDmg;`
);

// In performAttack Melee Hit on Boss: Cap max single-hit damage and enforce invulnTimer
html = html.replace(
    /const finalDmg = e\.isDummy \? 0 : Math\.round\(dmg \* stunMult \* critMult\);\s*e\.hp -= finalDmg;/g,
    `let finalDmg = e.isDummy ? 0 : Math.round(dmg * stunMult * critMult);
                        if (e.isBoss) {
                            finalDmg = Math.min(finalDmg, Math.round(e.maxHp * 0.05));
                            if (e.invulnTimer > 0) finalDmg = 0;
                        }
                        e.hp -= finalDmg;`
);

// Boss Phase 2 & Phase 3 Transitions with Invulnerability Roar
const oldBossTransition = `// Check Phase 2 Transition (<50% HP)
                    if (e.phase === 1 && e.hp <= e.maxHp * 0.5) {
                        e.phase = 2;
                        sfx.play('quake');
                        triggerJuice(0.12, 16, 50);
                        addFloatingText(e.x, e.y - 40, "🔥 PHASE 2: TITAN FRENZY! 🔥", "#f59e0b", 19);
                        document.getElementById('boss-phase-badge').textContent = 'PHASE 2: FRENZY';
                    }`;

const newBossTransition = `// 3-Stage Boss Gated Combat
                    if (e.invulnTimer > 0) {
                        e.invulnTimer -= dt;
                        addParticles(e.x, e.y, '#fbbf24', 2, 80, 3);
                    }
                    if (e.phase === 1 && e.hp <= e.maxHp * 0.65) {
                        e.phase = 2;
                        e.invulnTimer = 1.2;
                        sfx.play('quake');
                        triggerJuice(0.12, 16, 50);
                        addFloatingText(e.x, e.y - 40, "[PHASE 2: TITAN FRENZY]", "#f59e0b", 19);
                        document.getElementById('boss-phase-badge').textContent = 'PHASE 2: FRENZY';
                    } else if (e.phase === 2 && e.hp <= e.maxHp * 0.30) {
                        e.phase = 3;
                        e.invulnTimer = 1.2;
                        e.speed = Math.round(e.speed * 1.25);
                        sfx.play('quake');
                        triggerJuice(0.14, 18, 55);
                        addFloatingText(e.x, e.y - 40, "[PHASE 3: BLOOD TITAN]", "#ef4444", 20);
                        document.getElementById('boss-phase-badge').textContent = 'PHASE 3: ENRAGED';
                    }`;

html = html.replace(oldBossTransition, newBossTransition);

// ============================================================================
// 8. XP PROGRESSION & LEVELING CURVE REBALANCE
// ============================================================================
// Enemy template base XP
html = html.replace(/skeleton:\s*\{\s*hp:\s*65,\s*speed:\s*175,\s*radius:\s*18,\s*dmg:\s*18,\s*xp:\s*16/g,
    'skeleton: { hp: 65, speed: 175, radius: 18, dmg: 18, xp: 4');
html = html.replace(/zombie:\s*\{\s*hp:\s*140,\s*speed:\s*95,\s*radius:\s*21,\s*dmg:\s*28,\s*xp:\s*25/g,
    'zombie: { hp: 140, speed: 95, radius: 21, dmg: 28, xp: 7');
html = html.replace(/wraith:\s*\{\s*hp:\s*55,\s*speed:\s*215,\s*radius:\s*17,\s*dmg:\s*20,\s*xp:\s*22/g,
    'wraith: { hp: 55, speed: 215, radius: 17, dmg: 20, xp: 6');
html = html.replace(/necro:\s*\{\s*hp:\s*80,\s*speed:\s*110,\s*radius:\s*19,\s*dmg:\s*18,\s*xp:\s*30/g,
    'necro: { hp: 80, speed: 110, radius: 19, dmg: 18, xp: 10');
html = html.replace(/gargoyle:\s*\{\s*hp:\s*160,\s*speed:\s*115,\s*radius:\s*22,\s*dmg:\s*28,\s*xp:\s*36/g,
    'gargoyle: { hp: 160, speed: 115, radius: 22, dmg: 28, xp: 12');
html = html.replace(/toad:\s*\{\s*hp:\s*75,\s*speed:\s*140,\s*radius:\s*19,\s*dmg:\s*22,\s*xp:\s*24/g,
    'toad: { hp: 75, speed: 140, radius: 19, dmg: 22, xp: 6');
html = html.replace(/spider:\s*\{\s*hp:\s*68,\s*speed:\s*185,\s*radius:\s*17,\s*dmg:\s*18,\s*xp:\s*22/g,
    'spider: { hp: 68, speed: 185, radius: 17, dmg: 18, xp: 5');

// Boss XP
html = html.replace(/xp:\s*220\s*\+\s*game\.depth\s*\* 50/g, 'xp: 75 + game.depth * 25');

// Initial player nextXp
html = html.replace(/lvl:\s*1,\s*xp:\s*0,\s*nextXp:\s*50,/g, 'lvl: 1, xp: 0, nextXp: 70,');
html = html.replace(/player\.lvl = 1; player\.xp = 0; player\.nextXp = 50;/g, 'player.lvl = 1; player.xp = 0; player.nextXp = 70;');
html = html.replace(/<span id="xp-text" class="text-cyan-300\/80 text-\[10px\] ml-2">0\/50 XP<\/span>/g,
    '<span id="xp-text" class="text-cyan-300/80 text-[10px] ml-2">0/70 XP</span>');

// Leveling formula
html = html.replace(
    /player\.nextXp = Math\.round\(player\.nextXp \* 1\.35\);/g,
    'player.nextXp = Math.round(70 * Math.pow(1.5, player.lvl - 1));'
);

// ============================================================================
// 9. CLEAN CANVAS TYPOGRAPHY & STRIP ALL REMAINING PHONE EMOJIS
// ============================================================================
// Canvas fonts from Inter to Press Start 2P
html = html.replace(/ctx\.font = '(\d+)px Inter'/g, "ctx.font = '$1px \"Press Start 2P\", monospace'");
html = html.replace(/ctx\.font = '(\d+) (\d+)px Inter'/g, "ctx.font = 'bold $2px \"Press Start 2P\", monospace'");

// Floating Text emojis eradication
html = html.replace(/⚡ CRYPT EARTHQUAKE! ⚡/g, 'CRYPT EARTHQUAKE!');
html = html.replace(/🔥 \$\{player\.styleRank\} RANK/g, '${player.styleRank} RANK');
html = html.replace(/☣️ TOXIC BILE!/g, '[TOXIC BILE]');
html = html.replace(/🔥 BRIMSTONE ERUPTION!/g, '[BRIMSTONE ERUPTION]');
html = html.replace(/🏆 CRYPT LORD VANQUISHED!/g, '[CRYPT LORD VANQUISHED]');
html = html.replace(/🔓 SECTOR CLEARED — GATES UNSEALED!/g, '[SECTOR CLEARED — GATES OPEN]');
html = html.replace(/✨ KEEPER REVIVED!/g, '[KEEPER REVIVED]');
html = html.replace(/⚠️ LUNGE!/g, '[LUNGE!]');
html = html.replace(/💫 PILLAR CRASH! STUNNED 3\.2s \(200% CRITS\)!/g, '[PILLAR CRASH! STUNNED]');
html = html.replace(/⚰️ BURIED ALIVE!/g, '[BURIED ALIVE]');
html = html.replace(/☥ REBIRTH TRIGGERED!/g, '[REBIRTH TRIGGERED]');
html = html.replace(/💀 ALLY RISEN!/g, '[ALLY RISEN]');
html = html.replace(/💀 HARVEST WAVE!/g, '[HARVEST WAVE]');
html = html.replace(/💀 REAPED!/g, '[REAPED]');
html = html.replace(/💥 TITAN CLEAVE!/g, '[TITAN CLEAVE]');
html = html.replace(/🛡️ SHIELD BLOCKED!/g, '[DEFLECTED]');
html = html.replace(/💥PERFECT CRIT -/g, 'PERFECT CRIT -');
html = html.replace(/💥STUN CRIT -/g, 'STUN CRIT -');
html = html.replace(/⚥ REBIRTH GRANTED!/g, '[REBIRTH GRANTED]');
html = html.replace(/👻 ENTERED GHOST SPECTATOR MODE/g, '[GHOST SPECTATOR MODE]');
html = html.replace(/🔒 DEFEAT ENEMIES/g, 'DEFEAT ENEMIES');

// Drop float texts
html = html.replace(/`\+\$\{d\.value\}🪙`/g, '`+${d.value} GOLD`');
html = html.replace(/`\+\$\{d\.value\}🔮`/g, '`+${d.value} SOULS`');
html = html.replace(/`\+\$\{d\.value\}❤️`/g, '`+${d.value} HP`');
html = html.replace(/`\+\$\{heal\}🩸`/g, '`+${heal} HP`');

// In-canvas labels
html = html.replace(/ctx\.fillText\(`🔒 \$\{enemies\.length\}`/g, 'ctx.fillText(`LOCKED (${enemies.length})`');
html = html.replace(/ctx\.fillText\('🔮 SOUL ALTAR'/g, "ctx.fillText('SOUL ALTAR'");
html = html.replace(/ctx\.fillText\('⛏️ ARSENAL RACK'/g, "ctx.fillText('ARSENAL RACK'");
html = html.replace(/ctx\.fillText\('⚡ DEFLECT ORB OR DASH!'/g, "ctx.fillText('DEFLECT OR DASH'");
html = html.replace(/ctx\.fillText\("🕯️ CHARON'S MARKET \[E\]"/g, "ctx.fillText(\"CHARON'S MARKET [E]\"");
html = html.replace(/ctx\.fillText\('🌀 DESCEND \[E\]'/g, "ctx.fillText('DESCEND [E]'");
html = html.replace(/ctx\.fillText\('👻 P'/g, "ctx.fillText('P'");
html = html.replace(/ctx\.fillText\(sp\.isDowned \? 'REVIVE \[E\]' : \(sp\.playerIndex === 1 \? '👑 P1 \(HOST\)'/g,
    "ctx.fillText(sp.isDowned ? 'REVIVE [E]' : (sp.playerIndex === 1 ? 'P1 [HOST]'"
);
html = html.replace(/ctx\.fillText\('⚰️ PIT KILL!'/g, "ctx.fillText('PIT EXECUTION!'");
html = html.replace(/ctx\.fillText\('💫 STUNNED'/g, "ctx.fillText('STUNNED'");
html = html.replace(/ctx\.fillText\('👻 GHOST SPECTATOR'/g, "ctx.fillText('GHOST SPECTATOR'");
html = html.replace(/ctx\.fillText\(MultiplayerManager\.isHost \? '👑 P1 \(HOST \/ YOU\)'/g,
    "ctx.fillText(MultiplayerManager.isHost ? 'P1 [HOST / YOU]'"
);
html = html.replace(/document\.getElementById\('boss-name'\)\.textContent = `💀 \$\{boss\.name\}`;/g,
    "document.getElementById('boss-name').textContent = boss.name;"
);

// Co-Op Launch Button & Success button emojis
html = html.replace(/btnLaunch\.innerHTML = '<span>🚀<\/span> START EXPEDITION \(ENTER DUNGEON\)';/g,
    `btnLaunch.innerHTML = '<svg class="w-4 h-4 inline mr-1 text-cyan-300" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 2.5l2 2L6 15l-3.5.5.5-3.5L14.5 2.5zM19 7l2.5-2.5-2-2L17 5l2 2z"/></svg> START EXPEDITION (ENTER DUNGEON)';`
);
html = html.replace(/btnElement\.innerHTML = '<span>✅<\/span> ' \+ successMsg;/g,
    `btnElement.innerHTML = '<svg class="w-4 h-4 inline mr-1 text-emerald-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> ' + successMsg;`
);

// Sound / Music toggle icons (clean SVGs instead of emojis)
html = html.replace(
    /document\.getElementById\('btn-music'\)\.textContent = sfx\.bgmMuted \? '🔇' : '🎵';/g,
    `document.getElementById('btn-music').innerHTML = sfx.bgmMuted ? '<svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>' : '<svg class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>';`
);

html = html.replace(
    /e\.currentTarget\.textContent = sfx\.bgmMuted \? '🔇' : '🎵';/g,
    `e.currentTarget.innerHTML = sfx.bgmMuted ? '<svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>' : '<svg class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>';`
);

html = html.replace(
    /e\.currentTarget\.textContent = sfx\.muted \? '🔇' : '🔊';/g,
    `e.currentTarget.innerHTML = sfx.muted ? '<svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>' : '<svg class="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';`
);

console.log('Writing updated index.html...');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html!');
