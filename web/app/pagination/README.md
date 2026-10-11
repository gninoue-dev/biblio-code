---
prefixe: bib-pagination
description: Pagination d'une liste + numéros de pages avec « … »
langage: javascript
fichier: pagination.js
---

# pagination

```js
const { elements, page, totalPages, suivante } = paginer(transactions, 3, 20);
numerosPages(page, totalPages); // [1, 2, 3, 4, "…", 12]
```
