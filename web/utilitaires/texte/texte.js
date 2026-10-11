// "Été à Abidjan !" → "ete-a-abidjan"
export function slugifier(texte) {
  return String(texte)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function tronquer(texte, max = 100, suite = "…") {
  return texte.length <= max ? texte : texte.slice(0, max - suite.length).trimEnd() + suite;
}

// À utiliser avant d'insérer du texte utilisateur dans du HTML (protection XSS).
export function echapperHtml(texte) {
  const entites = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(texte).replace(/[&<>"']/g, (c) => entites[c]);
}

export function capitaliser(texte) {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}
