// xlsx-worker.js — parsea archivos Excel en un hilo separado.
// El hilo principal nunca se bloquea: XLSX.read() corre aquí, no en la UI.
importScripts('xlsx.full.min.js');

var le = function(te) { if (te === "" || te === null || te === void 0) return null; var be = Number(te); return isNaN(be) ? null : be };
var Ye = function(te) { if (!te || te === "") return null; if (te instanceof Date && !isNaN(te.getTime())) return te.toISOString(); if (typeof te == "number") { var be = new Date(Math.round((te - 25569) * 86400 * 1e3)); return be.toISOString() } var Te = String(te).trim(), Re = Te.split("/"); if (Re.length === 3) { var Xe = new Date(Re[2], Re[1] - 1, Re[0]); return Xe.toISOString() } var iso = Te.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if (iso) return new Date(iso[1], iso[2] - 1, iso[3]).toISOString(); return null };
var normalizeHeader = function(value) { return String(value || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "") };
var findColumn = function(headers, names) { var normalized = (headers || []).map(normalizeHeader); for (var ni = 0; ni < names.length; ni++) { var idx = normalized.indexOf(names[ni]); if (idx !== -1) return idx } return -1 };
var parseEstadoSheetRows = function(rows, hasFechaFact) {
    var data = [];
    if (!rows || !rows.length) return data;
    var headers = rows[0] || [],
        fechaIdx = hasFechaFact ? findColumn(headers, ["fechafact", "fechafactura", "fechafacturacion"]) : -1,
        facturaIdx = hasFechaFact ? findColumn(headers, ["factura", "nrofactura", "numfactura", "numerofactura"]) : -1,
        docIdx = findColumn(headers, ["docvtas", "docventas", "documentoventa"]),
        matIdx = findColumn(headers, ["material"]),
        ctdIdx = findColumn(headers, ["ctdentr", "ctdentrega", "cantidad", "cantidadentrada"]);
    if (docIdx === -1 || matIdx === -1) {
        if (hasFechaFact && normalizeHeader(headers[0]).indexOf("fecha") === 0) {
            fechaIdx = 0; docIdx = 1; matIdx = 2; facturaIdx = 3; ctdIdx = -1
        } else { docIdx = 0; matIdx = 1; ctdIdx = 2 }
    }
    for (var ri = 1; ri < rows.length; ri++) {
        var row = rows[ri],
            doc = String(row[docIdx] || "").trim(),
            mat = String(row[matIdx] || "").trim(),
            docLower = doc.toLowerCase();
        if (!doc || !mat || docLower.indexOf("total") === 0) continue;
        data.push({ doc_vtas: doc, material: mat, ctd_entr: le(row[ctdIdx]), fecha_fact: hasFechaFact && fechaIdx >= 0 ? Ye(row[fechaIdx]) : null, factura: hasFechaFact && facturaIdx >= 0 ? String(row[facturaIdx] || "").trim() || null : null })
    }
    return data
};

self.onmessage = function(e) {
    var buf = e.data;
    try {
        var k = XLSX.read(new Uint8Array(buf), { type: "array", cellDates: false, cellNF: false, cellStyles: false });
        var getSheet = function(name) {
            var wanted = String(name || "").trim().toLowerCase();
            for (var sn = 0; sn < k.SheetNames.length; sn++) {
                var sheetName = String(k.SheetNames[sn] || "").trim();
                if (sheetName.toLowerCase() === wanted) return k.Sheets[k.SheetNames[sn]]
            }
            return null
        };
        var E = getSheet("resumen");
        if (!E) { self.postMessage({ error: 'No se encontr\xF3 la hoja "resumen" en el archivo.' }); return }
        var I = XLSX.utils.sheet_to_json(E, { header: 1, defval: "" }), headerRow = -1;
        for (var L = 0; L < I.length; L++) { if (String(I[L][0]).trim() === "Fecha Carga") { headerRow = L; break } }
        if (headerRow === -1) { self.postMessage({ error: 'No se encontr\xF3 la fila "Fecha Carga" en la hoja resumen.' }); return }
        var valid = [], errors = [];
        var headerCols = I[headerRow] || [];
        var cFecha    = findColumn(headerCols, ["fechacarga","fecha"]);                              if (cFecha    === -1) cFecha    = 0;
        var cVendExt  = findColumn(headerCols, ["vendedorexterno","vendedorext","vendedor"]);        if (cVendExt  === -1) cVendExt  = 1;
        var cVendInt  = findColumn(headerCols, ["vendedorinterno","vendedorint"]);                   if (cVendInt  === -1) cVendInt  = 2;
        var cSolic    = findColumn(headerCols, ["solic","solicitante"]);                             if (cSolic    === -1) cSolic    = 3;
        var cCliente  = findColumn(headerCols, ["nombre","cliente","razonsocial","nombrecliente"]);  if (cCliente  === -1) cCliente  = 4;
        var cDoc      = findColumn(headerCols, ["docvtas","documentoventa","docventas","doc"]);      if (cDoc      === -1) cDoc      = 5;
        var cMat      = findColumn(headerCols, ["material"]);                                        if (cMat      === -1) cMat      = 6;
        var cDenom    = findColumn(headerCols, ["denominacion","descripcion","texto","denom"]);      if (cDenom    === -1) cDenom    = 7;
        var cStatus   = findColumn(headerCols, ["status","statusped"]);                              if (cStatus   === -1) cStatus   = 8;
        var cMotiv    = findColumn(headerCols, ["motivrech","motivorechazo","motiv"]);               if (cMotiv    === -1) cMotiv    = 9;
        var cDescrMot = findColumn(headerCols, ["descrmotrech","descrmot","descripcionmotivo"]);     if (cDescrMot === -1) cDescrMot = 10;
        var cAlmacen  = findColumn(headerCols, ["almacen"]);                                         if (cAlmacen  === -1) cAlmacen  = 11;
        var cFechaRec = findColumn(headerCols, ["fecharecibido","fecharecep","fechaentrada"]);       if (cFechaRec === -1) cFechaRec = 12;
        var cCondExp  = findColumn(headerCols, ["condexp","condicionexp","condicion"]);              if (cCondExp  === -1) cCondExp  = 13;
        var cPres     = findColumn(headerCols, ["presentacion"]);                                    if (cPres     === -1) cPres     = 14;
        var cCtdRec   = findColumn(headerCols, ["cantidadrecibida","ctdrecibida","ctdentr"]);        if (cCtdRec   === -1) cCtdRec   = 15;
        var cCtdPed   = findColumn(headerCols, ["cantidadpedido","cantped","ctdpedido"]);            if (cCtdPed   === -1) cCtdPed   = 16;
        var cCantFact = findColumn(headerCols, ["cantfact","cantidadfacturada","cantfacturada"]);    if (cCantFact === -1) cCantFact = 17;
        var cMonto    = findColumn(headerCols, ["totalimporte","importe","total"]);                  if (cMonto    === -1) cMonto    = 18;
        console.log("[WORKER RESUMEN] headerRow:", headerRow, "| cols → fecha:", cFecha, "doc:", cDoc, "mat:", cMat, "monto:", cMonto, "| header:", JSON.stringify(headerCols));
        for (var L = headerRow + 1; L < I.length; L++) {
            var v = I[L], excelRow = L + 1, rowErrors = [];
            var rawFecha   = String(v[cFecha]   || "").trim();
            var rawDoc     = String(v[cDoc]     || "").trim();
            var rawMat     = String(v[cMat]     || "").trim();
            var rawCliente = String(v[cCliente] || "").trim();
            var rawMonto   = v[cMonto];
            if (!rawFecha) { rowErrors.push({ field: "Fecha Carga", value: rawFecha, issue: "Fecha vac\xEDa" }) }
            if (rawFecha && rawFecha.toLowerCase().startsWith("total")) { rowErrors.push({ field: "Fecha Carga", value: rawFecha, issue: "Fila de totales/sumario" }) }
            if (!rawDoc) { rowErrors.push({ field: "Doc Venta", value: rawDoc, issue: "Documento de venta vac\xEDo" }) }
            if (rawDoc && rawDoc.toLowerCase().startsWith("total")) { rowErrors.push({ field: "Doc Venta", value: rawDoc, issue: "Fila de totales/sumario" }) }
            if (!rawMat) { rowErrors.push({ field: "Material", value: rawMat, issue: "Material vac\xEDo" }) }
            if (!rawCliente) { rowErrors.push({ field: "Cliente", value: rawCliente, issue: "Cliente vac\xEDo" }) }
            if (rawMonto !== "" && rawMonto !== null && rawMonto !== void 0 && isNaN(Number(rawMonto))) { rowErrors.push({ field: "Total Importe", value: String(rawMonto), issue: "Monto no num\xE9rico" }) }
            if (rowErrors.length > 0) { errors.push({ row: excelRow, errors: rowErrors }); continue }
            var U = null;
            if (rawFecha) {
                if (typeof v[cFecha] == "number") { var F = new Date(Math.round((v[cFecha] - 25569) * 86400 * 1e3)); U = F.toISOString() }
                else { var D = rawFecha.split("/"); if (D.length === 3) { var x = new Date(D[2], D[1] - 1, D[0]); U = x.toISOString() } }
            }
            valid.push({
                fecha_carga:       U,
                vendedor_externo:  String(v[cVendExt]  || "").trim() || null,
                vendedor_interno:  String(v[cVendInt]  || "").trim() || null,
                solic:             String(v[cSolic]    || "").trim() || null,
                nombre:            rawCliente || null,
                doc_vtas:          rawDoc || null,
                material:          rawMat || null,
                denominacion:      String(v[cDenom]    || "").trim() || null,
                status:            String(v[cStatus]   || "").trim() || null,
                motiv_rech:        String(v[cMotiv]    || "").trim() || null,
                descr_mot_rech:    String(v[cDescrMot] || "").trim() || null,
                almacen:           String(v[cAlmacen]  || "").trim() || null,
                fecha_recibido:    Ye(v[cFechaRec]),
                cond_exp:          String(v[cCondExp]  || "").trim() || null,
                presentacion:      String(v[cPres]     || "").trim() || null,
                cantidad_recibida: le(v[cCtdRec]),
                cantidad_pedido:   le(v[cCtdPed]),
                cant_fact:         le(v[cCantFact]),
                total_importe:     le(v[cMonto]),
                estado:            "pendiente"
            })
        }
        var stockData = [], contData = [], factData = [];
        var stockSheet = getSheet("stock");
        if (stockSheet) {
            var stockRows = XLSX.utils.sheet_to_json(stockSheet, { header: 1, defval: "" });
            var stockHeaderRow = -1;
            var stockColMat = 0, stockColDesc = 1, stockColAlm = 2, stockColCant = 3;
            for (var si = 0; si < Math.min(stockRows.length, 30); si++) {
                var srow = stockRows[si];
                var c0 = String(srow[0] || "").trim().toLowerCase();
                if (c0 === "material" || c0 === "materi." || c0.startsWith("material")) { stockHeaderRow = si; break }
            }
            if (stockHeaderRow === -1) {
                for (var si = 0; si < stockRows.length; si++) {
                    var srow = stockRows[si];
                    var c0 = String(srow[0] || "").trim();
                    if (c0 && /^\d{6,18}$/.test(c0)) { stockHeaderRow = Math.max(0, si - 1); break }
                }
                if (stockHeaderRow === -1) stockHeaderRow = 0
            }
            console.log("[WORKER STOCK] Total filas:", stockRows.length, "| Header fila:", stockHeaderRow, "| Header row:", JSON.stringify(stockRows[stockHeaderRow]));
            for (var si = stockHeaderRow + 1; si < stockRows.length; si++) {
                var srow = stockRows[si];
                var matCode = String(srow[stockColMat] || "").trim();
                if (!matCode) continue;
                if (matCode.toLowerCase().startsWith("total") || matCode.toLowerCase().startsWith("subtotal")) continue;
                var desc = String(srow[stockColDesc] || "").trim() || null;
                var alm  = String(srow[stockColAlm]  || "").trim() || "VAR";
                var cant = le(srow[stockColCant]);
                stockData.push({ material: matCode, descripcion: desc, almacen: alm, cantidad: cant || 0 })
            }
        }
        var contSheet = getSheet("contabilizados");
        if (contSheet) {
            var contRows = XLSX.utils.sheet_to_json(contSheet, { header: 1, defval: "" });
            contData = parseEstadoSheetRows(contRows, false)
        }
        var factSheet = getSheet("facturados");
        if (factSheet) {
            var factRows = XLSX.utils.sheet_to_json(factSheet, { header: 1, defval: "" });
            factData = parseEstadoSheetRows(factRows, true)
        }
        self.postMessage({ valid: valid, errors: errors, stock: stockData, contabilizados: contData, facturados: factData })
    } catch(ye) {
        self.postMessage({ error: ye.message || "Error al procesar el archivo Excel" })
    }
};
