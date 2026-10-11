---
prefixe: bib-py-reessayer
description: Décorateur de nouvelles tentatives avec attente exponentielle (sync et async)
langage: python
fichier: reessayer.py
---

# reessayer

```python
@reessayer(essais=5, attente=1, exceptions=(ConnectionError, TimeoutError))
def lire_cours_or():
    return requests.get(URL_API, timeout=10).json()

@reessayer(essais=3)
async def envoyer_ordre(ordre): ...
```

## Pièges

- Ne réessaie **jamais** automatiquement un ordre de trading ou un paiement sans clé d'idempotence : si la première requête est passée mais que la réponse s'est perdue, tu passes l'ordre deux fois.
