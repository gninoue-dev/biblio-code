"""Envoie un message Telegram (alertes de bot, rapports) via l'API officielle, sans dépendance."""
import json
import urllib.error
import urllib.parse
import urllib.request

LIMITE = 4096  # caractères max par message Telegram


def decouper(texte, limite=LIMITE):
    """Coupe un long texte en morceaux, de préférence à la fin d'une ligne."""
    morceaux = []
    while len(texte) > limite:
        coupure = texte.rfind("\n", 0, limite)
        if coupure <= 0:
            coupure = limite
        morceaux.append(texte[:coupure])
        texte = texte[coupure:].lstrip("\n")
    if texte:
        morceaux.append(texte)
    return morceaux


def envoyer_telegram(texte, jeton, chat_id, html=True, silencieux=False, delai=10):
    """Renvoie True si tout est parti. Ne lève pas d'exception : une alerte ne doit pas faire planter le bot."""
    url = f"https://api.telegram.org/bot{jeton}/sendMessage"
    for morceau in decouper(texte):
        donnees = {"chat_id": chat_id, "text": morceau, "disable_notification": silencieux}
        if html:
            donnees["parse_mode"] = "HTML"
        requete = urllib.request.Request(url, data=urllib.parse.urlencode(donnees).encode(), method="POST")
        try:
            with urllib.request.urlopen(requete, timeout=delai) as reponse:
                if not json.load(reponse).get("ok"):
                    return False
        except (urllib.error.URLError, TimeoutError, ValueError):
            return False
    return True
