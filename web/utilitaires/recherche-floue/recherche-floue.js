// Recherche tolérante aux fautes de frappe : « Vouliez-vous dire… ? »
const normaliser = (t) =>
  String(t ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// Nombre minimal de lettres à ajouter, supprimer ou remplacer pour passer de a à b.
export function distanceLevenshtein(a, b) {
  let precedente = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const courante = [i];
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1;
      courante[j] = Math.min(precedente[j] + 1, courante[j - 1] + 1, precedente[j - 1] + cout);
    }
    precedente = courante;
  }
  return precedente[b.length];
}

// 1 = identique, 0 = rien à voir (accents et majuscules ignorés)
export function similarite(a, b) {
  const x = normaliser(a);
  const y = normaliser(b);
  if (!x && !y) return 1;
  return 1 - distanceLevenshtein(x, y) / Math.max(x.length, y.length);
}

// Meilleurs candidats pour une requête mal tapée.
// `cle` : quel texte comparer quand les candidats sont des objets.
export function suggestions(requete, candidats, { max = 3, similariteMin = 0.6, cle = (c) => c } = {}) {
  const q = normaliser(requete);
  if (!q) return [];
  return candidats
    .map((c) => {
      const texte = normaliser(cle(c));
      const mots = texte.split(/\s+/);
      const score = texte.includes(q) ? 1 : Math.max(similarite(q, texte), ...mots.map((m) => similarite(q, m)));
      return { element: c, score };
    })
    .filter((r) => r.score >= similariteMin)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
}
