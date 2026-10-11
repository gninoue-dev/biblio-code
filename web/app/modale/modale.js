// Fenêtre de confirmation basée sur <dialog> : focus géré, Échap ferme, accessible.
// Renvoie une promesse : true si l'utilisateur confirme.
export function confirmer(message, { titre = "Confirmation", ok = "Confirmer", annuler = "Annuler" } = {}) {
  return new Promise((resoudre) => {
    const dialog = document.createElement("dialog");
    dialog.innerHTML = `
      <form method="dialog">
        <h2 style="margin-top:0"></h2>
        <p></p>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button value="non"></button>
          <button value="oui" autofocus></button>
        </div>
      </form>`;
    // textContent : aucun risque d'injection HTML via le message.
    dialog.querySelector("h2").textContent = titre;
    dialog.querySelector("p").textContent = message;
    dialog.querySelector('[value="non"]').textContent = annuler;
    dialog.querySelector('[value="oui"]').textContent = ok;

    dialog.addEventListener("close", () => {
      resoudre(dialog.returnValue === "oui");
      dialog.remove();
    });
    document.body.append(dialog);
    dialog.showModal();
  });
}
