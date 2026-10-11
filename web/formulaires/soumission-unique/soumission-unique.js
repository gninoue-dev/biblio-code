// Empêche les doubles envois (double clic sur « Payer », réseau lent…).

// Tant que l'action est en cours, les appels suivants renvoient la même promesse.
export function uneSeuleFois(action) {
  let enCours = null;
  return (...args) =>
    (enCours ??= Promise.resolve()
      .then(() => action(...args))
      .finally(() => (enCours = null)));
}

// Désactive le bouton d'envoi et affiche un texte de chargement pendant `action(formData)`.
export function formulaireSoumissionUnique(formulaire, action, { texteChargement = "Envoi en cours…" } = {}) {
  const bouton = formulaire.querySelector('[type="submit"], button:not([type])');
  const executer = uneSeuleFois(action);
  formulaire.addEventListener("submit", async (e) => {
    e.preventDefault();
    const texte = bouton?.textContent;
    if (bouton) {
      bouton.disabled = true;
      bouton.setAttribute("aria-busy", "true");
      bouton.textContent = texteChargement;
    }
    try {
      await executer(new FormData(formulaire));
    } finally {
      if (bouton) {
        bouton.disabled = false;
        bouton.removeAttribute("aria-busy");
        bouton.textContent = texte;
      }
    }
  });
}

// Clé à générer UNE fois par opération et à envoyer au serveur (en-tête Idempotency-Key) :
// si la requête est rejouée, le serveur reconnaît la clé et n'exécute pas l'opération deux fois.
export function cleIdempotence() {
  return crypto.randomUUID();
}
