import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

console.log('=== VERIFYING CLEAN COMBAT HUD, PAUSE MENU & BANNER REMOVAL ===');
let failed = 0;

function check(name, pass, detail) {
    if (pass) {
        console.log(`✅ PASS: ${name}`);
    } else {
        console.error(`❌ FAIL: ${name} -> ${detail}`);
        failed++;
    }
}

// 1. Floating Top HUD inspection
const topBarMatch = html.includes('id="hud-top-right"') || html.includes('id="hud-top-left"');

check('Floating Top HUD exists', topBarMatch, 'Floating Top HUD element missing');
if (topBarMatch) {
    check('HUD contains Pause button', html.includes('id="btn-pause"'), 'btn-pause missing in HUD');
    check('HUD does NOT contain CO-OP button', !html.substring(html.indexOf('id="hud-top-right"'), html.indexOf('id="btn-pause"') + 50).includes('btn-coop'), 'btn-coop still in combat top bar');
}

// 2. Pause Modal inspection
check('Pause modal exists', html.includes('id="pause-modal"'), 'pause-modal element missing');
check('Pause resume button exists', html.includes('id="btn-pause-resume"'), 'btn-pause-resume missing');
check('Pause altar button exists', html.includes('id="btn-pause-altar"'), 'btn-pause-altar missing');
check('Pause codex button exists', html.includes('id="btn-pause-codex"'), 'btn-pause-codex missing');
check('Pause settings button exists', html.includes('id="btn-pause-settings"'), 'btn-pause-settings missing');
check('Pause free souls ad button exists', html.includes('id="btn-pause-ad-souls"'), 'btn-pause-ad-souls missing');
check('Pause abandon run button exists', html.includes('id="btn-pause-abandon"'), 'btn-pause-abandon missing');
check('togglePauseMenu function exists', html.includes('function togglePauseMenu('), 'togglePauseMenu missing');

// 3. Ad banner container removal inspection
check('Bottom ad banner container is removed', !html.includes('id="ad-banner-container"'), 'ad-banner-container still found in HTML');
check('Game container does not deduct 104px', !html.includes('calc(100vh - 104px)'), 'game-container height still constrained to 104px');

// 4. CrazyGames user auto-detection
check('CrazyGames user auto-detection hook exists', html.includes('CrazyGames.SDK.user.getUser'), 'CrazyGames.SDK.user.getUser call missing');

// 5. ESC key handler
check('ESC key triggers pause menu', html.includes('togglePauseMenu()'), 'togglePauseMenu call missing from keydown');

if (failed === 0) {
    console.log('\n🎉 ALL COMBAT HUD, PAUSE MENU, AND CRAZYGAMES QA POLISH CHECKS PASSED WITH 100% SUCCESS!');
} else {
    console.error(`\n❌ ${failed} checks failed!`);
    process.exit(1);
}
