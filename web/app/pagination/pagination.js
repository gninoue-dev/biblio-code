// Découpe une liste en pages.
export function paginer(elements, page = 1, parPage = 10) {
  const totalPages = Math.max(1, Math.ceil(elements.length / parPage));
  const courante = Math.min(Math.max(1, page), totalPages);
  const debut = (courante - 1) * parPage;
  return {
    elements: elements.slice(debut, debut + parPage),
    page: courante,
    totalPages,
    total: elements.length,
    precedente: courante > 1 ? courante - 1 : null,
    suivante: courante < totalPages ? courante + 1 : null,
  };
}

// Numéros de page à afficher : numerosPages(5, 20) → [1, "…", 4, 5, 6, "…", 20]
export function numerosPages(page, totalPages, voisins = 1) {
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= voisins) pages.push(p);
    else if (pages.at(-1) !== "…") pages.push("…");
  }
  return pages;
}
