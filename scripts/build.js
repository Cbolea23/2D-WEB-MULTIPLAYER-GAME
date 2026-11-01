import fs from 'fs';
import vm from 'vm';
import path from 'path';

const indexPath = path.resolve('index.html');

if (!fs.existsSync(indexPath)) {
    console.error('CRITICAL: index.html not found at', indexPath);
    process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
console.log(`Source file read successfully: index.html (${html.length} bytes)`);

// 1. Verify CrazyGames SDK v3 in <head>
if (!html.includes('https://sdk.crazygames.com/crazygames-sdk-v3.js')) {
    console.error('ERROR: CrazyGames SDK v3 script tag missing in index.html!');
    process.exit(1);
}

// 2. Validate all inline JavaScript syntax
const scriptMatches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
console.log(`Found ${scriptMatches.length} inline script block(s). Validating syntax...`);

let totalErrors = 0;
for (let i = 0; i < scriptMatches.length; i++) {
    const code = scriptMatches[i][1];
    try {
        new vm.Script(code);
        console.log(`Script #${i + 1} syntax OK (${code.length} characters)`);
    } catch (err) {
        console.error(`SYNTAX ERROR in script #${i + 1}:`, err.message);
        totalErrors++;
    }
}

if (totalErrors > 0) {
    console.error(`Build failed with ${totalErrors} syntax error(s)!`);
    process.exit(1);
}

console.log('SUCCESS: index.html validated cleanly and ready for production deployment!');
