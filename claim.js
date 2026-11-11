// Lien CSguessr ↔ Wikimaster : compte, jetons gagnés en fin de partie, accès aux boosters.
// À charger dans index.html de CSguessr, après i18n.js : ajouter une balise script avec src="claim.js".
// Les deux sites sont sur le même domaine (lucasjgou.github.io), donc la session « wm_s » est partagée :
// se connecter ici ou sur Wikimaster revient au même.
(() => {
  const WIKI_URL = "https://lucasjgou.github.io/WikiCS/";
  const KEY = "wm_s";
  const T = (k, v) => (typeof tr === "function" ? tr(k, v) : k);
  const ok = typeof SUPABASE_URL === "string" && typeof SUPABASE_KEY === "string"
    && !SUPABASE_URL.includes("VOTRE-PROJET") && !SUPABASE_KEY.includes("VOTRE_CLE");
  const root = ok ? SUPABASE_URL.replace(/\/$/, "") : "";

  /* ---------- Session (même format que wm.js) ---------- */
  const getS = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  const setS = (s) => { try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch {} };
  const keep = (j) => setS({ token: j.access_token, refresh: j.refresh_token, exp: Date.now() + (j.expires_in || 3600) * 1000 - 60000, id: j.user.id, email: j.user.email });
  const mail = (id) => (id.includes("@") ? id.trim() : id.trim().toLowerCase() + "@users.wikimaster.app");

  async function authCall(path, body) {
    const r = await fetch(root + "/auth/v1/" + path, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error_description || j.msg || j.message || "HTTP " + r.status);
    return j;
  }
  async function token() {
    let s = getS(); if (!s) return null;
    if (Date.now() > s.exp) {
      try { keep(await authCall("token?grant_type=refresh_token", { refresh_token: s.refresh })); s = getS(); }
      catch { setS(null); return null; }
    }
    return s && s.token;
  }
  async function rest(path, o = {}) {
    const t = await token();
    return fetch(root + path, { ...o, headers: { apikey: SUPABASE_KEY, ...(t ? { Authorization: "Bearer " + t } : {}), ...(o.headers || {}) } });
  }

  /* ---------- État ---------- */
  let profile = null;          // { pseudo, tokens } ou null
  let noProfile = false;       // connecté mais sans profil joueur (compte admin)
  let gameId = 0, claimRes = null;   // une seule réclamation de jetons par partie
  let endScore = null, endResult, claiming = false;

  const fmt = (n) => T(n > 1 ? "wiki.tokens" : "wiki.token1", { n });
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const $ = (id) => document.getElementById(id);

  async function fetchProfile() {
    const s = getS();
    profile = null; noProfile = false;
    if (!ok || !s) return;
    try {
      const r = await rest("/rest/v1/profiles?select=pseudo,tokens&id=eq." + s.id);
      if (r.status === 401) { setS(null); return; }
      if (!r.ok) return;
      profile = (await r.json())[0] || null;
      noProfile = !profile;
    } catch {}
  }

  // Réclame les jetons d'une partie (une seule fois par partie, même si appelée plusieurs fois)
  function claim(score) {
    if (claimRes && claimRes.gameId === gameId) return claimRes.promise;
    if (!ok || !getS() || !profile) return Promise.resolve(null);
    const p = (async () => {
      try {
        const r = await rest("/rest/v1/rpc/claim_tokens", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ p_score: Math.round(score) }) });
        return r.ok ? await r.json() : null;
      } catch { return null; }
    })();
    claimRes = { gameId, promise: p };
    return p;
  }
  window.claimTokens = claim;   // compatibilité avec l'ancienne version de ce fichier

  /* ---------- Styles ---------- */
  const css = el("style");
  css.textContent = `
  #wiki{position:fixed;right:12px;top:calc(max(12px,env(safe-area-inset-top)) + 54px);width:min(230px,44vw);z-index:300;
    background:rgba(16,37,45,.85);backdrop-filter:blur(6px);border-radius:14px;padding:.7rem .85rem;color:#f5f6f2;font-family:var(--font,system-ui,sans-serif)}
  #wiki h2{margin:0 0 .35rem;font-size:.8rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#f0b429}
  #wiki .who{margin:0;font-size:.85rem;color:#c3cec9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #wiki .bal{margin:0 0 .5rem;font-size:1.35rem;font-weight:800;font-variant-numeric:tabular-nums}
  #wiki .hint,#wiki .note{margin:0 0 .5rem;font-size:.85rem;color:#c3cec9}
  .wk-btn{display:block;width:100%;border:0;border-radius:10px;padding:.55rem .7rem;font:800 .9rem var(--font,system-ui,sans-serif);text-align:center;text-decoration:none;cursor:pointer;background:#f0b429;color:#10252d;margin-top:.4rem}
  .wk-btn.ghost{background:rgba(255,255,255,.12);color:#f5f6f2;font-weight:700;font-size:.8rem}
  .wk-btn.dark{background:#10252d;color:#f5f6f2}
  .wk-btn:focus-visible,.wk-modal input:focus-visible{outline:3px solid #f0b429;outline-offset:2px}
  @media (max-width:640px){#wiki{top:calc(max(12px,env(safe-area-inset-top)) + 96px)}}
  #wikiEnd{margin:.4rem 0 .2rem;padding:.7rem .8rem;border-radius:12px;background:rgba(16,37,45,.08);font-weight:600;text-align:center}
  #wikiEnd .won{font-size:1.2rem;font-weight:800}
  #wikiEnd .wk-btn{margin-top:.5rem}
  .wk-modal{position:fixed;inset:0;z-index:2500;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,26,32,.88)}
  .wk-modal[hidden]{display:none}
  .wk-card{width:min(380px,100%);background:#f5f6f2;color:#10252d;border-radius:18px;padding:1.4rem;box-shadow:0 20px 60px rgba(0,0,0,.55)}
  .wk-card h2{margin:0 0 .3rem;font-size:1.3rem;font-weight:800}
  .wk-card p{margin:0 0 .8rem;font-size:.95rem;color:#3b4c47}
  .wk-card label{display:block;font-weight:600;margin:.6rem 0 .25rem}
  .wk-card input{width:100%;padding:.75rem;border:2px solid #c9d0cb;border-radius:10px;font:600 1rem var(--font,system-ui,sans-serif);background:#fff;color:#10252d}
  .wk-card .msg{min-height:1.3em;margin:.6rem 0 0;font-weight:600;color:#d2493f}`;
  document.head.appendChild(css);

  /* ---------- Panneau à droite ---------- */
  const panel = el("aside"); panel.id = "wiki";
  document.body.appendChild(panel);

  function openLink(cls) {
    const a = el("a", "wk-btn" + (cls ? " " + cls : ""), T("wiki.open"));
    a.href = WIKI_URL; a.target = "_blank"; a.rel = "noopener";
    return a;
  }
  function loginBtn(cls) {
    const b = el("button", "wk-btn" + (cls ? " " + cls : ""), T("wiki.login")); b.type = "button";
    b.addEventListener("click", showModal); return b;
  }

  function renderPanel() {
    panel.textContent = "";
    panel.setAttribute("aria-label", T("wiki.title"));
    panel.appendChild(el("h2", "", T("wiki.title")));
    if (profile) {
      panel.appendChild(el("p", "who", profile.pseudo));
      panel.appendChild(el("p", "bal", fmt(profile.tokens)));
    } else if (getS() && noProfile) {
      panel.appendChild(el("p", "note", T("wiki.noProfile")));
    } else {
      panel.appendChild(el("p", "hint", T("wiki.hint")));
      panel.appendChild(loginBtn());
    }
    panel.appendChild(openLink(profile || noProfile ? "" : "ghost"));
    if (getS()) {
      const out = el("button", "wk-btn ghost", T("wiki.logout")); out.type = "button";
      out.addEventListener("click", async () => { setS(null); endResult = undefined; await refresh(); });
      panel.appendChild(out);
    }
  }

  /* ---------- Bloc sur l'écran de fin de partie ---------- */
  function renderEnd() {
    const box = $("wikiEnd");
    if (!box) return;
    if (endScore === null) { box.hidden = true; return; }
    box.hidden = false; box.textContent = "";
    const potential = Math.floor(Math.min(Math.max(endScore, 0), 25000) / 1000);
    if (claiming) { box.appendChild(el("span", "", T("wiki.adding"))); return; }
    if (endResult === undefined) {
      if (getS() && noProfile) box.appendChild(el("span", "", T("wiki.noProfile")));
      else {
        box.appendChild(el("span", "", potential > 0 ? T("wiki.endLogin", { tokens: fmt(potential) }) : T("wiki.tooLow")));
        if (!getS()) box.appendChild(loginBtn("dark"));
      }
    } else if (endResult === null) box.appendChild(el("span", "", T("wiki.claimFail")));
    else if (endResult > 0) box.appendChild(el("span", "won", T("wiki.won", { tokens: fmt(endResult) })));
    else box.appendChild(el("span", "", endScore < 1000 ? T("wiki.tooLow") : T("wiki.cap")));
    box.appendChild(openLink(""));
  }

  async function claimEnd() {
    if (endScore === null || endResult !== undefined || !profile) return;
    claiming = true; renderEnd();
    endResult = await claim(endScore);
    claiming = false;
    await fetchProfile();
    const pe = $("pseudo"); if (pe && !pe.value && profile) pe.value = profile.pseudo;   // pseudo du compte, si le champ est vide
    renderPanel(); renderEnd();
  }

  async function refresh() { await fetchProfile(); renderPanel(); renderEnd(); }

  /* ---------- Fenêtre de connexion ---------- */
  let modal = null, inId, inPw, msg;
  function buildModal() {
    modal = el("div", "wk-modal"); modal.hidden = true;
    modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true");
    const card = el("form", "wk-card"); card.noValidate = false;
    const title = el("h2"); title.id = "wkT"; modal.setAttribute("aria-labelledby", "wkT");
    const lead = el("p");
    const l1 = el("label"), l2 = el("label");
    inId = el("input"); inId.required = true; inId.autocomplete = "username"; inId.id = "wkId"; l1.htmlFor = "wkId";
    inPw = el("input"); inPw.type = "password"; inPw.required = true; inPw.minLength = 6; inPw.autocomplete = "current-password"; inPw.id = "wkPw"; l2.htmlFor = "wkPw";
    const go = el("button", "wk-btn"); go.type = "submit";
    const mk = el("button", "wk-btn dark"); mk.type = "button";
    const cancel = el("button", "wk-btn ghost"); cancel.type = "button";
    cancel.style.background = "rgba(16,37,45,.1)"; cancel.style.color = "#10252d";
    msg = el("p", "msg"); msg.setAttribute("role", "alert");
    card.append(title, lead, l1, inId, l2, inPw, go, mk, cancel, msg);
    modal.appendChild(card); document.body.appendChild(modal);
    modal._t = () => {
      title.textContent = T("wiki.loginTitle"); lead.textContent = T("wiki.loginLead");
      l1.textContent = T("wiki.pseudo"); l2.textContent = T("wiki.password");
      go.textContent = T("wiki.login"); mk.textContent = T("wiki.create"); cancel.textContent = T("wiki.cancel");
    };
    const run = async (fn) => {
      msg.textContent = "…";
      try { await fn(); hideModal(); inPw.value = ""; await refresh(); await claimEnd(); }
      catch (e) { msg.textContent = e.message; }
    };
    card.addEventListener("submit", (e) => { e.preventDefault(); run(async () => keep(await authCall("token?grant_type=password", { email: mail(inId.value), password: inPw.value }))); });
    mk.addEventListener("click", () => {
      if (!inId.reportValidity() || !inPw.reportValidity()) return;
      run(async () => {
        const id = inId.value.trim();
        if (!/^[A-Za-z0-9_]{3,16}$/.test(id)) throw new Error(T("wiki.badPseudo"));
        const j = await authCall("signup", { email: mail(id), password: inPw.value, data: { pseudo: id } });
        if (!j.access_token) throw new Error(T("wiki.confirm"));
        keep(j);
      });
    });
    cancel.addEventListener("click", hideModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) hideModal(); });
  }
  function showModal() { if (!modal) buildModal(); modal._t(); msg.textContent = ""; modal.hidden = false; inId.focus(); }
  function hideModal() { if (modal) modal.hidden = true; }

  /* ---------- Branchement sur le jeu ---------- */
  function hook(name, after) {
    const orig = window[name];
    if (typeof orig !== "function" || orig.__wk) return;
    const w = function () { const r = orig.apply(this, arguments); after(); return r; };
    w.__wk = true; window[name] = w;
  }

  function init() {
    const bal = document.querySelector("#end .endcard .bigscore");
    if (bal && !$("wikiEnd")) { const box = el("div"); box.id = "wikiEnd"; box.hidden = true; box.setAttribute("aria-live", "polite"); bal.after(box); }

    hook("newGame", () => { gameId++; endScore = null; endResult = undefined; claiming = false; renderEnd(); });
    hook("showEnd", () => {
      endScore = typeof total === "number" ? total : 0; endResult = undefined;
      const pe = $("pseudo"); if (pe && profile) pe.value = profile.pseudo;   // pseudo du compte déjà rempli
      renderEnd(); claimEnd();
    });

    document.addEventListener("langchange", () => { renderPanel(); renderEnd(); if (modal) modal._t(); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });   // au retour de Wikimaster
    window.addEventListener("storage", (e) => { if (e.key === KEY) refresh(); });
    renderPanel();
    refresh();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
