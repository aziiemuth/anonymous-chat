const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
code = code.replace(/'rgba\(255,255,255,0\.03\)'/g, ''var(--input-bg)'');
code = code.replace(/'rgba\(255,255,255,0\.05\)'/g, ''var(--card-border)'');
fs.writeFileSync('src/app/dashboard/page.tsx', code);
console.log('Fixed');
