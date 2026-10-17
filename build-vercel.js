const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== INICIANDO BUILD PARA VERCEL ===');

// 1. Install & Build React app inside agrointel-app
console.log('1. Instalando e compilando agrointel-app...');
execSync('npm --prefix agrointel-app install && npm --prefix agrointel-app run build', {
  stdio: 'inherit'
});

// 2. Prepare unified output directory 'dist_vercel'
const outDir = path.join(__dirname, 'dist_vercel');
console.log('2. Criando diretório unificado de saída:', outDir);

if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// 3. Copy Sales Page files to root of outDir
console.log('3. Copiando Página de Vendas (index.html e assets)...');
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(outDir, 'index.html'));

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(path.join(__dirname, 'assets'))) {
  copyDir(path.join(__dirname, 'assets'), path.join(outDir, 'assets'));
}

// 4. Copy React app build to outDir/app
console.log('4. Copiando AgroIntel PRO Web App para outDir/app...');
const appDist = path.join(__dirname, 'agrointel-app', 'dist');
const targetAppDir = path.join(outDir, 'app');
copyDir(appDist, targetAppDir);

console.log('=== BUILD DEPLOY UNIFICADO CONCLUÍDO COM SUCESSO! ===');
