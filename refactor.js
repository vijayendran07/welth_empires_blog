const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client/src');

const moves = [
  { from: 'components/ui/ArticleCard.jsx', to: 'components/cards/ArticleCard.jsx' },
  { from: 'components/ui/AuthorCard.jsx', to: 'components/cards/AuthorCard.jsx' },
  { from: 'components/ui/SearchPalette.jsx', to: 'components/shared/SearchPalette.jsx' },
  { from: 'components/ui/CategoryExplorer.jsx', to: 'components/shared/CategoryExplorer.jsx' },
  { from: 'components/ui/FeaturedIntelligence.jsx', to: 'components/sections/FeaturedIntelligence.jsx' },
  { from: 'components/ui/FeaturedReports.jsx', to: 'components/sections/FeaturedReports.jsx' },
  { from: 'components/ui/EditorsPicks.jsx', to: 'components/sections/EditorsPicks.jsx' },
  { from: 'components/ui/TrendingCarousel.jsx', to: 'components/sections/TrendingCarousel.jsx' },
  { from: 'components/ui/IntelligenceDashboard.jsx', to: 'components/sections/IntelligenceDashboard.jsx' },
  { from: 'components/ui/ExpertNetwork.jsx', to: 'components/sections/ExpertNetwork.jsx' },
  { from: 'components/ui/GlobalCoverageMap.jsx', to: 'components/sections/GlobalCoverageMap.jsx' },
  { from: 'components/ui/SuccessStories.jsx', to: 'components/sections/SuccessStories.jsx' },
  { from: 'components/ui/TestimonialsCarousel.jsx', to: 'components/sections/TestimonialsCarousel.jsx' },
  { from: 'components/ui/NewsletterCTA.jsx', to: 'components/sections/NewsletterCTA.jsx' },
  
  { from: 'pages/Home.jsx', to: 'pages/public/Home.jsx' },
  { from: 'pages/public/ArticleListing.jsx', to: 'pages/public/articles/ArticleListing.jsx' },
  { from: 'pages/public/ArticleDetail.jsx', to: 'pages/public/articles/ArticleDetail.jsx' },
  { from: 'pages/public/AuthorProfile.jsx', to: 'pages/public/authors/AuthorProfile.jsx' },
  { from: 'pages/public/CategoryPage.jsx', to: 'pages/public/categories/CategoryPage.jsx' },
  { from: 'pages/public/Services.jsx', to: 'pages/public/services/Incorporation.jsx' },
  { from: 'pages/public/NewsletterPage.jsx', to: 'pages/public/newsletter/NewsletterPage.jsx' },
];

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = getAllFiles(srcDir);

// Read all files
const fileContents = new Map();
allFiles.forEach(f => fileContents.set(f, fs.readFileSync(f, 'utf8')));

// Regex for import from '' or "" or dynamic import()
// Covers: import X from 'Y', import { X } from 'Y', import 'Y', const X = lazy(() => import('Y'))
const importRegex = /(import\s+.*?\s+from\s+['"]|import\s*['"]|import\s*\(\s*['"])(.*?)(['"])/g;

function getNewPath(oldSrcRelativePath) {
  const move = moves.find(m => m.from === oldSrcRelativePath);
  return move ? move.to : oldSrcRelativePath;
}

// Update imports
for (const [filePath, content] of fileContents.entries()) {
  const srcRelativePath = path.relative(srcDir, filePath).replace(/\\/g, '/');
  const newSrcRelativePath = getNewPath(srcRelativePath);
  
  const newContent = content.replace(importRegex, (match, p1, p2, p3) => {
    if (!p2.startsWith('.')) return match; 

    // Resolve the imported file relative to the original file
    const importedAbsPath = path.resolve(path.dirname(filePath), p2);
    let importedSrcRel = path.relative(srcDir, importedAbsPath).replace(/\\/g, '/');
    
    // Find if imported file was moved
    let importedMove = moves.find(m => m.from === importedSrcRel || m.from === importedSrcRel + '.jsx' || m.from === importedSrcRel + '.js');
    let finalImportedSrcRel = importedMove ? importedMove.to : importedSrcRel;

    let extension = path.extname(p2);
    if (!extension && finalImportedSrcRel.endsWith('.jsx')) {
      finalImportedSrcRel = finalImportedSrcRel.replace(/\.jsx$/, '');
    } else if (!extension && finalImportedSrcRel.endsWith('.js')) {
      finalImportedSrcRel = finalImportedSrcRel.replace(/\.js$/, '');
    }

    const newFileAbsPath = path.join(srcDir, newSrcRelativePath);
    const newImportedAbsPath = path.join(srcDir, finalImportedSrcRel);
    
    let newP2 = path.relative(path.dirname(newFileAbsPath), newImportedAbsPath).replace(/\\/g, '/');
    if (!newP2.startsWith('.')) newP2 = './' + newP2;

    return `${p1}${newP2}${p3}`;
  });

  fileContents.set(filePath, newContent);
}

// Write the files back
for (const [filePath, content] of fileContents.entries()) {
  const srcRelativePath = path.relative(srcDir, filePath).replace(/\\/g, '/');
  const newSrcRelativePath = getNewPath(srcRelativePath);
  
  if (newSrcRelativePath !== srcRelativePath) {
    const newAbsPath = path.join(srcDir, newSrcRelativePath);
    fs.mkdirSync(path.dirname(newAbsPath), { recursive: true });
    fs.writeFileSync(newAbsPath, content);
    fs.unlinkSync(filePath); 
  } else {
    fs.writeFileSync(filePath, content);
  }
}

// Clean up empty directories
function removeEmptyDirectories(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    if (files.length > 0) {
        files.forEach(file => {
            const fullPath = path.join(directory, file);
            if (fs.statSync(fullPath).isDirectory()) {
                removeEmptyDirectories(fullPath);
            }
        });
    }
    if (fs.readdirSync(directory).length === 0) {
        fs.rmdirSync(directory);
    }
}
removeEmptyDirectories(srcDir);

console.log('Refactoring complete!');
