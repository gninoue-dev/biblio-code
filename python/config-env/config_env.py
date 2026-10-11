"""Lit un fichier .env (clés API, jetons) sans dépendance, et convertit les valeurs en bons types."""
import os
from pathlib import Path


def charger_env(chemin=".env", ecraser=False):
    """Charge KEY=valeur dans os.environ. Gère les commentaires, les guillemets et « export ». Renvoie les clés lues."""
    fichier = Path(chemin)
    if not fichier.exists():
        return {}
    lues = {}
    for ligne in fichier.read_text(encoding="utf-8").splitlines():
        ligne = ligne.strip()
        if not ligne or ligne.startswith("#") or "=" not in ligne:
            continue
        cle, valeur = ligne.removeprefix("export ").split("=", 1)
        cle, valeur = cle.strip(), valeur.strip()
        if len(valeur) >= 2 and valeur[0] == valeur[-1] and valeur[0] in "\"'":
            valeur = valeur[1:-1]
        elif " #" in valeur:
            valeur = valeur.split(" #", 1)[0].rstrip()
        lues[cle] = valeur
        if ecraser or cle not in os.environ:
            os.environ[cle] = valeur
    return lues


VRAI = {"1", "true", "vrai", "oui", "yes", "on"}
FAUX = {"0", "false", "faux", "non", "no", "off", ""}


def lire_env(nom, defaut=None, type_=str, obligatoire=False):
    """lire_env("RISQUE_PCT", 1.0, float) ; lire_env("MODE_DEMO", True, bool) ; lire_env("JETON", obligatoire=True)"""
    valeur = os.environ.get(nom)
    if valeur is None:
        if obligatoire:
            raise RuntimeError(f"Variable d'environnement manquante : {nom} (ajoute-la dans .env)")
        return defaut
    if type_ is bool:
        if valeur.strip().lower() in VRAI:
            return True
        if valeur.strip().lower() in FAUX:
            return False
        raise ValueError(f"{nom} doit être vrai/faux, pas « {valeur} »")
    try:
        return type_(valeur)
    except ValueError as erreur:
        raise ValueError(f"{nom} : « {valeur} » n'est pas un {type_.__name__}") from erreur
