const fs = require('fs');
let content = fs.readFileSync('src/app/api/chat/route.ts', 'utf-8');

// Replace: destination.split(',')[0].toLowerCase()
// With:    (destination.split(',')[0] || destination).toLowerCase()

content = content.replace(/destination\.split\(\',\',?\s*\)\[0\]\.toLowerCase\(\)/g, "(destination.split(',')[0] || destination).toLowerCase()");

fs.writeFileSync('src/app/api/chat/route.ts', content);
