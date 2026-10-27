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

// 2. Add Ad Banner HTML and Rewarded Modal
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

// 3. Add "Watch Ad to Rebirth" button in Game Over modal
const rewardedDeathBtn = `
            <button id="btn-watch-ad-rebirth" class="pixel-button-cyan w-full py-2.5 rounded font-pixel text-[9px] uppercase text-cyan-200 mb-2 flex items-center justify-center gap-1.5 shadow-lg border-cyan-400">
                <span>📺</span> WATCH AD TO REBIRTH (50% HP REVIVE)
            </button>
`;
html = html.replace(
    `<div id="gameover-stats" class="pixel-panel rounded p-3 mb-4 text-[9px] space-y-1.5 text-left font-pixel text-slate-300"></div>`,
    `<div id="gameover-stats" class="pixel-panel rounded p-3 mb-3 text-[9px] space-y-1.5 text-left font-pixel text-slate-300"></div>\n${rewardedDeathBtn}`
);

// 4. Add "Watch Ad for +50 Souls" button in Sanctuary Altar modal
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

// 5. Add WebSocket Connection status & Controls in Co-Op Modal
const coOpNetControls = `
                <!-- LIVE WEBSOCKET SERVER CONNECTION HUB -->
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
`;
html = html.replace(
    `<!-- TAB 1: CO-OP SESSION LOBBY -->\n            <div id="tab-content-lobby" class="space-y-3 overflow-y-auto pr-1 flex-1">`,
    `<!-- TAB 1: CO-OP SESSION LOBBY -->\n            <div id="tab-content-lobby" class="space-y-3 overflow-y-auto pr-1 flex-1">\n${coOpNetControls}`
);

// 6. Enhance coopPartner state object with interpolation and remote flag
html = html.replace(
    `let coopPartner = {`,
    `let coopPartner = {\n            isRemotePlayer: false,\n            targetX: ROOM_W / 2 - 40,\n            targetY: ROOM_H / 2 + 70,\n            targetAngle: 0,\n            targetFacing: 1,\n            comboStep: 0,`
);

// 7. Fix updateCoopPartner so that when isRemotePlayer is true, AI logic is completely disabled to eliminate shaking!
const updateCoopPartnerPatch = `        function updateCoopPartner(dt) {
            if (!coopPartner.active) return;
            const p = coopPartner;

            if (p.isDowned) {
                // Downed partner can be revived if player stands nearby and presses E
                if (Math.hypot(player.x - p.x, player.y - p.y) < 70) {
                    p.reviveTimer += dt;
                    if (p.reviveTimer >= 2.0) {
                        p.isDowned = false;
                        p.hp = Math.round(p.maxHp * 0.5);
                        p.reviveTimer = 0;
                        sfx.play('levelup');
                        addParticles(p.x, p.y, '#34d399', 24, 180, 5);
                        addFloatingText(p.x, p.y - 25, "✨ PARTNER REVIVED!", "#34d399", 16);
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
                return; // Stop here! Do NOT run AI combat or pathfinding on remote player!
            }`;
html = html.replace(
    /function updateCoopPartner\(dt\) \{[\s\S]*?if \(p\.isDowned\) \{[\s\S]*?return;\s*\}/,
    updateCoopPartnerPatch
);

// 8. Add Seeded Pseudo-Random Number Generator for Dungeon Floors
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

// 9. Sync attack swings in performAttack
html = html.replace(
    `player.swingDuration = (isFinisher ? 0.25 : 0.18) / wep.speedMult;\n            player.swingTimer = player.swingDuration;`,
    `player.swingDuration = (isFinisher ? 0.25 : 0.18) / wep.speedMult;\n            player.swingTimer = player.swingDuration;\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                MultiplayerManager.sendAction('swing', {\n                    angle: +(player.angle.toFixed(3)),\n                    facing: player.facing,\n                    comboStep: player.comboStep,\n                    weaponId: player.weapon.id,\n                    x: Math.round(player.x),\n                    y: Math.round(player.y)\n                });\n            }`
);

// 10. Sync weapon changes in Arsenal modal
html = html.replace(
    `player.weapon = w;\n                    metaSave.selectedWeapon = w.id;`,
    `player.weapon = w;\n                    metaSave.selectedWeapon = w.id;\n                    if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                        MultiplayerManager.sendAction('change_weapon', { weaponId: w.id });\n                    }`
);

// 11. Sync room changes in changeRoom(dir)
html = html.replace(
    `enterRoom(targetX, targetY, dir);\n            return true;`,
    `enterRoom(targetX, targetY, dir);\n            if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                MultiplayerManager.sendRoomTransition(targetX, targetY, dir, game.depth);\n            }\n            return true;`
);

// 12. Sync floor portal transitions
html = html.replace(
    `game.depth++;\n                generateDungeonFloor(game.depth);`,
    `game.depth++;\n                generateDungeonFloor(game.depth);\n                if (typeof MultiplayerManager !== 'undefined' && MultiplayerManager.isConnected) {\n                    MultiplayerManager.sendRoomTransition(2, 2, null, game.depth);\n                }`
);

// 13. Reusable Weapon and Attack Slash Renderer
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

// Replace existing player weapon drawing in render() with renderCharacterWeapon
html = html.replace(
    /const wep = player\.weapon \|\| WEAPON_ARSENAL\.rusty_spade;[\s\S]*?ctx\.fillRect\(24, 4, 12, 14\);\s*\}\s*ctx\.restore\(\);\s*\}/,
    `renderCharacterWeapon(ctx, player, true);`
);

// Inject renderCharacterWeapon into coopPartner rendering
html = html.replace(
    `ctx.fillText('P2 CO-OP', 0, -22);\n                    }`,
    `renderCharacterWeapon(ctx, coopPartner, false);\n                        ctx.font = '800 8px Inter';\n                        ctx.textAlign = 'center';\n                        ctx.fillStyle = '#34d399';\n                        ctx.fillText('P2 CO-OP', 0, -22);\n                    }`
);

// Insert weaponRendererCode before render()
html = html.replace('function render() {', `${weaponRendererCode}\n        function render() {`);

// 14. Inject the enhanced AdManager and MultiplayerManager modules right before window.onload
const jsModules = `
        /**
         * ============================================================================
         * 12. WEB MONETIZATION & AD ENGINE (AdManager)
         * Supports: Banner Ads, Rewarded Ads (Death Revive / Altar Souls), Interstitials
         * Modes: 'simulated' (Default Out-of-the-box), 'poki', 'crazygames', 'adsense'
         * ============================================================================
         */
        const AdManager = {
            config: {
                mode: 'simulated', // 'simulated' | 'poki' | 'crazygames' | 'adsense'
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
                // Banner action button
                const btnAction = document.getElementById('btn-ad-banner-action');
                if (btnAction) {
                    btnAction.addEventListener('click', () => {
                        window.open('https://github.com', '_blank');
                    });
                }

                // Banner toggle/minimize
                const btnToggle = document.getElementById('btn-toggle-ad-banner');
                if (btnToggle) {
                    btnToggle.addEventListener('click', () => {
                        this.toggleBanner();
                    });
                }

                // Watch Ad for Ankh Rebirth
                const btnAdRebirth = document.getElementById('btn-watch-ad-rebirth');
                if (btnAdRebirth) {
                    btnAdRebirth.addEventListener('click', () => {
                        this.showRewarded('rebirth', 'ANKH OF REBIRTH BROADCAST', 'Complete sponsored broadcast to cheat death & revive with 50% HP!', () => {
                            this.revivePlayerFromAd();
                        });
                    });
                }

                // Watch Ad for Soul Shards
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

                // Rotate simulated banners every 20 seconds
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

                // If Poki SDK is integrated
                if (this.config.mode === 'poki' && window.PokiSDK) {
                    window.PokiSDK.rewardedBreak().then((success) => {
                        if (success && onRewardSuccess) onRewardSuccess();
                    });
                    return;
                }

                // If CrazyGames SDK is integrated
                if (this.config.mode === 'crazygames' && window.CrazyGames && window.CrazyGames.SDK) {
                    window.CrazyGames.SDK.ad.requestAd("rewarded", {
                        adFinished: () => { if (onRewardSuccess) onRewardSuccess(); },
                        adError: () => { if (onRewardSuccess) onRewardSuccess(); }
                    });
                    return;
                }

                // Default Simulator Mode (5 seconds clean countdown)
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
         * 13. REAL-TIME MULTIPLAYER NETWORKING ENGINE (MultiplayerManager)
         * WebSocket Room Lobby, Live Transform Sync, Attack Relaying & Revive Mechanics
         * ============================================================================
         */
        const MultiplayerManager = {
            ws: null,
            isConnected: false,
            isHost: false,
            roomCode: '',
            partnerActive: false,
            syncInterval: null,
            lastPing: 0,
            latencyMs: 0,

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

                // Hook New Code button
                const btnNewCode = document.getElementById('btn-new-code');
                if (btnNewCode) {
                    btnNewCode.addEventListener('click', () => {
                        this.createRoom();
                    });
                }

                // Hook Join Session button
                const btnJoin = document.getElementById('btn-join-session');
                if (btnJoin) {
                    btnJoin.addEventListener('click', () => {
                        const code = (document.getElementById('input-coop-code').value || '').trim().toUpperCase();
                        if (code) this.joinRoom(code);
                    });
                }

                // Attempt auto-connect to local / hosted server
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
                    this.updateNetUI('offline', 'OFFLINE (AI Companion active)');
                    return;
                }

                this.ws.onopen = () => {
                    this.isConnected = true;
                    this.updateNetUI('online', \`CONNECTED (\${url})\`);
                    // Start heartbeats
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
                    this.updateNetUI('offline', 'OFFLINE (AI Companion active)');
                    if (this.syncInterval) clearInterval(this.syncInterval);
                };

                this.ws.onerror = () => {
                    this.isConnected = false;
                    coopPartner.isRemotePlayer = false;
                    this.updateNetUI('offline', 'OFFLINE (AI Companion active)');
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
                }, 35); // ~30 Hz state broadcast for responsive syncing
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
                        game.multiplayer.roomCode = msg.roomCode;
                        game.multiplayerSeed = msg.seed;
                        // Synchronize initial stage with room seed
                        generateDungeonFloor(game.depth);
                        document.getElementById('coop-room-code').textContent = msg.roomCode;
                        sfx.play('coin');
                        addFloatingText(player.x, player.y - 30, \`EXPEDITION \${msg.roomCode} CREATED!\`, "#f59e0b", 16);
                        break;

                    case 'room_joined':
                        this.roomCode = msg.roomCode;
                        this.isHost = false;
                        game.multiplayer.roomCode = msg.roomCode;
                        game.multiplayerSeed = msg.seed;
                        // Generate identical stage layout using host seed
                        generateDungeonFloor(game.depth);
                        document.getElementById('coop-room-code').textContent = msg.roomCode;
                        coopPartner.active = true;
                        coopPartner.isRemotePlayer = true;
                        updateCoopPartnerStatus();
                        sfx.play('levelup');
                        addFloatingText(player.x, player.y - 30, \`JOINED \${msg.roomCode}!\`, "#34d399", 16);
                        break;

                    case 'peer_joined':
                        coopPartner.active = true;
                        coopPartner.isRemotePlayer = true;
                        updateCoopPartnerStatus();
                        sfx.play('levelup');
                        addFloatingText(player.x, player.y - 30, "🤝 PARTNER JOINED YOUR EXPEDITION!", "#34d399", 18);
                        addParticles(player.x, player.y, '#34d399', 25, 200, 5);
                        break;

                    case 'partner_sync':
                        if (!coopPartner.active) {
                            coopPartner.active = true;
                            updateCoopPartnerStatus();
                        }
                        coopPartner.isRemotePlayer = true;
                        const s = msg.state;
                        // Set target positions for smooth interpolation (NO SHAKING)
                        coopPartner.targetX = s.x;
                        coopPartner.targetY = s.y;
                        coopPartner.targetAngle = s.angle !== undefined ? s.angle : coopPartner.targetAngle;
                        coopPartner.targetFacing = s.facing || coopPartner.targetFacing;
                        coopPartner.hp = s.hp !== undefined ? s.hp : coopPartner.hp;
                        coopPartner.maxHp = s.maxHp || coopPartner.maxHp;
                        coopPartner.isDowned = !!s.isDowned;
                        if (s.weaponId && WEAPON_ARSENAL[s.weaponId]) {
                            coopPartner.weapon = WEAPON_ARSENAL[s.weaponId];
                        }
                        break;

                    case 'partner_action':
                        if (msg.action === 'swing') {
                            const d = msg.data || {};
                            if (d.weaponId && WEAPON_ARSENAL[d.weaponId]) {
                                coopPartner.weapon = WEAPON_ARSENAL[d.weaponId];
                            }
                            coopPartner.comboStep = d.comboStep !== undefined ? d.comboStep : 0;
                            coopPartner.angle = d.angle !== undefined ? d.angle : coopPartner.angle;
                            coopPartner.facing = d.facing !== undefined ? d.facing : coopPartner.facing;
                            const isFinisher = coopPartner.comboStep === 0;
                            coopPartner.swingDuration = (isFinisher ? 0.25 : 0.18) / (coopPartner.weapon.speedMult || 1);
                            coopPartner.swingTimer = coopPartner.swingDuration;

                            sfx.play('swing');
                            const reach = (coopPartner.weapon.reach || 42) * (isFinisher ? 1.15 : 1.0);
                            const slashX = coopPartner.x + Math.cos(coopPartner.angle) * (reach * 0.7);
                            const slashY = coopPartner.y + Math.sin(coopPartner.angle) * (reach * 0.7);
                            addParticles(slashX, slashY, coopPartner.weapon.trailColor || '#22d3ee', isFinisher ? 16 : 8, 140, 4);

                            // Partner damage check on local enemies
                            for (let i = enemies.length - 1; i >= 0; i--) {
                                const foe = enemies[i];
                                if (!foe.burrowed && Math.hypot(foe.x - coopPartner.x, foe.y - coopPartner.y) < reach + 20) {
                                    foe.hp -= 28;
                                    foe.flash = 0.12;
                                    const kb = Math.atan2(foe.y - coopPartner.y, foe.x - coopPartner.x);
                                    foe.vx = Math.cos(kb) * 220;
                                    foe.vy = Math.sin(kb) * 220;
                                    addParticles(foe.x, foe.y, '#22d3ee', 6, 110, 3);
                                    addFloatingText(foe.x, foe.y - 12, "-28", "#67e8f9", 12);
                                    if (foe.hp <= 0) killEnemy(i);
                                }
                            }
                        } else if (msg.action === 'change_weapon') {
                            if (msg.data.weaponId && WEAPON_ARSENAL[msg.data.weaponId]) {
                                coopPartner.weapon = WEAPON_ARSENAL[msg.data.weaponId];
                                sfx.play('swing');
                                addFloatingText(coopPartner.x, coopPartner.y - 20, \`PARTNER: \${coopPartner.weapon.name}\`, "#f59e0b", 12);
                            }
                        } else if (msg.action === 'dash') {
                            sfx.play('dash');
                            addParticles(coopPartner.x, coopPartner.y, '#94a3b8', 12, 120, 4);
                        } else if (msg.action === 'deflect') {
                            sfx.play('deflect');
                            addParticles(coopPartner.x, coopPartner.y, '#f59e0b', 16, 160, 5);
                        } else if (msg.action === 'revived') {
                            sfx.play('levelup');
                            coopPartner.isDowned = false;
                            coopPartner.hp = Math.round(coopPartner.maxHp * 0.5);
                            addParticles(coopPartner.x, coopPartner.y, '#34d399', 24, 180, 5);
                        }
                        break;

                    case 'sync_room_transition':
                        if (msg.depth !== game.depth) {
                            game.depth = msg.depth;
                            generateDungeonFloor(game.depth);
                        }
                        enterRoom(msg.curX, msg.curY, msg.dir || null);
                        // Position partner by entrance door
                        const offDist = 35;
                        coopPartner.x = player.x + (msg.dir === 'E' ? -offDist : (msg.dir === 'W' ? offDist : 0));
                        coopPartner.y = player.y + (msg.dir === 'S' ? -offDist : (msg.dir === 'N' ? offDist : 30));
                        coopPartner.targetX = coopPartner.x;
                        coopPartner.targetY = coopPartner.y;
                        addFloatingText(ROOM_W / 2, ROOM_H / 2 - 30, "ROOM TRANSITION", "#34d399", 16);
                        break;

                    case 'partner_left':
                        coopPartner.isRemotePlayer = false;
                        addFloatingText(player.x, player.y - 30, "PARTNER LEFT (AI ACTIVE)", "#ef4444", 14);
                        break;

                    case 'error':
                        alert(msg.message || 'Multiplayer error');
                        break;
                }
            }
        };
`;

// Inject before window.onload
html = html.replace(
    'window.onload = function () {',
    `${jsModules}\n\n        window.onload = function () {\n            AdManager.init();\n            MultiplayerManager.init();`
);

fs.writeFileSync(destPath, html, 'utf8');
console.log('Successfully compiled index.html with complete sync enhancements!');
