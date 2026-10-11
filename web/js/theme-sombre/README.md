---
prefixe: bib-theme
description: Bouton thème clair/sombre mémorisé dans le navigateur
langage: javascript
fichier: theme-sombre.js
---

# theme-sombre

**À quoi ça sert :** ajouter un mode sombre à un site en deux minutes.

## Utilisation

```js
initTheme();
bouton.addEventListener("click", basculerTheme);
```

CSS à ajouter :

```css
:root { --fond: #ffffff; --texte: #111111; }
:root[data-theme="dark"] { --fond: #121212; --texte: #eeeeee; }
body { background: var(--fond); color: var(--texte); }
```
