/**
 * build-config.js — Genera alas-sso-config.js desde variables de entorno.
 * Ejecutado por Vercel antes del deploy (ver vercel.json).
 */
const fs   = require('fs');
const path = require('path');

const secret     = process.env.ALAS_SSO_SECRET   || 'REEMPLAZAR-EN-PRODUCCION';
const launcherUrl = process.env.ALAS_LAUNCHER_URL || 'https://launcher-tawny.vercel.app';

const content = `/** Auto-generado por build-config.js — no editar manualmente */
window.ALAS_SSO_CONFIG = {
  secret: '${secret}',
  launcherUrl: '${launcherUrl}',
};
`;

fs.writeFileSync(path.join(__dirname, 'alas-sso-config.js'), content, 'utf8');
console.log('[build] alas-sso-config.js generado. launcherUrl:', launcherUrl);

