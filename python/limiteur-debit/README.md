---
prefixe: bib-py-limiteur
description: Limiteur de débit (N appels par période) pour respecter les quotas d'API
langage: python
fichier: limiteur_debit.py
---

# limiteur-debit

```python
limite = LimiteurDebit(appels=5, periode=1.0)  # quota de l'API : 5 requêtes par seconde

for symbole in symboles:
    with limite:
        cours[symbole] = api.lire(symbole)
```

Ça évite les erreurs `429 Too Many Requests` et les bannissements temporaires d'API.
