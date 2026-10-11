---
prefixe: bib-transactions
description: Solde, totaux par catégorie, regroupement par mois, filtres, export CSV
langage: javascript
fichier: transactions.js
---

# transactions

```js
const transactions = [
  { date: "2026-10-01", libelle: "Salaire", montant: 450000, categorie: "revenus" },
  { date: "2026-10-03", libelle: "Supermarché", montant: -23500, categorie: "courses" },
];

soldeTransactions(transactions);                          // 426500 (F CFA)
totauxParCategorie(transactions).courses.debits;          // -23500
regrouperParMois(transactions);                           // Map { "2026-10" => [...] }
filtrerTransactions(transactions, { du: "2026-10-01", type: "debit", recherche: "super" });
telechargerFichier(exporterCsv(transactions, { decimales: 0 }), "releve-octobre.csv", "text/csv;charset=utf-8");
```

Les montants sont en unités mineures (voir le module `argent`). Ici ce sont des francs CFA (0 décimale) ; pour l'euro, ce seraient des centimes et `decimales: 2`.

## Sécurité

- `exporterCsv` neutralise l'**injection de formules CSV** : un libellé comme `=HYPERLINK(...)` ne s'exécutera pas dans Excel.
