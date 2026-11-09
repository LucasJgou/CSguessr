// Traductions français / anglais. Le choix est mémorisé dans le navigateur et partagé entre toutes les pages.
// Pour ajouter ou corriger un texte : modifie la ligne correspondante ci-dessous (clé: "texte").
(() => {
  const DICT = {
    fr: {
      "lang.label": "Langue",
      "back": "Retour au jeu",
      "pts": "pts",

      // Jeu
      "photo.alt": "Photo d’un lieu du campus à retrouver sur la carte",
      "round": "Manche {n} / {total}",
      "add": "Ajouter une photo",
      "board.link": "Classement général",
      "board.aria": "Classement des 3 meilleurs scores",
      "top3": "Top 3",
      "map.enlarge": "Agrandir la carte",
      "map.reduce": "Réduire la carte",
      "btn.place": "Clique sur la carte pour placer ton point",
      "btn.validate": "Valider ma réponse",
      "btn.next": "Manche suivante",
      "btn.seeScore": "Voir mon score",
      "missing.photo": "Photo introuvable : {file}",
      "missing.none": "Aucune photo dans photos.js pour l’instant.",
      "res.bullseye": "En plein dans le mille",
      "res.close": "Tout près",
      "res.far": "À {d} m",
      "res.within": "Moins de 15 m d’écart. ",
      "res.dist": "Distance : {d} m. Tu gagnes {pts} points.",
      "res.over": " Partie terminée : {total} / {max}.",
      "score.empty": "Aucun score pour l’instant",
      "board.unavailable": "Classement indisponible",

      // Fin de partie
      "end.title": "Partie terminée",
      "end.label": "Ton pseudo pour le classement",
      "end.placeholder": "Ex : Marie",
      "end.save": "Enregistrer mon score",
      "end.saving": "Enregistrement…",
      "end.top": "Meilleurs scores",
      "end.replay": "Rejouer",
      "end.viewBoard": "Voir le classement général",
      "end.rank": "Tu es {ord}",
      "end.outOf1": "sur {n} joueur",
      "end.outOfN": "sur {n} joueurs",
      "end.bestKept": "Ton meilleur score reste {best} pts. Tu as fait mieux que ça, retente ta chance !",
      "end.saved": "Score enregistré",
      "end.noRank": "Ton rang n’a pas pu être calculé. ",
      "end.notSaved": "Score non enregistré",
      "end.unreachable": "Le classement est injoignable pour le moment. Détail : {err}",
      "msg.record": "Nouveau record ! Tu règnes sur le campus.",
      "msg.podium": "Sur le podium, bravo !",
      "msg.m80": "Tu connais le campus comme ta poche.",
      "msg.m50": "Pas mal du tout, tu as de bons repères.",
      "msg.m25": "Pas mal, mais le campus a encore des secrets pour toi.",
      "msg.m0": "Il est temps d’aller explorer le campus !",

      // Page classement
      "cl.title": "Classement général",
      "cl.lead": "Les meilleurs scores de tous les joueurs.",
      "cl.localnote": "Supabase n’est pas configuré : ce classement est enregistré uniquement dans ce navigateur.",
      "cl.loading": "Chargement…",
      "cl.more": "Voir plus",
      "cl.play": "Jouer",
      "cl.empty": "Aucun score pour l’instant. Sois le premier !",
      "cl.error": "Classement indisponible pour le moment. Détail : {err}",

      // Page d'ajout
      "add.title": "Proposer une photo",
      "add.lead": "Dépose ta photo, place le point exact où elle a été prise, puis envoie. Ta proposition sera vérifiée avant d’apparaître dans le jeu.",
      "add.step1": "1. Choisis ta photo",
      "add.preview": "Aperçu de la photo choisie",
      "add.step2": "2. Place le point exact",
      "add.hint": "Zoome puis clique à l’endroit où tu as pris la photo.",
      "add.placed": "Point placé : {lat}, {lng}",
      "add.send": "Envoyer la photo",
      "add.badFormat": "Format d’image non lu. Essaie une photo JPEG ou PNG.",
      "add.noConfig": "Supabase n’est pas configuré : remplis config.js (URL et clé).",
      "add.outside": "Le point est en dehors du campus. Replace-le sur la carte.",
      "add.sending": "Envoi en cours…",
      "add.sent": "Photo envoyée, merci ! Elle apparaîtra dans le jeu après validation.",
      "add.fail": "Échec de l’envoi : {err}. Réessaie dans un instant.",
      "add.upRefused": "envoi de la photo refusé ({s})",
      "add.insRefused": "enregistrement des coordonnées refusé ({s})",
      "add.conn": "connexion impossible"
    },
    en: {
      "lang.label": "Language",
      "back": "Back to the game",
      "pts": "pts",

      "photo.alt": "Photo of a campus location to find on the map",
      "round": "Round {n} / {total}",
      "add": "Add a photo",
      "board.link": "Leaderboard",
      "board.aria": "Top 3 scores",
      "top3": "Top 3",
      "map.enlarge": "Enlarge the map",
      "map.reduce": "Shrink the map",
      "btn.place": "Click on the map to place your pin",
      "btn.validate": "Submit my guess",
      "btn.next": "Next round",
      "btn.seeScore": "See my score",
      "missing.photo": "Photo not found: {file}",
      "missing.none": "No photos in photos.js yet.",
      "res.bullseye": "Bullseye",
      "res.close": "Very close",
      "res.far": "{d} m away",
      "res.within": "Less than 15 m off. ",
      "res.dist": "Distance: {d} m. You score {pts} points.",
      "res.over": " Game over: {total} / {max}.",
      "score.empty": "No scores yet",
      "board.unavailable": "Leaderboard unavailable",

      "end.title": "Game over",
      "end.label": "Your nickname for the leaderboard",
      "end.placeholder": "e.g. Alex",
      "end.save": "Save my score",
      "end.saving": "Saving…",
      "end.top": "Best scores",
      "end.replay": "Play again",
      "end.viewBoard": "View the full leaderboard",
      "end.rank": "You are {ord}",
      "end.outOf1": "out of {n} player",
      "end.outOfN": "out of {n} players",
      "end.bestKept": "Your best score is still {best} pts. You can do better, give it another go!",
      "end.saved": "Score saved",
      "end.noRank": "Your rank could not be calculated. ",
      "end.notSaved": "Score not saved",
      "end.unreachable": "The leaderboard is unreachable right now. Details: {err}",
      "msg.record": "New record! You rule the campus.",
      "msg.podium": "On the podium, well done!",
      "msg.m80": "You know the campus like the back of your hand.",
      "msg.m50": "Not bad at all, you know your way around.",
      "msg.m25": "Not bad, but the campus still has secrets for you.",
      "msg.m0": "Time to go explore the campus!",

      "cl.title": "Leaderboard",
      "cl.lead": "The best scores from all players.",
      "cl.localnote": "Supabase is not configured: this leaderboard is only stored in this browser.",
      "cl.loading": "Loading…",
      "cl.more": "Show more",
      "cl.play": "Play",
      "cl.empty": "No scores yet. Be the first!",
      "cl.error": "Leaderboard unavailable right now. Details: {err}",

      "add.title": "Suggest a photo",
      "add.lead": "Upload your photo, place the exact point where it was taken, then send it. Your suggestion will be reviewed before it appears in the game.",
      "add.step1": "1. Choose your photo",
      "add.preview": "Preview of the chosen photo",
      "add.step2": "2. Place the exact point",
      "add.hint": "Zoom in, then click where you took the photo.",
      "add.placed": "Point placed: {lat}, {lng}",
      "add.send": "Send the photo",
      "add.badFormat": "Image format not supported. Try a JPEG or PNG photo.",
      "add.noConfig": "Supabase is not configured: fill in config.js (URL and key).",
      "add.outside": "The point is outside the campus. Place it again on the map.",
      "add.sending": "Sending…",
      "add.sent": "Photo sent, thank you! It will appear in the game after review.",
      "add.fail": "Sending failed: {err}. Please try again in a moment.",
      "add.upRefused": "photo upload refused ({s})",
      "add.insRefused": "coordinates not saved ({s})",
      "add.conn": "connection failed"
    }
  };

  const KEY = "geoguessr_lang";
  let lang = null;
  try { lang = localStorage.getItem(KEY); } catch {}
  if (lang !== "fr" && lang !== "en") lang = String(navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";

  window.getLang = () => lang;
  window.locale = () => (lang === "fr" ? "fr-FR" : "en-GB");
  window.tr = (key, vars) => {
    let s = (DICT[lang] && DICT[lang][key]) ?? DICT.fr[key] ?? key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  };
  window.ordinal = (n) => {
    if (lang === "fr") return n === 1 ? "1er" : n + "e";
    const r = n % 100, s = (r >= 11 && r <= 13) ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th");
    return n + s;
  };

  const css = document.createElement("style");
  css.textContent = `
    .langsw{display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:rgba(16,37,45,.85);border:1px solid rgba(245,246,242,.25);pointer-events:auto;backdrop-filter:blur(6px)}
    .langsw button{border:0;background:transparent;color:#f5f6f2;font:700 .8rem "Bricolage Grotesque",system-ui,-apple-system,"Segoe UI",sans-serif;padding:.3rem .6rem;border-radius:999px;cursor:pointer}
    .langsw button[aria-pressed=true]{background:#f0b429;color:#10252d}
    .langsw button:focus-visible{outline:3px solid #f0b429;outline-offset:2px}`;
  document.head.appendChild(css);

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = tr(el.getAttribute("data-i18n")); });
    ["alt", "placeholder", "aria-label", "title"].forEach((a) => {
      document.querySelectorAll("[data-i18n-" + a + "]").forEach((el) => el.setAttribute(a, tr(el.getAttribute("data-i18n-" + a))));
    });
    document.querySelectorAll(".langsw button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  }

  function setLang(l) {
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch {}
    apply();
    document.dispatchEvent(new CustomEvent("langchange"));
  }

  document.querySelectorAll("[data-langswitch]").forEach((c) => {
    c.className = "langsw"; c.setAttribute("role", "group"); c.setAttribute("data-i18n-aria-label", "lang.label");
    [["fr", "FR", "Français"], ["en", "EN", "English"]].forEach(([code, label, name]) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label; b.title = name; b.lang = code; b.dataset.lang = code;
      b.addEventListener("click", () => setLang(code));
      c.appendChild(b);
    });
  });
  apply();
})();
