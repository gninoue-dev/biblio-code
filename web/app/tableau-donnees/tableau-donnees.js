// Recherche et tri sur une liste d'objets (tableaux, listes de produits, contacts…).
const normaliser = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Recherche insensible aux accents et à la casse dans les champs indiqués.
export function rechercher(elements, requete, champs) {
  const q = normaliser(requete).trim();
  if (!q) return elements;
  return elements.filter((el) => champs.some((c) => normaliser(el[c]).includes(q)));
}

// Tri naturel ("article 2" avant "article 10"), nombres et textes.
export function trierPar(elements, champ, sens = "asc") {
  const facteur = sens === "desc" ? -1 : 1;
  const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });
  return [...elements].sort((a, b) => {
    const x = a[champ];
    const y = b[champ];
    if (typeof x === "number" && typeof y === "number") return (x - y) * facteur;
    return collator.compare(String(x ?? ""), String(y ?? "")) * facteur;
  });
}
