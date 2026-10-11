---
prefixe: bib-throttle
description: Limite la fréquence d'appel d'une fonction (scroll, resize)
langage: javascript
fichier: throttle.js
---

# throttle

**À quoi ça sert :** réagir au défilement sans exécuter du code 100 fois par seconde. Contrairement à `debounce`, la fonction s'exécute **régulièrement** pendant l'action, et le dernier appel n'est jamais perdu.

```js
addEventListener("scroll", throttle(() => majBarreProgression(), 100));
```
