// Petites notifications temporaires en bas de l'écran, lues par les lecteurs d'écran.
let zone;

function obtenirZone() {
  if (!zone) {
    zone = document.createElement("div");
    zone.setAttribute("role", "status");
    zone.setAttribute("aria-live", "polite");
    Object.assign(zone.style, {
      position: "fixed",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      zIndex: 9999,
    });
    document.body.append(zone);
  }
  return zone;
}

const COULEURS = { info: "#2563eb", succes: "#15803d", erreur: "#b91c1c", alerte: "#b45309" };

export function toast(message, { type = "info", duree = 3000 } = {}) {
  const el = document.createElement("div");
  el.textContent = message;
  Object.assign(el.style, {
    background: COULEURS[type] ?? COULEURS.info,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,.2)",
    font: "14px system-ui, sans-serif",
    maxWidth: "90vw",
    transition: "opacity .3s",
  });
  obtenirZone().append(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, duree);
}
