// Validation IBAN (clé de contrôle mod 97 + longueur par pays), BIC, formatage.
const LONGUEURS = {
  // Europe
  FR: 27, BE: 16, DE: 22, ES: 24, IT: 27, LU: 20, CH: 21, MC: 27, PT: 25, NL: 18, GB: 22,
  // Afrique (UEMOA : 28 caractères ; CEMAC : 27)
  CI: 28, SN: 28, ML: 28, BF: 28, BJ: 28, TG: 28, NE: 28, GW: 25, CM: 27, CG: 27, GA: 27,
  MA: 28, TN: 24, DZ: 26, MG: 27,
};

export function normaliserIban(iban) {
  return String(iban).replace(/\s+/g, "").toUpperCase();
}

export function validerIban(iban) {
  const v = normaliserIban(iban);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v)) return false;
  const attendue = LONGUEURS[v.slice(0, 2)];
  if (attendue && v.length !== attendue) return false;

  // On déplace les 4 premiers caractères à la fin, lettres → nombres (A=10…Z=35), puis mod 97.
  let reste = 0;
  for (const c of v.slice(4) + v.slice(0, 4)) {
    const n = c >= "A" ? c.charCodeAt(0) - 55 : Number(c);
    reste = (reste * (n > 9 ? 100 : 10) + n) % 97;
  }
  return reste === 1;
}

// "FR7630006000011234567890189" → "FR76 3000 6000 0112 3456 7890 189"
export function formaterIban(iban) {
  return normaliserIban(iban).replace(/(.{4})(?=.)/g, "$1 ");
}

// BIC / SWIFT : 8 ou 11 caractères (banque, pays, ville, agence)
export function validerBic(bic) {
  return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(String(bic).replace(/\s+/g, "").toUpperCase());
}
