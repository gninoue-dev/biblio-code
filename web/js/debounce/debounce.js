// Retarde l'appel de `fn` jusqu'à ce que `delai` ms passent sans nouvel appel.
export function debounce(fn, delai = 300) {
  let minuteur;
  return (...args) => {
    clearTimeout(minuteur);
    minuteur = setTimeout(() => fn(...args), delai);
  };
}
