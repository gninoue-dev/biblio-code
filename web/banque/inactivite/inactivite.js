// Déconnexion automatique après une période d'inactivité, avec avertissement avant.
// Fonctionne même si l'onglet est resté en arrière-plan (les minuteurs y sont ralentis).
export function surveillerInactivite({ dureeMs = 5 * 60_000, avertirAvantMs = 60_000, surAvertissement, surExpiration }) {
  const evenements = ["pointerdown", "keydown", "scroll", "touchstart"];
  let derniereActivite = Date.now();
  let averti = false;

  const verifier = () => {
    const inactif = Date.now() - derniereActivite;
    if (inactif >= dureeMs) {
      arreter();
      surExpiration();
    } else if (!averti && inactif >= dureeMs - avertirAvantMs) {
      averti = true;
      surAvertissement?.(dureeMs - inactif);
    }
  };

  const relancer = () => {
    derniereActivite = Date.now();
    averti = false;
  };

  const surVisibilite = () => document.visibilityState === "visible" && verifier();
  const intervalle = setInterval(verifier, 1000);

  function arreter() {
    clearInterval(intervalle);
    evenements.forEach((e) => removeEventListener(e, relancer));
    document.removeEventListener("visibilitychange", surVisibilite);
  }

  evenements.forEach((e) => addEventListener(e, relancer, { passive: true }));
  document.addEventListener("visibilitychange", surVisibilite);
  return { relancer, arreter };
}
