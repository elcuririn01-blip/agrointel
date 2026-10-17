import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== INICIANDO BUILD UNIFICADO AGROINTEL PRO ===');
console.log('Diretório de execução:', process.cwd());

const appDir = __dirname;
const rootDir = path.resolve(__dirname, '..');

console.log('App dir:', appDir);
console.log('Root dir:', rootDir);

// 1. Build React app with Vite
console.log('1. Compilando o AgroIntel Web App (React 19 + TypeScript + Vite)...');
execSync('npm run build', { cwd: appDir, stdio: 'inherit' });

// 2. Prepare output directory dist_vercel
const outDir = path.join(process.cwd(), 'dist_vercel');
console.log('2. Preparando diretório de saída:', outDir);
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
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

// 3. Copy Landing Page (index.html and assets)
console.log('3. Copiando Página de Vendas...');
let salesIndex = path.join(rootDir, 'index.html');
let salesAssets = path.join(rootDir, 'assets');

// Fallback to internal landing directory if parent not found or is React index
if (!fs.existsSync(salesIndex) || fs.readFileSync(salesIndex, 'utf8').includes('id="root"')) {
  salesIndex = path.join(appDir, 'landing', 'index.html');
  salesAssets = path.join(appDir, 'landing', 'assets');
}

if (!fs.existsSync(salesIndex) && fs.existsSync(path.join(appDir, 'landing', 'index.html'))) {
  salesIndex = path.join(appDir, 'landing', 'index.html');
  salesAssets = path.join(appDir, 'landing', 'assets');
}

if (fs.existsSync(salesIndex)) {
  fs.copyFileSync(salesIndex, path.join(outDir, 'index.html'));
  console.log('index.html da página de vendas copiado com sucesso.');
} else {
  console.error('ERRO: Não foi possível localizar o index.html da página de vendas.');
}

if (fs.existsSync(salesAssets)) {
  copyDir(salesAssets, path.join(outDir, 'assets'));
  console.log('assets da página de vendas copiados com sucesso.');
}

// 4. Copy React app dist to outDir/app
console.log('4. Copiando AgroIntel Web App para dist_vercel/app...');
const appDist = path.join(appDir, 'dist');
const targetAppDir = path.join(outDir, 'app');
copyDir(appDist, targetAppDir);

// 5. Also sync to rootDir/dist_vercel if different
if (rootDir !== appDir) {
  try {
    const rootOutDir = path.join(rootDir, 'dist_vercel');
    if (fs.existsSync(rootOutDir)) fs.rmSync(rootOutDir, { recursive: true, force: true });
    copyDir(outDir, rootOutDir);
  } catch (e) {
    // ignore
  }
}

console.log('=== BUILD UNIFICADO CONCLUÍDO COM SUCESSO! ===');
