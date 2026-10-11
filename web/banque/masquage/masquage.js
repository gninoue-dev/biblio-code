// Masque une donnée sensible en ne laissant visibles que les derniers caractères.
// masquer("FR76 3000 6000 0112 3456 7890 189") → "•••• •••• •••• •••• •••• ••90 189"
export function masquer(valeur, { visibles = 4, caractere = "•" } = {}) {
  const texte = String(valeur);
  const total = texte.replace(/\s/g, "").length;
  let index = 0;
  return [...texte].map((c) => (/\s/.test(c) ? c : index++ < total - visibles ? caractere : c)).join("");
}

// "awa.kone@mail.com" → "a•••••••@mail.com"
export function masquerEmail(email) {
  const [nom, domaine] = String(email).split("@");
  if (!domaine) return masquer(email);
  return nom.slice(0, 1) + "•".repeat(Math.max(nom.length - 1, 3)) + "@" + domaine;
}
