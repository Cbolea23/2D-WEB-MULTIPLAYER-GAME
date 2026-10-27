import fs from 'fs';
import vm from 'vm';

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];

console.log('Found inline scripts:', scriptMatches.length);
let totalErrors = 0;

for (let i = 0; i < scriptMatches.length; i++) {
    const code = scriptMatches[i][1];
    try {
        new vm.Script(code);
        console.log(`Script #${i + 1} syntax OK! Size: ${code.length} chars`);
    } catch (err) {
        console.error(`SYNTAX ERROR in script #${i + 1}:`, err.message);
        totalErrors++;
    }
}

if (totalErrors === 0) {
    console.log('100% CLEAN SYNTAX VALIDATION PASS!');
} else {
    process.exit(1);
}
