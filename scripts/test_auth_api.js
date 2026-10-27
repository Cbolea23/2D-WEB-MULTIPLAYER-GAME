const SERVER_URL = 'http://localhost:3000';

async function postJson(endpoint, data, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });
    return { status: res.status, data: await res.json() };
}

async function getJson(endpoint, token) {
    const res = await fetch(`${SERVER_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return { status: res.status, data: await res.json() };
}

async function run() {
    console.log('--- STARTING AUTH API TESTS ---');

    const testUser = 'Keeper_' + Math.random().toString(36).substring(2, 7);
    const password = 'SuperSecret123!';

    // 1. Register
    console.log(`1. Testing Register: ${testUser}`);
    const regRes = await postJson('/api/register', { username: testUser, password });
    if (regRes.status !== 200 || !regRes.data.token) {
        throw new Error('Register failed: ' + JSON.stringify(regRes.data));
    }
    console.log('✅ Register passed. Token received:', regRes.data.token.substring(0, 10) + '...');

    const token = regRes.data.token;

    // 2. Duplicate Register should fail
    console.log('2. Testing Duplicate Register prevention');
    const dupRes = await postJson('/api/register', { username: testUser, password });
    if (dupRes.status !== 400 || !dupRes.data.error.includes('already taken')) {
        throw new Error('Duplicate register check failed: ' + JSON.stringify(dupRes.data));
    }
    console.log('✅ Duplicate register rejected as expected.');

    // 3. Login
    console.log('3. Testing Login with correct password');
    const loginRes = await postJson('/api/login', { username: testUser, password });
    if (loginRes.status !== 200 || !loginRes.data.token) {
        throw new Error('Login failed: ' + JSON.stringify(loginRes.data));
    }
    console.log('✅ Login successful.');

    // 4. Login with wrong password
    console.log('4. Testing Login with wrong password');
    const badLogin = await postJson('/api/login', { username: testUser, password: 'WrongPassword' });
    if (badLogin.status !== 401) {
        throw new Error('Wrong password was not rejected: ' + JSON.stringify(badLogin.data));
    }
    console.log('✅ Bad password rejected with 401.');

    // 5. GET /api/me
    console.log('5. Testing GET /api/me with Bearer token');
    const meRes = await getJson('/api/me', token);
    if (meRes.status !== 200 || meRes.data.user.username.toLowerCase() !== testUser.toLowerCase()) {
        throw new Error('/api/me failed: ' + JSON.stringify(meRes.data));
    }
    console.log('✅ Profile fetched successfully:', meRes.data.user.username, 'Souls:', meRes.data.user.save.souls);

    // 6. POST /api/save (Cloud Save Sync)
    console.log('6. Testing POST /api/save to bank 250 Soul Shards & Depth 4');
    const saveRes = await postJson('/api/save', {
        save: {
            souls: 250,
            bestDepth: 4,
            selectedWeapon: 'executioner_spade',
            unlockedWeapons: ['rusty_spade', 'executioner_spade']
        }
    }, token);
    if (saveRes.status !== 200 || saveRes.data.save.souls !== 250) {
        throw new Error('Save failed: ' + JSON.stringify(saveRes.data));
    }
    console.log('✅ Cloud save synchronized: 250 souls, Depth 4.');

    // 7. Verify updated profile
    const verifyRes = await getJson('/api/me', token);
    if (verifyRes.data.user.save.souls !== 250 || verifyRes.data.user.save.bestDepth !== 4) {
        throw new Error('Cloud save was not persisted: ' + JSON.stringify(verifyRes.data));
    }
    console.log('✅ Verified persisted save in user profile.');

    // 8. Test Claim Guest Progress
    console.log('8. Testing /api/claim-guest for guest converting to account');
    const guestUser = 'ExGuest_' + Math.random().toString(36).substring(2, 7);
    const guestLoot = {
        souls: 180,
        bestDepth: 2,
        selectedWeapon: 'twin_trowels',
        unlockedWeapons: ['rusty_spade', 'twin_trowels']
    };
    const claimRes = await postJson('/api/claim-guest', {
        username: guestUser,
        password: 'Password123!',
        guestSave: guestLoot
    });
    if (claimRes.status !== 200 || claimRes.data.user.save.souls !== 180) {
        throw new Error('Claim guest progress failed: ' + JSON.stringify(claimRes.data));
    }
    console.log('✅ Guest run progress claimed into new account with 180 souls!');

    console.log('\n=======================================================');
    console.log('🎉 ALL BACKEND AUTH & SAVE API TESTS PASSED 100%! 🎉');
    console.log('=======================================================');
    process.exit(0);
}

run().catch(err => {
    console.error('API TEST FAILED:', err);
    process.exit(1);
});
