---
prefixe: bib-mdp
description: Indicateur de force du mot de passe avec critères
langage: javascript
fichier: mot-de-passe.js
---

# mot-de-passe

```js
champ.addEventListener("input", () => {
  const { score, niveau, criteres } = forceMotDePasse(champ.value);
  barre.style.width = `${score * 20}%`;
  libelle.textContent = niveau;
  coche12.classList.toggle("ok", criteres.longueur);
});
```

## Pièges

- C'est un indicateur simple. Pour un site sensible, comme une banque, vérifie aussi côté serveur que le mot de passe n'apparaît pas dans une fuite connue (API *Have I Been Pwned*).
