// Conversion entre devises, en unités mineures, à partir d'une table de taux.
// taux = combien d'unités de chaque devise pour 1 unité de la devise de base.
// Ex. base EUR : { EUR: 1, XOF: 655.957, USD: 1.08 }
const decimales = (devise) =>
  new Intl.NumberFormat("en", { style: "currency", currency: devise }).resolvedOptions().maximumFractionDigits;

export function convertir(unites, de, vers, taux) {
  if (!(de in taux) || !(vers in taux)) throw new Error(`Taux manquant pour ${de} ou ${vers}`);
  const montant = unites / 10 ** decimales(de);
  const converti = (montant / taux[de]) * taux[vers];
  return Math.round(converti * 10 ** decimales(vers));
}

// Parité fixe officielle : 1 EUR = 655,957 XOF (franc CFA UEMOA) = 655,957 XAF (CEMAC)
export const PARITE_FCFA = { EUR: 1, XOF: 655.957, XAF: 655.957 };
