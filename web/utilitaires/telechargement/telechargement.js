// Fait télécharger un fichier généré dans le navigateur (CSV, JSON, image…).
export function telechargerFichier(contenu, nomFichier, type = "text/plain;charset=utf-8") {
  const blob = contenu instanceof Blob ? contenu : new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const lien = Object.assign(document.createElement("a"), { href: url, download: nomFichier });
  document.body.append(lien);
  lien.click();
  lien.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
