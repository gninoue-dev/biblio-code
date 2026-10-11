---
prefixe: bib-py-telegram
description: Alertes Telegram (bot, rapports) sans dépendance, messages longs découpés
langage: python
fichier: notification_telegram.py
---

# notification-telegram

1. Dans Telegram, parle à **@BotFather** et fais `/newbot` : tu obtiens le **jeton**.
2. Envoie un message à ton bot, puis ouvre `https://api.telegram.org/bot<JETON>/getUpdates` : le `chat.id` affiché est ton **chat_id**.

```python
envoyer_telegram("🟢 <b>Achat XAUUSD</b> à 2 041,50 — stop 2 035", jeton, chat_id)
envoyer_telegram(rapport_journalier, jeton, chat_id, silencieux=True)
```

## Pièges

- Avec `html=True`, échappe les `<`, `>` et `&` venant de données externes (`html.escape(texte)`).
- Garde le jeton dans `.env` (module `config-env`), jamais dans le code.
