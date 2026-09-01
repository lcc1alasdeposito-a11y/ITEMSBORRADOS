-- ═══════════════════════════════════════════════════════════════════════
-- get_dashboard_stats — agrega el parámetro p_almacen (filtro por Almacén)
-- Ejecutar UNA vez en: Supabase → SQL Editor (proyecto de Items Borrados)
-- Es 100% compatible: si no se pasa p_almacen (default NULL) sigue igual.
-- ═══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_dashboard_stats(
    p_vendedor TEXT DEFAULT NULL,
    p_desde    TEXT DEFAULT NULL,
    p_hasta    TEXT DEFAULT NULL,
    p_almacen  TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_hoy DATE := CURRENT_DATE;

    v_total             INTEGER;
    v_pendiente         INTEGER;
    v_recuperado        INTEGER;
    v_no_recuperado     INTEGER;
    v_contabilizado     INTEGER;
    v_facturado         INTEGER;
    v_items_borrado     INTEGER;
    v_sin_stock         INTEGER;

    v_monto_total           NUMERIC;
    v_monto_recuperado      NUMERIC;
    v_monto_no_recuperado   NUMERIC;
    v_monto_contabilizado   NUMERIC;
    v_monto_facturado       NUMERIC;
    v_monto_items_borrado   NUMERIC;
    v_monto_sin_stock       NUMERIC;

    v_hoy_recuperado        INTEGER;
    v_hoy_no_recuperado     INTEGER;
    v_hoy_contabilizado     INTEGER;
    v_hoy_facturado         INTEGER;
    v_hoy_items_borrado     INTEGER;
    v_hoy_sin_stock         INTEGER;

    v_hoy_monto_recuperado      NUMERIC;
    v_hoy_monto_no_recuperado   NUMERIC;
    v_hoy_monto_contabilizado   NUMERIC;
    v_hoy_monto_facturado       NUMERIC;
    v_hoy_monto_items_borrado   NUMERIC;
    v_hoy_monto_sin_stock       NUMERIC;
BEGIN
    -- ── Conteos y montos globales ────────────────────────────────────────
    SELECT
        COUNT(*)                                                    AS total,
        COUNT(*) FILTER (WHERE estado = 'pendiente')               AS pendiente,
        COUNT(*) FILTER (WHERE estado = 'recuperado')              AS recuperado,
        COUNT(*) FILTER (WHERE estado = 'no_recuperado')           AS no_recuperado,
        COUNT(*) FILTER (WHERE estado = 'contabilizado')           AS contabilizado,
        COUNT(*) FILTER (WHERE estado = 'facturado')               AS facturado,
        COUNT(*) FILTER (WHERE estado = 'items_borrado')           AS items_borrado,
        COUNT(*) FILTER (WHERE estado = 'sin_stock')               AS sin_stock,

        COALESCE(SUM(total_importe), 0)                                              AS monto_total,
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'recuperado'),    0)     AS monto_recuperado,
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'no_recuperado'), 0)     AS monto_no_recuperado,
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'contabilizado'), 0)     AS monto_contabilizado,
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'facturado'),     0)     AS monto_facturado,
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'items_borrado'), 0)     AS monto_items_borrado,
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'sin_stock'),     0)     AS monto_sin_stock
    INTO
        v_total, v_pendiente, v_recuperado, v_no_recuperado,
        v_contabilizado, v_facturado, v_items_borrado, v_sin_stock,
        v_monto_total, v_monto_recuperado, v_monto_no_recuperado,
        v_monto_contabilizado, v_monto_facturado, v_monto_items_borrado, v_monto_sin_stock
    FROM items_borrados
    WHERE
        (p_vendedor IS NULL OR vendedor_externo = p_vendedor)
        AND (p_almacen IS NULL OR almacen = p_almacen)
        AND (p_desde IS NULL OR fecha_carga >= (p_desde || 'T00:00:00')::TIMESTAMPTZ)
        AND (p_hasta IS NULL OR fecha_carga <= (p_hasta || 'T23:59:59')::TIMESTAMPTZ);

    -- ── Movimiento de hoy ────────────────────────────────────────────────
    SELECT
        COUNT(*) FILTER (WHERE estado = 'recuperado'   AND DATE(fecha_gestion) = v_hoy),
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'recuperado'   AND DATE(fecha_gestion) = v_hoy), 0),

        COUNT(*) FILTER (WHERE estado = 'no_recuperado' AND DATE(fecha_gestion) = v_hoy),
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'no_recuperado' AND DATE(fecha_gestion) = v_hoy), 0),

        COUNT(*) FILTER (WHERE estado = 'contabilizado' AND DATE(fecha_gestion) = v_hoy),
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'contabilizado' AND DATE(fecha_gestion) = v_hoy), 0),

        COUNT(*) FILTER (WHERE estado = 'facturado'    AND DATE(fecha_fact) = v_hoy),
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'facturado'    AND DATE(fecha_fact) = v_hoy), 0),

        COUNT(*) FILTER (WHERE estado = 'items_borrado' AND DATE(fecha_gestion) = v_hoy),
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'items_borrado' AND DATE(fecha_gestion) = v_hoy), 0),

        COUNT(*) FILTER (WHERE estado = 'sin_stock'    AND DATE(fecha_gestion) = v_hoy),
        COALESCE(SUM(total_importe) FILTER (WHERE estado = 'sin_stock'    AND DATE(fecha_gestion) = v_hoy), 0)
    INTO
        v_hoy_recuperado,    v_hoy_monto_recuperado,
        v_hoy_no_recuperado, v_hoy_monto_no_recuperado,
        v_hoy_contabilizado, v_hoy_monto_contabilizado,
        v_hoy_facturado,     v_hoy_monto_facturado,
        v_hoy_items_borrado, v_hoy_monto_items_borrado,
        v_hoy_sin_stock,     v_hoy_monto_sin_stock
    FROM items_borrados
    WHERE
        (p_vendedor IS NULL OR vendedor_externo = p_vendedor)
        AND (p_almacen IS NULL OR almacen = p_almacen)
        AND (p_desde IS NULL OR fecha_carga >= (p_desde || 'T00:00:00')::TIMESTAMPTZ)
        AND (p_hasta IS NULL OR fecha_carga <= (p_hasta || 'T23:59:59')::TIMESTAMPTZ);

    -- ── Resultado JSON ───────────────────────────────────────────────────
    RETURN json_build_object(
        'total',              COALESCE(v_total, 0),
        'pendiente',          COALESCE(v_pendiente, 0),
        'recuperado',         COALESCE(v_recuperado, 0),
        'no_recuperado',      COALESCE(v_no_recuperado, 0),
        'contabilizado',      COALESCE(v_contabilizado, 0),
        'facturado',          COALESCE(v_facturado, 0),
        'itemsBorrado',       COALESCE(v_items_borrado, 0),
        'sinStock',           COALESCE(v_sin_stock, 0),

        'montoTotal',         COALESCE(v_monto_total, 0),
        'montoRecuperado',    COALESCE(v_monto_recuperado, 0),
        'montoNoRecuperado',  COALESCE(v_monto_no_recuperado, 0),
        'montoContabilizado', COALESCE(v_monto_contabilizado, 0),
        'montoFacturado',     COALESCE(v_monto_facturado, 0),
        'montoItemsBorrado',  COALESCE(v_monto_items_borrado, 0),
        'montoSinStock',      COALESCE(v_monto_sin_stock, 0),

        'hoyRecuperado',          COALESCE(v_hoy_recuperado, 0),
        'hoyMontoRecuperado',     COALESCE(v_hoy_monto_recuperado, 0),
        'hoyNoRecuperado',        COALESCE(v_hoy_no_recuperado, 0),
        'hoyMontoNoRecuperado',   COALESCE(v_hoy_monto_no_recuperado, 0),
        'hoyContabilizado',       COALESCE(v_hoy_contabilizado, 0),
        'hoyMontoContabilizado',  COALESCE(v_hoy_monto_contabilizado, 0),
        'hoyFacturado',           COALESCE(v_hoy_facturado, 0),
        'hoyMontoFacturado',      COALESCE(v_hoy_monto_facturado, 0),
        'hoyItemsBorrado',        COALESCE(v_hoy_items_borrado, 0),
        'hoyMontoItemsBorrado',   COALESCE(v_hoy_monto_items_borrado, 0),
        'hoySinStock',            COALESCE(v_hoy_sin_stock, 0),
        'hoyMontoSinStock',       COALESCE(v_hoy_monto_sin_stock, 0)
    );
END;
$$;
