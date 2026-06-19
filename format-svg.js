const fs = require('fs');
let svg = fs.readFileSync('./client/public/world-map.svg', 'utf8');

// Remove existing inline styles or fills
svg = svg.replace(/fill="[^"]*"/gi, '');
svg = svg.replace(/stroke="[^"]*"/gi, '');
svg = svg.replace(/style="[^"]*"/gi, '');
svg = svg.replace(/class="[^"]*"/gi, '');

// Apply gold stroke
svg = svg.replace(/<svg/, '<svg style="fill: none; stroke: #D4AF37; stroke-width: 1.5px; filter: drop-shadow(0px 0px 3px rgba(212,175,55,0.4));" ');

fs.writeFileSync('./client/public/world-map-outline.svg', svg);
console.log('Done');
