---
prefixe: bib-py-env
description: Lire un fichier .env et des variables typées (sans dépendance)
langage: python
fichier: config_env.py
---

# config-env

`.env` (à ajouter dans `.gitignore` !) :

```
JETON_TELEGRAM="123:ABC"
RISQUE_PCT=1.0
MODE_DEMO=oui   # vrai/faux/oui/non/1/0
```

```python
charger_env()
jeton = lire_env("JETON_TELEGRAM", obligatoire=True)
risque = lire_env("RISQUE_PCT", 1.0, float)
demo = lire_env("MODE_DEMO", True, bool)
```

## Pièges

- **Ne mets jamais le `.env` sur GitHub.** Fournis plutôt un `.env.exemple` avec des valeurs vides.
