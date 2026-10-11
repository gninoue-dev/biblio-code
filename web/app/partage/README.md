---
prefixe: bib-partage
description: Partage natif + liens WhatsApp, Telegram, SMS, email
langage: javascript
fichier: partage.js
---

# partage

```js
bouton.onclick = async () => {
  const r = await partager({ titre: "Mon reçu", texte: "Paiement de 15 000 F effectué", url: location.href });
  if (r === "copie") toast("Lien copié");
};

lienWhatsApp("Bonjour, je suis intéressé par le pagne wax", "2250707123456"); // contacter un vendeur
lienWhatsApp("Regarde cette appli : https://…");                              // choisir le contact
lienSms("+2250707123456", "Votre code : 123456");
lienEmail("support@monsite.ci", { sujet: "Réclamation", corps: "Bonjour,…" });
```

Le bouton « Commander sur WhatsApp » est l'un des moyens de vente les plus efficaces en Afrique de l'Ouest.
