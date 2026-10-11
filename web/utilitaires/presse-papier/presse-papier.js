// Copie un texte dans le presse-papier. Renvoie true si ça a marché.
export async function copierTexte(texte) {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    return false;
  }
}
