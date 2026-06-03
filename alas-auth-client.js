/**
 * alas-auth-client.js — Cliente SSO para Items Borrados
 *
 * Verifica el token firmado emitido por el Launcher ALAS.
 * A diferencia de otros proyectos: NO redirige al launcher si no hay sesión,
 * ya que el proyecto tiene su propio login local como fallback.
 *
 * IMPORTANTE: SSO_SECRET debe ser idéntico al VITE_SSO_SECRET del Launcher.
 */
(function () {
  'use strict';

  var _cfg         = window.ALAS_SSO_CONFIG || {};
  var SSO_SECRET   = _cfg.secret      || 'REEMPLAZAR-EN-PRODUCCION';
  var LAUNCHER_URL = _cfg.launcherUrl || 'https://launcher-tawny.vercel.app';
  var SESSION_KEY  = 'alas.sso.session';

  /* ── Utilidades base64url ────────────────────────────────── */
  function fromBase64url(str) {
    var padded = str.replace(/-/g, '+').replace(/_/g, '/');
    while (padded.length % 4) padded += '=';
    return atob(padded);
  }

  /* ── HMAC-SHA-256 ────────────────────────────────────────── */
  function importHmacKey(secret) {
    return crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
  }

  async function verifyToken(token) {
    if (!token || typeof token !== 'string') return null;
    var dot = token.lastIndexOf('.');
    if (dot < 1) return null;

    var payloadB64 = token.slice(0, dot);
    var sigB64     = token.slice(dot + 1);

    try {
      var key      = await importHmacKey(SSO_SECRET);
      var sigBytes = Uint8Array.from(fromBase64url(sigB64), function (c) { return c.charCodeAt(0); });
      var valid    = await crypto.subtle.verify(
        'HMAC', key, sigBytes,
        new TextEncoder().encode(payloadB64)
      );
      if (!valid) {
        console.warn('[ALAS SSO] Firma inválida.');
        return null;
      }
      var payload = JSON.parse(decodeURIComponent(escape(fromBase64url(payloadB64))));
      if (Date.now() > payload.exp) {
        console.warn('[ALAS SSO] Token expirado.');
        return null;
      }
      return payload;
    } catch (e) {
      console.warn('[ALAS SSO] Error al verificar token:', e.message);
      return null;
    }
  }

  /* ── Sesión en localStorage ──────────────────────────────── */
  function saveSession(payload) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(payload)); } catch (e) {}
  }

  function loadSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || Date.now() > s.exp) { localStorage.removeItem(SESSION_KEY); return null; }
      return s;
    } catch (e) { return null; }
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  /* ── Sesión en sessionStorage formato app.js ────────────── */
  function saveCriSession(payload) {
    try {
      sessionStorage.setItem('cri_user', JSON.stringify({
        user: {
          nombre: payload.name  || payload.email || 'Operador',
          rol:    payload.role  || 'visor',
          id:     payload.userId,
          email:  payload.email,
        },
        exp: payload.exp || (Date.now() + 8 * 60 * 60 * 1000),
      }));
    } catch (e) {}
  }

  /* ── API pública ─────────────────────────────────────────── */
  function buildAuthClient(session) {
    window.AlasAuthClient = {
      isAuthenticated: true,
      user: session,
      getCurrentUser: function () { return session.name || session.email || 'Operador'; },
      getRole:        function () { return session.role; },
      hasPermission:  function (key) { return Array.isArray(session.permissions) && session.permissions.indexOf(key) !== -1; },
      logout: function () {
        clearSession();
        window.location.replace(LAUNCHER_URL);
      }
    };
  }

  /* ── Init ────────────────────────────────────────────────── */
  async function init() {
    var params   = new URLSearchParams(window.location.search);
    var rawToken = params.get('alas_token');

    if (rawToken) {
      // Limpiar token de la URL
      params.delete('alas_token');
      var cleanSearch = params.toString() ? '?' + params.toString() : '';
      window.history.replaceState({}, '', window.location.pathname + cleanSearch);

      var payload = await verifyToken(decodeURIComponent(rawToken));
      if (payload) {
        saveSession(payload);
        saveCriSession(payload);
        buildAuthClient(payload);
        console.info('[ALAS SSO] Sesión establecida. Usuario:', payload.name, '| Rol:', payload.role);
        return;
      }
      console.warn('[ALAS SSO] Token inválido. Verificando sesión guardada...');
    }

    var stored = loadSession();
    if (stored) {
      saveCriSession(stored); // sincrónico — app.js lo lee antes de mostrar login
      buildAuthClient(stored);
      console.info('[ALAS SSO] Sesión restaurada. Usuario:', stored.name);
      return;
    }

    // Sin sesión SSO — el login local de la app toma el control
    window.AlasAuthClient = { isAuthenticated: false };
    console.info('[ALAS SSO] Sin sesión SSO. Mostrando login local.');
  }

  // Exponer la promesa para que el bypass script pueda esperarla
  window.__alasAuthReady = init().catch(function (e) {
    console.error('[ALAS SSO] Error crítico:', e.message);
    window.AlasAuthClient = { isAuthenticated: false };
  });

})();
