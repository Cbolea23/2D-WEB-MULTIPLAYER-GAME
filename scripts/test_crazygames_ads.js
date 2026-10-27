import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const checks = [
    { name: 'CrazyGames SDK v3 Script Tag in <head>', target: 'https://sdk.crazygames.com/crazygames-sdk-v3.js' },
    { name: 'AdManager Definition', target: 'const AdManager =' },
    { name: 'CrazyGames SDK Initialization Method', target: 'initCrazyGamesSdk()' },
    { name: 'CrazyGames SDK Init Call', target: 'window.CrazyGames.SDK.init()' },
    { name: 'CrazyGames Gameplay Start Hook', target: 'window.CrazyGames.SDK.game.gameplayStart()' },
    { name: 'CrazyGames Gameplay Stop Hook', target: 'window.CrazyGames.SDK.game.gameplayStop()' },
    { name: 'CrazyGames Loading Stop Hook', target: 'window.CrazyGames.SDK.game.loadingStop()' },
    { name: 'CrazyGames Rewarded Video Ad Request', target: 'requestAd("rewarded"' },
    { name: 'CrazyGames Midgame Interstitial Ad Request', target: 'requestAd("midgame"' },
    { name: 'Floor Descent Midgame Ad Hook', target: 'AdManager.showInterstitialAd(proceedDescend)' },
    { name: 'Audio Mute & Unmute Engine', target: 'muteAudio()' },
    { name: 'Game Over Stop Gameplay Trigger', target: 'AdManager.onGameplayStop();' },
    { name: 'Solo Game Start Gameplay Trigger', target: 'AdManager.onGameplayStart();' },
    { name: 'Death Revive Rewarded Ad Hook', target: 'btn-gameover-ad-revive' },
    { name: 'Ghost Spectator Rewarded Ad Hook', target: 'btn-spectator-ad-revive' },
    { name: 'Altar Shards Rewarded Ad Hook', target: 'btn-altar-free-souls' },
    { name: 'Ad Blocker Detection Support', target: 'hasAdblock' },
    { name: 'High-Fidelity Sandbox Simulation Fallback', target: 'rewarded-ad-modal' }
];

console.log('=== VERIFYING CRAZYGAMES SDK v3 & WEB MONETIZATION IN index.html ===');
let failed = 0;
for (const c of checks) {
    if (html.includes(c.target)) {
        console.log(`✅ PASS: ${c.name}`);
    } else {
        console.error(`❌ FAIL: ${c.name} (${c.target} not found)`);
        failed++;
    }
}

if (failed === 0) {
    console.log(`\n🎉 ALL ${checks.length} CRAZYGAMES & AD MONETIZATION CHECKS PASSED WITH 100% SUCCESS!`);
} else {
    console.error(`\n❌ ${failed} checks failed!`);
    process.exit(1);
}
