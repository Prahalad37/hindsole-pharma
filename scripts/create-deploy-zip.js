#!/usr/bin/env node
/**
 * Creates deploy.zip for cPanel:
 * - Build output (dist/) + .htaccess
 * - Ready to upload to public_html
 */

import { copyFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const HTACCESS = join(ROOT, 'deploy', '.htaccess');
const OUT = join(ROOT, 'deploy.zip');

async function createZip() {
  try {
    // Copy .htaccess into dist
    await copyFile(HTACCESS, join(DIST, '.htaccess'));

    // Create zip using system zip (macOS/Linux) - exclude .DS_Store
    execSync(`cd "${DIST}" && zip -r "${OUT}" . -x "*.DS_Store"`, { stdio: 'inherit' });

    const fs = await import('fs');
    const size = (fs.statSync(OUT).size / 1024).toFixed(1);
    console.log(`\n✅ deploy.zip created: ${size} KB`);
    console.log('   Upload contents to public_html via cPanel File Manager.\n');
  } catch (err) {
    console.error('Deploy zip failed:', err.message);
    process.exit(1);
  }
}

createZip();
