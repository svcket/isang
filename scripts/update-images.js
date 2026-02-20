const fs = require('fs');

let content = fs.readFileSync('src/app/api/chat/route.ts', 'utf-8');

// Fix airline logos
content = content.replace("https://upload.wikimedia.org/wikipedia/commons/7/75/Air_Peace_Logo.png", "https://logos-world.net/wp-content/uploads/2023/01/Air-Peace-Logo.png");
content = content.replace("https://pbs.twimg.com/profile_images/1384435887640428546/_E_d_j_t_400x400.jpg", "https://loremflickr.com/400/400/airline,logo/all?lock=99");

// Regex to find each highlight object block which contains a title and photo_urls
content = content.replace(/title:\s*(?:`|")([^`"]+?)(?::)?(?:`|"),\s*description:\s*(?:`|")[^`"]+(?:`|"),\s*photo_urls:\s*\[([\s\S]*?)\]/g, (match, titleStr) => {

    // Extract keywords from title
    // Remove "The", "of", symbols, etc.
    let cleaned = titleStr.replace(/(\$\{destination\}|The | of |:)/g, '').replace(/[^a-zA-Z\s]/g, '').trim();
    let keywords = cleaned.split(/\s+/).filter(w => w.length > 3).slice(0, 2).join(',').toLowerCase();

    // If no good keywords, fallback to landmark
    if (!keywords || keywords.length < 3) keywords = "landmark";

    const newUrls = `[
                    \`https://loremflickr.com/400/300/\${encodeURIComponent(destination.split(',')[0].toLowerCase())},${keywords}/all?lock=1\`,
                    \`https://loremflickr.com/400/300/\${encodeURIComponent(destination.split(',')[0].toLowerCase())},${keywords}/all?lock=2\`,
                    \`https://loremflickr.com/400/300/\${encodeURIComponent(destination.split(',')[0].toLowerCase())},${keywords}/all?lock=3\`,
                    \`https://loremflickr.com/400/300/\${encodeURIComponent(destination.split(',')[0].toLowerCase())},${keywords}/all?lock=4\`
                ]`;

    return match.replace(/\[[\s\S]*?\]/, newUrls);
});

fs.writeFileSync('src/app/api/chat/route.ts', content);
console.log('Images updated with dynamic loremflickr URLs based on titles.');
