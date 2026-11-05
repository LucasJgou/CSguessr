// Classement du jeu.
// - Si config.js contient de vraies clés Supabase : classement PARTAGÉ entre tous les joueurs (table « scores », voir scores.sql).
// - Sinon : classement stocké dans ce navigateur uniquement (localStorage), pratique pour tester.
const Scoreboard = (() => {
  const LS_KEY = "geoguessr_scores_v1";
  const remote = typeof SUPABASE_URL === "string" && typeof SUPABASE_KEY === "string"
    && !SUPABASE_URL.includes("VOTRE-PROJET") && !SUPABASE_KEY.includes("VOTRE_CLE");
  const base = remote ? SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/scores" : null;
  const H = remote ? { apikey: SUPABASE_KEY, ...(SUPABASE_KEY.startsWith("eyJ") ? { Authorization: "Bearer " + SUPABASE_KEY } : {}) } : {};
 
  const readLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
  const writeLocal = (a) => { try { localStorage.setItem(LS_KEY, JSON.stringify(a)); } catch {} };
 
  async function check(r, step) {
    if (r.ok) return r;
    let t = ""; try { t = (await r.text()).slice(0, 200); } catch {}
    throw new Error("[v3 " + step + "] HTTP " + r.status + (t ? " – " + t : ""));
  }
 
  async function count(filter) {
    const r = await fetch(base + "?select=id&limit=1" + (filter || ""), { headers: { ...H, Prefer: "count=exact" } });
    await check(r, "rang");
    return parseInt((r.headers.get("Content-Range") || "").split("/")[1], 10) || 0;
  }
 
  // Les n meilleurs scores : [{pseudo, score}, ...]
  async function top(n = 3) {
    if (!remote) return readLocal().sort((a, b) => b.score - a.score).slice(0, n);
    const r = await fetch(base + "?select=pseudo,score&order=score.desc,created_at.asc&limit=" + n, { headers: H });
    await check(r, "lecture");
    return r.json();
  }
 
  // Enregistre le score et renvoie { rank, total } (rang parmi tous les scores, le sien compris)
  async function submit(pseudo, score) {
    pseudo = String(pseudo).trim().slice(0, 16);
    score = Math.max(0, Math.round(score));
    if (!remote) {
      const all = readLocal();
      all.push({ pseudo, score, t: Date.now() });
      writeLocal(all);
      return { rank: all.filter((s) => s.score > score).length + 1, total: all.length };
    }
    const r = await fetch(base, {
      method: "POST",
      headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ pseudo, score })
    });
    await check(r, "ajout");
    // Le score est enregistré ; si le calcul du rang échoue, on le dit sans perdre le score
    try {
      const [better, total] = await Promise.all([count("&score=gt." + score), count("")]);
      return { rank: better + 1, total };
    } catch (e) { console.error(e); return { rank: null, total: null }; }
  }
 
  return { top, submit, shared: remote };
})();
