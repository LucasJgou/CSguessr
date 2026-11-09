// Classement du jeu : un seul score par joueur (son meilleur), le pseudo étant comparé sans tenir compte des majuscules.
// - Si config.js contient de vraies clés Supabase : classement PARTAGÉ (table « scores » + vue « scores_best », voir scores.sql et scores_best.sql).
// - Sinon : classement stocké dans ce navigateur uniquement (localStorage), pratique pour tester.
const Scoreboard = (() => {
  const LS_KEY = "geoguessr_scores_v1";
  const remote = typeof SUPABASE_URL === "string" && typeof SUPABASE_KEY === "string"
    && !SUPABASE_URL.includes("VOTRE-PROJET") && !SUPABASE_KEY.includes("VOTRE_CLE");
  const root = remote ? SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/" : null;
  const H = remote ? { apikey: SUPABASE_KEY, ...(SUPABASE_KEY.startsWith("eyJ") ? { Authorization: "Bearer " + SUPABASE_KEY } : {}) } : {};
  const MAX_ROWS = 1000;   // nombre maximum de joueurs pris en compte pour le classement et le calcul du rang

  const readLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
  const writeLocal = (a) => { try { localStorage.setItem(LS_KEY, JSON.stringify(a)); } catch {} };

  async function check(r, step) {
    if (r.ok) return r;
    let t = ""; try { t = (await r.text()).slice(0, 200); } catch {}
    throw new Error("[v4 " + step + "] HTTP " + r.status + (t ? " – " + t : ""));
  }

  // Garde le meilleur score de chaque joueur, trié du meilleur au moins bon
  function bests(list) {
    const m = new Map();
    for (const r of list) {
      const key = String(r.pseudo).trim().toLowerCase();
      const ts = r.created_at ? Date.parse(r.created_at) : (r.t || 0);
      const cur = m.get(key);
      if (!cur || r.score > cur.score || (r.score === cur.score && ts < cur.ts))
        m.set(key, { key, pseudo: r.pseudo, score: r.score, ts, created_at: r.created_at || new Date(r.t || Date.now()).toISOString() });
    }
    return [...m.values()].sort((a, b) => b.score - a.score || a.ts - b.ts);
  }

  // Liste des meilleurs scores (un par joueur). Utilise la vue « scores_best » ; si elle n'existe pas encore, repli sur la table.
  async function loadBests(n) {
    if (!remote) return bests(readLocal()).slice(0, n);
    let r = await fetch(root + "scores_best?select=key,pseudo,score,created_at&order=score.desc,created_at.asc&limit=" + n, { headers: H });
    if (r.status === 404) {
      r = await fetch(root + "scores?select=pseudo,score,created_at&order=score.desc,created_at.asc&limit=" + MAX_ROWS, { headers: H });
      await check(r, "lecture");
      return bests(await r.json()).slice(0, n);
    }
    await check(r, "lecture");
    return r.json();
  }

  const top = (n = 3) => loadBests(n);
  const all = (n = 100) => loadBests(n);

  // Enregistre le score et renvoie { rank, total, best } : rang du joueur d'après SON MEILLEUR score, parmi tous les joueurs
  async function submit(pseudo, score) {
    pseudo = String(pseudo).trim().slice(0, 16);
    score = Math.max(0, Math.round(score));
    if (!remote) {
      const list = readLocal();
      list.push({ pseudo, score, t: Date.now() });
      writeLocal(list);
    } else {
      const r = await fetch(root + "scores", {
        method: "POST",
        headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ pseudo, score })
      });
      await check(r, "ajout");
    }
    // Le score est enregistré ; si le calcul du rang échoue, on le dit sans perdre le score
    try {
      const list = await loadBests(MAX_ROWS);
      const key = pseudo.toLowerCase();
      const mine = list.find((x) => String(x.key || x.pseudo).trim().toLowerCase() === key);
      const best = mine ? mine.score : score;
      return { rank: list.filter((x) => x.score > best).length + 1, total: list.length, best };
    } catch (e) { console.error(e); return { rank: null, total: null, best: score }; }
  }

  return { top, all, submit, shared: remote };
})();
