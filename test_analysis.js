const fs = require('fs');
const file = fs.readFileSync('src/server/portalStore.ts', 'utf8');
console.log("File length:", file.length);
