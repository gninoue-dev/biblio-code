// Application web installable (PWA) : service worker, bouton « Installer l'appli », état du réseau.

export async function enregistrerServiceWorker(chemin = "/sw.js") {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register(chemin);
  } catch (erreur) {
    console.warn("Service worker non enregistré :", erreur);
    return null;
  }
}

// Affiche `bouton` quand le navigateur propose l'installation (Android/Chrome/Edge).
export function boutonInstallation(bouton, { surInstallation } = {}) {
  let invite = null;
  bouton.hidden = true;
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    invite = e;
    bouton.hidden = false;
  });
  bouton.addEventListener("click", async () => {
    if (!invite) return;
    invite.prompt();
    await invite.userChoice;
    invite = null;
    bouton.hidden = true;
  });
  addEventListener("appinstalled", () => {
    bouton.hidden = true;
    surInstallation?.();
  });
}

// rappel(true|false) à chaque changement de connexion. Renvoie une fonction pour arrêter.
export function surveillerConnexion(rappel) {
  const maj = () => rappel(navigator.onLine);
  addEventListener("online", maj);
  addEventListener("offline", maj);
  maj();
  return () => {
    removeEventListener("online", maj);
    removeEventListener("offline", maj);
  };
}

export const estAppInstallee = () =>
  matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
