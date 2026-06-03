/**
 * sort-fix.js — Parches de comportamiento para Items Borrados
 *
 * 1. Corrección de ordenamiento de fechas: mantiene agrupado por vendedor,
 *    ordena correctamente dentro de cada grupo, items sin fecha siempre al final.
 * 2. Motivos "No Recuperado": elimina "Falta de stock" y "Error de stock",
 *    agrega "Stock 0" y "Diferencia de Stock".
 */

// ── Patch INCIDENCIAS ────────────────────────────────────────────────────────
(function patchMotivos() {
  var MAX_WAIT = 4000, INTERVAL = 50, elapsed = 0;
  var poll = setInterval(function () {
    elapsed += INTERVAL;
    if (typeof window.INCIDENCIAS === 'undefined') {
      if (elapsed >= MAX_WAIT) clearInterval(poll);
      return;
    }
    clearInterval(poll);

    // Quitar "Falta de stock" y "Error de stock"
    var REMOVE = ['falta_stock', 'error_stock'];
    for (var i = window.INCIDENCIAS.length - 1; i >= 0; i--) {
      if (REMOVE.indexOf(window.INCIDENCIAS[i].id) !== -1) {
        window.INCIDENCIAS.splice(i, 1);
      }
    }

    // Agregar "Stock 0" y "Diferencia de Stock" al principio
    window.INCIDENCIAS.unshift(
      { id: 'diferencia_stock', nm: 'Diferencia de Stock', c: '#F97316' },
      { id: 'stock_0',          nm: 'Stock 0',             c: '#EF4444' }
    );
  }, INTERVAL);
})();
// ────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  function installOverride() {
    if (typeof window.sortTableRows !== 'function' ||
        typeof window.getTableSortValue !== 'function') {
      return false;
    }

    var _original = window.sortTableRows;

    window.sortTableRows = function (state) {
      if (!state || !state.filtered) return;

      // Sin columna seleccionada → comportamiento original (vendedor + monto)
      if (!state.sortKey) {
        _original(state);
        return;
      }

      var key = state.sortKey;
      var dir = state.sortDir === 'asc' ? 1 : -1;

      state.filtered.sort(function (a, b) {
        // ── Primero: agrupado por vendedor (igual que el original) ──
        var va_vendor = a._sortVendor || '';
        var vb_vendor = b._sortVendor || '';
        if (va_vendor < vb_vendor) return -1;
        if (va_vendor > vb_vendor) return 1;

        // ── Dentro del mismo vendedor: ordenar por la columna elegida ──
        var va = window.getTableSortValue(a, key);
        var vb = window.getTableSortValue(b, key);

        // Items sin fecha (ts=0) siempre al final, sin importar la dirección
        if (key === 'fecha_carga') {
          var aEmpty = !va || va === 0;
          var bEmpty = !vb || vb === 0;
          if (aEmpty && bEmpty) return (b._montoNum || 0) - (a._montoNum || 0);
          if (aEmpty) return 1;   // a sin fecha → al final
          if (bEmpty) return -1;  // b sin fecha → al final
        }

        var cmp;
        if (typeof va === 'string' || typeof vb === 'string') {
          cmp = String(va).localeCompare(String(vb), 'es', { sensitivity: 'base' });
        } else {
          cmp = va - vb;
        }

        if (cmp === 0) return (b._montoNum || 0) - (a._montoNum || 0);
        return cmp * dir;
      });
    };

    return true;
  }

  if (!installOverride()) {
    var attempts = 0;
    var poll = setInterval(function () {
      attempts++;
      if (installOverride() || attempts >= 40) clearInterval(poll);
    }, 100);
  }

})();
