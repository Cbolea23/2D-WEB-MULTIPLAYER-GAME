import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const checks = [
    { name: 'Top Bar Profile Button', target: 'id="btn-profile"' },
    { name: 'Top Bar Profile Label', target: 'id="top-profile-label"' },
    { name: 'Home Screen Account Badge', target: 'id="home-account-badge"' },
    { name: 'Home Screen Guest Warning', target: 'id="home-guest-warning"' },
    { name: 'Auth Modal Dialog', target: 'id="auth-modal"' },
    { name: 'Login Form', target: 'id="form-login"' },
    { name: 'Register Form', target: 'id="form-register"' },
    { name: 'Claim Guest Loot Checkbox', target: 'id="reg-claim-loot"' },
    { name: 'Profile Dashboard View', target: 'id="auth-view-profile"' },
    { name: 'Sync Cloud Save Button', target: 'id="btn-sync-cloud-save"' },
    { name: 'Log Out Button', target: 'id="btn-logout"' },
    { name: 'Game Over Guest Callout', target: 'id="gameover-guest-callout"' },
    { name: 'Game Over Save Button', target: 'id="btn-gameover-claim"' },
    { name: 'AuthManager in JS', target: 'const AuthManager =' },
    { name: 'AuthManager Init in onload', target: 'AuthManager.init();' },
    { name: 'Auth-aware loadMetaSave', target: 'localStorage.getItem(\'crypt_keeper_token\')' },
    { name: 'Auth-aware saveMeta', target: 'AuthManager.onSaveMeta(metaSave)' }
];

console.log('=== VERIFYING CLIENT UI & INTEGRATION IN index.html ===');
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
    console.log('\n🎉 ALL 17 CLIENT INTEGRATION CHECKS PASSED WITH 100% SUCCESS!');
} else {
    console.error(`\n❌ ${failed} checks failed!`);
    process.exit(1);
}
