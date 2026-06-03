/**
 * alas-bypass.js — Login bypass SSO para Items Borrados
 *
 * Corre DESPUÉS de app.js (defer, en orden).
 * Espera a que:
 *   1. alas-auth-client.js termine la verificación del token
 *   2. app.js haya definido renderDashboard() y startNotifPolling()
 * Si SSO es válido → bypasea el login y entra directo al dashboard.
 * Si no → remueve el overlay CSS preventivo y muestra el login local.
 */
(function () {
  'use strict';

  /* Mapa de roles legibles (igual que app.js) */
  var ROLE_LABELS = {
    admin:      'Administrador',
    supervisor: 'Supervisor',
    operario:   'Operario',
    visor:      'Visor',
  };

  function getRoleLabel(role) {
    return ROLE_LABELS[role] || role || '';
  }

  function removePreemptiveStyle() {
    var el = document.getElementById('alas-sso-preemptive');
    if (el) el.parentNode.removeChild(el);
  }

  function applyBypass(user) {
    // Poblar window.currentUser con el formato que app.js espera
    window.currentUser = {
      nombre: user.name  || user.email || 'Operador',
      rol:    user.role  || 'visor',
      id:     user.userId,
      email:  user.email,
    };

    // Ocultar loader y login, mostrar app
    var loader       = document.getElementById('loader');
    var loginOverlay = document.getElementById('loginOverlay');
    var appMain      = document.getElementById('appMain');

    if (loader)       { loader.style.opacity = '0'; loader.style.display = 'none'; }
    if (loginOverlay) loginOverlay.style.display = 'none';
    if (appMain)      appMain.style.display = 'flex';

    // Actualizar sidebar
    var nameEl   = document.getElementById('sidebarUserName');
    var roleEl   = document.getElementById('sidebarUserRole');
    if (nameEl) nameEl.textContent = window.currentUser.nombre;
    if (roleEl) roleEl.textContent = getRoleLabel(window.currentUser.rol);
    if (typeof window.updateSidebarAvatar === 'function') {
      window.updateSidebarAvatar(window.currentUser.nombre);
    }

    // Mostrar botones según rol
    var role = window.currentUser.rol;
    if (role === 'admin' || role === 'supervisor') {
      var adminTitle    = document.getElementById('navAdminTitle');
      var btnAdminUsers = document.getElementById('btnAdminUsers');
      if (adminTitle)    adminTitle.style.display    = 'block';
      if (btnAdminUsers) btnAdminUsers.style.display = 'flex';
    }
    if (role === 'admin' || role === 'operario') {
      var btnImport = document.getElementById('btnImport');
      if (btnImport) btnImport.style.display = 'flex';
    }

    // Sobreescribir logout() para que vuelva al launcher
    window.logout = function () {
      if (window.AlasAuthClient && typeof window.AlasAuthClient.logout === 'function') {
        window.AlasAuthClient.logout();
      } else {
        var cfg = window.ALAS_SSO_CONFIG || {};
        window.location.replace(cfg.launcherUrl || 'https://launcher-tawny.vercel.app');
      }
    };

    // Si app.js oculta appMain por sesión expirada → redirigir al Launcher
    var appMainEl = document.getElementById('appMain');
    if (appMainEl) {
      var expiryObserver = new MutationObserver(function () {
        if (appMainEl.style.display === 'none') {
          expiryObserver.disconnect();
          var cfg = window.ALAS_SSO_CONFIG || {};
          window.location.replace(cfg.launcherUrl || 'https://launcher-tawny.vercel.app');
        }
      });
      expiryObserver.observe(appMainEl, { attributes: true, attributeFilter: ['style'] });
    }

    // Arrancar la app
    if (typeof window.renderDashboard    === 'function') window.renderDashboard();
    if (typeof window.startNotifPolling  === 'function') window.startNotifPolling(true);

    removePreemptiveStyle();
    console.info('[ALAS BYPASS] Login saltado por SSO. Bienvenido,', window.currentUser.nombre);
  }

  function showLocalLogin() {
    // Sin SSO válido → redirigir al Launcher en vez de mostrar login local
    removePreemptiveStyle();
    console.info('[ALAS BYPASS] Sin sesión SSO. Redirigiendo al Launcher...');
    var cfg = window.ALAS_SSO_CONFIG || {};
    window.location.replace(cfg.launcherUrl || 'https://launcher-tawny.vercel.app');
  }

  // Esperar a que SSO auth resuelva Y app.js haya definido sus funciones
  var maxWait  = 5000;  // ms máximo
  var interval = 50;
  var elapsed  = 0;

  var poll = setInterval(function () {
    elapsed += interval;

    var authReady = window.AlasAuthClient !== undefined;
    var appReady  = typeof window.renderDashboard === 'function' &&
                    typeof window.startNotifPolling === 'function';

    if (!authReady || !appReady) {
      if (elapsed >= maxWait) {
        clearInterval(poll);
        showLocalLogin();
      }
      return;
    }

    clearInterval(poll);

    if (window.AlasAuthClient.isAuthenticated && window.AlasAuthClient.user) {
      applyBypass(window.AlasAuthClient.user);
    } else {
      showLocalLogin();
    }
  }, interval);

})();
