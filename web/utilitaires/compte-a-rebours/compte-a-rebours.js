// 65000 → "01:05" ; 3725000 → "1:02:05"
export function formaterDuree(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const deux = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${deux(m)}:${deux(s)}` : `${deux(m)}:${deux(s)}`;
}

// Compte à rebours basé sur l'heure réelle : reste juste même si l'onglet dort en arrière-plan.
export function compteARebours(dureeMs, { surTic, surFin, intervalle = 250 } = {}) {
  const fin = Date.now() + dureeMs;
  const reste = () => Math.max(0, fin - Date.now());
  const id = setInterval(tic, intervalle);
  function tic() {
    const r = reste();
    surTic?.(r);
    if (r === 0) {
      clearInterval(id);
      surFin?.();
    }
  }
  tic();
  return { reste, arreter: () => clearInterval(id) };
}
