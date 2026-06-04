var ta = Object.defineProperty,
    ra = Object.defineProperties;
var sa = Object.getOwnPropertyDescriptors;
var Lr = Object.getOwnPropertySymbols;
var na = Object.prototype.hasOwnProperty,
    aa = Object.prototype.propertyIsEnumerable;
var Nr = (l, h, d) => h in l ? ta(l, h, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: d
    }) : l[h] = d,
    z = (l, h) => {
        for (var d in h || (h = {})) na.call(h, d) && Nr(l, d, h[d]);
        if (Lr)
            for (var d of Lr(h)) aa.call(h, d) && Nr(l, d, h[d]);
        return l
    },
    Ue = (l, h) => ra(l, sa(h));
var supabase = function(l) {
        function h(t, e) {
            var r = {};
            for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && e.indexOf(s) < 0 && (r[s] = t[s]);
            if (t != null && typeof Object.getOwnPropertySymbols == "function")
                for (var n = 0, s = Object.getOwnPropertySymbols(t); n < s.length; n++) e.indexOf(s[n]) < 0 && Object.prototype.propertyIsEnumerable.call(t, s[n]) && (r[s[n]] = t[s[n]]);
            return r
        }

        function d(t, e, r, s) {
            function n(a) {
                return a instanceof r ? a : new r(function(i) {
                    i(a)
                })
            }
            return new(r || (r = Promise))(function(a, i) {
                function o(p) {
                    try {
                        u(s.next(p))
                    } catch (f) {
                        i(f)
                    }
                }

                function c(p) {
                    try {
                        u(s.throw(p))
                    } catch (f) {
                        i(f)
                    }
                }

                function u(p) {
                    p.done ? a(p.value) : n(p.value).then(o, c)
                }
                u((s = s.apply(t, e || [])).next())
            })
        }
        let g = t => t ? (...e) => t(...e) : (...e) => fetch(...e);
        var b = class extends Error {
                constructor(t, e = "FunctionsError", r) {
                    super(t), this.name = e, this.context = r
                }
                toJSON() {
                    return {
                        name: this.name,
                        message: this.message,
                        context: this.context
                    }
                }
            },
            k = class extends b {
                constructor(t) {
                    super("Failed to send a request to the Edge Function", "FunctionsFetchError", t)
                }
            },
            E = class extends b {
                constructor(t) {
                    super("Relay Error invoking the Edge Function", "FunctionsRelayError", t)
                }
            },
            I = class extends b {
                constructor(t) {
                    super("Edge Function returned a non-2xx status code", "FunctionsHttpError", t)
                }
            },
            $;
        (function(t) {
            t.Any = "any", t.ApNortheast1 = "ap-northeast-1", t.ApNortheast2 = "ap-northeast-2", t.ApSouth1 = "ap-south-1", t.ApSoutheast1 = "ap-southeast-1", t.ApSoutheast2 = "ap-southeast-2", t.CaCentral1 = "ca-central-1", t.EuCentral1 = "eu-central-1", t.EuWest1 = "eu-west-1", t.EuWest2 = "eu-west-2", t.EuWest3 = "eu-west-3", t.SaEast1 = "sa-east-1", t.UsEast1 = "us-east-1", t.UsWest1 = "us-west-1", t.UsWest2 = "us-west-2"
        })($ || ($ = {}));
        var L = class {
            constructor(t, {
                headers: e = {},
                customFetch: r,
                region: s = $.Any
            } = {}) {
                this.url = t, this.headers = e, this.region = s, this.fetch = g(r)
            }
            setAuth(t) {
                this.headers.Authorization = `Bearer ${t}`
            }
            invoke(t) {
                return d(this, arguments, void 0, function*(e, r = {}) {
                    var a;
                    let s, n;
                    try {
                        let {
                            headers: i,
                            method: o,
                            body: c,
                            signal: u,
                            timeout: p
                        } = r, f = {}, {
                            region: m
                        } = r;
                        m || (m = this.region);
                        let y = new URL(`${this.url}/${e}`);
                        m && m !== "any" && (f["x-region"] = m, y.searchParams.set("forceFunctionRegion", m));
                        let S;
                        c && (i && !Object.prototype.hasOwnProperty.call(i, "Content-Type") || !i) ? typeof Blob < "u" && c instanceof Blob || c instanceof ArrayBuffer ? (f["Content-Type"] = "application/octet-stream", S = c) : typeof c == "string" ? (f["Content-Type"] = "text/plain", S = c) : typeof FormData < "u" && c instanceof FormData ? S = c : (f["Content-Type"] = "application/json", S = JSON.stringify(c)) : S = c && typeof c != "string" && !(typeof Blob < "u" && c instanceof Blob) && !(c instanceof ArrayBuffer) && !(typeof FormData < "u" && c instanceof FormData) ? JSON.stringify(c) : c;
                        let R = u;
                        p && (n = new AbortController, s = setTimeout(() => n.abort(), p), u ? (R = n.signal, u.addEventListener("abort", () => n.abort())) : R = n.signal);
                        let T = yield this.fetch(y.toString(), {
                            method: o || "POST",
                            headers: Object.assign(Object.assign(Object.assign({}, f), this.headers), i),
                            body: S,
                            signal: R
                        }).catch(K => {
                            throw new k(K)
                        }), M = T.headers.get("x-relay-error");
                        if (M && M === "true") throw new E(T);
                        if (!T.ok) throw new I(T);
                        let C = ((a = T.headers.get("Content-Type")) != null ? a : "text/plain").split(";")[0].trim(),
                            j;
                        return j = C === "application/json" ? yield T.json(): C === "application/octet-stream" || C === "application/pdf" ? yield T.blob(): C === "text/event-stream" ? T : C === "multipart/form-data" ? yield T.formData(): yield T.text(), {
                            data: j,
                            error: null,
                            response: T
                        }
                    } catch (i) {
                        return {
                            data: null,
                            error: i,
                            response: i instanceof I || i instanceof E ? i.context : void 0
                        }
                    } finally {
                        s && clearTimeout(s)
                    }
                })
            }
        };
        let w = t => Math.min(1e3 * 2 ** t, 3e4),
            v = [520, 503],
            O = ["GET", "HEAD", "OPTIONS"];
        var N = class extends Error {
            constructor(t) {
                super(t.message), this.name = "PostgrestError", this.details = t.details, this.hint = t.hint, this.code = t.code
            }
            toJSON() {
                return {
                    name: this.name,
                    message: this.message,
                    details: this.details,
                    hint: this.hint,
                    code: this.code
                }
            }
        };

        function q(t, e) {
            return new Promise(r => {
                if (e != null && e.aborted) {
                    r();
                    return
                }
                let s = setTimeout(() => {
                    e == null || e.removeEventListener("abort", n), r()
                }, t);

                function n() {
                    clearTimeout(s), r()
                }
                e == null || e.addEventListener("abort", n)
            })
        }

        function U(t, e, r, s) {
            return !(!s || r >= 3 || !O.includes(t) || !v.includes(e))
        }
        var F = class {
                constructor(t) {
                    var e, r, s, n, a;
                    this.shouldThrowOnError = !1, this.retryEnabled = !0, this.method = t.method, this.url = t.url, this.headers = new Headers(t.headers), this.schema = t.schema, this.body = t.body, this.shouldThrowOnError = (e = t.shouldThrowOnError) != null ? e : !1, this.signal = t.signal, this.isMaybeSingle = (r = t.isMaybeSingle) != null ? r : !1, this.shouldStripNulls = (s = t.shouldStripNulls) != null ? s : !1, this.urlLengthLimit = (n = t.urlLengthLimit) != null ? n : 8e3, this.retryEnabled = (a = t.retry) != null ? a : !0, t.fetch ? this.fetch = t.fetch : this.fetch = fetch
                }
                throwOnError() {
                    return this.shouldThrowOnError = !0, this
                }
                stripNulls() {
                    if (this.headers.get("Accept") === "text/csv") throw Error("stripNulls() cannot be used with csv()");
                    return this.shouldStripNulls = !0, this
                }
                setHeader(t, e) {
                    return this.headers = new Headers(this.headers), this.headers.set(t, e), this
                }
                retry(t) {
                    return this.retryEnabled = t, this
                }
                then(t, e) {
                    var r = this;
                    if (this.schema === void 0 || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), this.method !== "GET" && this.method !== "HEAD" && this.headers.set("Content-Type", "application/json"), this.shouldStripNulls) {
                        let a = this.headers.get("Accept");
                        a === "application/vnd.pgrst.object+json" ? this.headers.set("Accept", "application/vnd.pgrst.object+json;nulls=stripped") : (!a || a === "application/json") && this.headers.set("Accept", "application/vnd.pgrst.array+json;nulls=stripped")
                    }
                    let s = this.fetch,
                        n = (async () => {
                            var i, o;
                            let a = 0;
                            for (;;) {
                                let c = new Headers(r.headers);
                                a > 0 && c.set("X-Retry-Count", String(a));
                                let u;
                                try {
                                    u = await s(r.url.toString(), {
                                        method: r.method,
                                        headers: c,
                                        body: JSON.stringify(r.body, (p, f) => typeof f == "bigint" ? f.toString() : f),
                                        signal: r.signal
                                    })
                                } catch (p) {
                                    if ((p == null ? void 0 : p.name) === "AbortError" || (p == null ? void 0 : p.code) === "ABORT_ERR" || !O.includes(r.method)) throw p;
                                    if (r.retryEnabled && a < 3) {
                                        let f = w(a);
                                        a++, await q(f, r.signal);
                                        continue
                                    }
                                    throw p
                                }
                                if (U(r.method, u.status, a, r.retryEnabled)) {
                                    let p = (o = (i = u.headers) == null ? void 0 : i.get("Retry-After")) != null ? o : null,
                                        f = p === null ? w(a) : Math.max(0, parseInt(p, 10) || 0) * 1e3;
                                    await u.text(), a++, await q(f, r.signal);
                                    continue
                                }
                                return await r.processResponse(u)
                            }
                        })();
                    return this.shouldThrowOnError || (n = n.catch(a => {
                        var f, m, y, S, R, T;
                        let i = "",
                            o = "",
                            c = "",
                            u = a == null ? void 0 : a.cause;
                        if (u) {
                            let M = (f = u == null ? void 0 : u.message) != null ? f : "",
                                C = (m = u == null ? void 0 : u.code) != null ? m : "";
                            i = `${(y=a==null?void 0:a.name)!=null?y:"FetchError"}: ${a==null?void 0:a.message}`, i += `

Caused by: ${(S=u==null?void 0:u.name)!=null?S:"Error"}: ${M}`, C && (i += ` (${C})`), u != null && u.stack && (i += `
${u.stack}`)
                        } else i = (R = a == null ? void 0 : a.stack) != null ? R : "";
                        let p = this.url.toString().length;
                        return (a == null ? void 0 : a.name) === "AbortError" || (a == null ? void 0 : a.code) === "ABORT_ERR" ? (c = "", o = "Request was aborted (timeout or manual cancellation)", p > this.urlLengthLimit && (o += `. Note: Your request URL is ${p} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)) : ((u == null ? void 0 : u.name) === "HeadersOverflowError" || (u == null ? void 0 : u.code) === "UND_ERR_HEADERS_OVERFLOW") && (c = "", o = "HTTP headers exceeded server limits (typically 16KB)", p > this.urlLengthLimit && (o += `. Your request URL is ${p} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)), {
                            success: !1,
                            error: {
                                message: `${(T=a==null?void 0:a.name)!=null?T:"FetchError"}: ${a==null?void 0:a.message}`,
                                details: i,
                                hint: o,
                                code: c
                            },
                            data: null,
                            count: null,
                            status: 0,
                            statusText: ""
                        }
                    })), n.then(t, e)
                }
                async processResponse(t) {
                    var o, c, u;
                    var e = this;
                    let r = null,
                        s = null,
                        n = null,
                        a = t.status,
                        i = t.statusText;
                    if (t.ok) {
                        if (e.method !== "HEAD") {
                            let m = await t.text();
                            m === "" || (s = e.headers.get("Accept") === "text/csv" || e.headers.get("Accept") && ((o = e.headers.get("Accept")) != null && o.includes("application/vnd.pgrst.plan+text")) ? m : JSON.parse(m))
                        }
                        let p = (c = e.headers.get("Prefer")) == null ? void 0 : c.match(/count=(exact|planned|estimated)/),
                            f = (u = t.headers.get("content-range")) == null ? void 0 : u.split("/");
                        p && f && f.length > 1 && (n = parseInt(f[1])), e.isMaybeSingle && Array.isArray(s) && (s.length > 1 ? (r = {
                            code: "PGRST116",
                            details: `Results contain ${s.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                            hint: null,
                            message: "JSON object requested, multiple (or no) rows returned"
                        }, s = null, n = null, a = 406, i = "Not Acceptable") : s = s.length === 1 ? s[0] : null)
                    } else {
                        let p = await t.text();
                        try {
                            r = JSON.parse(p), Array.isArray(r) && t.status === 404 && (s = [], r = null, a = 200, i = "OK")
                        } catch (f) {
                            t.status === 404 && p === "" ? (a = 204, i = "No Content") : r = {
                                message: p
                            }
                        }
                        if (r && e.shouldThrowOnError) throw new N(r)
                    }
                    return {
                        success: r === null,
                        error: r,
                        data: s,
                        count: n,
                        status: a,
                        statusText: i
                    }
                }
                returns() {
                    return this
                }
                overrideTypes() {
                    return this
                }
            },
            D = class extends F {
                select(t) {
                    let e = !1,
                        r = (t != null ? t : "*").split("").map(s => /\s/.test(s) && !e ? "" : (s === '"' && (e = !e), s)).join("");
                    return this.url.searchParams.set("select", r), this.headers.append("Prefer", "return=representation"), this
                }
                order(t, {
                    ascending: e = !0,
                    nullsFirst: r,
                    foreignTable: s,
                    referencedTable: n = s
                } = {}) {
                    let a = n ? `${n}.order` : "order",
                        i = this.url.searchParams.get(a);
                    return this.url.searchParams.set(a, `${i?`${i},`:""}${t}.${e?"asc":"desc"}${r===void 0?"":r?".nullsfirst":".nullslast"}`), this
                }
                limit(t, {
                    foreignTable: e,
                    referencedTable: r = e
                } = {}) {
                    let s = r === void 0 ? "limit" : `${r}.limit`;
                    return this.url.searchParams.set(s, `${t}`), this
                }
                range(t, e, {
                    foreignTable: r,
                    referencedTable: s = r
                } = {}) {
                    let n = s === void 0 ? "offset" : `${s}.offset`,
                        a = s === void 0 ? "limit" : `${s}.limit`;
                    return this.url.searchParams.set(n, `${t}`), this.url.searchParams.set(a, `${e-t+1}`), this
                }
                abortSignal(t) {
                    return this.signal = t, this
                }
                single() {
                    return this.headers.set("Accept", "application/vnd.pgrst.object+json"), this
                }
                maybeSingle() {
                    return this.isMaybeSingle = !0, this
                }
                csv() {
                    return this.headers.set("Accept", "text/csv"), this
                }
                geojson() {
                    return this.headers.set("Accept", "application/geo+json"), this
                }
                explain({
                    analyze: t = !1,
                    verbose: e = !1,
                    settings: r = !1,
                    buffers: s = !1,
                    wal: n = !1,
                    format: a = "text"
                } = {}) {
                    var c;
                    let i = [t ? "analyze" : null, e ? "verbose" : null, r ? "settings" : null, s ? "buffers" : null, n ? "wal" : null].filter(Boolean).join("|"),
                        o = (c = this.headers.get("Accept")) != null ? c : "application/json";
                    return this.headers.set("Accept", `application/vnd.pgrst.plan+${a}; for="${o}"; options=${i};`), this
                }
                rollback() {
                    return this.headers.append("Prefer", "tx=rollback"), this
                }
                returns() {
                    return this
                }
                maxAffected(t) {
                    return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${t}`), this
                }
            };
        let x = RegExp("[,()]");
        var B = class extends D {
                eq(t, e) {
                    return this.url.searchParams.append(t, `eq.${e}`), this
                }
                neq(t, e) {
                    return this.url.searchParams.append(t, `neq.${e}`), this
                }
                gt(t, e) {
                    return this.url.searchParams.append(t, `gt.${e}`), this
                }
                gte(t, e) {
                    return this.url.searchParams.append(t, `gte.${e}`), this
                }
                lt(t, e) {
                    return this.url.searchParams.append(t, `lt.${e}`), this
                }
                lte(t, e) {
                    return this.url.searchParams.append(t, `lte.${e}`), this
                }
                like(t, e) {
                    return this.url.searchParams.append(t, `like.${e}`), this
                }
                likeAllOf(t, e) {
                    return this.url.searchParams.append(t, `like(all).{${e.join(",")}}`), this
                }
                likeAnyOf(t, e) {
                    return this.url.searchParams.append(t, `like(any).{${e.join(",")}}`), this
                }
                ilike(t, e) {
                    return this.url.searchParams.append(t, `ilike.${e}`), this
                }
                ilikeAllOf(t, e) {
                    return this.url.searchParams.append(t, `ilike(all).{${e.join(",")}}`), this
                }
                ilikeAnyOf(t, e) {
                    return this.url.searchParams.append(t, `ilike(any).{${e.join(",")}}`), this
                }
                regexMatch(t, e) {
                    return this.url.searchParams.append(t, `match.${e}`), this
                }
                regexIMatch(t, e) {
                    return this.url.searchParams.append(t, `imatch.${e}`), this
                }
                is(t, e) {
                    return this.url.searchParams.append(t, `is.${e}`), this
                }
                isDistinct(t, e) {
                    return this.url.searchParams.append(t, `isdistinct.${e}`), this
                }
                in(t, e) {
                    let r = Array.from(new Set(e)).map(s => typeof s == "string" && x.test(s) ? `"${s}"` : `${s}`).join(",");
                    return this.url.searchParams.append(t, `in.(${r})`), this
                }
                notIn(t, e) {
                    let r = Array.from(new Set(e)).map(s => typeof s == "string" && x.test(s) ? `"${s}"` : `${s}`).join(",");
                    return this.url.searchParams.append(t, `not.in.(${r})`), this
                }
                contains(t, e) {
                    return typeof e == "string" ? this.url.searchParams.append(t, `cs.${e}`) : Array.isArray(e) ? this.url.searchParams.append(t, `cs.{${e.join(",")}}`) : this.url.searchParams.append(t, `cs.${JSON.stringify(e)}`), this
                }
                containedBy(t, e) {
                    return typeof e == "string" ? this.url.searchParams.append(t, `cd.${e}`) : Array.isArray(e) ? this.url.searchParams.append(t, `cd.{${e.join(",")}}`) : this.url.searchParams.append(t, `cd.${JSON.stringify(e)}`), this
                }
                rangeGt(t, e) {
                    return this.url.searchParams.append(t, `sr.${e}`), this
                }
                rangeGte(t, e) {
                    return this.url.searchParams.append(t, `nxl.${e}`), this
                }
                rangeLt(t, e) {
                    return this.url.searchParams.append(t, `sl.${e}`), this
                }
                rangeLte(t, e) {
                    return this.url.searchParams.append(t, `nxr.${e}`), this
                }
                rangeAdjacent(t, e) {
                    return this.url.searchParams.append(t, `adj.${e}`), this
                }
                overlaps(t, e) {
                    return typeof e == "string" ? this.url.searchParams.append(t, `ov.${e}`) : this.url.searchParams.append(t, `ov.{${e.join(",")}}`), this
                }
                textSearch(t, e, {
                    config: r,
                    type: s
                } = {}) {
                    let n = "";
                    s === "plain" ? n = "pl" : s === "phrase" ? n = "ph" : s === "websearch" && (n = "w");
                    let a = r === void 0 ? "" : `(${r})`;
                    return this.url.searchParams.append(t, `${n}fts${a}.${e}`), this
                }
                match(t) {
                    return Object.entries(t).filter(([e, r]) => r !== void 0).forEach(([e, r]) => {
                        this.url.searchParams.append(e, `eq.${r}`)
                    }), this
                }
                not(t, e, r) {
                    return this.url.searchParams.append(t, `not.${e}.${r}`), this
                }
                or(t, {
                    foreignTable: e,
                    referencedTable: r = e
                } = {}) {
                    let s = r ? `${r}.or` : "or";
                    return this.url.searchParams.append(s, `(${t})`), this
                }
                filter(t, e, r) {
                    return this.url.searchParams.append(t, `${e}.${r}`), this
                }
            },
            J = class {
                constructor(t, {
                    headers: e = {},
                    schema: r,
                    fetch: s,
                    urlLengthLimit: n = 8e3,
                    retry: a
                }) {
                    this.url = t, this.headers = new Headers(e), this.schema = r, this.fetch = s, this.urlLengthLimit = n, this.retry = a
                }
                cloneRequestState() {
                    return {
                        url: new URL(this.url.toString()),
                        headers: new Headers(this.headers)
                    }
                }
                select(t, e) {
                    let {
                        head: r = !1,
                        count: s
                    } = e != null ? e : {}, n = r ? "HEAD" : "GET", a = !1, i = (t != null ? t : "*").split("").map(u => /\s/.test(u) && !a ? "" : (u === '"' && (a = !a), u)).join(""), {
                        url: o,
                        headers: c
                    } = this.cloneRequestState();
                    return o.searchParams.set("select", i), s && c.append("Prefer", `count=${s}`), new B({
                        method: n,
                        url: o,
                        headers: c,
                        schema: this.schema,
                        fetch: this.fetch,
                        urlLengthLimit: this.urlLengthLimit,
                        retry: this.retry
                    })
                }
                insert(t, {
                    count: e,
                    defaultToNull: r = !0
                } = {}) {
                    var a;
                    let {
                        url: s,
                        headers: n
                    } = this.cloneRequestState();
                    if (e && n.append("Prefer", `count=${e}`), r || n.append("Prefer", "missing=default"), Array.isArray(t)) {
                        let i = t.reduce((o, c) => o.concat(Object.keys(c)), []);
                        if (i.length > 0) {
                            let o = [...new Set(i)].map(c => `"${c}"`);
                            s.searchParams.set("columns", o.join(","))
                        }
                    }
                    return new B({
                        method: "POST",
                        url: s,
                        headers: n,
                        schema: this.schema,
                        body: t,
                        fetch: (a = this.fetch) != null ? a : fetch,
                        urlLengthLimit: this.urlLengthLimit,
                        retry: this.retry
                    })
                }
                upsert(t, {
                    onConflict: e,
                    ignoreDuplicates: r = !1,
                    count: s,
                    defaultToNull: n = !0
                } = {}) {
                    var o;
                    let {
                        url: a,
                        headers: i
                    } = this.cloneRequestState();
                    if (i.append("Prefer", `resolution=${r?"ignore":"merge"}-duplicates`), e !== void 0 && a.searchParams.set("on_conflict", e), s && i.append("Prefer", `count=${s}`), n || i.append("Prefer", "missing=default"), Array.isArray(t)) {
                        let c = t.reduce((u, p) => u.concat(Object.keys(p)), []);
                        if (c.length > 0) {
                            let u = [...new Set(c)].map(p => `"${p}"`);
                            a.searchParams.set("columns", u.join(","))
                        }
                    }
                    return new B({
                        method: "POST",
                        url: a,
                        headers: i,
                        schema: this.schema,
                        body: t,
                        fetch: (o = this.fetch) != null ? o : fetch,
                        urlLengthLimit: this.urlLengthLimit,
                        retry: this.retry
                    })
                }
                update(t, {
                    count: e
                } = {}) {
                    var n;
                    let {
                        url: r,
                        headers: s
                    } = this.cloneRequestState();
                    return e && s.append("Prefer", `count=${e}`), new B({
                        method: "PATCH",
                        url: r,
                        headers: s,
                        schema: this.schema,
                        body: t,
                        fetch: (n = this.fetch) != null ? n : fetch,
                        urlLengthLimit: this.urlLengthLimit,
                        retry: this.retry
                    })
                }
                delete({
                    count: t
                } = {}) {
                    var s;
                    let {
                        url: e,
                        headers: r
                    } = this.cloneRequestState();
                    return t && r.append("Prefer", `count=${t}`), new B({
                        method: "DELETE",
                        url: e,
                        headers: r,
                        schema: this.schema,
                        fetch: (s = this.fetch) != null ? s : fetch,
                        urlLengthLimit: this.urlLengthLimit,
                        retry: this.retry
                    })
                }
            };

        function ye(t) {
            "@babel/helpers - typeof";
            return ye = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
                return typeof e
            } : function(e) {
                return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }, ye(t)
        }

        function le(t, e) {
            if (ye(t) != "object" || !t) return t;
            var r = t[Symbol.toPrimitive];
            if (r !== void 0) {
                var s = r.call(t, e || "default");
                if (ye(s) != "object") return s;
                throw TypeError("@@toPrimitive must return a primitive value.")
            }
            return (e === "string" ? String : Number)(t)
        }

        function Ye(t) {
            var e = le(t, "string");
            return ye(e) == "symbol" ? e : e + ""
        }

        function te(t, e, r) {
            return (e = Ye(e)) in t ? Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[e] = r, t
        }

        function be(t, e) {
            var r = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
                var s = Object.getOwnPropertySymbols(t);
                e && (s = s.filter(function(n) {
                    return Object.getOwnPropertyDescriptor(t, n).enumerable
                })), r.push.apply(r, s)
            }
            return r
        }

        function Te(t) {
            for (var e = 1; e < arguments.length; e++) {
                var r = arguments[e] == null ? {} : arguments[e];
                e % 2 ? be(Object(r), !0).forEach(function(s) {
                    te(t, s, r[s])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : be(Object(r)).forEach(function(s) {
                    Object.defineProperty(t, s, Object.getOwnPropertyDescriptor(r, s))
                })
            }
            return t
        }
        var Re = class Br {
                constructor(e, {
                    headers: r = {},
                    schema: s,
                    fetch: n,
                    timeout: a,
                    urlLengthLimit: i = 8e3,
                    retry: o
                } = {}) {
                    this.url = e, this.headers = new Headers(r), this.schemaName = s, this.urlLengthLimit = i;
                    let c = n != null ? n : globalThis.fetch;
                    a !== void 0 && a > 0 ? this.fetch = (u, p) => {
                        let f = new AbortController,
                            m = setTimeout(() => f.abort(), a),
                            y = p == null ? void 0 : p.signal;
                        if (y) {
                            if (y.aborted) return clearTimeout(m), c(u, p);
                            let S = () => {
                                clearTimeout(m), f.abort()
                            };
                            return y.addEventListener("abort", S, {
                                once: !0
                            }), c(u, Te(Te({}, p), {}, {
                                signal: f.signal
                            })).finally(() => {
                                clearTimeout(m), y.removeEventListener("abort", S)
                            })
                        }
                        return c(u, Te(Te({}, p), {}, {
                            signal: f.signal
                        })).finally(() => clearTimeout(m))
                    } : this.fetch = c, this.retry = o
                }
                from(e) {
                    if (!e || typeof e != "string" || e.trim() === "") throw Error("Invalid relation name: relation must be a non-empty string.");
                    return new J(new URL(`${this.url}/${e}`), {
                        headers: new Headers(this.headers),
                        schema: this.schemaName,
                        fetch: this.fetch,
                        urlLengthLimit: this.urlLengthLimit,
                        retry: this.retry
                    })
                }
                schema(e) {
                    return new Br(this.url, {
                        headers: this.headers,
                        schema: e,
                        fetch: this.fetch,
                        urlLengthLimit: this.urlLengthLimit,
                        retry: this.retry
                    })
                }
                rpc(e, r = {}, {
                    head: s = !1,
                    get: n = !1,
                    count: a
                } = {}) {
                    var m;
                    let i, o = new URL(`${this.url}/rpc/${e}`),
                        c, u = y => typeof y == "object" && !!y && (!Array.isArray(y) || y.some(u)),
                        p = s && Object.values(r).some(u);
                    p ? (i = "POST", c = r) : s || n ? (i = s ? "HEAD" : "GET", Object.entries(r).filter(([y, S]) => S !== void 0).map(([y, S]) => [y, Array.isArray(S) ? `{${S.join(",")}}` : `${S}`]).forEach(([y, S]) => {
                        o.searchParams.append(y, S)
                    })) : (i = "POST", c = r);
                    let f = new Headers(this.headers);
                    return p ? f.set("Prefer", a ? `count=${a},return=minimal` : "return=minimal") : a && f.set("Prefer", `count=${a}`), new B({
                        method: i,
                        url: o,
                        headers: f,
                        schema: this.schemaName,
                        body: c,
                        fetch: (m = this.fetch) != null ? m : fetch,
                        urlLengthLimit: this.urlLengthLimit,
                        retry: this.retry
                    })
                }
            },
            Xe = class {
                constructor() {}
                static detectEnvironment() {
                    var s;
                    if (typeof WebSocket < "u") return {
                        type: "native",
                        wsConstructor: WebSocket
                    };
                    let t = globalThis;
                    if (typeof globalThis < "u" && t.WebSocket !== void 0) return {
                        type: "native",
                        wsConstructor: t.WebSocket
                    };
                    let e = typeof global < "u" ? global : void 0;
                    if (e && e.WebSocket !== void 0) return {
                        type: "native",
                        wsConstructor: e.WebSocket
                    };
                    if (typeof globalThis < "u" && t.WebSocketPair !== void 0 && globalThis.WebSocket === void 0) return {
                        type: "cloudflare",
                        error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
                        workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."
                    };
                    if (typeof globalThis < "u" && t.EdgeRuntime || typeof navigator < "u" && ((s = navigator.userAgent) != null && s.includes("Vercel-Edge"))) return {
                        type: "unsupported",
                        error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
                        workaround: "Use serverless functions or a different deployment target for WebSocket functionality."
                    };
                    let r = globalThis.process;
                    if (r) {
                        let n = r.versions;
                        if (n && n.node) {
                            let a = n.node,
                                i = parseInt(a.replace(/^v/, "").split(".")[0]);
                            return i >= 22 ? globalThis.WebSocket === void 0 ? {
                                type: "unsupported",
                                error: `Node.js ${i} detected but native WebSocket not found.`,
                                workaround: "Provide a WebSocket implementation via the transport option."
                            } : {
                                type: "native",
                                wsConstructor: globalThis.WebSocket
                            } : {
                                type: "unsupported",
                                error: `Node.js ${i} detected without native WebSocket support.`,
                                workaround: `For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`
                            }
                        }
                    }
                    return {
                        type: "unsupported",
                        error: "Unknown JavaScript runtime without WebSocket support.",
                        workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."
                    }
                }
                static getWebSocketConstructor() {
                    let t = this.detectEnvironment();
                    if (t.wsConstructor) return t.wsConstructor;
                    let e = t.error || "WebSocket not supported in this environment.";
                    throw t.workaround && (e += `

Suggested solution: ${t.workaround}`), Error(e)
                }
                static isWebSocketSupported() {
                    try {
                        let t = this.detectEnvironment();
                        return t.type === "native" || t.type === "ws"
                    } catch (t) {
                        return !1
                    }
                }
            };
        let de = {
                closed: "closed",
                errored: "errored",
                joined: "joined",
                joining: "joining",
                leaving: "leaving"
            },
            Lt = {
                close: "phx_close",
                error: "phx_error",
                join: "phx_join",
                reply: "phx_reply",
                leave: "phx_leave",
                access_token: "access_token"
            },
            bt = {
                connecting: "connecting",
                open: "open",
                closing: "closing",
                closed: "closed"
            };
        var Dr = class {
                constructor(t) {
                    this.HEADER_LENGTH = 1, this.USER_BROADCAST_PUSH_META_LENGTH = 6, this.KINDS = {
                        userBroadcastPush: 3,
                        userBroadcast: 4
                    }, this.BINARY_ENCODING = 0, this.JSON_ENCODING = 1, this.BROADCAST_EVENT = "broadcast", this.allowedMetadataKeys = [], this.allowedMetadataKeys = t != null ? t : []
                }
                encode(t, e) {
                    if (t.event === this.BROADCAST_EVENT && !(t.payload instanceof ArrayBuffer) && typeof t.payload.event == "string") return e(this._binaryEncodeUserBroadcastPush(t));
                    let r = [t.join_ref, t.ref, t.topic, t.event, t.payload];
                    return e(JSON.stringify(r))
                }
                _binaryEncodeUserBroadcastPush(t) {
                    var e;
                    return this._isArrayBuffer((e = t.payload) == null ? void 0 : e.payload) ? this._encodeBinaryUserBroadcastPush(t) : this._encodeJsonUserBroadcastPush(t)
                }
                _encodeBinaryUserBroadcastPush(t) {
                    var r, s;
                    let e = (s = (r = t.payload) == null ? void 0 : r.payload) != null ? s : new ArrayBuffer(0);
                    return this._encodeUserBroadcastPush(t, this.BINARY_ENCODING, e)
                }
                _encodeJsonUserBroadcastPush(t) {
                    var s, n;
                    let e = (n = (s = t.payload) == null ? void 0 : s.payload) != null ? n : {},
                        r = new TextEncoder().encode(JSON.stringify(e)).buffer;
                    return this._encodeUserBroadcastPush(t, this.JSON_ENCODING, r)
                }
                _encodeUserBroadcastPush(t, e, r) {
                    var S, R;
                    let s = t.topic,
                        n = (S = t.ref) != null ? S : "",
                        a = (R = t.join_ref) != null ? R : "",
                        i = t.payload.event,
                        o = this.allowedMetadataKeys ? this._pick(t.payload, this.allowedMetadataKeys) : {},
                        c = Object.keys(o).length === 0 ? "" : JSON.stringify(o);
                    if (a.length > 255) throw Error(`joinRef length ${a.length} exceeds maximum of 255`);
                    if (n.length > 255) throw Error(`ref length ${n.length} exceeds maximum of 255`);
                    if (s.length > 255) throw Error(`topic length ${s.length} exceeds maximum of 255`);
                    if (i.length > 255) throw Error(`userEvent length ${i.length} exceeds maximum of 255`);
                    if (c.length > 255) throw Error(`metadata length ${c.length} exceeds maximum of 255`);
                    let u = this.USER_BROADCAST_PUSH_META_LENGTH + a.length + n.length + s.length + i.length + c.length,
                        p = new ArrayBuffer(this.HEADER_LENGTH + u),
                        f = new DataView(p),
                        m = 0;
                    f.setUint8(m++, this.KINDS.userBroadcastPush), f.setUint8(m++, a.length), f.setUint8(m++, n.length), f.setUint8(m++, s.length), f.setUint8(m++, i.length), f.setUint8(m++, c.length), f.setUint8(m++, e), Array.from(a, T => f.setUint8(m++, T.charCodeAt(0))), Array.from(n, T => f.setUint8(m++, T.charCodeAt(0))), Array.from(s, T => f.setUint8(m++, T.charCodeAt(0))), Array.from(i, T => f.setUint8(m++, T.charCodeAt(0))), Array.from(c, T => f.setUint8(m++, T.charCodeAt(0)));
                    var y = new Uint8Array(p.byteLength + r.byteLength);
                    return y.set(new Uint8Array(p), 0), y.set(new Uint8Array(r), p.byteLength), y.buffer
                }
                decode(t, e) {
                    if (this._isArrayBuffer(t)) return e(this._binaryDecode(t));
                    if (typeof t == "string") {
                        let [r, s, n, a, i] = JSON.parse(t);
                        return e({
                            join_ref: r,
                            ref: s,
                            topic: n,
                            event: a,
                            payload: i
                        })
                    }
                    return e({})
                }
                _binaryDecode(t) {
                    let e = new DataView(t),
                        r = e.getUint8(0),
                        s = new TextDecoder;
                    switch (r) {
                        case this.KINDS.userBroadcast:
                            return this._decodeUserBroadcast(t, e, s)
                    }
                }
                _decodeUserBroadcast(t, e, r) {
                    let s = e.getUint8(1),
                        n = e.getUint8(2),
                        a = e.getUint8(3),
                        i = e.getUint8(4),
                        o = this.HEADER_LENGTH + 4,
                        c = r.decode(t.slice(o, o + s));
                    o += s;
                    let u = r.decode(t.slice(o, o + n));
                    o += n;
                    let p = r.decode(t.slice(o, o + a));
                    o += a;
                    let f = t.slice(o, t.byteLength),
                        m = i === this.JSON_ENCODING ? JSON.parse(r.decode(f)) : f,
                        y = {
                            type: this.BROADCAST_EVENT,
                            event: u,
                            payload: m
                        };
                    return a > 0 && (y.meta = JSON.parse(p)), {
                        join_ref: null,
                        ref: null,
                        topic: c,
                        event: this.BROADCAST_EVENT,
                        payload: y
                    }
                }
                _isArrayBuffer(t) {
                    var e;
                    return t instanceof ArrayBuffer || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.name) === "ArrayBuffer"
                }
                _pick(t, e) {
                    return !t || typeof t != "object" ? {} : Object.fromEntries(Object.entries(t).filter(([r]) => e.includes(r)))
                }
            },
            H;
        (function(t) {
            t.abstime = "abstime", t.bool = "bool", t.date = "date", t.daterange = "daterange", t.float4 = "float4", t.float8 = "float8", t.int2 = "int2", t.int4 = "int4", t.int4range = "int4range", t.int8 = "int8", t.int8range = "int8range", t.json = "json", t.jsonb = "jsonb", t.money = "money", t.numeric = "numeric", t.oid = "oid", t.reltime = "reltime", t.text = "text", t.time = "time", t.timestamp = "timestamp", t.timestamptz = "timestamptz", t.timetz = "timetz", t.tsrange = "tsrange", t.tstzrange = "tstzrange"
        })(H || (H = {}));
        let Nt = (t, e, r = {}) => {
                var n;
                let s = (n = r.skipTypes) != null ? n : [];
                return e ? Object.keys(e).reduce((a, i) => (a[i] = Mr(i, t, e, s), a), {}) : {}
            },
            Mr = (t, e, r, s) => {
                var i;
                let n = (i = e.find(o => o.name === t)) == null ? void 0 : i.type,
                    a = r[t];
                return n && !s.includes(n) ? Bt(n, a) : wt(a)
            },
            Bt = (t, e) => {
                if (t.charAt(0) === "_") return Wr(e, t.slice(1, t.length));
                switch (t) {
                    case H.bool:
                        return qr(e);
                    case H.float4:
                    case H.float8:
                    case H.int2:
                    case H.int4:
                    case H.int8:
                    case H.numeric:
                    case H.oid:
                        return Fr(e);
                    case H.json:
                    case H.jsonb:
                        return Hr(e);
                    case H.timestamp:
                        return Kr(e);
                    case H.abstime:
                    case H.date:
                    case H.daterange:
                    case H.int4range:
                    case H.int8range:
                    case H.money:
                    case H.reltime:
                    case H.text:
                    case H.time:
                    case H.timestamptz:
                    case H.timetz:
                    case H.tsrange:
                    case H.tstzrange:
                        return wt(e);
                    default:
                        return wt(e)
                }
            },
            wt = t => t,
            qr = t => {
                switch (t) {
                    case "t":
                        return !0;
                    case "f":
                        return !1;
                    default:
                        return t
                }
            },
            Fr = t => {
                if (typeof t == "string") {
                    let e = parseFloat(t);
                    if (!Number.isNaN(e)) return e
                }
                return t
            },
            Hr = t => {
                if (typeof t == "string") try {
                    return JSON.parse(t)
                } catch (e) {
                    return t
                }
                return t
            },
            Wr = (t, e) => {
                if (typeof t != "string") return t;
                let r = t.length - 1,
                    s = t[r];
                if (t[0] === "{" && s === "}") {
                    let n, a = t.slice(1, r);
                    try {
                        n = JSON.parse("[" + a + "]")
                    } catch (i) {
                        n = a ? a.split(",") : []
                    }
                    return n.map(i => Bt(e, i))
                }
                return t
            },
            Kr = t => typeof t == "string" ? t.replace(" ", "T") : t,
            Ut = t => {
                let e = new URL(t);
                return e.protocol = e.protocol.replace(/^ws/i, "http"), e.pathname = e.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, ""), e.pathname === "" || e.pathname === "/" ? e.pathname = "/api/broadcast" : e.pathname += "/api/broadcast", e.href
            };
        var De = t => typeof t == "function" ? t : function() {
                return t
            },
            zr = typeof self < "u" ? self : null,
            Ae = typeof window < "u" ? window : null,
            ce = zr || Ae || globalThis,
            Jr = "2.0.0",
            Gr = 1e4,
            Vr = 1e3,
            ue = {
                connecting: 0,
                open: 1,
                closing: 2,
                closed: 3
            },
            Z = {
                closed: "closed",
                errored: "errored",
                joined: "joined",
                joining: "joining",
                leaving: "leaving"
            },
            pe = {
                close: "phx_close",
                error: "phx_error",
                join: "phx_join",
                reply: "phx_reply",
                leave: "phx_leave"
            },
            vt = {
                longpoll: "longpoll",
                websocket: "websocket"
            },
            Yr = {
                complete: 4
            },
            _t = "base64url.bearer.phx.",
            Qe = class {
                constructor(t, e, r, s) {
                    this.channel = t, this.event = e, this.payload = r || function() {
                        return {}
                    }, this.receivedResp = null, this.timeout = s, this.timeoutTimer = null, this.recHooks = [], this.sent = !1, this.ref = void 0
                }
                resend(t) {
                    this.timeout = t, this.reset(), this.send()
                }
                send() {
                    this.hasReceived("timeout") || (this.startTimeout(), this.sent = !0, this.channel.socket.push({
                        topic: this.channel.topic,
                        event: this.event,
                        payload: this.payload(),
                        ref: this.ref,
                        join_ref: this.channel.joinRef()
                    }))
                }
                receive(t, e) {
                    return this.hasReceived(t) && e(this.receivedResp.response), this.recHooks.push({
                        status: t,
                        callback: e
                    }), this
                }
                reset() {
                    this.cancelRefEvent(), this.ref = null, this.refEvent = null, this.receivedResp = null, this.sent = !1
                }
                destroy() {
                    this.cancelRefEvent(), this.cancelTimeout()
                }
                matchReceive({
                    status: t,
                    response: e,
                    _ref: r
                }) {
                    this.recHooks.filter(s => s.status === t).forEach(s => s.callback(e))
                }
                cancelRefEvent() {
                    this.refEvent && this.channel.off(this.refEvent)
                }
                cancelTimeout() {
                    clearTimeout(this.timeoutTimer), this.timeoutTimer = null
                }
                startTimeout() {
                    this.timeoutTimer && this.cancelTimeout(), this.ref = this.channel.socket.makeRef(), this.refEvent = this.channel.replyEventName(this.ref), this.channel.on(this.refEvent, t => {
                        this.cancelRefEvent(), this.cancelTimeout(), this.receivedResp = t, this.matchReceive(t)
                    }), this.timeoutTimer = setTimeout(() => {
                        this.trigger("timeout", {})
                    }, this.timeout)
                }
                hasReceived(t) {
                    return this.receivedResp && this.receivedResp.status === t
                }
                trigger(t, e) {
                    this.channel.trigger(this.refEvent, {
                        status: t,
                        response: e
                    })
                }
            },
            Dt = class {
                constructor(t, e) {
                    this.callback = t, this.timerCalc = e, this.timer = void 0, this.tries = 0
                }
                reset() {
                    this.tries = 0, clearTimeout(this.timer)
                }
                scheduleTimeout() {
                    clearTimeout(this.timer), this.timer = setTimeout(() => {
                        this.tries += 1, this.callback()
                    }, this.timerCalc(this.tries + 1))
                }
            },
            Xr = class {
                constructor(t, e, r) {
                    this.state = Z.closed, this.topic = t, this.params = De(e || {}), this.socket = r, this.bindings = [], this.bindingRef = 0, this.timeout = this.socket.timeout, this.joinedOnce = !1, this.joinPush = new Qe(this, pe.join, this.params, this.timeout), this.pushBuffer = [], this.stateChangeRefs = [], this.rejoinTimer = new Dt(() => {
                        this.socket.isConnected() && this.rejoin()
                    }, this.socket.rejoinAfterMs), this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset())), this.stateChangeRefs.push(this.socket.onOpen(() => {
                        this.rejoinTimer.reset(), this.isErrored() && this.rejoin()
                    })), this.joinPush.receive("ok", () => {
                        this.state = Z.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach(s => s.send()), this.pushBuffer = []
                    }), this.joinPush.receive("error", s => {
                        this.state = Z.errored, this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, s), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout()
                    }), this.onClose(() => {
                        this.rejoinTimer.reset(), this.socket.hasLogger() && this.socket.log("channel", `close ${this.topic}`), this.state = Z.closed, this.socket.remove(this)
                    }), this.onError(s => {
                        this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, s), this.isJoining() && this.joinPush.reset(), this.state = Z.errored, this.socket.isConnected() && this.rejoinTimer.scheduleTimeout()
                    }), this.joinPush.receive("timeout", () => {
                        this.socket.hasLogger() && this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), new Qe(this, pe.leave, De({}), this.timeout).send(), this.state = Z.errored, this.joinPush.reset(), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout()
                    }), this.on(pe.reply, (s, n) => {
                        this.trigger(this.replyEventName(n), s)
                    })
                }
                join(t = this.timeout) {
                    if (this.joinedOnce) throw Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
                    return this.timeout = t, this.joinedOnce = !0, this.rejoin(), this.joinPush
                }
                teardown() {
                    this.pushBuffer.forEach(t => t.destroy()), this.pushBuffer = [], this.rejoinTimer.reset(), this.joinPush.destroy(), this.state = Z.closed, this.bindings = []
                }
                onClose(t) {
                    this.on(pe.close, t)
                }
                onError(t) {
                    return this.on(pe.error, e => t(e))
                }
                on(t, e) {
                    let r = this.bindingRef++;
                    return this.bindings.push({
                        event: t,
                        ref: r,
                        callback: e
                    }), r
                }
                off(t, e) {
                    this.bindings = this.bindings.filter(r => !(r.event === t && (e === void 0 || e === r.ref)))
                }
                canPush() {
                    return this.socket.isConnected() && this.isJoined()
                }
                push(t, e, r = this.timeout) {
                    if (e || (e = {}), !this.joinedOnce) throw Error(`tried to push '${t}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
                    let s = new Qe(this, t, function() {
                        return e
                    }, r);
                    return this.canPush() ? s.send() : (s.startTimeout(), this.pushBuffer.push(s)), s
                }
                leave(t = this.timeout) {
                    this.rejoinTimer.reset(), this.joinPush.cancelTimeout(), this.state = Z.leaving;
                    let e = () => {
                            this.socket.hasLogger() && this.socket.log("channel", `leave ${this.topic}`), this.trigger(pe.close, "leave")
                        },
                        r = new Qe(this, pe.leave, De({}), t);
                    return r.receive("ok", () => e()).receive("timeout", () => e()), r.send(), this.canPush() || r.trigger("ok", {}), r
                }
                onMessage(t, e, r) {
                    return e
                }
                filterBindings(t, e, r) {
                    return !0
                }
                isMember(t, e, r, s) {
                    return this.topic === t ? s && s !== this.joinRef() ? (this.socket.hasLogger() && this.socket.log("channel", "dropping outdated message", {
                        topic: t,
                        event: e,
                        payload: r,
                        joinRef: s
                    }), !1) : !0 : !1
                }
                joinRef() {
                    return this.joinPush.ref
                }
                rejoin(t = this.timeout) {
                    this.isLeaving() || (this.socket.leaveOpenTopic(this.topic), this.state = Z.joining, this.joinPush.resend(t))
                }
                trigger(t, e, r, s) {
                    let n = this.onMessage(t, e, r, s);
                    if (e && !n) throw Error("channel onMessage callbacks must return the payload, modified or unmodified");
                    let a = this.bindings.filter(i => i.event === t && this.filterBindings(i, e, r));
                    for (let i = 0; i < a.length; i++) a[i].callback(n, r, s || this.joinRef())
                }
                replyEventName(t) {
                    return `chan_reply_${t}`
                }
                isClosed() {
                    return this.state === Z.closed
                }
                isErrored() {
                    return this.state === Z.errored
                }
                isJoined() {
                    return this.state === Z.joined
                }
                isJoining() {
                    return this.state === Z.joining
                }
                isLeaving() {
                    return this.state === Z.leaving
                }
            },
            Ze = class {
                static request(t, e, r, s, n, a, i) {
                    if (ce.XDomainRequest) {
                        let o = new ce.XDomainRequest;
                        return this.xdomainRequest(o, t, e, s, n, a, i)
                    } else if (ce.XMLHttpRequest) {
                        let o = new ce.XMLHttpRequest;
                        return this.xhrRequest(o, t, e, r, s, n, a, i)
                    } else {
                        if (ce.fetch && ce.AbortController) return this.fetchRequest(t, e, r, s, n, a, i);
                        throw Error("No suitable XMLHttpRequest implementation found")
                    }
                }
                static fetchRequest(t, e, r, s, n, a, i) {
                    let o = {
                            method: t,
                            headers: r,
                            body: s
                        },
                        c = null;
                    return n && (c = new AbortController, setTimeout(() => c.abort(), n), o.signal = c.signal), ce.fetch(e, o).then(u => u.text()).then(u => this.parseJSON(u)).then(u => i && i(u)).catch(u => {
                        u.name === "AbortError" && a ? a() : i && i(null)
                    }), c
                }
                static xdomainRequest(t, e, r, s, n, a, i) {
                    return t.timeout = n, t.open(e, r), t.onload = () => {
                        let o = this.parseJSON(t.responseText);
                        i && i(o)
                    }, a && (t.ontimeout = a), t.onprogress = () => {}, t.send(s), t
                }
                static xhrRequest(t, e, r, s, n, a, i, o) {
                    t.open(e, r, !0), t.timeout = a;
                    for (let [c, u] of Object.entries(s)) t.setRequestHeader(c, u);
                    return t.onerror = () => o && o(null), t.onreadystatechange = () => {
                        t.readyState === Yr.complete && o && o(this.parseJSON(t.responseText))
                    }, i && (t.ontimeout = i), t.send(n), t
                }
                static parseJSON(t) {
                    if (!t || t === "") return null;
                    try {
                        return JSON.parse(t)
                    } catch (e) {
                        return console && console.log("failed to parse JSON response", t), null
                    }
                }
                static serialize(t, e) {
                    let r = [];
                    for (var s in t) {
                        if (!Object.prototype.hasOwnProperty.call(t, s)) continue;
                        let n = e ? `${e}[${s}]` : s,
                            a = t[s];
                        typeof a == "object" ? r.push(this.serialize(a, n)) : r.push(encodeURIComponent(n) + "=" + encodeURIComponent(a))
                    }
                    return r.join("&")
                }
                static appendParams(t, e) {
                    return Object.keys(e).length === 0 ? t : `${t}${t.match(/\?/)?"&":"?"}${this.serialize(e)}`
                }
            },
            Qr = t => {
                let e = "",
                    r = new Uint8Array(t),
                    s = r.byteLength;
                for (let n = 0; n < s; n++) e += String.fromCharCode(r[n]);
                return btoa(e)
            },
            Ie = class {
                constructor(t, e) {
                    e && e.length === 2 && e[1].startsWith(_t) && (this.authToken = atob(e[1].slice(_t.length))), this.endPoint = null, this.token = null, this.skipHeartbeat = !0, this.reqs = new Set, this.awaitingBatchAck = !1, this.currentBatch = null, this.currentBatchTimer = null, this.batchBuffer = [], this.onopen = function() {}, this.onerror = function() {}, this.onmessage = function() {}, this.onclose = function() {}, this.pollEndpoint = this.normalizeEndpoint(t), this.readyState = ue.connecting, setTimeout(() => this.poll(), 0)
                }
                normalizeEndpoint(t) {
                    return t.replace("ws://", "http://").replace("wss://", "https://").replace(RegExp("(.*)/" + vt.websocket), "$1/" + vt.longpoll)
                }
                endpointURL() {
                    return Ze.appendParams(this.pollEndpoint, {
                        token: this.token
                    })
                }
                closeAndRetry(t, e, r) {
                    this.close(t, e, r), this.readyState = ue.connecting
                }
                ontimeout() {
                    this.onerror("timeout"), this.closeAndRetry(1005, "timeout", !1)
                }
                isActive() {
                    return this.readyState === ue.open || this.readyState === ue.connecting
                }
                poll() {
                    let t = {
                        Accept: "application/json"
                    };
                    this.authToken && (t["X-Phoenix-AuthToken"] = this.authToken), this.ajax("GET", t, null, () => this.ontimeout(), e => {
                        if (e) {
                            var {
                                status: r,
                                token: s,
                                messages: n
                            } = e;
                            if (r === 410 && this.token !== null) {
                                this.onerror(410), this.closeAndRetry(3410, "session_gone", !1);
                                return
                            }
                            this.token = s
                        } else r = 0;
                        switch (r) {
                            case 200:
                                n.forEach(a => {
                                    setTimeout(() => this.onmessage({
                                        data: a
                                    }), 0)
                                }), this.poll();
                                break;
                            case 204:
                                this.poll();
                                break;
                            case 410:
                                this.readyState = ue.open, this.onopen({}), this.poll();
                                break;
                            case 403:
                                this.onerror(403), this.close(1008, "forbidden", !1);
                                break;
                            case 0:
                            case 500:
                                this.onerror(500), this.closeAndRetry(1011, "internal server error", 500);
                                break;
                            default:
                                throw Error(`unhandled poll status ${r}`)
                        }
                    })
                }
                send(t) {
                    typeof t != "string" && (t = Qr(t)), this.currentBatch ? this.currentBatch.push(t) : this.awaitingBatchAck ? this.batchBuffer.push(t) : (this.currentBatch = [t], this.currentBatchTimer = setTimeout(() => {
                        this.batchSend(this.currentBatch), this.currentBatch = null
                    }, 0))
                }
                batchSend(t) {
                    this.awaitingBatchAck = !0, this.ajax("POST", {
                        "Content-Type": "application/x-ndjson"
                    }, t.join(`
`), () => this.onerror("timeout"), e => {
                        this.awaitingBatchAck = !1, !e || e.status !== 200 ? (this.onerror(e && e.status), this.closeAndRetry(1011, "internal server error", !1)) : this.batchBuffer.length > 0 && (this.batchSend(this.batchBuffer), this.batchBuffer = [])
                    })
                }
                close(t, e, r) {
                    for (let n of this.reqs) n.abort();
                    this.readyState = ue.closed;
                    let s = Object.assign({
                        code: 1e3,
                        reason: void 0,
                        wasClean: !0
                    }, {
                        code: t,
                        reason: e,
                        wasClean: r
                    });
                    this.batchBuffer = [], clearTimeout(this.currentBatchTimer), this.currentBatchTimer = null, typeof CloseEvent < "u" ? this.onclose(new CloseEvent("close", s)) : this.onclose(s)
                }
                ajax(t, e, r, s, n) {
                    let a;
                    a = Ze.request(t, this.endpointURL(), e, r, this.timeout, () => {
                        this.reqs.delete(a), s()
                    }, i => {
                        this.reqs.delete(a), this.isActive() && n(i)
                    }), this.reqs.add(a)
                }
            },
            Zr = class Ve {
                constructor(e, r = {}) {
                    let s = r.events || {
                        state: "presence_state",
                        diff: "presence_diff"
                    };
                    this.state = {}, this.pendingDiffs = [], this.channel = e, this.joinRef = null, this.caller = {
                        onJoin: function() {},
                        onLeave: function() {},
                        onSync: function() {}
                    }, this.channel.on(s.state, n => {
                        let {
                            onJoin: a,
                            onLeave: i,
                            onSync: o
                        } = this.caller;
                        this.joinRef = this.channel.joinRef(), this.state = Ve.syncState(this.state, n, a, i), this.pendingDiffs.forEach(c => {
                            this.state = Ve.syncDiff(this.state, c, a, i)
                        }), this.pendingDiffs = [], o()
                    }), this.channel.on(s.diff, n => {
                        let {
                            onJoin: a,
                            onLeave: i,
                            onSync: o
                        } = this.caller;
                        this.inPendingSyncState() ? this.pendingDiffs.push(n) : (this.state = Ve.syncDiff(this.state, n, a, i), o())
                    })
                }
                onJoin(e) {
                    this.caller.onJoin = e
                }
                onLeave(e) {
                    this.caller.onLeave = e
                }
                onSync(e) {
                    this.caller.onSync = e
                }
                list(e) {
                    return Ve.list(this.state, e)
                }
                inPendingSyncState() {
                    return !this.joinRef || this.joinRef !== this.channel.joinRef()
                }
                static syncState(e, r, s, n) {
                    let a = this.clone(e),
                        i = {},
                        o = {};
                    return this.map(a, (c, u) => {
                        r[c] || (o[c] = u)
                    }), this.map(r, (c, u) => {
                        let p = a[c];
                        if (p) {
                            let f = u.metas.map(R => R.phx_ref),
                                m = p.metas.map(R => R.phx_ref),
                                y = u.metas.filter(R => m.indexOf(R.phx_ref) < 0),
                                S = p.metas.filter(R => f.indexOf(R.phx_ref) < 0);
                            y.length > 0 && (i[c] = u, i[c].metas = y), S.length > 0 && (o[c] = this.clone(p), o[c].metas = S)
                        } else i[c] = u
                    }), this.syncDiff(a, {
                        joins: i,
                        leaves: o
                    }, s, n)
                }
                static syncDiff(e, r, s, n) {
                    let {
                        joins: a,
                        leaves: i
                    } = this.clone(r);
                    return s || (s = function() {}), n || (n = function() {}), this.map(a, (o, c) => {
                        let u = e[o];
                        if (e[o] = this.clone(c), u) {
                            let p = e[o].metas.map(m => m.phx_ref),
                                f = u.metas.filter(m => p.indexOf(m.phx_ref) < 0);
                            e[o].metas.unshift(...f)
                        }
                        s(o, u, c)
                    }), this.map(i, (o, c) => {
                        let u = e[o];
                        if (!u) return;
                        let p = c.metas.map(f => f.phx_ref);
                        u.metas = u.metas.filter(f => p.indexOf(f.phx_ref) < 0), n(o, u, c), u.metas.length === 0 && delete e[o]
                    }), e
                }
                static list(e, r) {
                    return r || (r = function(s, n) {
                        return n
                    }), this.map(e, (s, n) => r(s, n))
                }
                static map(e, r) {
                    return Object.getOwnPropertyNames(e).map(s => r(s, e[s]))
                }
                static clone(e) {
                    return JSON.parse(JSON.stringify(e))
                }
            },
            et = {
                HEADER_LENGTH: 1,
                META_LENGTH: 4,
                KINDS: {
                    push: 0,
                    reply: 1,
                    broadcast: 2
                },
                encode(t, e) {
                    if (t.payload.constructor === ArrayBuffer) return e(this.binaryEncode(t));
                    {
                        let r = [t.join_ref, t.ref, t.topic, t.event, t.payload];
                        return e(JSON.stringify(r))
                    }
                },
                decode(t, e) {
                    if (t.constructor === ArrayBuffer) return e(this.binaryDecode(t));
                    {
                        let [r, s, n, a, i] = JSON.parse(t);
                        return e({
                            join_ref: r,
                            ref: s,
                            topic: n,
                            event: a,
                            payload: i
                        })
                    }
                },
                binaryEncode(t) {
                    let {
                        join_ref: e,
                        ref: r,
                        event: s,
                        topic: n,
                        payload: a
                    } = t, i = this.META_LENGTH + e.length + r.length + n.length + s.length, o = new ArrayBuffer(this.HEADER_LENGTH + i), c = new DataView(o), u = 0;
                    c.setUint8(u++, this.KINDS.push), c.setUint8(u++, e.length), c.setUint8(u++, r.length), c.setUint8(u++, n.length), c.setUint8(u++, s.length), Array.from(e, f => c.setUint8(u++, f.charCodeAt(0))), Array.from(r, f => c.setUint8(u++, f.charCodeAt(0))), Array.from(n, f => c.setUint8(u++, f.charCodeAt(0))), Array.from(s, f => c.setUint8(u++, f.charCodeAt(0)));
                    var p = new Uint8Array(o.byteLength + a.byteLength);
                    return p.set(new Uint8Array(o), 0), p.set(new Uint8Array(a), o.byteLength), p.buffer
                },
                binaryDecode(t) {
                    let e = new DataView(t),
                        r = e.getUint8(0),
                        s = new TextDecoder;
                    switch (r) {
                        case this.KINDS.push:
                            return this.decodePush(t, e, s);
                        case this.KINDS.reply:
                            return this.decodeReply(t, e, s);
                        case this.KINDS.broadcast:
                            return this.decodeBroadcast(t, e, s)
                    }
                },
                decodePush(t, e, r) {
                    let s = e.getUint8(1),
                        n = e.getUint8(2),
                        a = e.getUint8(3),
                        i = this.HEADER_LENGTH + this.META_LENGTH - 1,
                        o = r.decode(t.slice(i, i + s));
                    i += s;
                    let c = r.decode(t.slice(i, i + n));
                    i += n;
                    let u = r.decode(t.slice(i, i + a));
                    return i += a, {
                        join_ref: o,
                        ref: null,
                        topic: c,
                        event: u,
                        payload: t.slice(i, t.byteLength)
                    }
                },
                decodeReply(t, e, r) {
                    let s = e.getUint8(1),
                        n = e.getUint8(2),
                        a = e.getUint8(3),
                        i = e.getUint8(4),
                        o = this.HEADER_LENGTH + this.META_LENGTH,
                        c = r.decode(t.slice(o, o + s));
                    o += s;
                    let u = r.decode(t.slice(o, o + n));
                    o += n;
                    let p = r.decode(t.slice(o, o + a));
                    o += a;
                    let f = r.decode(t.slice(o, o + i));
                    o += i;
                    let m = {
                        status: f,
                        response: t.slice(o, t.byteLength)
                    };
                    return {
                        join_ref: c,
                        ref: u,
                        topic: p,
                        event: pe.reply,
                        payload: m
                    }
                },
                decodeBroadcast(t, e, r) {
                    let s = e.getUint8(1),
                        n = e.getUint8(2),
                        a = this.HEADER_LENGTH + 2,
                        i = r.decode(t.slice(a, a + s));
                    a += s;
                    let o = r.decode(t.slice(a, a + n));
                    return a += n, {
                        join_ref: null,
                        ref: null,
                        topic: i,
                        event: o,
                        payload: t.slice(a, t.byteLength)
                    }
                }
            },
            es = class {
                constructor(t, e = {}) {
                    var n, a;
                    this.stateChangeCallbacks = {
                        open: [],
                        close: [],
                        error: [],
                        message: []
                    }, this.channels = [], this.sendBuffer = [], this.ref = 0, this.fallbackRef = null, this.timeout = e.timeout || Gr, this.transport = e.transport || ce.WebSocket || Ie, this.conn = void 0, this.primaryPassedHealthCheck = !1, this.longPollFallbackMs = e.longPollFallbackMs, this.fallbackTimer = null;
                    let r = null;
                    try {
                        r = ce && ce.sessionStorage
                    } catch (i) {}
                    this.sessionStore = e.sessionStorage || r, this.establishedConnections = 0, this.defaultEncoder = et.encode.bind(et), this.defaultDecoder = et.decode.bind(et), this.closeWasClean = !0, this.disconnecting = !1, this.binaryType = e.binaryType || "arraybuffer", this.connectClock = 1, this.pageHidden = !1, this.encode = void 0, this.decode = void 0, this.transport === Ie ? (this.encode = this.defaultEncoder, this.decode = this.defaultDecoder) : (this.encode = e.encode || this.defaultEncoder, this.decode = e.decode || this.defaultDecoder);
                    let s = null;
                    Ae && Ae.addEventListener && (Ae.addEventListener("pagehide", i => {
                        this.conn && (this.disconnect(), s = this.connectClock)
                    }), Ae.addEventListener("pageshow", i => {
                        s === this.connectClock && (s = null, this.connect())
                    }), Ae.addEventListener("visibilitychange", () => {
                        document.visibilityState === "hidden" ? this.pageHidden = !0 : (this.pageHidden = !1, !this.isConnected() && !this.closeWasClean && this.teardown(() => this.connect()))
                    })), this.heartbeatIntervalMs = e.heartbeatIntervalMs || 3e4, this.autoSendHeartbeat = (n = e.autoSendHeartbeat) != null ? n : !0, this.heartbeatCallback = (a = e.heartbeatCallback) != null ? a : () => {}, this.rejoinAfterMs = i => e.rejoinAfterMs ? e.rejoinAfterMs(i) : [1e3, 2e3, 5e3][i - 1] || 1e4, this.reconnectAfterMs = i => e.reconnectAfterMs ? e.reconnectAfterMs(i) : [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][i - 1] || 5e3, this.logger = e.logger || null, !this.logger && e.debug && (this.logger = (i, o, c) => {
                        console.log(`${i}: ${o}`, c)
                    }), this.longpollerTimeout = e.longpollerTimeout || 2e4, this.params = De(e.params || {}), this.endPoint = `${t}/${vt.websocket}`, this.vsn = e.vsn || Jr, this.heartbeatTimeoutTimer = null, this.heartbeatTimer = null, this.heartbeatSentAt = null, this.pendingHeartbeatRef = null, this.reconnectTimer = new Dt(() => {
                        if (this.pageHidden) {
                            this.log("Not reconnecting as page is hidden!"), this.teardown();
                            return
                        }
                        this.teardown(async () => {
                            e.beforeReconnect && await e.beforeReconnect(), this.connect()
                        })
                    }, this.reconnectAfterMs), this.authToken = e.authToken
                }
                getLongPollTransport() {
                    return Ie
                }
                replaceTransport(t) {
                    this.connectClock++, this.closeWasClean = !0, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.conn && (this.conn = (this.conn.close(), null)), this.transport = t
                }
                protocol() {
                    return location.protocol.match(/^https/) ? "wss" : "ws"
                }
                endPointURL() {
                    let t = Ze.appendParams(Ze.appendParams(this.endPoint, this.params()), {
                        vsn: this.vsn
                    });
                    return t.charAt(0) === "/" ? t.charAt(1) === "/" ? `${this.protocol()}:${t}` : `${this.protocol()}://${location.host}${t}` : t
                }
                disconnect(t, e, r) {
                    this.connectClock++, this.disconnecting = !0, this.closeWasClean = !0, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.teardown(() => {
                        this.disconnecting = !1, t && t()
                    }, e, r)
                }
                connect(t) {
                    t && (console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"), this.params = De(t)), !(this.conn && !this.disconnecting) && (this.longPollFallbackMs && this.transport !== Ie ? this.connectWithFallback(Ie, this.longPollFallbackMs) : this.transportConnect())
                }
                log(t, e, r) {
                    this.logger && this.logger(t, e, r)
                }
                hasLogger() {
                    return this.logger !== null
                }
                onOpen(t) {
                    let e = this.makeRef();
                    return this.stateChangeCallbacks.open.push([e, t]), e
                }
                onClose(t) {
                    let e = this.makeRef();
                    return this.stateChangeCallbacks.close.push([e, t]), e
                }
                onError(t) {
                    let e = this.makeRef();
                    return this.stateChangeCallbacks.error.push([e, t]), e
                }
                onMessage(t) {
                    let e = this.makeRef();
                    return this.stateChangeCallbacks.message.push([e, t]), e
                }
                onHeartbeat(t) {
                    this.heartbeatCallback = t
                }
                ping(t) {
                    if (!this.isConnected()) return !1;
                    let e = this.makeRef(),
                        r = Date.now();
                    this.push({
                        topic: "phoenix",
                        event: "heartbeat",
                        payload: {},
                        ref: e
                    });
                    let s = this.onMessage(n => {
                        n.ref === e && (this.off([s]), t(Date.now() - r))
                    });
                    return !0
                }
                transportName(t) {
                    switch (t) {
                        case Ie:
                            return "LongPoll";
                        default:
                            return t.name
                    }
                }
                transportConnect() {
                    this.connectClock++, this.closeWasClean = !1;
                    let t;
                    this.authToken && (t = ["phoenix", `${_t}${btoa(this.authToken).replace(/=/g,"")}`]), this.conn = new this.transport(this.endPointURL(), t), this.conn.binaryType = this.binaryType, this.conn.timeout = this.longpollerTimeout, this.conn.onopen = () => this.onConnOpen(), this.conn.onerror = e => this.onConnError(e), this.conn.onmessage = e => this.onConnMessage(e), this.conn.onclose = e => this.onConnClose(e)
                }
                getSession(t) {
                    return this.sessionStore && this.sessionStore.getItem(t)
                }
                storeSession(t, e) {
                    this.sessionStore && this.sessionStore.setItem(t, e)
                }
                connectWithFallback(t, e = 2500) {
                    clearTimeout(this.fallbackTimer);
                    let r = !1,
                        s = !0,
                        n, a = this.transportName(t),
                        i = o => {
                            this.log("transport", `falling back to ${a}...`, o), this.off([void 0, n]), s = !1, this.replaceTransport(t), this.transportConnect()
                        };
                    if (this.getSession(`phx:fallback:${a}`)) return i("memorized");
                    this.fallbackTimer = setTimeout(i, e), n = this.onError(o => {
                        this.log("transport", "error", o), s && !r && (clearTimeout(this.fallbackTimer), i(o))
                    }), this.fallbackRef && this.off([this.fallbackRef]), this.fallbackRef = this.onOpen(() => {
                        if (r = !0, !s) {
                            let o = this.transportName(t);
                            return this.primaryPassedHealthCheck || this.storeSession(`phx:fallback:${o}`, "true"), this.log("transport", `established ${o} fallback`)
                        }
                        clearTimeout(this.fallbackTimer), this.fallbackTimer = setTimeout(i, e), this.ping(o => {
                            this.log("transport", "connected to primary after", o), this.primaryPassedHealthCheck = !0, clearTimeout(this.fallbackTimer)
                        })
                    }), this.transportConnect()
                }
                clearHeartbeats() {
                    clearTimeout(this.heartbeatTimer), clearTimeout(this.heartbeatTimeoutTimer)
                }
                onConnOpen() {
                    this.hasLogger() && this.log("transport", `connected to ${this.endPointURL()}`), this.closeWasClean = !1, this.disconnecting = !1, this.establishedConnections++, this.flushSendBuffer(), this.reconnectTimer.reset(), this.autoSendHeartbeat && this.resetHeartbeat(), this.triggerStateCallbacks("open")
                }
                heartbeatTimeout() {
                    if (this.pendingHeartbeatRef) {
                        this.pendingHeartbeatRef = null, this.heartbeatSentAt = null, this.hasLogger() && this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
                        try {
                            this.heartbeatCallback("timeout")
                        } catch (t) {
                            this.log("error", "error in heartbeat callback", t)
                        }
                        this.triggerChanError(Error("heartbeat timeout")), this.closeWasClean = !1, this.teardown(() => this.reconnectTimer.scheduleTimeout(), Vr, "heartbeat timeout")
                    }
                }
                resetHeartbeat() {
                    this.conn && this.conn.skipHeartbeat || (this.pendingHeartbeatRef = null, this.clearHeartbeats(), this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs))
                }
                teardown(t, e, r) {
                    if (!this.conn) return t && t();
                    let s = this.conn;
                    this.waitForBufferDone(s, () => {
                        e ? s.close(e, r || "") : s.close(), this.waitForSocketClosed(s, () => {
                            this.conn === s && (this.conn.onopen = function() {}, this.conn.onerror = function() {}, this.conn.onmessage = function() {}, this.conn.onclose = function() {}, this.conn = null), t && t()
                        })
                    })
                }
                waitForBufferDone(t, e, r = 1) {
                    if (r === 5 || !t.bufferedAmount) {
                        e();
                        return
                    }
                    setTimeout(() => {
                        this.waitForBufferDone(t, e, r + 1)
                    }, 150 * r)
                }
                waitForSocketClosed(t, e, r = 1) {
                    if (r === 5 || t.readyState === ue.closed) {
                        e();
                        return
                    }
                    setTimeout(() => {
                        this.waitForSocketClosed(t, e, r + 1)
                    }, 150 * r)
                }
                onConnClose(t) {
                    this.conn && (this.conn.onclose = () => {}), this.hasLogger() && this.log("transport", "close", t), this.triggerChanError(t), this.clearHeartbeats(), this.closeWasClean || this.reconnectTimer.scheduleTimeout(), this.triggerStateCallbacks("close", t)
                }
                onConnError(t) {
                    this.hasLogger() && this.log("transport", "error", t);
                    let e = this.transport,
                        r = this.establishedConnections;
                    this.triggerStateCallbacks("error", t, e, r), (e === this.transport || r > 0) && this.triggerChanError(t)
                }
                triggerChanError(t) {
                    this.channels.forEach(e => {
                        e.isErrored() || e.isLeaving() || e.isClosed() || e.trigger(pe.error, t)
                    })
                }
                connectionState() {
                    switch (this.conn && this.conn.readyState) {
                        case ue.connecting:
                            return "connecting";
                        case ue.open:
                            return "open";
                        case ue.closing:
                            return "closing";
                        default:
                            return "closed"
                    }
                }
                isConnected() {
                    return this.connectionState() === "open"
                }
                remove(t) {
                    this.off(t.stateChangeRefs), this.channels = this.channels.filter(e => e !== t)
                }
                off(t) {
                    for (let e in this.stateChangeCallbacks) this.stateChangeCallbacks[e] = this.stateChangeCallbacks[e].filter(([r]) => t.indexOf(r) === -1)
                }
                channel(t, e = {}) {
                    let r = new Xr(t, e, this);
                    return this.channels.push(r), r
                }
                push(t) {
                    if (this.hasLogger()) {
                        let {
                            topic: e,
                            event: r,
                            payload: s,
                            ref: n,
                            join_ref: a
                        } = t;
                        this.log("push", `${e} ${r} (${a}, ${n})`, s)
                    }
                    this.isConnected() ? this.encode(t, e => this.conn.send(e)) : this.sendBuffer.push(() => this.encode(t, e => this.conn.send(e)))
                }
                makeRef() {
                    let t = this.ref + 1;
                    return t === this.ref ? this.ref = 0 : this.ref = t, this.ref.toString()
                }
                sendHeartbeat() {
                    if (!this.isConnected()) {
                        try {
                            this.heartbeatCallback("disconnected")
                        } catch (t) {
                            this.log("error", "error in heartbeat callback", t)
                        }
                        return
                    }
                    if (this.pendingHeartbeatRef) {
                        this.heartbeatTimeout();
                        return
                    }
                    this.pendingHeartbeatRef = this.makeRef(), this.heartbeatSentAt = Date.now(), this.push({
                        topic: "phoenix",
                        event: "heartbeat",
                        payload: {},
                        ref: this.pendingHeartbeatRef
                    });
                    try {
                        this.heartbeatCallback("sent")
                    } catch (t) {
                        this.log("error", "error in heartbeat callback", t)
                    }
                    this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs)
                }
                flushSendBuffer() {
                    this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach(t => t()), this.sendBuffer = [])
                }
                onConnMessage(t) {
                    this.decode(t.data, e => {
                        let {
                            topic: r,
                            event: s,
                            payload: n,
                            ref: a,
                            join_ref: i
                        } = e;
                        if (a && a === this.pendingHeartbeatRef) {
                            let o = this.heartbeatSentAt ? Date.now() - this.heartbeatSentAt : void 0;
                            this.clearHeartbeats();
                            try {
                                this.heartbeatCallback(n.status === "ok" ? "ok" : "error", o)
                            } catch (c) {
                                this.log("error", "error in heartbeat callback", c)
                            }
                            this.pendingHeartbeatRef = null, this.heartbeatSentAt = null, this.autoSendHeartbeat && (this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs))
                        }
                        this.hasLogger() && this.log("receive", `${n.status||""} ${r} ${s} ${a&&"("+a+")"||""}`.trim(), n);
                        for (let o = 0; o < this.channels.length; o++) {
                            let c = this.channels[o];
                            c.isMember(r, s, n, i) && c.trigger(s, n, a, i)
                        }
                        this.triggerStateCallbacks("message", e)
                    })
                }
                triggerStateCallbacks(t, ...e) {
                    try {
                        this.stateChangeCallbacks[t].forEach(([r, s]) => {
                            try {
                                s(...e)
                            } catch (n) {
                                this.log("error", `error in ${t} callback`, n)
                            }
                        })
                    } catch (r) {
                        this.log("error", `error triggering ${t} callbacks`, r)
                    }
                }
                leaveOpenTopic(t) {
                    let e = this.channels.find(r => r.topic === t && (r.isJoined() || r.isJoining()));
                    e && (this.hasLogger() && this.log("transport", `leaving duplicate topic "${t}"`), e.leave())
                }
            },
            ts = class mt {
                constructor(e, r) {
                    let s = ss(r);
                    this.presence = new Zr(e.getChannel(), s), this.presence.onJoin((n, a, i) => {
                        let o = mt.onJoinPayload(n, a, i);
                        e.getChannel().trigger("presence", o)
                    }), this.presence.onLeave((n, a, i) => {
                        let o = mt.onLeavePayload(n, a, i);
                        e.getChannel().trigger("presence", o)
                    }), this.presence.onSync(() => {
                        e.getChannel().trigger("presence", {
                            event: "sync"
                        })
                    })
                }
                get state() {
                    return mt.transformState(this.presence.state)
                }
                static transformState(e) {
                    return e = rs(e), Object.getOwnPropertyNames(e).reduce((r, s) => {
                        let n = e[s];
                        return r[s] = tt(n), r
                    }, {})
                }
                static onJoinPayload(e, r, s) {
                    return {
                        event: "join",
                        key: e,
                        currentPresences: Mt(r),
                        newPresences: tt(s)
                    }
                }
                static onLeavePayload(e, r, s) {
                    return {
                        event: "leave",
                        key: e,
                        currentPresences: Mt(r),
                        leftPresences: tt(s)
                    }
                }
            };

        function tt(t) {
            return t.metas.map(e => (e.presence_ref = e.phx_ref, delete e.phx_ref, delete e.phx_ref_prev, e))
        }

        function rs(t) {
            return JSON.parse(JSON.stringify(t))
        }

        function ss(t) {
            return (t == null ? void 0 : t.events) && {
                events: t.events
            }
        }

        function Mt(t) {
            return t != null && t.metas ? tt(t) : []
        }
        var qt;
        (function(t) {
            t.SYNC = "sync", t.JOIN = "join", t.LEAVE = "leave"
        })(qt || (qt = {}));
        var Ft = class {
            get state() {
                return this.presenceAdapter.state
            }
            constructor(t, e) {
                this.channel = t, this.presenceAdapter = new ts(this.channel.channelAdapter, e)
            }
        };

        function ns(t) {
            if (t instanceof Error) return t;
            if (typeof t == "string") return Error(t);
            if (t && typeof t == "object") {
                let e = t;
                if (typeof e.code == "number") {
                    let r = typeof e.reason == "string" && e.reason ? ` (${e.reason})` : "";
                    return Error(`socket closed: ${e.code}${r}`, {
                        cause: t
                    })
                }
                return Error("channel error: transport failure", {
                    cause: t
                })
            }
            return Error("channel error: connection lost")
        }
        var as = class {
            constructor(t, e, r) {
                let s = is(r);
                this.channel = t.getSocket().channel(e, s), this.socket = t
            }
            get state() {
                return this.channel.state
            }
            set state(t) {
                this.channel.state = t
            }
            get joinedOnce() {
                return this.channel.joinedOnce
            }
            get joinPush() {
                return this.channel.joinPush
            }
            get rejoinTimer() {
                return this.channel.rejoinTimer
            }
            on(t, e) {
                return this.channel.on(t, e)
            }
            off(t, e) {
                this.channel.off(t, e)
            }
            subscribe(t) {
                return this.channel.join(t)
            }
            unsubscribe(t) {
                return this.channel.leave(t)
            }
            teardown() {
                this.channel.teardown()
            }
            onClose(t) {
                this.channel.onClose(t)
            }
            onError(t) {
                return this.channel.onError(t)
            }
            push(t, e, r) {
                let s;
                try {
                    s = this.channel.push(t, e, r)
                } catch (n) {
                    throw Error(`tried to push '${t}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`)
                }
                if (this.channel.pushBuffer.length > 100) {
                    let n = this.channel.pushBuffer.shift();
                    n.cancelTimeout(), this.socket.log("channel", `discarded push due to buffer overflow: ${n.event}`, n.payload())
                }
                return s
            }
            updateJoinPayload(t) {
                let e = this.channel.joinPush.payload();
                this.channel.joinPush.payload = () => Object.assign(Object.assign({}, e), t)
            }
            canPush() {
                return this.socket.isConnected() && this.state === de.joined
            }
            isJoined() {
                return this.state === de.joined
            }
            isJoining() {
                return this.state === de.joining
            }
            isClosed() {
                return this.state === de.closed
            }
            isLeaving() {
                return this.state === de.leaving
            }
            updateFilterBindings(t) {
                this.channel.filterBindings = t
            }
            updatePayloadTransform(t) {
                this.channel.onMessage = t
            }
            getChannel() {
                return this.channel
            }
        };

        function is(t) {
            return {
                config: Object.assign({
                    broadcast: {
                        ack: !1,
                        self: !1
                    },
                    presence: {
                        key: "",
                        enabled: !1
                    },
                    private: !1
                }, t.config)
            }
        }
        var Ht;
        (function(t) {
            t.ALL = "*", t.INSERT = "INSERT", t.UPDATE = "UPDATE", t.DELETE = "DELETE"
        })(Ht || (Ht = {}));
        var Ce;
        (function(t) {
            t.BROADCAST = "broadcast", t.PRESENCE = "presence", t.POSTGRES_CHANGES = "postgres_changes", t.SYSTEM = "system"
        })(Ce || (Ce = {}));
        var fe;
        (function(t) {
            t.SUBSCRIBED = "SUBSCRIBED", t.TIMED_OUT = "TIMED_OUT", t.CLOSED = "CLOSED", t.CHANNEL_ERROR = "CHANNEL_ERROR"
        })(fe || (fe = {}));
        let os = de;
        var Wt = class yt {
                get state() {
                    return this.channelAdapter.state
                }
                set state(e) {
                    this.channelAdapter.state = e
                }
                get joinedOnce() {
                    return this.channelAdapter.joinedOnce
                }
                get timeout() {
                    return this.socket.timeout
                }
                get joinPush() {
                    return this.channelAdapter.joinPush
                }
                get rejoinTimer() {
                    return this.channelAdapter.rejoinTimer
                }
                constructor(e, r = {
                    config: {}
                }, s) {
                    var n, a;
                    if (this.topic = e, this.params = r, this.socket = s, this.bindings = {}, this.subTopic = e.replace(/^realtime:/i, ""), this.params.config = Object.assign({
                            broadcast: {
                                ack: !1,
                                self: !1
                            },
                            presence: {
                                key: "",
                                enabled: !1
                            },
                            private: !1
                        }, r.config), this.channelAdapter = new as(this.socket.socketAdapter, e, this.params), this.presence = new Ft(this), this._onClose(() => {
                            this.socket._remove(this)
                        }), this._updateFilterTransform(), this.broadcastEndpointURL = Ut(this.socket.socketAdapter.endPointURL()), this.private = this.params.config.private || !1, !this.private && ((a = (n = this.params.config) == null ? void 0 : n.broadcast) == null ? void 0 : a.replay)) throw Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`)
                }
                subscribe(e, r = this.timeout) {
                    var s, n, a;
                    if (this.socket.isConnected() || this.socket.connect(), this.channelAdapter.isClosed()) {
                        let {
                            config: {
                                broadcast: i,
                                presence: o,
                                private: c
                            }
                        } = this.params, u = (n = (s = this.bindings.postgres_changes) == null ? void 0 : s.map(y => y.filter)) != null ? n : [], p = !!this.bindings[Ce.PRESENCE] && this.bindings[Ce.PRESENCE].length > 0 || ((a = this.params.config.presence) == null ? void 0 : a.enabled) === !0, f = {}, m = {
                            broadcast: i,
                            presence: Object.assign(Object.assign({}, o), {
                                enabled: p
                            }),
                            postgres_changes: u,
                            private: c
                        };
                        this.socket.accessTokenValue && (f.access_token = this.socket.accessTokenValue), this._onError(y => {
                            e == null || e(fe.CHANNEL_ERROR, ns(y))
                        }), this._onClose(() => e == null ? void 0 : e(fe.CLOSED)), this.updateJoinPayload(Object.assign({
                            config: m
                        }, f)), this._updateFilterMessage(), this.channelAdapter.subscribe(r).receive("ok", async ({
                            postgres_changes: y
                        }) => {
                            if (this.socket._isManualToken() || this.socket.setAuth(), y === void 0) {
                                e == null || e(fe.SUBSCRIBED);
                                return
                            }
                            this._updatePostgresBindings(y, e)
                        }).receive("error", y => {
                            this.state = de.errored;
                            let S = Object.values(y).join(", ") || "error";
                            e == null || e(fe.CHANNEL_ERROR, Error(S, {
                                cause: y
                            }))
                        }).receive("timeout", () => {
                            e == null || e(fe.TIMED_OUT)
                        })
                    }
                    return this
                }
                _updatePostgresBindings(e, r) {
                    var i;
                    let s = this.bindings.postgres_changes,
                        n = (i = s == null ? void 0 : s.length) != null ? i : 0,
                        a = [];
                    for (let o = 0; o < n; o++) {
                        let c = s[o],
                            {
                                filter: {
                                    event: u,
                                    schema: p,
                                    table: f,
                                    filter: m
                                }
                            } = c,
                            y = e && e[o];
                        if (y && y.event === u && yt.isFilterValueEqual(y.schema, p) && yt.isFilterValueEqual(y.table, f) && yt.isFilterValueEqual(y.filter, m)) a.push(Object.assign(Object.assign({}, c), {
                            id: y.id
                        }));
                        else {
                            this.unsubscribe(), this.state = de.errored, r == null || r(fe.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
                            return
                        }
                    }
                    this.bindings.postgres_changes = a, this.state != de.errored && r && r(fe.SUBSCRIBED)
                }
                presenceState() {
                    return this.presence.state
                }
                async track(e, r = {}) {
                    return await this.send({
                        type: "presence",
                        event: "track",
                        payload: e
                    }, r.timeout || this.timeout)
                }
                async untrack(e = {}) {
                    return await this.send({
                        type: "presence",
                        event: "untrack"
                    }, e)
                }
                on(e, r, s) {
                    let n = this.channelAdapter.isJoined() || this.channelAdapter.isJoining(),
                        a = e === Ce.PRESENCE || e === Ce.POSTGRES_CHANGES;
                    if (n && a) throw this.socket.log("channel", `cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`), Error(`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`);
                    return this._on(e, r, s)
                }
                async httpSend(e, r, s = {}) {
                    var c;
                    if (r == null) return Promise.reject(Error("Payload is required for httpSend()"));
                    let n = {
                        apikey: this.socket.apiKey ? this.socket.apiKey : "",
                        "Content-Type": "application/json"
                    };
                    this.socket.accessTokenValue && (n.Authorization = `Bearer ${this.socket.accessTokenValue}`);
                    let a = {
                            method: "POST",
                            headers: n,
                            body: JSON.stringify({
                                messages: [{
                                    topic: this.subTopic,
                                    event: e,
                                    payload: r,
                                    private: this.private
                                }]
                            })
                        },
                        i = await this._fetchWithTimeout(this.broadcastEndpointURL, a, (c = s.timeout) != null ? c : this.timeout);
                    if (i.status === 202) return {
                        success: !0
                    };
                    let o = i.statusText;
                    try {
                        let u = await i.json();
                        o = u.error || u.message || o
                    } catch (u) {}
                    return Promise.reject(Error(o))
                }
                async send(e, r = {}) {
                    var s, n;
                    if (!this.channelAdapter.canPush() && e.type === "broadcast") {
                        console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
                        let {
                            event: a,
                            payload: i
                        } = e, o = {
                            apikey: this.socket.apiKey ? this.socket.apiKey : "",
                            "Content-Type": "application/json"
                        };
                        this.socket.accessTokenValue && (o.Authorization = `Bearer ${this.socket.accessTokenValue}`);
                        let c = {
                            method: "POST",
                            headers: o,
                            body: JSON.stringify({
                                messages: [{
                                    topic: this.subTopic,
                                    event: a,
                                    payload: i,
                                    private: this.private
                                }]
                            })
                        };
                        try {
                            let u = await this._fetchWithTimeout(this.broadcastEndpointURL, c, (s = r.timeout) != null ? s : this.timeout);
                            return await ((n = u.body) == null ? void 0 : n.cancel()), u.ok ? "ok" : "error"
                        } catch (u) {
                            return u instanceof Error && u.name === "AbortError" ? "timed out" : "error"
                        }
                    } else return new Promise(a => {
                        var o, c, u;
                        let i = this.channelAdapter.push(e.type, e, r.timeout || this.timeout);
                        e.type === "broadcast" && !((u = (c = (o = this.params) == null ? void 0 : o.config) == null ? void 0 : c.broadcast) != null && u.ack) && a("ok"), i.receive("ok", () => a("ok")), i.receive("error", () => a("error")), i.receive("timeout", () => a("timed out"))
                    })
                }
                updateJoinPayload(e) {
                    this.channelAdapter.updateJoinPayload(e)
                }
                async unsubscribe(e = this.timeout) {
                    return new Promise(r => {
                        this.channelAdapter.unsubscribe(e).receive("ok", () => r("ok")).receive("timeout", () => r("timed out")).receive("error", () => r("error"))
                    })
                }
                teardown() {
                    this.channelAdapter.teardown()
                }
                async _fetchWithTimeout(e, r, s) {
                    let n = new AbortController,
                        a = setTimeout(() => n.abort(), s),
                        i = await this.socket.fetch(e, Object.assign(Object.assign({}, r), {
                            signal: n.signal
                        }));
                    return clearTimeout(a), i
                }
                _on(e, r, s) {
                    let n = e.toLocaleLowerCase(),
                        a = {
                            type: n,
                            filter: r,
                            callback: s,
                            ref: this.channelAdapter.on(e, s)
                        };
                    return this.bindings[n] ? this.bindings[n].push(a) : this.bindings[n] = [a], this._updateFilterMessage(), this
                }
                _onClose(e) {
                    this.channelAdapter.onClose(e)
                }
                _onError(e) {
                    this.channelAdapter.onError(e)
                }
                _updateFilterMessage() {
                    this.channelAdapter.updateFilterBindings((e, r, s) => {
                        var i, o, c, u, p, f, m;
                        let n = e.event.toLocaleLowerCase();
                        if (this._notThisChannelEvent(n, s)) return !1;
                        let a = (i = this.bindings[n]) == null ? void 0 : i.find(y => y.ref === e.ref);
                        if (!a) return !0;
                        if (["broadcast", "presence", "postgres_changes"].includes(n))
                            if ("id" in a) {
                                let y = a.id,
                                    S = (o = a.filter) == null ? void 0 : o.event;
                                return y && ((c = r.ids) == null ? void 0 : c.includes(y)) && (S === "*" || (S == null ? void 0 : S.toLocaleLowerCase()) === ((u = r.data) == null ? void 0 : u.type.toLocaleLowerCase()))
                            } else {
                                let y = (f = (p = a == null ? void 0 : a.filter) == null ? void 0 : p.event) == null ? void 0 : f.toLocaleLowerCase();
                                return y === "*" || y === ((m = r == null ? void 0 : r.event) == null ? void 0 : m.toLocaleLowerCase())
                            }
                        else return a.type.toLocaleLowerCase() === n
                    })
                }
                _notThisChannelEvent(e, r) {
                    let {
                        close: s,
                        error: n,
                        leave: a,
                        join: i
                    } = Lt;
                    return r && [s, n, a, i].includes(e) && r !== this.joinPush.ref
                }
                _updateFilterTransform() {
                    this.channelAdapter.updatePayloadTransform((e, r, s) => {
                        if (typeof r == "object" && "ids" in r) {
                            let n = r.data,
                                {
                                    schema: a,
                                    table: i,
                                    commit_timestamp: o,
                                    type: c,
                                    errors: u
                                } = n;
                            return Object.assign(Object.assign({}, {
                                schema: a,
                                table: i,
                                commit_timestamp: o,
                                eventType: c,
                                new: {},
                                old: {},
                                errors: u
                            }), this._getPayloadRecords(n))
                        }
                        return r
                    })
                }
                copyBindings(e) {
                    if (this.joinedOnce) throw Error("cannot copy bindings into joined channel");
                    for (let r in e.bindings)
                        for (let s of e.bindings[r]) this._on(s.type, s.filter, s.callback)
                }
                static isFilterValueEqual(e, r) {
                    return (e != null ? e : void 0) === (r != null ? r : void 0)
                }
                _getPayloadRecords(e) {
                    let r = {
                        new: {},
                        old: {}
                    };
                    return (e.type === "INSERT" || e.type === "UPDATE") && (r.new = Nt(e.columns, e.record)), (e.type === "UPDATE" || e.type === "DELETE") && (r.old = Nt(e.columns, e.old_record)), r
                }
            },
            ls = class {
                constructor(t, e) {
                    this.socket = new es(t, e)
                }
                get timeout() {
                    return this.socket.timeout
                }
                get endPoint() {
                    return this.socket.endPoint
                }
                get transport() {
                    return this.socket.transport
                }
                get heartbeatIntervalMs() {
                    return this.socket.heartbeatIntervalMs
                }
                get heartbeatCallback() {
                    return this.socket.heartbeatCallback
                }
                set heartbeatCallback(t) {
                    this.socket.heartbeatCallback = t
                }
                get heartbeatTimer() {
                    return this.socket.heartbeatTimer
                }
                get pendingHeartbeatRef() {
                    return this.socket.pendingHeartbeatRef
                }
                get reconnectTimer() {
                    return this.socket.reconnectTimer
                }
                get vsn() {
                    return this.socket.vsn
                }
                get encode() {
                    return this.socket.encode
                }
                get decode() {
                    return this.socket.decode
                }
                get reconnectAfterMs() {
                    return this.socket.reconnectAfterMs
                }
                get sendBuffer() {
                    return this.socket.sendBuffer
                }
                get stateChangeCallbacks() {
                    return this.socket.stateChangeCallbacks
                }
                connect() {
                    this.socket.connect()
                }
                disconnect(t, e, r, s = 1e4) {
                    return new Promise(n => {
                        setTimeout(() => n("timeout"), s), this.socket.disconnect(() => {
                            t(), n("ok")
                        }, e, r)
                    })
                }
                push(t) {
                    this.socket.push(t)
                }
                log(t, e, r) {
                    this.socket.log(t, e, r)
                }
                makeRef() {
                    return this.socket.makeRef()
                }
                onOpen(t) {
                    this.socket.onOpen(t)
                }
                onClose(t) {
                    this.socket.onClose(t)
                }
                onError(t) {
                    this.socket.onError(t)
                }
                onMessage(t) {
                    this.socket.onMessage(t)
                }
                isConnected() {
                    return this.socket.isConnected()
                }
                isConnecting() {
                    return this.socket.connectionState() == bt.connecting
                }
                isDisconnecting() {
                    return this.socket.connectionState() == bt.closing
                }
                connectionState() {
                    return this.socket.connectionState()
                }
                endPointURL() {
                    return this.socket.endPointURL()
                }
                sendHeartbeat() {
                    this.socket.sendHeartbeat()
                }
                getSocket() {
                    return this.socket
                }
            };
        let Kt = {
                HEARTBEAT_INTERVAL: 25e3,
                RECONNECT_DELAY: 10,
                HEARTBEAT_TIMEOUT_FALLBACK: 100
            },
            cs = [1e3, 2e3, 5e3, 1e4];

        function us() {
            let t = new Map;
            return {
                get length() {
                    return t.size
                },
                clear() {
                    t.clear()
                },
                getItem(e) {
                    return t.has(e) ? t.get(e) : null
                },
                key(e) {
                    var r;
                    return (r = Array.from(t.keys())[e]) != null ? r : null
                },
                removeItem(e) {
                    t.delete(e)
                },
                setItem(e, r) {
                    t.set(e, String(r))
                }
            }
        }

        function hs() {
            try {
                if (typeof globalThis < "u" && globalThis.sessionStorage) return globalThis.sessionStorage
            } catch (t) {}
            return us()
        }
        var zt = class {
                get endPoint() {
                    return this.socketAdapter.endPoint
                }
                get timeout() {
                    return this.socketAdapter.timeout
                }
                get transport() {
                    return this.socketAdapter.transport
                }
                get heartbeatCallback() {
                    return this.socketAdapter.heartbeatCallback
                }
                get heartbeatIntervalMs() {
                    return this.socketAdapter.heartbeatIntervalMs
                }
                get heartbeatTimer() {
                    return this.worker ? this._workerHeartbeatTimer : this.socketAdapter.heartbeatTimer
                }
                get pendingHeartbeatRef() {
                    return this.worker ? this._pendingWorkerHeartbeatRef : this.socketAdapter.pendingHeartbeatRef
                }
                get reconnectTimer() {
                    return this.socketAdapter.reconnectTimer
                }
                get vsn() {
                    return this.socketAdapter.vsn
                }
                get encode() {
                    return this.socketAdapter.encode
                }
                get decode() {
                    return this.socketAdapter.decode
                }
                get reconnectAfterMs() {
                    return this.socketAdapter.reconnectAfterMs
                }
                get sendBuffer() {
                    return this.socketAdapter.sendBuffer
                }
                get stateChangeCallbacks() {
                    return this.socketAdapter.stateChangeCallbacks
                }
                constructor(t, e) {
                    var r;
                    if (this.channels = [], this.accessTokenValue = null, this.accessToken = null, this.apiKey = null, this.httpEndpoint = "", this.headers = {}, this.params = {}, this.ref = 0, this.serializer = new Dr, this._manuallySetToken = !1, this._authPromise = null, this._workerHeartbeatTimer = void 0, this._pendingWorkerHeartbeatRef = null, this._pendingDisconnectTimer = null, this._disconnectOnEmptyChannelsAfterMs = 0, this._resolveFetch = s => s ? (...n) => s(...n) : (...n) => fetch(...n), !((r = e == null ? void 0 : e.params) != null && r.apikey)) throw Error("API key is required to connect to Realtime");
                    this.apiKey = e.params.apikey, this.socketAdapter = new ls(t, this._initializeOptions(e)), this.httpEndpoint = Ut(t), this.fetch = this._resolveFetch(e == null ? void 0 : e.fetch)
                }
                connect() {
                    if (!(this.isConnecting() || this.isDisconnecting() || this.isConnected())) {
                        this.accessToken && !this._authPromise && this._setAuthSafely("connect"), this._setupConnectionHandlers();
                        try {
                            this.socketAdapter.connect()
                        } catch (t) {
                            let e = t.message;
                            throw e.includes("Node.js") ? Error(`${e}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`) : Error(`WebSocket not available: ${e}`)
                        }
                        this._handleNodeJsRaceCondition()
                    }
                }
                endpointURL() {
                    return this.socketAdapter.endPointURL()
                }
                async disconnect(t, e) {
                    return this._cancelPendingDisconnect(), this.isDisconnecting() ? "ok" : await this.socketAdapter.disconnect(() => {
                        clearInterval(this._workerHeartbeatTimer), this._terminateWorker()
                    }, t, e)
                }
                getChannels() {
                    return this.channels
                }
                async removeChannel(t) {
                    let e = await t.unsubscribe();
                    return e === "ok" && t.teardown(), e
                }
                async removeAllChannels() {
                    let t = this.channels.map(async r => {
                            let s = await r.unsubscribe();
                            return r.teardown(), s
                        }),
                        e = await Promise.all(t);
                    return await this.disconnect(), e
                }
                log(t, e, r) {
                    this.socketAdapter.log(t, e, r)
                }
                connectionState() {
                    return this.socketAdapter.connectionState() || bt.closed
                }
                isConnected() {
                    return this.socketAdapter.isConnected()
                }
                isConnecting() {
                    return this.socketAdapter.isConnecting()
                }
                isDisconnecting() {
                    return this.socketAdapter.isDisconnecting()
                }
                channel(t, e = {
                    config: {}
                }) {
                    let r = `realtime:${t}`,
                        s = this.getChannels().find(n => n.topic === r);
                    if (s) return s;
                    {
                        let n = new Wt(`realtime:${t}`, e, this);
                        return this._cancelPendingDisconnect(), this.channels.push(n), n
                    }
                }
                push(t) {
                    this.socketAdapter.push(t)
                }
                async setAuth(t = null) {
                    this._authPromise = this._performAuth(t);
                    try {
                        await this._authPromise
                    } finally {
                        this._authPromise = null
                    }
                }
                _isManualToken() {
                    return this._manuallySetToken
                }
                async sendHeartbeat() {
                    this.socketAdapter.sendHeartbeat()
                }
                onHeartbeat(t) {
                    this.socketAdapter.heartbeatCallback = this._wrapHeartbeatCallback(t)
                }
                _makeRef() {
                    return this.socketAdapter.makeRef()
                }
                _remove(t) {
                    this.channels = this.channels.filter(e => e.topic !== t.topic), this.channels.length === 0 && (this.log("transport", "no channels remaining, scheduling disconnect"), this._schedulePendingDisconnect())
                }
                _schedulePendingDisconnect() {
                    if (this._cancelPendingDisconnect(), this._disconnectOnEmptyChannelsAfterMs === 0) {
                        this.log("transport", "disconnecting immediately - no channels"), this.disconnect();
                        return
                    }
                    this._pendingDisconnectTimer = setTimeout(() => {
                        this._pendingDisconnectTimer = null, this.channels.length === 0 && (this.log("transport", "deferred disconnect fired - no channels, disconnecting"), this.disconnect())
                    }, this._disconnectOnEmptyChannelsAfterMs), this.log("transport", `deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`)
                }
                _cancelPendingDisconnect() {
                    this._pendingDisconnectTimer !== null && (this.log("transport", "pending disconnect cancelled - channel activity detected"), clearTimeout(this._pendingDisconnectTimer), this._pendingDisconnectTimer = null)
                }
                async _performAuth(t = null) {
                    let e, r = !1;
                    if (t) e = t, r = !0;
                    else if (this.accessToken) try {
                        e = await this.accessToken()
                    } catch (s) {
                        this.log("error", "Error fetching access token from callback", s), e = this.accessTokenValue
                    } else e = this.accessTokenValue;
                    r ? this._manuallySetToken = !0 : this.accessToken && (this._manuallySetToken = !1), this.accessTokenValue != e && (this.accessTokenValue = e, this.channels.forEach(s => {
                        let n = {
                            access_token: e,
                            version: "realtime-js/2.106.0"
                        };
                        e && s.updateJoinPayload(n), s.joinedOnce && s.channelAdapter.isJoined() && s.channelAdapter.push(Lt.access_token, {
                            access_token: e
                        })
                    }))
                }
                async _waitForAuthIfNeeded() {
                    this._authPromise && await this._authPromise
                }
                _setAuthSafely(t = "general") {
                    this._isManualToken() || this.setAuth().catch(e => {
                        this.log("error", `Error setting auth in ${t}`, e)
                    })
                }
                _setupConnectionHandlers() {
                    this.socketAdapter.onOpen(() => {
                        (this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())).catch(t => {
                            this.log("error", "error waiting for auth on connect", t)
                        }), this.worker && !this.workerRef && this._startWorkerHeartbeat()
                    }), this.socketAdapter.onClose(() => {
                        this.worker && this.workerRef && this._terminateWorker()
                    }), this.socketAdapter.onMessage(t => {
                        t.ref && t.ref === this._pendingWorkerHeartbeatRef && (this._pendingWorkerHeartbeatRef = null)
                    })
                }
                _handleNodeJsRaceCondition() {
                    this.socketAdapter.isConnected() && this.socketAdapter.getSocket().onConnOpen()
                }
                _wrapHeartbeatCallback(t) {
                    return (e, r) => {
                        e == "sent" && this._setAuthSafely(), t && t(e, r)
                    }
                }
                _startWorkerHeartbeat() {
                    this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
                    let t = this._workerObjectUrl(this.workerUrl);
                    this.workerRef = new Worker(t), this.workerRef.onerror = e => {
                        this.log("worker", "worker error", e.message), this._terminateWorker(), this.disconnect()
                    }, this.workerRef.onmessage = e => {
                        e.data.event === "keepAlive" && this.sendHeartbeat()
                    }, this.workerRef.postMessage({
                        event: "start",
                        interval: this.heartbeatIntervalMs
                    })
                }
                _terminateWorker() {
                    this.workerRef && (this.workerRef = (this.log("worker", "terminating worker"), this.workerRef.terminate(), void 0))
                }
                _workerObjectUrl(t) {
                    let e;
                    if (t) e = t;
                    else {
                        let r = new Blob([`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`], {
                            type: "application/javascript"
                        });
                        e = URL.createObjectURL(r)
                    }
                    return e
                }
                _initializeOptions(t) {
                    var a, i, o, c, u, p, f, m, y, S, R, T;
                    this.worker = (a = t == null ? void 0 : t.worker) != null ? a : !1, this.accessToken = (i = t == null ? void 0 : t.accessToken) != null ? i : null;
                    let e = {};
                    e.timeout = (o = t == null ? void 0 : t.timeout) != null ? o : 1e4, e.heartbeatIntervalMs = (c = t == null ? void 0 : t.heartbeatIntervalMs) != null ? c : Kt.HEARTBEAT_INTERVAL, this._disconnectOnEmptyChannelsAfterMs = (p = t == null ? void 0 : t.disconnectOnEmptyChannelsAfterMs) != null ? p : 2 * ((u = t == null ? void 0 : t.heartbeatIntervalMs) != null ? u : Kt.HEARTBEAT_INTERVAL), e.transport = (f = t == null ? void 0 : t.transport) != null ? f : Xe.getWebSocketConstructor(), e.params = t == null ? void 0 : t.params, e.logger = t == null ? void 0 : t.logger, e.heartbeatCallback = this._wrapHeartbeatCallback(t == null ? void 0 : t.heartbeatCallback), e.sessionStorage = (m = t == null ? void 0 : t.sessionStorage) != null ? m : hs(), e.reconnectAfterMs = (y = t == null ? void 0 : t.reconnectAfterMs) != null ? y : M => cs[M - 1] || 1e4;
                    let r, s, n = (S = t == null ? void 0 : t.vsn) != null ? S : "2.0.0";
                    switch (n) {
                        case "1.0.0":
                            r = (M, C) => C(JSON.stringify(M)), s = (M, C) => C(JSON.parse(M));
                            break;
                        case "2.0.0":
                            r = this.serializer.encode.bind(this.serializer), s = this.serializer.decode.bind(this.serializer);
                            break;
                        default:
                            throw Error(`Unsupported serializer version: ${e.vsn}`)
                    }
                    if (e.vsn = n, e.encode = (R = t == null ? void 0 : t.encode) != null ? R : r, e.decode = (T = t == null ? void 0 : t.decode) != null ? T : s, e.beforeReconnect = this._reconnectAuth.bind(this), (t != null && t.logLevel || t != null && t.log_level) && (this.logLevel = t.logLevel || t.log_level, e.params = Object.assign(Object.assign({}, e.params), {
                            log_level: this.logLevel
                        })), this.worker) {
                        if (typeof window < "u" && !window.Worker) throw Error("Web Worker is not supported");
                        this.workerUrl = t == null ? void 0 : t.workerUrl, e.autoSendHeartbeat = !this.worker
                    }
                    return e
                }
                async _reconnectAuth() {
                    await this._waitForAuthIfNeeded(), this.isConnected() || this.connect()
                }
            },
            Me = class extends Error {
                constructor(t, e) {
                    var r;
                    super(t), this.name = "IcebergError", this.status = e.status, this.icebergType = e.icebergType, this.icebergCode = e.icebergCode, this.details = e.details, this.isCommitStateUnknown = e.icebergType === "CommitStateUnknownException" || [500, 502, 504].includes(e.status) && ((r = e.icebergType) == null ? void 0 : r.includes("CommitState")) === !0
                }
                isNotFound() {
                    return this.status === 404
                }
                isConflict() {
                    return this.status === 409
                }
                isAuthenticationTimeout() {
                    return this.status === 419
                }
            };

        function ds(t, e, r) {
            let s = new URL(e, t);
            if (r)
                for (let [n, a] of Object.entries(r)) a !== void 0 && s.searchParams.set(n, a);
            return s.toString()
        }
        async function ps(t) {
            return !t || t.type === "none" ? {} : t.type === "bearer" ? {
                Authorization: `Bearer ${t.token}`
            } : t.type === "header" ? {
                [t.name]: t.value
            } : t.type === "custom" ? await t.getHeaders() : {}
        }

        function fs(t) {
            var r;
            let e = (r = t.fetchImpl) != null ? r : globalThis.fetch;
            return {
                async request({
                    method: s,
                    path: n,
                    query: a,
                    body: i,
                    headers: o
                }) {
                    var S;
                    let c = ds(t.baseUrl, n, a),
                        u = await ps(t.auth),
                        p = await e(c, {
                            method: s,
                            headers: z(z(z({}, i ? {
                                "Content-Type": "application/json"
                            } : {}), u), o),
                            body: i ? JSON.stringify(i) : void 0
                        }),
                        f = await p.text(),
                        m = (p.headers.get("content-type") || "").includes("application/json"),
                        y = m && f ? JSON.parse(f) : f;
                    if (!p.ok) {
                        let R = m ? y : void 0,
                            T = R == null ? void 0 : R.error;
                        throw new Me((S = T == null ? void 0 : T.message) != null ? S : `Request failed with status ${p.status}`, {
                            status: p.status,
                            icebergType: T == null ? void 0 : T.type,
                            icebergCode: T == null ? void 0 : T.code,
                            details: R
                        })
                    }
                    return {
                        status: p.status,
                        headers: p.headers,
                        data: y
                    }
                }
            }
        }

        function rt(t) {
            return t.join("")
        }
        var gs = class {
            constructor(t, e = "") {
                this.client = t, this.prefix = e
            }
            async listNamespaces(t) {
                let e = t ? {
                    parent: rt(t.namespace)
                } : void 0;
                return (await this.client.request({
                    method: "GET",
                    path: `${this.prefix}/namespaces`,
                    query: e
                })).data.namespaces.map(r => ({
                    namespace: r
                }))
            }
            async createNamespace(t, e) {
                let r = {
                    namespace: t.namespace,
                    properties: e == null ? void 0 : e.properties
                };
                return (await this.client.request({
                    method: "POST",
                    path: `${this.prefix}/namespaces`,
                    body: r
                })).data
            }
            async dropNamespace(t) {
                await this.client.request({
                    method: "DELETE",
                    path: `${this.prefix}/namespaces/${rt(t.namespace)}`
                })
            }
            async loadNamespaceMetadata(t) {
                return {
                    properties: (await this.client.request({
                        method: "GET",
                        path: `${this.prefix}/namespaces/${rt(t.namespace)}`
                    })).data.properties
                }
            }
            async namespaceExists(t) {
                try {
                    return await this.client.request({
                        method: "HEAD",
                        path: `${this.prefix}/namespaces/${rt(t.namespace)}`
                    }), !0
                } catch (e) {
                    if (e instanceof Me && e.status === 404) return !1;
                    throw e
                }
            }
            async createNamespaceIfNotExists(t, e) {
                try {
                    return await this.createNamespace(t, e)
                } catch (r) {
                    if (r instanceof Me && r.status === 409) return;
                    throw r
                }
            }
        };

        function xe(t) {
            return t.join("")
        }
        var ms = class {
                constructor(t, e = "", r) {
                    this.client = t, this.prefix = e, this.accessDelegation = r
                }
                async listTables(t) {
                    return (await this.client.request({
                        method: "GET",
                        path: `${this.prefix}/namespaces/${xe(t.namespace)}/tables`
                    })).data.identifiers
                }
                async createTable(t, e) {
                    let r = {};
                    return this.accessDelegation && (r["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({
                        method: "POST",
                        path: `${this.prefix}/namespaces/${xe(t.namespace)}/tables`,
                        body: e,
                        headers: r
                    })).data.metadata
                }
                async updateTable(t, e) {
                    let r = await this.client.request({
                        method: "POST",
                        path: `${this.prefix}/namespaces/${xe(t.namespace)}/tables/${t.name}`,
                        body: e
                    });
                    return {
                        "metadata-location": r.data["metadata-location"],
                        metadata: r.data.metadata
                    }
                }
                async dropTable(t, e) {
                    var r;
                    await this.client.request({
                        method: "DELETE",
                        path: `${this.prefix}/namespaces/${xe(t.namespace)}/tables/${t.name}`,
                        query: {
                            purgeRequested: String((r = e == null ? void 0 : e.purge) != null ? r : !1)
                        }
                    })
                }
                async loadTable(t) {
                    let e = {};
                    return this.accessDelegation && (e["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({
                        method: "GET",
                        path: `${this.prefix}/namespaces/${xe(t.namespace)}/tables/${t.name}`,
                        headers: e
                    })).data.metadata
                }
                async tableExists(t) {
                    let e = {};
                    this.accessDelegation && (e["X-Iceberg-Access-Delegation"] = this.accessDelegation);
                    try {
                        return await this.client.request({
                            method: "HEAD",
                            path: `${this.prefix}/namespaces/${xe(t.namespace)}/tables/${t.name}`,
                            headers: e
                        }), !0
                    } catch (r) {
                        if (r instanceof Me && r.status === 404) return !1;
                        throw r
                    }
                }
                async createTableIfNotExists(t, e) {
                    try {
                        return await this.createTable(t, e)
                    } catch (r) {
                        if (r instanceof Me && r.status === 409) return await this.loadTable({
                            namespace: t.namespace,
                            name: e.name
                        });
                        throw r
                    }
                }
            },
            ys = class {
                constructor(t) {
                    var r;
                    let e = "v1";
                    t.catalogName && (e += `/${t.catalogName}`), this.client = fs({
                        baseUrl: t.baseUrl.endsWith("/") ? t.baseUrl : `${t.baseUrl}/`,
                        auth: t.auth,
                        fetchImpl: t.fetch
                    }), this.accessDelegation = (r = t.accessDelegation) == null ? void 0 : r.join(","), this.namespaceOps = new gs(this.client, e), this.tableOps = new ms(this.client, e, this.accessDelegation)
                }
                async listNamespaces(t) {
                    return this.namespaceOps.listNamespaces(t)
                }
                async createNamespace(t, e) {
                    return this.namespaceOps.createNamespace(t, e)
                }
                async dropNamespace(t) {
                    await this.namespaceOps.dropNamespace(t)
                }
                async loadNamespaceMetadata(t) {
                    return this.namespaceOps.loadNamespaceMetadata(t)
                }
                async listTables(t) {
                    return this.tableOps.listTables(t)
                }
                async createTable(t, e) {
                    return this.tableOps.createTable(t, e)
                }
                async updateTable(t, e) {
                    return this.tableOps.updateTable(t, e)
                }
                async dropTable(t, e) {
                    await this.tableOps.dropTable(t, e)
                }
                async loadTable(t) {
                    return this.tableOps.loadTable(t)
                }
                async namespaceExists(t) {
                    return this.namespaceOps.namespaceExists(t)
                }
                async tableExists(t) {
                    return this.tableOps.tableExists(t)
                }
                async createNamespaceIfNotExists(t, e) {
                    return this.namespaceOps.createNamespaceIfNotExists(t, e)
                }
                async createTableIfNotExists(t, e) {
                    return this.tableOps.createTableIfNotExists(t, e)
                }
            };

        function qe(t) {
            "@babel/helpers - typeof";
            return qe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
                return typeof e
            } : function(e) {
                return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }, qe(t)
        }

        function bs(t, e) {
            if (qe(t) != "object" || !t) return t;
            var r = t[Symbol.toPrimitive];
            if (r !== void 0) {
                var s = r.call(t, e || "default");
                if (qe(s) != "object") return s;
                throw TypeError("@@toPrimitive must return a primitive value.")
            }
            return (e === "string" ? String : Number)(t)
        }

        function ws(t) {
            var e = bs(t, "string");
            return qe(e) == "symbol" ? e : e + ""
        }

        function vs(t, e, r) {
            return (e = ws(e)) in t ? Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[e] = r, t
        }

        function Jt(t, e) {
            var r = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
                var s = Object.getOwnPropertySymbols(t);
                e && (s = s.filter(function(n) {
                    return Object.getOwnPropertyDescriptor(t, n).enumerable
                })), r.push.apply(r, s)
            }
            return r
        }

        function P(t) {
            for (var e = 1; e < arguments.length; e++) {
                var r = arguments[e] == null ? {} : arguments[e];
                e % 2 ? Jt(Object(r), !0).forEach(function(s) {
                    vs(t, s, r[s])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : Jt(Object(r)).forEach(function(s) {
                    Object.defineProperty(t, s, Object.getOwnPropertyDescriptor(r, s))
                })
            }
            return t
        }
        var st = class extends Error {
            constructor(t, e = "storage", r, s) {
                super(t), this.__isStorageError = !0, this.namespace = e, this.name = e === "vectors" ? "StorageVectorsError" : "StorageError", this.status = r, this.statusCode = s
            }
            toJSON() {
                return {
                    name: this.name,
                    message: this.message,
                    status: this.status,
                    statusCode: this.statusCode
                }
            }
        };

        function nt(t) {
            return typeof t == "object" && !!t && "__isStorageError" in t
        }
        var at = class extends st {
                constructor(t, e, r, s = "storage") {
                    super(t, s, e, r), this.name = s === "vectors" ? "StorageVectorsApiError" : "StorageApiError", this.status = e, this.statusCode = r
                }
                toJSON() {
                    return P({}, super.toJSON())
                }
            },
            Gt = class extends st {
                constructor(t, e, r = "storage") {
                    super(t, r), this.name = r === "vectors" ? "StorageVectorsUnknownError" : "StorageUnknownError", this.originalError = e
                }
            };

        function it(t, e, r) {
            let s = P({}, t),
                n = e.toLowerCase();
            for (let a of Object.keys(s)) a.toLowerCase() === n && delete s[a];
            return s[n] = r, s
        }

        function _s(t) {
            let e = {};
            for (let [r, s] of Object.entries(t)) e[r.toLowerCase()] = s;
            return e
        }
        let ks = t => t ? (...e) => t(...e) : (...e) => fetch(...e),
            Es = t => {
                if (typeof t != "object" || !t) return !1;
                let e = Object.getPrototypeOf(t);
                return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in t) && !(Symbol.iterator in t)
            },
            kt = t => {
                if (Array.isArray(t)) return t.map(r => kt(r));
                if (typeof t == "function" || t !== Object(t)) return t;
                let e = {};
                return Object.entries(t).forEach(([r, s]) => {
                    let n = r.replace(/([-_][a-z])/gi, a => a.toUpperCase().replace(/[-_]/g, ""));
                    e[n] = kt(s)
                }), e
            },
            Ss = t => !t || typeof t != "string" || t.length === 0 || t.length > 100 || t.trim() !== t || t.includes("/") || t.includes("\\") ? !1 : /^[\w!.\*'() &$@=;:+,?-]+$/.test(t),
            Vt = t => {
                if (typeof t == "object" && t) {
                    let e = t;
                    if (typeof e.msg == "string") return e.msg;
                    if (typeof e.message == "string") return e.message;
                    if (typeof e.error_description == "string") return e.error_description;
                    if (typeof e.error == "string") return e.error;
                    if (typeof e.error == "object" && e.error !== null) {
                        let r = e.error;
                        if (typeof r.message == "string") return r.message
                    }
                }
                return JSON.stringify(t)
            },
            Ts = async (t, e, r, s) => {
                if (typeof t == "object" && t && "json" in t && typeof t.json == "function") {
                    let n = t,
                        a = parseInt(String(n.status), 10);
                    Number.isFinite(a) || (a = 500), n.json().then(i => {
                        let o = (i == null ? void 0 : i.statusCode) || (i == null ? void 0 : i.code) || a + "";
                        e(new at(Vt(i), a, o, s))
                    }).catch(() => {
                        let i = a + "";
                        e(new at(n.statusText || `HTTP ${a} error`, a, i, s))
                    })
                } else e(new Gt(Vt(t), t, s))
            }, Rs = (t, e, r, s) => {
                let n = {
                    method: t,
                    headers: (e == null ? void 0 : e.headers) || {}
                };
                if (t === "GET" || t === "HEAD" || !s) return P(P({}, n), r);
                if (Es(s)) {
                    let a = (e == null ? void 0 : e.headers) || {},
                        i;
                    for (let [o, c] of Object.entries(a)) o.toLowerCase() === "content-type" && (i = c);
                    n.headers = it(a, "Content-Type", i != null ? i : "application/json"), n.body = JSON.stringify(s)
                } else n.body = s;
                return e != null && e.duplex && (n.duplex = e.duplex), P(P({}, n), r)
            };
        async function Fe(t, e, r, s, n, a, i) {
            return new Promise((o, c) => {
                t(r, Rs(e, s, n, a)).then(u => {
                    if (!u.ok) throw u;
                    if (s != null && s.noResolveJson) return u;
                    if (i === "vectors") {
                        let p = u.headers.get("content-type");
                        if (u.headers.get("content-length") === "0" || u.status === 204 || !p || !p.includes("application/json")) return {}
                    }
                    return u.json()
                }).then(u => o(u)).catch(u => Ts(u, c, s, i))
            })
        }

        function Yt(t = "storage") {
            return {
                get: async (e, r, s, n) => Fe(e, "GET", r, s, n, void 0, t),
                post: async (e, r, s, n, a) => Fe(e, "POST", r, n, a, s, t),
                put: async (e, r, s, n, a) => Fe(e, "PUT", r, n, a, s, t),
                head: async (e, r, s, n) => Fe(e, "HEAD", r, P(P({}, s), {}, {
                    noResolveJson: !0
                }), n, void 0, t),
                remove: async (e, r, s, n, a) => Fe(e, "DELETE", r, n, a, s, t)
            }
        }
        let {
            get: He,
            post: ne,
            put: Et,
            head: As,
            remove: St
        } = Yt("storage"), ee = Yt("vectors");
        var Oe = class {
            constructor(t, e = {}, r, s = "storage") {
                this.shouldThrowOnError = !1, this.url = t, this.headers = _s(e), this.fetch = ks(r), this.namespace = s
            }
            throwOnError() {
                return this.shouldThrowOnError = !0, this
            }
            setHeader(t, e) {
                return this.headers = it(this.headers, t, e), this
            }
            async handleOperation(t) {
                var e = this;
                try {
                    return {
                        data: await t(),
                        error: null
                    }
                } catch (r) {
                    if (e.shouldThrowOnError) throw r;
                    if (nt(r)) return {
                        data: null,
                        error: r
                    };
                    throw r
                }
            }
        };
        let Xt;
        Xt = Symbol.toStringTag;
        var Is = class {
            constructor(t, e) {
                this.downloadFn = t, this.shouldThrowOnError = e, this[Xt] = "StreamDownloadBuilder", this.promise = null
            }
            then(t, e) {
                return this.getPromise().then(t, e)
            } catch (t) {
                return this.getPromise().catch(t)
            } finally(t) {
                return this.getPromise().finally(t)
            }
            getPromise() {
                return this.promise || (this.promise = this.execute()), this.promise
            }
            async execute() {
                var t = this;
                try {
                    return {
                        data: (await t.downloadFn()).body,
                        error: null
                    }
                } catch (e) {
                    if (t.shouldThrowOnError) throw e;
                    if (nt(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
        };
        let Qt;
        Qt = Symbol.toStringTag;
        var Cs = class {
            constructor(t, e) {
                this.downloadFn = t, this.shouldThrowOnError = e, this[Qt] = "BlobDownloadBuilder", this.promise = null
            }
            asStream() {
                return new Is(this.downloadFn, this.shouldThrowOnError)
            }
            then(t, e) {
                return this.getPromise().then(t, e)
            } catch (t) {
                return this.getPromise().catch(t)
            } finally(t) {
                return this.getPromise().finally(t)
            }
            getPromise() {
                return this.promise || (this.promise = this.execute()), this.promise
            }
            async execute() {
                var t = this;
                try {
                    return {
                        data: await (await t.downloadFn()).blob(),
                        error: null
                    }
                } catch (e) {
                    if (t.shouldThrowOnError) throw e;
                    if (nt(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
        };
        let xs = {
                limit: 100,
                offset: 0,
                sortBy: {
                    column: "name",
                    order: "asc"
                }
            },
            Zt = {
                cacheControl: "3600",
                contentType: "text/plain;charset=UTF-8",
                upsert: !1
            };
        var Os = class extends Oe {
            constructor(t, e = {}, r, s) {
                super(t, e, s, "storage"), this.bucketId = r
            }
            async uploadOrUpdate(t, e, r, s) {
                var n = this;
                return n.handleOperation(async () => {
                    let a, i = P(P({}, Zt), s),
                        o = P(P({}, n.headers), t === "POST" && {
                            "x-upsert": String(i.upsert)
                        }),
                        c = i.metadata;
                    if (typeof Blob < "u" && r instanceof Blob ? (a = new FormData, a.append("cacheControl", i.cacheControl), c && a.append("metadata", n.encodeMetadata(c)), a.append("", r)) : typeof FormData < "u" && r instanceof FormData ? (a = r, a.has("cacheControl") || a.append("cacheControl", i.cacheControl), c && !a.has("metadata") && a.append("metadata", n.encodeMetadata(c))) : (a = r, o["cache-control"] = `max-age=${i.cacheControl}`, o["content-type"] = i.contentType, c && (o["x-metadata"] = n.toBase64(n.encodeMetadata(c))), (typeof ReadableStream < "u" && a instanceof ReadableStream || a && typeof a == "object" && "pipe" in a && typeof a.pipe == "function") && !i.duplex && (i.duplex = "half")), s == null ? void 0 : s.headers)
                        for (let [m, y] of Object.entries(s.headers)) o = it(o, m, y);
                    let u = n._removeEmptyFolders(e),
                        p = n._getFinalPath(u),
                        f = await (t == "PUT" ? Et : ne)(n.fetch, `${n.url}/object/${p}`, a, P({
                            headers: o
                        }, i != null && i.duplex ? {
                            duplex: i.duplex
                        } : {}));
                    return {
                        path: u,
                        id: f.Id,
                        fullPath: f.Key
                    }
                })
            }
            async upload(t, e, r) {
                return this.uploadOrUpdate("POST", t, e, r)
            }
            async uploadToSignedUrl(t, e, r, s) {
                var n = this;
                let a = n._removeEmptyFolders(t),
                    i = n._getFinalPath(a),
                    o = new URL(n.url + `/object/upload/sign/${i}`);
                return o.searchParams.set("token", e), n.handleOperation(async () => {
                    let c, u = P(P({}, Zt), s),
                        p = P(P({}, n.headers), {
                            "x-upsert": String(u.upsert)
                        }),
                        f = u.metadata;
                    if (typeof Blob < "u" && r instanceof Blob ? (c = new FormData, c.append("cacheControl", u.cacheControl), f && c.append("metadata", n.encodeMetadata(f)), c.append("", r)) : typeof FormData < "u" && r instanceof FormData ? (c = r, c.has("cacheControl") || c.append("cacheControl", u.cacheControl), f && !c.has("metadata") && c.append("metadata", n.encodeMetadata(f))) : (c = r, p["cache-control"] = `max-age=${u.cacheControl}`, p["content-type"] = u.contentType, f && (p["x-metadata"] = n.toBase64(n.encodeMetadata(f))), (typeof ReadableStream < "u" && c instanceof ReadableStream || c && typeof c == "object" && "pipe" in c && typeof c.pipe == "function") && !u.duplex && (u.duplex = "half")), s == null ? void 0 : s.headers)
                        for (let [m, y] of Object.entries(s.headers)) p = it(p, m, y);
                    return {
                        path: a,
                        fullPath: (await Et(n.fetch, o.toString(), c, P({
                            headers: p
                        }, u != null && u.duplex ? {
                            duplex: u.duplex
                        } : {}))).Key
                    }
                })
            }
            async createSignedUploadUrl(t, e) {
                var r = this;
                return r.handleOperation(async () => {
                    let s = r._getFinalPath(t),
                        n = P({}, r.headers);
                    e != null && e.upsert && (n["x-upsert"] = "true");
                    let a = await ne(r.fetch, `${r.url}/object/upload/sign/${s}`, {}, {
                            headers: n
                        }),
                        i = new URL(r.url + a.url),
                        o = i.searchParams.get("token");
                    if (!o) throw new st("No token returned by API");
                    return {
                        signedUrl: i.toString(),
                        path: t,
                        token: o
                    }
                })
            }
            async update(t, e, r) {
                return this.uploadOrUpdate("PUT", t, e, r)
            }
            async move(t, e, r) {
                var s = this;
                return s.handleOperation(async () => await ne(s.fetch, `${s.url}/object/move`, {
                    bucketId: s.bucketId,
                    sourceKey: t,
                    destinationKey: e,
                    destinationBucket: r == null ? void 0 : r.destinationBucket
                }, {
                    headers: s.headers
                }))
            }
            async copy(t, e, r) {
                var s = this;
                return s.handleOperation(async () => ({
                    path: (await ne(s.fetch, `${s.url}/object/copy`, {
                        bucketId: s.bucketId,
                        sourceKey: t,
                        destinationKey: e,
                        destinationBucket: r == null ? void 0 : r.destinationBucket
                    }, {
                        headers: s.headers
                    })).Key
                }))
            }
            async createSignedUrl(t, e, r) {
                var s = this;
                return s.handleOperation(async () => {
                    let n = s._getFinalPath(t),
                        a = typeof(r == null ? void 0 : r.transform) == "object" && r.transform !== null && Object.keys(r.transform).length > 0,
                        i = await ne(s.fetch, `${s.url}/object/sign/${n}`, P({
                            expiresIn: e
                        }, a ? {
                            transform: r.transform
                        } : {}), {
                            headers: s.headers
                        }),
                        o = new URLSearchParams;
                    r != null && r.download && o.set("download", r.download === !0 ? "" : r.download), (r == null ? void 0 : r.cacheNonce) != null && o.set("cacheNonce", String(r.cacheNonce));
                    let c = o.toString();
                    return {
                        signedUrl: encodeURI(`${s.url}${i.signedURL}${c?`&${c}`:""}`)
                    }
                })
            }
            async createSignedUrls(t, e, r) {
                var s = this;
                return s.handleOperation(async () => {
                    let n = await ne(s.fetch, `${s.url}/object/sign/${s.bucketId}`, {
                            expiresIn: e,
                            paths: t
                        }, {
                            headers: s.headers
                        }),
                        a = new URLSearchParams;
                    r != null && r.download && a.set("download", r.download === !0 ? "" : r.download), (r == null ? void 0 : r.cacheNonce) != null && a.set("cacheNonce", String(r.cacheNonce));
                    let i = a.toString();
                    return n.map(o => P(P({}, o), {}, {
                        signedUrl: o.signedURL ? encodeURI(`${s.url}${o.signedURL}${i?`&${i}`:""}`) : null
                    }))
                })
            }
            download(t, e, r) {
                let s = typeof(e == null ? void 0 : e.transform) == "object" && e.transform !== null && Object.keys(e.transform).length > 0 ? "render/image/authenticated" : "object",
                    n = new URLSearchParams;
                e != null && e.transform && this.applyTransformOptsToQuery(n, e.transform), (e == null ? void 0 : e.cacheNonce) != null && n.set("cacheNonce", String(e.cacheNonce));
                let a = n.toString(),
                    i = this._getFinalPath(t);
                return new Cs(() => He(this.fetch, `${this.url}/${s}/${i}${a?`?${a}`:""}`, {
                    headers: this.headers,
                    noResolveJson: !0
                }, r), this.shouldThrowOnError)
            }
            async info(t) {
                var e = this;
                let r = e._getFinalPath(t);
                return e.handleOperation(async () => kt(await He(e.fetch, `${e.url}/object/info/${r}`, {
                    headers: e.headers
                })))
            }
            async exists(t) {
                var s;
                var e = this;
                let r = e._getFinalPath(t);
                try {
                    return await As(e.fetch, `${e.url}/object/${r}`, {
                        headers: e.headers
                    }), {
                        data: !0,
                        error: null
                    }
                } catch (n) {
                    if (e.shouldThrowOnError) throw n;
                    if (nt(n)) {
                        let a = n instanceof at ? n.status : n instanceof Gt ? (s = n.originalError) == null ? void 0 : s.status : void 0;
                        if (a !== void 0 && [400, 404].includes(a)) return {
                            data: !1,
                            error: n
                        }
                    }
                    throw n
                }
            }
            getPublicUrl(t, e) {
                let r = this._getFinalPath(t),
                    s = new URLSearchParams;
                e != null && e.download && s.set("download", e.download === !0 ? "" : e.download), e != null && e.transform && this.applyTransformOptsToQuery(s, e.transform), (e == null ? void 0 : e.cacheNonce) != null && s.set("cacheNonce", String(e.cacheNonce));
                let n = s.toString(),
                    a = typeof(e == null ? void 0 : e.transform) == "object" && e.transform !== null && Object.keys(e.transform).length > 0 ? "render/image" : "object";
                return {
                    data: {
                        publicUrl: encodeURI(`${this.url}/${a}/public/${r}`) + (n ? `?${n}` : "")
                    }
                }
            }
            async remove(t) {
                var e = this;
                return e.handleOperation(async () => await St(e.fetch, `${e.url}/object/${e.bucketId}`, {
                    prefixes: t
                }, {
                    headers: e.headers
                }))
            }
            async list(t, e, r) {
                var s = this;
                return s.handleOperation(async () => {
                    let n = P(P(P({}, xs), e), {}, {
                        prefix: t || ""
                    });
                    return await ne(s.fetch, `${s.url}/object/list/${s.bucketId}`, n, {
                        headers: s.headers
                    }, r)
                })
            }
            async listV2(t, e) {
                var r = this;
                return r.handleOperation(async () => {
                    let s = P({}, t);
                    return await ne(r.fetch, `${r.url}/object/list-v2/${r.bucketId}`, s, {
                        headers: r.headers
                    }, e)
                })
            }
            encodeMetadata(t) {
                return JSON.stringify(t)
            }
            toBase64(t) {
                return typeof Buffer < "u" ? Buffer.from(t).toString("base64") : btoa(t)
            }
            _getFinalPath(t) {
                return `${this.bucketId}/${t.replace(/^\/+/,"")}`
            }
            _removeEmptyFolders(t) {
                return t.replace(/^\/|\/$/g, "").replace(/\/+/g, "/")
            }
            applyTransformOptsToQuery(t, e) {
                return e.width && t.set("width", e.width.toString()), e.height && t.set("height", e.height.toString()), e.resize && t.set("resize", e.resize), e.format && t.set("format", e.format), e.quality && t.set("quality", e.quality.toString()), t
            }
        };
        let We = {
            "X-Client-Info": "storage-js/2.106.0"
        };
        var Ps = class extends Oe {
                constructor(t, e = {}, r, s) {
                    let n = new URL(t);
                    s != null && s.useNewHostname && /supabase\.(co|in|red)$/.test(n.hostname) && !n.hostname.includes("storage.supabase.") && (n.hostname = n.hostname.replace("supabase.", "storage.supabase."));
                    let a = n.href.replace(/\/$/, ""),
                        i = P(P({}, We), e);
                    super(a, i, r, "storage")
                }
                async listBuckets(t) {
                    var e = this;
                    return e.handleOperation(async () => {
                        let r = e.listBucketOptionsToQueryString(t);
                        return await He(e.fetch, `${e.url}/bucket${r}`, {
                            headers: e.headers
                        })
                    })
                }
                async getBucket(t) {
                    var e = this;
                    return e.handleOperation(async () => await He(e.fetch, `${e.url}/bucket/${t}`, {
                        headers: e.headers
                    }))
                }
                async createBucket(t, e = {
                    public: !1
                }) {
                    var r = this;
                    return r.handleOperation(async () => await ne(r.fetch, `${r.url}/bucket`, {
                        id: t,
                        name: t,
                        type: e.type,
                        public: e.public,
                        file_size_limit: e.fileSizeLimit,
                        allowed_mime_types: e.allowedMimeTypes
                    }, {
                        headers: r.headers
                    }))
                }
                async updateBucket(t, e) {
                    var r = this;
                    return r.handleOperation(async () => await Et(r.fetch, `${r.url}/bucket/${t}`, {
                        id: t,
                        name: t,
                        public: e.public,
                        file_size_limit: e.fileSizeLimit,
                        allowed_mime_types: e.allowedMimeTypes
                    }, {
                        headers: r.headers
                    }))
                }
                async emptyBucket(t) {
                    var e = this;
                    return e.handleOperation(async () => await ne(e.fetch, `${e.url}/bucket/${t}/empty`, {}, {
                        headers: e.headers
                    }))
                }
                async deleteBucket(t) {
                    var e = this;
                    return e.handleOperation(async () => await St(e.fetch, `${e.url}/bucket/${t}`, {}, {
                        headers: e.headers
                    }))
                }
                listBucketOptionsToQueryString(t) {
                    let e = {};
                    return t && ("limit" in t && (e.limit = String(t.limit)), "offset" in t && (e.offset = String(t.offset)), t.search && (e.search = t.search), t.sortColumn && (e.sortColumn = t.sortColumn), t.sortOrder && (e.sortOrder = t.sortOrder)), Object.keys(e).length > 0 ? "?" + new URLSearchParams(e).toString() : ""
                }
            },
            js = class extends Oe {
                constructor(t, e = {}, r) {
                    let s = t.replace(/\/$/, ""),
                        n = P(P({}, We), e);
                    super(s, n, r, "storage")
                }
                async createBucket(t) {
                    var e = this;
                    return e.handleOperation(async () => await ne(e.fetch, `${e.url}/bucket`, {
                        name: t
                    }, {
                        headers: e.headers
                    }))
                }
                async listBuckets(t) {
                    var e = this;
                    return e.handleOperation(async () => {
                        let r = new URLSearchParams;
                        (t == null ? void 0 : t.limit) !== void 0 && r.set("limit", t.limit.toString()), (t == null ? void 0 : t.offset) !== void 0 && r.set("offset", t.offset.toString()), t != null && t.sortColumn && r.set("sortColumn", t.sortColumn), t != null && t.sortOrder && r.set("sortOrder", t.sortOrder), t != null && t.search && r.set("search", t.search);
                        let s = r.toString(),
                            n = s ? `${e.url}/bucket?${s}` : `${e.url}/bucket`;
                        return await He(e.fetch, n, {
                            headers: e.headers
                        })
                    })
                }
                async deleteBucket(t) {
                    var e = this;
                    return e.handleOperation(async () => await St(e.fetch, `${e.url}/bucket/${t}`, {}, {
                        headers: e.headers
                    }))
                }
                from(t) {
                    var e = this;
                    if (!Ss(t)) throw new st("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
                    let r = new ys({
                            baseUrl: this.url,
                            catalogName: t,
                            auth: {
                                type: "custom",
                                getHeaders: async () => e.headers
                            },
                            fetch: this.fetch
                        }),
                        s = this.shouldThrowOnError;
                    return new Proxy(r, {
                        get(n, a) {
                            let i = n[a];
                            return typeof i == "function" ? async (...o) => {
                                try {
                                    return {
                                        data: await i.apply(n, o),
                                        error: null
                                    }
                                } catch (c) {
                                    if (s) throw c;
                                    return {
                                        data: null,
                                        error: c
                                    }
                                }
                            }: i
                        }
                    })
                }
            },
            $s = class extends Oe {
                constructor(t, e = {}, r) {
                    let s = t.replace(/\/$/, ""),
                        n = P(P({}, We), {}, {
                            "Content-Type": "application/json"
                        }, e);
                    super(s, n, r, "vectors")
                }
                async createIndex(t) {
                    var e = this;
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/CreateIndex`, t, {
                        headers: e.headers
                    }) || {})
                }
                async getIndex(t, e) {
                    var r = this;
                    return r.handleOperation(async () => await ee.post(r.fetch, `${r.url}/GetIndex`, {
                        vectorBucketName: t,
                        indexName: e
                    }, {
                        headers: r.headers
                    }))
                }
                async listIndexes(t) {
                    var e = this;
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/ListIndexes`, t, {
                        headers: e.headers
                    }))
                }
                async deleteIndex(t, e) {
                    var r = this;
                    return r.handleOperation(async () => await ee.post(r.fetch, `${r.url}/DeleteIndex`, {
                        vectorBucketName: t,
                        indexName: e
                    }, {
                        headers: r.headers
                    }) || {})
                }
            },
            Ls = class extends Oe {
                constructor(t, e = {}, r) {
                    let s = t.replace(/\/$/, ""),
                        n = P(P({}, We), {}, {
                            "Content-Type": "application/json"
                        }, e);
                    super(s, n, r, "vectors")
                }
                async putVectors(t) {
                    var e = this;
                    if (t.vectors.length < 1 || t.vectors.length > 500) throw Error("Vector batch size must be between 1 and 500 items");
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/PutVectors`, t, {
                        headers: e.headers
                    }) || {})
                }
                async getVectors(t) {
                    var e = this;
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/GetVectors`, t, {
                        headers: e.headers
                    }))
                }
                async listVectors(t) {
                    var e = this;
                    if (t.segmentCount !== void 0) {
                        if (t.segmentCount < 1 || t.segmentCount > 16) throw Error("segmentCount must be between 1 and 16");
                        if (t.segmentIndex !== void 0 && (t.segmentIndex < 0 || t.segmentIndex >= t.segmentCount)) throw Error(`segmentIndex must be between 0 and ${t.segmentCount-1}`)
                    }
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/ListVectors`, t, {
                        headers: e.headers
                    }))
                }
                async queryVectors(t) {
                    var e = this;
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/QueryVectors`, t, {
                        headers: e.headers
                    }))
                }
                async deleteVectors(t) {
                    var e = this;
                    if (t.keys.length < 1 || t.keys.length > 500) throw Error("Keys batch size must be between 1 and 500 items");
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/DeleteVectors`, t, {
                        headers: e.headers
                    }) || {})
                }
            },
            Ns = class extends Oe {
                constructor(t, e = {}, r) {
                    let s = t.replace(/\/$/, ""),
                        n = P(P({}, We), {}, {
                            "Content-Type": "application/json"
                        }, e);
                    super(s, n, r, "vectors")
                }
                async createBucket(t) {
                    var e = this;
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/CreateVectorBucket`, {
                        vectorBucketName: t
                    }, {
                        headers: e.headers
                    }) || {})
                }
                async getBucket(t) {
                    var e = this;
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/GetVectorBucket`, {
                        vectorBucketName: t
                    }, {
                        headers: e.headers
                    }))
                }
                async listBuckets(t = {}) {
                    var e = this;
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/ListVectorBuckets`, t, {
                        headers: e.headers
                    }))
                }
                async deleteBucket(t) {
                    var e = this;
                    return e.handleOperation(async () => await ee.post(e.fetch, `${e.url}/DeleteVectorBucket`, {
                        vectorBucketName: t
                    }, {
                        headers: e.headers
                    }) || {})
                }
            },
            Bs = class extends Ns {
                constructor(t, e = {}) {
                    super(t, e.headers || {}, e.fetch)
                }
                from(t) {
                    return new Us(this.url, this.headers, t, this.fetch)
                }
                async createBucket(t) {
                    var e = () => super.createBucket,
                        r = this;
                    return e().call(r, t)
                }
                async getBucket(t) {
                    var e = () => super.getBucket,
                        r = this;
                    return e().call(r, t)
                }
                async listBuckets(t = {}) {
                    var e = () => super.listBuckets,
                        r = this;
                    return e().call(r, t)
                }
                async deleteBucket(t) {
                    var e = () => super.deleteBucket,
                        r = this;
                    return e().call(r, t)
                }
            },
            Us = class extends $s {
                constructor(t, e, r, s) {
                    super(t, e, s), this.vectorBucketName = r
                }
                async createIndex(t) {
                    var e = () => super.createIndex,
                        r = this;
                    return e().call(r, P(P({}, t), {}, {
                        vectorBucketName: r.vectorBucketName
                    }))
                }
                async listIndexes(t = {}) {
                    var e = () => super.listIndexes,
                        r = this;
                    return e().call(r, P(P({}, t), {}, {
                        vectorBucketName: r.vectorBucketName
                    }))
                }
                async getIndex(t) {
                    var e = () => super.getIndex,
                        r = this;
                    return e().call(r, r.vectorBucketName, t)
                }
                async deleteIndex(t) {
                    var e = () => super.deleteIndex,
                        r = this;
                    return e().call(r, r.vectorBucketName, t)
                }
                index(t) {
                    return new Ds(this.url, this.headers, this.vectorBucketName, t, this.fetch)
                }
            },
            Ds = class extends Ls {
                constructor(t, e, r, s, n) {
                    super(t, e, n), this.vectorBucketName = r, this.indexName = s
                }
                async putVectors(t) {
                    var e = () => super.putVectors,
                        r = this;
                    return e().call(r, P(P({}, t), {}, {
                        vectorBucketName: r.vectorBucketName,
                        indexName: r.indexName
                    }))
                }
                async getVectors(t) {
                    var e = () => super.getVectors,
                        r = this;
                    return e().call(r, P(P({}, t), {}, {
                        vectorBucketName: r.vectorBucketName,
                        indexName: r.indexName
                    }))
                }
                async listVectors(t = {}) {
                    var e = () => super.listVectors,
                        r = this;
                    return e().call(r, P(P({}, t), {}, {
                        vectorBucketName: r.vectorBucketName,
                        indexName: r.indexName
                    }))
                }
                async queryVectors(t) {
                    var e = () => super.queryVectors,
                        r = this;
                    return e().call(r, P(P({}, t), {}, {
                        vectorBucketName: r.vectorBucketName,
                        indexName: r.indexName
                    }))
                }
                async deleteVectors(t) {
                    var e = () => super.deleteVectors,
                        r = this;
                    return e().call(r, P(P({}, t), {}, {
                        vectorBucketName: r.vectorBucketName,
                        indexName: r.indexName
                    }))
                }
            },
            Ms = class extends Ps {
                constructor(t, e = {}, r, s) {
                    super(t, e, r, s)
                }
                from(t) {
                    return new Os(this.url, this.headers, t, this.fetch)
                }
                get vectors() {
                    return new Bs(this.url + "/vector", {
                        headers: this.headers,
                        fetch: this.fetch
                    })
                }
                get analytics() {
                    return new js(this.url + "/iceberg", this.headers, this.fetch)
                }
            };
        let er = "";
        er = typeof Deno < "u" ? "deno" : typeof document < "u" ? "web" : typeof navigator < "u" && navigator.product === "ReactNative" ? "react-native" : "node";
        let qs = {
                headers: {
                    "X-Client-Info": `supabase-js-${er}/2.106.0`
                }
            },
            Fs = {
                schema: "public"
            },
            Hs = {
                autoRefreshToken: !0,
                persistSession: !0,
                detectSessionInUrl: !0,
                flowType: "implicit"
            },
            Ws = {},
            Ks = {
                enabled: !1,
                respectSamplingDecision: !0
            },
            Tt = null;

        function zs() {
            return Tt === null && (Tt = import("@opentelemetry/api").catch(() => null)), Tt
        }

        function Js() {
            return d(this, void 0, void 0, function*() {
                try {
                    let t = yield zs();
                    if (!t || !t.propagation || !t.context) return null;
                    let e = {};
                    t.propagation.inject(t.context.active(), e);
                    let r = e.traceparent;
                    return r ? {
                        traceparent: r,
                        tracestate: e.tracestate,
                        baggage: e.baggage
                    } : null
                } catch (t) {
                    return null
                }
            })
        }

        function Gs(t) {
            if (!t || typeof t != "string") return null;
            let e = t.split("-");
            if (e.length !== 4) return null;
            let [r, s, n, a] = e;
            if (r.length !== 2 || s.length !== 32 || n.length !== 16 || a.length !== 2) return null;
            let i = /^[0-9a-f]+$/i;
            return !i.test(r) || !i.test(s) || !i.test(n) || !i.test(a) || s === "00000000000000000000000000000000" || n === "0000000000000000" ? null : {
                version: r,
                traceId: s,
                parentId: n,
                traceFlags: a,
                isSampled: (parseInt(a, 16) & 1) == 1
            }
        }

        function Vs(t, e) {
            if (!t || !e || e.length === 0) return !1;
            let r;
            if (t instanceof URL) r = t;
            else try {
                r = new URL(t)
            } catch (s) {
                return !1
            }
            for (let s of e) try {
                if (typeof s == "string") {
                    if (Ys(r.hostname, s)) return !0
                } else if (s instanceof RegExp) {
                    if (s.test(r.hostname)) return !0
                } else if (typeof s == "function" && s(r)) return !0
            } catch (n) {
                continue
            }
            return !1
        }

        function Ys(t, e) {
            if (e === t) return !0;
            if (e.startsWith("*.")) {
                let r = e.slice(2);
                if (t.endsWith(r) && (t === r || t.endsWith("." + r))) return !0
            }
            return !1
        }

        function Xs(t) {
            let e = [];
            try {
                let r = new URL(t);
                e.push(r.hostname)
            } catch (r) {}
            return e.push("*.supabase.co", "*.supabase.in"), e.push("localhost", "127.0.0.1", "[::1]"), e
        }
        let Qs = t => t ? (...e) => t(...e) : (...e) => fetch(...e),
            Zs = () => Headers,
            en = (t, e, r, s, n) => {
                let a = Qs(s),
                    i = Zs(),
                    o = (n == null ? void 0 : n.enabled) === !0,
                    c = (n == null ? void 0 : n.respectSamplingDecision) !== !1,
                    u = o ? Xs(e) : null;
                return async (p, f) => {
                    var S;
                    let m = (S = await r()) != null ? S : t,
                        y = new i(f == null ? void 0 : f.headers);
                    if (y.has("apikey") || y.set("apikey", t), y.has("Authorization") || y.set("Authorization", `Bearer ${m}`), u) {
                        let R = await tn(p, u, c);
                        R && (R.traceparent && !y.has("traceparent") && y.set("traceparent", R.traceparent), R.tracestate && !y.has("tracestate") && y.set("tracestate", R.tracestate), R.baggage && !y.has("baggage") && y.set("baggage", R.baggage))
                    }
                    return a(p, Ue(z({}, f), {
                        headers: y
                    }))
                }
            };
        async function tn(t, e, r) {
            if (!Vs(typeof t == "string" || t instanceof URL ? t : t.url, e)) return null;
            let s = await Js();
            if (!s || !s.traceparent) return null;
            if (r) {
                let n = Gs(s.traceparent);
                if (n && !n.isSampled) return null
            }
            return s
        }

        function tr(t) {
            return typeof t == "boolean" ? {
                enabled: t
            } : t
        }

        function rn(t) {
            return t.endsWith("/") ? t : t + "/"
        }

        function sn(t, e) {
            var y, S, R, T, M, C;
            let {
                db: r,
                auth: s,
                realtime: n,
                global: a
            } = t, {
                db: i,
                auth: o,
                realtime: c,
                global: u
            } = e, p = tr(t.tracePropagation), f = tr(e.tracePropagation), m = {
                db: z(z({}, i), r),
                auth: z(z({}, o), s),
                realtime: z(z({}, c), n),
                storage: {},
                global: Ue(z(z({}, u), a), {
                    headers: z(z({}, (y = u == null ? void 0 : u.headers) != null ? y : {}), (S = a == null ? void 0 : a.headers) != null ? S : {})
                }),
                tracePropagation: {
                    enabled: (T = (R = p == null ? void 0 : p.enabled) != null ? R : f == null ? void 0 : f.enabled) != null ? T : !1,
                    respectSamplingDecision: (C = (M = p == null ? void 0 : p.respectSamplingDecision) != null ? M : f == null ? void 0 : f.respectSamplingDecision) != null ? C : !0
                },
                accessToken: async () => ""
            };
            return t.accessToken ? m.accessToken = t.accessToken : delete m.accessToken, m
        }

        function nn(t) {
            let e = t == null ? void 0 : t.trim();
            if (!e) throw Error("supabaseUrl is required.");
            if (!e.match(/^https?:\/\//i)) throw Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
            try {
                return new URL(rn(e))
            } catch (r) {
                throw Error("Invalid supabaseUrl: Provided URL is malformed.")
            }
        }
        let rr = "2.106.0",
            Pe = 30 * 1e3,
            Rt = 3 * Pe,
            an = {
                "X-Client-Info": `gotrue-js/${rr}`
            },
            At = "X-Supabase-Api-Version",
            sr = {
                "2024-01-01": {
                    timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
                    name: "2024-01-01"
                }
            },
            on = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
        var je = class extends Error {
            constructor(t, e, r) {
                super(t), this.__isAuthError = !0, this.name = "AuthError", this.status = e, this.code = r
            }
            toJSON() {
                return {
                    name: this.name,
                    message: this.message,
                    status: this.status,
                    code: this.code
                }
            }
        };

        function _(t) {
            return typeof t == "object" && !!t && "__isAuthError" in t
        }
        var nr = class extends je {
            constructor(t, e, r) {
                super(t, e, r), this.name = "AuthApiError", this.status = e, this.code = r
            }
        };

        function ar(t) {
            return _(t) && t.name === "AuthApiError"
        }
        var re = class extends je {
                constructor(t, e) {
                    super(t), this.name = "AuthUnknownError", this.originalError = e
                }
            },
            he = class extends je {
                constructor(t, e, r, s) {
                    super(t, r, s), this.name = e, this.status = r
                }
            },
            V = class extends he {
                constructor() {
                    super("Auth session missing!", "AuthSessionMissingError", 400, void 0)
                }
            };

        function Ke(t) {
            return _(t) && t.name === "AuthSessionMissingError"
        }
        var we = class extends he {
                constructor() {
                    super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0)
                }
            },
            ze = class extends he {
                constructor(t) {
                    super(t, "AuthInvalidCredentialsError", 400, void 0)
                }
            },
            Je = class extends he {
                constructor(t, e = null) {
                    super(t, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = e
                }
                toJSON() {
                    return Object.assign(Object.assign({}, super.toJSON()), {
                        details: this.details
                    })
                }
            };

        function ir(t) {
            return _(t) && t.name === "AuthImplicitGrantRedirectError"
        }
        var It = class extends he {
                constructor(t, e = null) {
                    super(t, "AuthPKCEGrantCodeExchangeError", 500, void 0), this.details = null, this.details = e
                }
                toJSON() {
                    return Object.assign(Object.assign({}, super.toJSON()), {
                        details: this.details
                    })
                }
            },
            or = class extends he {
                constructor() {
                    super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found")
                }
            };

        function ln(t) {
            return _(t) && t.name === "AuthPKCECodeVerifierMissingError"
        }
        var ot = class extends he {
            constructor(t, e) {
                super(t, "AuthRetryableFetchError", e, void 0)
            }
        };

        function lt(t) {
            return _(t) && t.name === "AuthRetryableFetchError"
        }
        var Ct = class extends he {
            constructor(t, e, r) {
                super(t, "AuthWeakPasswordError", e, "weak_password"), this.reasons = r
            }
            toJSON() {
                return Object.assign(Object.assign({}, super.toJSON()), {
                    reasons: this.reasons
                })
            }
        };

        function cn(t) {
            return _(t) && t.name === "AuthWeakPasswordError"
        }
        var ct = class extends he {
            constructor(t) {
                super(t, "AuthInvalidJwtError", 400, "invalid_jwt")
            }
        };
        let ut = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),
            lr = ` 	
\r=`.split(""),
            un = (() => {
                let t = Array(128);
                for (let e = 0; e < t.length; e += 1) t[e] = -1;
                for (let e = 0; e < lr.length; e += 1) t[lr[e].charCodeAt(0)] = -2;
                for (let e = 0; e < ut.length; e += 1) t[ut[e].charCodeAt(0)] = e;
                return t
            })();

        function cr(t, e, r) {
            if (t !== null)
                for (e.queue = e.queue << 8 | t, e.queuedBits += 8; e.queuedBits >= 6;) r(ut[e.queue >> e.queuedBits - 6 & 63]), e.queuedBits -= 6;
            else if (e.queuedBits > 0)
                for (e.queue <<= 6 - e.queuedBits, e.queuedBits = 6; e.queuedBits >= 6;) r(ut[e.queue >> e.queuedBits - 6 & 63]), e.queuedBits -= 6
        }

        function ur(t, e, r) {
            let s = un[t];
            if (s > -1)
                for (e.queue = e.queue << 6 | s, e.queuedBits += 6; e.queuedBits >= 8;) r(e.queue >> e.queuedBits - 8 & 255), e.queuedBits -= 8;
            else {
                if (s === -2) return;
                throw Error(`Invalid Base64-URL character "${String.fromCharCode(t)}"`)
            }
        }

        function hr(t) {
            let e = [],
                r = i => {
                    e.push(String.fromCodePoint(i))
                },
                s = {
                    utf8seq: 0,
                    codepoint: 0
                },
                n = {
                    queue: 0,
                    queuedBits: 0
                },
                a = i => {
                    pn(i, s, r)
                };
            for (let i = 0; i < t.length; i += 1) ur(t.charCodeAt(i), n, a);
            return e.join("")
        }

        function hn(t, e) {
            if (t <= 127) {
                e(t);
                return
            } else if (t <= 2047) {
                e(192 | t >> 6), e(128 | t & 63);
                return
            } else if (t <= 65535) {
                e(224 | t >> 12), e(128 | t >> 6 & 63), e(128 | t & 63);
                return
            } else if (t <= 1114111) {
                e(240 | t >> 18), e(128 | t >> 12 & 63), e(128 | t >> 6 & 63), e(128 | t & 63);
                return
            }
            throw Error(`Unrecognized Unicode codepoint: ${t.toString(16)}`)
        }

        function dn(t, e) {
            for (let r = 0; r < t.length; r += 1) {
                let s = t.charCodeAt(r);
                if (s > 55295 && s <= 56319) {
                    let n = (s - 55296) * 1024 & 65535;
                    s = (t.charCodeAt(r + 1) - 56320 & 65535 | n) + 65536, r += 1
                }
                hn(s, e)
            }
        }

        function pn(t, e, r) {
            if (e.utf8seq === 0) {
                if (t <= 127) {
                    r(t);
                    return
                }
                for (let s = 1; s < 6; s += 1)
                    if (!(t >> 7 - s & 1)) {
                        e.utf8seq = s;
                        break
                    } if (e.utf8seq === 2) e.codepoint = t & 31;
                else if (e.utf8seq === 3) e.codepoint = t & 15;
                else if (e.utf8seq === 4) e.codepoint = t & 7;
                else throw Error("Invalid UTF-8 sequence");
                --e.utf8seq
            } else if (e.utf8seq > 0) {
                if (t <= 127) throw Error("Invalid UTF-8 sequence");
                e.codepoint = e.codepoint << 6 | t & 63, --e.utf8seq, e.utf8seq === 0 && r(e.codepoint)
            }
        }

        function $e(t) {
            let e = [],
                r = {
                    queue: 0,
                    queuedBits: 0
                },
                s = n => {
                    e.push(n)
                };
            for (let n = 0; n < t.length; n += 1) ur(t.charCodeAt(n), r, s);
            return new Uint8Array(e)
        }

        function fn(t) {
            let e = [];
            return dn(t, r => e.push(r)), new Uint8Array(e)
        }

        function ve(t) {
            let e = [],
                r = {
                    queue: 0,
                    queuedBits: 0
                },
                s = n => {
                    e.push(n)
                };
            return t.forEach(n => cr(n, r, s)), cr(null, r, s), e.join("")
        }

        function gn(t) {
            return Math.round(Date.now() / 1e3) + t
        }

        function mn() {
            return Symbol("auth-callback")
        }
        let Y = () => typeof window < "u" && typeof document < "u",
            _e = {
                tested: !1,
                writable: !1
            },
            dr = () => {
                if (!Y()) return !1;
                try {
                    if (typeof globalThis.localStorage != "object") return !1
                } catch (e) {
                    return !1
                }
                if (_e.tested) return _e.writable;
                let t = `lswt-${Math.random()}${Math.random()}`;
                try {
                    globalThis.localStorage.setItem(t, t), globalThis.localStorage.removeItem(t), _e.tested = !0, _e.writable = !0
                } catch (e) {
                    _e.tested = !0, _e.writable = !1
                }
                return _e.writable
            };

        function yn(t) {
            let e = {},
                r = new URL(t);
            if (r.hash && r.hash[0] === "#") try {
                new URLSearchParams(r.hash.substring(1)).forEach((s, n) => {
                    e[n] = s
                })
            } catch (s) {}
            return r.searchParams.forEach((s, n) => {
                e[n] = s
            }), e
        }
        let pr = t => t ? (...e) => t(...e) : (...e) => fetch(...e),
            bn = t => typeof t == "object" && !!t && "status" in t && "ok" in t && "json" in t && typeof t.json == "function",
            Le = async (t, e, r) => {
                await t.setItem(e, JSON.stringify(r))
            }, ke = async (t, e) => {
                let r = await t.getItem(e);
                if (!r) return null;
                try {
                    return JSON.parse(r)
                } catch (s) {
                    return null
                }
            }, X = async (t, e) => {
                await t.removeItem(e)
            };
        var fr = class Ur {
            constructor() {
                this.promise = new Ur.promiseConstructor((e, r) => {
                    this.resolve = e, this.reject = r
                })
            }
        };
        fr.promiseConstructor = Promise;

        function ht(t) {
            let e = t.split(".");
            if (e.length !== 3) throw new ct("Invalid JWT structure");
            for (let r = 0; r < e.length; r++)
                if (!on.test(e[r])) throw new ct("JWT not in base64url format");
            return {
                header: JSON.parse(hr(e[0])),
                payload: JSON.parse(hr(e[1])),
                signature: $e(e[2]),
                raw: {
                    header: e[0],
                    payload: e[1]
                }
            }
        }
        async function wn(t) {
            return await new Promise(e => {
                setTimeout(() => e(null), t)
            })
        }

        function vn(t, e) {
            return new Promise((r, s) => {
                (async () => {
                    for (let n = 0; n < 1 / 0; n++) try {
                        let a = await t(n);
                        if (!e(n, null, a)) {
                            r(a);
                            return
                        }
                    } catch (a) {
                        if (!e(n, a)) {
                            s(a);
                            return
                        }
                    }
                })()
            })
        }

        function _n(t) {
            return ("0" + t.toString(16)).substr(-2)
        }

        function kn() {
            let t = new Uint32Array(56);
            if (typeof crypto > "u") {
                let e = "";
                for (let r = 0; r < 56; r++) e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~".charAt(Math.floor(Math.random() * 66));
                return e
            }
            return crypto.getRandomValues(t), Array.from(t, _n).join("")
        }
        async function En(t) {
            let e = new TextEncoder().encode(t),
                r = await crypto.subtle.digest("SHA-256", e),
                s = new Uint8Array(r);
            return Array.from(s).map(n => String.fromCharCode(n)).join("")
        }
        async function Sn(t) {
            if (!(typeof crypto < "u" && crypto.subtle !== void 0 && typeof TextEncoder < "u")) return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), t;
            let e = await En(t);
            return btoa(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
        }
        async function Ne(t, e, r = !1) {
            let s = kn(),
                n = s;
            r && (n += "/recovery"), await Le(t, `${e}-code-verifier`, n);
            let a = await Sn(s);
            return [a, s === a ? "plain" : "s256"]
        }
        let Tn = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;

        function Rn(t) {
            let e = t.headers.get(At);
            if (!e || !e.match(Tn)) return null;
            try {
                return new Date(`${e}T00:00:00.0Z`)
            } catch (r) {
                return null
            }
        }

        function An(t) {
            if (!t) throw Error("Missing exp claim");
            if (t <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired")
        }

        function In(t) {
            switch (t) {
                case "RS256":
                    return {
                        name: "RSASSA-PKCS1-v1_5", hash: {
                            name: "SHA-256"
                        }
                    };
                case "ES256":
                    return {
                        name: "ECDSA", namedCurve: "P-256", hash: {
                            name: "SHA-256"
                        }
                    };
                default:
                    throw Error("Invalid alg claim")
            }
        }
        let Cn = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

        function ge(t) {
            if (!Cn.test(t)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not")
        }

        function ae(t) {
            if (!t.passkey) throw Error("@supabase/auth-js: the passkey API is experimental and disabled by default. Enable it by passing `auth: { experimental: { passkey: true } }` to createClient (or to the GoTrueClient constructor).")
        }

        function xt() {
            return new Proxy({}, {
                get: (t, e) => {
                    if (e === "__isUserNotAvailableProxy") return !0;
                    if (typeof e == "symbol") {
                        let r = e.toString();
                        if (r === "Symbol(Symbol.toPrimitive)" || r === "Symbol(Symbol.toStringTag)" || r === "Symbol(util.inspect.custom)") return
                    }
                    throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${e}" property of the session object is not supported. Please use getUser() instead.`)
                },
                set: (t, e) => {
                    throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${e}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)
                },
                deleteProperty: (t, e) => {
                    throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${e}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)
                }
            })
        }

        function xn(t, e) {
            return new Proxy(t, {
                get: (r, s, n) => {
                    if (s === "__isInsecureUserWarningProxy") return !0;
                    if (typeof s == "symbol") {
                        let a = s.toString();
                        if (a === "Symbol(Symbol.toPrimitive)" || a === "Symbol(Symbol.toStringTag)" || a === "Symbol(util.inspect.custom)" || a === "Symbol(nodejs.util.inspect.custom)") return Reflect.get(r, s, n)
                    }
                    return !e.value && typeof s == "string" && (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), e.value = !0), Reflect.get(r, s, n)
                }
            })
        }

        function gr(t) {
            return JSON.parse(JSON.stringify(t))
        }
        let Ee = t => {
                if (typeof t == "object" && t) {
                    let e = t;
                    if (typeof e.msg == "string") return e.msg;
                    if (typeof e.message == "string") return e.message;
                    if (typeof e.error_description == "string") return e.error_description;
                    if (typeof e.error == "string") return e.error
                }
                return JSON.stringify(t)
            },
            On = [502, 503, 504, 520, 521, 522, 523, 524, 530];
        async function mr(t) {
            var n;
            if (!bn(t)) throw new ot(Ee(t), 0);
            if (On.includes(t.status)) throw new ot(Ee(t), t.status);
            let e;
            try {
                e = await t.json()
            } catch (a) {
                throw new re(Ee(a), a)
            }
            let r, s = Rn(t);
            if (s && s.getTime() >= sr["2024-01-01"].timestamp && typeof e == "object" && e && typeof e.code == "string" ? r = e.code : typeof e == "object" && e && typeof e.error_code == "string" && (r = e.error_code), r) {
                if (r === "weak_password") throw new Ct(Ee(e), t.status, ((n = e.weak_password) == null ? void 0 : n.reasons) || []);
                if (r === "session_not_found") throw new V
            } else if (typeof e == "object" && e && typeof e.weak_password == "object" && e.weak_password && Array.isArray(e.weak_password.reasons) && e.weak_password.reasons.length && e.weak_password.reasons.reduce((a, i) => a && typeof i == "string", !0)) throw new Ct(Ee(e), t.status, e.weak_password.reasons);
            throw new nr(Ee(e), t.status || 500, r)
        }
        let Pn = (t, e, r, s) => {
            let n = {
                method: t,
                headers: (e == null ? void 0 : e.headers) || {}
            };
            return t === "GET" ? n : (n.headers = Object.assign({
                "Content-Type": "application/json;charset=UTF-8"
            }, e == null ? void 0 : e.headers), n.body = JSON.stringify(s), Object.assign(Object.assign({}, n), r))
        };
        async function A(t, e, r, s) {
            var o;
            let n = Object.assign({}, s == null ? void 0 : s.headers);
            n[At] || (n[At] = sr["2024-01-01"].name), s != null && s.jwt && (n.Authorization = `Bearer ${s.jwt}`);
            let a = (o = s == null ? void 0 : s.query) != null ? o : {};
            s != null && s.redirectTo && (a.redirect_to = s.redirectTo);
            let i = await jn(t, e, r + (Object.keys(a).length ? "?" + new URLSearchParams(a).toString() : ""), {
                headers: n,
                noResolveJson: s == null ? void 0 : s.noResolveJson
            }, {}, s == null ? void 0 : s.body);
            return s != null && s.xform ? s == null ? void 0 : s.xform(i) : {
                data: Object.assign({}, i),
                error: null
            }
        }
        async function jn(t, e, r, s, n, a) {
            let i = Pn(e, s, n, a),
                o;
            try {
                o = await t(r, Object.assign({}, i))
            } catch (c) {
                throw console.error(c), new ot(Ee(c), 0)
            }
            if (o.ok || await mr(o), s == null ? void 0 : s.noResolveJson) return o;
            try {
                return await o.json()
            } catch (c) {
                await mr(c)
            }
        }

        function se(t) {
            var s;
            let e = null;
            Nn(t) && (e = Object.assign({}, t), t.expires_at || (e.expires_at = gn(t.expires_in)));
            let r = (s = t.user) != null ? s : null;
            return {
                data: {
                    session: e,
                    user: r
                },
                error: null
            }
        }

        function yr(t) {
            let e = se(t);
            return !e.error && t.weak_password && typeof t.weak_password == "object" && Array.isArray(t.weak_password.reasons) && t.weak_password.reasons.length && t.weak_password.message && typeof t.weak_password.message == "string" && t.weak_password.reasons.reduce((r, s) => r && typeof s == "string", !0) && (e.data.weak_password = t.weak_password), e
        }

        function me(t) {
            var e;
            return {
                data: {
                    user: (e = t.user) != null ? e : t
                },
                error: null
            }
        }

        function $n(t) {
            return {
                data: t,
                error: null
            }
        }

        function Ln(t) {
            let {
                action_link: e,
                email_otp: r,
                hashed_token: s,
                redirect_to: n,
                verification_type: a
            } = t, i = h(t, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
            return {
                data: {
                    properties: {
                        action_link: e,
                        email_otp: r,
                        hashed_token: s,
                        redirect_to: n,
                        verification_type: a
                    },
                    user: Object.assign({}, i)
                },
                error: null
            }
        }

        function br(t) {
            return t
        }

        function Nn(t) {
            return !!t.access_token && !!t.refresh_token && !!t.expires_in
        }
        let dt = ["global", "local", "others"];
        var Ot = class {
            constructor({
                url: t = "",
                headers: e = {},
                fetch: r,
                experimental: s
            }) {
                this.url = t, this.headers = e, this.fetch = pr(r), this.experimental = s != null ? s : {}, this.mfa = {
                    listFactors: this._listFactors.bind(this),
                    deleteFactor: this._deleteFactor.bind(this)
                }, this.oauth = {
                    listClients: this._listOAuthClients.bind(this),
                    createClient: this._createOAuthClient.bind(this),
                    getClient: this._getOAuthClient.bind(this),
                    updateClient: this._updateOAuthClient.bind(this),
                    deleteClient: this._deleteOAuthClient.bind(this),
                    regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this)
                }, this.customProviders = {
                    listProviders: this._listCustomProviders.bind(this),
                    createProvider: this._createCustomProvider.bind(this),
                    getProvider: this._getCustomProvider.bind(this),
                    updateProvider: this._updateCustomProvider.bind(this),
                    deleteProvider: this._deleteCustomProvider.bind(this)
                }, this.passkey = {
                    listPasskeys: this._adminListPasskeys.bind(this),
                    deletePasskey: this._adminDeletePasskey.bind(this)
                }
            }
            async signOut(t, e = dt[0]) {
                if (dt.indexOf(e) < 0) throw Error(`@supabase/auth-js: Parameter scope must be one of ${dt.join(", ")}`);
                try {
                    return await A(this.fetch, "POST", `${this.url}/logout?scope=${e}`, {
                        headers: this.headers,
                        jwt: t,
                        noResolveJson: !0
                    }), {
                        data: null,
                        error: null
                    }
                } catch (r) {
                    if (_(r)) return {
                        data: null,
                        error: r
                    };
                    throw r
                }
            }
            async inviteUserByEmail(t, e = {}) {
                try {
                    return await A(this.fetch, "POST", `${this.url}/invite`, {
                        body: {
                            email: t,
                            data: e.data
                        },
                        headers: this.headers,
                        redirectTo: e.redirectTo,
                        xform: me
                    })
                } catch (r) {
                    if (_(r)) return {
                        data: {
                            user: null
                        },
                        error: r
                    };
                    throw r
                }
            }
            async generateLink(t) {
                try {
                    let {
                        options: e
                    } = t, r = h(t, ["options"]), s = Object.assign(Object.assign({}, r), e);
                    return "newEmail" in r && (s.new_email = r == null ? void 0 : r.newEmail, delete s.newEmail), await A(this.fetch, "POST", `${this.url}/admin/generate_link`, {
                        body: s,
                        headers: this.headers,
                        xform: Ln,
                        redirectTo: e == null ? void 0 : e.redirectTo
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: {
                            properties: null,
                            user: null
                        },
                        error: e
                    };
                    throw e
                }
            }
            async createUser(t) {
                try {
                    return await A(this.fetch, "POST", `${this.url}/admin/users`, {
                        body: t,
                        headers: this.headers,
                        xform: me
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: {
                            user: null
                        },
                        error: e
                    };
                    throw e
                }
            }
            async listUsers(t) {
                var e, r, s, n, a, i, o;
                try {
                    let c = {
                            nextPage: null,
                            lastPage: 0,
                            total: 0
                        },
                        u = await A(this.fetch, "GET", `${this.url}/admin/users`, {
                            headers: this.headers,
                            noResolveJson: !0,
                            query: {
                                page: (r = (e = t == null ? void 0 : t.page) == null ? void 0 : e.toString()) != null ? r : "",
                                per_page: (n = (s = t == null ? void 0 : t.perPage) == null ? void 0 : s.toString()) != null ? n : ""
                            },
                            xform: br
                        });
                    if (u.error) throw u.error;
                    let p = await u.json(),
                        f = (a = u.headers.get("x-total-count")) != null ? a : 0,
                        m = (o = (i = u.headers.get("link")) == null ? void 0 : i.split(",")) != null ? o : [];
                    return m.length > 0 && (m.forEach(y => {
                        let S = parseInt(y.split(";")[0].split("=")[1].substring(0, 1)),
                            R = JSON.parse(y.split(";")[1].split("=")[1]);
                        c[`${R}Page`] = S
                    }), c.total = parseInt(f)), {
                        data: Object.assign(Object.assign({}, p), c),
                        error: null
                    }
                } catch (c) {
                    if (_(c)) return {
                        data: {
                            users: []
                        },
                        error: c
                    };
                    throw c
                }
            }
            async getUserById(t) {
                ge(t);
                try {
                    return await A(this.fetch, "GET", `${this.url}/admin/users/${t}`, {
                        headers: this.headers,
                        xform: me
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: {
                            user: null
                        },
                        error: e
                    };
                    throw e
                }
            }
            async updateUserById(t, e) {
                ge(t);
                try {
                    return await A(this.fetch, "PUT", `${this.url}/admin/users/${t}`, {
                        body: e,
                        headers: this.headers,
                        xform: me
                    })
                } catch (r) {
                    if (_(r)) return {
                        data: {
                            user: null
                        },
                        error: r
                    };
                    throw r
                }
            }
            async deleteUser(t, e = !1) {
                ge(t);
                try {
                    return await A(this.fetch, "DELETE", `${this.url}/admin/users/${t}`, {
                        headers: this.headers,
                        body: {
                            should_soft_delete: e
                        },
                        xform: me
                    })
                } catch (r) {
                    if (_(r)) return {
                        data: {
                            user: null
                        },
                        error: r
                    };
                    throw r
                }
            }
            async _listFactors(t) {
                ge(t.userId);
                try {
                    let {
                        data: e,
                        error: r
                    } = await A(this.fetch, "GET", `${this.url}/admin/users/${t.userId}/factors`, {
                        headers: this.headers,
                        xform: s => ({
                            data: {
                                factors: s
                            },
                            error: null
                        })
                    });
                    return {
                        data: e,
                        error: r
                    }
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _deleteFactor(t) {
                ge(t.userId), ge(t.id);
                try {
                    return {
                        data: await A(this.fetch, "DELETE", `${this.url}/admin/users/${t.userId}/factors/${t.id}`, {
                            headers: this.headers
                        }),
                        error: null
                    }
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _listOAuthClients(t) {
                var e, r, s, n, a, i, o;
                try {
                    let c = {
                            nextPage: null,
                            lastPage: 0,
                            total: 0
                        },
                        u = await A(this.fetch, "GET", `${this.url}/admin/oauth/clients`, {
                            headers: this.headers,
                            noResolveJson: !0,
                            query: {
                                page: (r = (e = t == null ? void 0 : t.page) == null ? void 0 : e.toString()) != null ? r : "",
                                per_page: (n = (s = t == null ? void 0 : t.perPage) == null ? void 0 : s.toString()) != null ? n : ""
                            },
                            xform: br
                        });
                    if (u.error) throw u.error;
                    let p = await u.json(),
                        f = (a = u.headers.get("x-total-count")) != null ? a : 0,
                        m = (o = (i = u.headers.get("link")) == null ? void 0 : i.split(",")) != null ? o : [];
                    return m.length > 0 && (m.forEach(y => {
                        let S = parseInt(y.split(";")[0].split("=")[1].substring(0, 1)),
                            R = JSON.parse(y.split(";")[1].split("=")[1]);
                        c[`${R}Page`] = S
                    }), c.total = parseInt(f)), {
                        data: Object.assign(Object.assign({}, p), c),
                        error: null
                    }
                } catch (c) {
                    if (_(c)) return {
                        data: {
                            clients: []
                        },
                        error: c
                    };
                    throw c
                }
            }
            async _createOAuthClient(t) {
                try {
                    return await A(this.fetch, "POST", `${this.url}/admin/oauth/clients`, {
                        body: t,
                        headers: this.headers,
                        xform: e => ({
                            data: e,
                            error: null
                        })
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _getOAuthClient(t) {
                try {
                    return await A(this.fetch, "GET", `${this.url}/admin/oauth/clients/${t}`, {
                        headers: this.headers,
                        xform: e => ({
                            data: e,
                            error: null
                        })
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _updateOAuthClient(t, e) {
                try {
                    return await A(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${t}`, {
                        body: e,
                        headers: this.headers,
                        xform: r => ({
                            data: r,
                            error: null
                        })
                    })
                } catch (r) {
                    if (_(r)) return {
                        data: null,
                        error: r
                    };
                    throw r
                }
            }
            async _deleteOAuthClient(t) {
                try {
                    return await A(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${t}`, {
                        headers: this.headers,
                        noResolveJson: !0
                    }), {
                        data: null,
                        error: null
                    }
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _regenerateOAuthClientSecret(t) {
                try {
                    return await A(this.fetch, "POST", `${this.url}/admin/oauth/clients/${t}/regenerate_secret`, {
                        headers: this.headers,
                        xform: e => ({
                            data: e,
                            error: null
                        })
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _listCustomProviders(t) {
                try {
                    let e = {};
                    return t != null && t.type && (e.type = t.type), await A(this.fetch, "GET", `${this.url}/admin/custom-providers`, {
                        headers: this.headers,
                        query: e,
                        xform: r => {
                            var s;
                            return {
                                data: {
                                    providers: (s = r == null ? void 0 : r.providers) != null ? s : []
                                },
                                error: null
                            }
                        }
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: {
                            providers: []
                        },
                        error: e
                    };
                    throw e
                }
            }
            async _createCustomProvider(t) {
                try {
                    return await A(this.fetch, "POST", `${this.url}/admin/custom-providers`, {
                        body: t,
                        headers: this.headers,
                        xform: e => ({
                            data: e,
                            error: null
                        })
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _getCustomProvider(t) {
                try {
                    return await A(this.fetch, "GET", `${this.url}/admin/custom-providers/${t}`, {
                        headers: this.headers,
                        xform: e => ({
                            data: e,
                            error: null
                        })
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _updateCustomProvider(t, e) {
                try {
                    return await A(this.fetch, "PUT", `${this.url}/admin/custom-providers/${t}`, {
                        body: e,
                        headers: this.headers,
                        xform: r => ({
                            data: r,
                            error: null
                        })
                    })
                } catch (r) {
                    if (_(r)) return {
                        data: null,
                        error: r
                    };
                    throw r
                }
            }
            async _deleteCustomProvider(t) {
                try {
                    return await A(this.fetch, "DELETE", `${this.url}/admin/custom-providers/${t}`, {
                        headers: this.headers,
                        noResolveJson: !0
                    }), {
                        data: null,
                        error: null
                    }
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _adminListPasskeys(t) {
                ae(this.experimental), ge(t.userId);
                try {
                    return await A(this.fetch, "GET", `${this.url}/admin/users/${t.userId}/passkeys`, {
                        headers: this.headers,
                        xform: e => ({
                            data: e,
                            error: null
                        })
                    })
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
            async _adminDeletePasskey(t) {
                ae(this.experimental), ge(t.userId), ge(t.passkeyId);
                try {
                    return await A(this.fetch, "DELETE", `${this.url}/admin/users/${t.userId}/passkeys/${t.passkeyId}`, {
                        headers: this.headers,
                        noResolveJson: !0
                    }), {
                        data: null,
                        error: null
                    }
                } catch (e) {
                    if (_(e)) return {
                        data: null,
                        error: e
                    };
                    throw e
                }
            }
        };

        function wr(t = {}) {
            return {
                getItem: e => t[e] || null,
                setItem: (e, r) => {
                    t[e] = r
                },
                removeItem: e => {
                    delete t[e]
                }
            }
        }
        let ie = {
            debug: !!(globalThis && dr() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
        };
        var Ge = class extends Error {
                constructor(t) {
                    super(t), this.isAcquireTimeout = !0
                }
            },
            Pt = class extends Ge {},
            Bn = class extends Ge {};
        async function vr(t, e, r) {
            ie.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", t, e);
            let s = new globalThis.AbortController,
                n;
            e > 0 && (n = setTimeout(() => {
                s.abort(), ie.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", t)
            }, e)), await Promise.resolve();
            try {
                return await globalThis.navigator.locks.request(t, e === 0 ? {
                    mode: "exclusive",
                    ifAvailable: !0
                } : {
                    mode: "exclusive",
                    signal: s.signal
                }, async a => {
                    if (a) {
                        clearTimeout(n), ie.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", t, a.name);
                        try {
                            return await r()
                        } finally {
                            ie.debug && console.log("@supabase/gotrue-js: navigatorLock: released", t, a.name)
                        }
                    } else {
                        if (e === 0) throw ie.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", t), new Pt(`Acquiring an exclusive Navigator LockManager lock "${t}" immediately failed`);
                        if (ie.debug) try {
                            let i = await globalThis.navigator.locks.query();
                            console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(i, null, "  "))
                        } catch (i) {
                            console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", i)
                        }
                        return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"), clearTimeout(n), await r()
                    }
                })
            } catch (a) {
                if (e > 0 && clearTimeout(n), typeof a == "object" && a && "name" in a && a.name === "AbortError" && e > 0) {
                    if (s.signal.aborted) return ie.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire timeout, recovering by stealing lock", t), console.warn(`@supabase/gotrue-js: Lock "${t}" was not released within ${e}ms. This may indicate an orphaned lock from a component unmount (e.g., React Strict Mode). Forcefully acquiring the lock to recover.`), await Promise.resolve().then(() => globalThis.navigator.locks.request(t, {
                        mode: "exclusive",
                        steal: !0
                    }, async i => {
                        if (i) {
                            ie.debug && console.log("@supabase/gotrue-js: navigatorLock: recovered (stolen)", t, i.name);
                            try {
                                return await r()
                            } finally {
                                ie.debug && console.log("@supabase/gotrue-js: navigatorLock: released (stolen)", t, i.name)
                            }
                        } else return console.warn("@supabase/gotrue-js: Navigator LockManager returned null lock even with steal: true"), await r()
                    }));
                    throw ie.debug && console.log("@supabase/gotrue-js: navigatorLock: lock was stolen by another request", t), new Pt(`Lock "${t}" was released because another request stole it`)
                }
                throw a
            }
        }
        let _r = {};
        async function Un(t, e, r) {
            var i;
            let s = (i = _r[t]) != null ? i : Promise.resolve(),
                n = (async () => {
                    try {
                        return await s, null
                    } catch (o) {
                        return null
                    }
                })(),
                a = (async () => {
                    let o = null;
                    try {
                        let c = e >= 0 ? new Promise((u, p) => {
                            o = setTimeout(() => {
                                console.warn(`@supabase/gotrue-js: Lock "${t}" acquisition timed out after ${e}ms. This may be caused by another operation holding the lock. Consider increasing lockAcquireTimeout or checking for stuck operations.`), p(new Bn(`Acquiring process lock with name "${t}" timed out`))
                            }, e)
                        }) : null;
                        await Promise.race([n, c].filter(u => u)), o !== null && clearTimeout(o)
                    } catch (c) {
                        if (o !== null && clearTimeout(o), c instanceof Ge) throw c
                    }
                    return await r()
                })();
            return _r[t] = (async () => {
                try {
                    return await a
                } catch (o) {
                    if (o instanceof Ge) {
                        try {
                            await s
                        } catch (c) {}
                        return null
                    }
                    throw o
                }
            })(), await a
        }

        function Dn() {
            if (typeof globalThis != "object") try {
                Object.defineProperty(Object.prototype, "__magic__", {
                    get: function() {
                        return this
                    },
                    configurable: !0
                }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__
            } catch (t) {
                typeof self < "u" && (self.globalThis = self)
            }
        }

        function kr(t) {
            if (!/^0x[a-fA-F0-9]{40}$/.test(t)) throw Error(`@supabase/auth-js: Address "${t}" is invalid.`);
            return t.toLowerCase()
        }

        function Mn(t) {
            return parseInt(t, 16)
        }

        function qn(t) {
            let e = new TextEncoder().encode(t);
            return "0x" + Array.from(e, r => r.toString(16).padStart(2, "0")).join("")
        }

        function Fn(t) {
            var R;
            let {
                chainId: e,
                domain: r,
                expirationTime: s,
                issuedAt: n = new Date,
                nonce: a,
                notBefore: i,
                requestId: o,
                resources: c,
                scheme: u,
                uri: p,
                version: f
            } = t;
            if (!Number.isInteger(e)) throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${e}`);
            if (!r) throw Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');
            if (a && a.length < 8) throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a}`);
            if (!p) throw Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');
            if (f !== "1") throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${f}`);
            if ((R = t.statement) != null && R.includes(`
`)) throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${t.statement}`);
            let m = kr(t.address),
                y = `${u?`${u}://${r}`:r} wants you to sign in with your Ethereum account:
${m}

${t.statement?`${t.statement}
`:""}`,
                S = `URI: ${p}
Version: ${f}
Chain ID: ${e}${a?`
Nonce: ${a}`:""}
Issued At: ${n.toISOString()}`;
            if (s && (S += `
Expiration Time: ${s.toISOString()}`), i && (S += `
Not Before: ${i.toISOString()}`), o && (S += `
Request ID: ${o}`), c) {
                let T = `
Resources:`;
                for (let M of c) {
                    if (!M || typeof M != "string") throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${M}`);
                    T += `
- ${M}`
                }
                S += T
            }
            return `${y}
${S}`
        }
        var G = class extends Error {
                constructor({
                    message: t,
                    code: e,
                    cause: r,
                    name: s
                }) {
                    var n;
                    super(t, {
                        cause: r
                    }), this.__isWebAuthnError = !0, this.name = (n = s != null ? s : r instanceof Error ? r.name : void 0) != null ? n : "Unknown Error", this.code = e
                }
                toJSON() {
                    return {
                        name: this.name,
                        message: this.message,
                        code: this.code
                    }
                }
            },
            pt = class extends G {
                constructor(t, e) {
                    super({
                        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
                        cause: e,
                        message: t
                    }), this.name = "WebAuthnUnknownError", this.originalError = e
                }
            };

        function Hn({
            error: t,
            options: e
        }) {
            var s, n, a;
            let {
                publicKey: r
            } = e;
            if (!r) throw Error("options was missing required publicKey property");
            if (t.name === "AbortError") {
                if (e.signal instanceof AbortSignal) return new G({
                    message: "Registration ceremony was sent an abort signal",
                    code: "ERROR_CEREMONY_ABORTED",
                    cause: t
                })
            } else if (t.name === "ConstraintError") {
                if (((s = r.authenticatorSelection) == null ? void 0 : s.requireResidentKey) === !0) return new G({
                    message: "Discoverable credentials were required but no available authenticator supported it",
                    code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
                    cause: t
                });
                if (e.mediation === "conditional" && ((n = r.authenticatorSelection) == null ? void 0 : n.userVerification) === "required") return new G({
                    message: "User verification was required during automatic registration but it could not be performed",
                    code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",
                    cause: t
                });
                if (((a = r.authenticatorSelection) == null ? void 0 : a.userVerification) === "required") return new G({
                    message: "User verification was required but no available authenticator supported it",
                    code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
                    cause: t
                })
            } else {
                if (t.name === "InvalidStateError") return new G({
                    message: "The authenticator was previously registered",
                    code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
                    cause: t
                });
                if (t.name === "NotAllowedError") return new G({
                    message: t.message,
                    code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
                    cause: t
                });
                if (t.name === "NotSupportedError") return r.pubKeyCredParams.filter(i => i.type === "public-key").length === 0 ? new G({
                    message: 'No entry in pubKeyCredParams was of type "public-key"',
                    code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
                    cause: t
                }) : new G({
                    message: "No available authenticator supported any of the specified pubKeyCredParams algorithms",
                    code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
                    cause: t
                });
                if (t.name === "SecurityError") {
                    let i = window.location.hostname;
                    if (Ar(i)) {
                        if (r.rp.id !== i) return new G({
                            message: `The RP ID "${r.rp.id}" is invalid for this domain`,
                            code: "ERROR_INVALID_RP_ID",
                            cause: t
                        })
                    } else return new G({
                        message: `${window.location.hostname} is an invalid domain`,
                        code: "ERROR_INVALID_DOMAIN",
                        cause: t
                    })
                } else if (t.name === "TypeError") {
                    if (r.user.id.byteLength < 1 || r.user.id.byteLength > 64) return new G({
                        message: "User ID was not between 1 and 64 characters",
                        code: "ERROR_INVALID_USER_ID_LENGTH",
                        cause: t
                    })
                } else if (t.name === "UnknownError") return new G({
                    message: "The authenticator was unable to process the specified options, or could not create a new credential",
                    code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
                    cause: t
                })
            }
            return new G({
                message: "a Non-Webauthn related error has occurred",
                code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
                cause: t
            })
        }

        function Wn({
            error: t,
            options: e
        }) {
            let {
                publicKey: r
            } = e;
            if (!r) throw Error("options was missing required publicKey property");
            if (t.name === "AbortError") {
                if (e.signal instanceof AbortSignal) return new G({
                    message: "Authentication ceremony was sent an abort signal",
                    code: "ERROR_CEREMONY_ABORTED",
                    cause: t
                })
            } else {
                if (t.name === "NotAllowedError") return new G({
                    message: t.message,
                    code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
                    cause: t
                });
                if (t.name === "SecurityError") {
                    let s = window.location.hostname;
                    if (Ar(s)) {
                        if (r.rpId !== s) return new G({
                            message: `The RP ID "${r.rpId}" is invalid for this domain`,
                            code: "ERROR_INVALID_RP_ID",
                            cause: t
                        })
                    } else return new G({
                        message: `${window.location.hostname} is an invalid domain`,
                        code: "ERROR_INVALID_DOMAIN",
                        cause: t
                    })
                } else if (t.name === "UnknownError") return new G({
                    message: "The authenticator was unable to process the specified options, or could not create a new assertion signature",
                    code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
                    cause: t
                })
            }
            return new G({
                message: "a Non-Webauthn related error has occurred",
                code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
                cause: t
            })
        }
        let jt = new class {
            createNewAbortSignal() {
                if (this.controller) {
                    let e = Error("Cancelling existing WebAuthn API call for new one");
                    e.name = "AbortError", this.controller.abort(e)
                }
                let t = new AbortController;
                return this.controller = t, t.signal
            }
            cancelCeremony() {
                if (this.controller) {
                    let t = Error("Manually cancelling existing WebAuthn API call");
                    t.name = "AbortError", this.controller.abort(t), this.controller = void 0
                }
            }
        };

        function Er(t) {
            if (!t) throw Error("Credential creation options are required");
            if (typeof PublicKeyCredential < "u" && "parseCreationOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseCreationOptionsFromJSON == "function") return PublicKeyCredential.parseCreationOptionsFromJSON(t);
            let {
                challenge: e,
                user: r,
                excludeCredentials: s
            } = t, n = h(t, ["challenge", "user", "excludeCredentials"]), a = $e(e).buffer, i = Object.assign(Object.assign({}, r), {
                id: $e(r.id).buffer
            }), o = Object.assign(Object.assign({}, n), {
                challenge: a,
                user: i
            });
            if (s && s.length > 0) {
                o.excludeCredentials = Array(s.length);
                for (let c = 0; c < s.length; c++) {
                    let u = s[c];
                    o.excludeCredentials[c] = Object.assign(Object.assign({}, u), {
                        id: $e(u.id).buffer,
                        type: u.type || "public-key",
                        transports: u.transports
                    })
                }
            }
            return o
        }

        function Sr(t) {
            if (!t) throw Error("Credential request options are required");
            if (typeof PublicKeyCredential < "u" && "parseRequestOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseRequestOptionsFromJSON == "function") return PublicKeyCredential.parseRequestOptionsFromJSON(t);
            let {
                challenge: e,
                allowCredentials: r
            } = t, s = h(t, ["challenge", "allowCredentials"]), n = $e(e).buffer, a = Object.assign(Object.assign({}, s), {
                challenge: n
            });
            if (r && r.length > 0) {
                a.allowCredentials = Array(r.length);
                for (let i = 0; i < r.length; i++) {
                    let o = r[i];
                    a.allowCredentials[i] = Object.assign(Object.assign({}, o), {
                        id: $e(o.id).buffer,
                        type: o.type || "public-key",
                        transports: o.transports
                    })
                }
            }
            return a
        }

        function Tr(t) {
            var r;
            if ("toJSON" in t && typeof t.toJSON == "function") return t.toJSON();
            let e = t;
            return {
                id: t.id,
                rawId: t.id,
                response: {
                    attestationObject: ve(new Uint8Array(t.response.attestationObject)),
                    clientDataJSON: ve(new Uint8Array(t.response.clientDataJSON))
                },
                type: "public-key",
                clientExtensionResults: t.getClientExtensionResults(),
                authenticatorAttachment: (r = e.authenticatorAttachment) != null ? r : void 0
            }
        }

        function Rr(t) {
            var n;
            if ("toJSON" in t && typeof t.toJSON == "function") return t.toJSON();
            let e = t,
                r = t.getClientExtensionResults(),
                s = t.response;
            return {
                id: t.id,
                rawId: t.id,
                response: {
                    authenticatorData: ve(new Uint8Array(s.authenticatorData)),
                    clientDataJSON: ve(new Uint8Array(s.clientDataJSON)),
                    signature: ve(new Uint8Array(s.signature)),
                    userHandle: s.userHandle ? ve(new Uint8Array(s.userHandle)) : void 0
                },
                type: "public-key",
                clientExtensionResults: r,
                authenticatorAttachment: (n = e.authenticatorAttachment) != null ? n : void 0
            }
        }

        function Ar(t) {
            return t === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(t)
        }

        function ft() {
            var t, e;
            return !!(Y() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && typeof((t = navigator == null ? void 0 : navigator.credentials) == null ? void 0 : t.create) == "function" && typeof((e = navigator == null ? void 0 : navigator.credentials) == null ? void 0 : e.get) == "function")
        }
        async function Ir(t) {
            try {
                let e = await navigator.credentials.create(t);
                return e ? e instanceof PublicKeyCredential ? {
                    data: e,
                    error: null
                } : {
                    data: null,
                    error: new pt("Browser returned unexpected credential type", e)
                } : {
                    data: null,
                    error: new pt("Empty credential response", e)
                }
            } catch (e) {
                return {
                    data: null,
                    error: Hn({
                        error: e,
                        options: t
                    })
                }
            }
        }
        async function Cr(t) {
            try {
                let e = await navigator.credentials.get(t);
                return e ? e instanceof PublicKeyCredential ? {
                    data: e,
                    error: null
                } : {
                    data: null,
                    error: new pt("Browser returned unexpected credential type", e)
                } : {
                    data: null,
                    error: new pt("Empty credential response", e)
                }
            } catch (e) {
                return {
                    data: null,
                    error: Wn({
                        error: e,
                        options: t
                    })
                }
            }
        }
        let Kn = {
                hints: ["security-key"],
                authenticatorSelection: {
                    authenticatorAttachment: "cross-platform",
                    requireResidentKey: !1,
                    userVerification: "preferred",
                    residentKey: "discouraged"
                },
                attestation: "direct"
            },
            zn = {
                userVerification: "preferred",
                hints: ["security-key"],
                attestation: "direct"
            };

        function gt(...t) {
            let e = n => typeof n == "object" && !!n && !Array.isArray(n),
                r = n => n instanceof ArrayBuffer || ArrayBuffer.isView(n),
                s = {};
            for (let n of t)
                if (n)
                    for (let a in n) {
                        let i = n[a];
                        if (i !== void 0)
                            if (Array.isArray(i)) s[a] = i;
                            else if (r(i)) s[a] = i;
                        else if (e(i)) {
                            let o = s[a];
                            e(o) ? s[a] = gt(o, i) : s[a] = gt(i)
                        } else s[a] = i
                    }
            return s
        }

        function Jn(t, e) {
            return gt(Kn, t, e || {})
        }

        function Gn(t, e) {
            return gt(zn, t, e || {})
        }
        var Vn = class {
            constructor(t) {
                this.client = t, this.enroll = this._enroll.bind(this), this.challenge = this._challenge.bind(this), this.verify = this._verify.bind(this), this.authenticate = this._authenticate.bind(this), this.register = this._register.bind(this)
            }
            async _enroll(t) {
                return this.client.mfa.enroll(Object.assign(Object.assign({}, t), {
                    factorType: "webauthn"
                }))
            }
            async _challenge({
                factorId: t,
                webauthn: e,
                friendlyName: r,
                signal: s
            }, n) {
                var a;
                try {
                    let {
                        data: i,
                        error: o
                    } = await this.client.mfa.challenge({
                        factorId: t,
                        webauthn: e
                    });
                    if (!i) return {
                        data: null,
                        error: o
                    };
                    let c = s != null ? s : jt.createNewAbortSignal();
                    if (i.webauthn.type === "create") {
                        let {
                            user: u
                        } = i.webauthn.credential_options.publicKey;
                        if (!u.name) {
                            let p = r;
                            if (p) u.name = `${u.id}:${p}`;
                            else {
                                let f = (await this.client.getUser()).data.user,
                                    m = ((a = f == null ? void 0 : f.user_metadata) == null ? void 0 : a.name) || (f == null ? void 0 : f.email) || (f == null ? void 0 : f.id) || "User";
                                u.name = `${u.id}:${m}`
                            }
                        }
                        u.displayName || (u.displayName = u.name)
                    }
                    switch (i.webauthn.type) {
                        case "create": {
                            let {
                                data: u,
                                error: p
                            } = await Ir({
                                publicKey: Jn(i.webauthn.credential_options.publicKey, n == null ? void 0 : n.create),
                                signal: c
                            });
                            return u ? {
                                data: {
                                    factorId: t,
                                    challengeId: i.id,
                                    webauthn: {
                                        type: i.webauthn.type,
                                        credential_response: u
                                    }
                                },
                                error: null
                            } : {
                                data: null,
                                error: p
                            }
                        }
                        case "request": {
                            let u = Gn(i.webauthn.credential_options.publicKey, n == null ? void 0 : n.request),
                                {
                                    data: p,
                                    error: f
                                } = await Cr(Object.assign(Object.assign({}, i.webauthn.credential_options), {
                                    publicKey: u,
                                    signal: c
                                }));
                            return p ? {
                                data: {
                                    factorId: t,
                                    challengeId: i.id,
                                    webauthn: {
                                        type: i.webauthn.type,
                                        credential_response: p
                                    }
                                },
                                error: null
                            } : {
                                data: null,
                                error: f
                            }
                        }
                    }
                } catch (i) {
                    return _(i) ? {
                        data: null,
                        error: i
                    } : {
                        data: null,
                        error: new re("Unexpected error in challenge", i)
                    }
                }
            }
            async _verify({
                challengeId: t,
                factorId: e,
                webauthn: r
            }) {
                return this.client.mfa.verify({
                    factorId: e,
                    challengeId: t,
                    webauthn: r
                })
            }
            async _authenticate({
                factorId: t,
                webauthn: {
                    rpId: e = typeof window < "u" ? window.location.hostname : void 0,
                    rpOrigins: r = typeof window < "u" ? [window.location.origin] : void 0,
                    signal: s
                } = {}
            }, n) {
                if (!e) return {
                    data: null,
                    error: new je("rpId is required for WebAuthn authentication")
                };
                try {
                    if (!ft()) return {
                        data: null,
                        error: new re("Browser does not support WebAuthn", null)
                    };
                    let {
                        data: a,
                        error: i
                    } = await this.challenge({
                        factorId: t,
                        webauthn: {
                            rpId: e,
                            rpOrigins: r
                        },
                        signal: s
                    }, {
                        request: n
                    });
                    if (!a) return {
                        data: null,
                        error: i
                    };
                    let {
                        webauthn: o
                    } = a;
                    return this._verify({
                        factorId: t,
                        challengeId: a.challengeId,
                        webauthn: {
                            type: o.type,
                            rpId: e,
                            rpOrigins: r,
                            credential_response: o.credential_response
                        }
                    })
                } catch (a) {
                    return _(a) ? {
                        data: null,
                        error: a
                    } : {
                        data: null,
                        error: new re("Unexpected error in authenticate", a)
                    }
                }
            }
            async _register({
                friendlyName: t,
                webauthn: {
                    rpId: e = typeof window < "u" ? window.location.hostname : void 0,
                    rpOrigins: r = typeof window < "u" ? [window.location.origin] : void 0,
                    signal: s
                } = {}
            }, n) {
                if (!e) return {
                    data: null,
                    error: new je("rpId is required for WebAuthn registration")
                };
                try {
                    if (!ft()) return {
                        data: null,
                        error: new re("Browser does not support WebAuthn", null)
                    };
                    let {
                        data: a,
                        error: i
                    } = await this._enroll({
                        friendlyName: t
                    });
                    if (!a) return await this.client.mfa.listFactors().then(u => {
                        var p;
                        return (p = u.data) == null ? void 0 : p.all.find(f => f.factor_type === "webauthn" && f.friendly_name === t && f.status !== "unverified")
                    }).then(u => u ? this.client.mfa.unenroll({
                        factorId: u == null ? void 0 : u.id
                    }) : void 0), {
                        data: null,
                        error: i
                    };
                    let {
                        data: o,
                        error: c
                    } = await this._challenge({
                        factorId: a.id,
                        friendlyName: a.friendly_name,
                        webauthn: {
                            rpId: e,
                            rpOrigins: r
                        },
                        signal: s
                    }, {
                        create: n
                    });
                    return o ? this._verify({
                        factorId: a.id,
                        challengeId: o.challengeId,
                        webauthn: {
                            rpId: e,
                            rpOrigins: r,
                            type: o.webauthn.type,
                            credential_response: o.webauthn.credential_response
                        }
                    }) : {
                        data: null,
                        error: c
                    }
                } catch (a) {
                    return _(a) ? {
                        data: null,
                        error: a
                    } : {
                        data: null,
                        error: new re("Unexpected error in register", a)
                    }
                }
            }
        };
        Dn();
        let Yn = {
            url: "http://localhost:9999",
            storageKey: "supabase.auth.token",
            autoRefreshToken: !0,
            persistSession: !0,
            detectSessionInUrl: !0,
            headers: an,
            flowType: "implicit",
            debug: !1,
            hasCustomAuthorizationHeader: !1,
            throwOnError: !1,
            lockAcquireTimeout: 5e3,
            skipAutoInitialize: !1,
            experimental: {}
        };
        async function xr(t, e, r) {
            return await r()
        }
        let Be = {};
        var Or = class $t {
            get jwks() {
                var e, r;
                return (r = (e = Be[this.storageKey]) == null ? void 0 : e.jwks) != null ? r : {
                    keys: []
                }
            }
            set jwks(e) {
                Be[this.storageKey] = Object.assign(Object.assign({}, Be[this.storageKey]), {
                    jwks: e
                })
            }
            get jwks_cached_at() {
                var e, r;
                return (r = (e = Be[this.storageKey]) == null ? void 0 : e.cachedAt) != null ? r : -(2 ** 53 - 1)
            }
            set jwks_cached_at(e) {
                Be[this.storageKey] = Object.assign(Object.assign({}, Be[this.storageKey]), {
                    cachedAt: e
                })
            }
            constructor(e) {
                var n, a, i;
                var r;
                this.userStorage = null, this.memoryStorage = null, this.stateChangeEmitters = new Map, this.autoRefreshTicker = null, this.autoRefreshTickTimeout = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = !0, this.hasCustomAuthorizationHeader = !1, this.suppressGetSessionWarning = !1, this.lockAcquired = !1, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log;
                let s = Object.assign(Object.assign({}, Yn), e);
                if (this.storageKey = s.storageKey, this.instanceID = (n = $t.nextInstanceID[this.storageKey]) != null ? n : 0, $t.nextInstanceID[this.storageKey] = this.instanceID + 1, this.logDebugMessages = !!s.debug, typeof s.debug == "function" && (this.logger = s.debug), this.instanceID > 0 && Y()) {
                    let o = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
                    console.warn(o), this.logDebugMessages && console.trace(o)
                }
                if (this.persistSession = s.persistSession, this.autoRefreshToken = s.autoRefreshToken, this.experimental = (a = s.experimental) != null ? a : {}, this.admin = new Ot({
                        url: s.url,
                        headers: s.headers,
                        fetch: s.fetch,
                        experimental: this.experimental
                    }), this.url = s.url, this.headers = s.headers, this.fetch = pr(s.fetch), this.lock = s.lock || xr, this.detectSessionInUrl = s.detectSessionInUrl, this.flowType = s.flowType, this.hasCustomAuthorizationHeader = s.hasCustomAuthorizationHeader, this.throwOnError = s.throwOnError, this.lockAcquireTimeout = s.lockAcquireTimeout, s.lock ? this.lock = s.lock : this.persistSession && Y() && ((i = globalThis == null ? void 0 : globalThis.navigator) != null && i.locks) ? this.lock = vr : this.lock = xr, this.jwks || (this.jwks = {
                        keys: []
                    }, this.jwks_cached_at = -(2 ** 53 - 1)), this.mfa = {
                        verify: this._verify.bind(this),
                        enroll: this._enroll.bind(this),
                        unenroll: this._unenroll.bind(this),
                        challenge: this._challenge.bind(this),
                        listFactors: this._listFactors.bind(this),
                        challengeAndVerify: this._challengeAndVerify.bind(this),
                        getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
                        webauthn: new Vn(this)
                    }, this.oauth = {
                        getAuthorizationDetails: this._getAuthorizationDetails.bind(this),
                        approveAuthorization: this._approveAuthorization.bind(this),
                        denyAuthorization: this._denyAuthorization.bind(this),
                        listGrants: this._listOAuthGrants.bind(this),
                        revokeGrant: this._revokeOAuthGrant.bind(this)
                    }, this.passkey = {
                        startRegistration: this._startPasskeyRegistration.bind(this),
                        verifyRegistration: this._verifyPasskeyRegistration.bind(this),
                        startAuthentication: this._startPasskeyAuthentication.bind(this),
                        verifyAuthentication: this._verifyPasskeyAuthentication.bind(this),
                        list: this._listPasskeys.bind(this),
                        update: this._updatePasskey.bind(this),
                        delete: this._deletePasskey.bind(this)
                    }, this.persistSession ? (s.storage ? this.storage = s.storage : dr() ? this.storage = globalThis.localStorage : (this.memoryStorage = {}, this.storage = wr(this.memoryStorage)), s.userStorage && (this.userStorage = s.userStorage)) : (this.memoryStorage = {}, this.storage = wr(this.memoryStorage)), Y() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
                    try {
                        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey)
                    } catch (o) {
                        console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", o)
                    }(r = this.broadcastChannel) == null || r.addEventListener("message", async o => {
                        this._debug("received broadcast notification from other tab or client", o);
                        try {
                            await this._notifyAllSubscribers(o.data.event, o.data.session, !1)
                        } catch (c) {
                            this._debug("#broadcastChannel", "error", c)
                        }
                    })
                }
                s.skipAutoInitialize || this.initialize().catch(o => {
                    this._debug("#initialize()", "error", o)
                })
            }
            isThrowOnErrorEnabled() {
                return this.throwOnError
            }
            _returnResult(e) {
                if (this.throwOnError && e && e.error) throw e.error;
                return e
            }
            _logPrefix() {
                return `GoTrueClient@${this.storageKey}:${this.instanceID} (${rr}) ${new Date().toISOString()}`
            }
            _debug(...e) {
                return this.logDebugMessages && this.logger(this._logPrefix(), ...e), this
            }
            async initialize() {
                return this.initializePromise || (this.initializePromise = (async () => await this._acquireLock(this.lockAcquireTimeout, async () => await this._initialize()))()), await this.initializePromise
            }
            async _initialize() {
                var e;
                try {
                    let r = {},
                        s = "none";
                    if (Y() && (r = yn(window.location.href), this._isImplicitGrantCallback(r) ? s = "implicit" : await this._isPKCECallback(r) && (s = "pkce")), Y() && this.detectSessionInUrl && s !== "none") {
                        let {
                            data: n,
                            error: a
                        } = await this._getSessionFromURL(r, s);
                        if (a) {
                            if (this._debug("#_initialize()", "error detecting session from URL", a), ir(a)) {
                                let c = (e = a.details) == null ? void 0 : e.code;
                                if (c === "identity_already_exists" || c === "identity_not_found" || c === "single_identity_not_deletable") return {
                                    error: a
                                }
                            }
                            return {
                                error: a
                            }
                        }
                        let {
                            session: i,
                            redirectType: o
                        } = n;
                        return this._debug("#_initialize()", "detected session in URL", i, "redirect type", o), await this._saveSession(i), setTimeout(async () => {
                            o === "recovery" ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", i) : await this._notifyAllSubscribers("SIGNED_IN", i)
                        }, 0), {
                            error: null
                        }
                    }
                    return await this._recoverAndRefresh(), {
                        error: null
                    }
                } catch (r) {
                    return _(r) ? this._returnResult({
                        error: r
                    }) : this._returnResult({
                        error: new re("Unexpected error during initialization", r)
                    })
                } finally {
                    await this._handleVisibilityChange(), this._debug("#_initialize()", "end")
                }
            }
            async signInAnonymously(e) {
                var r, s, n;
                try {
                    let {
                        data: a,
                        error: i
                    } = await A(this.fetch, "POST", `${this.url}/signup`, {
                        headers: this.headers,
                        body: {
                            data: (s = (r = e == null ? void 0 : e.options) == null ? void 0 : r.data) != null ? s : {},
                            gotrue_meta_security: {
                                captcha_token: (n = e == null ? void 0 : e.options) == null ? void 0 : n.captchaToken
                            }
                        },
                        xform: se
                    });
                    if (i || !a) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: i
                    });
                    let o = a.session,
                        c = a.user;
                    return a.session && (await this._saveSession(a.session), await this._notifyAllSubscribers("SIGNED_IN", o)), this._returnResult({
                        data: {
                            user: c,
                            session: o
                        },
                        error: null
                    })
                } catch (a) {
                    if (_(a)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: a
                    });
                    throw a
                }
            }
            async signUp(e) {
                var r, s, n;
                try {
                    let a;
                    if ("email" in e) {
                        let {
                            email: p,
                            password: f,
                            options: m
                        } = e, y = null, S = null;
                        this.flowType === "pkce" && ([y, S] = await Ne(this.storage, this.storageKey)), a = await A(this.fetch, "POST", `${this.url}/signup`, {
                            headers: this.headers,
                            redirectTo: m == null ? void 0 : m.emailRedirectTo,
                            body: {
                                email: p,
                                password: f,
                                data: (r = m == null ? void 0 : m.data) != null ? r : {},
                                gotrue_meta_security: {
                                    captcha_token: m == null ? void 0 : m.captchaToken
                                },
                                code_challenge: y,
                                code_challenge_method: S
                            },
                            xform: se
                        })
                    } else if ("phone" in e) {
                        let {
                            phone: p,
                            password: f,
                            options: m
                        } = e;
                        a = await A(this.fetch, "POST", `${this.url}/signup`, {
                            headers: this.headers,
                            body: {
                                phone: p,
                                password: f,
                                data: (s = m == null ? void 0 : m.data) != null ? s : {},
                                channel: (n = m == null ? void 0 : m.channel) != null ? n : "sms",
                                gotrue_meta_security: {
                                    captcha_token: m == null ? void 0 : m.captchaToken
                                }
                            },
                            xform: se
                        })
                    } else throw new ze("You must provide either an email or phone number and a password");
                    let {
                        data: i,
                        error: o
                    } = a;
                    if (o || !i) return await X(this.storage, `${this.storageKey}-code-verifier`), this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: o
                    });
                    let c = i.session,
                        u = i.user;
                    return i.session && (await this._saveSession(i.session), await this._notifyAllSubscribers("SIGNED_IN", c)), this._returnResult({
                        data: {
                            user: u,
                            session: c
                        },
                        error: null
                    })
                } catch (a) {
                    if (await X(this.storage, `${this.storageKey}-code-verifier`), _(a)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: a
                    });
                    throw a
                }
            }
            async signInWithPassword(e) {
                try {
                    let r;
                    if ("email" in e) {
                        let {
                            email: a,
                            password: i,
                            options: o
                        } = e;
                        r = await A(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
                            headers: this.headers,
                            body: {
                                email: a,
                                password: i,
                                gotrue_meta_security: {
                                    captcha_token: o == null ? void 0 : o.captchaToken
                                }
                            },
                            xform: yr
                        })
                    } else if ("phone" in e) {
                        let {
                            phone: a,
                            password: i,
                            options: o
                        } = e;
                        r = await A(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
                            headers: this.headers,
                            body: {
                                phone: a,
                                password: i,
                                gotrue_meta_security: {
                                    captcha_token: o == null ? void 0 : o.captchaToken
                                }
                            },
                            xform: yr
                        })
                    } else throw new ze("You must provide either an email or phone number and a password");
                    let {
                        data: s,
                        error: n
                    } = r;
                    if (n) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: n
                    });
                    if (!s || !s.session || !s.user) {
                        let a = new we;
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: a
                        })
                    }
                    return s.session && (await this._saveSession(s.session), await this._notifyAllSubscribers("SIGNED_IN", s.session)), this._returnResult({
                        data: Object.assign({
                            user: s.user,
                            session: s.session
                        }, s.weak_password ? {
                            weakPassword: s.weak_password
                        } : null),
                        error: n
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: r
                    });
                    throw r
                }
            }
            async signInWithOAuth(e) {
                var r, s, n, a;
                return await this._handleProviderSignIn(e.provider, {
                    redirectTo: (r = e.options) == null ? void 0 : r.redirectTo,
                    scopes: (s = e.options) == null ? void 0 : s.scopes,
                    queryParams: (n = e.options) == null ? void 0 : n.queryParams,
                    skipBrowserRedirect: (a = e.options) == null ? void 0 : a.skipBrowserRedirect
                })
            }
            async exchangeCodeForSession(e) {
                return await this.initializePromise, this._acquireLock(this.lockAcquireTimeout, async () => this._exchangeCodeForSession(e))
            }
            async signInWithWeb3(e) {
                let {
                    chain: r
                } = e;
                switch (r) {
                    case "ethereum":
                        return await this.signInWithEthereum(e);
                    case "solana":
                        return await this.signInWithSolana(e);
                    default:
                        throw Error(`@supabase/auth-js: Unsupported chain "${r}"`)
                }
            }
            async signInWithEthereum(e) {
                var n, a, i, o, c, u, p, f, m, y, S;
                let r, s;
                if ("message" in e) r = e.message, s = e.signature;
                else {
                    let {
                        chain: R,
                        wallet: T,
                        statement: M,
                        options: C
                    } = e, j;
                    if (Y())
                        if (typeof T == "object") j = T;
                        else {
                            let Se = window;
                            if ("ethereum" in Se && typeof Se.ethereum == "object" && "request" in Se.ethereum && typeof Se.ethereum.request == "function") j = Se.ethereum;
                            else throw Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.")
                        }
                    else {
                        if (typeof T != "object" || !(C != null && C.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
                        j = T
                    }
                    let K = new URL((n = C == null ? void 0 : C.url) != null ? n : window.location.href),
                        oe = await j.request({
                            method: "eth_requestAccounts"
                        }).then(Se => Se).catch(() => {
                            throw Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")
                        });
                    if (!oe || oe.length === 0) throw Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");
                    let W = kr(oe[0]),
                        Q = (a = C == null ? void 0 : C.signInWithEthereum) == null ? void 0 : a.chainId;
                    Q || (Q = Mn(await j.request({
                        method: "eth_chainId"
                    }))), r = Fn({
                        domain: K.host,
                        address: W,
                        statement: M,
                        uri: K.href,
                        version: "1",
                        chainId: Q,
                        nonce: (i = C == null ? void 0 : C.signInWithEthereum) == null ? void 0 : i.nonce,
                        issuedAt: (c = (o = C == null ? void 0 : C.signInWithEthereum) == null ? void 0 : o.issuedAt) != null ? c : new Date,
                        expirationTime: (u = C == null ? void 0 : C.signInWithEthereum) == null ? void 0 : u.expirationTime,
                        notBefore: (p = C == null ? void 0 : C.signInWithEthereum) == null ? void 0 : p.notBefore,
                        requestId: (f = C == null ? void 0 : C.signInWithEthereum) == null ? void 0 : f.requestId,
                        resources: (m = C == null ? void 0 : C.signInWithEthereum) == null ? void 0 : m.resources
                    }), s = await j.request({
                        method: "personal_sign",
                        params: [qn(r), W]
                    })
                }
                try {
                    let {
                        data: R,
                        error: T
                    } = await A(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
                        headers: this.headers,
                        body: Object.assign({
                            chain: "ethereum",
                            message: r,
                            signature: s
                        }, (y = e.options) != null && y.captchaToken ? {
                            gotrue_meta_security: {
                                captcha_token: (S = e.options) == null ? void 0 : S.captchaToken
                            }
                        } : null),
                        xform: se
                    });
                    if (T) throw T;
                    if (!R || !R.session || !R.user) {
                        let M = new we;
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: M
                        })
                    }
                    return R.session && (await this._saveSession(R.session), await this._notifyAllSubscribers("SIGNED_IN", R.session)), this._returnResult({
                        data: Object.assign({}, R),
                        error: T
                    })
                } catch (R) {
                    if (_(R)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: R
                    });
                    throw R
                }
            }
            async signInWithSolana(e) {
                var n, a, i, o, c, u, p, f, m, y, S, R;
                let r, s;
                if ("message" in e) r = e.message, s = e.signature;
                else {
                    let {
                        chain: T,
                        wallet: M,
                        statement: C,
                        options: j
                    } = e, K;
                    if (Y())
                        if (typeof M == "object") K = M;
                        else {
                            let W = window;
                            if ("solana" in W && typeof W.solana == "object" && ("signIn" in W.solana && typeof W.solana.signIn == "function" || "signMessage" in W.solana && typeof W.solana.signMessage == "function")) K = W.solana;
                            else throw Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.")
                        }
                    else {
                        if (typeof M != "object" || !(j != null && j.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
                        K = M
                    }
                    let oe = new URL((n = j == null ? void 0 : j.url) != null ? n : window.location.href);
                    if ("signIn" in K && K.signIn) {
                        let W = await K.signIn(Object.assign(Object.assign(Object.assign({
                                issuedAt: new Date().toISOString()
                            }, j == null ? void 0 : j.signInWithSolana), {
                                version: "1",
                                domain: oe.host,
                                uri: oe.href
                            }), C ? {
                                statement: C
                            } : null)),
                            Q;
                        if (Array.isArray(W) && W[0] && typeof W[0] == "object") Q = W[0];
                        else if (W && typeof W == "object" && "signedMessage" in W && "signature" in W) Q = W;
                        else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
                        if ("signedMessage" in Q && "signature" in Q && (typeof Q.signedMessage == "string" || Q.signedMessage instanceof Uint8Array) && Q.signature instanceof Uint8Array) r = typeof Q.signedMessage == "string" ? Q.signedMessage : new TextDecoder().decode(Q.signedMessage), s = Q.signature;
                        else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields")
                    } else {
                        if (!("signMessage" in K) || typeof K.signMessage != "function" || !("publicKey" in K) || typeof K != "object" || !K.publicKey || !("toBase58" in K.publicKey) || typeof K.publicKey.toBase58 != "function") throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
                        r = [`${oe.host} wants you to sign in with your Solana account:`, K.publicKey.toBase58(), ...C ? ["", C, ""] : [""], "Version: 1", `URI: ${oe.href}`, `Issued At: ${(i=(a=j==null?void 0:j.signInWithSolana)==null?void 0:a.issuedAt)!=null?i:new Date().toISOString()}`, ...(o = j == null ? void 0 : j.signInWithSolana) != null && o.notBefore ? [`Not Before: ${j.signInWithSolana.notBefore}`] : [], ...(c = j == null ? void 0 : j.signInWithSolana) != null && c.expirationTime ? [`Expiration Time: ${j.signInWithSolana.expirationTime}`] : [], ...(u = j == null ? void 0 : j.signInWithSolana) != null && u.chainId ? [`Chain ID: ${j.signInWithSolana.chainId}`] : [], ...(p = j == null ? void 0 : j.signInWithSolana) != null && p.nonce ? [`Nonce: ${j.signInWithSolana.nonce}`] : [], ...(f = j == null ? void 0 : j.signInWithSolana) != null && f.requestId ? [`Request ID: ${j.signInWithSolana.requestId}`] : [], ...(y = (m = j == null ? void 0 : j.signInWithSolana) == null ? void 0 : m.resources) != null && y.length ? ["Resources", ...j.signInWithSolana.resources.map(Q => `- ${Q}`)] : []].join(`
`);
                        let W = await K.signMessage(new TextEncoder().encode(r), "utf8");
                        if (!W || !(W instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
                        s = W
                    }
                }
                try {
                    let {
                        data: T,
                        error: M
                    } = await A(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
                        headers: this.headers,
                        body: Object.assign({
                            chain: "solana",
                            message: r,
                            signature: ve(s)
                        }, (S = e.options) != null && S.captchaToken ? {
                            gotrue_meta_security: {
                                captcha_token: (R = e.options) == null ? void 0 : R.captchaToken
                            }
                        } : null),
                        xform: se
                    });
                    if (M) throw M;
                    if (!T || !T.session || !T.user) {
                        let C = new we;
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: C
                        })
                    }
                    return T.session && (await this._saveSession(T.session), await this._notifyAllSubscribers("SIGNED_IN", T.session)), this._returnResult({
                        data: Object.assign({}, T),
                        error: M
                    })
                } catch (T) {
                    if (_(T)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: T
                    });
                    throw T
                }
            }
            async _exchangeCodeForSession(e) {
                var n;
                let [r, s] = ((n = await ke(this.storage, `${this.storageKey}-code-verifier`)) != null ? n : "").split("/");
                try {
                    if (!r && this.flowType === "pkce") throw new or;
                    let {
                        data: a,
                        error: i
                    } = await A(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
                        headers: this.headers,
                        body: {
                            auth_code: e,
                            code_verifier: r
                        },
                        xform: se
                    });
                    if (await X(this.storage, `${this.storageKey}-code-verifier`), i) throw i;
                    if (!a || !a.session || !a.user) {
                        let o = new we;
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null,
                                redirectType: null
                            },
                            error: o
                        })
                    }
                    return a.session && (await this._saveSession(a.session), await this._notifyAllSubscribers(s === "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", a.session)), this._returnResult({
                        data: Object.assign(Object.assign({}, a), {
                            redirectType: s != null ? s : null
                        }),
                        error: i
                    })
                } catch (a) {
                    if (await X(this.storage, `${this.storageKey}-code-verifier`), _(a)) return this._returnResult({
                        data: {
                            user: null,
                            session: null,
                            redirectType: null
                        },
                        error: a
                    });
                    throw a
                }
            }
            async signInWithIdToken(e) {
                try {
                    let {
                        options: r,
                        provider: s,
                        token: n,
                        access_token: a,
                        nonce: i
                    } = e, {
                        data: o,
                        error: c
                    } = await A(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
                        headers: this.headers,
                        body: {
                            provider: s,
                            id_token: n,
                            access_token: a,
                            nonce: i,
                            gotrue_meta_security: {
                                captcha_token: r == null ? void 0 : r.captchaToken
                            }
                        },
                        xform: se
                    });
                    if (c) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: c
                    });
                    if (!o || !o.session || !o.user) {
                        let u = new we;
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: u
                        })
                    }
                    return o.session && (await this._saveSession(o.session), await this._notifyAllSubscribers("SIGNED_IN", o.session)), this._returnResult({
                        data: o,
                        error: c
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: r
                    });
                    throw r
                }
            }
            async signInWithOtp(e) {
                var r, s, n, a, i;
                try {
                    if ("email" in e) {
                        let {
                            email: o,
                            options: c
                        } = e, u = null, p = null;
                        this.flowType === "pkce" && ([u, p] = await Ne(this.storage, this.storageKey));
                        let {
                            error: f
                        } = await A(this.fetch, "POST", `${this.url}/otp`, {
                            headers: this.headers,
                            body: {
                                email: o,
                                data: (r = c == null ? void 0 : c.data) != null ? r : {},
                                create_user: (s = c == null ? void 0 : c.shouldCreateUser) != null ? s : !0,
                                gotrue_meta_security: {
                                    captcha_token: c == null ? void 0 : c.captchaToken
                                },
                                code_challenge: u,
                                code_challenge_method: p
                            },
                            redirectTo: c == null ? void 0 : c.emailRedirectTo
                        });
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: f
                        })
                    }
                    if ("phone" in e) {
                        let {
                            phone: o,
                            options: c
                        } = e, {
                            data: u,
                            error: p
                        } = await A(this.fetch, "POST", `${this.url}/otp`, {
                            headers: this.headers,
                            body: {
                                phone: o,
                                data: (n = c == null ? void 0 : c.data) != null ? n : {},
                                create_user: (a = c == null ? void 0 : c.shouldCreateUser) != null ? a : !0,
                                gotrue_meta_security: {
                                    captcha_token: c == null ? void 0 : c.captchaToken
                                },
                                channel: (i = c == null ? void 0 : c.channel) != null ? i : "sms"
                            }
                        });
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null,
                                messageId: u == null ? void 0 : u.message_id
                            },
                            error: p
                        })
                    }
                    throw new ze("You must provide either an email or phone number.")
                } catch (o) {
                    if (await X(this.storage, `${this.storageKey}-code-verifier`), _(o)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: o
                    });
                    throw o
                }
            }
            async verifyOtp(e) {
                var r, s;
                try {
                    let n, a;
                    "options" in e && (n = (r = e.options) == null ? void 0 : r.redirectTo, a = (s = e.options) == null ? void 0 : s.captchaToken);
                    let {
                        data: i,
                        error: o
                    } = await A(this.fetch, "POST", `${this.url}/verify`, {
                        headers: this.headers,
                        body: Object.assign(Object.assign({}, e), {
                            gotrue_meta_security: {
                                captcha_token: a
                            }
                        }),
                        redirectTo: n,
                        xform: se
                    });
                    if (o) throw o;
                    if (!i) throw Error("An error occurred on token verification.");
                    let c = i.session,
                        u = i.user;
                    return c != null && c.access_token && (await this._saveSession(c), await this._notifyAllSubscribers(e.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", c)), this._returnResult({
                        data: {
                            user: u,
                            session: c
                        },
                        error: null
                    })
                } catch (n) {
                    if (_(n)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: n
                    });
                    throw n
                }
            }
            async signInWithSSO(e) {
                var r, s, n, a, i;
                try {
                    let o = null,
                        c = null;
                    this.flowType === "pkce" && ([o, c] = await Ne(this.storage, this.storageKey));
                    let u = await A(this.fetch, "POST", `${this.url}/sso`, {
                        body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e ? {
                            provider_id: e.providerId
                        } : null), "domain" in e ? {
                            domain: e.domain
                        } : null), {
                            redirect_to: (s = (r = e.options) == null ? void 0 : r.redirectTo) != null ? s : void 0
                        }), (n = e == null ? void 0 : e.options) != null && n.captchaToken ? {
                            gotrue_meta_security: {
                                captcha_token: e.options.captchaToken
                            }
                        } : null), {
                            skip_http_redirect: !0,
                            code_challenge: o,
                            code_challenge_method: c
                        }),
                        headers: this.headers,
                        xform: $n
                    });
                    return (a = u.data) != null && a.url && Y() && !((i = e.options) != null && i.skipBrowserRedirect) && window.location.assign(u.data.url), this._returnResult(u)
                } catch (o) {
                    if (await X(this.storage, `${this.storageKey}-code-verifier`), _(o)) return this._returnResult({
                        data: null,
                        error: o
                    });
                    throw o
                }
            }
            async reauthenticate() {
                return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._reauthenticate())
            }
            async _reauthenticate() {
                try {
                    return await this._useSession(async e => {
                        let {
                            data: {
                                session: r
                            },
                            error: s
                        } = e;
                        if (s) throw s;
                        if (!r) throw new V;
                        let {
                            error: n
                        } = await A(this.fetch, "GET", `${this.url}/reauthenticate`, {
                            headers: this.headers,
                            jwt: r.access_token
                        });
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: n
                        })
                    })
                } catch (e) {
                    if (_(e)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: e
                    });
                    throw e
                }
            }
            async resend(e) {
                try {
                    let r = `${this.url}/resend`;
                    if ("email" in e) {
                        let {
                            email: s,
                            type: n,
                            options: a
                        } = e, {
                            error: i
                        } = await A(this.fetch, "POST", r, {
                            headers: this.headers,
                            body: {
                                email: s,
                                type: n,
                                gotrue_meta_security: {
                                    captcha_token: a == null ? void 0 : a.captchaToken
                                }
                            },
                            redirectTo: a == null ? void 0 : a.emailRedirectTo
                        });
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: i
                        })
                    } else if ("phone" in e) {
                        let {
                            phone: s,
                            type: n,
                            options: a
                        } = e, {
                            data: i,
                            error: o
                        } = await A(this.fetch, "POST", r, {
                            headers: this.headers,
                            body: {
                                phone: s,
                                type: n,
                                gotrue_meta_security: {
                                    captcha_token: a == null ? void 0 : a.captchaToken
                                }
                            }
                        });
                        return this._returnResult({
                            data: {
                                user: null,
                                session: null,
                                messageId: i == null ? void 0 : i.message_id
                            },
                            error: o
                        })
                    }
                    throw new ze("You must provide either an email or phone number and a type")
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: r
                    });
                    throw r
                }
            }
            async getSession() {
                return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => this._useSession(async e => e))
            }
            async _acquireLock(e, r) {
                this._debug("#_acquireLock", "begin", e);
                try {
                    if (this.lockAcquired) {
                        let s = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(),
                            n = (async () => (await s, await r()))();
                        return this.pendingInLock.push((async () => {
                            try {
                                await n
                            } catch (a) {}
                        })()), n
                    }
                    return await this.lock(`lock:${this.storageKey}`, e, async () => {
                        this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
                        try {
                            this.lockAcquired = !0;
                            let s = r();
                            for (this.pendingInLock.push((async () => {
                                    try {
                                        await s
                                    } catch (n) {}
                                })()), await s; this.pendingInLock.length;) {
                                let n = [...this.pendingInLock];
                                await Promise.all(n), this.pendingInLock.splice(0, n.length)
                            }
                            return await s
                        } finally {
                            this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = !1
                        }
                    })
                } finally {
                    this._debug("#_acquireLock", "end")
                }
            }
            async _useSession(e) {
                this._debug("#_useSession", "begin");
                try {
                    return await e(await this.__loadSession())
                } finally {
                    this._debug("#_useSession", "end")
                }
            }
            async __loadSession() {
                this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
                try {
                    let e = null,
                        r = await ke(this.storage, this.storageKey);
                    if (this._debug("#getSession()", "session from storage", r), r !== null && (this._isValidSession(r) ? e = r : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !e) return {
                        data: {
                            session: null
                        },
                        error: null
                    };
                    let s = e.expires_at ? e.expires_at * 1e3 - Date.now() < Rt : !1;
                    if (this._debug("#__loadSession()", `session has${s?"":" not"} expired`, "expires_at", e.expires_at), !s) {
                        if (this.userStorage) {
                            let i = await ke(this.userStorage, this.storageKey + "-user");
                            i != null && i.user ? e.user = i.user : e.user = xt()
                        }
                        if (this.storage.isServer && e.user && !e.user.__isUserNotAvailableProxy) {
                            let i = {
                                value: this.suppressGetSessionWarning
                            };
                            e.user = xn(e.user, i), i.value && (this.suppressGetSessionWarning = !0)
                        }
                        return {
                            data: {
                                session: e
                            },
                            error: null
                        }
                    }
                    let {
                        data: n,
                        error: a
                    } = await this._callRefreshToken(e.refresh_token);
                    return a ? this._returnResult({
                        data: {
                            session: null
                        },
                        error: a
                    }) : this._returnResult({
                        data: {
                            session: n
                        },
                        error: null
                    })
                } finally {
                    this._debug("#__loadSession()", "end")
                }
            }
            async getUser(e) {
                if (e) return await this._getUser(e);
                await this.initializePromise;
                let r = await this._acquireLock(this.lockAcquireTimeout, async () => await this._getUser());
                return r.data.user && (this.suppressGetSessionWarning = !0), r
            }
            async _getUser(e) {
                try {
                    return e ? await A(this.fetch, "GET", `${this.url}/user`, {
                        headers: this.headers,
                        jwt: e,
                        xform: me
                    }) : await this._useSession(async r => {
                        var a, i, o;
                        let {
                            data: s,
                            error: n
                        } = r;
                        if (n) throw n;
                        return !((a = s.session) != null && a.access_token) && !this.hasCustomAuthorizationHeader ? {
                            data: {
                                user: null
                            },
                            error: new V
                        } : await A(this.fetch, "GET", `${this.url}/user`, {
                            headers: this.headers,
                            jwt: (o = (i = s.session) == null ? void 0 : i.access_token) != null ? o : void 0,
                            xform: me
                        })
                    })
                } catch (r) {
                    if (_(r)) return Ke(r) && (await this._removeSession(), await X(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({
                        data: {
                            user: null
                        },
                        error: r
                    });
                    throw r
                }
            }
            async updateUser(e, r = {}) {
                return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._updateUser(e, r))
            }
            async _updateUser(e, r = {}) {
                try {
                    return await this._useSession(async s => {
                        let {
                            data: n,
                            error: a
                        } = s;
                        if (a) throw a;
                        if (!n.session) throw new V;
                        let i = n.session,
                            o = null,
                            c = null;
                        this.flowType === "pkce" && e.email != null && ([o, c] = await Ne(this.storage, this.storageKey));
                        let {
                            data: u,
                            error: p
                        } = await A(this.fetch, "PUT", `${this.url}/user`, {
                            headers: this.headers,
                            redirectTo: r == null ? void 0 : r.emailRedirectTo,
                            body: Object.assign(Object.assign({}, e), {
                                code_challenge: o,
                                code_challenge_method: c
                            }),
                            jwt: i.access_token,
                            xform: me
                        });
                        if (p) throw p;
                        return i.user = u.user, await this._saveSession(i), await this._notifyAllSubscribers("USER_UPDATED", i), this._returnResult({
                            data: {
                                user: i.user
                            },
                            error: null
                        })
                    })
                } catch (s) {
                    if (await X(this.storage, `${this.storageKey}-code-verifier`), _(s)) return this._returnResult({
                        data: {
                            user: null
                        },
                        error: s
                    });
                    throw s
                }
            }
            async setSession(e) {
                return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._setSession(e))
            }
            async _setSession(e) {
                try {
                    if (!e.access_token || !e.refresh_token) throw new V;
                    let r = Date.now() / 1e3,
                        s = r,
                        n = !0,
                        a = null,
                        {
                            payload: i
                        } = ht(e.access_token);
                    if (i.exp && (s = i.exp, n = s <= r), n) {
                        let {
                            data: o,
                            error: c
                        } = await this._callRefreshToken(e.refresh_token);
                        if (c) return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: c
                        });
                        if (!o) return {
                            data: {
                                user: null,
                                session: null
                            },
                            error: null
                        };
                        a = o
                    } else {
                        let {
                            data: o,
                            error: c
                        } = await this._getUser(e.access_token);
                        if (c) return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: c
                        });
                        a = {
                            access_token: e.access_token,
                            refresh_token: e.refresh_token,
                            user: o.user,
                            token_type: "bearer",
                            expires_in: s - r,
                            expires_at: s
                        }, await this._saveSession(a), await this._notifyAllSubscribers("SIGNED_IN", a)
                    }
                    return this._returnResult({
                        data: {
                            user: a.user,
                            session: a
                        },
                        error: null
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: {
                            session: null,
                            user: null
                        },
                        error: r
                    });
                    throw r
                }
            }
            async refreshSession(e) {
                return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._refreshSession(e))
            }
            async _refreshSession(e) {
                try {
                    return await this._useSession(async r => {
                        var a;
                        if (!e) {
                            let {
                                data: i,
                                error: o
                            } = r;
                            if (o) throw o;
                            e = (a = i.session) != null ? a : void 0
                        }
                        if (!(e != null && e.refresh_token)) throw new V;
                        let {
                            data: s,
                            error: n
                        } = await this._callRefreshToken(e.refresh_token);
                        return n ? this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: n
                        }) : s ? this._returnResult({
                            data: {
                                user: s.user,
                                session: s
                            },
                            error: null
                        }) : this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: null
                        })
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: {
                            user: null,
                            session: null
                        },
                        error: r
                    });
                    throw r
                }
            }
            async _getSessionFromURL(e, r) {
                var s;
                try {
                    if (!Y()) throw new Je("No browser detected.");
                    if (e.error || e.error_description || e.error_code) throw new Je(e.error_description || "Error in URL with unspecified error_description", {
                        error: e.error || "unspecified_error",
                        code: e.error_code || "unspecified_code"
                    });
                    switch (r) {
                        case "implicit":
                            if (this.flowType === "pkce") throw new It("Not a valid PKCE flow url.");
                            break;
                        case "pkce":
                            if (this.flowType === "implicit") throw new Je("Not a valid implicit grant flow url.");
                            break;
                        default:
                    }
                    if (r === "pkce") {
                        if (this._debug("#_initialize()", "begin", "is PKCE flow", !0), !e.code) throw new It("No code detected.");
                        let {
                            data: j,
                            error: K
                        } = await this._exchangeCodeForSession(e.code);
                        if (K) throw K;
                        let oe = new URL(window.location.href);
                        return oe.searchParams.delete("code"), window.history.replaceState(window.history.state, "", oe.toString()), {
                            data: {
                                session: j.session,
                                redirectType: (s = j.redirectType) != null ? s : null
                            },
                            error: null
                        }
                    }
                    let {
                        provider_token: n,
                        provider_refresh_token: a,
                        access_token: i,
                        refresh_token: o,
                        expires_in: c,
                        expires_at: u,
                        token_type: p
                    } = e;
                    if (!i || !c || !o || !p) throw new Je("No session defined in URL");
                    let f = Math.round(Date.now() / 1e3),
                        m = parseInt(c),
                        y = f + m;
                    u && (y = parseInt(u));
                    let S = y - f;
                    S * 1e3 <= Pe && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${S}s, should have been closer to ${m}s`);
                    let R = y - m;
                    f - R >= 120 ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", R, y, f) : f - R < 0 && console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", R, y, f);
                    let {
                        data: T,
                        error: M
                    } = await this._getUser(i);
                    if (M) throw M;
                    let C = {
                        provider_token: n,
                        provider_refresh_token: a,
                        access_token: i,
                        expires_in: m,
                        expires_at: y,
                        refresh_token: o,
                        token_type: p,
                        user: T.user
                    };
                    return window.location.hash = "", this._debug("#_getSessionFromURL()", "clearing window.location.hash"), this._returnResult({
                        data: {
                            session: C,
                            redirectType: e.type
                        },
                        error: null
                    })
                } catch (n) {
                    if (_(n)) return this._returnResult({
                        data: {
                            session: null,
                            redirectType: null
                        },
                        error: n
                    });
                    throw n
                }
            }
            _isImplicitGrantCallback(e) {
                return typeof this.detectSessionInUrl == "function" ? this.detectSessionInUrl(new URL(window.location.href), e) : !!(e.access_token || e.error_description)
            }
            async _isPKCECallback(e) {
                let r = await ke(this.storage, `${this.storageKey}-code-verifier`);
                return !!(e.code && r)
            }
            async signOut(e = {
                scope: "global"
            }) {
                return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._signOut(e))
            }
            async _signOut({
                scope: e
            } = {
                scope: "global"
            }) {
                return await this._useSession(async r => {
                    var i;
                    let {
                        data: s,
                        error: n
                    } = r;
                    if (n && !Ke(n)) return this._returnResult({
                        error: n
                    });
                    let a = (i = s.session) == null ? void 0 : i.access_token;
                    if (a) {
                        let {
                            error: o
                        } = await this.admin.signOut(a, e);
                        if (o && !(ar(o) && (o.status === 404 || o.status === 401 || o.status === 403) || Ke(o))) return this._returnResult({
                            error: o
                        })
                    }
                    return e !== "others" && (await this._removeSession(), await X(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({
                        error: null
                    })
                })
            }
            onAuthStateChange(e) {
                let r = mn(),
                    s = {
                        id: r,
                        callback: e,
                        unsubscribe: () => {
                            this._debug("#unsubscribe()", "state change callback with id removed", r), this.stateChangeEmitters.delete(r)
                        }
                    };
                return this._debug("#onAuthStateChange()", "registered callback with id", r), this.stateChangeEmitters.set(r, s), (async () => (await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => {
                    this._emitInitialSession(r)
                })))(), {
                    data: {
                        subscription: s
                    }
                }
            }
            async _emitInitialSession(e) {
                return await this._useSession(async r => {
                    var s, n;
                    try {
                        let {
                            data: {
                                session: a
                            },
                            error: i
                        } = r;
                        if (i) throw i;
                        await ((s = this.stateChangeEmitters.get(e)) == null ? void 0 : s.callback("INITIAL_SESSION", a)), this._debug("INITIAL_SESSION", "callback id", e, "session", a)
                    } catch (a) {
                        await ((n = this.stateChangeEmitters.get(e)) == null ? void 0 : n.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", e, "error", a), Ke(a) ? console.warn(a) : console.error(a)
                    }
                })
            }
            async resetPasswordForEmail(e, r = {}) {
                let s = null,
                    n = null;
                this.flowType === "pkce" && ([s, n] = await Ne(this.storage, this.storageKey, !0));
                try {
                    return await A(this.fetch, "POST", `${this.url}/recover`, {
                        body: {
                            email: e,
                            code_challenge: s,
                            code_challenge_method: n,
                            gotrue_meta_security: {
                                captcha_token: r.captchaToken
                            }
                        },
                        headers: this.headers,
                        redirectTo: r.redirectTo
                    })
                } catch (a) {
                    if (await X(this.storage, `${this.storageKey}-code-verifier`), _(a)) return this._returnResult({
                        data: null,
                        error: a
                    });
                    throw a
                }
            }
            async getUserIdentities() {
                var e;
                try {
                    let {
                        data: r,
                        error: s
                    } = await this.getUser();
                    if (s) throw s;
                    return this._returnResult({
                        data: {
                            identities: (e = r.user.identities) != null ? e : []
                        },
                        error: null
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async linkIdentity(e) {
                return "token" in e ? this.linkIdentityIdToken(e) : this.linkIdentityOAuth(e)
            }
            async linkIdentityOAuth(e) {
                var r;
                try {
                    let {
                        data: s,
                        error: n
                    } = await this._useSession(async a => {
                        var u, p, f, m, y;
                        let {
                            data: i,
                            error: o
                        } = a;
                        if (o) throw o;
                        let c = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e.provider, {
                            redirectTo: (u = e.options) == null ? void 0 : u.redirectTo,
                            scopes: (p = e.options) == null ? void 0 : p.scopes,
                            queryParams: (f = e.options) == null ? void 0 : f.queryParams,
                            skipBrowserRedirect: !0
                        });
                        return await A(this.fetch, "GET", c, {
                            headers: this.headers,
                            jwt: (y = (m = i.session) == null ? void 0 : m.access_token) != null ? y : void 0
                        })
                    });
                    if (n) throw n;
                    return Y() && !((r = e.options) != null && r.skipBrowserRedirect) && window.location.assign(s == null ? void 0 : s.url), this._returnResult({
                        data: {
                            provider: e.provider,
                            url: s == null ? void 0 : s.url
                        },
                        error: null
                    })
                } catch (s) {
                    if (_(s)) return this._returnResult({
                        data: {
                            provider: e.provider,
                            url: null
                        },
                        error: s
                    });
                    throw s
                }
            }
            async linkIdentityIdToken(e) {
                return await this._useSession(async r => {
                    var s;
                    try {
                        let {
                            error: n,
                            data: {
                                session: a
                            }
                        } = r;
                        if (n) throw n;
                        let {
                            options: i,
                            provider: o,
                            token: c,
                            access_token: u,
                            nonce: p
                        } = e, {
                            data: f,
                            error: m
                        } = await A(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
                            headers: this.headers,
                            jwt: (s = a == null ? void 0 : a.access_token) != null ? s : void 0,
                            body: {
                                provider: o,
                                id_token: c,
                                access_token: u,
                                nonce: p,
                                link_identity: !0,
                                gotrue_meta_security: {
                                    captcha_token: i == null ? void 0 : i.captchaToken
                                }
                            },
                            xform: se
                        });
                        return m ? this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: m
                        }) : !f || !f.session || !f.user ? this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: new we
                        }) : (f.session && (await this._saveSession(f.session), await this._notifyAllSubscribers("USER_UPDATED", f.session)), this._returnResult({
                            data: f,
                            error: m
                        }))
                    } catch (n) {
                        if (await X(this.storage, `${this.storageKey}-code-verifier`), _(n)) return this._returnResult({
                            data: {
                                user: null,
                                session: null
                            },
                            error: n
                        });
                        throw n
                    }
                })
            }
            async unlinkIdentity(e) {
                try {
                    return await this._useSession(async r => {
                        var a, i;
                        let {
                            data: s,
                            error: n
                        } = r;
                        if (n) throw n;
                        return await A(this.fetch, "DELETE", `${this.url}/user/identities/${e.identity_id}`, {
                            headers: this.headers,
                            jwt: (i = (a = s.session) == null ? void 0 : a.access_token) != null ? i : void 0
                        })
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async _refreshAccessToken(e) {
                let r = `#_refreshAccessToken(${e.substring(0,5)}...)`;
                this._debug(r, "begin");
                try {
                    let s = Date.now();
                    return await vn(async n => (n > 0 && await wn(200 * 2 ** (n - 1)), this._debug(r, "refreshing attempt", n), await A(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
                        body: {
                            refresh_token: e
                        },
                        headers: this.headers,
                        xform: se
                    })), (n, a) => {
                        let i = 200 * 2 ** n;
                        return a && lt(a) && Date.now() + i - s < Pe
                    })
                } catch (s) {
                    if (this._debug(r, "error", s), _(s)) return this._returnResult({
                        data: {
                            session: null,
                            user: null
                        },
                        error: s
                    });
                    throw s
                } finally {
                    this._debug(r, "end")
                }
            }
            _isValidSession(e) {
                return typeof e == "object" && !!e && "access_token" in e && "refresh_token" in e && "expires_at" in e
            }
            async _handleProviderSignIn(e, r) {
                let s = await this._getUrlForProvider(`${this.url}/authorize`, e, {
                    redirectTo: r.redirectTo,
                    scopes: r.scopes,
                    queryParams: r.queryParams
                });
                return this._debug("#_handleProviderSignIn()", "provider", e, "options", r, "url", s), Y() && !r.skipBrowserRedirect && window.location.assign(s), {
                    data: {
                        provider: e,
                        url: s
                    },
                    error: null
                }
            }
            async _recoverAndRefresh() {
                var r, s;
                let e = "#_recoverAndRefresh()";
                this._debug(e, "begin");
                try {
                    let n = await ke(this.storage, this.storageKey);
                    if (n && this.userStorage) {
                        let i = await ke(this.userStorage, this.storageKey + "-user");
                        !this.storage.isServer && Object.is(this.storage, this.userStorage) && !i && (i = {
                            user: n.user
                        }, await Le(this.userStorage, this.storageKey + "-user", i)), n.user = (r = i == null ? void 0 : i.user) != null ? r : xt()
                    } else if (n && !n.user && !n.user) {
                        let i = await ke(this.storage, this.storageKey + "-user");
                        i && (i != null && i.user) ? (n.user = i.user, await X(this.storage, this.storageKey + "-user"), await Le(this.storage, this.storageKey, n)) : n.user = xt()
                    }
                    if (this._debug(e, "session from storage", n), !this._isValidSession(n)) {
                        this._debug(e, "session is not valid"), n !== null && await this._removeSession();
                        return
                    }
                    let a = ((s = n.expires_at) != null ? s : 1 / 0) * 1e3 - Date.now() < Rt;
                    if (this._debug(e, `session has${a?"":" not"} expired with margin of ${Rt}s`), a) {
                        if (this.autoRefreshToken && n.refresh_token) {
                            let {
                                error: i
                            } = await this._callRefreshToken(n.refresh_token);
                            i && (console.error(i), lt(i) || (this._debug(e, "refresh failed with a non-retryable error, removing the session", i), await this._removeSession()))
                        }
                    } else if (n.user && n.user.__isUserNotAvailableProxy === !0) try {
                        let {
                            data: i,
                            error: o
                        } = await this._getUser(n.access_token);
                        !o && (i != null && i.user) ? (n.user = i.user, await this._saveSession(n), await this._notifyAllSubscribers("SIGNED_IN", n)) : this._debug(e, "could not get user data, skipping SIGNED_IN notification")
                    } catch (i) {
                        console.error("Error getting user data:", i), this._debug(e, "error getting user data, skipping SIGNED_IN notification", i)
                    } else await this._notifyAllSubscribers("SIGNED_IN", n)
                } catch (n) {
                    this._debug(e, "error", n), console.error(n);
                    return
                } finally {
                    this._debug(e, "end")
                }
            }
            async _callRefreshToken(e) {
                var r, s;
                if (!e) throw new V;
                if (this.refreshingDeferred) return this.refreshingDeferred.promise;
                let n = `#_callRefreshToken(${e.substring(0,5)}...)`;
                this._debug(n, "begin");
                try {
                    this.refreshingDeferred = new fr;
                    let {
                        data: a,
                        error: i
                    } = await this._refreshAccessToken(e);
                    if (i) throw i;
                    if (!a.session) throw new V;
                    await this._saveSession(a.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", a.session);
                    let o = {
                        data: a.session,
                        error: null
                    };
                    return this.refreshingDeferred.resolve(o), o
                } catch (a) {
                    if (this._debug(n, "error", a), _(a)) {
                        let i = {
                            data: null,
                            error: a
                        };
                        return lt(a) || await this._removeSession(), (r = this.refreshingDeferred) == null || r.resolve(i), i
                    }
                    throw (s = this.refreshingDeferred) == null || s.reject(a), a
                } finally {
                    this.refreshingDeferred = null, this._debug(n, "end")
                }
            }
            async _notifyAllSubscribers(e, r, s = !0) {
                let n = `#_notifyAllSubscribers(${e})`;
                this._debug(n, "begin", r, `broadcast = ${s}`);
                try {
                    this.broadcastChannel && s && this.broadcastChannel.postMessage({
                        event: e,
                        session: r
                    });
                    let a = [],
                        i = Array.from(this.stateChangeEmitters.values()).map(async o => {
                            try {
                                await o.callback(e, r)
                            } catch (c) {
                                a.push(c)
                            }
                        });
                    if (await Promise.all(i), a.length > 0) {
                        for (let o = 0; o < a.length; o += 1) console.error(a[o]);
                        throw a[0]
                    }
                } finally {
                    this._debug(n, "end")
                }
            }
            async _saveSession(e) {
                this._debug("#_saveSession()", e), this.suppressGetSessionWarning = !0, await X(this.storage, `${this.storageKey}-code-verifier`);
                let r = Object.assign({}, e),
                    s = r.user && r.user.__isUserNotAvailableProxy === !0;
                if (this.userStorage) {
                    !s && r.user && await Le(this.userStorage, this.storageKey + "-user", {
                        user: r.user
                    });
                    let n = Object.assign({}, r);
                    delete n.user;
                    let a = gr(n);
                    await Le(this.storage, this.storageKey, a)
                } else {
                    let n = gr(r);
                    await Le(this.storage, this.storageKey, n)
                }
            }
            async _removeSession() {
                this._debug("#_removeSession()"), this.suppressGetSessionWarning = !1, await X(this.storage, this.storageKey), await X(this.storage, this.storageKey + "-code-verifier"), await X(this.storage, this.storageKey + "-user"), this.userStorage && await X(this.userStorage, this.storageKey + "-user"), await this._notifyAllSubscribers("SIGNED_OUT", null)
            }
            _removeVisibilityChangedCallback() {
                this._debug("#_removeVisibilityChangedCallback()");
                let e = this.visibilityChangedCallback;
                this.visibilityChangedCallback = null;
                try {
                    e && Y() && window != null && window.removeEventListener && window.removeEventListener("visibilitychange", e)
                } catch (r) {
                    console.error("removing visibilitychange callback failed", r)
                }
            }
            async _startAutoRefresh() {
                await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
                let e = setInterval(() => this._autoRefreshTokenTick(), Pe);
                this.autoRefreshTicker = e, e && typeof e == "object" && typeof e.unref == "function" ? e.unref() : typeof Deno < "u" && typeof Deno.unrefTimer == "function" && Deno.unrefTimer(e);
                let r = setTimeout(async () => {
                    await this.initializePromise, await this._autoRefreshTokenTick()
                }, 0);
                this.autoRefreshTickTimeout = r, r && typeof r == "object" && typeof r.unref == "function" ? r.unref() : typeof Deno < "u" && typeof Deno.unrefTimer == "function" && Deno.unrefTimer(r)
            }
            async _stopAutoRefresh() {
                this._debug("#_stopAutoRefresh()");
                let e = this.autoRefreshTicker;
                this.autoRefreshTicker = null, e && clearInterval(e);
                let r = this.autoRefreshTickTimeout;
                this.autoRefreshTickTimeout = null, r && clearTimeout(r)
            }
            async startAutoRefresh() {
                this._removeVisibilityChangedCallback(), await this._startAutoRefresh()
            }
            async stopAutoRefresh() {
                this._removeVisibilityChangedCallback(), await this._stopAutoRefresh()
            }
            async _autoRefreshTokenTick() {
                this._debug("#_autoRefreshTokenTick()", "begin");
                try {
                    await this._acquireLock(0, async () => {
                        try {
                            let e = Date.now();
                            try {
                                return await this._useSession(async r => {
                                    let {
                                        data: {
                                            session: s
                                        }
                                    } = r;
                                    if (!s || !s.refresh_token || !s.expires_at) {
                                        this._debug("#_autoRefreshTokenTick()", "no session");
                                        return
                                    }
                                    let n = Math.floor((s.expires_at * 1e3 - e) / Pe);
                                    this._debug("#_autoRefreshTokenTick()", `access token expires in ${n} ticks, a tick lasts ${Pe}ms, refresh threshold is 3 ticks`), n <= 3 && await this._callRefreshToken(s.refresh_token)
                                })
                            } catch (r) {
                                console.error("Auto refresh tick failed with error. This is likely a transient error.", r)
                            }
                        } finally {
                            this._debug("#_autoRefreshTokenTick()", "end")
                        }
                    })
                } catch (e) {
                    if (e instanceof Ge) this._debug("auto refresh token tick lock not available");
                    else throw e
                }
            }
            async _handleVisibilityChange() {
                if (this._debug("#_handleVisibilityChange()"), !Y() || !(window != null && window.addEventListener)) return this.autoRefreshToken && this.startAutoRefresh(), !1;
                try {
                    this.visibilityChangedCallback = async () => {
                        try {
                            await this._onVisibilityChanged(!1)
                        } catch (e) {
                            this._debug("#visibilityChangedCallback", "error", e)
                        }
                    }, window == null || window.addEventListener("visibilitychange", this.visibilityChangedCallback), await this._onVisibilityChanged(!0)
                } catch (e) {
                    console.error("_handleVisibilityChange", e)
                }
            }
            async _onVisibilityChanged(e) {
                let r = `#_onVisibilityChanged(${e})`;
                this._debug(r, "visibilityState", document.visibilityState), document.visibilityState === "visible" ? (this.autoRefreshToken && this._startAutoRefresh(), e || (await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => {
                    if (document.visibilityState !== "visible") {
                        this._debug(r, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
                        return
                    }
                    await this._recoverAndRefresh()
                }))) : document.visibilityState === "hidden" && this.autoRefreshToken && this._stopAutoRefresh()
            }
            async _getUrlForProvider(e, r, s) {
                let n = [`provider=${encodeURIComponent(r)}`];
                if (s != null && s.redirectTo && n.push(`redirect_to=${encodeURIComponent(s.redirectTo)}`), s != null && s.scopes && n.push(`scopes=${encodeURIComponent(s.scopes)}`), this.flowType === "pkce") {
                    let [a, i] = await Ne(this.storage, this.storageKey), o = new URLSearchParams({
                        code_challenge: `${encodeURIComponent(a)}`,
                        code_challenge_method: `${encodeURIComponent(i)}`
                    });
                    n.push(o.toString())
                }
                if (s != null && s.queryParams) {
                    let a = new URLSearchParams(s.queryParams);
                    n.push(a.toString())
                }
                return s != null && s.skipBrowserRedirect && n.push(`skip_http_redirect=${s.skipBrowserRedirect}`), `${e}?${n.join("&")}`
            }
            async _unenroll(e) {
                try {
                    return await this._useSession(async r => {
                        var a;
                        let {
                            data: s,
                            error: n
                        } = r;
                        return n ? this._returnResult({
                            data: null,
                            error: n
                        }) : await A(this.fetch, "DELETE", `${this.url}/factors/${e.factorId}`, {
                            headers: this.headers,
                            jwt: (a = s == null ? void 0 : s.session) == null ? void 0 : a.access_token
                        })
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async _enroll(e) {
                try {
                    return await this._useSession(async r => {
                        var c, u;
                        let {
                            data: s,
                            error: n
                        } = r;
                        if (n) return this._returnResult({
                            data: null,
                            error: n
                        });
                        let a = Object.assign({
                                friendly_name: e.friendlyName,
                                factor_type: e.factorType
                            }, e.factorType === "phone" ? {
                                phone: e.phone
                            } : e.factorType === "totp" ? {
                                issuer: e.issuer
                            } : {}),
                            {
                                data: i,
                                error: o
                            } = await A(this.fetch, "POST", `${this.url}/factors`, {
                                body: a,
                                headers: this.headers,
                                jwt: (c = s == null ? void 0 : s.session) == null ? void 0 : c.access_token
                            });
                        return o ? this._returnResult({
                            data: null,
                            error: o
                        }) : (e.factorType === "totp" && i.type === "totp" && ((u = i == null ? void 0 : i.totp) != null && u.qr_code) && (i.totp.qr_code = `data:image/svg+xml;utf-8,${i.totp.qr_code}`), this._returnResult({
                            data: i,
                            error: null
                        }))
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async _verify(e) {
                return this._acquireLock(this.lockAcquireTimeout, async () => {
                    try {
                        return await this._useSession(async r => {
                            var c;
                            let {
                                data: s,
                                error: n
                            } = r;
                            if (n) return this._returnResult({
                                data: null,
                                error: n
                            });
                            let a = Object.assign({
                                    challenge_id: e.challengeId
                                }, "webauthn" in e ? {
                                    webauthn: Object.assign(Object.assign({}, e.webauthn), {
                                        credential_response: e.webauthn.type === "create" ? Tr(e.webauthn.credential_response) : Rr(e.webauthn.credential_response)
                                    })
                                } : {
                                    code: e.code
                                }),
                                {
                                    data: i,
                                    error: o
                                } = await A(this.fetch, "POST", `${this.url}/factors/${e.factorId}/verify`, {
                                    body: a,
                                    headers: this.headers,
                                    jwt: (c = s == null ? void 0 : s.session) == null ? void 0 : c.access_token
                                });
                            return o ? this._returnResult({
                                data: null,
                                error: o
                            }) : (await this._saveSession(Object.assign({
                                expires_at: Math.round(Date.now() / 1e3) + i.expires_in
                            }, i)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", i), this._returnResult({
                                data: i,
                                error: o
                            }))
                        })
                    } catch (r) {
                        if (_(r)) return this._returnResult({
                            data: null,
                            error: r
                        });
                        throw r
                    }
                })
            }
            async _challenge(e) {
                return this._acquireLock(this.lockAcquireTimeout, async () => {
                    try {
                        return await this._useSession(async r => {
                            var o;
                            let {
                                data: s,
                                error: n
                            } = r;
                            if (n) return this._returnResult({
                                data: null,
                                error: n
                            });
                            let a = await A(this.fetch, "POST", `${this.url}/factors/${e.factorId}/challenge`, {
                                body: e,
                                headers: this.headers,
                                jwt: (o = s == null ? void 0 : s.session) == null ? void 0 : o.access_token
                            });
                            if (a.error) return a;
                            let {
                                data: i
                            } = a;
                            if (i.type !== "webauthn") return {
                                data: i,
                                error: null
                            };
                            switch (i.webauthn.type) {
                                case "create":
                                    return {
                                        data: Object.assign(Object.assign({}, i), {
                                            webauthn: Object.assign(Object.assign({}, i.webauthn), {
                                                credential_options: Object.assign(Object.assign({}, i.webauthn.credential_options), {
                                                    publicKey: Er(i.webauthn.credential_options.publicKey)
                                                })
                                            })
                                        }), error: null
                                    };
                                case "request":
                                    return {
                                        data: Object.assign(Object.assign({}, i), {
                                            webauthn: Object.assign(Object.assign({}, i.webauthn), {
                                                credential_options: Object.assign(Object.assign({}, i.webauthn.credential_options), {
                                                    publicKey: Sr(i.webauthn.credential_options.publicKey)
                                                })
                                            })
                                        }), error: null
                                    }
                            }
                        })
                    } catch (r) {
                        if (_(r)) return this._returnResult({
                            data: null,
                            error: r
                        });
                        throw r
                    }
                })
            }
            async _challengeAndVerify(e) {
                let {
                    data: r,
                    error: s
                } = await this._challenge({
                    factorId: e.factorId
                });
                return s ? this._returnResult({
                    data: null,
                    error: s
                }) : await this._verify({
                    factorId: e.factorId,
                    challengeId: r.id,
                    code: e.code
                })
            }
            async _listFactors() {
                var n;
                let {
                    data: {
                        user: e
                    },
                    error: r
                } = await this.getUser();
                if (r) return {
                    data: null,
                    error: r
                };
                let s = {
                    all: [],
                    phone: [],
                    totp: [],
                    webauthn: []
                };
                for (let a of (n = e == null ? void 0 : e.factors) != null ? n : []) s.all.push(a), a.status === "verified" && s[a.factor_type].push(a);
                return {
                    data: s,
                    error: null
                }
            }
            async _getAuthenticatorAssuranceLevel(e) {
                var c, u, p, f;
                if (e) try {
                    let {
                        payload: m
                    } = ht(e), y = null;
                    m.aal && (y = m.aal);
                    let S = y,
                        {
                            data: {
                                user: R
                            },
                            error: T
                        } = await this.getUser(e);
                    if (T) return this._returnResult({
                        data: null,
                        error: T
                    });
                    ((u = (c = R == null ? void 0 : R.factors) == null ? void 0 : c.filter(C => C.status === "verified")) != null ? u : []).length > 0 && (S = "aal2");
                    let M = m.amr || [];
                    return {
                        data: {
                            currentLevel: y,
                            nextLevel: S,
                            currentAuthenticationMethods: M
                        },
                        error: null
                    }
                } catch (m) {
                    if (_(m)) return this._returnResult({
                        data: null,
                        error: m
                    });
                    throw m
                }
                let {
                    data: {
                        session: r
                    },
                    error: s
                } = await this.getSession();
                if (s) return this._returnResult({
                    data: null,
                    error: s
                });
                if (!r) return {
                    data: {
                        currentLevel: null,
                        nextLevel: null,
                        currentAuthenticationMethods: []
                    },
                    error: null
                };
                let {
                    payload: n
                } = ht(r.access_token), a = null;
                n.aal && (a = n.aal);
                let i = a;
                ((f = (p = r.user.factors) == null ? void 0 : p.filter(m => m.status === "verified")) != null ? f : []).length > 0 && (i = "aal2");
                let o = n.amr || [];
                return {
                    data: {
                        currentLevel: a,
                        nextLevel: i,
                        currentAuthenticationMethods: o
                    },
                    error: null
                }
            }
            async _getAuthorizationDetails(e) {
                try {
                    return await this._useSession(async r => {
                        let {
                            data: {
                                session: s
                            },
                            error: n
                        } = r;
                        return n ? this._returnResult({
                            data: null,
                            error: n
                        }) : s ? await A(this.fetch, "GET", `${this.url}/oauth/authorizations/${e}`, {
                            headers: this.headers,
                            jwt: s.access_token,
                            xform: a => ({
                                data: a,
                                error: null
                            })
                        }) : this._returnResult({
                            data: null,
                            error: new V
                        })
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async _approveAuthorization(e, r) {
                try {
                    return await this._useSession(async s => {
                        let {
                            data: {
                                session: n
                            },
                            error: a
                        } = s;
                        if (a) return this._returnResult({
                            data: null,
                            error: a
                        });
                        if (!n) return this._returnResult({
                            data: null,
                            error: new V
                        });
                        let i = await A(this.fetch, "POST", `${this.url}/oauth/authorizations/${e}/consent`, {
                            headers: this.headers,
                            jwt: n.access_token,
                            body: {
                                action: "approve"
                            },
                            xform: o => ({
                                data: o,
                                error: null
                            })
                        });
                        return i.data && i.data.redirect_url && Y() && !(r != null && r.skipBrowserRedirect) && window.location.assign(i.data.redirect_url), i
                    })
                } catch (s) {
                    if (_(s)) return this._returnResult({
                        data: null,
                        error: s
                    });
                    throw s
                }
            }
            async _denyAuthorization(e, r) {
                try {
                    return await this._useSession(async s => {
                        let {
                            data: {
                                session: n
                            },
                            error: a
                        } = s;
                        if (a) return this._returnResult({
                            data: null,
                            error: a
                        });
                        if (!n) return this._returnResult({
                            data: null,
                            error: new V
                        });
                        let i = await A(this.fetch, "POST", `${this.url}/oauth/authorizations/${e}/consent`, {
                            headers: this.headers,
                            jwt: n.access_token,
                            body: {
                                action: "deny"
                            },
                            xform: o => ({
                                data: o,
                                error: null
                            })
                        });
                        return i.data && i.data.redirect_url && Y() && !(r != null && r.skipBrowserRedirect) && window.location.assign(i.data.redirect_url), i
                    })
                } catch (s) {
                    if (_(s)) return this._returnResult({
                        data: null,
                        error: s
                    });
                    throw s
                }
            }
            async _listOAuthGrants() {
                try {
                    return await this._useSession(async e => {
                        let {
                            data: {
                                session: r
                            },
                            error: s
                        } = e;
                        return s ? this._returnResult({
                            data: null,
                            error: s
                        }) : r ? await A(this.fetch, "GET", `${this.url}/user/oauth/grants`, {
                            headers: this.headers,
                            jwt: r.access_token,
                            xform: n => ({
                                data: n,
                                error: null
                            })
                        }) : this._returnResult({
                            data: null,
                            error: new V
                        })
                    })
                } catch (e) {
                    if (_(e)) return this._returnResult({
                        data: null,
                        error: e
                    });
                    throw e
                }
            }
            async _revokeOAuthGrant(e) {
                try {
                    return await this._useSession(async r => {
                        let {
                            data: {
                                session: s
                            },
                            error: n
                        } = r;
                        return n ? this._returnResult({
                            data: null,
                            error: n
                        }) : s ? (await A(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, {
                            headers: this.headers,
                            jwt: s.access_token,
                            query: {
                                client_id: e.clientId
                            },
                            noResolveJson: !0
                        }), {
                            data: {},
                            error: null
                        }) : this._returnResult({
                            data: null,
                            error: new V
                        })
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async fetchJwk(e, r = {
                keys: []
            }) {
                let s = r.keys.find(o => o.kid === e);
                if (s) return s;
                let n = Date.now();
                if (s = this.jwks.keys.find(o => o.kid === e), s && this.jwks_cached_at + 6e5 > n) return s;
                let {
                    data: a,
                    error: i
                } = await A(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
                    headers: this.headers
                });
                if (i) throw i;
                return !a.keys || a.keys.length === 0 || (this.jwks = a, this.jwks_cached_at = n, s = a.keys.find(o => o.kid === e), !s) ? null : s
            }
            async getClaims(e, r = {}) {
                try {
                    let s = e;
                    if (!s) {
                        let {
                            data: m,
                            error: y
                        } = await this.getSession();
                        if (y || !m.session) return this._returnResult({
                            data: null,
                            error: y
                        });
                        s = m.session.access_token
                    }
                    let {
                        header: n,
                        payload: a,
                        signature: i,
                        raw: {
                            header: o,
                            payload: c
                        }
                    } = ht(s);
                    r != null && r.allowExpired || An(a.exp);
                    let u = !n.alg || n.alg.startsWith("HS") || !n.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(n.kid, r != null && r.keys ? {
                        keys: r.keys
                    } : r == null ? void 0 : r.jwks);
                    if (!u) {
                        let {
                            error: m
                        } = await this.getUser(s);
                        if (m) throw m;
                        return {
                            data: {
                                claims: a,
                                header: n,
                                signature: i
                            },
                            error: null
                        }
                    }
                    let p = In(n.alg),
                        f = await crypto.subtle.importKey("jwk", u, p, !0, ["verify"]);
                    if (!await crypto.subtle.verify(p, f, i, fn(`${o}.${c}`))) throw new ct("Invalid JWT signature");
                    return {
                        data: {
                            claims: a,
                            header: n,
                            signature: i
                        },
                        error: null
                    }
                } catch (s) {
                    if (_(s)) return this._returnResult({
                        data: null,
                        error: s
                    });
                    throw s
                }
            }
            async signInWithPasskey(e) {
                var r, s, n;
                ae(this.experimental);
                try {
                    if (!ft()) return this._returnResult({
                        data: null,
                        error: new re("Browser does not support WebAuthn", null)
                    });
                    let {
                        data: a,
                        error: i
                    } = await this._startPasskeyAuthentication({
                        options: {
                            captchaToken: (r = e == null ? void 0 : e.options) == null ? void 0 : r.captchaToken
                        }
                    });
                    if (i || !a) return this._returnResult({
                        data: null,
                        error: i
                    });
                    let {
                        data: o,
                        error: c
                    } = await Cr({
                        publicKey: Sr(a.options),
                        signal: (n = (s = e == null ? void 0 : e.options) == null ? void 0 : s.signal) != null ? n : jt.createNewAbortSignal()
                    });
                    if (c || !o) return this._returnResult({
                        data: null,
                        error: c != null ? c : new re("WebAuthn ceremony failed", null)
                    });
                    let u = Rr(o);
                    return this._verifyPasskeyAuthentication({
                        challengeId: a.challenge_id,
                        credential: u
                    })
                } catch (a) {
                    if (_(a)) return this._returnResult({
                        data: null,
                        error: a
                    });
                    throw a
                }
            }
            async registerPasskey(e) {
                var r, s;
                ae(this.experimental);
                try {
                    if (!ft()) return this._returnResult({
                        data: null,
                        error: new re("Browser does not support WebAuthn", null)
                    });
                    let {
                        data: n,
                        error: a
                    } = await this._startPasskeyRegistration();
                    if (a || !n) return this._returnResult({
                        data: null,
                        error: a
                    });
                    let {
                        data: i,
                        error: o
                    } = await Ir({
                        publicKey: Er(n.options),
                        signal: (s = (r = e == null ? void 0 : e.options) == null ? void 0 : r.signal) != null ? s : jt.createNewAbortSignal()
                    });
                    if (o || !i) return this._returnResult({
                        data: null,
                        error: o != null ? o : new re("WebAuthn ceremony failed", null)
                    });
                    let c = Tr(i);
                    return this._verifyPasskeyRegistration({
                        challengeId: n.challenge_id,
                        credential: c
                    })
                } catch (n) {
                    if (_(n)) return this._returnResult({
                        data: null,
                        error: n
                    });
                    throw n
                }
            }
            async _startPasskeyRegistration() {
                ae(this.experimental);
                try {
                    return await this._useSession(async e => {
                        let {
                            data: {
                                session: r
                            },
                            error: s
                        } = e;
                        if (s) return this._returnResult({
                            data: null,
                            error: s
                        });
                        if (!r) return this._returnResult({
                            data: null,
                            error: new V
                        });
                        let {
                            data: n,
                            error: a
                        } = await A(this.fetch, "POST", `${this.url}/passkeys/registration/options`, {
                            headers: this.headers,
                            jwt: r.access_token,
                            body: {}
                        });
                        return a ? this._returnResult({
                            data: null,
                            error: a
                        }) : this._returnResult({
                            data: n,
                            error: null
                        })
                    })
                } catch (e) {
                    if (_(e)) return this._returnResult({
                        data: null,
                        error: e
                    });
                    throw e
                }
            }
            async _verifyPasskeyRegistration(e) {
                ae(this.experimental);
                try {
                    return await this._useSession(async r => {
                        let {
                            data: {
                                session: s
                            },
                            error: n
                        } = r;
                        if (n) return this._returnResult({
                            data: null,
                            error: n
                        });
                        if (!s) return this._returnResult({
                            data: null,
                            error: new V
                        });
                        let {
                            data: a,
                            error: i
                        } = await A(this.fetch, "POST", `${this.url}/passkeys/registration/verify`, {
                            headers: this.headers,
                            jwt: s.access_token,
                            body: {
                                challenge_id: e.challengeId,
                                credential: e.credential
                            }
                        });
                        return i ? this._returnResult({
                            data: null,
                            error: i
                        }) : this._returnResult({
                            data: a,
                            error: null
                        })
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async _startPasskeyAuthentication(e) {
                var r;
                ae(this.experimental);
                try {
                    let {
                        data: s,
                        error: n
                    } = await A(this.fetch, "POST", `${this.url}/passkeys/authentication/options`, {
                        headers: this.headers,
                        body: {
                            gotrue_meta_security: {
                                captcha_token: (r = e == null ? void 0 : e.options) == null ? void 0 : r.captchaToken
                            }
                        }
                    });
                    return n ? this._returnResult({
                        data: null,
                        error: n
                    }) : this._returnResult({
                        data: s,
                        error: null
                    })
                } catch (s) {
                    if (_(s)) return this._returnResult({
                        data: null,
                        error: s
                    });
                    throw s
                }
            }
            async _verifyPasskeyAuthentication(e) {
                ae(this.experimental);
                try {
                    let {
                        data: r,
                        error: s
                    } = await A(this.fetch, "POST", `${this.url}/passkeys/authentication/verify`, {
                        headers: this.headers,
                        body: {
                            challenge_id: e.challengeId,
                            credential: e.credential
                        },
                        xform: se
                    });
                    return s ? this._returnResult({
                        data: null,
                        error: s
                    }) : (r.session && (await this._saveSession(r.session), await this._notifyAllSubscribers("SIGNED_IN", r.session)), this._returnResult({
                        data: r,
                        error: null
                    }))
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async _listPasskeys() {
                ae(this.experimental);
                try {
                    return await this._useSession(async e => {
                        let {
                            data: {
                                session: r
                            },
                            error: s
                        } = e;
                        if (s) return this._returnResult({
                            data: null,
                            error: s
                        });
                        if (!r) return this._returnResult({
                            data: null,
                            error: new V
                        });
                        let {
                            data: n,
                            error: a
                        } = await A(this.fetch, "GET", `${this.url}/passkeys`, {
                            headers: this.headers,
                            jwt: r.access_token,
                            xform: i => ({
                                data: i,
                                error: null
                            })
                        });
                        return a ? this._returnResult({
                            data: null,
                            error: a
                        }) : this._returnResult({
                            data: n,
                            error: null
                        })
                    })
                } catch (e) {
                    if (_(e)) return this._returnResult({
                        data: null,
                        error: e
                    });
                    throw e
                }
            }
            async _updatePasskey(e) {
                ae(this.experimental);
                try {
                    return await this._useSession(async r => {
                        let {
                            data: {
                                session: s
                            },
                            error: n
                        } = r;
                        if (n) return this._returnResult({
                            data: null,
                            error: n
                        });
                        if (!s) return this._returnResult({
                            data: null,
                            error: new V
                        });
                        let {
                            data: a,
                            error: i
                        } = await A(this.fetch, "PATCH", `${this.url}/passkeys/${e.passkeyId}`, {
                            headers: this.headers,
                            jwt: s.access_token,
                            body: {
                                friendly_name: e.friendlyName
                            }
                        });
                        return i ? this._returnResult({
                            data: null,
                            error: i
                        }) : this._returnResult({
                            data: a,
                            error: null
                        })
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
            async _deletePasskey(e) {
                ae(this.experimental);
                try {
                    return await this._useSession(async r => {
                        let {
                            data: {
                                session: s
                            },
                            error: n
                        } = r;
                        if (n) return this._returnResult({
                            data: null,
                            error: n
                        });
                        if (!s) return this._returnResult({
                            data: null,
                            error: new V
                        });
                        let {
                            error: a
                        } = await A(this.fetch, "DELETE", `${this.url}/passkeys/${e.passkeyId}`, {
                            headers: this.headers,
                            jwt: s.access_token,
                            noResolveJson: !0
                        });
                        return a ? this._returnResult({
                            data: null,
                            error: a
                        }) : this._returnResult({
                            data: null,
                            error: null
                        })
                    })
                } catch (r) {
                    if (_(r)) return this._returnResult({
                        data: null,
                        error: r
                    });
                    throw r
                }
            }
        };
        Or.nextInstanceID = {};
        var Pr = Or,
            Xn = Ot,
            jr = Pr,
            Qn = class extends jr {
                constructor(t) {
                    super(t)
                }
            },
            $r = class {
                constructor(t, e, r) {
                    var o, c, u;
                    this.supabaseUrl = t, this.supabaseKey = e;
                    let s = nn(t);
                    if (!e) throw Error("supabaseKey is required.");
                    this.realtimeUrl = new URL("realtime/v1", s), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", s), this.storageUrl = new URL("storage/v1", s), this.functionsUrl = new URL("functions/v1", s);
                    let n = `sb-${s.hostname.split(".")[0]}-auth-token`,
                        a = {
                            db: Fs,
                            realtime: Ws,
                            auth: Ue(z({}, Hs), {
                                storageKey: n
                            }),
                            global: qs,
                            tracePropagation: Ks
                        },
                        i = sn(r != null ? r : {}, a);
                    this.settings = i, this.storageKey = (o = i.auth.storageKey) != null ? o : "", this.headers = (c = i.global.headers) != null ? c : {}, i.accessToken ? (this.accessToken = i.accessToken, this.auth = new Proxy({}, {
                        get: (p, f) => {
                            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(f)} is not possible`)
                        }
                    })) : this.auth = this._initSupabaseAuthClient((u = i.auth) != null ? u : {}, this.headers, i.global.fetch), this.fetch = en(e, t, this._getAccessToken.bind(this), i.global.fetch, i.tracePropagation), this.realtime = this._initRealtimeClient(z({
                        headers: this.headers,
                        accessToken: this._getAccessToken.bind(this),
                        fetch: this.fetch
                    }, i.realtime)), this.accessToken && Promise.resolve(this.accessToken()).then(p => this.realtime.setAuth(p)).catch(p => console.warn("Failed to set initial Realtime auth token:", p)), this.rest = new Re(new URL("rest/v1", s).href, {
                        headers: this.headers,
                        schema: i.db.schema,
                        fetch: this.fetch,
                        timeout: i.db.timeout,
                        urlLengthLimit: i.db.urlLengthLimit
                    }), this.storage = new Ms(this.storageUrl.href, this.headers, this.fetch, r == null ? void 0 : r.storage), i.accessToken || this._listenForAuthEvents()
                }
                get functions() {
                    return new L(this.functionsUrl.href, {
                        headers: this.headers,
                        customFetch: this.fetch
                    })
                }
                from(t) {
                    return this.rest.from(t)
                }
                schema(t) {
                    return this.rest.schema(t)
                }
                rpc(t, e = {}, r = {
                    head: !1,
                    get: !1,
                    count: void 0
                }) {
                    return this.rest.rpc(t, e, r)
                }
                channel(t, e = {
                    config: {}
                }) {
                    return this.realtime.channel(t, e)
                }
                getChannels() {
                    return this.realtime.getChannels()
                }
                removeChannel(t) {
                    return this.realtime.removeChannel(t)
                }
                removeAllChannels() {
                    return this.realtime.removeAllChannels()
                }
                async _getAccessToken() {
                    var e, r;
                    if (this.accessToken) return await this.accessToken();
                    let {
                        data: t
                    } = await this.auth.getSession();
                    return (r = (e = t.session) == null ? void 0 : e.access_token) != null ? r : this.supabaseKey
                }
                _initSupabaseAuthClient({
                    autoRefreshToken: t,
                    persistSession: e,
                    detectSessionInUrl: r,
                    storage: s,
                    userStorage: n,
                    storageKey: a,
                    flowType: i,
                    lock: o,
                    debug: c,
                    throwOnError: u,
                    experimental: p,
                    lockAcquireTimeout: f,
                    skipAutoInitialize: m
                }, y, S) {
                    let R = {
                        Authorization: `Bearer ${this.supabaseKey}`,
                        apikey: `${this.supabaseKey}`
                    };
                    return new Qn({
                        url: this.authUrl.href,
                        headers: z(z({}, R), y),
                        storageKey: a,
                        autoRefreshToken: t,
                        persistSession: e,
                        detectSessionInUrl: r,
                        storage: s,
                        userStorage: n,
                        flowType: i,
                        lock: o,
                        debug: c,
                        throwOnError: u,
                        experimental: p,
                        fetch: S,
                        lockAcquireTimeout: f,
                        skipAutoInitialize: m,
                        hasCustomAuthorizationHeader: Object.keys(this.headers).some(T => T.toLowerCase() === "authorization")
                    })
                }
                _initRealtimeClient(t) {
                    return new zt(this.realtimeUrl.href, Ue(z({}, t), {
                        params: z({
                            apikey: this.supabaseKey
                        }, t == null ? void 0 : t.params)
                    }))
                }
                _listenForAuthEvents() {
                    return this.auth.onAuthStateChange((t, e) => {
                        this._handleTokenChanged(t, "CLIENT", e == null ? void 0 : e.access_token)
                    })
                }
                _handleTokenChanged(t, e, r) {
                    (t === "TOKEN_REFRESHED" || t === "SIGNED_IN") && this.changedAccessToken !== r ? (this.changedAccessToken = r, this.realtime.setAuth(r)) : t === "SIGNED_OUT" && (this.realtime.setAuth(), e == "STORAGE" && this.auth.signOut(), this.changedAccessToken = void 0)
                }
            };
        let Zn = (t, e, r) => new $r(t, e, r);

        function ea() {
            if (typeof window < "u") return !1;
            let t = globalThis.process;
            if (!t) return !1;
            let e = t.version;
            if (e == null) return !1;
            let r = e.match(/^v(\d+)\./);
            return r ? parseInt(r[1], 10) <= 18 : !1
        }
        return ea() && console.warn("\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217"), l.AuthAdminApi = Xn, l.AuthApiError = nr, l.AuthClient = jr, l.AuthError = je, l.AuthImplicitGrantRedirectError = Je, l.AuthInvalidCredentialsError = ze, l.AuthInvalidJwtError = ct, l.AuthInvalidTokenResponseError = we, l.AuthPKCECodeVerifierMissingError = or, l.AuthPKCEGrantCodeExchangeError = It, l.AuthRetryableFetchError = ot, l.AuthSessionMissingError = V, l.AuthUnknownError = re, l.AuthWeakPasswordError = Ct, l.CustomAuthError = he, Object.defineProperty(l, "FunctionRegion", {
            enumerable: !0,
            get: function() {
                return $
            }
        }), l.FunctionsError = b, l.FunctionsFetchError = k, l.FunctionsHttpError = I, l.FunctionsRelayError = E, l.GoTrueAdminApi = Ot, l.GoTrueClient = Pr, l.NavigatorLockAcquireTimeoutError = Pt, l.PostgrestError = N, l.REALTIME_CHANNEL_STATES = os, Object.defineProperty(l, "REALTIME_LISTEN_TYPES", {
            enumerable: !0,
            get: function() {
                return Ce
            }
        }), Object.defineProperty(l, "REALTIME_POSTGRES_CHANGES_LISTEN_EVENT", {
            enumerable: !0,
            get: function() {
                return Ht
            }
        }), Object.defineProperty(l, "REALTIME_PRESENCE_LISTEN_EVENTS", {
            enumerable: !0,
            get: function() {
                return qt
            }
        }), Object.defineProperty(l, "REALTIME_SUBSCRIBE_STATES", {
            enumerable: !0,
            get: function() {
                return fe
            }
        }), l.RealtimeChannel = Wt, l.RealtimeClient = zt, l.RealtimePresence = Ft, l.SIGN_OUT_SCOPES = dt, l.StorageApiError = at, l.SupabaseClient = $r, l.WebSocketFactory = Xe, l.createClient = Zn, l.isAuthApiError = ar, l.isAuthError = _, l.isAuthImplicitGrantRedirectError = ir, l.isAuthPKCECodeVerifierMissingError = ln, l.isAuthRetryableFetchError = lt, l.isAuthSessionMissingError = Ke, l.isAuthWeakPasswordError = cn, l.lockInternals = ie, l.navigatorLock = vr, l.processLock = Un, l
    }({}),
    INCIDENCIAS = [{
        id: "falta_stock",
        nm: "Falta de stock",
        c: "#EF4444"
    }, {
        id: "stock_otro_almacen",
        nm: "Stock en otro Almacen",
        c: "#F59E0B"
    }, {
        id: "averiado",
        nm: "Averiado",
        c: "#8B5CF6"
    }, {
        id: "error_precio",
        nm: "Error de precio",
        c: "#EF4444"
    }, {
        id: "error_stock",
        nm: "Error de stock",
        c: "#F59E0B"
    }, {
        id: "error_cliente",
        nm: "Error del cliente",
        c: "#8B5CF6"
    }, {
        id: "error_logistico",
        nm: "Error logístico",
        c: "#06B6D4"
    }, {
        id: "error_sistema",
        nm: "Error de sistema",
        c: "#64748B"
    }, {
        id: "duplicado",
        nm: "Pedido duplicado",
        c: "#EC4899"
    }, {
        id: "cambio_condiciones",
        nm: "Cambio de condiciones",
        c: "#F97316"
    }, {
        id: "otro",
        nm: "Otro",
        c: "#334155"
    }],

    getMotivos = function() {
        var defs = INCIDENCIAS.filter(function(i) { return i.id.indexOf("_") > 0 || i.id === "otro"; });
        try {
            var extra = JSON.parse(localStorage.getItem("customMotivos") || "[]");
            extra.forEach(function(e) { defs.push(e); });
        } catch (e) {}
        return defs;
    },
    saveMotivo = function(id, nm) {
        var list = [];
        try { list = JSON.parse(localStorage.getItem("customMotivos") || "[]"); } catch (e) {}
        list.push({ id: id, nm: nm, c: "#64748B" });
        localStorage.setItem("customMotivos", JSON.stringify(list));
        INCIDENCIAS.push({ id: id, nm: nm, c: "#64748B" });
    },

    getIncidenciaName = function(id) {
        if (!id) return null;
        var found = INCIDENCIAS.find(function(i) { return i.id === id; });
        return found ? found.nm : id;
    },
    getAlmacenColor = function(alm) {
        var map = {
            "LDAL": { from: "#1e40af", to: "#2563eb" },
            "LDFA": { from: "#0E7490", to: "#06B6D4" },
            "LDLQ": { from: "#C2410C", to: "#F97316" }
        };
        return map[alm] || { from: "#4F46E5", to: "#6366F1" };
    },
    getAlmacenStyle = function(alm) {
        var c = getAlmacenColor(alm);
        return "background:linear-gradient(135deg," + c.from + "," + c.to + ");color:#fff;font-weight:600;font-size:11px;padding:4px 12px;border-radius:100px;letter-spacing:0.4px;box-shadow:0 1px 3px " + c.from + "66;display:inline-flex;align-items:center;gap:4px";
    },
    ESTADOS = {
        pendiente: {
            nm: "Pendiente",
            c: "#F59E0B",
            bg: "rgba(245,158,11,.12)",
            tc: "#D97706",
            i: "\u23F3"
        },
        recuperado: {
            nm: "Recuperado",
            c: "#10B981",
            bg: "rgba(16,185,129,.12)",
            tc: "#059669",
            i: "\u2713"
        },
        no_recuperado: {
            nm: "No Recuperado",
            c: "#EF4444",
            bg: "rgba(239,68,68,.12)",
            tc: "#DC2626",
            i: "\u2717"
        },
        historico: {
            nm: "Hist\xF3rico",
            c: "#64748B",
            bg: "rgba(100,116,139,.12)",
            tc: "#475569",
            i: "\u25CB"
        },
        contabilizado: {
            nm: "Contabilizado",
            c: "#6366F1",
            bg: "rgba(99,102,241,.12)",
            tc: "#4F46E5",
            i: "\u2714"
        },
        facturado: {
            nm: "Facturado",
            c: "#059669",
            bg: "rgba(5,150,105,.12)",
            tc: "#047857",
            i: "\u2691"
        },
        items_borrado: {
            nm: "Reborrado",
            c: "#DC2626",
            bg: "rgba(220,38,38,.10)",
            tc: "#B91C1C",
            i: ""
        },
        sin_stock: {
            nm: "Sin Stock",
            c: "#78716C",
            bg: "rgba(120,113,108,.10)",
            tc: "#57534E",
            i: "\u2298"
        }
    },
    buildEstadoBadge = function(estado) {
        var s = ESTADOS[estado] || ESTADOS.pendiente,
            isRecuperado = estado === "recuperado",
            bg = isRecuperado ? "rgba(245,158,11,.14)" : s.bg,
            tc = isRecuperado ? "#B45309" : s.tc,
            iconColor = isRecuperado ? "#059669" : s.tc;
        return '<span class="status-badge" style="background:' + bg + ';color:' + tc + ';font-weight:700;font-size:11px;padding:4px 10px;border-radius:6px;display:inline-flex;align-items:center;gap:4px"><span style="color:' + iconColor + ';font-weight:900">' + s.i + '</span> ' + s.nm + '</span>';
    },
    buildFlujoEstadoBadge = function(estado) {
        if (estado === "recuperado") {
            return '<span class="status-badge status-badge-flow-recuperado"><span>\u2713</span> Recuperado</span>';
        }
        return buildEstadoBadge(estado);
    },
    ROLES = {
        operario: {
            nm: "Operario"
        },
        supervisor: {
            nm: "Jefe / Supervisor"
        },
        admin: {
            nm: "Administrador"
        }
    },
    USER_COLORS = ["#0066CC", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#EAB308", "#EC4899", "#334155", "#0F766E"];

/* ─── SESSION MIDDLEWARE ───────────────────────────────────────────── */
var SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 horas

function saveSession(user) {
    var session = { user: user, exp: Date.now() + SESSION_EXPIRY_MS };
    sessionStorage.setItem("cri_user", JSON.stringify(session));
    window.currentUser = user;
}

function loadSession() {
    try {
        var raw = sessionStorage.getItem("cri_user");
        if (!raw) return null;
        var s = JSON.parse(raw);
        if (!s) return null;
        // Formato legacy (objeto plano sin exp): lo migramos
        if (s.nombre && !s.exp) {
            saveSession(s);
            return s;
        }
        if (!s.user || !s.exp) return null;
        if (Date.now() > s.exp) {
            sessionStorage.removeItem("cri_user");
            return null;
        }
        return s.user;
    } catch(e) {
        sessionStorage.removeItem("cri_user");
        return null;
    }
}

function requireAuth() {
    var user = loadSession();
    if (!user) {
        doSessionExpired();
        throw new Error("Sesión expirada. Ingresá de nuevo.");
    }
    return user;
}

function doSessionExpired() {
    sessionStorage.removeItem("cri_user");
    window.currentUser = null;
    if (typeof stopNotifPolling === "function") stopNotifPolling();
    var app = document.getElementById("appMain");
    var login = document.getElementById("loginOverlay");
    if (app) app.style.display = "none";
    if (login) login.style.display = "flex";
    if (typeof showToast === "function") showToast("Tu sesión expiró. Ingresá de nuevo.", "info");
}

// Verificar sesión cada vez que el usuario vuelve a la pestaña
document.addEventListener("visibilitychange", function() {
    if (!document.hidden && window.currentUser && !loadSession()) {
        doSessionExpired();
    }
});

/* ─── PROTECCIÓN CONTRA FUERZA BRUTA ───────────────────────────────── */
var LOGIN_MAX_ATTEMPTS = 4;
var LOGIN_LOCKOUT_MS   = 5 * 60 * 1000; // 5 minutos
var _loginAttempts     = { count: 0, lockedUntil: 0 };

function checkLoginLock() {
    if (_loginAttempts.lockedUntil > Date.now()) {
        var secs = Math.ceil((_loginAttempts.lockedUntil - Date.now()) / 1000);
        throw new Error("Demasiados intentos fallidos. Esperá " + secs + " segundos.");
    }
}
function recordFailedAttempt() {
    _loginAttempts.count++;
    if (_loginAttempts.count >= LOGIN_MAX_ATTEMPTS) {
        _loginAttempts.lockedUntil = Date.now() + LOGIN_LOCKOUT_MS;
        _loginAttempts.count = 0;
    }
}
function resetLoginAttempts() {
    _loginAttempts.count = 0;
    _loginAttempts.lockedUntil = 0;
}

/* ─── HASH DE PIN (SHA-256 en el cliente) ──────────────────────────── */
async function hashPin(pin) {
    if (!pin) return "";
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(pin)));
    return Array.from(new Uint8Array(buf)).map(function(b) { return b.toString(16).padStart(2, "0"); }).join("");
}
/* ─────────────────────────────────────────────────────────────────── */

async function ensureStockTable() {
    var sup = getSupabase();
    try {
        await sup.from("stock").select("id").limit(1);
        return true;
    } catch (e) {
        try {
            var { error } = await sup.from("stock").insert({ material: "_test_", descripcion: "_test_", almacen: "_test_", cantidad: 0 }).select("id").single();
            if (error && error.code === "42P01") {
                console.warn("Stock table does not exist. Please create it in Supabase SQL Editor with:", "CREATE TABLE stock (id SERIAL PRIMARY KEY, material TEXT NOT NULL, descripcion TEXT, almacen TEXT NOT NULL, cantidad NUMERIC DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());");
                return false;
            }
            await sup.from("stock").delete().eq("material", "_test_");
            return true;
        } catch (e2) {
            console.warn("Stock table check failed:", e2);
            return false;
        }
    }
}

function normalizeStockData(stockData) {
    var map = {}, order = [], merged = 0;
    (stockData || []).forEach(function(row) {
        var material = String(row.material || "").trim();
        if (!material) return;
        var almacen = String(row.almacen || "VAR").trim() || "VAR";
        var key = material + "|" + almacen;
        var cantidad = Number(row.cantidad);
        if (isNaN(cantidad)) cantidad = 0;
        if (!map[key]) {
            map[key] = {
                material: material,
                descripcion: row.descripcion || null,
                almacen: almacen,
                cantidad: cantidad
            };
            order.push(key);
        } else {
            map[key].cantidad += cantidad;
            if (!map[key].descripcion && row.descripcion) map[key].descripcion = row.descripcion;
            merged++;
        }
    });
    return {
        rows: order.map(function(key) { return map[key] }),
        merged: merged
    }
}

async function db_updateStock(stockData) {
    requireAuth();
    var sup = getSupabase();
    var result = { inserted: 0, errors: [], merged: 0 };
    try {
        var normalized = normalizeStockData(stockData);
        result.merged = normalized.merged;
        var del = await sup.from("stock").delete().neq("material", "_test_");
        if (del.error) throw del.error;
        if (normalized.rows.length > 0) {
            var batchSize = 500;
            for (var i = 0; i < normalized.rows.length; i += batchSize) {
                var batch = normalized.rows.slice(i, i + batchSize);
                var { error } = await sup.from("stock").insert(batch);
                if (error) throw error;
                result.inserted += batch.length;
            }
        }
    } catch (e) {
        result.errors.push(e.message);
    }
    return result;
}
async function db_updateEstadoFromSheets(contabilizados, facturados, onProgress) {
    requireAuth();
    var sup = getSupabase();
    var result = { contabilizados: 0, facturados: 0, errors: [] };
    try {
        var contKeys = {}, factKeys = {}, factFechaByKey = {}, factFacturaByKey = {}, docSeen = {}, docs = [];

        function addKey(row, target, fechaTarget, facturaTarget) {
            var doc = String(row.doc_vtas || "").trim(),
                mat = String(row.material || "").trim();
            if (!doc || !mat) return;
            var key = doc + "|" + mat;
            target[key] = true;
            if (fechaTarget && row.fecha_fact && !fechaTarget[key]) fechaTarget[key] = row.fecha_fact;
            if (facturaTarget && row.factura && !facturaTarget[key]) facturaTarget[key] = row.factura;
            if (!docSeen[doc]) {
                docSeen[doc] = true;
                docs.push(doc);
            }
        }

        (contabilizados || []).forEach(function(r) { addKey(r, contKeys) });
        (facturados || []).forEach(function(r) { addKey(r, factKeys, factFechaByKey, factFacturaByKey) });
        if (!docs.length) return result;

        var factIds = [], contIds = [], factIdMap = {}, contIdMap = {}, factFechaById = {}, factFacturaById = {};
        var DOC_CHUNK = 80, RANGE_SIZE = 1000;

        function queueUpdate(row, estado, key) {
            if (estado === "facturado") {
                if (!factIdMap[row.id]) {
                    factIdMap[row.id] = true;
                    factIds.push(row.id);
                }
                if (key && factFechaByKey[key]) factFechaById[row.id] = factFechaByKey[key];
                if (key && factFacturaByKey[key]) factFacturaById[row.id] = factFacturaByKey[key];
            } else if (!contIdMap[row.id]) {
                contIdMap[row.id] = true;
                contIds.push(row.id);
            }
        }

        function inspectRows(rows) {
            (rows || []).forEach(function(row) {
                var key = String(row.doc_vtas || "").trim() + "|" + String(row.material || "").trim();
                if (factKeys[key] && (row.estado === "contabilizado" || row.estado === "recuperado" || row.estado === "facturado")) {
                    queueUpdate(row, "facturado", key);
                } else if (contKeys[key] && row.estado === "recuperado") {
                    queueUpdate(row, "contabilizado", key);
                }
            });
        }

        for (var i = 0; i < docs.length; i += DOC_CHUNK) {
            var docChunk = docs.slice(i, i + DOC_CHUNK);
            if (onProgress) onProgress("Buscando items contabilizados/facturados", Math.min(i + docChunk.length, docs.length), docs.length);
            for (var from = 0;; from += RANGE_SIZE) {
                var query = sup.from("items_borrados")
                    .select("id, doc_vtas, material, estado")
                    .in("doc_vtas", docChunk)
                    .in("estado", ["recuperado", "contabilizado", "facturado"])
                    .order("id", { ascending: true });
                var { data: rows, error } = await query.range(from, from + RANGE_SIZE - 1);
                if (error) throw error;
                inspectRows(rows);
                if (!rows || rows.length < RANGE_SIZE) break;
            }
        }

        async function updateIdBatch(ids, estado) {
            var batchSize = 500;
            if (estado !== "facturado") {
                for (var i = 0; i < ids.length; i += batchSize) {
                    var batch = ids.slice(i, i + batchSize);
                    if (onProgress) onProgress("Actualizando estado " + estado, Math.min(i + batch.length, ids.length), ids.length);
                    var { error } = await sup.from("items_borrados").update({ estado: estado }).in("id", batch);
                    if (error) throw error;
                    result.contabilizados += batch.length;
                }
                return
            }
            var grouped = {};
            ids.forEach(function(id) {
                var fecha = factFechaById[id] || "__sin_fecha__";
                var factura = factFacturaById[id] || "";
                var groupKey = fecha + "||" + factura;
                if (!grouped[groupKey]) grouped[groupKey] = { fecha: fecha, factura: factura, ids: [] };
                grouped[groupKey].ids.push(id);
            });
            var done = 0, groupKeys = Object.keys(grouped);
            for (var gi = 0; gi < groupKeys.length; gi++) {
                var group = grouped[groupKeys[gi]], fechaKey = group.fecha, groupIds = group.ids;
                for (var fi = 0; fi < groupIds.length; fi += batchSize) {
                    var factBatch = groupIds.slice(fi, fi + batchSize),
                        payload = { estado: estado };
                    if (fechaKey !== "__sin_fecha__") payload.fecha_fact = fechaKey;
                    if (group.factura) payload.factura = group.factura;
                    if (onProgress) onProgress("Actualizando estado " + estado, Math.min(done + factBatch.length, ids.length), ids.length);
                    var { error: factError } = await sup.from("items_borrados").update(payload).in("id", factBatch);
                    if (factError) throw factError;
                    done += factBatch.length;
                    result.facturados += factBatch.length;
                }
            }
        }

        await updateIdBatch(factIds, "facturado");
        await updateIdBatch(contIds, "contabilizado");
    } catch (e) {
        result.errors.push(e.message);
    }
    return result;
}
function getSupabase() {
    return window.__criSupabase ? window.__criSupabase : !window.supabase || !window.supabase.createClient ? null : (window.__criSupabase = window.supabase.createClient("https://zglcxunmohgtnwhwuhoq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnbGN4dW5tb2hndG53aHd1aG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjE4MzEsImV4cCI6MjA5NDY5NzgzMX0.aeHx1WmjYy1rGfaCRQDAms1UdmebgNvYGB0WxTDCuxA", {
        auth: {
            persistSession: !1
        }
    }), window.__criSupabase)
}
async function db_importItems(items) {
    requireAuth();
    var supabase = getSupabase(),
        result = { inserted: 0, updated: 0, errors: [] };
    try {
        var docList = [];
        items.forEach(function(x) {
            x.doc_vtas && docList.indexOf(x.doc_vtas) === -1 && docList.push(x.doc_vtas)
        });
        if (docList.length === 0) return result;

        // Fetch ALL existing records (any estado) with pagination to avoid Supabase's 1000-row default cap
        var allExisting = [], PAGE = 1000, offset = 0;
        while (true) {
            var { data: page, error: err } = await supabase
                .from("items_borrados")
                .select("id, doc_vtas, fecha_carga, material, solic, estado, borrado_num")
                .in("doc_vtas", docList)
                .range(offset, offset + PAGE - 1);
            if (err) throw err;
            if (page && page.length > 0) allExisting = allExisting.concat(page);
            if (!page || page.length < PAGE) break;
            offset += PAGE;
        }

        // pendienteMap: pk → id del registro pendiente (para poder reclasificar si stock = 0)
        var pendienteMap = {};
        allExisting.forEach(function(r) {
            if (r.estado === "pendiente") {
                var pk = (r.doc_vtas || "") + "|" + (r.material || "") + "|" + (r.solic || "");
                pendienteMap[pk] = r.id;
            }
        });

        // managedMap: doc+material+solic → ids de registros ya gestionados (para marcar como items_borrado)
        var managedMap = {};
        var MANAGED_ESTADOS = ["recuperado", "contabilizado", "facturado"];
        allExisting.forEach(function(r) {
            if (MANAGED_ESTADOS.indexOf(r.estado) !== -1) {
                var mk = (r.doc_vtas || "") + "|" + (r.material || "") + "|" + (r.solic || "");
                if (!managedMap[mk]) managedMap[mk] = [];
                managedMap[mk].push(r.id);
            }
        });

        // sinStockExistingMap: registros ya clasificados como sin_stock → evitar duplicados
        var sinStockExistingMap = {};
        allExisting.forEach(function(r) {
            if (r.estado === "sin_stock") {
                var sk = (r.doc_vtas || "") + "|" + (r.material || "") + "|" + (r.solic || "");
                sinStockExistingMap[sk] = true;
            }
        });

        // borradoCountMap: key → número más alto de borrado existente (para incrementar)
        var borradoCountMap = {};
        allExisting.forEach(function(r) {
            if (r.estado === "items_borrado") {
                var bk = (r.doc_vtas || "") + "|" + (r.material || "") + "|" + (r.solic || "");
                borradoCountMap[bk] = Math.max(borradoCountMap[bk] || 0, r.borrado_num || 1);
            }
        });

        var toInsert = [], toMarkBorradoByKey = {};
        items.forEach(function(x) {
            var pk = (x.doc_vtas || "") + "|" + (x.material || "") + "|" + (x.solic || "");
            if (pendienteMap[pk] !== undefined) {
                result.updated++;
            } else if (sinStockExistingMap[pk]) {
                result.updated++;
            } else {
                toInsert.push(x);
                if (managedMap[pk]) {
                    var nextNum = (borradoCountMap[pk] || 0) + 1;
                    if (!toMarkBorradoByKey[pk]) toMarkBorradoByKey[pk] = { ids: [], num: nextNum };
                    managedMap[pk].forEach(function(id) { toMarkBorradoByKey[pk].ids.push(id); });
                }
            }
        });

        // Actualizar registros re-eliminados con número secuencial de borrado
        var totalBorrado = 0;
        for (var bpk in toMarkBorradoByKey) {
            var bEntry = toMarkBorradoByKey[bpk];
            var MB_CHUNK = 100;
            for (var mi = 0; mi < bEntry.ids.length; mi += MB_CHUNK) {
                var mbChunk = bEntry.ids.slice(mi, mi + MB_CHUNK);
                await supabase.from("items_borrados").update({ estado: "items_borrado", borrado_num: bEntry.num }).in("id", mbChunk);
            }
            totalBorrado += bEntry.ids.length;
        }
        result.updated += totalBorrado;

        if (toInsert.length > 0) {
            var INS_CHUNK = 500;
            for (var ci = 0; ci < toInsert.length; ci += INS_CHUNK) {
                var chunk = toInsert.slice(ci, ci + INS_CHUNK);
                var { error: insErr } = await supabase.from("items_borrados").insert(chunk);
                if (insErr) throw insErr;
                result.inserted += chunk.length;
            }
        }
    } catch (x) {
        result.errors.push({
            item: "batch",
            error: x.message
        });
    }
    return result
}
async function db_getItems(l) {
    requireAuth();
    var sup = getSupabase(), b = l.limit, allData = [], totalCount = 0;
    if (b > 0) {
        var d = sup.from("items_borrados").select("*", { count: "exact" });
        if (l.search) { const $ = l.search; d = d.or("doc_vtas.ilike.%" + $ + "%,material.ilike.%" + $ + "%,nombre.ilike.%" + $ + "%,solic.ilike.%" + $ + "%,denominacion.ilike.%" + $ + "%") }
        l.estado && (d = d.eq("estado", l.estado)), l.vendedor && (d = d.eq("vendedor_externo", l.vendedor)), l.fecha_desde && (d = d.gte("fecha_carga", l.fecha_desde)), l.fecha_hasta && (d = d.lte("fecha_carga", l.fecha_hasta));
        const g = l.page || 1, $ = (g - 1) * b, L = $ + b - 1;
        d = d.range($, L);
        const { data: k, error: E, count: I } = await d.order("fecha_carga", { ascending: !1 });
        if (E) throw E;
        return { data: k || [], count: I || 0 }
    }
    var d = sup.from("items_borrados").select("id", { count: "exact" });
    l.estado && (d = d.eq("estado", l.estado)), l.vendedor && (d = d.eq("vendedor_externo", l.vendedor)), l.fecha_desde && (d = d.gte("fecha_carga", l.fecha_desde)), l.fecha_hasta && (d = d.lte("fecha_carga", l.fecha_hasta));
    if (l.search) { const $ = l.search; d = d.or("doc_vtas.ilike.%" + $ + "%,material.ilike.%" + $ + "%,nombre.ilike.%" + $ + "%,solic.ilike.%" + $ + "%,denominacion.ilike.%" + $ + "%") }
    const { count: I, error: e1 } = await d.order("fecha_carga", { ascending: !1 });
    if (e1) throw e1;
    totalCount = I || 0;
    var batchSize = 1000;
    var batchPromises = [];
    for (var offset = 0; offset < totalCount; offset += batchSize) {
        var q = sup.from("items_borrados").select("*");
        l.estado && (q = q.eq("estado", l.estado)), l.vendedor && (q = q.eq("vendedor_externo", l.vendedor)), l.fecha_desde && (q = q.gte("fecha_carga", l.fecha_desde)), l.fecha_hasta && (q = q.lte("fecha_carga", l.fecha_hasta));
        if (l.search) { const $ = l.search; q = q.or("doc_vtas.ilike.%" + $ + "%,material.ilike.%" + $ + "%,nombre.ilike.%" + $ + "%,solic.ilike.%" + $ + "%,denominacion.ilike.%" + $ + "%") }
        batchPromises.push(q.range(offset, offset + batchSize - 1).order("fecha_carga", { ascending: !1 }));
    }
    var batchResults = await Promise.all(batchPromises);
    for (var bi = 0; bi < batchResults.length; bi++) {
        var br = batchResults[bi];
        if (br.error) throw br.error;
        if (br.data) allData = allData.concat(br.data)
    }
    return { data: allData, count: totalCount }
}
async function db_login(l, h) {
    const d = getSupabase(),
        { data: g, error: b } = await d.rpc("login_usuario", { p_id: l, p_pin: h });
    if (b) throw new Error(b.message || "PIN incorrecto");
    if (!g) throw new Error("Usuario no encontrado");
    return g
}
async function db_getUsers() {
    const l = getSupabase(),
        { data: h, error: d } = await l.rpc("get_usuarios_publicos");
    if (d) throw d;
    return h || []
}
async function db_getCatalogo() {
    const sup = getSupabase(),
        { data, error } = await sup.from("catalogo_materiales").select("material, marca, grupo, familia");
    if (error) throw error;
    return data || []
}
async function db_saveUser(l) {
    requireAuth();
    var current = window.currentUser || {};
    var userData = Object.assign({}, l);
    var isSupervisorSelfEdit = current.rol === "supervisor" && userData.id === current.id;
    if (current.rol !== "admin" && !isSupervisorSelfEdit) throw new Error("No autorizado");
    if (userData.pin && userData.pin.length !== 64) {
        userData.pin = await hashPin(userData.pin);
    }
    var adminPinHash = await hashPin(userData.admin_pin || "");
    if (!adminPinHash) throw new Error("Ingresá tu PIN para confirmar");
    delete userData.admin_pin;
    const h = getSupabase(),
        {
            data: d,
            error: g
        } = await h.rpc("guardar_usuario_admin", {
            p_actor_id: current.id,
            p_actor_pin_hash: adminPinHash,
            p_id: userData.id,
            p_nombre: userData.nombre,
            p_rol: userData.rol,
            p_pin_hash: userData.pin || "",
            p_activo: userData.activo !== false
        });
    if (g) throw g;
    return d
}
async function db_updateItem(l, h) {
    requireAuth();
    const d = getSupabase(),
        g = Ue(z({}, h), {
            fecha_gestion: new Date().toISOString()
        }),
        {
            error: b
        } = await d.from("items_borrados").update(g).eq("id", l);
    if (b) throw b
}
async function db_getRecentActivity(l) {
    requireAuth();
    l = l || 5;
    const h = getSupabase(),
        {
            data: d,
            error: g
        } = await h.from("items_borrados").select("id, doc_vtas, material, nombre, estado, recuperado_por, fecha_gestion, incidencia").not("recuperado_por", "is", null).order("fecha_gestion", {
            ascending: !1
        }).limit(l);
    if (g) throw g;
    return d || []
}
async function db_getChartData(desde, hasta) {
    var sup = getSupabase();
    if (!desde) { var def = new Date(); def.setDate(def.getDate() - 90); desde = def.toISOString().substring(0, 10) }
    if (!hasta) { hasta = new Date().toISOString().substring(0, 10) }
    var qCount = sup.from("items_borrados").select("id", { count: "exact" });
    qCount = qCount.gte("fecha_carga", desde + "T00:00:00");
    qCount = qCount.lte("fecha_carga", hasta + "T23:59:59");
    var { count: totalCount, error: countErr } = await qCount;
    if (countErr) throw countErr;
    if (!totalCount) return [];
    var batchSize = 1000, allData = [], batchPromises = [];
    for (var offset = 0; offset < totalCount; offset += batchSize) {
        var q = sup.from("items_borrados").select("fecha_carga, total_importe");
        q = q.gte("fecha_carga", desde + "T00:00:00");
        q = q.lte("fecha_carga", hasta + "T23:59:59");
        batchPromises.push(q.range(offset, offset + batchSize - 1).order("fecha_carga", { ascending: !0 }))
    }
    var batchResults = await Promise.all(batchPromises);
    for (var bi = 0; bi < batchResults.length; bi++) {
        var br = batchResults[bi];
        if (br.error) throw br.error;
        if (br.data) allData = allData.concat(br.data)
    }
    var map = {};
    allData.forEach(function(r) {
        var dateKey = r.fecha_carga ? r.fecha_carga.substring(0, 10) : "Sin fecha";
        map[dateKey] = map[dateKey] || { count: 0, monto: 0 };
        map[dateKey].count++;
        map[dateKey].monto += Number(r.total_importe) || 0
    });
    return Object.entries(map).map(function(e) { return { date: e[0], count: e[1].count, monto: e[1].monto } }).sort(function(a, b) { return a.date.localeCompare(b.date) })
}
async function db_getHoyItems(estado) {
    var sup = getSupabase();
    var hoy = new Date(),
        hoyStr = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');
    if (estado === "no_recuperado") {
        var estados = ["no_recuperado", "items_borrado", "sin_stock"];
        var results = await Promise.all(estados.map(function(est) {
            return sup.from("items_borrados").select("*").eq("estado", est).gte("fecha_gestion", hoyStr + "T00:00:00").lte("fecha_gestion", hoyStr + "T23:59:59").order("fecha_gestion", { ascending: false });
        }));
        var items = [];
        results.forEach(function(r) { if (r.error) throw r.error; if (r.data) items = items.concat(r.data); });
        items.sort(function(a, b) { return String(b.fecha_gestion || "").localeCompare(String(a.fecha_gestion || "")); });
        return items;
    }
    var dateField = estado === "facturado" ? "fecha_fact" : "fecha_gestion";
    var q = sup.from("items_borrados").select("*").eq("estado", estado).gte(dateField, hoyStr + "T00:00:00").lte(dateField, hoyStr + "T23:59:59").order(dateField, { ascending: false });
    var { data: d, error: e } = await q;
    if (e) throw e;
    return d || []
}
async function db_getEstadoItems(estado, limit) {
    var sup = getSupabase(), size = limit || 500;
    if (estado === "no_recuperado") {
        var estados = ["no_recuperado", "items_borrado", "sin_stock"];
        var results = await Promise.all(estados.map(function(est) {
            return sup.from("items_borrados").select("*", { count: "exact" }).eq("estado", est).order("fecha_gestion", { ascending: false }).range(0, size - 1);
        }));
        var items = [], count = 0;
        results.forEach(function(r) {
            if (r.error) throw r.error;
            count += r.count || 0;
            if (r.data) items = items.concat(r.data);
        });
        items.sort(function(a, b) { return String(b.fecha_gestion || "").localeCompare(String(a.fecha_gestion || "")); });
        return { items: items.slice(0, size), count: count };
    }
    var dateField = estado === "facturado" ? "fecha_fact" : "fecha_gestion",
        q = sup.from("items_borrados").select("*", { count: "exact" }).eq("estado", estado).order(dateField, { ascending: false }).range(0, size - 1);
    var { data: d, error: e, count: c } = await q;
    if (e) throw e;
    return { items: d || [], count: c || 0 }
}
async function db_getRecuperadosFlujoItems(scope, limit) {
    var sup = getSupabase(),
        estados = ["recuperado", "contabilizado", "facturado"],
        size = limit || 500,
        hoy = new Date(),
        hoyStr = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');
    var results = await Promise.all(estados.map(function(estado) {
        var dateField = estado === "facturado" ? "fecha_fact" : "fecha_gestion",
            q = sup.from("items_borrados").select("*", { count: "exact" }).eq("estado", estado).order(dateField, { ascending: !1 }).range(0, size - 1);
        if (scope === "hoy") q = q.gte(dateField, hoyStr + "T00:00:00").lte(dateField, hoyStr + "T23:59:59");
        return q
    }));
    var items = [], count = 0;
    results.forEach(function(r) {
        if (r.error) throw r.error;
        count += r.count || 0;
        if (r.data) items = items.concat(r.data)
    });
    var estadoOrder = { recuperado: 0, contabilizado: 1, facturado: 2 };
    items.sort(function(a, b) {
        var oa = estadoOrder[a.estado] !== undefined ? estadoOrder[a.estado] : 3;
        var ob = estadoOrder[b.estado] !== undefined ? estadoOrder[b.estado] : 3;
        if (oa !== ob) return oa - ob;
        var da = a.estado === "facturado" ? a.fecha_fact : a.fecha_gestion,
            db = b.estado === "facturado" ? b.fecha_fact : b.fecha_gestion;
        return String(db || "").localeCompare(String(da || ""))
    });
    return { items: items.slice(0, size), count: count }
}
async function db_getStats(l, desde, hasta) {
    requireAuth();
    const h = getSupabase();

    // 1 sola llamada al RPC en lugar de 19 queries paralelas
    const { data: s, error: rpcErr } = await h.rpc('get_dashboard_stats', {
        p_vendedor: l || null,
        p_desde: desde || null,
        p_hasta: hasta || null
    });
    if (rpcErr) throw new Error("Error al obtener stats: " + rpcErr.message);

    var flujoRecuperado        = (s.recuperado || 0) + (s.contabilizado || 0) + (s.facturado || 0),
        montoFlujoRecuperado   = (s.montoRecuperado || 0) + (s.montoContabilizado || 0) + (s.montoFacturado || 0),
        pendienteFacturar      = (s.recuperado || 0) + (s.contabilizado || 0),
        montoPendienteFacturar = (s.montoRecuperado || 0) + (s.montoContabilizado || 0),
        hoyFlujoRecuperado        = (s.hoyRecuperado || 0) + (s.hoyContabilizado || 0) + (s.hoyFacturado || 0),
        hoyMontoFlujoRecuperado   = (s.hoyMontoRecuperado || 0) + (s.hoyMontoContabilizado || 0) + (s.hoyMontoFacturado || 0),
        hoyPendienteFacturar      = (s.hoyRecuperado || 0) + (s.hoyContabilizado || 0),
        hoyMontoPendienteFacturar = (s.hoyMontoRecuperado || 0) + (s.hoyMontoContabilizado || 0);

    // Incidencias: consulta separada (datos distintos, no aplica al RPC)
    var v = {};
    try {
        var O = h.from("items_borrados").select("incidencia").eq("estado", "no_recuperado").not("incidencia", "is", null);
        if (l) O = O.eq("vendedor_externo", l);
        if (desde) O = O.gte("fecha_carga", desde + "T00:00:00");
        if (hasta) O = O.lte("fecha_carga", hasta + "T23:59:59");
        var { data: N } = await O;
        N && N.forEach(function(q) {
            q.incidencia && (v[q.incidencia] = (v[q.incidencia] || 0) + 1)
        })
    } catch(q) {}

    return {
        total: s.total,
        pendiente: s.pendiente,
        recuperado: s.recuperado,
        recuperadoBase: s.recuperado,
        no_recuperado: s.no_recuperado,
        contabilizado: s.contabilizado,
        facturado: s.facturado,
        recuperadoFlujo: flujoRecuperado,
        montoRecuperadoFlujo: montoFlujoRecuperado,
        pendienteFacturar: pendienteFacturar,
        montoPendienteFacturar: montoPendienteFacturar,
        totalMonto: s.montoTotal,
        montoPendiente: (s.montoTotal || 0) - (s.montoRecuperado || 0) - (s.montoNoRecuperado || 0) - (s.montoContabilizado || 0) - (s.montoFacturado || 0) - (s.montoItemsBorrado || 0) - (s.montoSinStock || 0),
        itemsBorrado: s.itemsBorrado || 0,
        montoItemsBorrado: s.montoItemsBorrado || 0,
        sinStock: s.sinStock || 0,
        montoSinStock: s.montoSinStock || 0,
        montoRecuperado: s.montoRecuperado,
        montoRecuperadoBase: s.montoRecuperado,
        montoNoRecuperado: s.montoNoRecuperado,
        montoContabilizado: s.montoContabilizado,
        montoFacturado: s.montoFacturado,
        hoyRecuperados: s.hoyRecuperado,
        hoyRecuperadosBase: s.hoyRecuperado,
        hoyMontoRecuperado: s.hoyMontoRecuperado,
        hoyMontoRecuperadoBase: s.hoyMontoRecuperado,
        hoyNoRecuperados: s.hoyNoRecuperado,
        hoyMontoNoRecuperado: s.hoyMontoNoRecuperado,
        hoyItemsBorrados: s.hoyItemsBorrado || 0,
        hoyMontoItemsBorrado: s.hoyMontoItemsBorrado || 0,
        hoySinStock: s.hoySinStock || 0,
        hoyMontoSinStock: s.hoyMontoSinStock || 0,
        hoyContabilizados: s.hoyContabilizado,
        hoyMontoContabilizado: s.hoyMontoContabilizado,
        hoyFacturados: s.hoyFacturado,
        hoyMontoFacturado: s.hoyMontoFacturado,
        hoyRecuperadoFlujo: hoyFlujoRecuperado,
        hoyMontoRecuperadoFlujo: hoyMontoFlujoRecuperado,
        hoyPendienteFacturar: hoyPendienteFacturar,
        hoyMontoPendienteFacturar: hoyMontoPendienteFacturar,
        porIncidencia: v
    }
}

function updateSidebarAvatar(l) {
    var h = document.getElementById("sidebarAvatar");
    if (h) {
        var d = (l || "?")[0].toUpperCase(),
            g = 0;
        if (l)
            for (var b = 0; b < l.length; b++) g += l.charCodeAt(b);
        var k = USER_COLORS[g % USER_COLORS.length];
        h.innerHTML = d + '<div class="online-dot"></div>', h.style.background = k
    }
}

function formatTopBrandDate(d) {
    return d.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

function getRowsDateRangeLabel(rows, getDateValue) {
    var minDate = null,
        maxDate = null;
    (rows || []).forEach(function(row) {
        var raw = getDateValue(row),
            dt = parseDateLocal(raw);
        if (!dt || isNaN(dt.getTime())) return;
        if (!minDate || dt < minDate) minDate = dt;
        if (!maxDate || dt > maxDate) maxDate = dt
    });
    if (!minDate || !maxDate) return "Sin registros";
    var desde = formatTopBrandDate(minDate),
        hasta = formatTopBrandDate(maxDate);
    return desde === hasta ? "Fecha: " + desde : "Desde " + desde + " hasta " + hasta
}

function updateTopBrand(l, subtitle) {
    const h = document.getElementById("topBrandTitle");
    if (!h) return;
    h.innerHTML = esc(l) + (subtitle ? ' <span class="top-brand-sub">' + esc(subtitle) + "</span>" : "")
}

function showLoaderMain(l, h) {
    const d = document.getElementById("loaderMain");
    d && (l ? (d.style.display = "flex", d.querySelector("#loaderMainText").textContent = h || "Cargando...") : d.style.display = "none")
}

function esc(l) {
    if (!l) return "";
    const h = document.createElement("div");
    return h.textContent = l, h.innerHTML
}

function escAttr(s) {
    return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")
}

function copyChip(text) {
    if (!text || text === "-") return '<span class="chip-empty">' + esc(text||"-") + '</span>'
    var safe = esc(text), attr = escAttr(text);
    return '<span class="copy-chip" data-copy="' + attr + '">' + safe + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span>'
}

document.addEventListener("click", function(e) {
    var chip = e.target.closest(".copy-chip");
    if (!chip || !navigator.clipboard) return;
    var text = chip.getAttribute("data-copy");
    if (!text) return;
    navigator.clipboard.writeText(text).then(function() {
        chip.classList.add("copied");
        setTimeout(function() { chip.classList.remove("copied") }, 1000);
    });
});

function parseDateLocal(l) {
    if (!l) return null;
    if (/^\d{4}-\d{2}-\d{2}/.test(l)) {
        var p = l.substring(0, 10).split("-");
        return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]))
    }
    var d = new Date(l);
    return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function fmtDate(l) {
    if (!l) return "-";
    try {
        const h = parseDateLocal(l);
        return !h || isNaN(h.getTime()) ? l : h.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    } catch (h) {
        return l
    }
}

function fmtNum(l) {
    if (l == null || l === "") return "-";
    var h = Number(l);
    return isNaN(h) ? l : h.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

function fmtInt(l) {
    if (l == null || l === "") return "-";
    var h = Number(l);
    return isNaN(h) ? l : Math.round(h).toLocaleString("es-AR")
}

function fmtGs(l) {
    return l == null || isNaN(Number(l)) ? "Gs 0" : "Gs " + Math.round(Number(l)).toLocaleString("es-AR")
}

function fmtDateTime(l) {
    if (!l) return "-";
    try {
        const h = parseDateLocal(l);
        return !h || isNaN(h.getTime()) ? l : h.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    } catch (h) {
        return l
    }
}

function timeAgo(l) {
    if (!l) return "";
    var h = new Date,
        d = new Date(l),
        g = h - d;
    if (g < 0) return "ahora";
    var b = Math.floor(g / 6e4);
    if (b < 1) return "ahora";
    if (b < 60) return "hace " + b + " min";
    var k = Math.floor(b / 60),
        E = b % 60,
        I = "hace " + k + "h";
    return E && (I += " " + E + "min"), I
}

var enhancedSelectRegistry = [],
    enhancedSelectDocClickBound = !1;

function pruneEnhancedSelectRegistry() {
    enhancedSelectRegistry = enhancedSelectRegistry.filter(function(entry) {
        return !!(entry && entry.root && entry.dropdown && entry.root.isConnected && entry.dropdown.isConnected)
    })
}

function registerEnhancedSelect(entry) {
    pruneEnhancedSelectRegistry();
    enhancedSelectRegistry.push(entry);
    if (!enhancedSelectDocClickBound) {
        enhancedSelectDocClickBound = !0;
        document.addEventListener("click", function(e) {
            pruneEnhancedSelectRegistry();
            enhancedSelectRegistry.forEach(function(item) {
                if (!item.root.contains(e.target)) item.dropdown.classList.remove("open")
            })
        })
    }
}

function enhanceSelect(l) {
    var h = document.getElementById(l);
    if (!h || h.dataset.enhanced) return;
    h.dataset.enhanced = "1";

    var icons = {
        itemsFilterVendedor: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        itemsFilterStock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/></svg>',
        itemsFilterGrupo: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h7v7H4z"/><path d="M13 4h7v7h-7z"/><path d="M13 13h7v7h-7z"/><path d="M4 13h7v7H4z"/></svg>',
        itemsFilterMarca: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
        recupFilterEstado: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
        recupFilterVendedor: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        recupFilterGrupo: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h7v7H4z"/><path d="M13 4h7v7h-7z"/><path d="M13 13h7v7h-7z"/><path d="M4 13h7v7H4z"/></svg>',
        recupFilterMarca: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
        incidFilterVendedor: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        incidFilterGrupo: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h7v7H4z"/><path d="M13 4h7v7h-7z"/><path d="M13 13h7v7h-7z"/><path d="M4 13h7v7H4z"/></svg>',
        incidFilterMarca: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>'
    };

    var d = document.createElement("div");
    d.className = "ssel";
    var g = document.createElement("button");
    g.className = "ssel-display", g.type = "button";

    var btnLeft = document.createElement("div");
    btnLeft.className = "ssel-btn-left";

    var ico = document.createElement("div");
    ico.className = "ssel-ico";
    ico.innerHTML = icons[l] || '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';

    var b = document.createElement("span");
    b.className = "ssel-dt";

    btnLeft.appendChild(ico);
    btnLeft.appendChild(b);
    g.appendChild(btnLeft);

    var k = document.createElement("span");
    k.className = "ssel-arrow", k.innerHTML = '⌄', g.appendChild(k);

    var E = document.createElement("div");
    E.className = "ssel-dd";

    var searchBox = document.createElement("div");
    searchBox.className = "ssel-search-box";
    var searchIcon = document.createElement("span");
    searchIcon.className = "ssel-search-icon";
    searchIcon.innerHTML = '⌕';
    var I = document.createElement("input");
    I.className = "ssel-inp", I.placeholder = "Buscar...", I.type = "text";
    searchBox.appendChild(searchIcon);
    searchBox.appendChild(I);

    var list = document.createElement("div");
    list.className = "ssel-list";

    E.appendChild(searchBox);
    E.appendChild(list);
    d.appendChild(g);
    d.appendChild(E);
    h.parentNode.insertBefore(d, h.nextSibling);
    h.style.display = "none";
    registerEnhancedSelect({
        root: d,
        dropdown: E
    });

    function getOptions() {
        for (var arr = [], i = 0; i < h.options.length; i++) arr.push({
            value: h.options[i].value,
            label: h.options[i].textContent
        });
        return arr
    }

    function renderList(filter) {
        list.innerHTML = "";
        var opts = getOptions(),
            q = (filter || "").toLowerCase().trim(),
            count = 0;
        opts.forEach(function(opt) {
            if (!(q && opt.label.toLowerCase().indexOf(q) === -1)) {
                var item = document.createElement("div");
                item.className = "ssel-item";
                if (opt.value === h.value) item.classList.add("on");

                var span = document.createElement("span");
                span.textContent = opt.label;
                item.appendChild(span);

                var check = document.createElement("span");
                check.className = "ssel-check";
                check.textContent = "✓";
                item.appendChild(check);

                item.dataset.value = opt.value;
                item.onclick = function() {
                    h.value = opt.value;
                    b.textContent = opt.label;
                    E.classList.remove("open");
                    I.value = "";
                    renderList("");
                    var evt = document.createEvent("Event");
                    evt.initEvent("change", true, true);
                    h.dispatchEvent(evt);
                };
                list.appendChild(item);
                count++
            }
        });
        if (!count) list.innerHTML = '<div class="ssel-empty">Sin resultados</div>'
    }

    function syncLabel() {
        b.textContent = h.options[h.selectedIndex] ? h.options[h.selectedIndex].textContent : ""
    }

    syncLabel();
    renderList("");
    g.onclick = function(e) {
        e.stopPropagation();
        var open = E.classList.toggle("open");
        if (open) { I.value = ""; I.focus(); renderList("") }
    };
    I.oninput = function() { renderList(this.value) };
    I.onkeydown = function(e) {
        if (e.key === "Escape") { E.classList.remove("open"); I.value = ""; renderList("") }
    }
}

function updateTopTime() {
    var l = document.getElementById("topUpdate"), t = localStorage.getItem("lastImportTime");
    if (!l) return;
    l.style.display = "inline-flex";
    if (!t) { l.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Última actualización —'; return }
    try {
        var d = new Date(parseInt(t)),
            now = new Date(),
            hh = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: !1 }),
            dd = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
            sameDay = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(),
            yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
        var sameYesterday = d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear(),
            prefix = sameDay ? "Hoy" : sameYesterday ? "Ayer" : dd;
        l.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Última actualización ' + prefix + " " + hh
    } catch (e) { l.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Última actualización —' }
}

async function doRefresh() {
    var btn = document.getElementById("refreshBtn");
    if (!btn || btn.classList.contains("loading")) return;
    btn.classList.add("loading");
    try {
        var vw = document.querySelector(".vw.on");
        if (vw && vw.id === "vwDashboard") await renderDashboard();
        else {
            document.querySelectorAll(".sidebar-nav .tab").forEach(function(t) {
                if (t.classList.contains("on")) { t.click(); return }
            })
        }
    } catch (e) {
        showToast("Error al actualizar: " + e.message, "error")
    } finally {
        btn.classList.remove("loading")
    }
}

function showToast(l, h, d) {
    h = h || "info", d = d || 3500;
    var g = document.getElementById("toastContainer");
    g || (g = document.createElement("div"), g.id = "toastContainer", g.className = "toast-container", document.body.appendChild(g));
    var b = document.createElement("div");
    b.className = "toast toast-" + h, b.textContent = l, g.appendChild(b), setTimeout(function() {
        b.classList.add("toast-leaving"), setTimeout(function() {
            b.parentNode && b.parentNode.removeChild(b)
        }, 300)
    }, d)
}

function showCenteredCheck(l, isError) {
    var overlay = document.createElement("div");
    overlay.className = "confirm-check-overlay";
    overlay.innerHTML = '<div class="confirm-check-box"><div class="confirm-check-circle' + (isError ? " error" : "") + '"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><div class="confirm-check-label">' + esc(l) + '</div></div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function() {
        setTimeout(function() {
            var box = overlay.querySelector(".confirm-check-box");
            if (box) { box.classList.add("exit"); }
            setTimeout(function() { overlay.remove(); }, 300);
        }, 900);
    });
}

function showConfirm(l, h, okLabel, cancelLabel) {
    return new Promise(function(d) {
        var g = document.createElement("div");
        okLabel = okLabel || "Confirmar";
        cancelLabel = cancelLabel || "Cancelar";
        g.className = "modal-overlay", g.style.display = "flex", g.innerHTML = '<div class="modal-box" style="max-width:400px;text-align:center"><div class="modal-body"><h3 style="margin:0 0 8px;font-size:17px;color:var(--text-main)">' + esc(l) + '</h3><p style="color:var(--text-muted);margin:0 0 20px;font-size:14px">' + esc(h) + '</p><div style="display:flex;gap:8px;justify-content:center"><button class="btn-revertir" id="confirmCancelBtn" style="padding:10px 24px">' + esc(cancelLabel) + '</button><button class="btn-recuperar" id="confirmOkBtn" style="padding:10px 24px">' + esc(okLabel) + '</button></div></div></div>', document.body.appendChild(g), requestAnimationFrame(function() {
            g.classList.add("is-open")
        });

        function b(k) {
            g.classList.remove("is-open"), g.classList.add("is-closing"), setTimeout(function() {
                g.parentNode && g.parentNode.removeChild(g), d(k)
            }, 400)
        }
        g.querySelector("#confirmCancelBtn").onclick = function() {
            b(!1)
        }, g.querySelector("#confirmOkBtn").onclick = function() {
            b(!0)
        }, g.onclick = function(k) {
            k.target === g && b(!1)
        }
    })
}

function showConfirmRecuperado(item) {
    var itemName = item ? (item.nombre || item.doc_vtas || "este item") : "este item";
    return new Promise(function(d) {
        var g = document.createElement("div");
        var detHtml = "";
        if (item) {
            detHtml += '<div style="background:#f8fafc;border-radius:8px;padding:14px;margin:0 0 16px;border:1px solid #e2e8f0"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 16px">';
            detHtml += '<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;font-weight:700;margin-bottom:2px">Cliente</div><div style="font-size:13px;font-weight:700;color:var(--text-main)">' + esc(item.nombre || "-") + '</div></div>';
            detHtml += '<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;font-weight:700;margin-bottom:2px">Doc Venta</div><div style="font-size:13px;font-weight:700;color:var(--text-main)">' + esc(item.doc_vtas || "-") + '</div></div>';
            detHtml += '<div style="grid-column:1/-1"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;font-weight:700;margin-bottom:2px">Material</div><div style="font-size:13px;font-weight:700;color:var(--text-main)"><code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:12px">' + esc(item.material || "-") + '</code> ' + esc(item.denominacion || "") + '</div></div>';
            detHtml += '<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;font-weight:700;margin-bottom:2px">Cantidad</div><div style="font-size:13px;font-weight:700;color:var(--text-main)">' + (item.cantidad_pedido || 0) + '</div></div>';
            detHtml += '<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;font-weight:700;margin-bottom:2px">Almac\u00E9n</div><div style="font-size:13px;font-weight:700;color:var(--text-main)">' + esc(item.almacen || "-") + '</div></div>';
            detHtml += '</div></div>';
        }
        g.className = "modal-overlay", g.style.display = "flex", g.innerHTML = '<div class="modal-box" style="max-width:380px !important;padding:0;overflow:hidden;border-radius:12px" onclick="event.stopPropagation()"><div style="background:#10B981;padding:18px 22px 14px;text-align:center"><div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto 8px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div><h3 style="margin:0;font-size:16px;font-weight:800;color:white">Confirmar Recuperaci\u00F3n</h3></div><div style="padding:18px 22px 20px">' + detHtml + '<div style="display:flex;gap:10px"><button class="btn-revertir" id="confirmRecupCancel" style="flex:1;padding:12px;font-size:13px;font-weight:600;border-radius:8px">Cancelar</button><button id="confirmRecupOk" style="flex:1;padding:12px;font-size:13px;font-weight:800;background:#10B981;color:white;border:none;border-radius:8px;cursor:pointer;box-shadow:0 4px 12px rgba(16,185,129,0.3)">S\u00ED, Recuperado</button></div></div></div>', document.body.appendChild(g), requestAnimationFrame(function() {
            g.classList.add("is-open")
        });

        function b(k) {
            g.classList.remove("is-open"), g.classList.add("is-closing"), setTimeout(function() {
                g.parentNode && g.parentNode.removeChild(g), d(k)
            }, 400)
        }
        g.querySelector("#confirmRecupCancel").onclick = function() {
            b(!1)
        }, g.querySelector("#confirmRecupOk").onclick = function() {
            b(!0)
        }, g.onclick = function(k) {
            k.target === g && b(!1)
        }
    })
}

function showNoRecuperadoModal(itemId) {
    var g = document.createElement("div"),
        item = (itemsState.all || []).find(function(x) { return x.id === itemId; }),
        motivos = getMotivos(),
        selectedMotivo = "",
        chipsHtml = "";
    motivos.forEach(function(m) {
        chipsHtml += '<button class="motivo-chip" data-value="' + esc(m.id) + '" style="padding:8px 16px;font-size:13px;font-weight:600;border-radius:100px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-muted);cursor:pointer;transition:all .15s ease;box-shadow:0 1px 3px rgba(0,0,0,0.04)">' + esc(m.nm) + "</button>";
    });
    chipsHtml += '<button class="motivo-chip motivo-otro" style="padding:8px 16px;font-size:13px;font-weight:600;border-radius:100px;border:1px dashed var(--border-color);background:transparent;color:var(--brand-light);cursor:pointer;transition:all .15s ease">Otro...</button>';
    g.className = "modal-overlay", g.style.display = "flex", g.innerHTML = '<div class="modal-box" style="max-width:380px !important;padding:0;overflow:hidden;border-radius:12px" onclick="event.stopPropagation()"><div style="background:#EF4444;padding:18px 22px 14px;text-align:center"><div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto 8px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div><h3 style="margin:0;font-size:16px;font-weight:800;color:white">No Recuperado</h3></div><div style="padding:18px 22px 20px"><div style="margin-bottom:16px"><label style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:800;color:var(--text-muted);margin-bottom:10px">Motivo</label><div class="motivo-chips" style="display:flex;flex-wrap:wrap;gap:8px">' + chipsHtml + '</div></div><div style="display:flex;gap:10px"><button id="noRecupCancelBtn" style="flex:1;padding:12px;font-size:13px;font-weight:600;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-body);color:var(--text-main);cursor:pointer">Cancelar</button><button id="noRecupConfirmBtn" style="flex:1;padding:12px;font-size:13px;font-weight:800;background:#EF4444;color:white;border:none;border-radius:8px;cursor:pointer;box-shadow:0 4px 12px rgba(239,68,68,0.3);opacity:0.5">Confirmar</button></div></div></div>', document.body.appendChild(g), requestAnimationFrame(function() {
        g.classList.add("is-open")
    });

    var confirmBtn = g.querySelector("#noRecupConfirmBtn");

    function updateConfirm() {
        confirmBtn.style.opacity = selectedMotivo ? "1" : "0.5";
    }

    g.querySelectorAll(".motivo-chip").forEach(function(btn) {
        btn.onclick = function() {
            g.querySelectorAll(".motivo-chip").forEach(function(b) {
                b.style.borderColor = "var(--border-color)";
                b.style.background = "var(--bg-surface)";
                b.style.color = "var(--text-muted)";
            });
            if (btn.classList.contains("motivo-otro")) {
                var nuevo = prompt("Especific\u00E1 el motivo:");
                if (nuevo && nuevo.trim()) {
                    selectedMotivo = "otro";
                    btn.style.borderColor = "#EF4444";
                    btn.style.background = "rgba(239,68,68,0.1)";
                    btn.style.color = "#DC2626";
                    btn.textContent = "Otro: " + esc(nuevo.trim());
                    window._otroMotivoText = nuevo.trim();
                    updateConfirm()
                }
                return
            }
            selectedMotivo = btn.dataset.value;
            btn.style.borderColor = "#EF4444";
            btn.style.background = "rgba(239,68,68,0.1)";
            btn.style.color = "#DC2626";
            updateConfirm()
        }
    });

    function closeModal() {
        g.classList.remove("is-open"), g.classList.add("is-closing"), setTimeout(function() {
            g.parentNode && g.parentNode.removeChild(g)
        }, 400)
    }

    g.querySelector("#noRecupCancelBtn").onclick = closeModal;
    g.querySelector("#noRecupConfirmBtn").onclick = async function() {
        if (!selectedMotivo) { showToast("Seleccion\u00E1 un motivo", "error"); return }
        var motivoFinal = selectedMotivo === "otro" ? window._otroMotivoText || "otro" : selectedMotivo;
        closeModal();
        try {
            var b = window.currentUser;
            await db_updateItem(itemId, {
                estado: "no_recuperado",
                incidencia: motivoFinal,
                motivo_rechazo: "",
                recuperado_por: b ? b.nombre : "Sistema"
            });
            var k = itemsState.all.findIndex(function(E) { return E.id === itemId });
            if (k >= 0) {
                itemsState.all.splice(k, 1);
            }
            closeItemModal();
            applyItemsFilters();
            checkNewNotifications();
            showCenteredCheck("No Recuperado", true);
        } catch (e) {
            showToast("Error: " + e.message, "error")
        }
    };
    g.onclick = function(k) {
        k.target === g && closeModal()
    }
}

var _importActive = !1, _importPendingPct = null;

function setImportProgress(l) {
    _importPendingPct = l;
    if (l < 0) {
        var h = document.getElementById("gip"),
            d = document.getElementById("gipFill"),
            g = document.getElementById("gipPct");
        if (h) h.style.display = "none";
        _importActive = !1; _importPendingPct = null;
        return
    }
    if (!_importActive) {
        _importActive = !0;
        requestAnimationFrame(function rafFn() {
            var pct = _importPendingPct;
            var h = document.getElementById("gip"),
                d = document.getElementById("gipFill"),
                g = document.getElementById("gipPct");
            if (!h || !d || !g) { _importActive = !1; return }
            h.style.display = "flex", d.style.width = pct + "%", g.textContent = pct + "%";
            if (pct >= 100) { _importActive = !1; _importPendingPct = null; return }
            requestAnimationFrame(rafFn)
        })
    }
    var _bf = document.getElementById('importBgFill'), _bp = document.getElementById('importBgPct');
    if (l >= 0) { if (_bf) _bf.style.width = l + '%'; if (_bp) _bp.textContent = l + '%'; }
}
var _importJob = null;
function _createImportBanner() {
    if (document.getElementById('importBgBanner')) return;
    var el = document.createElement('div');
    el.id = 'importBgBanner';
    el.className = 'import-bg-banner';
    el.innerHTML = '<div class="import-bg-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div><div class="import-bg-body"><span class="import-bg-label">Importando en segundo plano</span><span class="import-bg-text" id="importBgText">Preparando...</span><div class="import-bg-bar"><div class="import-bg-fill" id="importBgFill"></div></div></div><span class="import-bg-pct" id="importBgPct">0%</span><button class="import-bg-cancel" onclick="cancelBgImport()" title="Cancelar importación"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancelar</button>';
    document.body.appendChild(el);
    requestAnimationFrame(function() { requestAnimationFrame(function() { el.classList.add('is-visible'); }); });
    var src = document.getElementById('importProgressText');
    if (src) {
        var bt = document.getElementById('importBgText');
        var obs = new MutationObserver(function() { if (bt) bt.textContent = src.textContent; });
        obs.observe(src, { childList: true, characterData: true, subtree: true });
        el._textObs = obs;
    }
}
function _hideImportBanner() {
    var el = document.getElementById('importBgBanner');
    if (!el) return;
    if (el._textObs) { el._textObs.disconnect(); el._textObs = null; }
    el.classList.remove('is-visible');
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
}
function cancelBgImport() {
    if (_importJob) _importJob.cancelled = true;
    _hideImportBanner();
    showToast('Importación cancelada', 'warning', 3000);
}
document.addEventListener("keydown", function(l) {
    if (l.key === "Escape") {
        var h = document.getElementById("loginUserDropdown");
        if (h && h.style.display !== "none") {
            typeof setLoginSelectOpen == "function" && setLoginSelectOpen(!1);
            return
        }
        if (typeof closeFormatoHoja == "function") {
            var d = document.getElementById("formatoHojaModal");
            if (d && d.classList.contains("is-open")) {
                closeFormatoHoja();
                return
            }
        }
        if (typeof closeItemModal == "function") {
            var g = document.getElementById("itemModal");
            if (g && g.classList.contains("is-open")) {
                closeItemModal();
                return
            }
        }
        var b = document.getElementById("userModal");
        if (b && b.style.display !== "none") {
            b.style.display = "none";
            return
        }
        closeNotifDropdown()
    }
});
var notifOpen = !1, notifPollInterval = null;

function stopNotifPolling() {
    if (notifPollInterval) {
        clearInterval(notifPollInterval);
        notifPollInterval = null
    }
}

function startNotifPolling(runNow) {
    if (!window.currentUser || document.hidden) return;
    if (runNow) checkNewNotifications();
    if (notifPollInterval) return;
    notifPollInterval = setInterval(function() {
        document.hidden || checkNewNotifications()
    }, 30000)
}

function closeNotifDropdown() {
    if (notifOpen) {
        var l = document.getElementById("notifDropdown");
        l && (l.classList.remove("is-open"), setTimeout(function() {
            l.style.display = "none"
        }, 200)), notifOpen = !1
    }
}
async function checkNewNotifications() {
    if (!window.currentUser || document.hidden) return;
    var lst = localStorage.getItem("notifLastCheck");
    if (!lst) { localStorage.setItem("notifLastCheck", new Date().toISOString()); return }
    try {
        const sup = getSupabase();
        var q = sup.from("items_borrados").select("id", {
            count: "exact",
            head: !0
        }).not("recuperado_por", "is", null).gte("fecha_gestion", lst);
        var {
            count: d,
            error: g
        } = await q;
        if (g) throw g;
        var cnt = d || 0;
        var badge = document.getElementById("notifBadge");
        if (badge) { badge.textContent = cnt; badge.style.display = cnt > 0 ? "flex" : "none" }
    } catch(e) { console.warn("checkNotif:",e) }
}
async function toggleNotifDropdown() {
    var l = document.getElementById("notifDropdown");
    if (notifOpen) {
        closeNotifDropdown();
        return
    }
    l.style.display = "block", setTimeout(function() {
        l.classList.add("is-open")
    }, 10), notifOpen = !0;
    var badge = document.getElementById("notifBadge");
    if (badge) { badge.style.display = "none"; badge.textContent = "0" }
    localStorage.setItem("notifLastCheck", new Date().toISOString());
    var h = document.getElementById("notifBody");
    if (h) {
        h.innerHTML = '<div class="top-notif-loading">Cargando...</div>';
        try {
            var d = await db_getRecentActivity(10);
            d && d.length ? h.innerHTML = d.map(function(g) {
                var b = ESTADOS[g.estado] || ESTADOS.pendiente,
                    k = INCIDENCIAS.find(function(E) {
                        return E.id === g.incidencia
                    });
                return '<div class="notif-item"><span class="notif-item-dot" style="background:' + b.c + '"></span><div class="notif-item-body"><strong>' + esc(g.recuperado_por) + "</strong> marc\xF3 <strong>" + esc(g.nombre || g.doc_vtas) + '</strong><div class="notif-item-meta"><span class="status-badge" style="background:' + b.bg + ";color:" + b.tc + ';font-size:10px">' + b.nm + "</span>" + (k ? ' <span class="inc-badge" style="background:' + k.c + "22;color:" + k.c + ';font-size:9px">' + k.nm + "</span>" : "") + ' <span class="notif-item-time">' + timeAgo(g.fecha_gestion) + "</span></div></div></div>"
            }).join("") : h.innerHTML = '<div class="top-notif-empty">Sin actividad reciente</div>'
        } catch (g) {
            h.innerHTML = '<div class="top-notif-empty">Error al cargar</div>'
        }
    }
}
document.addEventListener("click", function(l) {
    var h = document.getElementById("notifBtn"),
        d = document.getElementById("notifDropdown");
    notifOpen && h && !h.contains(l.target) && d && !d.contains(l.target) && closeNotifDropdown()
}), document.addEventListener("visibilitychange", function() {
    document.hidden ? stopNotifPolling() : startNotifPolling(!0)
}), window.addEventListener("online", function() {
    var l = document.querySelector(".top-status .status-dot"),
        h = document.querySelector(".top-status");
    l && (l.style.background = "#22c55e"), h && (h.childNodes[1].textContent = "Conectado")
}), window.addEventListener("offline", function() {
    var l = document.querySelector(".top-status .status-dot"),
        h = document.querySelector(".top-status");
    l && (l.style.background = "#ef4444"), h && (h.childNodes[1].textContent = "Sin conexi\xF3n")
});
function getLoginSelectedUser() {
    const select = document.getElementById("loginUserNative");
    const selectedId = select ? select.value : "";
    return (_loginUsers || []).find(function(user) { return user.id === selectedId; }) || null;
}

function loginUserNeedsPin(userOrRole) {
    if (userOrRole && typeof userOrRole === "object" && Object.prototype.hasOwnProperty.call(userOrRole, "tiene_pin")) {
        return userOrRole.tiene_pin === true || userOrRole.tiene_pin === "true";
    }
    const rol = (typeof userOrRole === "string" ? userOrRole : (userOrRole && userOrRole.rol) || "").toLowerCase().trim();
    return rol === "admin" || rol === "supervisor";
}

function syncLoginPinVisibility(userOrRole) {
    const needsPin = loginUserNeedsPin(userOrRole || getLoginSelectedUser());
    const pinContainer = document.getElementById("loginPinContainer");
    const pinInput = document.getElementById("loginPin");
    const pinStatus = document.getElementById("loginPinStatus");
    if (pinContainer) pinContainer.style.display = needsPin ? "block" : "none";
    if (!needsPin && pinInput) pinInput.value = "";
    if (pinStatus) {
        pinStatus.textContent = "";
        pinStatus.style.display = "none";
    }
    return needsPin;
}

async function doLogin() {
    var k;
    const l = document.getElementById("loginSubmitBtn"),
        h = document.getElementById("loginError"),
        d = document.getElementById("loginPinStatus");
    h.textContent = "", h.style.display = "none", d.textContent = "";
    const g = document.getElementById("loginUserNative").value,
        b = document.getElementById("loginPin").value;
    if (!g) {
        h.textContent = "Seleccion\xE1 un usuario", h.style.display = "block";
        return
    }
    const selectedUser = getLoginSelectedUser();
    const needsPin = selectedUser ? loginUserNeedsPin(selectedUser) : true;
    if (needsPin && !b) {
        h.textContent = "Ingres\u00e1 tu PIN", h.style.display = "block";
        document.getElementById("loginPin").focus();
        return
    }
    try { checkLoginLock(); } catch(lockErr) {
        h.textContent = lockErr.message, h.style.display = "block"; return;
    }
    l.disabled = !0, l.querySelector("#loginSubmitLabel").textContent = "Ingresando...";
    try {
        const hashedPin = needsPin ? await hashPin(b) : "";
        const E = await db_login(g, hashedPin);
        resetLoginAttempts();
        saveSession(E), document.getElementById("loginOverlay").style.display = "none", document.getElementById("appMain").style.display = "flex", document.getElementById("sidebarUserName").textContent = E.nombre, document.getElementById("sidebarUserRole").textContent = ((k = ROLES[E.rol]) == null ? void 0 : k.nm) || E.rol, updateSidebarAvatar(E.nombre),             (E.rol === "admin" || E.rol === "supervisor") && (document.getElementById("navAdminTitle").style.display = "block", document.getElementById("btnAdminUsers").style.display = "flex"), (E.rol === "admin" || E.rol === "operario") && (document.getElementById("btnImport").style.display = "flex"), renderDashboard(), startNotifPolling(!0)
    } catch (E) {
        recordFailedAttempt();
        var rem = LOGIN_MAX_ATTEMPTS - _loginAttempts.count;
        h.textContent = E.message + (rem > 0 && rem < LOGIN_MAX_ATTEMPTS ? " (" + rem + " intento" + (rem !== 1 ? "s" : "") + " restante)" : "");
        h.style.display = "block", l.disabled = !1, l.querySelector("#loginSubmitLabel").textContent = "Ingresar"
    }
}
let _loginUsers = [];
async function loadLoginUsers() {
    try {
        _loginUsers = await db_getUsers(), renderLoginUsers(_loginUsers)
    } catch (h) {
        var l = document.getElementById("loginError");
        l.textContent = "Error al cargar usuarios: " + h.message, l.style.display = "block"
    }
}

function renderLoginUsers(l) {
    const h = document.getElementById("loginUserNative"),
        d = document.getElementById("loginUserList");
    h.innerHTML = '<option value="">Seleccionar usuario...</option>', d.innerHTML = "", l.forEach(g => {
        var I;
        const b = document.createElement("option");
        b.value = g.id, b.textContent = g.nombre, b.dataset.rol = g.rol || "", h.appendChild(b);
        const k = document.createElement("div");
        k.className = "login-user-opt", k.setAttribute("role", "option"), k.dataset.value = g.id;
        const E = (g.nombre || "?")[0].toUpperCase();
        k.innerHTML = '<div class="login-user-opt-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div><div class="login-user-avatar" style="background:' + USER_COLORS[l.indexOf(g) % USER_COLORS.length] + '">' + E + '</div><div class="login-user-copy"><div class="login-user-name">' + escHtml(g.nombre) + '</div><div class="login-user-meta">' + (((I = ROLES[g.rol]) == null ? void 0 : I.nm) || g.rol) + "</div></div>", k.onclick = () => selectLoginUser(g), d.appendChild(k)
    });
    h.onchange = function() {
        const selected = (_loginUsers || []).find(function(user) { return user.id === h.value; });
        if (selected) {
            selectLoginUser(selected);
        } else {
            document.getElementById("loginUserSelectedText").innerHTML = "Seleccionar identidad...";
            syncLoginPinVisibility({ tiene_pin: false });
        }
    }
}
var escHtml = esc;
(function() {
    const l = document.getElementById("loginUserSearch");
    l && l.addEventListener("input", function() {
        const h = this.value.toLowerCase().trim(),
            d = _loginUsers.filter(g => g.nombre.toLowerCase().includes(h));
        renderLoginUsers(d.length > 0 ? d : _loginUsers)
    })
})();

function selectLoginUser(l, h, d) {
    var k;
    var user = (l && typeof l === "object") ? l : { id: l, nombre: h, rol: d };
    document.getElementById("loginUserNative").value = user.id || "";
    var g = document.getElementById("loginUserSelectedText"),
        b = ((k = ROLES[user.rol]) == null ? void 0 : k.nm) || user.rol || "";
    g.innerHTML = '<span class="login-selected-name">' + escHtml(user.nombre || "") + '</span><span class="login-selected-meta">' + escHtml(b) + "</span>", setLoginSelectOpen(!1);
    const needsPin = syncLoginPinVisibility(user);
    if (needsPin) document.getElementById("loginPin").focus();
    else document.getElementById("loginSubmitBtn").focus();
}
let loginSelectOpen = !1;

function toggleLoginSelect() {
    setLoginSelectOpen(!loginSelectOpen)
}

function setLoginSelectOpen(l) {
    loginSelectOpen = l;
    const h = document.getElementById("loginUserDropdown"),
        d = document.getElementById("loginUserDisplay");
    h.style.display = l ? "flex" : "none", d.setAttribute("aria-expanded", String(l)), l && (document.getElementById("loginUserSearch").value = "", document.getElementById("loginUserSearch").focus())
}

function logout() {
    stopNotifPolling(), sessionStorage.removeItem("cri_user"), window.currentUser = null, document.getElementById("appMain").style.display = "none", document.getElementById("loginOverlay").style.display = "flex", document.getElementById("loginPin").value = "", document.getElementById("loginPinContainer").style.display = "none", document.getElementById("loginUserSelectedText").innerHTML = "Seleccionar identidad...", document.getElementById("loginUserNative").value = "", document.getElementById("navAdminTitle").style.display = "none", document.getElementById("btnAdminUsers").style.display = "none", document.getElementById("btnImport").style.display = "none"
}
var _dashRenderSeq = 0,
    DASH_MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function getDashDefaultMonth() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
}

function isDashMonthValue(value) {
    return /^\d{4}-\d{2}$/.test(String(value || ""))
}

function getDashMonthBounds(monthValue) {
    var safeMonth = isDashMonthValue(monthValue) ? monthValue : getDashDefaultMonth(),
        parts = safeMonth.split("-"),
        year = parseInt(parts[0], 10),
        month = parseInt(parts[1], 10) - 1,
        lastDay = new Date(year, month + 1, 0).getDate();
    return {
        monthValue: safeMonth,
        year: year,
        month: month,
        desde: safeMonth + "-01",
        hasta: safeMonth + "-" + String(lastDay).padStart(2, "0")
    }
}

function getDashFullMonthFromRange(desde, hasta) {
    if (!desde || !hasta || !/^\d{4}-\d{2}-\d{2}$/.test(desde) || !/^\d{4}-\d{2}-\d{2}$/.test(hasta)) return "";
    var monthValue = desde.substring(0, 7),
        bounds = getDashMonthBounds(monthValue);
    return desde === bounds.desde && hasta === bounds.hasta ? monthValue : ""
}

function getDashFilterState() {
    var hasControls = !!(document.getElementById("dashFilterMesValue") || document.getElementById("dashFilterFechaDesde") || document.getElementById("dashFilterFechaHasta")),
        monthValue = readControlValue("dashFilterMesValue") || getDashDefaultMonth();
    if (!isDashMonthValue(monthValue)) monthValue = getDashDefaultMonth();

    var desde = readControlValue("dashFilterFechaDesde"),
        hasta = readControlValue("dashFilterFechaHasta");

    if (!hasControls) {
        var initialBounds = getDashMonthBounds(monthValue);
        desde = initialBounds.desde;
        hasta = initialBounds.hasta;
    }

    var fullMonth = getDashFullMonthFromRange(desde, hasta);
    if (fullMonth) monthValue = fullMonth;
    else if (desde && /^\d{4}-\d{2}-\d{2}$/.test(desde)) monthValue = desde.substring(0, 7);

    return {
        monthValue: monthValue,
        desde: desde,
        hasta: hasta,
        isAll: !desde && !hasta,
        isFullMonth: !!fullMonth,
        isCustomRange: !!(desde || hasta) && !fullMonth
    }
}

function writeDashFilterState(state) {
    writeControlValue("dashFilterMesValue", state.monthValue || getDashDefaultMonth());
    writeControlValue("dashFilterFechaDesde", state.desde || "");
    writeControlValue("dashFilterFechaHasta", state.hasta || "");
}

function setDashMonthFilter(monthValue) {
    var bounds = getDashMonthBounds(monthValue);
    writeDashFilterState({
        monthValue: bounds.monthValue,
        desde: bounds.desde,
        hasta: bounds.hasta
    });
    syncDateTriggerUI("dash");
    return bounds
}

function setDashLoading(root, isLoading) {
    if (!root) return;
    var existing = root.querySelector(".dash-loading-overlay");
    if (!isLoading) {
        if (existing) existing.remove();
        return;
    }
    if (existing) return;
    var overlay = document.createElement("div");
    overlay.className = "dash-loading-overlay";
    overlay.innerHTML = '<div class="dash-loading-card" role="status" aria-live="polite"><span class="dash-loading-spinner"></span><span>Actualizando</span></div>';
    root.appendChild(overlay);
}

async function renderDashboard() {
    const l = document.getElementById("vwDashboard");
    var renderSeq = ++_dashRenderSeq;
    document.querySelectorAll(".vw").forEach(h => h.classList.remove("on")), l.classList.add("on"), document.querySelectorAll(".sidebar-nav .tab").forEach(h => h.classList.remove("on")), document.getElementById("btnDashboard").classList.add("on"), updateTopBrand("Dashboard Gestión de Pedidos Recuperados");
    var dashState = getDashFilterState(),
        dashDesde = dashState.desde,
        dashHasta = dashState.hasta;
    writeDashFilterState(dashState);
    syncDateTriggerUI("dash");
    setDashLoading(l, true);
    try {
        const h = getSupabase();
        function applyDashDateFilter(q) {
            if (dashDesde) q = q.gte("fecha_carga", dashDesde + "T00:00:00");
            if (dashHasta) q = q.lte("fecha_carga", dashHasta + "T23:59:59");
            return q;
        }
        const [stats, venRows, cliRows, chartData] = await Promise.all([
            db_getStats(null, dashDesde, dashHasta),
            applyDashDateFilter(h.from("items_borrados").select("vendedor_externo, total_importe, estado").not("vendedor_externo", "is", null)),
            applyDashDateFilter(h.from("items_borrados").select("nombre, total_importe, estado").not("nombre", "is", null)),
            db_getChartData(dashDesde, dashHasta)
        ]);
        if (renderSeq !== _dashRenderSeq) return;
        var venMap = {}, cliMap = {};
        var RES_ESTS = ["pendiente", "recuperado", "contabilizado", "facturado", "no_recuperado", "sin_stock"];
        function mkMapEntry() { var e = { items: 0, monto: 0, est: {} }; RES_ESTS.forEach(function(s) { e.est[s] = { items: 0, monto: 0 }; }); return e; }
        (venRows.data || []).forEach(function(r) {
            var v = r.vendedor_externo || "Sin Vendedor";
            venMap[v] = venMap[v] || mkMapEntry();
            venMap[v].items++; venMap[v].monto += Number(r.total_importe) || 0;
            var es = r.estado || "pendiente"; if (venMap[v].est[es]) { venMap[v].est[es].items++; venMap[v].est[es].monto += Number(r.total_importe) || 0; }
        });
        (cliRows.data || []).forEach(function(r) {
            var c = r.nombre || "Sin Cliente";
            cliMap[c] = cliMap[c] || mkMapEntry();
            cliMap[c].items++; cliMap[c].monto += Number(r.total_importe) || 0;
            var es = r.estado || "pendiente"; if (cliMap[c].est[es]) { cliMap[c].est[es].items++; cliMap[c].est[es].monto += Number(r.total_importe) || 0; }
        });
        var venList = Object.entries(venMap).map(function(e) { return { nombre: e[0], items: e[1].items, monto: e[1].monto, est: e[1].est } }).sort(function(a, b) { return ((b.est.facturado||{}).monto||0) - ((a.est.facturado||{}).monto||0); }),
            cliList = Object.entries(cliMap).map(function(e) { return { nombre: e[0], items: e[1].items, monto: e[1].monto, est: e[1].est } }).sort(function(a, b) { return ((b.est.facturado||{}).monto||0) - ((a.est.facturado||{}).monto||0); });
        l.innerHTML = buildDashHtml(stats, venList, cliList, chartData, dashDesde, dashHasta);
        syncDateTriggerUI("dash");
        requestAnimationFrame(function() {
            if (renderSeq !== _dashRenderSeq) return;
            animateDashboardCounters(l);
            var charts = l.querySelector('.dash-charts');
            var resumen = l.querySelector('.resumen-grid');
            if (charts && resumen) resumen.parentNode.insertBefore(charts, resumen.nextSibling);
            initResumenPagers(l);
        })
    } catch (h) {
        if (renderSeq !== _dashRenderSeq) return;
        l.innerHTML = '<div class="error-state"><div class="error-msg">Error al cargar: ' + h.message + '</div></div>'
    } finally {
        if (renderSeq === _dashRenderSeq) setDashLoading(l, false);
        if (renderSeq === _dashRenderSeq) updateTopTime()
    }
}

function onDashMesNav(dir) {
    var current = getDashMonthBounds(readControlValue("dashFilterMesValue")),
        year = current.year,
        month = current.month;
    month += dir;
    if (month < 0) { month = 11; year--; }
    if (month > 11) { month = 0; year++; }
    var val = year + '-' + String(month + 1).padStart(2, '0');
    setDashMonthFilter(val);
    renderDashboard();
}

function showAllDashMonths() {
    writeDashFilterState({
        monthValue: readControlValue("dashFilterMesValue") || getDashDefaultMonth(),
        desde: "",
        hasta: ""
    });
    syncDateTriggerUI("dash");
    renderDashboard();
}

function buildChartSvg(data, type) {
    if (!data || data.length === 0) return '<div style="padding:60px 20px;text-align:center;color:var(--text-muted);font-size:13px">Sin datos para el período</div>';
    var isMonto = type === "monto";
    var w = 600, h = 260, padL = 16, padR = 16, padT = 24, padB = 52;
    var chartW = w - padL - padR, chartH = h - padT - padB;
    var steps = Math.min(data.length, 30);
    var visible = data.slice(-steps);
    var vValues = visible.map(function(d) { return isMonto ? d.monto : d.count });
    var vMax = Math.max.apply(null, vValues) || 1;
    var barW = Math.max(8, Math.min(40, (chartW - (visible.length - 1) * 4) / visible.length));
    var gap = Math.max(3, Math.min(6, (chartW - visible.length * barW) / Math.max(1, visible.length - 1)));
    var totalW = Math.min(chartW, visible.length * (barW + gap) - gap);
    var offX = padL + (chartW - totalW) / 2;
    var bars = "", labels = "", grid = "";
    var ySteps = 4;
    for (var yi = 0; yi <= ySteps; yi++) {
        var yPos = padT + chartH / ySteps * yi;
        grid += '<line x1="' + padL + '" y1="' + yPos + '" x2="' + (w - padR) + '" y2="' + yPos + '" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="3,3"/>'
    }
    var overlays = "";
    for (var i = 0; i < visible.length; i++) {
        var d = visible[i],
            val = isMonto ? d.monto : d.count,
            barH = (val / vMax) * chartH,
            x = offX + i * (barW + gap),
            y = padT + chartH - barH,
            color = isMonto ? "var(--status-ok)" : "var(--brand-primary)";
        bars += '<rect class="chart-bar" x="' + x + '" y="' + y + '" width="' + barW + '" height="' + barH + '" rx="2" fill="' + color + '" opacity="0.85" style="animation-delay:' + (i * 0.025) + 's"/>';
        var parts = d.date.split("-"),
            lbl = parts[2] + "/" + parts[1];
        labels += '<text x="' + (x + barW / 2) + '" y="' + (h - 10) + '" text-anchor="middle" fill="var(--text-muted)" font-size="7" font-weight="600">' + lbl + '</text>'
    }
    for (var i = 0; i < visible.length; i++) {
        var d = visible[i],
            val = isMonto ? d.monto : d.count,
            barH = (val / vMax) * chartH,
            x = offX + i * (barW + gap),
            y = padT + chartH - barH,
            color = isMonto ? "var(--status-ok)" : "var(--brand-primary)";
        var dataTxt = isMonto ? fmtGs(val) : String(val),
            txtLen = dataTxt.length,
            bgW = Math.max(barW + 8, txtLen * 7 + 16),
            bgX = x + barW / 2 - bgW / 2,
            bgY = Math.max(y - 20, padT + 2),
            txtY = bgY + 13;
        overlays += '<g class="cbar"><rect x="' + x + '" y="' + padT + '" width="' + barW + '" height="' + chartH + '" fill="transparent" pointer-events="all"/><rect class="cbar-bg" x="' + bgX + '" y="' + bgY + '" width="' + bgW + '" height="18" rx="5" fill="' + color + '"/><text class="cbar-lbl" x="' + (x + barW / 2) + '" y="' + txtY + '" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">' + dataTxt + '</text></g>'
    }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;height:auto;display:block"><style>.chart-bar{transform-box:fill-box;transform-origin:bottom;animation:chartBarIn .32s ease both}@keyframes chartBarIn{from{opacity:0;transform:scaleY(.08)}to{opacity:.85;transform:scaleY(1)}}.cbar{cursor:pointer}.cbar-lbl,.cbar-bg{opacity:0;transform:translateY(4px) scale(.85);transition:opacity .16s ease,transform .16s ease;pointer-events:none}.cbar:hover .cbar-lbl,.cbar:hover .cbar-bg{opacity:1;transform:translateY(0) scale(1)}</style><rect x="0" y="0" width="' + w + '" height="' + h + '" fill="transparent"/>' + grid + bars + overlays + labels + '</svg>'
}

function openChartFullscreen(btn) {
    var card = btn.closest(".chart-card");
    if (!card) return;
    var svg = card.querySelector(".chart-body svg");
    if (!svg) return;
    var title = card.querySelector(".chart-title");
    var titleText = title ? title.textContent : "Gr\u00E1fico";
    var svgClone = svg.cloneNode(!0);
    svgClone.removeAttribute("style");
    svgClone.setAttribute("preserveAspectRatio", "xMidYMid meet");
    var wrap = document.createElement("div");
    wrap.className = "modal-overlay chart-fs-overlay";
    wrap.style.display = "flex";
    wrap.onclick = function(e) { if (e.target === wrap) { closeChartFullscreen(wrap) } };
    var keyHandler = function(e) { if (e.key === "Escape") { closeChartFullscreen(wrap); document.removeEventListener("keydown", keyHandler) } };
    wrap.innerHTML = '<div class="chart-fs-modal" onclick="event.stopPropagation()"><div class="chart-fs-head"><h3 class="chart-fs-title">' + esc(titleText) + '</h3><button class="chart-fs-close" onclick="closeChartFullscreen(this.closest(\'.modal-overlay\'))"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div><div class="chart-fs-body"></div></div>';
    wrap.querySelector(".chart-fs-body").appendChild(svgClone);
    document.body.appendChild(wrap);
    document.addEventListener("keydown", keyHandler);
    wrap._keyHandler = keyHandler;
    requestAnimationFrame(function() { wrap.classList.add("is-open") })
}

function closeChartFullscreen(wrap) {
    if (!wrap) return;
    if (wrap._keyHandler) { document.removeEventListener("keydown", wrap._keyHandler); wrap._keyHandler = null }
    wrap.classList.remove("is-open");
    setTimeout(function() { if (wrap.parentNode) document.body.removeChild(wrap) }, 300)
}

function animateDashboardCounters(root) {
    if (!root) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var counters = root.querySelectorAll(".kpi-counter[data-count], .kpi-money-counter[data-money]");
    counters.forEach(function(el) {
        var isMoney = el.hasAttribute("data-money"),
            target = Number(isMoney ? el.getAttribute("data-money") : el.getAttribute("data-count"));
        if (isNaN(target)) return;
        if (reduce) {
            el.textContent = isMoney ? fmtGs(target) : fmtInt(target);
            return;
        }
        var start = performance.now(),
            duration = 680,
            from = 0;
        function tick(now) {
            var p = Math.min(1, (now - start) / duration),
                eased = 1 - Math.pow(1 - p, 3),
                value = from + (target - from) * eased;
            el.textContent = isMoney ? fmtGs(value) : fmtInt(value);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick)
    })
}

function buildDashHtml(l, venList, cliList, chartData) {
    var g = l.total || 0,
        b = l.montoPendiente || 0,
        k = l.pendiente || 0;
    var flow = ["recuperado", "facturado", "no_recuperado"];
    var flowIcons = {
        no_recuperado: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        recuperado: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        recuperado_total: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        contabilizado: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        facturado: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    };
    var flowStep = {
        recuperado: "01",
        facturado: "02",
        no_recuperado: "03",
        contabilizado: "02A"
    };
    function kpiCount(value) {
        return '<span class="kpi-val kpi-counter" data-count="' + (Number(value) || 0) + '">' + fmtInt(value || 0) + '</span>'
    }
    function kpiMoney(value) {
        return '<span class="kpi-chip kpi-money kpi-money-counter" data-money="' + (Number(value) || 0) + '">' + fmtGs(value || 0) + '</span>'
    }
    function buildKpiFlowLine(label, items, monto, cls) {
        return '<div class="kpi-flow-line ' + (cls || "") + '"><span>' + label + '</span><strong>' + fmtInt(items || 0) + ' items - ' + fmtGs(monto || 0) + '</strong></div>'
    }
    function buildKpiFlowMeta(rows) {
        return rows.length ? '<div class="kpi-flow-meta">' + rows.join("") + '</div>' : ""
    }
    function buildKpiAction(label, action, cls) {
        return '<button class="hoy-list-btn kpi-state-btn ' + (cls || "") + '" onclick="' + action + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' + label + '</button>'
    }
    function buildContabilizadosAction(scope) {
        return buildKpiAction(scope === "hoy" ? "Ver contab. hoy" : "Ver contabilizados", scope === "hoy" ? "showHoyListModal('contabilizado')" : "showEstadoListModal('contabilizado')", "is-contabilizado")
    }
    function buildKpiActions(actions) {
        var html = actions.filter(Boolean).join("");
        return html ? '<div class="kpi-actions">' + html + '</div>' : ""
    }
    function buildTotalKpiExtra(ek) {
        if (ek === "facturado") return buildKpiFlowMeta([
            buildKpiFlowLine("Contabilizado", l.contabilizado, l.montoContabilizado, "is-blue"),
            buildKpiFlowLine("Pendiente a facturar", l.pendienteFacturar, l.montoPendienteFacturar, "is-pending")
        ]);
        return ""
    }
    function buildHoyKpiExtra(ek) {
        if (ek === "facturado") return buildKpiFlowMeta([
            buildKpiFlowLine("Contabilizado hoy", l.hoyContabilizados, l.hoyMontoContabilizado, "is-blue"),
            buildKpiFlowLine("Pendiente a facturar hoy", l.hoyPendienteFacturar, l.hoyMontoPendienteFacturar, "is-pending")
        ]);
        return ""
    }
    function buildTotalKPI(ek, items, monto) {
        var s = ESTADOS[ek],
            label = ek === "recuperado" ? "Pedidos recuperados pendientes" : s.nm,
            verBtn = buildKpiAction(ek === "facturado" ? "Ver facturados" : "Ver lista", "showEstadoListModal('" + ek + "')");
        return '<div class="kpi-card kpi-flow-card kpi-state-' + ek + '"><div class="kpi-card-head"><span class="kpi-state-chip"><b>' + flowStep[ek] + '</b>' + label + '</span><div class="kpi-icon">' + flowIcons[ek] + '</div></div><div class="kpi-body"><div class="kpi-main-row">' + kpiCount(items) + '<span class="kpi-unit">items</span></div><span class="kpi-lbl">Total del estado</span>' + kpiMoney(monto) + buildTotalKpiExtra(ek) + buildKpiActions(ek === "facturado" ? [verBtn, buildContabilizadosAction("total")] : [verBtn]) + '</div></div>'
    }
    function buildHoyKPI(ek, items, monto) {
        var s = ESTADOS[ek],
            label = ek === "recuperado" ? "Recuperado hoy" : s.nm + " hoy",
            verBtn = buildKpiAction(ek === "facturado" ? "Ver facturados" : "Ver lista", "showHoyListModal('" + ek + "')"),
            contBtn = ek === "facturado" ? buildContabilizadosAction("hoy") : "";
        return '<div class="kpi-card kpi-flow-card kpi-state-' + ek + ' is-today"><div class="kpi-card-head"><span class="kpi-state-chip"><b>' + flowStep[ek] + '</b>' + label + '</span><div class="kpi-icon">' + flowIcons[ek] + '</div></div><div class="kpi-body"><div class="kpi-main-row">' + kpiCount(items) + '<span class="kpi-unit">items</span></div><span class="kpi-lbl">Movimiento de hoy</span>' + kpiMoney(monto) + buildHoyKpiExtra(ek) + buildKpiActions([verBtn, contBtn]) + '</div></div>'
    }
    function buildAggregateKPI(label, items, monto, today) {
        var scope = today ? "hoy" : "total",
            verBtn = buildKpiAction("Ver lista", "showRecuperadosFlujoModal('" + scope + "')");
        return '<div class="kpi-card kpi-flow-card kpi-state-recuperado_total' + (today ? ' is-today' : '') + '"><div class="kpi-card-head"><span class="kpi-state-chip">' + label + '</span><div class="kpi-icon">' + flowIcons.recuperado_total + '</div></div><div class="kpi-body"><div class="kpi-main-row">' + kpiCount(items) + '<span class="kpi-unit">items</span></div>' + kpiMoney(monto) + buildKpiActions([verBtn]) + '</div></div>'
    }
    function ekToKey(prefix, ek) {
        var parts = ek.split("_");
        var rest = parts.map(function(p, i) { return p.charAt(0).toUpperCase() + p.slice(1) }).join("");
        return prefix + rest
    }
    var totalKPIs = flow.map(function(ek) {
        var items = ek === "no_recuperado" ? (l.no_recuperado || 0) + (l.itemsBorrado || 0) + (l.sinStock || 0) : l[ek] || 0;
        var monto = ek === "no_recuperado" ? (l.montoNoRecuperado || 0) + (l.montoItemsBorrado || 0) + (l.montoSinStock || 0) : l["monto" + ekToKey("", ek)] || 0;
        return buildTotalKPI(ek, items, monto);
    }).join("") + buildAggregateKPI("Pedidos recuperados total", l.recuperadoFlujo || 0, l.montoRecuperadoFlujo || 0, false);
    var hoyKPIs = flow.map(function(ek) {
        var items = ek === "no_recuperado" ? (l.hoyNoRecuperados || 0) + (l.hoyItemsBorrados || 0) + (l.hoySinStock || 0) : l["hoy" + ekToKey("", ek) + "s"] || 0;
        var monto = ek === "no_recuperado" ? (l.hoyMontoNoRecuperado || 0) + (l.hoyMontoItemsBorrado || 0) + (l.hoyMontoSinStock || 0) : l["hoyMonto" + ekToKey("", ek)] || 0;
        return buildHoyKPI(ek, items, monto);
    }).join("") + buildAggregateKPI("Recuperados hoy", l.hoyRecuperadoFlujo || 0, l.hoyMontoRecuperadoFlujo || 0, true);
    function resumenRow(i, r) {
        var fact = (r.est && r.est.facturado) || { items: 0, monto: 0 };
        var pend = (r.est && r.est.pendiente) || { items: 0, monto: 0 };
        var mx = Math.max(fact.monto, pend.monto, 1);
        function bar(cfg) {
            var pct = Math.max(2, Math.round(cfg.monto / mx * 100));
            return '<div class="rk-bar-row">' +
                '<span class="rk-bar-lbl ' + cfg.cls + '">' + cfg.icon + cfg.label + '</span>' +
                '<div class="rk-bar-track"><div class="rk-bar-fill ' + cfg.cls + '" style="width:' + pct + '%"></div></div>' +
                '<span class="rk-bar-val ' + cfg.cls + '">' + fmtGs(cfg.monto) + '</span>' +
                '<span class="rk-bar-items ' + cfg.cls + '">' + cfg.items + ' items</span>' +
            '</div>';
        }
        return '<div class="resumen-row" data-name="' + (r.nombre || '').toLowerCase() + '">' +
            '<div class="resumen-body">' +
                '<div class="resumen-name-row">' +
                    '<span class="resumen-rank">' + (i + 1) + '</span>' +
                    '<span class="resumen-name">' + esc(r.nombre) + '</span>' +
                '</div>' +
                bar({ cls: 'is-fact', label: 'Facturado', monto: fact.monto, items: fact.items,
                    icon: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> ' }) +
                bar({ cls: 'is-pend', label: 'Pendiente', monto: pend.monto, items: pend.items,
                    icon: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ' }) +
            '</div>' +
        '</div>';
    }
    var dashDesdeValue = arguments.length > 4 ? arguments[4] || "" : readControlValue("dashFilterFechaDesde"),
        dashHastaValue = arguments.length > 5 ? arguments[5] || "" : readControlValue("dashFilterFechaHasta"),
        currentMesVal = readControlValue("dashFilterMesValue") || getDashDefaultMonth();
    if (!isDashMonthValue(currentMesVal)) currentMesVal = getDashDefaultMonth();
    var isAllMonths = !dashDesdeValue && !dashHastaValue,
        fullMonth = getDashFullMonthFromRange(dashDesdeValue, dashHastaValue);
    if (fullMonth) currentMesVal = fullMonth;
    var mesBounds = getDashMonthBounds(currentMesVal),
        mesLabel = isAllMonths ? 'Todos los meses' : fullMonth ? DASH_MONTH_NAMES[mesBounds.month] + ' ' + mesBounds.year : 'Rango personalizado';
    var dashDateFilter = '<div class="dash-date-filter-row">' +
        '<button class="dash-date-btn dash-date-btn-inline" id="dateFilterBtn_dash" type="button" onclick="openDateModal(\'dash\')" aria-label="Filtrar dashboard por fecha"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span id="dateFilterText_dash">Filtrar por fecha</span></button>' +
        '<div class="dash-mes-nav">' +
            '<button class="dash-mes-nav-btn dash-mes-prev" onclick="onDashMesNav(-1)" title="Mes anterior" aria-label="Mes anterior">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
            '</button>' +
            '<span class="dash-mes-nav-label" id="dashMesLabel">' + mesLabel + '</span>' +
            '<button class="dash-mes-nav-btn dash-mes-next" onclick="onDashMesNav(1)" title="Mes siguiente" aria-label="Mes siguiente">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
            '</button>' +
        '</div>' +
        '<button class="dash-all-months-btn' + (isAllMonths ? ' active' : '') + '" type="button" onclick="showAllDashMonths()" title="Mostrar todos los meses" aria-label="Mostrar todos los meses">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h8M8 18h5"/></svg>Todo</button>' +
        '<button id="btnExportarExcel" class="dash-export-btn" type="button" onclick="exportarExcelDashboard()" title="Exportar pedidos a Excel por estado">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
            'Exportar Excel' +
        '</button>' +
        '</div>';
    return '<input type="hidden" id="dashFilterFechaDesde" value="' + escAttr(dashDesdeValue) + '"><input type="hidden" id="dashFilterFechaHasta" value="' + escAttr(dashHastaValue) + '"><input type="hidden" id="dashFilterMesValue" value="' + escAttr(currentMesVal) + '">' + dashDateFilter + '<div class="kpi-general-shell"><div class="kpi-general-head"><span class="section-chip section-chip-blue">Total General</span><span class="kpi-flow-path">Resumen ejecutivo</span></div><div class="dash-kpis dash-kpis-top"><div class="kpi-card kpi-general-card is-money"><div class="kpi-icon kpi-icon-gs">Gs</div><div class="kpi-body"><span class="kpi-val kpi-counter" data-count="' + (Number(b) || 0) + '">' + fmtInt(b) + '</span><span class="kpi-lbl">Monto pendiente</span></div></div><div class="kpi-card kpi-general-card is-pending"><div class="kpi-icon" style="background:' + ESTADOS.pendiente.bg + ';color:' + ESTADOS.pendiente.tc + '"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="kpi-body"><span class="kpi-val kpi-counter" data-count="' + (Number(k) || 0) + '">' + k + '</span><span class="kpi-lbl">Pendientes items</span></div></div></div></div><div class="kpi-flow-shell"><div class="kpi-flow-head"><span class="section-chip section-chip-blue">Total de estados</span><span class="kpi-flow-path">Recuperado <b>&rarr;</b> Facturado <b>&rarr;</b> No recuperado &mdash; Total</span></div><div class="dash-kpis dash-kpis-total">' + totalKPIs + '</div></div><div class="kpi-flow-shell is-today-flow"><div class="kpi-flow-head"><span class="section-chip section-chip-green">Hoy</span><span class="kpi-flow-path">Movimientos gestionados en el d&iacute;a</span></div><div class="dash-kpis dash-kpis-hoy">' + hoyKPIs + '</div></div><div class="dash-charts"><div class="chart-card"><div class="chart-head"><div class="chart-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><div>        <h4 class="chart-title">Items borrados por d&iacute;a</h4><p class="chart-sub">Cantidad de items registrados por d&iacute;a</p></div><button class="chart-fullscreen-btn" onclick="openChartFullscreen(this)" title="Ver en pantalla completa"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></button></div><div class="chart-body">' + buildChartSvg(chartData, "items") + '</div></div><div class="chart-card"><div class="chart-head"><div class="chart-icon chart-icon-gs">Gs</div><div><h4 class="chart-title">Monto borrados por d&iacute;a</h4><p class="chart-sub">Suma de importes registrados por d&iacute;a</p></div><button class="chart-fullscreen-btn" onclick="openChartFullscreen(this)" title="Ver en pantalla completa"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></button></div><div class="chart-body">' + buildChartSvg(chartData, "monto") + '</div></div></div><div class="resumen-grid"><section class="resumen-card"><div class="resumen-header"><div class="resumen-title"><div class="resumen-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>Resumen por Vendedor</div><div class="resumen-search"><select id="resumenSelVen" class="resumen-search-select" onchange="filterResumen(this)"><option value="">Todos los vendedores</option></select></div></div><div class="resumen-list">' + (venList.length ? venList.map(function(r, i) { return resumenRow(i, r) }).join("") : '<div style="padding:40px 20px;text-align:center;color:#6b7c93;font-size:14px">Sin datos</div>') + '</div></section><section class="resumen-card"><div class="resumen-header"><div class="resumen-title"><div class="resumen-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>Resumen por Cliente</div><div class="resumen-search"><select id="resumenSelCli" class="resumen-search-select" onchange="filterResumen(this)"><option value="">Todos los clientes</option></select></div></div><div class="resumen-list">' + (cliList.length ? cliList.map(function(r, i) { return resumenRow(i, r) }).join("") : '<div style="padding:40px 20px;text-align:center;color:#6b7c93;font-size:14px">Sin datos</div>') + '</div></section></div>'
}

function filterResumen(sel) {
    var term = (sel.value || '').toLowerCase().trim();
    var card = sel.closest('.resumen-card');
    if (!card) return;
    if (!card._rp) card._rp = { page: 0, term: '' };
    card._rp.term = term;
    card._rp.page = 0;
    renderResumenPage(card);
}
var RESUMEN_PAGE_SIZE = 5;
function initResumenPagers(container) {
    (container || document).querySelectorAll('.resumen-card').forEach(function(card) {
        var sel = card.querySelector('.resumen-search-select');
        var list = card.querySelector('.resumen-list');
        if (sel && list && sel.options.length <= 1) {
            list.querySelectorAll('.resumen-row').forEach(function(r) {
                var val = r.getAttribute('data-name') || '';
                var nm = r.querySelector('.resumen-name');
                var opt = document.createElement('option');
                opt.value = val;
                opt.textContent = nm ? nm.textContent : val;
                sel.appendChild(opt);
            });
            if (sel.id) enhanceSelect(sel.id);
        }
        if (!card._rp) {
            card._rp = { page: 0, term: '' };
            var pager = document.createElement('div');
            pager.className = 'resumen-pager';
            pager.innerHTML =
                '<button class="rp-btn rp-prev" onclick="resumenPageNav(this,-1)" aria-label="Anterior">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
                '</button>' +
                '<span class="rp-info"></span>' +
                '<button class="rp-btn rp-next" onclick="resumenPageNav(this,1)" aria-label="Siguiente">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
                '</button>';
            card.appendChild(pager);
        }
        renderResumenPage(card);
    });
}
function renderResumenPage(card) {
    if (!card._rp) return;
    var list = card.querySelector('.resumen-list');
    if (!list) return;
    var term = card._rp.term || '';
    var rows = Array.prototype.slice.call(list.querySelectorAll('.resumen-row'));
    var filtered = term
        ? rows.filter(function(r) { return (r.getAttribute('data-name') || '') === term; })
        : rows;
    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / RESUMEN_PAGE_SIZE));
    card._rp.page = Math.min(card._rp.page, pages - 1);
    var start = card._rp.page * RESUMEN_PAGE_SIZE;
    var end = start + RESUMEN_PAGE_SIZE;
    rows.forEach(function(r) { r.style.display = 'none'; });
    filtered.forEach(function(r, idx) {
        r.style.display = (idx >= start && idx < end) ? '' : 'none';
    });
    var pager = card.querySelector('.resumen-pager');
    if (pager) {
        var info = pager.querySelector('.rp-info');
        var prev = pager.querySelector('.rp-prev');
        var next = pager.querySelector('.rp-next');
        if (info) info.textContent = total ? (card._rp.page + 1) + ' / ' + pages : '0 / 0';
        if (prev) prev.disabled = card._rp.page <= 0;
        if (next) next.disabled = card._rp.page >= pages - 1;
        pager.style.display = (!term && total > RESUMEN_PAGE_SIZE) ? '' : 'none';
    }
}
function resumenPageNav(btn, dir) {
    var card = btn.closest('.resumen-card');
    if (!card || !card._rp) return;
    card._rp.page += dir;
    renderResumenPage(card);
}
function switchResumenTab(tab) {
    var grid = document.getElementById('resumenGrid');
    if (grid) grid.classList.toggle('montos-active', tab === 'montos');
    document.querySelectorAll('.resumen-tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', (btn.getAttribute('data-tab') || '') === tab);
    });
}
function buildHoyListHtml(items, estado, scope, totalCount) {
    var st = ESTADOS[estado] || ESTADOS.no_recuperado;
    var label = st.nm;
    var isHoy = scope !== "total",
        totalItems = typeof totalCount === "number" ? totalCount : items.length,
        estadoHeader = estado === "no_recuperado" ? "Motivo" : "Estado",
        fechaHeader = estado === "facturado" ? "Fecha Factura" : "Fecha Gesti&oacute;n",
        showFechaCol = estado !== "contabilizado",
        showGestorCol = estado !== "contabilizado" && estado !== "facturado",
        showFacturaCol = estado === "facturado",
        titleSuffix = isHoy ? " Hoy" : "",
        modalSub = totalItems + ' item' + (totalItems !== 1 ? "s" : "") + (isHoy ? ' gestionado' + (totalItems !== 1 ? "s" : "") + ' hoy' : ' en estado actual'),
        footerExtra = totalItems > items.length ? ' <span class="hoy-modal-limit">Mostrando ' + items.length + '</span>' : "";
    var iconMap = {
        no_recuperado: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
        recuperado: '<polyline points="20 6 9 17 4 12"/>',
        contabilizado: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        facturado: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-5"/>'
    };
    var iconSvg = iconMap[estado] || iconMap.no_recuperado,
        modalTitle = estado === "recuperado" ? "Pedidos recuperados pendientes" + titleSuffix : "Items " + label + titleSuffix;
    var rows = items.map(function(w, i) {
        var estilo = "color:var(--text-muted);font-weight:500;";
        var rowEstado = w.estado || estado;
        var motivoKey = rowEstado === "sin_stock" ? "Sin Stock"
            : rowEstado === "items_borrado" ? ("Borrado " + String(w.borrado_num || 1).padStart(3, "0"))
            : (getIncidenciaName(w.incidencia) || w.motivo_rechazo || w.descr_mot_rech || "Sin motivo");
        var motivo = rowEstado === "sin_stock" ? '<span class="status-badge" style="background:rgba(120,113,108,.10);color:#57534E;white-space:nowrap">⊘ Sin Stock</span>'
            : rowEstado === "items_borrado" ? '<span class="status-badge" style="background:rgba(220,38,38,.10);color:#B91C1C;white-space:nowrap">Borrado ' + String(w.borrado_num || 1).padStart(3, "0") + '</span>'
            : rowEstado === "no_recuperado" ? '<span class="status-badge" style="background:var(--status-error-bg);color:var(--status-error);white-space:normal;text-align:left;line-height:1.2">' + esc(getIncidenciaName(w.incidencia) || w.motivo_rechazo || w.descr_mot_rech || "-") + '</span>'
            : '<span style="color:var(--text-light)">—</span>';
        var fechaCell = showFechaCol ? '<td><span class="hoy-status-dot ' + (w.estado || estado) + '"></span>' + fmtDate(estado === "facturado" ? w.fecha_fact : w.fecha_gestion) + '</td>' : "";
        var gestorCell = showGestorCol ? '<td><strong>' + esc(w.recuperado_por || "-") + '</strong></td>' : "";
        var facturaCell = showFacturaCol ? '<td>' + copyChip(w.factura || "-") + '</td>' : "";
        return '<tr data-fecha="' + (estado === "facturado" ? (w.fecha_fact||"") : (w.fecha_gestion||"")) + '" data-monto="' + (Number(w.total_importe)||0) + '" data-search="' + esc((w.nombre||"") + " " + (w.material||"") + " " + (w.doc_vtas||"")) + '" data-motivo="' + esc(motivoKey) + '" style="animation-delay:' + (i * 0.04) + 's">' + fechaCell + gestorCell + '<td>' + esc(w.nombre || "") + '</td><td>' + copyChip(w.material || "-") + '</td><td>' + copyChip(w.doc_vtas || "-") + facturaCell + '<td style="text-align:left;max-width:200px">' + (estado === "no_recuperado" ? motivo : buildEstadoBadge(w.estado || estado)) + '</td><td>' + fmtGs(w.total_importe) + '</td></tr>'
    }).join("");
    // Select de motivos para el modal no_recuperado
    var motivoSelect = "";
    if (estado === "no_recuperado" && items.length > 0) {
        var _mSet = {}, _mKeys = [];
        items.forEach(function(w) {
            var re = w.estado || estado;
            var mk = re === "sin_stock" ? "Sin Stock"
                : re === "items_borrado" ? ("Borrado " + String(w.borrado_num || 1).padStart(3, "0"))
                : (getIncidenciaName(w.incidencia) || w.motivo_rechazo || w.descr_mot_rech || "Sin motivo");
            if (!_mSet[mk]) { _mSet[mk] = true; _mKeys.push(mk); }
        });
        if (_mKeys.length > 1) {
            var _opts = _mKeys.map(function(mk) {
                return '<option value="' + esc(mk) + '">' + esc(mk) + '</option>';
            }).join("");
            motivoSelect = '<select class="hoy-filter-input" id="hoyMotivoFilter" onchange="filterHoyMotivoModal(this)" style="width:auto;max-width:185px"><option value="">Todos los motivos</option>' + _opts + '</select>';
        }
    }
    var headerCells = (showFechaCol ? '<th>' + fechaHeader + '</th>' : "") + (showGestorCol ? '<th>Gestor</th>' : "") + '<th>Cliente</th><th>Material</th><th>Doc Venta</th>' + (showFacturaCol ? '<th>Factura</th>' : "") + '<th>' + estadoHeader + '</th><th style="text-align:right">Monto</th>';
    var emptyHtml = '<div class="hoy-modal-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><br>Sin items ' + label.toLowerCase() + (isHoy ? ' hoy' : '') + '</div>';
    return '<div class="hoy-modal-overlay" id="hoyModalOverlay" onclick="if(event.target===this)closeHoyListModal()"><div class="hoy-modal-box"><div class="hoy-modal-head"><div class="hoy-modal-head-left"><div class="hoy-modal-head-icon ' + estado + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + iconSvg + '</svg></div><div class="hoy-modal-head-text"><h3>' + modalTitle + '</h3><p>' + modalSub + '</p></div></div><button class="hoy-modal-close" onclick="closeHoyListModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div><div class="hoy-modal-body">' + (items.length ? '<div class="hoy-sort-bar"><span class="hoy-sort-lbl">Ordenar:</span><button class="hoy-sort-btn" data-sort="fecha" onclick="sortHoyModal(this.dataset.sort)">Fecha <span class="hoy-sort-arrow">&#8645;</span></button><button class="hoy-sort-btn" data-sort="monto" onclick="sortHoyModal(this.dataset.sort)">Monto <span class="hoy-sort-arrow">&#8645;</span></button>' + (motivoSelect ? '<div style="width:1px;height:16px;background:var(--border-color);flex-shrink:0"></div>' + motivoSelect : '') + '<div style="flex:1"></div><input class="hoy-filter-input" type="text" placeholder="Buscar cliente, material, doc…" oninput="filterHoyModal(this)"></div><table class="hoy-modal-table"><thead><tr>' + headerCells + '</tr></thead><tbody>' + rows + '</tbody></table>' : emptyHtml) + '</div><div class="hoy-modal-footer"><span>Total: <strong class="hoy-modal-count">' + totalItems + ' item' + (totalItems !== 1 ? "s" : "") + '</strong>' + footerExtra + '</span><button class="hoy-modal-close-btn" onclick="closeHoyListModal()">Cerrar</button></div></div></div>'
}

function buildRecuperadosFlujoListHtml(items, scope, totalCount) {
    var isHoy = scope === "hoy",
        title = isHoy ? "Recuperados hoy" : "Pedidos recuperados total",
        totalItems = typeof totalCount === "number" ? totalCount : items.length,
        modalSub = totalItems + ' item' + (totalItems !== 1 ? "s" : "") + (isHoy ? ' gestionado' + (totalItems !== 1 ? "s" : "") + ' hoy' : ' dentro del flujo recuperado'),
        footerExtra = totalItems > items.length ? ' <span class="hoy-modal-limit">Mostrando ' + items.length + '</span>' : "";
    function flujoFecha(w) {
        return w.estado === "facturado" ? w.fecha_fact : w.fecha_gestion
    }
    var rows = items.map(function(w, i) {
        var estado = w.estado || "recuperado";
        return '<tr data-fecha="' + (flujoFecha(w)||"") + '" data-monto="' + (Number(w.total_importe)||0) + '" data-estado="' + estado + '" data-search="' + esc((w.nombre||"") + " " + (w.material||"") + " " + (w.doc_vtas||"")) + '" style="animation-delay:' + (i * 0.04) + 's"><td><span class="hoy-status-dot ' + estado + '"></span>' + fmtDate(flujoFecha(w)) + '</td><td>' + esc(w.nombre || "") + '</td><td>' + copyChip(w.material || "-") + '</td><td>' + copyChip(w.doc_vtas || "-") + '</td><td style="text-align:left">' + buildEstadoBadge(estado) + '</td><td>' + copyChip(w.factura || "-") + '</td><td>' + fmtGs(w.total_importe) + '</td></tr>'
    }).join("");
    var headerCells = '<th>Fecha</th><th>Cliente</th><th>Material</th><th>Doc Venta</th><th>Estado</th><th>Factura</th><th style="text-align:right">Monto</th>';
    var emptyHtml = '<div class="hoy-modal-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><br>Sin pedidos recuperados' + (isHoy ? ' hoy' : '') + '</div>';
    return '<div class="hoy-modal-overlay" id="hoyModalOverlay" onclick="if(event.target===this)closeHoyListModal()"><div class="hoy-modal-box is-recuperado-flow"><div class="hoy-modal-head"><div class="hoy-modal-head-left"><div class="hoy-modal-head-icon recuperado_total"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div class="hoy-modal-head-text"><h3>' + title + '</h3><p>' + modalSub + '</p></div></div><button class="hoy-modal-close" onclick="closeHoyListModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div><div class="hoy-modal-body">' + (items.length ? '<div class="hoy-sort-bar"><div class="hoy-filter-chips"><button class="hoy-filter-chip active" onclick="filterFlujoModal(this,\'\')">Todos</button><button class="hoy-filter-chip" onclick="filterFlujoModal(this,\'recuperado\')">Recuperado</button><button class="hoy-filter-chip" onclick="filterFlujoModal(this,\'contabilizado\')">Contabilizado</button><button class="hoy-filter-chip" onclick="filterFlujoModal(this,\'facturado\')">Facturado</button></div><span class="hoy-sort-lbl" style="margin-left:8px">Ordenar:</span><button class="hoy-sort-btn" data-sort="fecha" onclick="sortHoyModal(this.dataset.sort)">Fecha <span class="hoy-sort-arrow">&#8645;</span></button><button class="hoy-sort-btn" data-sort="monto" onclick="sortHoyModal(this.dataset.sort)">Monto <span class="hoy-sort-arrow">&#8645;</span></button><div style="flex:1"></div><input class="hoy-filter-input" type="text" placeholder="Buscar cliente, material, doc…" oninput="filterFlujoSearch(this)"></div><table class="hoy-modal-table"><thead><tr>' + headerCells + '</tr></thead><tbody>' + rows + '</tbody></table>' : emptyHtml) + '</div><div class="hoy-modal-footer"><span>Total: <strong class="hoy-modal-count">' + totalItems + ' item' + (totalItems !== 1 ? "s" : "") + '</strong>' + footerExtra + '</span><button class="hoy-modal-close-btn" onclick="closeHoyListModal()">Cerrar</button></div></div></div>'
}

function showHoyListModal(estado) {
    var existing = document.getElementById("hoyModalOverlay");
    if (existing) existing.remove();
    var placeholder = document.createElement("div");
    placeholder.innerHTML = buildHoyListHtml([], estado);
    var overlay = placeholder.firstElementChild;
    overlay.style.display = "flex";
    document.body.appendChild(overlay);
    requestAnimationFrame(function() {
        overlay.classList.add("is-open");
    });
    db_getHoyItems(estado).then(function(items) {
        var liveOverlay = document.getElementById("hoyModalOverlay");
        if (!liveOverlay) return;
        var newPlaceholder = document.createElement("div");
        newPlaceholder.innerHTML = buildHoyListHtml(items, estado);
        var newOverlay = newPlaceholder.firstElementChild;
        newOverlay.style.display = "flex";
        requestAnimationFrame(function() {
            newOverlay.classList.add("is-open");
        });
        liveOverlay.replaceWith(newOverlay);
    }).catch(function(e) {
        var liveOverlay = document.getElementById("hoyModalOverlay");
        if (!liveOverlay) return;
        var body = liveOverlay.querySelector(".hoy-modal-body");
        if (body) body.innerHTML = '<div class="hoy-modal-empty" style="color:#ef4444"><svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><br>Error al cargar: ' + esc(e.message) + '</div>'
    })
}

function showRecuperadosFlujoModal(scope) {
    scope = scope === "hoy" ? "hoy" : "total";
    var existing = document.getElementById("hoyModalOverlay");
    if (existing) existing.remove();
    var placeholder = document.createElement("div");
    placeholder.innerHTML = buildRecuperadosFlujoListHtml([], scope, 0);
    var overlay = placeholder.firstElementChild;
    overlay.style.display = "flex";
    document.body.appendChild(overlay);
    requestAnimationFrame(function() {
        overlay.classList.add("is-open");
    });
    db_getRecuperadosFlujoItems(scope, 500).then(function(result) {
        var liveOverlay = document.getElementById("hoyModalOverlay");
        if (!liveOverlay) return;
        var newPlaceholder = document.createElement("div");
        newPlaceholder.innerHTML = buildRecuperadosFlujoListHtml(result.items, scope, result.count);
        var newOverlay = newPlaceholder.firstElementChild;
        newOverlay.style.display = "flex";
        requestAnimationFrame(function() {
            newOverlay.classList.add("is-open");
        });
        liveOverlay.replaceWith(newOverlay);
    }).catch(function(e) {
        var liveOverlay = document.getElementById("hoyModalOverlay");
        if (!liveOverlay) return;
        var body = liveOverlay.querySelector(".hoy-modal-body");
        if (body) body.innerHTML = '<div class="hoy-modal-empty" style="color:#ef4444"><svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><br>Error al cargar: ' + esc(e.message) + '</div>'
    })
}

function showEstadoListModal(estado) {
    var existing = document.getElementById("hoyModalOverlay");
    if (existing) existing.remove();
    var placeholder = document.createElement("div");
    placeholder.innerHTML = buildHoyListHtml([], estado, "total", 0);
    var overlay = placeholder.firstElementChild;
    overlay.style.display = "flex";
    document.body.appendChild(overlay);
    requestAnimationFrame(function() {
        overlay.classList.add("is-open");
    });
    db_getEstadoItems(estado, 500).then(function(result) {
        var liveOverlay = document.getElementById("hoyModalOverlay");
        if (!liveOverlay) return;
        var newPlaceholder = document.createElement("div");
        newPlaceholder.innerHTML = buildHoyListHtml(result.items, estado, "total", result.count);
        var newOverlay = newPlaceholder.firstElementChild;
        newOverlay.style.display = "flex";
        requestAnimationFrame(function() {
            newOverlay.classList.add("is-open");
        });
        liveOverlay.replaceWith(newOverlay);
    }).catch(function(e) {
        var liveOverlay = document.getElementById("hoyModalOverlay");
        if (!liveOverlay) return;
        var body = liveOverlay.querySelector(".hoy-modal-body");
        if (body) body.innerHTML = '<div class="hoy-modal-empty" style="color:#ef4444"><svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><br>Error al cargar: ' + esc(e.message) + '</div>'
    })
}

function closeHoyListModal() {
    var overlay = document.getElementById("hoyModalOverlay");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    setTimeout(function() { overlay.remove(); }, 350)
}

function sortHoyModal(field) {
    var overlay = document.getElementById("hoyModalOverlay");
    if (!overlay) return;
    var tbody = overlay.querySelector(".hoy-modal-table tbody");
    if (!tbody) return;
    var rows = Array.prototype.slice.call(tbody.querySelectorAll("tr"));
    if (!rows.length) return;
    if (!overlay._sort) overlay._sort = { field: null, dir: -1 };
    var st = overlay._sort;
    if (st.field === field) { st.dir *= -1; } else { st.field = field; st.dir = -1; }
    rows.sort(function(a, b) {
        var va = field === "monto" ? Number(a.getAttribute("data-monto") || 0) : (a.getAttribute("data-fecha") || "");
        var vb = field === "monto" ? Number(b.getAttribute("data-monto") || 0) : (b.getAttribute("data-fecha") || "");
        return (va < vb ? -1 : va > vb ? 1 : 0) * st.dir;
    });
    rows.forEach(function(r) { tbody.appendChild(r); });
    overlay.querySelectorAll(".hoy-sort-btn").forEach(function(btn) {
        var arrow = btn.querySelector(".hoy-sort-arrow");
        btn.classList.remove("is-asc", "is-desc");
        if (arrow) arrow.textContent = "⇅";
        if (btn.getAttribute("data-sort") === field) {
            btn.classList.add(st.dir === -1 ? "is-desc" : "is-asc");
            if (arrow) arrow.textContent = st.dir === -1 ? "↓" : "↑";
        }
    });
}

function filterHoyModal(input) {
    var overlay = document.getElementById("hoyModalOverlay");
    if (!overlay) return;
    var term = (input.value || "").toLowerCase().trim();
    var motivoEl = overlay.querySelector("#hoyMotivoFilter");
    var motivo = motivoEl ? motivoEl.value : "";
    var rows = Array.prototype.slice.call(overlay.querySelectorAll(".hoy-modal-table tbody tr"));
    var visible = 0;
    rows.forEach(function(r) {
        var matchSearch = !term || (r.getAttribute("data-search") || "").toLowerCase().indexOf(term) !== -1;
        var matchMotivo = !motivo || (r.getAttribute("data-motivo") || "") === motivo;
        var show = matchSearch && matchMotivo;
        r.style.display = show ? "" : "none";
        if (show) visible++;
    });
    var countEl = overlay.querySelector(".hoy-modal-count");
    if (countEl) countEl.textContent = visible + " item" + (visible !== 1 ? "s" : "");
}

function filterHoyMotivoModal(select) {
    var overlay = document.getElementById("hoyModalOverlay");
    if (!overlay) return;
    var motivo = select.value || "";
    var searchInput = overlay.querySelector(".hoy-filter-input[type='text']");
    var term = searchInput ? (searchInput.value || "").toLowerCase().trim() : "";
    var rows = Array.prototype.slice.call(overlay.querySelectorAll(".hoy-modal-table tbody tr"));
    var visible = 0;
    rows.forEach(function(r) {
        var matchMotivo = !motivo || (r.getAttribute("data-motivo") || "") === motivo;
        var matchSearch = !term || (r.getAttribute("data-search") || "").toLowerCase().indexOf(term) !== -1;
        var show = matchMotivo && matchSearch;
        r.style.display = show ? "" : "none";
        if (show) visible++;
    });
    var countEl = overlay.querySelector(".hoy-modal-count");
    if (countEl) countEl.textContent = visible + " item" + (visible !== 1 ? "s" : "");
}

function filterFlujoModal(btn, estado) {
    var overlay = document.getElementById("hoyModalOverlay");
    if (!overlay) return;
    overlay._flujoEstado = estado;
    overlay.querySelectorAll(".hoy-filter-chip").forEach(function(c) { c.classList.remove("active"); });
    btn.classList.add("active");
    _applyFlujoFilters(overlay);
}

function filterFlujoSearch(input) {
    var overlay = document.getElementById("hoyModalOverlay");
    if (!overlay) return;
    overlay._flujoSearch = (input.value || "").toLowerCase().trim();
    _applyFlujoFilters(overlay);
}

function _applyFlujoFilters(overlay) {
    var estado = overlay._flujoEstado || "";
    var term = overlay._flujoSearch || "";
    var rows = Array.prototype.slice.call(overlay.querySelectorAll(".hoy-modal-table tbody tr"));
    var visible = 0;
    rows.forEach(function(r) {
        var matchEstado = !estado || (r.getAttribute("data-estado") || "") === estado;
        var matchSearch = !term || (r.getAttribute("data-search") || "").toLowerCase().indexOf(term) !== -1;
        var show = matchEstado && matchSearch;
        r.style.display = show ? "" : "none";
        if (show) visible++;
    });
    var countEl = overlay.querySelector(".hoy-modal-count");
    if (countEl) countEl.textContent = visible + " item" + (visible !== 1 ? "s" : "");
}

var DATE_FILTER_CONFIG = {
    items: {
        desdeId: "itemsFilterFechaDesde",
        hastaId: "itemsFilterFechaHasta",
        buttonId: "dateFilterBtn_items",
        textId: "dateFilterText_items",
        emptyText: "Fechas"
    },
    dash: {
        desdeId: "dashFilterFechaDesde",
        hastaId: "dashFilterFechaHasta",
        buttonId: "dateFilterBtn_dash",
        textId: "dateFilterText_dash",
        emptyText: "Filtrar por fecha"
    },
    recup: {
        desdeId: "recupFilterDesde",
        hastaId: "recupFilterHasta",
        buttonId: "dateFilterBtn_recup",
        textId: "dateFilterText_recup",
        emptyText: "Fechas"
    },
    incid: {
        desdeId: "incidFilterDesde",
        hastaId: "incidFilterHasta",
        buttonId: "dateFilterBtn_incid",
        textId: "dateFilterText_incid",
        emptyText: "Fechas"
    }
};
var ITEMS_FILTER_IDS = ["itemsSearch", "itemsFilterVendedor", "itemsFilterStock", "itemsFilterGrupo", "itemsFilterMarca", "itemsFilterFechaDesde", "itemsFilterFechaHasta"];
var RECUP_FILTER_IDS = ["recupSearch", "recupFilterEstado", "recupFilterVendedor", "recupFilterGrupo", "recupFilterMarca", "recupFilterDesde", "recupFilterHasta"];
var INCID_FILTER_IDS = ["incidSearch", "incidFilterVendedor", "incidFilterGrupo", "incidFilterMarca", "incidFilterDesde", "incidFilterHasta"];

function getDateFilterConfig(tab) {
    return DATE_FILTER_CONFIG[tab] || null
}

function readControlValue(id) {
    var el = document.getElementById(id);
    return el ? el.value || "" : ""
}

function writeControlValue(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value || ""
}

function captureControlValues(ids) {
    var state = {};
    ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) state[id] = el.value || ""
    });
    return state
}

function restoreControlValues(state) {
    Object.keys(state || {}).forEach(function(id) {
        writeControlValue(id, state[id])
    })
}

function captureItemsFilterState() {
    return captureControlValues(ITEMS_FILTER_IDS)
}

function captureRecupFilterState() {
    return captureControlValues(RECUP_FILTER_IDS)
}

function captureIncidFilterState() {
    return captureControlValues(INCID_FILTER_IDS)
}

function restoreItemsFilterState(state) {
    restoreControlValues(state);
    syncDateTriggerUI("items")
}

function restoreRecupFilterState(state) {
    restoreControlValues(state);
    syncDateTriggerUI("recup")
}

function restoreIncidFilterState(state) {
    restoreControlValues(state);
    syncDateTriggerUI("incid")
}

function normalizeSearchValue(value) {
    return String(value == null ? "" : value).toLowerCase()
}

function matchesSearch(value, term) {
    return normalizeSearchValue(value).includes(term)
}

function cacheUiRow(row) {
    var fecha = row.fecha_carga ? parseDateLocal(row.fecha_carga) : null;
    row._fechaCargaTs = fecha ? fecha.getTime() : 0;
    row._sortVendor = (row.vendedor_externo || "Sin Vendedor").toUpperCase();
    row._vendorLabel = row.vendedor_externo || "Sin Vendedor Asignado";
    row._montoNum = Number(row.total_importe) || 0;
    row._cantidadPedidoNum = Number(row.cantidad_pedido) || 0;
    row._stockLdalNum = Number(row.stock_ldal) || 0;
    row._stockLdfaNum = Number(row.stock_ldfa) || 0;
    row._stockLdlqNum = Number(row.stock_ldlq) || 0;
    row._stockLftdNum = Number(row.stock_lftd) || 0;
    row._stockTotalNum = Number(row.stock_total) || 0;
    row._itemsSearch = [
        normalizeSearchValue(row.nombre),
        normalizeSearchValue(row.material),
        normalizeSearchValue(row.doc_vtas),
        normalizeSearchValue(row.denominacion),
        normalizeSearchValue(row.solic)
    ];
    row._recupSearch = [
        normalizeSearchValue(row.nombre),
        normalizeSearchValue(row.material),
        normalizeSearchValue(row.doc_vtas),
        normalizeSearchValue(row.denominacion),
        normalizeSearchValue(row.recuperado_por)
    ];
    row._incidSearch = [
        normalizeSearchValue(row.nombre),
        normalizeSearchValue(row.material),
        normalizeSearchValue(row.doc_vtas),
        normalizeSearchValue(row.denominacion),
        normalizeSearchValue(row.obs_gestion)
    ];
    return row
}

function cacheUiRows(rows) {
    (rows || []).forEach(cacheUiRow);
    return rows || []
}

function cachedSearchIncludes(fields, term) {
    if (!term) return !0;
    for (var i = 0; i < fields.length; i++) {
        if (fields[i].includes(term)) return !0
    }
    return !1
}

function getDateBounds(desde, hasta) {
    var min = desde ? (parseDateLocal(desde) || new Date(0)).getTime() : null,
        max = hasta ? (parseDateLocal(hasta) || new Date(0)).getTime() + 86400000 - 1 : null;
    return { min: min, max: max }
}

function rowInDateBounds(row, bounds) {
    if (bounds.min === null && bounds.max === null) return !0;
    var value = row._fechaCargaTs || 0;
    if (bounds.min !== null && value < bounds.min) return !1;
    if (bounds.max !== null && value > bounds.max) return !1;
    return !0
}

function sortByVendorMonto(a, b) {
    if (a._sortVendor < b._sortVendor) return -1;
    if (a._sortVendor > b._sortVendor) return 1;
    return b._montoNum - a._montoNum
}

function getTableSortValue(row, key) {
    if (!row) return 0;
    if (key === "fecha_carga") return row._fechaCargaTs || 0;
    if (key === "stock_ldal") return row._stockLdalNum || 0;
    if (key === "stock_ldfa") return row._stockLdfaNum || 0;
    if (key === "stock_ldlq") return row._stockLdlqNum || 0;
    if (key === "stock_lftd") return row._stockLftdNum || 0;
    if (key === "stock_total") return row._stockTotalNum || 0;
    if (key === "cantidad_pedido") return row._cantidadPedidoNum || 0;
    if (key === "total_importe") return row._montoNum || 0;
    return normalizeSearchValue(row[key])
}

function sortTableRows(state) {
    if (!state || !state.filtered) return;
    if (!state.sortKey) {
        state.filtered.sort(sortByVendorMonto);
        return
    }
    var key = state.sortKey,
        dir = state.sortDir === "asc" ? 1 : -1;
    state.filtered.sort(function(a, b) {
        if (a._sortVendor < b._sortVendor) return -1;
        if (a._sortVendor > b._sortVendor) return 1;
        var va = getTableSortValue(a, key),
            vb = getTableSortValue(b, key),
            cmp = typeof va === "string" || typeof vb === "string" ? String(va).localeCompare(String(vb)) : va - vb;
        if (cmp === 0) return b._montoNum - a._montoNum;
        return cmp * dir
    })
}

function tableSortButton(table, key, labelHtml, state, cls) {
    var active = state && state.sortKey === key,
        dir = active ? state.sortDir : "",
        icon = active ? (dir === "asc" ? "↑" : "↓") : "↕";
    return '<button class="table-sort-btn ' + (cls || "") + (active ? " is-active is-" + dir : "") + '" type="button" data-sort-table="' + table + '" data-sort-key="' + key + '" onclick="setTableSort(\'' + table + '\',\'' + key + '\')" title="Ordenar ' + escAttr(String(labelHtml).replace(/<[^>]*>/g, "")) + '"><span class="sort-label">' + labelHtml + '</span><span class="sort-indicator">' + icon + '</span></button>'
}

function syncTableSortButtons(table, state) {
    document.querySelectorAll('.table-sort-btn[data-sort-table="' + table + '"]').forEach(function(btn) {
        var active = state && state.sortKey === btn.getAttribute("data-sort-key"),
            dir = active ? state.sortDir : "",
            indicator = btn.querySelector(".sort-indicator");
        btn.classList.toggle("is-active", !!active);
        btn.classList.toggle("is-asc", dir === "asc");
        btn.classList.toggle("is-desc", dir === "desc");
        if (indicator) indicator.textContent = active ? (dir === "asc" ? "↑" : "↓") : "↕"
    })
}

function setTableSort(table, key) {
    var state = table === "items" ? itemsState : table === "recup" ? recupState : incidState;
    if (!state) return;
    if (state.sortKey === key) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    else {
        state.sortKey = key;
        state.sortDir = "desc"
    }
    state.page = 0;
    sortTableRows(state);
    if (table === "items") renderItemsTable();
    else if (table === "recup") renderRecupTable();
    else renderIncidTable()
}

function clampTablePage(state) {
    var totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (state.page >= totalPages) state.page = totalPages - 1;
    if (state.page < 0) state.page = 0;
    return totalPages
}

function getPageSlice(state) {
    clampTablePage(state);
    var start = state.page * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize)
}

function buildVendorTotals(rows) {
    var totals = {};
    rows.forEach(function(row) {
        var vendor = row._vendorLabel || "Sin Vendedor Asignado";
        if (!totals[vendor]) totals[vendor] = { count: 0, monto: 0 };
        totals[vendor].count++;
        totals[vendor].monto += row._montoNum
    });
    return totals
}

function renderTablePagination(state, fnName) {
    var total = state.filtered.length,
        pageSize = state.pageSize,
        totalPages = clampTablePage(state);
    if (totalPages <= 1) return "";
    var current = state.page,
        start = current * pageSize + 1,
        end = Math.min(total, (current + 1) * pageSize),
        from = Math.max(0, current - 2),
        to = Math.min(totalPages - 1, current + 2),
        prevIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
        nextIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
        html = '<div class="page-info">Mostrando <strong>' + fmtInt(start) + '-' + fmtInt(end) + '</strong> de <strong>' + fmtInt(total) + '</strong></div><div class="page-actions" role="navigation" aria-label="Paginacion de tabla">';
    function btn(label, page, disabled, active, cls, ariaLabel) {
        html += '<button class="page-btn ' + (cls || "") + (active ? " active" : "") + '" type="button" onclick="' + fnName + '(' + page + ')" aria-label="' + (ariaLabel || label) + '"' + (disabled ? " disabled" : "") + '>' + label + '</button>'
    }
    btn(prevIcon + '<span>Anterior</span>', Math.max(0, current - 1), current === 0, !1, "page-btn-nav page-btn-prev", "Anterior");
    if (from > 0) {
        btn("1", 0, !1, current === 0, "page-btn-number");
        if (from > 1) html += '<span class="page-ellipsis">...</span>'
    }
    for (var i = from; i <= to; i++) btn(String(i + 1), i, !1, i === current, "page-btn-number");
    if (to < totalPages - 1) {
        if (to < totalPages - 2) html += '<span class="page-ellipsis">...</span>';
        btn(String(totalPages), totalPages - 1, !1, current === totalPages - 1, "page-btn-number")
    }
    btn('<span>Siguiente</span>' + nextIcon, Math.min(totalPages - 1, current + 1), current === totalPages - 1, !1, "page-btn-nav page-btn-next", "Siguiente");
    return html + "</div>"
}

function openModalFrame(modal) {
    modal.classList.remove("is-closing");
    modal.style.display = "flex";
    requestAnimationFrame(function() {
        modal.classList.add("is-open")
    })
}

function scrollTableToTop(bodyId) {
    var body = document.getElementById(bodyId),
        wrap = body ? body.closest(".items-table-wrap") : null;
    if (wrap) requestAnimationFrame(function() { wrap.scrollTop = 0 })
}


let itemsState = {
        all: [],
        filtered: [],
        page: 0,
        pageSize: 50,
        sortKey: "",
        sortDir: "desc"
    },
    itemsFilterTimeout = null;
async function renderItemsView() {
    const l = document.getElementById("vwItems"),
        prevFilters = captureItemsFilterState();
    document.querySelectorAll(".vw").forEach(g => g.classList.remove("on")), l.classList.add("on"), document.querySelectorAll(".sidebar-nav .tab").forEach(g => g.classList.remove("on")), document.getElementById("btnItems").classList.add("on"), updateTopBrand("Items Borrados"), updateTopTime();
    l.innerHTML = buildItemsHtml();
    document.getElementById("itemsBody").innerHTML = buildTableLoader('Cargando items...');
    try {
        const g = await db_getItems({
            estado: "pendiente",
            limit: 0
        });
        itemsState.all = g.data || [];
        try {
            var sup = getSupabase();
            // Extraer materiales únicos de los items para no traer las 17k filas
            var matsUniqSet = {}, matsUniq = [];
            itemsState.all.forEach(function(item) {
                var m = String(item.material || "").trim();
                if (m && !matsUniqSet[m]) { matsUniqSet[m] = true; matsUniq.push(m); }
            });
            var stockMap = {};
            for (var _mi = 0; _mi < matsUniq.length; _mi += 500) {
                var _batch = matsUniq.slice(_mi, _mi + 500);
                var { data: stockRows } = await sup.from("stock").select("material, almacen, cantidad").in("material", _batch);
                if (stockRows) {
                    stockRows.forEach(function(s) {
                        if (!stockMap[s.material]) stockMap[s.material] = {};
                        stockMap[s.material][s.almacen] = s.cantidad;
                    });
                }
            }
            itemsState.all.forEach(function(item) {
                var matStock = stockMap[item.material] || {};
                item.stock_ldal  = matStock["LDAL"]  != null ? matStock["LDAL"]  : (item.stock_ldal  || 0);
                item.stock_ldfa  = matStock["LDFA"]  != null ? matStock["LDFA"]  : (item.stock_ldfa  || 0);
                item.stock_ldlq  = matStock["LDLQ"]  != null ? matStock["LDLQ"]  : (item.stock_ldlq  || 0);
                item.stock_lftd  = matStock["LFTD"]  != null ? matStock["LFTD"]  : (item.stock_lftd  || 0);
                // Sumar los cuatro campos ya resueltos (no desde matStock vacío)
                item.stock_total = (Number(item.stock_ldal) || 0) + (Number(item.stock_ldfa) || 0)
                                 + (Number(item.stock_ldlq) || 0) + (Number(item.stock_lftd) || 0);
                item._stockLdalNum  = Number(item.stock_ldal)  || 0;
                item._stockLdfaNum  = Number(item.stock_ldfa)  || 0;
                item._stockLdlqNum  = Number(item.stock_ldlq)  || 0;
                item._stockLftdNum  = Number(item.stock_lftd)  || 0;
                item._stockTotalNum = item.stock_total;
            });
        } catch (stockErr) {
            console.warn("Could not load stock data:", stockErr);
        }
        itemsState.filtered = [...itemsState.all]; itemsState.page = 0;
        var h = document.getElementById("itemsFilterVendedor");
        if (h) {
            var d = [...new Set(itemsState.all.map(function(b) { return b.vendedor_externo }).filter(Boolean))].sort();
            h.innerHTML = '<option value="">Todos los vendedores</option>' + d.map(function(b) {
                return '<option value="' + esc(b) + '">' + esc(b) + "</option>"
            }).join("")
        }
        try {
            var catRows = await db_getCatalogo();
            var grupos = [...new Set(catRows.map(function(c) { return c.grupo }).filter(Boolean))].sort();
            var marcas = [...new Set(catRows.map(function(c) { return c.marca }).filter(Boolean))].sort();
            var catMap = {};
            catRows.forEach(function(c) { catMap[c.material] = { marca: c.marca, grupo: c.grupo } });
            itemsState.all.forEach(function(item) {
                var m = catMap[item.material] || {};
                item._grupo = m.grupo || '';
                item._marca = m.marca || '';
            });
            var gEl = document.getElementById("itemsFilterGrupo");
            if (gEl) { gEl.innerHTML = '<option value="">Todos los grupos</option>' + grupos.map(function(g) { return '<option value="' + esc(g) + '">' + esc(g) + "</option>" }).join("") }
            var mEl = document.getElementById("itemsFilterMarca");
            if (mEl) { mEl.innerHTML = '<option value="">Todas las marcas</option>' + marcas.map(function(m) { return '<option value="' + esc(m) + '">' + esc(m) + "</option>" }).join("") }
        } catch (catErr) { console.warn("Could not load catalogo:", catErr) }
        cacheUiRows(itemsState.all);
        restoreItemsFilterState(prevFilters);
        enhanceSelect("itemsFilterGrupo");
        enhanceSelect("itemsFilterMarca");
        enhanceSelect("itemsFilterVendedor");
        enhanceSelect("itemsFilterStock");
        applyItemsFilters();
        updateStockFilterColor();
        if (!document.getElementById("itemsBody")._delegated) { document.getElementById("itemsBody")._delegated = true;
            document.getElementById("itemsBody").addEventListener("click", function(e) {
                var btn = e.target.closest("[data-action]"); if (!btn) return;
                var id = btn.getAttribute("data-id"), action = btn.getAttribute("data-action");
                if (action === "recuperar") gestionarItem(id, "recuperado");
                else if (action === "no-recuperar") showNoRecuperadoModal(id);
                else if (action === "detalle") openItemDetail(id)
            }) }
    } catch (g) {
        l.innerHTML = `<div class="error-state"><div class="error-msg">Error: ${g.message}</div></div>`
    }
}

function buildItemsHtml() {
    const l = ESTADOS.recuperado.nm,
        h = ESTADOS.no_recuperado.nm;
    return `
    <div class="pro-toolbar">
      <div class="pro-search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="itemsSearch" placeholder="Buscar por cliente, material, documento..." oninput="onItemsSearch()">
      </div>
      <div class="pro-filters-group">
        <div class="items-select-wrap" style="display:none">
          <select id="itemsFilterEstado"><option value="pendiente"></option></select>
        </div>
        <input type="hidden" id="itemsFilterFechaDesde">
        <input type="hidden" id="itemsFilterFechaHasta">
        <button class="date-btn-trigger" id="dateFilterBtn_items" onclick="openDateModal('items')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span id="dateFilterText_items">Fechas</span>
        </button>
        <div class="pro-filter-pill vendor-filter">
          <select id="itemsFilterVendedor" onchange="onItemsFilter()">
            <option value="">Todos los vendedores</option>
          </select>
        </div>
        <div class="pro-filter-pill stock-filter">
          <select id="itemsFilterStock" onchange="onItemsFilter()">
            <option value="">Todo Stock</option>
            <option value="ok">Stock OK</option>
            <option value="bajo">Stock Bajo</option>
            <option value="cero">Stock 0</option>
          </select>
        </div>
        <div class="pro-filter-pill">
          <select id="itemsFilterGrupo" onchange="onItemsFilter()">
            <option value="">Todos los grupos</option>
          </select>
        </div>
        <div class="pro-filter-pill">
          <select id="itemsFilterMarca" onchange="onItemsFilter()">
            <option value="">Todas las marcas</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="items-count" id="itemsCount"></div>
    <div id="itemsBulkBar">
      <span id="itemsBulkCount">0 seleccionados</span>
      <button onclick="bulkMarcarSinStock()" class="bulk-btn-sinstock">⊘ Marcar Sin Stock</button>
      <button onclick="bulkDeselectAll()" class="bulk-btn-cancel">Cancelar</button>
    </div>
    <div class="items-table-wrap pro-table-wrap">
      <table class="items-table pro-table">
        <thead>
          <tr>
            <th style="width:36px;text-align:center"><input type="checkbox" id="itemsSelectAll" onchange="toggleSelectAllItems(this)" style="cursor:pointer;width:15px;height:15px"></th>
            <th style="width:88px">${tableSortButton("items", "fecha_carga", "Fecha Carga", itemsState)}</th>
            <th style="width:130px;max-width:130px">Cliente</th>
            <th style="width:110px">DOC. VENTA</th>
            <th style="width:165px">Material</th>
            <th class="th-principal" style="width:92px" title="Almacén Principal">${tableSortButton("items", "stock_ldal", '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:-1px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> LDAL', itemsState, "th-chip-blue")}</th>
            <th class="th-secundario" style="width:74px">${tableSortButton("items", "stock_ldfa", "LDFA", itemsState, "th-chip-gray")}</th>
            <th class="th-secundario" style="width:74px">${tableSortButton("items", "stock_ldlq", "LDLQ", itemsState, "th-chip-gray")}</th>
            <th class="th-secundario" style="width:74px">${tableSortButton("items", "stock_lftd", "LFTD", itemsState, "th-chip-gray")}</th>
            <th class="th-secundario" style="width:78px" title="Stock total en todos los almacenes">${tableSortButton("items", "stock_total", "Total", itemsState, "th-chip-gray")}</th>
            <th style="width:78px;text-align:right">${tableSortButton("items", "cantidad_pedido", "Cant.", itemsState)}</th>
            <th class="pro-col-monto" style="width:108px">${tableSortButton("items", "total_importe", "Monto Total", itemsState)}</th>
            <th class="pro-col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody id="itemsBody"></tbody>
        <tfoot id="itemsFoot" style="display:none"></tfoot>
      </table>
    </div>
    <div class="items-pagination" id="itemsPagination"></div>
    <div class="modal-overlay" id="itemModal" style="display:none" onclick="if(event.target===this)closeItemModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3 id="itemModalTitle">Gestión del Ítem</h3>
          <button class="modal-close" onclick="closeItemModal()">✕</button>
        </div>
        <div class="modal-body" id="itemModalBody"></div>
      </div>
    </div>`
}

function renderItemsTable() {
    const { filtered: l } = itemsState, k = getPageSlice(itemsState), E = document.getElementById("itemsBody"), I = document.getElementById("itemsCount"), $ = document.getElementById("itemsPagination");
    updateTopBrand("Items Borrados", getRowsDateRangeLabel(l, function(w) {
        return w.fecha_carga
    }));
    if (I.innerHTML = `<strong>${l.length} items</strong>${l.length!==itemsState.all.length?` <span style="opacity:0.6">(filtrados de ${itemsState.all.length})</span>`:""}`, !l.length) {
        var emptyFoot = document.getElementById("itemsFoot");
        if (emptyFoot) emptyFoot.style.display = "none";
        E.innerHTML = '<tr><td colspan="12"><div class="empty-state">No se encontraron items</div></td></tr>', $.innerHTML = "";
        syncTableSortButtons("items", itemsState);
        return
    }

    const vendorTotals = itemsState._vendorTotals || buildVendorTotals(l);
    let lastVendor = null;
    let html = '';

    k.forEach(function(w) {
        const currentVendor = w._vendorLabel || 'Sin Vendedor Asignado';
        
        if (currentVendor !== lastVendor) {
            const g = vendorTotals[currentVendor] || { count: 0, monto: 0 };
            html += '<tr class="group-header-row"><td colspan="13"><div class="group-header-content"><div class="group-vendor-name"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' + esc(currentVendor) + '</div><div class="group-vendor-stats"><span>' + g.count + ' \u00edtems</span><span class="dot-sep">&bull;</span><span class="tot-monto">Total: <strong>' + fmtGs(g.monto) + '</strong></span></div></div></td></tr>';
            lastVendor = currentVendor;
        }

        var pendBtns = '';
        if (w.estado === 'pendiente') {
            pendBtns = '<button class="pro-btn-action ok" data-action="recuperar" data-id="' + w.id + '" title="Marcar Recuperado"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></button><button class="pro-btn-action err" data-action="no-recuperar" data-id="' + w.id + '" title="Marcar No Recuperado"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        }

        var stockTotal = w.stock_total != null ? w.stock_total : ((w.stock_ldal||0) + (w.stock_ldfa||0) + (w.stock_ldlq||0) + (w.stock_lftd||0));
        var stockClass = stockTotal >= (+(w.cantidad_pedido || 0)) ? 'stock-ok' : 'stock-low';

        html += '<tr class="items-row ' + w.estado + '">' +
            '<td style="text-align:center;width:36px"><input type="checkbox" class="item-row-check" data-id="' + w.id + '" onchange="onItemCheckChange()" style="cursor:pointer;width:15px;height:15px"></td>' +
            '<td class="pro-date" style="white-space: nowrap; font-size: 12px;">' + fmtDate(w.fecha_carga) + '</td>' +
            '<td class="pro-client" title="' + esc(w.nombre||"") + '">' + esc(w.nombre||"") + '</td>' +
            '<td>' + copyChip(w.doc_vtas||"-") + '</td>' +
            '<td>' + copyChip(w.material||"-") + '<br><span class="pro-desc-small">' + esc(w.denominacion||"-") + '</span></td>' +
            '<td class="stock-cell stock-principal ' + stockClass + '">' + fmtInt(w.stock_ldal) + '</td>' +
            '<td class="stock-cell stock-secundario">' + fmtInt(w.stock_ldfa) + '</td>' +
            '<td class="stock-cell stock-secundario">' + fmtInt(w.stock_ldlq) + '</td>' +
            '<td class="stock-cell stock-secundario">' + fmtInt(w.stock_lftd) + '</td>' +
            '<td class="stock-cell stock-secundario stock-total-cell ' + stockClass + '" title="Stock total en todos los almacenes"><strong>' + fmtInt(stockTotal) + '</strong></td>' +
            '<td class="qty-cell">' + fmtInt(w.cantidad_pedido) + '</td>' +
            '<td class="pro-monto-cell">' + fmtGs(w.total_importe) + '</td>' +
            '<td class="pro-actions-cell"><div class="pro-action-group">' + pendBtns + '</div></td></tr>';
    });
    
    E.innerHTML = html;

    var foot = document.getElementById("itemsFoot"), totItems = 0, totMonto = 0;
    l.forEach(function(w) { totItems++; totMonto += w._montoNum || 0 });
    if (foot) { foot.style.display = ""; foot.innerHTML = '<tr class="totals-row"><td colspan="4" class="totals-label">TOTALES</td><td style="font-weight:800;color:var(--brand-dark);font-size:12px">' + fmtInt(totItems) + ' items</td><td></td><td></td><td></td><td></td><td></td><td></td><td class="pro-monto-cell" style="font-weight:800;font-size:13px">' + fmtGs(totMonto) + '</td><td></td></tr>' }

    $.innerHTML = renderTablePagination(itemsState, "itemsPage");
    syncTableSortButtons("items", itemsState);
}


function itemsPage(l) {
    itemsState.page = l, renderItemsTable(), scrollTableToTop("itemsBody")
}

function onItemCheckChange() {
    var checks = document.querySelectorAll(".item-row-check:checked");
    var bar = document.getElementById("itemsBulkBar");
    var countEl = document.getElementById("itemsBulkCount");
    var selectAll = document.getElementById("itemsSelectAll");
    var allChecks = document.querySelectorAll(".item-row-check");
    if (bar) {
        if (checks.length > 0 && bar.style.display !== "flex") {
            bar.style.animation = "none";
            bar.style.display = "flex";
            void bar.offsetWidth; // reflow to restart animation
            bar.style.animation = "";
        } else if (checks.length === 0) {
            bar.style.display = "none";
        }
    }
    if (countEl) countEl.textContent = checks.length + " seleccionado" + (checks.length !== 1 ? "s" : "");
    if (selectAll) selectAll.indeterminate = checks.length > 0 && checks.length < allChecks.length;
    if (selectAll) selectAll.checked = checks.length > 0 && checks.length === allChecks.length;
}

function toggleSelectAllItems(cb) {
    var checks = document.querySelectorAll(".item-row-check");
    checks.forEach(function(c) { c.checked = cb.checked; });
    onItemCheckChange();
}

function bulkDeselectAll() {
    document.querySelectorAll(".item-row-check").forEach(function(c) { c.checked = false; });
    var selectAll = document.getElementById("itemsSelectAll");
    if (selectAll) { selectAll.checked = false; selectAll.indeterminate = false; }
    var bar = document.getElementById("itemsBulkBar");
    if (bar) bar.style.display = "none";
}

async function bulkMarcarSinStock() {
    var checks = document.querySelectorAll(".item-row-check:checked");
    var ids = Array.prototype.slice.call(checks).map(function(c) { return c.getAttribute("data-id"); });
    if (ids.length === 0) return;
    var ok = await showConfirm("Marcar Sin Stock", "¿Marcar " + ids.length + " item(s) como Sin Stock?", "Confirmar", "Cancelar");
    if (!ok) return;
    try {
        var nowSS = new Date().toISOString();
        for (var i = 0; i < ids.length; i += 100) {
            var batch = ids.slice(i, i + 100);
            var { error } = await getSupabase().from("items_borrados")
                .update({ estado: "sin_stock", fecha_gestion: nowSS })
                .in("id", batch);
            if (error) throw error;
        }
        // Quitar de la vista local
        var idSet = new Set(ids);
        itemsState.all = itemsState.all.filter(function(r) { return !idSet.has(r.id); });
        itemsState.filtered = itemsState.filtered.filter(function(r) { return !idSet.has(r.id); });
        bulkDeselectAll();
        renderItemsTable();
        showToast(ids.length + " item(s) marcados como Sin Stock", "success", 4000);
        checkNewNotifications();
    } catch(e) {
        showToast("Error: " + e.message, "error");
    }
}

function updateStockFilterColor() {
    var s = document.getElementById("itemsFilterStock");
    if (!s) return;
    var pill = s.closest(".stock-filter");
    if (!pill) return;
    var dt = pill.querySelector(".ssel-dt");
    if (dt) dt.style.color = s.value === "ok" ? "#10B981" : s.value === "bajo" ? "#EF4444" : ""
}

function onItemsSearch() {
    itemsState.page = 0, clearTimeout(itemsFilterTimeout), itemsFilterTimeout = setTimeout(applyItemsFilters, 220)
}

function onDashFilter() {
    renderDashboard(), checkNewNotifications()
}

function onItemsFilter() {
    itemsState.page = 0, applyItemsFilters(), updateStockFilterColor()
}

function applyItemsFilters() {
    var k, E, I, $, L;
    const l = (((k = document.getElementById("itemsSearch")) == null ? void 0 : k.value) || "").toLowerCase().trim(),
        h = ((E = document.getElementById("itemsFilterEstado")) == null ? void 0 : E.value) || "",
        d = ((I = document.getElementById("itemsFilterVendedor")) == null ? void 0 : I.value) || "",
        g = (($ = document.getElementById("itemsFilterFechaDesde")) == null ? void 0 : $.value) || "",
        b = ((L = document.getElementById("itemsFilterFechaHasta")) == null ? void 0 : L.value) || "";
    
    let stockFilter = ((L = document.getElementById("itemsFilterStock")) == null ? void 0 : L.value) || "";
    var grupoF = ((k = document.getElementById("itemsFilterGrupo")) == null ? void 0 : k.value) || "";
    var marcaF = ((E = document.getElementById("itemsFilterMarca")) == null ? void 0 : E.value) || "";
    
    var bounds = getDateBounds(g, b);
    let filtered = itemsState.all.filter(w => {
        if (!w._itemsSearch) cacheUiRow(w);
        if (h && w.estado !== h || d && (w.vendedor_externo || "") !== d) return !1;
        if (grupoF && (w._grupo || "") !== grupoF) return !1;
        if (marcaF && (w._marca || "") !== marcaF) return !1;
        if (!rowInDateBounds(w, bounds)) return !1;
        if (stockFilter === "ok" && w._stockLdalNum < w._cantidadPedidoNum) return !1;
        if (stockFilter === "bajo" && w._stockLdalNum >= w._cantidadPedidoNum) return !1;
        if (stockFilter === "cero" && w._stockTotalNum > 0) return !1;
        if (!cachedSearchIncludes(w._itemsSearch, l)) return !1;
        return !0
    });

    itemsState.filtered = filtered;
    sortTableRows(itemsState);
    itemsState._vendorTotals = buildVendorTotals(filtered);
    renderItemsTable();
}
async function openItemDetail(l) {
    const h = document.getElementById("itemModal"),
        d = document.getElementById("itemModalBody");
    openModalFrame(h);

    try {
        let U = function(B) { return '<div class="split-detail-sec"><div class="split-detail-sec-title">' + B + "</div><div class=\"split-detail-grid\">" },
            F = function() { return "</div></div>" },
            D = function(B, J) { return '<div class="split-detail-item"><span class="split-detail-lbl">' + B + '</span><span class="split-detail-val">' + J + "</span></div>" },
            x = function(B, J) { return '<div class="split-detail-item"><span class="split-detail-lbl">' + B + '</span><span class="split-detail-val num">' + J + "</span></div>" };
        
        const w = itemsState.all.find(B => B.id === l);
        if (!w) throw new Error("Item no encontrado");
        
        const v = ESTADOS[w.estado] || ESTADOS.pendiente,
            N = w.estado === "pendiente",
            q = window.currentUser && window.currentUser.rol === "admin";
        
        var g = "";
        if (!N || w.incidencia) {
            g += '<div class="split-detail-sec highlight"><div class="split-detail-sec-title">Gestión</div><div class="split-detail-grid">';
            g += D("Estado", `<span class="status-badge" style="background:${v.bg};color:${v.tc}">${v.nm}</span>`);
            if (!N) {
                g += D("Gestionado por", `<strong>${esc(w.recuperado_por || "-")}</strong>`);
                g += D("Fecha Gestión", fmtDate(w.fecha_gestion));
                if (w.estado === "facturado" && w.fecha_fact) g += D("Fecha Factura", fmtDate(w.fecha_fact));
            }
            if (w.incidencia) {
                g += D("Incidencia", `<span class="inc-badge">${esc(getIncidenciaName(w.incidencia) || w.incidencia)}</span>`);
            }
            if (w.motivo_rechazo) g += D("Motivo", esc(w.motivo_rechazo));
            g += "</div></div>";
        }

        var b = '<div class="split-detail-footer">';
        if (N) {
            b += `<div class="split-footer-actions">
              <button class="split-btn split-btn-recup" onclick="gestionarItem('${w.id}', 'recuperado')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Recuperado</button>
              <button class="split-btn split-btn-norecup" onclick="showNoRecuperadoModal('${w.id}')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> No Recuperado</button>
              <button class="split-btn" style="background:var(--bg-body); color:var(--text-main); border: 1px solid var(--border-color)" onclick="document.getElementById('detailEditFields').style.display='block'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Editar</button>
            </div>

            <div id="detailEditFields" class="split-norecup-fields" style="display:none;">
              <div class="split-norecup-inner" style="background: var(--bg-body); border: 1px solid var(--border-color);">
                <div class="split-norecup-field">
                  <label class="detail-label">Nueva Cantidad Pedida</label>
                  <input type="number" id="detailEditCant" class="form-input" style="width:100%; padding: 8px; border-radius:6px; border: 1px solid var(--border-color)" value="${w.cantidad_pedido || 0}">
                </div>
                <button class="split-btn-confirmar" style="background: var(--brand-main); color: white;" onclick="guardarEdicionPedido('${w.id}')">Guardar Cambios</button>
                <button class="split-btn" style="margin-top:8px; background:transparent; color:var(--text-main); width: 100%;" onclick="document.getElementById('detailEditFields').style.display='none'">Cancelar</button>
              </div>
            </div>`;
        } else {
            b += '<div class="split-footer-status solo">';
            if (q) b += `<button class="btn-revertir" onclick="gestionarItem('${w.id}', 'pendiente')">Revertir a Pendiente</button>`;
            b += "</div>";
        }
        b += "</div>";

        const getAlmacenColor = (alm) => {
            const str = alm || "VAR";
            let hash = 0;
            for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
            const hue = Math.abs(hash % 360);
            return `hsl(${hue}, 70%, 45%)`;
        };
        const almColor = getAlmacenColor(w.almacen);
        const almacBadge = `<span class="pro-badge-almacen" style="--alm-color: ${almColor}; border-color: ${almColor}44; color: ${almColor}; background: ${almColor}11;">${esc(w.almacen||"-")}</span>`;

        d.innerHTML = `
        <div class="split-detail-header">
            <h2>${esc(w.nombre || "-")}</h2>
            <div class="split-detail-header-meta">
                <span class="split-doc">${esc(w.doc_vtas || "-")}</span>
                <span class="status-badge" style="background:${v.bg};color:${v.tc}">${v.nm}</span>
            </div>
        </div>
        <div class="split-detail-content">
            ${U("Identificación")}
                ${D("Documento de Venta", esc(w.doc_vtas || "-"))}
                ${D("Solicitud", esc(w.solic || "-"))}
                ${D("Cliente", esc(w.nombre || "-"))}
                ${D("Fecha Carga", fmtDate(w.fecha_carga))}
            ${F()}
            ${U("Material y Logística")}
                ${D("Material", "<code>" + esc(w.material || "-") + "</code>")}
                ${D("Denominación", esc(w.denominacion || "-"))}
                ${D("Almacén", almacBadge)}
                ${D("Tipo Venta", esc(w.cond_exp || "-"))}
                ${D("Presentación", esc(w.presentacion || "-"))}
            ${F()}
            ${U("Cantidades y Montos")}
                ${x("Cantidad Pedido", fmtInt(w.cantidad_pedido))}
                ${x("Cant. Facturada", fmtInt(w.cant_fact))}
                ${x("Total Importe", "<strong style='color:#059669; font-size:18px;'>" + fmtGs(w.total_importe) + "</strong>")}
            ${F()}
            ${g}
        </div>
        ${b}
        `;

    } catch (L) {
        d.innerHTML = `<div class="error-msg">Error: ${L.message}</div>`;
    }
}

function closeItemModal() {
    const l = document.getElementById("itemModal");
    l.classList.remove("is-open"), l.classList.add("is-closing"), setTimeout(function() {
        l.classList.remove("is-closing"), l.style.display = "none"
    }, 400)
}
async function gestionarItem(l, h) {
    if (h === "recuperado") {
        var item = itemsState.all.find(function(x) { return x.id === l });
        var ok = await showConfirmRecuperado(item);
        if (!ok) return
    }
    if (h === "pendiente") {
        var g = await showConfirm("\u00BFEst\u00E1s seguro?", "\u00BFRevetir este item a Pendiente?");
        if (!g) return
    }
    try {
        const k = window.currentUser;
        await db_updateItem(l, {
            estado: h,
            recuperado_por: k ? k.nombre : "Sistema",
            incidencia: null,
            motivo_rechazo: null
        });
        var idx = itemsState.all.findIndex(function(I) { return I.id === l; });
        if (idx >= 0) {
            if (h === "pendiente") {
                itemsState.all[idx].estado = h;
            } else {
                itemsState.all.splice(idx, 1);
            }
        }
        closeItemModal();
        applyItemsFilters();
        checkNewNotifications();
        var label = h === "recuperado" ? "Recuperado" : "Pendiente";
        showCenteredCheck(label);
    } catch (k) {
        showToast("Error: " + k.message, "error")
    }
}

async function guardarEdicionPedido(l) {
    const cant = document.getElementById("detailEditCant").value;
    if (!cant) {
        showToast("Ingresa una cantidad válida", "error");
        return;
    }
    try {
        await db_updateItem(l, {
            cantidad_pedido: parseInt(cant, 10)
        });
        const E = itemsState.all.findIndex(I => I.id === l);
        if (E >= 0) {
            itemsState.all[E].cantidad_pedido = parseInt(cant, 10);
            cacheUiRow(itemsState.all[E]);
        }
        showToast("Cantidad actualizada correctamente", "success");
        closeItemModal();
        applyItemsFilters();
    } catch (k) {
        showToast("Error al guardar: " + k.message, "error");
    }
}
function editableIcon() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
}
var recupState = {
        all: [],
        filtered: [],
        page: 0,
        pageSize: 50,
        sortKey: "",
        sortDir: "desc"
    },
    recupFilterTimeout = null;
async function renderRecuperadosView() {
    var l = document.getElementById("vwRecuperados"),
        prevFilters = captureRecupFilterState();
    document.querySelectorAll(".vw").forEach(function(d) {
        d.classList.remove("on")
    }), l.classList.add("on"), document.querySelectorAll(".sidebar-nav .tab").forEach(function(d) {
        d.classList.remove("on")
    }), document.getElementById("btnRecuperados").classList.add("on"), updateTopBrand("Pedidos Gestionados"), updateTopTime();
    l.innerHTML = buildRecupHtml();
    document.getElementById("recupBody").innerHTML = buildTableLoader('Cargando pedidos...');
    try {
        var estadoResults = await Promise.all([
            db_getItems({ estado: "recuperado", limit: 0 }),
            db_getItems({ estado: "no_recuperado", limit: 0 }),
            db_getItems({ estado: "contabilizado", limit: 0 }),
            db_getItems({ estado: "facturado", limit: 0 }),
            db_getItems({ estado: "items_borrado", limit: 0 }),
            db_getItems({ estado: "sin_stock", limit: 0 })
        ]);
        var allRecup = [];
        estadoResults.forEach(function(res) {
            allRecup = allRecup.concat(res.data || [])
        });
        recupState.all = allRecup; recupState.filtered = [].concat(recupState.all); recupState.page = 0;
        var v = document.getElementById("recupFilterVendedor");
        if (v) {
            var vd = [...new Set(recupState.all.map(function(b) { return b.vendedor_externo }).filter(Boolean))].sort();
            v.innerHTML = '<option value="">Todos los vendedores</option>' + vd.map(function(b) {
                return '<option value="' + esc(b) + '">' + esc(b) + "</option>"
            }).join("")
        }
        try {
            var catRows = await db_getCatalogo();
            var catMap = {};
            catRows.forEach(function(c) { catMap[c.material] = { marca: c.marca, grupo: c.grupo } });
            recupState.all.forEach(function(item) {
                var m = catMap[item.material] || {};
                item._grupo = m.grupo || '';
                item._marca = m.marca || '';
            });
            var grupos = [...new Set(catRows.map(function(c) { return c.grupo }).filter(Boolean))].sort();
            var marcas = [...new Set(catRows.map(function(c) { return c.marca }).filter(Boolean))].sort();
            var gEl = document.getElementById("recupFilterGrupo");
            if (gEl) { gEl.innerHTML = '<option value="">Todos los grupos</option>' + grupos.map(function(g) { return '<option value="' + esc(g) + '">' + esc(g) + "</option>" }).join("") }
            var mEl = document.getElementById("recupFilterMarca");
            if (mEl) { mEl.innerHTML = '<option value="">Todas las marcas</option>' + marcas.map(function(m) { return '<option value="' + esc(m) + '">' + esc(m) + "</option>" }).join("") }
        } catch (catErr) { console.warn("Could not load catalogo:", catErr) }
        cacheUiRows(recupState.all);
        restoreRecupFilterState(prevFilters);
        enhanceSelect("recupFilterEstado");
        enhanceSelect("recupFilterGrupo");
        enhanceSelect("recupFilterMarca");
        enhanceSelect("recupFilterVendedor");
        applyRecupFilters()
    } catch (d) {
        l.innerHTML = '<div class="error-state"><div class="error-msg">Error: ' + esc(d.message) + "</div></div>"
    }
}

function buildRecupHtml() {
    return `
    <div class="pro-toolbar">
      <div class="pro-search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="recupSearch" placeholder="Buscar por cliente, material, documento..." oninput="onRecupSearch()">
      </div>
      <div class="pro-filters-group">
        <input type="hidden" id="recupFilterDesde">
        <input type="hidden" id="recupFilterHasta">
        <button class="date-btn-trigger" id="dateFilterBtn_recup" onclick="openDateModal('recup')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span id="dateFilterText_recup">Fechas</span>
        </button>
        <div class="pro-filter-pill state-filter">
          <select id="recupFilterEstado" onchange="onRecupFilter()">
            <option value="">Todos los estados</option>
            <option value="recuperado">Recuperado</option>
            <option value="no_recuperado">No recuperado</option>
            <option value="contabilizado">Contabilizado</option>
            <option value="facturado">Facturado</option>
            <option value="items_borrado">Reborrado</option>
            <option value="sin_stock">Sin Stock</option>
          </select>
        </div>
        <div class="pro-filter-pill vendor-filter">
          <select id="recupFilterVendedor" onchange="onRecupFilter()">
            <option value="">Todos los vendedores</option>
          </select>
        </div>
        <div class="pro-filter-pill">
          <select id="recupFilterGrupo" onchange="onRecupFilter()">
            <option value="">Todos los grupos</option>
          </select>
        </div>
        <div class="pro-filter-pill">
          <select id="recupFilterMarca" onchange="onRecupFilter()">
            <option value="">Todas las marcas</option>
          </select>
        </div>
      </div>
    </div>
    <div class="items-count" id="recupCount"></div>
    <div class="items-table-wrap pro-table-wrap">
      <table class="items-table pro-table">
        <thead>
          <tr>
            <th>${tableSortButton("recup", "fecha_carga", "Fecha Carga", recupState)}</th>
            <th>Gestor</th>
            <th>Cliente</th>
            <th>DOC. VENTA</th>
            <th>Material</th>
            <th>Almacén</th>
            <th style="text-align:right">${tableSortButton("recup", "cantidad_pedido", "Cant. Pedida", recupState)}</th>
            <th class="pro-col-monto">${tableSortButton("recup", "total_importe", "Monto Total", recupState)}</th>
            <th class="pro-col-actions">ESTADO</th>
          </tr>
        </thead>
        <tbody id="recupBody"></tbody>
      </table>
    </div>
    <div class="items-pagination" id="recupPagination"></div>`;
}

function renderRecupTable() {
    const l = recupState.filtered, pageRows = getPageSlice(recupState), E = document.getElementById("recupBody"), I = document.getElementById("recupCount"), $ = document.getElementById("recupPagination");
    updateTopBrand("Pedidos Gestionados", getRowsDateRangeLabel(l, function(w) {
        return w.fecha_carga
    }));
    if (I.innerHTML = `<strong>${l.length} pedidos gestionados</strong>${l.length!==recupState.all.length?` <span style="opacity:0.6">(filtrados de ${recupState.all.length})</span>`:""}`, !l.length) {
        E.innerHTML = '<tr><td colspan="9"><div class="empty-state">No se encontraron pedidos gestionados</div></td></tr>', $.innerHTML = "";
        syncTableSortButtons("recup", recupState);
        return
    }
    const vendorTotals = recupState._vendorTotals || buildVendorTotals(l);

    let lastVendor = null;
    let html = '';

    pageRows.forEach(w => {
        const currentVendor = w._vendorLabel || 'Sin Vendedor Asignado';
        
        if (currentVendor !== lastVendor) {
            html += `<tr class="group-header-row">
                <td colspan="9">
                    <div class="group-header-content">
                        <div class="group-vendor-name">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            ${esc(currentVendor)}
                        </div>
                        <div class="group-vendor-stats">
                            <span>${vendorTotals[currentVendor].count} ítems</span>
                            <span class="dot-sep">&bull;</span>
                            <span class="tot-monto">Total: <strong>${fmtGs(vendorTotals[currentVendor].monto)}</strong></span>
                        </div>
                    </div>
                </td>
            </tr>`;
            lastVendor = currentVendor;
        }

        var estado = w.estado || "recuperado";
        var estadoExtra = estado === "no_recuperado" ? `<div class="pro-desc-small" style="margin-top:4px;white-space:normal;color:var(--status-error)">${esc(getIncidenciaName(w.incidencia) || w.motivo_rechazo || w.descr_mot_rech || "Sin motivo")}</div>` : "";
        var estadoBadge = estado === "items_borrado"
            ? `<span class="status-badge" style="background:rgba(220,38,38,.10);color:#B91C1C;font-weight:700;font-size:11px;padding:4px 10px;border-radius:6px;display:inline-flex;align-items:center">Borrado ${String(w.borrado_num || 1).padStart(3, "0")}</span>`
            : buildEstadoBadge(estado);
        html += `<tr class="items-row ${escAttr(estado)}">
      <td class="pro-date" style="white-space: nowrap; font-size: 12px;">${fmtDate(w.fecha_carga)}</td>
      <td style="font-size:12px;color:var(--text-muted)"><strong>${esc(w.recuperado_por || "-")}</strong></td>
      <td class="pro-client" title="${esc(w.nombre||"")}">${esc(w.nombre||"")}</td>
      <td>${copyChip(w.doc_vtas||"-")}</td>
      <td>
        ${copyChip(w.material||"-")}<br>
        <span class="pro-desc-small">${esc(w.denominacion||"-")}</span>
      </td>
      <td><span style="${getAlmacenStyle(w.almacen)}">${esc(w.almacen||"-")}</span></td>
      <td class="qty-cell">${fmtInt(w.cantidad_pedido)}</td>
      <td class="pro-monto-cell">${fmtGs(w.total_importe)}</td>
      <td class="pro-actions-cell">${estadoBadge}${estadoExtra}</td>
    </tr>`
    });
    
    E.innerHTML = html;
    $.innerHTML = renderTablePagination(recupState, "recupPage");
    syncTableSortButtons("recup", recupState);
}

function recupPage(l) {
    recupState.page = l, renderRecupTable(), scrollTableToTop("recupBody")
}

function onRecupSearch() {
    recupState.page = 0, clearTimeout(recupFilterTimeout), recupFilterTimeout = setTimeout(applyRecupFilters, 220)
}

function onRecupFilter() {
    recupState.page = 0, applyRecupFilters()
}

function applyRecupFilters() {
    var g, b, k, E;
    var l = (((g = document.getElementById("recupSearch")) == null ? void 0 : g.value) || "").toLowerCase().trim(),
        h = ((b = document.getElementById("recupFilterDesde")) == null ? void 0 : b.value) || "",
        d = ((k = document.getElementById("recupFilterHasta")) == null ? void 0 : k.value) || "",
        m = ((E = document.getElementById("recupFilterVendedor")) == null ? void 0 : E.value) || "";
    var estadoF = ((E = document.getElementById("recupFilterEstado")) == null ? void 0 : E.value) || "";
    var grupoF = ((g = document.getElementById("recupFilterGrupo")) == null ? void 0 : g.value) || "";
    var marcaF = ((b = document.getElementById("recupFilterMarca")) == null ? void 0 : b.value) || "";
    var bounds = getDateBounds(h, d);
    recupState.filtered = recupState.all.filter(function(I) {
        if (!I._recupSearch) cacheUiRow(I);
        if (estadoF && (I.estado || "") !== estadoF) return !1;
        if (m && (I.vendedor_externo || "") !== m) return !1;
        if (grupoF && (I._grupo || "") !== grupoF) return !1;
        if (marcaF && (I._marca || "") !== marcaF) return !1;
        if (!rowInDateBounds(I, bounds)) return !1;
        if (!cachedSearchIncludes(I._recupSearch, l)) return !1;
        return !0
    }), sortTableRows(recupState), recupState._vendorTotals = buildVendorTotals(recupState.filtered), renderRecupTable()
}
async function renderUsersView() {
    const u = window.currentUser;
    if (!u || (u.rol !== "admin" && u.rol !== "supervisor")) { renderDashboard(); return }
    const l = document.getElementById("vwUsers");
    document.querySelectorAll(".vw").forEach(h => h.classList.remove("on")), l.classList.add("on"), document.querySelectorAll(".sidebar-nav .tab").forEach(h => h.classList.remove("on")), document.getElementById("btnAdminUsers").classList.add("on"), updateTopBrand("Usuarios");
    try {
        const h = await db_getUsers();
        window._allUsers = h || [];
        l.innerHTML = buildUsersHtml(h || [])
    } catch (h) {
        l.innerHTML = `<div class="error-state"><div class="error-msg">Error: ${h.message}</div></div>`
    }
}

let usersSearchTimeout = null;
function onUsersSearch() {
    clearTimeout(usersSearchTimeout);
    usersSearchTimeout = setTimeout(applyUsersFilter, 250);
}
function applyUsersFilter() {
    const q = (document.getElementById('usersSearchInput').value || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.user-card-item');
    const totalCards = cards.length;
    let visible = 0;
    cards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const rol = (card.dataset.rol || '').toLowerCase();
        const match = !q || name.includes(q) || rol.includes(q);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
    });
    const empty = document.getElementById('usersEmptyState');
    if (empty) {
        const title = empty.querySelector('h3');
        const text = empty.querySelector('p');
        if (totalCards === 0) {
            if (title) title.textContent = "No hay usuarios";
            if (text) text.textContent = "Creá el primer usuario para empezar a trabajar.";
            empty.style.display = 'flex';
        } else if (q && visible === 0) {
            if (title) title.textContent = "Sin resultados";
            if (text) text.textContent = "No hay usuarios que coincidan con la búsqueda.";
            empty.style.display = 'flex';
        } else {
            empty.style.display = 'none';
        }
    }
}

function buildUsersHtml(l) {
    const current = window.currentUser || {};
    const canCreateUsers = current.rol === 'admin';
    const isSupervisorUser = current.rol === 'supervisor';
    const groups = {};
    const order = ['admin', 'supervisor', 'operario'];
    const groupLabels = { admin: 'Administradores', supervisor: 'Jefes / Supervisores', operario: 'Operarios' };
    const groupIcons = {
        admin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        supervisor: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M20 8v5"/><path d="M22 10h-4"/></svg>',
        operario: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    };
    (l || []).forEach(u => {
        const r = u.rol || 'operario';
        if (!groups[r]) groups[r] = [];
        groups[r].push(u);
    });
    order.forEach(r => {
        if (groups[r]) groups[r].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    });
    const renderOrder = order.concat(Object.keys(groups).filter(r => !order.includes(r)).sort());
    return `
    <div class="users-view-container">
      <div class="users-header">
        <div class="users-header-left">
          <h2 class="users-title">Usuarios del Sistema</h2>
          <p class="users-subtitle">${l.length} usuario${l.length !== 1 ? 's' : ''} registrado${l.length !== 1 ? 's' : ''}</p>
        </div>
        ${canCreateUsers ? `<button class="users-btn-new" onclick="nuevoUsuario()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Usuario
        </button>` : ''}
      </div>

      <div class="users-search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="usersSearchInput" placeholder="Buscar por nombre o rol..." oninput="onUsersSearch()">
      </div>

      <div class="users-grid">
        ${renderOrder.filter(r => groups[r]).map(r => `
        <div class="users-group">
          <div class="users-group-header">
            ${groupIcons[r] || ''}
            <span>${groupLabels[r] || r}</span>
            <span class="users-group-count">${groups[r].length}</span>
          </div>
          ${groups[r].map(d => {
            const roleName = (ROLES[d.rol] && ROLES[d.rol].nm) || d.rol || 'Sin rol';
            const initial = (d.nombre || '?')[0].toUpperCase();
            let charSum = 0;
            for (let i = 0; i < (d.nombre || '').length; i++) charSum += d.nombre.charCodeAt(i);
            const avatarColor = USER_COLORS[charSum % USER_COLORS.length];
            const roleClass = d.rol === 'admin' ? 'badge-admin' : (d.rol === 'supervisor' ? 'badge-supervisor' : 'badge-operario');
            const roleIcon = d.rol === 'admin' 
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
                : d.rol === 'supervisor'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M20 8v5"/><path d="M22 10h-4"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
            const isOtherAdmin = d.rol === 'admin' && window.currentUser && window.currentUser.id !== d.id;
            const canEditUser = canCreateUsers ? !isOtherAdmin : (isSupervisorUser && current.id === d.id);
            return `
        <div class="user-card-item" data-name="${esc(d.nombre || '')}" data-rol="${roleName}">
          <div class="user-card-avatar" style="background:${avatarColor}">
            <span>${initial}</span>
            <span class="user-card-online ${d.activo ? 'is-active' : ''}"></span>
          </div>
          <div class="user-card-body">
            <div class="user-card-name">${esc(d.nombre || 'Sin nombre')}</div>
            <div class="user-card-role">
              <span class="user-role-badge ${roleClass}">${roleIcon} ${esc(roleName)}</span>
            </div>
            <div class="user-card-status">
              <span class="user-status-indicator ${d.activo ? 'active' : 'inactive'}"></span>
              <span>${d.activo ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>
          <div class="user-card-actions">
            ${canEditUser ? '<button class="user-card-btn" onclick="editarUsuario(\'' + d.id + '\')" title="' + (isSupervisorUser ? 'Cambiar PIN' : 'Editar Usuario') + '">\
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>\
            </button>' : ''}
          </div>
        </div>`
        }).join('') || ''}
        </div>`).join('') || ''}
      </div>

      <div class="users-empty-state" id="usersEmptyState" style="${l.length === 0 ? 'flex' : 'none'}">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <h3>No hay usuarios</h3>
        <p>Creá el primer usuario para empezar a trabajar.</p>
      </div>
    </div>

    <!-- User Form Modal -->
    <div class="modal-overlay" id="userModal" style="display:none" onclick="if(event.target===this)document.getElementById('userModal').style.display='none'">
      <div class="modal-box user-form-modal" onclick="event.stopPropagation()">
        <div class="modal-head">
          <div class="modal-head-left">
            <div class="modal-head-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <h3 id="userModalTitle">Nuevo Usuario</h3>
              <p class="modal-head-sub">Completá los datos del usuario</p>
            </div>
          </div>
          <button class="modal-close" onclick="document.getElementById('userModal').style.display='none'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body user-form-body">
          <div class="user-form-avatar-preview" id="userFormAvatarPreview">
            <span id="userFormAvatarLetter">+</span>
          </div>

          <div class="user-form-group">
            <label class="user-form-label">Nombre Completo</label>
            <div class="user-form-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input type="text" id="userFormNombre" placeholder="Ej: Juan Pérez">
            </div>
          </div>

          <div class="user-form-group">
            <label class="user-form-label">Rol del Sistema</label>
            <div class="user-form-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <select id="userFormRol" onchange="onUserRolChange()">
                <option value="operario">Operario</option>
                <option value="supervisor">Jefe / Supervisor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div class="user-form-group" id="userFormPinGroup">
            <label class="user-form-label">Código / PIN de acceso</label>
            <div class="user-form-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type="password" id="userFormPin" placeholder="Nuevo PIN" maxlength="6" inputmode="numeric">
              <button class="user-form-pin-toggle" type="button" onclick="togglePinVisibility()" title="Mostrar/ocultar PIN">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <p class="user-form-hint">C&oacute;digo que usar&aacute; el usuario para entrar. En edici&oacute;n pod&eacute;s dejarlo vac&iacute;o para conservar el actual.</p>
          </div>

          <div class="user-form-group">
            <label class="user-form-label" id="userAdminPinLabel">Confirmar como administrador</label>
            <div class="user-form-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <input type="password" id="userAdminPin" placeholder="Tu PIN de administrador" maxlength="6" inputmode="numeric" autocomplete="off">
            </div>
            <p class="user-form-hint" id="userAdminPinHint">Este PIN no se guarda en el usuario; solo autoriza la operaci&oacute;n</p>
          </div>

          <div class="user-form-divider"></div>

          <label class="user-form-toggle">
            <input type="checkbox" id="userFormActivo" checked>
            <span class="user-form-toggle-slider"></span>
            <span class="user-form-toggle-label">Usuario activo</span>
          </label>
          <p class="user-form-hint" style="margin: -4px 0 0 52px;">Los usuarios inactivos no pueden iniciar sesión</p>

          <div class="user-form-actions">
            <button class="user-form-btn user-form-btn-cancel" onclick="document.getElementById('userModal').style.display='none'">Cancelar</button>
            <button class="user-form-btn user-form-btn-save" onclick="guardarUsuario()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Guardar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>`
}

let _pinVisible = false;
function togglePinVisibility() {
    _pinVisible = !_pinVisible;
    const input = document.getElementById('userFormPin');
    if (!input) return;
    input.type = _pinVisible ? 'text' : 'password';
}
function syncUserPinVisibility() {
    const rol = document.getElementById('userFormRol')?.value || 'operario';
    const pinGroup = document.getElementById('userFormPinGroup');
    const pinInput = document.getElementById('userFormPin');
    const current = window.currentUser || {};
    const isSupervisorSelf = current.rol === 'supervisor' && editUserId === current.id;
    if (pinGroup) pinGroup.style.display = '';
    if (pinInput) pinInput.type = _pinVisible ? 'text' : 'password';
    const preview = document.getElementById('userFormAvatarLetter');
    if (preview) preview.textContent = rol === 'admin' ? 'A' : (rol === 'supervisor' ? 'S' : 'O');
    const actorLabel = document.getElementById('userAdminPinLabel');
    const actorHint = document.getElementById('userAdminPinHint');
    const actorInput = document.getElementById('userAdminPin');
    if (actorLabel) actorLabel.textContent = isSupervisorSelf ? 'Confirmar PIN actual' : 'Confirmar como administrador';
    if (actorInput) actorInput.placeholder = isSupervisorSelf ? 'Tu PIN actual' : 'Tu PIN de administrador';
    if (actorHint) actorHint.textContent = isSupervisorSelf ? 'Requerido para cambiar tu PIN de acceso' : 'Este PIN no se guarda en el usuario; solo autoriza la operación';
    ['userFormNombre', 'userFormRol', 'userFormActivo'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.disabled = isSupervisorSelf;
    });
}
function onUserRolChange() {
    syncUserPinVisibility();
}
let editUserId = null;

function nuevoUsuario() {
    if (!window.currentUser || window.currentUser.rol !== 'admin') {
        showToast("Solo el administrador puede crear usuarios", "error");
        return;
    }
    editUserId = null;
    _pinVisible = false;
    document.getElementById("userModalTitle").textContent = "Nuevo Usuario";
    const sub = document.querySelector("#userModal .modal-head-sub");
    if (sub) sub.textContent = "Completá los datos del nuevo usuario";
    document.getElementById("userFormNombre").value = "";
    document.getElementById("userFormRol").value = "operario";
    document.getElementById("userFormPin").value = "";
    document.getElementById("userFormPin").type = "password";
    document.getElementById("userFormPin").placeholder = "Código de acceso";
    document.getElementById("userAdminPin").value = "";
    document.getElementById("userFormActivo").checked = true;
    syncUserPinVisibility();
    var um = document.getElementById("userModal");
    openModalFrame(um);
    requestAnimationFrame(function() { document.getElementById("userFormNombre").focus(); });
}

function editarUsuario(l) {
    const u = window.currentUser;
    const d = (window._allUsers || []).find(g => g.id === l);
    if (!d) return;
    const isAdminActor = u && u.rol === 'admin';
    const isSupervisorSelf = u && u.rol === 'supervisor' && u.id === l;
    if (!isAdminActor && !isSupervisorSelf) {
        showToast("Solo puedes editar tu propio PIN", "error");
        return;
    }
    if (d.rol === 'admin' && u && u.id !== l) {
        showToast("No puedes editar a otro administrador", "error");
        return;
    }
    editUserId = l;
    _pinVisible = false;
    document.getElementById("userModalTitle").textContent = isSupervisorSelf ? "Cambiar PIN" : "Editar Usuario";
    const sub = document.querySelector("#userModal .modal-head-sub");
    if (sub) sub.textContent = isSupervisorSelf ? "Actualizá tu código de ingreso" : "Editando: " + (d.nombre || '');
    document.getElementById("userFormNombre").value = d.nombre || "";
    document.getElementById("userFormRol").value = d.rol || "operario";
    document.getElementById("userFormPin").value = "";
    document.getElementById("userFormPin").type = "password";
    document.getElementById("userFormPin").placeholder = isSupervisorSelf ? "Nuevo PIN" : "Dejar vac\u00edo para conservar";
    document.getElementById("userAdminPin").value = "";
    document.getElementById("userFormActivo").checked = d.activo !== false;
    syncUserPinVisibility();
    var um = document.getElementById("userModal");
    openModalFrame(um);
    requestAnimationFrame(function() { document.getElementById("userFormNombre").focus(); });
}

async function guardarUsuario() {
    const l = document.getElementById("userFormNombre").value.trim(),
        h = document.getElementById("userFormRol").value,
        d = document.getElementById("userFormPin").value.trim(),
        g = document.getElementById("userFormActivo").checked,
        adminPin = document.getElementById("userAdminPin").value.trim();
    const current = window.currentUser || {};
    const isSupervisorSelf = current.rol === 'supervisor' && editUserId === current.id;
    if (current.rol !== 'admin' && !isSupervisorSelf) {
        showToast("No autorizado", "error");
        return;
    }
    if (!l) {
        showToast("El nombre es obligatorio", "error");
        document.getElementById("userFormNombre").focus();
        return
    }
    if (isSupervisorSelf && !d) {
        showToast("Ingresá el nuevo PIN de acceso", "error");
        document.getElementById("userFormPin").focus();
        return
    }
    if ((h === "admin" || h === "supervisor") && !editUserId && !d) {
        showToast("El PIN es obligatorio para Administrador o Supervisor", "error");
        document.getElementById("userFormPin").focus();
        return
    }
    if (!adminPin) {
        showToast(isSupervisorSelf ? "Ingres\u00e1 tu PIN actual para confirmar" : "Ingres\u00e1 tu PIN de administrador para guardar", "error");
        document.getElementById("userAdminPin").focus();
        return
    }
    const btn = document.querySelector('.user-form-btn-save');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span> Guardando...'; }
    try {
        await db_saveUser({
            id: editUserId || "usr_" + Math.random().toString(36).slice(2, 8),
            nombre: l,
            rol: h,
            pin: d,
            activo: g,
            admin_pin: adminPin
        });
        document.getElementById("userModal").style.display = "none";
        showToast("Usuario guardado correctamente", "success");
        renderUsersView()
    } catch (b) {
        showToast("Error: " + b.message, "error")
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Guardar Usuario'; }
    }
}

var xlsxLoadPromise = null;

function ensureXlsxLoaded() {
    if (typeof XLSX != "undefined") return Promise.resolve(XLSX);
    if (xlsxLoadPromise) return xlsxLoadPromise;
    xlsxLoadPromise = new Promise(function(resolve, reject) {
        var existing = document.querySelector('script[data-xlsx-loader="1"]');
        if (existing) {
            existing.addEventListener("load", function() {
                typeof XLSX != "undefined" ? resolve(XLSX) : reject(new Error("La librería XLSX no quedó disponible"))
            }, { once: !0 });
            existing.addEventListener("error", function() {
                xlsxLoadPromise = null;
                reject(new Error("No se pudo cargar la librería XLSX"))
            }, { once: !0 });
            return
        }
        var script = document.createElement("script");
        script.src = "https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js";
        script.async = !0;
        script.defer = !0;
        script.dataset.xlsxLoader = "1";
        script.onload = function() {
            typeof XLSX != "undefined" ? resolve(XLSX) : (xlsxLoadPromise = null, reject(new Error("La librería XLSX no quedó disponible")))
        };
        script.onerror = function() {
            xlsxLoadPromise = null;
            reject(new Error("No se pudo cargar la librería XLSX"))
        };
        document.head.appendChild(script)
    });
    return xlsxLoadPromise
}

function renderImportView() {
    var l = document.getElementById("vwImport");
    document.querySelectorAll(".vw").forEach(function(h) {
        h.classList.remove("on")
    });
    l.classList.add("on");
    document.querySelectorAll(".sidebar-nav .tab").forEach(function(h) {
        h.classList.remove("on")
    });
    document.getElementById("btnImport").classList.add("on");
    updateTopBrand("Cargar datos");
    if (!_importJob) l.innerHTML = '<div class="import-wrap"><div class="import-card"><div class="import-card-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div><h3 class="import-card-title">Importar Excel</h3><p class="import-card-desc">Seleccion\xE1 el archivo Excel con la hoja <strong>"resumen"</strong> para importar los items borrados a la base de datos.</p><div class="import-card-info"><div class="import-info-row"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Los items ya gestionados no se sobrescriben</div><div class="import-info-row"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Las hojas pueden ser <strong>"resumen"</strong>, <strong>"stock"</strong>, <strong>"contabilizados"</strong> y <strong>"facturados"</strong></div><div class="import-info-row"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Formatos aceptados: .xlsx, .xls, .csv</div></div><button class="import-ref-btn" onclick="openFormatoHoja()" type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>Formato de Excel</button><div class="import-dropzone" id="importDropzone"><input type="file" id="importFileInput" accept=".xlsx,.xls,.csv" style="display:none"><div class="import-dropzone-content"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="12" y2="12"/><line x1="15" y1="15" x2="12" y2="12"/></svg><span class="import-dropzone-text">Hac\xE9 clic o arrastr\xE1 un archivo aqu\xED</span><span class="import-dropzone-hint">.xlsx, .xls o .csv</span></div></div><div id="importProgressInline" style="display:none"><div class="import-progress-inline-bar"><div class="import-progress-inline-fill" id="importProgressBar"></div></div><div class="import-progress-inline-info"><span id="importProgressText">Preparando...</span><span id="importProgressPct">0%</span></div><div id="importExtra" class="import-progress-extra"></div></div><div id="importResult" class="import-result" style="display:none"></div></div></div>';
    ensureXlsxLoaded().catch(function(h) {
        console.warn("xlsx:", h)
    })
}

function openFormatoHoja() {
    var l = document.getElementById("formatoHojaModal");
    openModalFrame(l)
}

function closeFormatoHoja() {
    var l = document.getElementById("formatoHojaModal");
    l.classList.remove("is-open"), l.classList.add("is-closing"), setTimeout(function() {
        l.classList.remove("is-closing"), l.style.display = "none"
    }, 400)
}(function() {
    document.addEventListener("change", function(l) {
        if (l.target.id === "importFileInput") {
            var h = l.target.files[0];
            h && startImport(h)
        }
    }), document.addEventListener("dragover", function(l) {
        var h = document.getElementById("importDropzone");
        h && h.contains(l.target) && (l.preventDefault(), h.classList.add("is-dragover"))
    }), document.addEventListener("dragleave", function(l) {
        var h = document.getElementById("importDropzone");
        h && h.contains(l.target) && (l.preventDefault(), h.classList.remove("is-dragover"))
    }), document.addEventListener("drop", function(l) {
        var h = document.getElementById("importDropzone");
        if (h && h.contains(l.target)) {
            l.preventDefault(), h.classList.remove("is-dragover");
            var d = l.dataTransfer.files[0];
            d && (document.getElementById("importFileInput").files = l.dataTransfer.files, startImport(d))
        }
    }), document.addEventListener("click", function(l) {
        var h = document.getElementById("importDropzone"),
            d = document.getElementById("importFileInput");
        h && d && h.contains(l.target) && l.target !== d && d.click()
    })
})();
async function startImport(l) {
    if (_importJob) { showToast('Ya hay una importación en curso', 'warning', 3000); return }
    _importJob = { cancelled: false };
    var h = document.getElementById("importProgressInline"),
        d = document.getElementById("importProgressBar"),
        g = document.getElementById("importProgressPct"),
        b = document.getElementById("importProgressText"),
        k = document.getElementById("importResult"),
        E = document.getElementById("importDropzone"),
        I = document.querySelector(".import-ref-btn"),
        extra = document.getElementById("importExtra");
    k.style.display = "none", h.style.display = "block", E && (E.style.display = "none"), I && (I.style.display = "none");
    _createImportBanner();
    try {
        b.textContent = "Preparando importación...", d.style.width = "1%", g.textContent = "1%", setImportProgress(1), await ensureXlsxLoaded(), b.textContent = "Leyendo archivo...", d.style.width = "2%", g.textContent = "2%", setImportProgress(2);
        var tStart = Date.now(),
            res = await readExcelFile(l),
            $ = res.valid,
            total = res.valid.length,
            valErrors = res.errors,
            BATCH = 500,
            CONC = 4,
            stats = { inserted: 0, updated: 0, errors: [] },
            done = 0,
            etaEl = extra || { textContent: "" };
        b.textContent = total + " registros le\xEDdos", d.style.width = "5%", g.textContent = "5%", setImportProgress(5);
        if (valErrors.length > 0) {
            var confirmed = await showImportValidationModal(valErrors, total);
            if (!confirmed) { _importJob = null; _hideImportBanner(); setImportProgress(-1); h.style.display = "none"; E && (E.style.display = "block"); I && (I.style.display = "inline-flex"); return }
        }
        var stockData = res.stock || [];
        var contData = res.contabilizados || [];
        var factData = res.facturados || [];


        if (stockData.length > 0) {
            var stockPreview = normalizeStockData(stockData);
            var stockMsg = "Se encontraron " + stockData.length + " registros en la hoja 'stock'.";
            if (stockPreview.merged > 0) stockMsg += " Hay " + stockPreview.merged + " duplicado(s) de material/almac\u00E9n que se unificar\u00E1n sumando cantidades.";
            stockMsg += " \u00BFDesea actualizar el stock? Se borrar\u00E1n los datos anteriores.";
            var updateStock = await showConfirm("Actualizar stock",
                stockMsg, "SI", "NO");
            if (updateStock) {
                b.textContent = "Actualizando stock...", d.style.width = "3%", g.textContent = "3%", setImportProgress(3);
                await ensureStockTable();
                var stockResult = await db_updateStock(stockData);
                if (stockResult.errors.length) {
                    showToast("Error al actualizar stock: " + stockResult.errors[0], "error", 5e3);
                } else if (stockResult.merged > 0) {
                    showToast("Stock actualizado: " + stockResult.inserted + " filas, " + stockResult.merged + " duplicado(s) unificados", "success", 5e3);
                }
            }
        }
        for (var i = 0; i < total; i += BATCH * CONC) {
            if (_importJob && _importJob.cancelled) throw new Error('__cancelled__');
            var batchGroup = [];
            for (var j = 0; j < CONC && i + j * BATCH < total; j++) {
                var from = i + j * BATCH,
                    chunk = $.slice(from, Math.min(from + BATCH, total));
                batchGroup.push(db_importItems(chunk))
            }
            var results = await Promise.all(batchGroup);
            for (var r = 0; r < results.length; r++) {
                var F = results[r];
                stats.inserted += F.inserted, stats.updated += F.updated, stats.errors = stats.errors.concat(F.errors);
                done += BATCH;
                var q = Math.min(done, total),
                    pct = Math.round(5 + q / total * 92),
                    elapsed = (Date.now() - tStart) / 1e3,
                    rate = elapsed > 0 ? Math.round(q / elapsed) : 0,
                    remaining = rate > 0 ? Math.round((total - q) / rate) : 0,
                    remStr = remaining > 60 ? Math.round(remaining / 60) + "m " + (remaining % 60) + "s" : remaining + "s";
                d.style.width = pct + "%", g.textContent = pct + "%", setImportProgress(pct);
                b.textContent = "Importando " + q + " de " + total + " \xB7 " + rate + " reg/s \xB7 resta " + remStr;
                etaEl && (etaEl.textContent = "")
            }
        }

        if (contData.length > 0 || factData.length > 0) {
            b.textContent = "Actualizando estados contabilizados/facturados...";
            var estadoResult = await db_updateEstadoFromSheets(contData, factData, function(msg, done, totalOps) {
                var pctEstado = totalOps ? Math.min(99, 97 + Math.round(done / Math.max(totalOps, 1) * 2)) : 98;
                b.textContent = msg + (totalOps ? " (" + fmtInt(done) + "/" + fmtInt(totalOps) + ")" : "...");
                d.style.width = pctEstado + "%";
                g.textContent = pctEstado + "%";
                setImportProgress(pctEstado);
            });
            if (estadoResult.errors.length) {
                estadoResult.errors.forEach(function(err) {
                    stats.errors.push({ item: "Estados", error: err });
                });
                showToast("Error al actualizar estados: " + estadoResult.errors[0], "warning", 5e3);
            }
        }
        d.style.width = "100%", g.textContent = "100%", b.textContent = "\xA1Completado! (" + Math.round((Date.now() - tStart) / 1e3) + "s)", setImportProgress(100), setTimeout(function() {
            setImportProgress(-1)
        }, 3e3);
        _importJob = null; _hideImportBanner();
        h.classList.add("done");
        var estadoExtra = "";
        if (contData.length > 0 || factData.length > 0) {
            estadoExtra = '<div class="import-stat" style="background:#f0f4ff;border-color:#c7d2fe"><span class="import-stat-num" style="color:#4f46e5">' + (estadoResult ? estadoResult.contabilizados : 0) + '</span><span class="import-stat-label">Contabilizados</span></div>' +
                '<div class="import-stat" style="background:#ecfdf5;border-color:#bbf7d0"><span class="import-stat-num" style="color:#059669">' + (estadoResult ? estadoResult.facturados : 0) + '</span><span class="import-stat-label">Facturados</span></div>';
        }
        var sinStockExtra = stats.sinStock ? '<div class="import-stat" style="background:#fafaf9;border-color:#d6d3d1"><span class="import-stat-num" style="color:#78716c">' + stats.sinStock + '</span><span class="import-stat-label">Sin Stock</span></div>' : "";
        localStorage.setItem("lastImportTime", String(Date.now())), updateTopTime(), showToast("Importaci\xF3n completada: " + stats.inserted + " insertados, " + stats.updated + " actualizados" + (stats.sinStock ? ", " + stats.sinStock + " sin stock" : "") + (stats.errors.length ? " (" + stats.errors.length + " errores)" : ""), stats.errors.length ? "error" : "success", 5e3), k.innerHTML = '<div class="import-result-icon">' + (stats.errors.length ? "\u26A0" : "\u2713") + '</div><div class="import-result-title">' + (stats.errors.length ? "Importaci\xF3n completada con errores" : "Importaci\xF3n exitosa") + '</div><div class="import-result-stats"><div class="import-stat"><span class="import-stat-num">' + stats.inserted + '</span><span class="import-stat-label">Insertados</span></div><div class="import-stat"><span class="import-stat-num">' + stats.updated + '</span><span class="import-stat-label">Actualizados</span></div>' + sinStockExtra + estadoExtra + (stats.errors.length ? '<div class="import-stat is-error"><span class="import-stat-num">' + stats.errors.length + '</span><span class="import-stat-label">Errores</span></div>' : "") + "</div>" + (stats.errors.length ? '<details class="import-errors"><summary>Ver detalles de errores</summary>' + stats.errors.map(function(x) {
            return '<div class="import-error-row">' + esc(x.item) + ": " + esc(x.error) + "</div>"
        }).join("") + "</details>" : "") + '<button class="import-result-btn" onclick="renderImportView()">Cargar otro archivo</button>', k.style.display = "block"
    } catch (x) {
        _importJob = null; _hideImportBanner();
        if (x.message === '__cancelled__') {
            setImportProgress(-1); h.style.display = "none"; E && (E.style.display = "block"); I && (I.style.display = "inline-flex");
            k.innerHTML = '<div class="import-result-icon" style="color:#f59e0b">\u29b2</div><div class="import-result-title" style="color:#f59e0b">Importaci\xF3n cancelada</div><button class="import-result-btn" onclick="renderImportView()">Volver a intentar</button>'; k.style.display = "block";
            return
        }
        setImportProgress(-1), h.style.display = "none", E && (E.style.display = "block"), I && (I.style.display = "inline-flex"), k.innerHTML = '<div class="import-result-icon" style="color:#ef4444">\u2715</div><div class="import-result-title" style="color:#ef4444">Error: ' + esc(x.message) + '</div><button class="import-result-btn" onclick="renderImportView()">Volver a intentar</button>', k.style.display = "block", showToast("Error en importaci\xF3n: " + x.message, "error", 6e3)
    }
}

function readExcelFile(l) {
    return new Promise(function(h, d) {
        if (typeof XLSX == "undefined") { d(new Error("La librer\xEDa XLSX no est\xE1 disponible. Intent\xE1 nuevamente en unos segundos.")); return }
        var g = new FileReader;
        g.onload = function(b) {
            try {
                var k = XLSX.read(b.target.result, { type: "array" });
                var getSheet = function(name) {
                    var wanted = String(name || "").trim().toLowerCase();
                    for (var sn = 0; sn < k.SheetNames.length; sn++) {
                        var sheetName = String(k.SheetNames[sn] || "").trim();
                        if (sheetName.toLowerCase() === wanted) return k.Sheets[k.SheetNames[sn]]
                    }
                    return null
                };
                var E = getSheet("resumen");
                if (!E) { d(new Error('No se encontr\xF3 la hoja "resumen" en el archivo.')); return }
                var I = XLSX.utils.sheet_to_json(E, { header: 1, defval: "" }), headerRow = -1;
                for (var L = 0; L < I.length; L++) { if (String(I[L][0]).trim() === "Fecha Carga") { headerRow = L; break } }
                if (headerRow === -1) { d(new Error('No se encontr\xF3 la fila "Fecha Carga" en la hoja resumen.')); return }
                var valid = [], errors = [];
                var le = function(te) { if (te === "" || te === null || te === void 0) return null; var be = Number(te); return isNaN(be) ? null : be };
                var Ye = function(te) { if (!te || te === "") return null; if (te instanceof Date && !isNaN(te.getTime())) return te.toISOString(); if (typeof te == "number") { var be = new Date(Math.round((te - 25569) * 86400 * 1e3)); return be.toISOString() } var Te = String(te).trim(), Re = Te.split("/"); if (Re.length === 3) { var Xe = new Date(Re[2], Re[1] - 1, Re[0]); return Xe.toISOString() } var iso = Te.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if (iso) return new Date(iso[1], iso[2] - 1, iso[3]).toISOString(); return null };
                var normalizeHeader = function(value) {
                    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "")
                };
                var findColumn = function(headers, names) {
                    var normalized = (headers || []).map(normalizeHeader);
                    for (var ni = 0; ni < names.length; ni++) {
                        var idx = normalized.indexOf(names[ni]);
                        if (idx !== -1) return idx
                    }
                    return -1
                };
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
                            fechaIdx = 0;
                            docIdx = 1;
                            matIdx = 2;
                            facturaIdx = 3;
                            ctdIdx = -1
                        } else {
                            docIdx = 0;
                            matIdx = 1;
                            ctdIdx = 2
                        }
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
                // Detectar columnas dinámicamente desde la fila de encabezado
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
                console.log("[RESUMEN] headerRow:", headerRow, "| cols →",
                    "fecha:", cFecha, "vendExt:", cVendExt, "solic:", cSolic, "cliente:", cCliente,
                    "doc:", cDoc, "mat:", cMat, "monto:", cMonto,
                    "| header:", JSON.stringify(headerCols));

                for (var L = headerRow + 1; L < I.length; L++) {
                    var v = I[L], excelRow = L + 1, rowErrors = [];
                    var rawFecha = String(v[cFecha] || "").trim();
                    var rawDoc   = String(v[cDoc]   || "").trim();
                    var rawMat   = String(v[cMat]   || "").trim();
                    var rawCliente = String(v[cCliente] || "").trim();
                    var rawMonto = v[cMonto];
                    if (!rawFecha) { rowErrors.push({ field: "Fecha Carga", value: rawFecha, issue: "Fecha vacía" }) }
                    if (rawFecha && rawFecha.toLowerCase().startsWith("total")) { rowErrors.push({ field: "Fecha Carga", value: rawFecha, issue: "Fila de totales/sumario" }) }
                    if (!rawDoc) { rowErrors.push({ field: "Doc Venta", value: rawDoc, issue: "Documento de venta vacío" }) }
                    if (rawDoc && rawDoc.toLowerCase().startsWith("total")) { rowErrors.push({ field: "Doc Venta", value: rawDoc, issue: "Fila de totales/sumario" }) }
                    if (!rawMat) { rowErrors.push({ field: "Material", value: rawMat, issue: "Material vacío" }) }
                    if (!rawCliente) { rowErrors.push({ field: "Cliente", value: rawCliente, issue: "Cliente vacío" }) }
                    if (rawMonto !== "" && rawMonto !== null && rawMonto !== void 0 && isNaN(Number(rawMonto))) { rowErrors.push({ field: "Total Importe", value: String(rawMonto), issue: "Monto no numérico" }) }
                    if (rowErrors.length > 0) {
                        errors.push({ row: excelRow, errors: rowErrors });
                        continue
                    }
                    var U = null;
                    if (rawFecha) {
                        if (typeof v[cFecha] == "number") { var F = new Date(Math.round((v[cFecha] - 25569) * 86400 * 1e3)); U = F.toISOString() }
                        else { var D = rawFecha.split("/"); if (D.length === 3) { var x = new Date(D[2], D[1] - 1, D[0]); U = x.toISOString() } }
                    }
                    valid.push({
                        fecha_carga: U,
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
                        estado: "pendiente"
                    })
                }
                var stockData = [], contData = [], factData = [];
                var stockSheet = getSheet("stock");
                if (stockSheet) {
                    var stockRows = XLSX.utils.sheet_to_json(stockSheet, { header: 1, defval: "" });
                    var stockHeaderRow = -1;
                    // Columnas fijas del reporte SAP: col0=Material, col1=Descripción, col2=Almacén, col3=Cantidad
                    var stockColMat = 0, stockColDesc = 1, stockColAlm = 2, stockColCant = 3;

                    // Solo detectar la fila de encabezado — las columnas son siempre fijas en el reporte SAP
                    // Buscar fila donde col0 contenga "material" (encabezado), o primera fila con código SAP real
                    for (var si = 0; si < Math.min(stockRows.length, 30); si++) {
                        var srow = stockRows[si];
                        var c0 = String(srow[0] || "").trim().toLowerCase();
                        // Fila de encabezado: col0 dice "material" o similar
                        if (c0 === "material" || c0 === "materi." || c0.startsWith("material")) {
                            stockHeaderRow = si;
                            break;
                        }
                    }
                    // Fallback: primera fila donde col0 parece un código de material SAP (solo dígitos o alfanum corto)
                    if (stockHeaderRow === -1) {
                        for (var si = 0; si < stockRows.length; si++) {
                            var srow = stockRows[si];
                            var c0 = String(srow[0] || "").trim();
                            if (c0 && /^\d{6,18}$/.test(c0)) {
                                // Esta fila ya es un dato, el header es la anterior
                                stockHeaderRow = Math.max(0, si - 1);
                                break;
                            }
                        }
                        if (stockHeaderRow === -1) stockHeaderRow = 0;
                    }

                    console.log("[STOCK IMPORT] Total filas:", stockRows.length, "| Header fila:", stockHeaderRow,
                        "| Cols → mat:", stockColMat, "desc:", stockColDesc, "alm:", stockColAlm, "cant:", stockColCant,
                        "| Header row:", JSON.stringify(stockRows[stockHeaderRow]));

                    for (var si = stockHeaderRow + 1; si < stockRows.length; si++) {
                        var srow = stockRows[si];
                        var matCode = String(srow[stockColMat] || "").trim();
                        if (!matCode) continue;
                        // Saltar filas de totales o subtotales
                        if (matCode.toLowerCase().startsWith("total") || matCode.toLowerCase().startsWith("subtotal")) continue;
                        var desc = String(srow[stockColDesc] || "").trim() || null;
                        var alm = String(srow[stockColAlm] || "").trim() || "VAR";
                        var cant = le(srow[stockColCant]);
                        stockData.push({ material: matCode, descripcion: desc, almacen: alm, cantidad: cant || 0 });
                    }
                    console.log("[STOCK IMPORT] Registros parseados:", stockData.length, "| Materiales únicos:", new Set(stockData.map(function(r){return r.material})).size);
                }
                var contSheet = getSheet("contabilizados");
                if (contSheet) {
                    var contRows = XLSX.utils.sheet_to_json(contSheet, { header: 1, defval: "" });
                    contData = parseEstadoSheetRows(contRows, false);
                }
                var factSheet = getSheet("facturados");
                if (factSheet) {
                    var factRows = XLSX.utils.sheet_to_json(factSheet, { header: 1, defval: "" });
                    factData = parseEstadoSheetRows(factRows, true);
                }
                h({ valid: valid, errors: errors, stock: stockData, contabilizados: contData, facturados: factData })
            } catch (ye) { d(ye) }
        }, g.onerror = function() { d(new Error("Error al leer el archivo")) }, g.readAsArrayBuffer(l)
    })
}(function() {
    async function l() {
        var g;
        var h = document.getElementById("loader");
        if (h) {
            var d = loadSession();
            if (!getSupabase()) {
                h.innerHTML = '<div style="color:#ef4444;text-align:center;padding:40px;font-family:sans-serif"><h2>Error</h2><p>No se pudo iniciar Supabase.</p></div>';
                return
            }
            if (d) h.classList.add("hide"), h.style.opacity = "0", setTimeout(function() {
                h.style.display = "none"
            }, 400), document.getElementById("loginOverlay").style.display = "none", document.getElementById("appMain").style.display = "flex", window.currentUser = d, document.getElementById("sidebarUserName").textContent = d.nombre, document.getElementById("sidebarUserRole").textContent = ((g = ROLES[d.rol]) == null ? void 0 : g.nm) || d.rol, updateSidebarAvatar(d.nombre),             (d.rol === "admin" || d.rol === "supervisor") && (document.getElementById("navAdminTitle").style.display = "block", document.getElementById("btnAdminUsers").style.display = "flex"), (d.rol === "admin" || d.rol === "operario") && (document.getElementById("btnImport").style.display = "flex"), window.renderDashboard(), startNotifPolling(!0);
            else {
                document.getElementById("loaderTitle").textContent = "Cargando usuarios...";
                try {
                    await loadLoginUsers()
                } catch (b) {}
                h.classList.add("hide"), h.style.opacity = "0", setTimeout(function() {
                    h.style.display = "none"
                }, 400)
            }
        }
    }
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l()
})();
let incidState = {
    all: [],
    filtered: [],
    page: 0,
    pageSize: 50,
    sortKey: "",
    sortDir: "desc"
},
incidFilterTimeout = null;

async function renderIncidenciasView() {
    var l = document.getElementById("vwIncidencias"),
        prevFilters = captureIncidFilterState();
    document.querySelectorAll(".vw").forEach(function(d) {
        d.classList.remove("on")
    });
    l.classList.add("on");
    document.querySelectorAll(".sidebar-nav .tab").forEach(function(d) {
        d.classList.remove("on")
    });
    var incidBtn = document.getElementById("btnIncidencias");
    if (incidBtn) incidBtn.classList.add("on");
    updateTopBrand("Items Incidencias");
    updateTopTime();
    l.innerHTML = buildIncidHtml();
    document.getElementById("incidBody").innerHTML = buildTableLoader('Cargando incidencias...');
    try {
        var h = await db_getItems({
            estado: "no_recuperado",
            limit: 0
        });
        incidState.all = h.data || [];
        incidState.filtered = [...incidState.all];
        incidState.page = 0;
        var v = document.getElementById("incidFilterVendedor");
        if (v) {
            var vd = [...new Set(incidState.all.map(function(b) { return b.vendedor_externo }).filter(Boolean))].sort();
            v.innerHTML = '<option value="">Todos los vendedores</option>' + vd.map(function(b) {
                return '<option value="' + esc(b) + '">' + esc(b) + "</option>"
            }).join("")
        }
        try {
            var catRows = await db_getCatalogo();
            var catMap = {};
            catRows.forEach(function(c) { catMap[c.material] = { marca: c.marca, grupo: c.grupo } });
            incidState.all.forEach(function(item) {
                var m = catMap[item.material] || {};
                item._grupo = m.grupo || '';
                item._marca = m.marca || '';
            });
            var grupos = [...new Set(catRows.map(function(c) { return c.grupo }).filter(Boolean))].sort();
            var marcas = [...new Set(catRows.map(function(c) { return c.marca }).filter(Boolean))].sort();
            var gEl = document.getElementById("incidFilterGrupo");
            if (gEl) { gEl.innerHTML = '<option value="">Todos los grupos</option>' + grupos.map(function(g) { return '<option value="' + esc(g) + '">' + esc(g) + "</option>" }).join("") }
            var mEl = document.getElementById("incidFilterMarca");
            if (mEl) { mEl.innerHTML = '<option value="">Todas las marcas</option>' + marcas.map(function(m) { return '<option value="' + esc(m) + '">' + esc(m) + "</option>" }).join("") }
        } catch (catErr) { console.warn("Could not load catalogo:", catErr) }
        cacheUiRows(incidState.all);
        restoreIncidFilterState(prevFilters);
        enhanceSelect("incidFilterGrupo");
        enhanceSelect("incidFilterMarca");
        enhanceSelect("incidFilterVendedor");
        applyIncidFilters();
    } catch (d) {
        l.innerHTML = '<div class="error-state"><div class="error-msg">Error: ' + esc(d.message) + "</div></div>"
    }
}

function buildIncidHtml() {
    return `
    <div class="pro-toolbar">
      <div class="pro-search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="incidSearch" placeholder="Buscar por cliente, material, documento..." oninput="onIncidSearch()">
      </div>
      <div class="pro-filters-group">
        <input type="hidden" id="incidFilterDesde">
        <input type="hidden" id="incidFilterHasta">
        <button class="date-btn-trigger" id="dateFilterBtn_incid" onclick="openDateModal('incid')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span id="dateFilterText_incid">Fechas</span>
        </button>
        <div class="pro-filter-pill vendor-filter">
          <select id="incidFilterVendedor" onchange="onIncidFilter()">
            <option value="">Todos los vendedores</option>
          </select>
        </div>
        <div class="pro-filter-pill">
          <select id="incidFilterGrupo" onchange="onIncidFilter()">
            <option value="">Todos los grupos</option>
          </select>
        </div>
        <div class="pro-filter-pill">
          <select id="incidFilterMarca" onchange="onIncidFilter()">
            <option value="">Todas las marcas</option>
          </select>
        </div>
      </div>
    </div>
    <div class="items-count" id="incidCount"></div>
    <div class="items-table-wrap pro-table-wrap">
      <table class="items-table pro-table">
        <thead>
          <tr>
            <th>${tableSortButton("incid", "fecha_carga", "Fecha Carga", incidState)}</th>
            <th>Gestor</th>
            <th>Cliente</th>
            <th>DOC. VENTA</th>
            <th>Material</th>
            <th>Almacén</th>
            <th style="text-align:right">${tableSortButton("incid", "cantidad_pedido", "Cant. Pedida", incidState)}</th>
            <th class="pro-col-monto">${tableSortButton("incid", "total_importe", "Monto Total", incidState)}</th>
            <th class="pro-col-actions">Motivo</th>
          </tr>
        </thead>
        <tbody id="incidBody"></tbody>
      </table>
    </div>
    <div class="items-pagination" id="incidPagination"></div>`;
}

function renderIncidTable() {
    const l = incidState.filtered, pageRows = getPageSlice(incidState), E = document.getElementById("incidBody"), I = document.getElementById("incidCount"), $ = document.getElementById("incidPagination");
    updateTopBrand("Items Incidencias", getRowsDateRangeLabel(l, function(w) {
        return w.fecha_carga
    }));
    if (I.innerHTML = `<strong>${l.length} incidencias</strong>${l.length!==incidState.all.length?` <span style="opacity:0.6">(filtrados de ${incidState.all.length})</span>`:""}`, !l.length) {
        E.innerHTML = '<tr><td colspan="9"><div class="empty-state">No se encontraron incidencias</div></td></tr>', $.innerHTML = "";
        syncTableSortButtons("incid", incidState);
        return
    }
    const vendorTotals = incidState._vendorTotals || buildVendorTotals(l);

    let lastVendor = null;
    let html = '';

    pageRows.forEach(w => {
        const currentVendor = w._vendorLabel || 'Sin Vendedor Asignado';
        
        if (currentVendor !== lastVendor) {
            html += `<tr class="group-header-row">
                <td colspan="9">
                    <div class="group-header-content">
                        <div class="group-vendor-name">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            ${esc(currentVendor)}
                        </div>
                        <div class="group-vendor-stats">
                            <span>${vendorTotals[currentVendor].count} ítems</span>
                            <span class="dot-sep">&bull;</span>
                            <span class="tot-monto">Total: <strong>${fmtGs(vendorTotals[currentVendor].monto)}</strong></span>
                        </div>
                    </div>
                </td>
            </tr>`;
            lastVendor = currentVendor;
        }

        html += `<tr class="items-row no_recuperado">
      <td class="pro-date" style="white-space: nowrap; font-size: 12px;">${fmtDate(w.fecha_carga)}</td>
      <td style="font-size:12px;color:var(--text-muted)"><strong>${esc(w.recuperado_por || "-")}</strong></td>
      <td class="pro-client" title="${esc(w.nombre||"")}">${esc(w.nombre||"")}</td>
      <td>${copyChip(w.doc_vtas||"-")}</td>
      <td>
        ${copyChip(w.material||"-")}<br>
        <span class="pro-desc-small">${esc(w.denominacion||"-")}</span>
      </td>
      <td><span style="${getAlmacenStyle(w.almacen)}">${esc(w.almacen||"-")}</span></td>
      <td class="qty-cell">${fmtInt(w.cantidad_pedido)}</td>
      <td class="pro-monto-cell">${fmtGs(w.total_importe)}</td>
      <td class="pro-actions-cell" style="max-width: 150px;">
        <span class="status-badge" style="background:var(--status-error-bg);color:var(--status-error); white-space: normal; text-align: left; line-height: 1.2;">${esc(getIncidenciaName(w.incidencia) || w.motivo_rechazo || "No recuperado")}</span>
      </td>
    </tr>`
    });
    
    E.innerHTML = html;
    $.innerHTML = renderTablePagination(incidState, "incidPage");
    syncTableSortButtons("incid", incidState);
}

function incidPage(l) {
    incidState.page = l, renderIncidTable(), scrollTableToTop("incidBody")
}

function onIncidSearch() {
    incidState.page = 0, clearTimeout(incidFilterTimeout), incidFilterTimeout = setTimeout(applyIncidFilters, 220)
}

function onIncidFilter() {
    incidState.page = 0, applyIncidFilters()
}

function applyIncidFilters() {
    var g, b, k, E;
    var l = (((g = document.getElementById("incidSearch")) == null ? void 0 : g.value) || "").toLowerCase().trim(),
        h = ((b = document.getElementById("incidFilterDesde")) == null ? void 0 : b.value) || "",
        d = ((k = document.getElementById("incidFilterHasta")) == null ? void 0 : k.value) || "",
        m = ((E = document.getElementById("incidFilterVendedor")) == null ? void 0 : E.value) || "";
    var grupoF = ((g = document.getElementById("incidFilterGrupo")) == null ? void 0 : g.value) || "";
    var marcaF = ((b = document.getElementById("incidFilterMarca")) == null ? void 0 : b.value) || "";
    var bounds = getDateBounds(h, d);
    incidState.filtered = incidState.all.filter(function(I) {
        if (!I._incidSearch) cacheUiRow(I);
        if (m && (I.vendedor_externo || "") !== m) return !1;
        if (grupoF && (I._grupo || "") !== grupoF) return !1;
        if (marcaF && (I._marca || "") !== marcaF) return !1;
        if (!rowInDateBounds(I, bounds)) return !1;
        if (!cachedSearchIncludes(I._incidSearch, l)) return !1;
        return !0
    }), sortTableRows(incidState), incidState._vendorTotals = buildVendorTotals(incidState.filtered), renderIncidTable()
}

// --- DATE MODAL LOGIC ---
let currentDateTab = 'items'; // 'items', 'dash', 'recup', or 'incid'

function populateQuickDateLabels() {
    const today = new Date();
    const fmt = (d) => {
        const opts = { day: '2-digit', month: '2-digit' };
        return d.toLocaleDateString('es-AR', opts);
    };
    const setLabel = (id, d) => {
        const el = document.getElementById('quickLabel_' + id);
        if (el) el.textContent = d ? fmt(d) : '';
    };
    setLabel('hoy', today);
    const ayer = new Date(today); ayer.setDate(ayer.getDate() - 1);
    setLabel('ayer', ayer);
    const semDesde = new Date(today); semDesde.setDate(semDesde.getDate() - 6);
    const semEl = document.getElementById('quickLabel_semana');
    if (semEl) semEl.textContent = fmt(semDesde) + ' - ' + fmt(today);
    const mesDesde = new Date(today.getFullYear(), today.getMonth(), 1);
    const mesEl = document.getElementById('quickLabel_mes');
    if (mesEl) mesEl.textContent = fmt(mesDesde) + ' - ' + fmt(today);
}

function updateDateFooterInfo(desde, hasta) {
    const info = document.getElementById('dateFooterInfo');
    const text = document.getElementById('dateFooterText');
    if (!info || !text) return;
    if (desde || hasta) {
        let lbl = '';
        if (desde && hasta) lbl = 'Filtrando desde ' + fmtDate(desde + 'T00:00:00') + ' hasta ' + fmtDate(hasta + 'T00:00:00');
        else if (desde) lbl = 'Filtrando desde ' + fmtDate(desde + 'T00:00:00');
        else lbl = 'Filtrando hasta ' + fmtDate(hasta + 'T00:00:00');
        text.textContent = lbl;
        info.style.color = 'var(--brand-primary)';
    } else {
        text.textContent = 'Sin filtro aplicado';
        info.style.color = '';
    }
}

function openDateModal(tab) {
    currentDateTab = tab;
    const modal = document.getElementById('dateFilterModal');
    if (!modal) return;
    openModalFrame(modal);
    
    const tabNames = { items: 'Items', dash: 'Dashboard', recup: 'Pedidos Gestionados', incid: 'Incidencias' };
    const titleEl = document.getElementById('dateModalTitle');
    if (titleEl) titleEl.textContent = 'Filtrar ' + (tabNames[tab] || '');
    
    const subEl = document.querySelector('#dateFilterModal .modal-head-sub');
    if (subEl) subEl.textContent = 'Seleccioná un rango para filtrar los resultados';
    
    const cfg = getDateFilterConfig(tab);
    if (!cfg) return;
    
    const dDesde = document.getElementById(cfg.desdeId);
    const dHasta = document.getElementById(cfg.hastaId);
    
    document.getElementById('customDateDesde').value = dDesde ? dDesde.value : '';
    document.getElementById('customDateHasta').value = dHasta ? dHasta.value : '';
    
    updateDateFooterInfo(dDesde ? dDesde.value : '', dHasta ? dHasta.value : '');
    populateQuickDateLabels();
}

function closeDateModal() {
    const modal = document.getElementById('dateFilterModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.classList.add('is-closing');
    setTimeout(function() {
        modal.classList.remove('is-closing');
        modal.style.display = 'none';
    }, 300);
}

function updateDateTriggerUI(tab, desde, hasta) {
    const cfg = getDateFilterConfig(tab);
    if (!cfg) return;
    const btn = document.getElementById(cfg.buttonId);
    const text = document.getElementById(cfg.textId);
    if (!btn || !text) return;
    if (desde || hasta) {
        btn.classList.add('active');
        let lbl = '';
        if (desde && hasta) lbl = fmtDate(desde + "T00:00:00") + ' - ' + fmtDate(hasta + "T00:00:00");
        else if (desde) lbl = 'Desde: ' + fmtDate(desde + "T00:00:00");
        else lbl = 'Hasta: ' + fmtDate(hasta + "T00:00:00");
        text.textContent = lbl;
    } else {
        btn.classList.remove('active');
        text.textContent = cfg.emptyText;
    }
}

function syncDateTriggerUI(tab) {
    const cfg = getDateFilterConfig(tab);
    if (!cfg) return;
    updateDateTriggerUI(tab, readControlValue(cfg.desdeId), readControlValue(cfg.hastaId))
}

function triggerCurrentTabFilter() {
    if (currentDateTab === 'items' && typeof onItemsFilter === 'function') onItemsFilter();
    else if (currentDateTab === 'dash' && typeof onDashFilter === 'function') onDashFilter();
    else if (currentDateTab === 'recup' && typeof onRecupFilter === 'function') onRecupFilter();
    else if (currentDateTab === 'incid' && typeof onIncidFilter === 'function') onIncidFilter();
}

function applyCustomDate() {
    const desde = document.getElementById('customDateDesde').value;
    const hasta = document.getElementById('customDateHasta').value;
    
    if (desde > hasta && hasta) {
        showToast("La fecha desde no puede ser mayor", "error");
        return;
    }
    
    const cfg = getDateFilterConfig(currentDateTab);
    if (!cfg) return;
    const hiddenDesde = document.getElementById(cfg.desdeId);
    const hiddenHasta = document.getElementById(cfg.hastaId);
    
    if(hiddenDesde) hiddenDesde.value = desde;
    if(hiddenHasta) hiddenHasta.value = hasta;
    
    updateDateTriggerUI(currentDateTab, desde, hasta);
    updateDateFooterInfo(desde, hasta);
    closeDateModal();
    triggerCurrentTabFilter();
}

function showImportValidationModal(errors, validCount) {
    return new Promise(function(resolve) {
        var totalRows = errors.reduce(function(s, e) { return s + e.errors.length }, 0);
        var errRows = errors.map(function(e) {
            return e.errors.map(function(er) {
                return '<tr><td style="text-align:center;font-weight:600;color:var(--text-muted);font-size:12px">' + e.row + '</td><td style="font-size:12px;color:var(--text-main)">' + esc(er.field) + '</td><td style="font-size:12px;color:var(--text-muted);max-width:160px;overflow:hidden;text-overflow:ellipsis">' + esc(er.value || "(vacío)") + '</td><td style="font-size:12px;color:var(--status-error)">' + esc(er.issue) + '</td></tr>'
            }).join("")
        }).join("");
        var overlay = document.createElement("div");
        overlay.className = "modal-overlay", overlay.style.display = "flex", overlay.style.opacity = "1", overlay.style.pointerEvents = "auto";
        overlay.onclick = function(ev) { if (ev.target === overlay) { cleanup(); resolve(false) } };
        var cleanup = function() { document.body.removeChild(overlay) };
        overlay.innerHTML = '<div class="modal-box" style="max-width:720px;padding:0;overflow:hidden" onclick="event.stopPropagation()"><div style="padding:18px 22px 14px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;gap:14px"><div style="width:38px;height:38px;border-radius:50%;background:var(--status-error-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div style="min-width:0"><h3 style="margin:0;font-size:16px;font-weight:700;color:var(--text-main)">Se encontraron ' + totalRows + ' error(es) en ' + errors.length + ' fila(s)</h3><p style="margin:2px 0 0;font-size:13px;color:var(--text-muted)">' + validCount + ' filas v\xE1lidas listas para importar</p></div></div><div style="overflow-y:auto;max-height:380px;padding:0"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="position:sticky;top:0;background:var(--bg-surface-hover)"><th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);border-bottom:1px solid var(--border-color);width:60px">Fila</th><th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);border-bottom:1px solid var(--border-color)">Campo</th><th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);border-bottom:1px solid var(--border-color)">Valor</th><th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);border-bottom:1px solid var(--border-color)">Problema</th></tr></thead><tbody>' + errRows + '</tbody></table></div><div style="padding:14px 22px 18px;border-top:1px solid var(--border-color);display:flex;gap:10px;justify-content:flex-end"><button class="btn-revertir" id="valCancelBtn" style="padding:10px 20px;font-size:13px;font-weight:600">Cancelar</button><button id="valProceedBtn" style="padding:10px 20px;font-size:13px;font-weight:700;background:var(--brand-primary);color:#fff;border:none;border-radius:var(--radius-md);cursor:pointer;font-family:inherit">Importar de todas formas (' + validCount + ' v\xE1lidas)</button></div></div>';
        document.body.appendChild(overlay);
        document.getElementById("valCancelBtn").onclick = function() { cleanup(); resolve(false) };
        document.getElementById("valProceedBtn").onclick = function() { cleanup(); resolve(true) }
    })
}

function applyQuickDate(type) {
    let desde = '', hasta = '';
    const today = new Date();
    
    const formatDateObj = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };
    
    if (type === 'hoy') {
        desde = hasta = formatDateObj(today);
    } else if (type === 'ayer') {
        const d = new Date(today);
        d.setDate(d.getDate() - 1);
        desde = hasta = formatDateObj(d);
    } else if (type === 'semana') {
        const d = new Date(today);
        d.setDate(d.getDate() - 6);
        desde = formatDateObj(d);
        hasta = formatDateObj(today);
    } else if (type === 'mes') {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        desde = formatDateObj(start);
        hasta = formatDateObj(today);
    } else if (type === 'todos') {
        desde = '';
        hasta = '';
    }
    
    document.getElementById('customDateDesde').value = desde;
    document.getElementById('customDateHasta').value = hasta;
    applyCustomDate();
}

/* ============================================================
   SKELETON LOADING — filas de carga instantánea
   ============================================================ */
function buildTableLoader(text) {
    return '<tr><td colspan="99" style="padding:0;border:none"><div class="table-loader-wrap">' +
        '<div class="table-loader-ring"></div>' +
        '<span class="table-loader-text">' + (text || 'Cargando...') + '</span>' +
        '</div></td></tr>';
}

function buildSkeletonRows(count, cols) {
    var widths = ['w-sm', 'w-lg', 'w-md', 'w-xl', 'w-xs', 'w-xs', 'w-xs', 'w-md', 'w-md', 'w-xs'];
    var html = '';
    for (var i = 0; i < count; i++) {
        html += '<tr class="skeleton-row">';
        for (var c = 0; c < cols; c++) {
            html += '<td><span class="skeleton-cell ' + widths[c % widths.length] + '"></span></td>';
        }
        html += '</tr>';
    }
    return html;
}

/* ============================================================
   TTL CACHE — evita requests duplicados al dashboard
   ============================================================ */
var _qCache = Object.create(null);

function _cGet(key) {
    var e = _qCache[key];
    if (!e) return null;
    if (Date.now() - e.ts > e.ttl) { delete _qCache[key]; return null; }
    return e.v;
}
function _cSet(key, value, ttlMs) {
    _qCache[key] = { v: value, ts: Date.now(), ttl: ttlMs || 60000 };
}
function _cDel(prefix) {
    Object.keys(_qCache).forEach(function(k) {
        if (!prefix || k.indexOf(prefix) === 0) delete _qCache[k];
    });
}

// Wrappers con cache de 60s para queries costosas del dashboard
var _db_getStats_orig = db_getStats;
db_getStats = async function(vendedor, desde, hasta) {
    var key = 'stats\x01' + (vendedor || '') + '\x01' + (desde || '') + '\x01' + (hasta || '');
    var hit = _cGet(key);
    if (hit !== null) return hit;
    var result = await _db_getStats_orig(vendedor, desde, hasta);
    _cSet(key, result, 60000);
    return result;
};

var _db_getChartData_orig = db_getChartData;
db_getChartData = async function(desde, hasta) {
    var key = 'chart\x01' + (desde || '') + '\x01' + (hasta || '');
    var hit = _cGet(key);
    if (hit !== null) return hit;
    var result = await _db_getChartData_orig(desde, hasta);
    _cSet(key, result, 60000);
    return result;
};

// Invalidar cache al modificar o importar items
var _db_updateItem_orig = db_updateItem;
db_updateItem = async function(id, data) {
    var result = await _db_updateItem_orig(id, data);
    _cDel('stats');
    _cDel('chart');
    return result;
};

var _db_importItems_orig = db_importItems;
db_importItems = async function(items) {
    var result = await _db_importItems_orig(items);
    _cDel();
    return result;
};

// ── Exportar Excel — Dashboard Gestión de Pedidos Recuperados ─────────────
async function exportarExcelDashboard() {
    var SVG_DOWN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    var btn = document.getElementById('btnExportarExcel');
    if (btn) { btn.disabled = true; btn.innerHTML = SVG_DOWN + ' Generando...'; }
    try {
        // ExcelJS soporta colores/estilos (SheetJS CE no lo hace)
        if (typeof ExcelJS === 'undefined') {
            await new Promise(function(resolve, reject) {
                var s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js';
                s.onload = resolve;
                s.onerror = function() { reject(new Error('No se pudo cargar la librería. Verificá tu conexión.')); };
                document.head.appendChild(s);
            });
        }

        var dashState = getDashFilterState();
        var desde = dashState.desde ? dashState.desde + 'T00:00:00' : '';
        var hasta  = dashState.hasta  ? dashState.hasta  + 'T23:59:59' : '';

        // Cada estado lleva su color de encabezado y su tono claro para filas alternas
        var ESTADOS_EXPORT = [
            { key: 'pendiente',     label: 'Pendientes',     argb: 'FFB45309', light: 'FFFEF9C3' },
            { key: 'facturado',     label: 'Facturados',     argb: 'FF047857', light: 'FFD1FAE5' },
            { key: 'contabilizado', label: 'Contabilizados', argb: 'FF4338CA', light: 'FFE0E7FF' },
            { key: 'no_recuperado', label: 'No Recuperados', argb: 'FFB91C1C', light: 'FFFEE2E2' },
        ];

        var COLS = [
            { key: 'fecha_carga',      header: 'Fecha Carga',      type: 'date',   width: 14 },
            { key: 'doc_vtas',         header: 'Doc. Ventas',       type: 'text',   width: 16 },
            { key: 'material',         header: 'Material',          type: 'text',   width: 16 },
            { key: 'denominacion',     header: 'Denominación',      type: 'text',   width: 32 },
            { key: 'nombre',           header: 'Cliente',           type: 'text',   width: 30 },
            { key: 'solic',            header: 'Solic.',            type: 'text',   width: 14 },
            { key: 'vendedor_externo', header: 'Vendedor Externo',  type: 'text',   width: 22 },
            { key: 'vendedor_interno', header: 'Vendedor Interno',  type: 'text',   width: 22 },
            { key: 'almacen',          header: 'Almacén',           type: 'text',   width: 14 },
            { key: 'cant_pedido',      header: 'Cant. Pedido',      type: 'number', width: 14 },
            { key: 'cant_recibida',    header: 'Cant. Recibida',    type: 'number', width: 14 },
            { key: 'cant_fact',        header: 'Cant. Fact.',       type: 'number', width: 14 },
            { key: 'total_importe',    header: 'Total Importe',     type: 'money',  width: 20 },
            { key: 'motiv_rech',       header: 'Motivo Rechazo',    type: 'text',   width: 24 },
            { key: 'estado',           header: 'Estado',            type: 'text',   width: 18 },
        ];

        // Helpers de estilo ExcelJS
        function fill(argb)    { return { type: 'pattern', pattern: 'solid', fgColor: { argb: argb } }; }
        function fnt(bold, sz, argb) { return { bold: !!bold, size: sz || 10, color: { argb: argb || 'FF1E293B' }, name: 'Calibri' }; }
        function aln(h, v)     { return { horizontal: h || 'left', vertical: v || 'middle', wrapText: false }; }
        function brd(argb)     { var s = { style: 'thin', color: { argb: argb || 'FFE2E8F0' } }; return { top: s, bottom: s, left: s, right: s }; }

        var results = await Promise.all(ESTADOS_EXPORT.map(function(e) {
            return db_getItems({ estado: e.key, limit: 0, fecha_desde: desde, fecha_hasta: hasta });
        }));

        var wb  = new ExcelJS.Workbook();
        wb.creator  = 'ALAS Logística';
        wb.created  = new Date();
        var now = new Date();

        var periodoStr = dashState.desde && dashState.hasta
            ? dashState.desde.split('-').reverse().join('/') + ' — ' + dashState.hasta.split('-').reverse().join('/')
            : 'Todos los períodos';
        var nowStr = now.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        // ── Hoja 1: Resumen ───────────────────────────────────────────────
        var wsR = wb.addWorksheet('Resumen');
        wsR.columns = [{ width: 26 }, { width: 20 }, { width: 26 }];

        // Título
        wsR.mergeCells('A1:C1');
        var tc = wsR.getCell('A1');
        tc.value = 'ALAS Logística — Reporte de Pedidos Recuperados';
        tc.fill = fill('FF0F172A');
        tc.font = fnt(true, 13, 'FFFFFFFF');
        tc.alignment = aln('center', 'middle');
        wsR.getRow(1).height = 34;

        // Período y Generado
        [['Período:', periodoStr], ['Generado:', nowStr]].forEach(function(pair, i) {
            var r = i + 2;
            wsR.getRow(r).height = 20;
            wsR.getCell('A' + r).value = pair[0];
            wsR.getCell('A' + r).font  = fnt(true, 10, 'FF475569');
            wsR.mergeCells('B' + r + ':C' + r);
            wsR.getCell('B' + r).value = pair[1];
            wsR.getCell('B' + r).font  = fnt(false, 10, 'FF1E293B');
        });

        wsR.getRow(4).height = 6;

        // Encabezados tabla resumen
        wsR.getRow(5).height = 24;
        ['Estado', 'Cantidad de Items', 'Total Importe (Gs.)'].forEach(function(h, ci) {
            var c = wsR.getRow(5).getCell(ci + 1);
            c.value = h; c.fill = fill('FF334155');
            c.font = fnt(true, 10, 'FFFFFFFF');
            c.alignment = aln(ci > 0 ? 'right' : 'left', 'middle');
            c.border = brd('FF1E293B');
        });

        // Filas de estado
        var totItems = 0, totMonto = 0;
        ESTADOS_EXPORT.forEach(function(e, idx) {
            var items = results[idx].data || [];
            var monto = items.reduce(function(a, r) { return a + (Number(r.total_importe) || 0); }, 0);
            totItems += items.length; totMonto += monto;
            var row = wsR.getRow(6 + idx);
            row.height = 22;
            [e.label, items.length, monto].forEach(function(val, ci) {
                var c = row.getCell(ci + 1);
                c.value = val; c.fill = fill(e.light);
                c.font = fnt(false, 10, 'FF1E293B');
                c.alignment = aln(ci > 0 ? 'right' : 'left', 'middle');
                c.border = brd('FFE2E8F0');
                if (ci > 0) c.numFmt = '#,##0';
            });
        });

        // Fila TOTAL
        wsR.getRow(10).height = 26;
        ['TOTAL', totItems, totMonto].forEach(function(val, ci) {
            var c = wsR.getRow(10).getCell(ci + 1);
            c.value = val; c.fill = fill('FF1E293B');
            c.font = fnt(true, 10, 'FFFFFFFF');
            c.alignment = aln(ci > 0 ? 'right' : 'left', 'middle');
            c.border = brd('FF0F172A');
            if (ci > 0) c.numFmt = '#,##0';
        });

        // ── Hojas por estado ──────────────────────────────────────────────
        ESTADOS_EXPORT.forEach(function(e, idx) {
            var items = results[idx].data || [];
            var ws = wb.addWorksheet(e.label);
            ws.columns = COLS.map(function(c) { return { width: c.width }; });

            // Encabezado coloreado
            var hdr = ws.getRow(1);
            hdr.height = 26;
            COLS.forEach(function(c, ci) {
                var cell = hdr.getCell(ci + 1);
                cell.value = c.header;
                cell.fill = fill(e.argb);
                cell.font = fnt(true, 10, 'FFFFFFFF');
                cell.alignment = aln(c.type === 'money' || c.type === 'number' ? 'right' : 'left', 'middle');
                cell.border = brd(e.argb);
            });

            // Filas de datos con colores alternados blanco / tono suave del estado
            items.forEach(function(item, ri) {
                var row = ws.getRow(ri + 2);
                row.height = 18;
                var rowFill = ri % 2 === 0 ? 'FFFFFFFF' : e.light;
                COLS.forEach(function(c, ci) {
                    var cell = row.getCell(ci + 1);
                    var v = item[c.key];
                    if (c.type === 'date') {
                        if (v) {
                            var d = new Date(v);
                            cell.value = isNaN(d.getTime()) ? (v || '') : new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
                            cell.numFmt = 'dd/mm/yyyy';
                        }
                    } else if (c.type === 'money' || c.type === 'number') {
                        var n = Number(v);
                        cell.value = isNaN(n) ? '' : n;
                        cell.numFmt = '#,##0';
                        cell.alignment = aln('right', 'middle');
                    } else {
                        cell.value = v != null ? String(v) : '';
                    }
                    cell.fill = fill(rowFill);
                    cell.font = fnt(false, 10, 'FF1E293B');
                    cell.border = brd('FFE2E8F0');
                    if (!cell.alignment) cell.alignment = aln('left', 'middle');
                });
            });

            // Freeze + autofilter
            ws.views = [{ state: 'frozen', ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft' }];
            ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLS.length } };
        });

        // ── Descargar ─────────────────────────────────────────────────────
        var buffer = await wb.xlsx.writeBuffer();
        var blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var url  = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        var fileDateLabel = dashState.desde && dashState.hasta
            ? dashState.desde + '_' + dashState.hasta
            : now.toISOString().slice(0, 10);
        a.download = 'pedidos_recuperados_' + fileDateLabel + '.xlsx';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);

    } catch (err) {
        alert('Error al exportar: ' + (err.message || 'Error desconocido'));
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = SVG_DOWN + ' Exportar Excel'; }
    }
}
