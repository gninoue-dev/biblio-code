---
prefixe: bib-py-journal
description: Logs console + fichier avec rotation automatique
langage: python
fichier: journal.py
---

# journal

```python
log = configurer_journal("goldbot", fichier="logs/goldbot.log")
log.info("Démarrage, capital %.2f $", capital)
log.warning("Spread élevé : %.1f", spread)
log.exception("Ordre refusé")  # dans un except : ajoute la trace complète
```

Le fichier passe à `goldbot.log.1` quand il atteint 5 Mo, et seuls les 5 derniers sont gardés.
