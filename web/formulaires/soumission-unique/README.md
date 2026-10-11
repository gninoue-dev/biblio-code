---
prefixe: bib-anti-doublon
description: Anti double envoi / double paiement + clé d'idempotence
langage: javascript
fichier: soumission-unique.js
---

# soumission-unique

**Indispensable pour un paiement ou un virement.** Sans lui, un double clic sur un réseau lent peut débiter deux fois.

```js
let cle = cleIdempotence(); // une clé par opération, pas par clic

formulaireSoumissionUnique(formVirement, async (donnees) => {
  await api.post("/virements", Object.fromEntries(donnees), { entetes: { "Idempotency-Key": cle } });
  toast("Virement envoyé", { type: "succes" });
  cle = cleIdempotence(); // nouvelle opération = nouvelle clé
}, { texteChargement: "Virement en cours…" });
```

## Côté serveur

Le serveur garde les clés déjà traitées, par exemple pendant 24 h. Si une clé revient, il renvoie la réponse déjà donnée **sans refaire le virement**. C'est ce que font Stripe, CinetPay et les API bancaires.
