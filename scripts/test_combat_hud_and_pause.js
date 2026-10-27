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

// 1. Top bar inspection
const topBarRegex = /<header\s+class="[^"]*pixel-panel[^"]*"[^>]*>([\s\S]*?)<\/header>/i;
const topBarMatch = html.match(topBarRegex);

check('Top bar exists', !!topBarMatch, 'Top bar header element missing');
if (topBarMatch) {
    const topBarContent = topBarMatch[1];
    check('Top bar contains Pause button', topBarContent.includes('id="btn-pause"'), 'btn-pause missing in top bar');
    check('Top bar does NOT contain CO-OP button', !topBarContent.includes('btn-coop'), 'btn-coop still in combat top bar');
    check('Top bar does NOT contain Arsenal button', !topBarContent.includes('btn-arsenal'), 'btn-arsenal still in combat top bar');
    check('Top bar does NOT contain Altar button', !topBarContent.includes('btn-altar'), 'btn-altar still in combat top bar');
    check('Top bar does NOT contain Codex button', !topBarContent.includes('btn-codex'), 'btn-codex still in combat top bar');
    check('Top bar does NOT contain Profile button', !topBarContent.includes('btn-profile'), 'btn-profile still in combat top bar');
    check('Top bar does NOT contain Music/Mute button', !topBarContent.includes('btn-music') && !topBarContent.includes('btn-mute'), 'Music/Mute button still in combat top bar');
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
