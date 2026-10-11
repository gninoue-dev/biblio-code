// Contrôles de saisie d'une carte bancaire (affichage / confort uniquement, voir README).

// Algorithme de Luhn : détecte les fautes de frappe dans un numéro de carte.
export function validerLuhn(numero) {
  const chiffres = String(numero).replace(/[\s-]/g, "");
  if (!/^\d{12,19}$/.test(chiffres)) return false;
  let somme = 0;
  for (let i = 0; i < chiffres.length; i++) {
    let c = Number(chiffres[chiffres.length - 1 - i]);
    if (i % 2 === 1) {
      c *= 2;
      if (c > 9) c -= 9;
    }
    somme += c;
  }
  return somme % 10 === 0;
}

const RESEAUX = [
  ["amex", /^3[47]/],
  ["visa", /^4/],
  ["mastercard", /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/],
  ["discover", /^6(011|5)/],
  ["jcb", /^35(2[89]|[3-8]\d)/],
  ["unionpay", /^62/],
];

export function detecterReseau(numero) {
  const chiffres = String(numero).replace(/\D/g, "");
  return RESEAUX.find(([, motif]) => motif.test(chiffres))?.[0] ?? null;
}

// "4111111111111111" → "4111 1111 1111 1111" ; Amex : "3782 822463 10005"
export function formaterNumeroCarte(numero) {
  const chiffres = String(numero).replace(/\D/g, "").slice(0, 19);
  if (detecterReseau(chiffres) === "amex") {
    return [chiffres.slice(0, 4), chiffres.slice(4, 10), chiffres.slice(10, 15)].filter(Boolean).join(" ");
  }
  return chiffres.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// "08/27" → true si la carte n'est pas expirée (valable jusqu'à la fin du mois)
export function validerExpiration(texte, maintenant = new Date()) {
  const m = String(texte).match(/^\s*(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})\s*$/);
  if (!m) return false;
  const mois = Number(m[1]);
  const annee = m[2].length === 2 ? 2000 + Number(m[2]) : Number(m[2]);
  return new Date(annee, mois, 1) > maintenant;
}

export function validerCvc(cvc, reseau) {
  return new RegExp(`^\\d{${reseau === "amex" ? 4 : 3}}$`).test(String(cvc));
}
