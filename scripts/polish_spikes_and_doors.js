import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Upgrade Spike Floor Trap rendering
const oldSpikesPattern = /\/\/ Render Spike Floor Plates[\s\S]*?\/\/ Render Hazard Pools/;

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
            }

            // Render Hazard Pools`;

if (html.match(oldSpikesPattern)) {
    html = html.replace(oldSpikesPattern, newSpikes);
    console.log('✓ Upgraded Spike Floor Plates to authentic Dark-Iron Crypt Grates.');
}

// 2. Upgrade Locked Door / Gate rendering in drawDoorPortal
const oldDoorLockPattern = /} else \{\s*ctx\.fillStyle = '#450a0a'; ctx\.fillRect\(matX, matY, matW, matH\);[\s\S]*?\}\s*\}\s*ctx\.restore\(\);/;

const newDoorLock = `} else {
                    // Heavy Iron Portcullis & Stone Archway Barrier
                    ctx.save();
                    // Stone Archway Recess
                    ctx.fillStyle = '#05070b';
                    ctx.fillRect(matX, matY, matW, matH);
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(matX, matY, matW, matH);

                    // Vertical Heavy Iron Portcullis Bars with Spear Tips
                    if (dir === 'N' || dir === 'S') {
                        const barStep = 12;
                        for (let bx = matX + 6; bx <= matX + matW - 6; bx += barStep) {
                            ctx.fillStyle = '#090d16';
                            ctx.fillRect(bx - 1, matY, 5, matH);
                            ctx.fillStyle = '#475569';
                            ctx.fillRect(bx, matY, 3, matH);
                            // Pointed Spear Tips
                            ctx.fillStyle = '#94a3b8';
                            ctx.beginPath();
                            ctx.moveTo(bx + 1.5, matY + matH + (dir === 'N' ? 5 : -5));
                            ctx.lineTo(bx + 3.5, matY + matH - (dir === 'N' ? 4 : -4));
                            ctx.lineTo(bx - 0.5, matY + matH - (dir === 'N' ? 4 : -4));
                            ctx.closePath();
                            ctx.fill();
                        }
                        // Horizontal Crossbars with Rivets
                        ctx.fillStyle = '#1e293b';
                        ctx.fillRect(matX, matY + 12, matW, 5);
                        ctx.fillRect(matX, matY + matH - 16, matW, 5);
                    } else {
                        const barStep = 12;
                        for (let by = matY + 6; by <= matY + matH - 6; by += barStep) {
                            ctx.fillStyle = '#090d16';
                            ctx.fillRect(matX, by - 1, matW, 5);
                            ctx.fillStyle = '#475569';
                            ctx.fillRect(matX, by, matW, 3);
                            // Pointed Spear Tips
                            ctx.fillStyle = '#94a3b8';
                            ctx.beginPath();
                            ctx.moveTo(matX + matW + (dir === 'W' ? 5 : -5), by + 1.5);
                            ctx.lineTo(matX + matW - (dir === 'W' ? 4 : -4), by + 3.5);
                            ctx.lineTo(matX + matW - (dir === 'W' ? 4 : -4), by - 0.5);
                            ctx.closePath();
                            ctx.fill();
                        }
                        // Vertical Crossbars with Rivets
                        ctx.fillStyle = '#1e293b';
                        ctx.fillRect(matX + 12, matY, 5, matH);
                        ctx.fillRect(matX + matW - 16, matY, 5, matH);
                    }
                    ctx.restore();
                }
            }
            ctx.restore();`;

if (html.match(oldDoorLockPattern)) {
    html = html.replace(oldDoorLockPattern, newDoorLock);
    console.log('✓ Upgraded locked doors into authentic Gothic Iron Portcullises.');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Saved index.html (Bytes:', html.length, ')');
