// Crédits CSguessr : pied de page, fenêtre « Crédits » (FR/EN). Même principe que dans WikiCS (wm.js).
// À charger après i18n.js (si absent, la page reste en français).
// Pour modifier un texte, un lien ou la version : change la ligne correspondante ci-dessous.
(() => {
  const INFO = { name: "CSguessr", version: "v2.65", year: 2026 };
  const WIKI_URL = "https://lucasjgou.github.io/WikiCS/";

  const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const ext = (text, url, cls) => { const a = h("a", cls || "", text); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; return a; };
  const lang = () => (typeof window.getLang === "function" && window.getLang() === "en" ? "en" : "fr");

  const TEAM = [
    ["Lucas Jégou", "https://www.linkedin.com/in/lucas-j%C3%A9gou-27ba2831a/"],
    ["Roman Joly", "https://www.linkedin.com/in/roman-joly-0a357444b/"],
    ["Maxime Maygnan", "https://www.linkedin.com/in/maxime-maygnan-412047436/"]
  ];
  // [nom, url, description FR, description EN]
  const TOOLS = [
    ["Claude (Anthropic)", "https://claude.ai", "Écriture du code du jeu", "Writing the game code"],
    ["Leonardo.Ai", "https://leonardo.ai", "Graphismes et visuels", "Graphics and visuals"],
    ["Supabase", "https://supabase.com", "Classement, comptes, base de données et stockage des photos", "Leaderboard, accounts, database and photo storage"],
    ["GitHub Pages", "https://pages.github.com", "Hébergement du site", "Website hosting"],
    ["Leaflet", "https://leafletjs.com", "Bibliothèque de cartes interactives", "Interactive map library"],
    ["IGN / Géoplateforme", "https://geoservices.ign.fr", "Photographies aériennes du campus", "Aerial photography of the campus"],
    ["Esri", "https://www.esri.com", "Imagerie satellite", "Satellite imagery"],
    ["OpenStreetMap", "https://www.openstreetmap.org/copyright", "Fond de carte (© contributeurs OpenStreetMap)", "Base map (© OpenStreetMap contributors)"],
    ["Google Fonts", "https://fonts.google.com/specimen/Bricolage+Grotesque", "Police Bricolage Grotesque (licence SIL Open Font License)", "Bricolage Grotesque font (SIL Open Font License)"]
  ];

  const T = {
    fr: {
      credits: "Crédits",
      close: "Fermer",
      intro: INFO.name + " est le GeoGuessr du campus de CentraleSupélec : retrouve sur la carte l’endroit où la photo a été prise et grimpe au classement. Les parties te font gagner des jetons pour WikiCS.",
      founders: "Les fondateurs",
      role: "Cofondateur",
      contact: "Une question, une idée, une photo à signaler ? Écris-nous sur LinkedIn.",
      tools: "Outils et ressources",
      data: "Contenus et données",
      data1: "Les photos sont proposées par les joueurs et vérifiées avant d’apparaître dans le jeu. Le classement enregistre ton pseudo et ton score.",
      data2: "Les noms, logos et marques cités appartiennent à leurs propriétaires respectifs.",
      related: "Jeu associé : ",
      copyright: "© " + INFO.year + " " + INFO.name + " - Créé par Lucas Jégou, Roman Joly et Maxime Maygnan"
    },
    en: {
      credits: "Credits",
      close: "Close",
      intro: INFO.name + " is the GeoGuessr of the CentraleSupélec campus: find on the map where the photo was taken and climb the leaderboard. Your games earn you tokens for WikiCS.",
      founders: "The founders",
      role: "Co-founder",
      contact: "A question, an idea, a photo to report? Write to us on LinkedIn.",
      tools: "Tools and resources",
      data: "Content and data",
      data1: "Photos are suggested by players and reviewed before they appear in the game. The leaderboard stores your nickname and your score.",
      data2: "The names, logos and trademarks mentioned belong to their respective owners.",
      related: "Related game: ",
      copyright: "© " + INFO.year + " " + INFO.name + " - Created by Lucas Jégou, Roman Joly and Maxime Maygnan"
    }
  };
  const t = (k) => T[lang()][k];

  const css = `
body.has-foot{display:flex;flex-direction:column;min-height:100dvh}
body.has-foot>main{flex:1 0 auto;width:100%}
.foot{width:100%;max-width:980px;margin:0 auto;padding:.9rem 16px max(.9rem,env(safe-area-inset-bottom));border-top:1px solid rgba(245,246,242,.12);text-align:center;font-size:.78rem;line-height:1.5;color:#9fb0aa}
.creditline{font-size:.72rem;line-height:1.45;color:#6a7771;text-align:center;margin:.9rem 0 0 !important}
.linkbtn{background:none !important;border:0;padding:0 !important;margin:0 !important;width:auto !important;border-radius:4px;color:var(--signal);font:inherit !important;text-decoration:underline;cursor:pointer;display:inline}
.creditline .linkbtn{color:#10252d}
.foot .linkbtn{font-size:inherit}
dialog.credits{background:var(--ink);color:var(--paper);border:1px solid var(--line);border-radius:14px;padding:0;width:min(520px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto;font-family:var(--font);text-align:left}
dialog.credits::backdrop{background:rgba(0,0,0,.65)}
.credits .bar{position:sticky;top:0;z-index:1;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1rem 1.2rem .6rem;background:var(--ink)}
.credits .bar h2{margin:0;font-size:1.4rem;font-weight:800}
.credits .bar small{display:block;font-weight:600;font-size:.8rem;color:#9fb0aa}
.credits .body{padding:0 1.2rem 1.2rem}
.credits h3{margin:1.1rem 0 .5rem;font-size:1rem;color:var(--signal);text-transform:none;letter-spacing:0}
.credits p{margin:.4rem 0;color:#c3cec9;font-size:.92rem}
.credits .row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem .8rem;background:rgba(255,255,255,.06);border-radius:12px;padding:.7rem .9rem;margin-bottom:.45rem}
.credits .row small{display:block;color:#9fb0aa}
.credits .row a{color:var(--signal)}
.credits .row a.pill2{background:var(--paper);color:var(--ink);font-weight:800;text-decoration:none;border-radius:10px;padding:.45rem .8rem}
.credits button{font:800 .95rem var(--font);border:0;border-radius:10px;padding:.7rem 1rem;cursor:pointer;background:var(--signal);color:var(--ink)}
.credits button.ghost{background:rgba(255,255,255,.12);color:var(--paper)}
.credits button:focus-visible,.linkbtn:focus-visible{outline:3px solid var(--signal);outline-offset:2px}`;
  document.head.append(Object.assign(h("style"), { textContent: css }));

  let dlg = null;

  function buildCredits() {
    const d = h("dialog", "credits"); d.setAttribute("aria-labelledby", "credits-title");
    const bar = h("div", "bar"), head = h("div"), title = h("h2", "", t("credits")); title.id = "credits-title";
    head.append(title, h("small", "", INFO.name + " · " + INFO.version + " · " + INFO.year));
    const x = h("button", "ghost", t("close")); x.type = "button"; x.onclick = () => d.close();
    bar.append(head, x);

    const body = h("div", "body");
    body.append(h("p", "", t("intro")));

    body.append(h("h3", "", t("founders")));
    TEAM.forEach(([name, url]) => {
      const row = h("div", "row"), who = h("div");
      who.append(h("strong", "", name), h("small", "", t("role")));
      row.append(who, ext("LinkedIn", url, "pill2")); body.append(row);
    });
    body.append(h("p", "", t("contact")));

    body.append(h("h3", "", t("tools")));
    TOOLS.forEach(([name, url, fr, en]) => {
      const row = h("div", "row"), who = h("div"), strong = h("strong"); strong.append(ext(name, url));
      who.append(strong, h("small", "", lang() === "en" ? en : fr)); row.append(who); body.append(row);
    });

    body.append(h("h3", "", t("data")));
    body.append(h("p", "", t("data1")), h("p", "", t("data2")));
    const j = h("p", "", t("related")); j.append(ext("WikiCS", WIKI_URL));
    body.append(j, h("p", "", t("copyright")));

    const close = h("button", "", t("close")); close.type = "button"; close.style.marginTop = ".8rem"; close.onclick = () => d.close();
    body.append(close);
    d.append(bar, body);
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });   // clic en dehors = fermer
    return d;
  }

  function openCredits() {
    if (!dlg) { dlg = buildCredits(); document.body.append(dlg); }
    dlg.showModal();
  }

  // Remplit une zone « copyright + Crédits » (pied de page, ou ligne dans une carte du jeu)
  function fill(el, withVersion) {
    el.textContent = "";
    const b = h("button", "linkbtn", t("credits")); b.type = "button"; b.onclick = openCredits;
    el.append(t("copyright") + (withVersion ? " · " + INFO.version : "") + " · ", b);
  }

  function setup() {
    const lines = document.querySelectorAll("[data-credits-line]");
    let foot = null;
    if (!lines.length && !document.querySelector(".foot")) { foot = h("footer", "foot"); document.body.append(foot); document.body.classList.add("has-foot"); }
    const render = () => {
      lines.forEach((el) => fill(el, false));
      if (foot) fill(foot, true);
      if (dlg) { const was = dlg.open; dlg.remove(); dlg = null; if (was) openCredits(); }   // retraduit la fenêtre si elle est ouverte
    };
    render();
    document.addEventListener("langchange", render);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup); else setup();

  window.CREDITS = { open: openCredits, info: INFO };
})();
