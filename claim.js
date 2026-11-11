// À mettre dans le dépôt CSguessr (à côté de config.js) puis à charger dans index.html :
//   <script src="claim.js"></script>   (après config.js)
// Le jeu donne des jetons Wikimaster en fin de partie si le joueur est connecté.
// Les deux sites partagent le même domaine (lucasjgou.github.io), donc la même session « wm_s ».
async function claimTokens(score) {
  let s; try { s = JSON.parse(localStorage.getItem("wm_s")); } catch {}
  if (!s) return null;                       // joueur non connecté : pas de jetons
  const root = SUPABASE_URL.replace(/\/$/, "");
  try {
    if (Date.now() > s.exp) {                // session expirée : on la renouvelle
      const r = await fetch(root + "/auth/v1/token?grant_type=refresh_token", {
        method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: s.refresh })
      });
      const j = await r.json();
      if (!r.ok) return null;
      s = { ...s, token: j.access_token, refresh: j.refresh_token, exp: Date.now() + (j.expires_in || 3600) * 1000 - 60000 };
      localStorage.setItem("wm_s", JSON.stringify(s));
    }
    const r = await fetch(root + "/rest/v1/rpc/claim_tokens", {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + s.token, "Content-Type": "application/json" },
      body: JSON.stringify({ p_score: score })
    });
    return r.ok ? await r.json() : null;     // nombre de jetons gagnés
  } catch { return null; }
}

// Dans CSguessr, à la fin de la fonction showEnd(), ajoute cette ligne :
//   claimTokens(total).then((n) => { if (n !== null) console.log("+" + n + " jetons Wikimaster"); });
