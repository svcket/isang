const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('src/app/api/chat/route.ts', 'utf-8');
const urls = [...content.matchAll(/(https:\/\/(?:images\.unsplash\.com|pbs\.twimg\.com|logos-world\.net|upload\.wikimedia\.org)[^"']*)/g)].map(m => m[1]);

const uniqueUrls = [...new Set(urls)];
console.log(`Checking ${uniqueUrls.length} unique URLs...`);

async function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode >= 400) {
                resolve({ url, status: res.statusCode });
            } else {
                resolve(null);
            }
        }).on('error', (e) => {
            resolve({ url, error: e.message });
        });
    });
}

async function run() {
    const promises = uniqueUrls.map(url => checkUrl(url));
    const results = await Promise.all(promises);
    const broken = results.filter(r => r !== null);

    if (broken.length > 0) {
        console.log('BROKEN URLS:');
        console.log(JSON.stringify(broken, null, 2));
    } else {
        console.log('All URLs are OK!');
    }
}

run();
