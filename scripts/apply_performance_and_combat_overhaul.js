import fs from 'fs';

const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

function mustReplace(target, replacement, label) {
    if (!html.includes(target)) {
        console.error(`❌ FAILED: ${label} not found!`);
        console.error(`Target sample: ${JSON.stringify(target.slice(0, 80))}`);
        process.exit(1);
    }
    html = html.replace(target, replacement);
    console.log(`✅ SUCCESS: ${label}`);
}

console.log(`[PERF & DIFFICULTY OVERHAUL] Loaded index.html (${html.length} bytes)...`);

// ----------------------------------------------------------------------------
// 1. PERFORMANCE: PRE-BAKE LIGHTING COOKIES IN ATLAS.INIT()
// ----------------------------------------------------------------------------
mustReplace(
`                const logoCan = document.getElementById('hud-logo-icon');
                if (logoCan) {
                    const lctx = logoCan.getContext('2d');
                    lctx.imageSmoothingEnabled = false;
                    lctx.drawImage(this.sprites['player_0'], 0, 0, 28, 28);
                }
            }`,
`                const logoCan = document.getElementById('hud-logo-icon');
                if (logoCan) {
                    const lctx = logoCan.getContext('2d');
                    lctx.imageSmoothingEnabled = false;
                    lctx.drawImage(this.sprites['player_0'], 0, 0, 28, 28);
                }

                // Pre-bake GPU-accelerated light cookie textures (0 allocations in render loop!)
                const torchCan = document.createElement('canvas');
                torchCan.width = 190; torchCan.height = 190;
                const tctx = torchCan.getContext('2d');
                const tg = tctx.createRadialGradient(95, 95, 4, 95, 95, 95);
                tg.addColorStop(0, 'rgba(251, 146, 60, 0.42)');
                tg.addColorStop(0.5, 'rgba(245, 158, 11, 0.12)');
                tg.addColorStop(1, 'rgba(0, 0, 0, 0)');
                tctx.fillStyle = tg;
                tctx.fillRect(0, 0, 190, 190);
                this.torchLightCanvas = torchCan;

                const playerCan = document.createElement('canvas');
                playerCan.width = 380; playerCan.height = 380;
                const pctx = playerCan.getContext('2d');
                const pg = pctx.createRadialGradient(190, 190, 10, 190, 190, 190);
                pg.addColorStop(0, 'rgba(251, 191, 36, 0.32)');
                pg.addColorStop(0.55, 'rgba(245, 158, 11, 0.10)');
                pg.addColorStop(1, 'rgba(0, 0, 0, 0)');
                pctx.fillStyle = pg;
                pctx.fillRect(0, 0, 380, 380);
                this.playerLightCanvas = playerCan;
            }`,
'Performance: Pre-bake lighting cookies in atlas.init'
);

// ----------------------------------------------------------------------------
// 2. PERFORMANCE: PRE-BAKE CHAMBER VIGNETTE IN BAKE ROOM BACKGROUND
// ----------------------------------------------------------------------------
mustReplace(
`                if (pillarSpr) {
                    rctx.drawImage(pillarSpr, 0, 0);
                    rctx.drawImage(pillarSpr, ROOM_W - WALL_T, 0);
                    rctx.drawImage(pillarSpr, 0, ROOM_H - WALL_T);
                    rctx.drawImage(pillarSpr, ROOM_W - WALL_T, ROOM_H - WALL_T);
                }

                room.bgCanvas = off;`,
`                if (pillarSpr) {
                    rctx.drawImage(pillarSpr, 0, 0);
                    rctx.drawImage(pillarSpr, ROOM_W - WALL_T, 0);
                    rctx.drawImage(pillarSpr, 0, ROOM_H - WALL_T);
                    rctx.drawImage(pillarSpr, ROOM_W - WALL_T, ROOM_H - WALL_T);
                }

                // Ambient Chamber Vignette (Baked ONCE into room background - 0 runtime cost)
                const chamberGrad = rctx.createRadialGradient(ROOM_W / 2, ROOM_H / 2, 260, ROOM_W / 2, ROOM_H / 2, Math.max(ROOM_W, ROOM_H) * 0.75);
                chamberGrad.addColorStop(0, 'rgba(5, 7, 11, 0.0)');
                chamberGrad.addColorStop(0.65, 'rgba(5, 7, 11, 0.32)');
                chamberGrad.addColorStop(1.0, 'rgba(5, 7, 11, 0.78)');
                rctx.fillStyle = chamberGrad;
                rctx.fillRect(0, 0, ROOM_W, ROOM_H);

                room.bgCanvas = off;`,
'Performance: Bake ambient chamber vignette once into room background'
);

// ----------------------------------------------------------------------------
// 3. PERFORMANCE: REPLACE DYNAMIC GRADIENTS IN RENDER() WITH GPU FAST BLIT
// ----------------------------------------------------------------------------
mustReplace(
`            // Dynamic Atmospheric Dungeon Lighting & Torch Atmosphere
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
            ctx.restore();`,
`            // Dynamic Atmospheric Dungeon Lighting (GPU Fast Blitted Cookies - 0 Allocations)
            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            // Warm Player Lantern Glow (Fast GPU Blit)
            if (atlas.playerLightCanvas) {
                ctx.drawImage(atlas.playerLightCanvas, Math.round(player.x - 190), Math.round(player.y - 190));
            }

            // Wall Torch Flickering Glows (Fast GPU Blit)
            if (atlas.torchLightCanvas) {
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
                const tFlicker = 0.94 + Math.sin(performance.now() * 0.007) * 0.06;
                const sz = Math.round(170 * tFlicker);
                const halfSz = sz / 2;
                for (const t of torches) {
                    ctx.drawImage(atlas.torchLightCanvas, Math.round(t.x - halfSz), Math.round(t.y - halfSz), sz, sz);
                }
            }
            ctx.restore();`,
'Performance: GPU Fast Blitted Lighting Cookies in render()'
);

// ----------------------------------------------------------------------------
// 4. PERFORMANCE & FEEL: REMOVE HIT-STOP FROM EMPTY SWINGS (ONLY ON ENEMY HIT)
// ----------------------------------------------------------------------------
mustReplace(
`            player.scaleX = isFinisher ? 1.32 : 1.18;
            player.scaleY = isFinisher ? 0.74 : 0.86;
            triggerJuice(isFinisher ? 0.055 : 0.025, isFinisher ? 9 : 4, isFinisher ? 32 : 15);
            sfx.play('swing');`,
`            player.scaleX = isFinisher ? 1.32 : 1.18;
            player.scaleY = isFinisher ? 0.74 : 0.86;
            sfx.play('swing');`,
'Performance & Feel: Smooth empty swing without freezing simulation'
);

// ----------------------------------------------------------------------------
// 5. COMBAT BALANCE: BALANCED KNOCKBACK & HIT-STOP ON CONFIRMED ENEMY IMPACT
// ----------------------------------------------------------------------------
mustReplace(
`                        const kb = (e.isBoss ? 90 : 360) * player.knockbackMult * wep.knockbackMult * (isFinisher ? 1.4 : 1.0);
                        e.vx = Math.cos(angToE) * kb;
                        e.vy = Math.sin(angToE) * kb;
                        e.flash = 0.14;
                        sfx.play('hit');`,
`                        const baseKb = e.isBoss ? 75 : (e.type === 'zombie' || e.type === 'gargoyle' ? 95 : 175);
                        const kb = baseKb * player.knockbackMult * wep.knockbackMult * (isFinisher ? 1.45 : 1.0);
                        e.vx = Math.cos(angToE) * kb;
                        e.vy = Math.sin(angToE) * kb;
                        e.flash = 0.14;
                        sfx.play('hit');
                        // Authentic impact hit-stop ONLY on confirmed enemy hit!
                        triggerJuice(isFinisher ? 0.065 : 0.038, isFinisher ? 7 : 3.5, 20);`,
'Combat Balance: Controlled knockback and authentic impact hit-stop'
);

// ----------------------------------------------------------------------------
// 6. DIFFICULTY OVERHAUL: ENEMY STATS TEMPLATES & HEAVY POISE
// ----------------------------------------------------------------------------
mustReplace(
`            const templates = {
                skeleton: { hp: 46, speed: 105, radius: 18, dmg: 12, xp: 14, gold: 6, sprite: 'skeleton' },
                zombie: { hp: 90, speed: 68, radius: 21, dmg: 20, xp: 20, gold: 10, sprite: 'zombie' },
                wraith: { hp: 42, speed: 140, radius: 17, dmg: 15, xp: 18, gold: 8, sprite: 'wraith' },
                necro: { hp: 56, speed: 78, radius: 19, dmg: 16, xp: 25, gold: 12, sprite: 'necro' },
                gargoyle: { hp: 110, speed: 75, radius: 22, dmg: 22, xp: 32, gold: 15, sprite: 'gargoyle', shielded: true },
                toad: { hp: 60, speed: 115, radius: 19, dmg: 18, xp: 22, gold: 10, sprite: 'toad', explodes: true },
                spider: { hp: 50, speed: 145, radius: 17, dmg: 15, xp: 20, gold: 9, sprite: 'spider', burrowCd: 2.8 },
                dummy: { hp: 9999, speed: 0, radius: 18, dmg: 0, xp: 15, gold: 10, sprite: 'dummy', isDummy: true }
            };`,
`            const templates = {
                skeleton: { hp: 65, speed: 175, radius: 18, dmg: 18, xp: 16, gold: 8, sprite: 'skeleton' },
                zombie: { hp: 140, speed: 95, radius: 21, dmg: 28, xp: 25, gold: 12, sprite: 'zombie', heavyPoise: true },
                wraith: { hp: 55, speed: 215, radius: 17, dmg: 20, xp: 22, gold: 10, sprite: 'wraith' },
                necro: { hp: 80, speed: 110, radius: 19, dmg: 18, xp: 30, gold: 15, sprite: 'necro' },
                gargoyle: { hp: 160, speed: 115, radius: 22, dmg: 28, xp: 36, gold: 18, sprite: 'gargoyle', shielded: true },
                toad: { hp: 75, speed: 140, radius: 19, dmg: 22, xp: 24, gold: 12, sprite: 'toad', explodes: true },
                spider: { hp: 68, speed: 185, radius: 17, dmg: 18, xp: 22, gold: 10, sprite: 'spider', burrowCd: 2.2 },
                dummy: { hp: 9999, speed: 0, radius: 18, dmg: 0, xp: 15, gold: 10, sprite: 'dummy', isDummy: true }
            };`,
'Difficulty Overhaul: Upgraded enemy templates for real challenge'
);

// ----------------------------------------------------------------------------
// 7. DIFFICULTY OVERHAUL: SKELETON LUNGE STRIKE TACTICAL AI
// ----------------------------------------------------------------------------
mustReplace(
`                if (e.isDummy) {
                    // Stationary training dummy only moves via knockback
                } else if (e.type === 'spider') {`,
`                if (e.isDummy) {
                    // Stationary training dummy only moves via knockback
                } else if (e.type === 'skeleton') {
                    e.lungeCd = (e.lungeCd !== undefined ? e.lungeCd : 1.5) - dt;
                    if (e.isLunging) {
                        e.lungeTimer -= dt;
                        e.x += e.lungeVx * dt;
                        e.y += e.lungeVy * dt;
                        if (e.lungeTimer <= 0) {
                            e.isLunging = false;
                            e.lungeCd = 2.4 + Math.random() * 0.8;
                        }
                    } else if (e.isTelegraphing) {
                        e.telegraphTimer -= dt;
                        if (e.telegraphTimer <= 0) {
                            e.isTelegraphing = false;
                            e.isLunging = true;
                            e.lungeTimer = 0.26;
                            const lungeAng = Math.atan2(player.y - e.y, player.x - e.x);
                            e.lungeVx = Math.cos(lungeAng) * 350;
                            e.lungeVy = Math.sin(lungeAng) * 350;
                            sfx.play('dash');
                            addParticles(e.x, e.y, '#ef4444', 8, 110, 3);
                        }
                    } else {
                        e.x += Math.cos(ang) * e.speed * dt;
                        e.y += Math.sin(ang) * e.speed * dt;
                        if (distToPlayer < 135 && e.lungeCd <= 0) {
                            e.isTelegraphing = true;
                            e.telegraphTimer = 0.30;
                            e.flash = 0.30;
                            addFloatingText(e.x, e.y - 18, "⚠️ LUNGE!", "#ef4444", 12);
                        }
                    }
                } else if (e.type === 'spider') {`,
'Difficulty Overhaul: Skeleton Leaping Lunge Strike AI'
);

// ----------------------------------------------------------------------------
// 8. DIFFICULTY OVERHAUL: ZOMBIE TOXIC BILE ON DEATH
// ----------------------------------------------------------------------------
mustReplace(
`            // Brimstone Hellfire Pit Exploder
            if (isPitKill && player.relics.brimstone_censer) {`,
`            // Zombie Toxic Bile Hazard Pool on Death
            if (e.type === 'zombie' && !isPitKill) {
                hazardPools.push({
                    x: e.x, y: e.y, r: 38, dps: 18, color: 'rgba(34, 197, 94, 0.45)',
                    life: 3.5, friendly: false
                });
                addParticles(e.x, e.y, '#22c55e', 14, 120, 4);
                addFloatingText(e.x, e.y - 18, "☣️ TOXIC BILE!", "#22c55e", 13);
            }

            // Brimstone Hellfire Pit Exploder
            if (isPitKill && player.relics.brimstone_censer) {`,
'Difficulty Overhaul: Zombie Toxic Bile on Death'
);

// ----------------------------------------------------------------------------
// 9. DIFFICULTY OVERHAUL: INCREASE ROOM ENEMY HORDE COUNT
// ----------------------------------------------------------------------------
mustReplace(
`                    const count = 4 + game.depth * 2 + Math.floor(Math.random() * 2);`,
`                    const count = 6 + game.depth * 3 + Math.floor(Math.random() * 2);`,
'Difficulty Overhaul: Increased room enemy horde density'
);

// ----------------------------------------------------------------------------
// 10. DIFFICULTY OVERHAUL: BOSS MALAKOR BUFF
// ----------------------------------------------------------------------------
mustReplace(
`            const maxHp = Math.round((750 + (game.depth - 1) * 550) * Math.min(2.5, diff * 0.85));
            const bossSpeed = Math.round(82 + (game.depth - 1) * 16);`,
`            const maxHp = Math.round((1150 + (game.depth - 1) * 650) * Math.min(2.5, diff * 0.85));
            const bossSpeed = Math.round(105 + (game.depth - 1) * 20);`,
'Difficulty Overhaul: Buffed Boss Malakor HP & Speed'
);

// ----------------------------------------------------------------------------
// 11. PLAYER REBALANCE: TIGHTER SURVIVAL STAKES
// ----------------------------------------------------------------------------
mustReplace(
`            x: ROOM_W / 2, y: ROOM_H / 2 + 70, radius: 18, speed: 240,
            hp: 120, maxHp: 120, lvl: 1, xp: 0, nextXp: 50,`,
`            x: ROOM_W / 2, y: ROOM_H / 2 + 70, radius: 18, speed: 220,
            hp: 100, maxHp: 100, lvl: 1, xp: 0, nextXp: 50,`,
'Player Rebalance: Tighter baseline survival stakes (100 HP, 220 Speed)'
);

mustReplace(
`        function applyMetaBonusesToPlayer() {
            const upg = metaSave.upgrades;
            player.maxHp = 120 + upg.vitality * 20;
            player.hp = player.maxHp;`,
`        function applyMetaBonusesToPlayer() {
            const upg = metaSave.upgrades;
            player.maxHp = 100 + upg.vitality * 15;
            player.hp = player.maxHp;`,
'Player Rebalance: Balanced Meta-Upgrade Vitality curve'
);

// ----------------------------------------------------------------------------
// 12. PERFORMANCE: CAP PARTICLE POOL
// ----------------------------------------------------------------------------
mustReplace(
`        function addParticles(x, y, color, count = 8, speed = 100, size = 4) {
            for (let i = 0; i < count; i++) {`,
`        function addParticles(x, y, color, count = 8, speed = 100, size = 4) {
            if (particles.length > 90) particles.splice(0, particles.length - 70);
            for (let i = 0; i < count; i++) {`,
'Performance: Capped Particle Pool for zero GC stutter'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`🎉 ALL PERFORMANCE & DIFFICULTY ENHANCEMENTS APPLIED! (Final size: ${html.length} bytes)`);
