---
prefixe: bib-otp
description: Champ code SMS / 2FA à cases (collage et auto-remplissage)
langage: javascript
fichier: champ-otp.js
---

# champ-otp

```html
<div id="otp" class="otp">
  <input><input><input><input><input><input>
</div>
```

```js
const otp = champOtp(document.querySelector("#otp"), {
  surComplet: (code) => verifierCode(code),
});
```

```css
.otp input { width: 2.5em; height: 3em; text-align: center; font-size: 1.4em; }
```
