"""Journal (logs) prêt à l'emploi : console + fichier qui tourne (pas de fichier de 10 Go)."""
import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

FORMAT = "%(asctime)s | %(levelname)-7s | %(name)s | %(message)s"


def configurer_journal(nom="app", fichier=None, niveau=logging.INFO, taille_max_mo=5, nombre_fichiers=5):
    journal = logging.getLogger(nom)
    journal.setLevel(niveau)
    if journal.handlers:  # déjà configuré (évite les messages en double)
        return journal
    format_ = logging.Formatter(FORMAT, datefmt="%Y-%m-%d %H:%M:%S")

    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(format_)
    journal.addHandler(console)

    if fichier:
        Path(fichier).parent.mkdir(parents=True, exist_ok=True)
        rotation = RotatingFileHandler(fichier, maxBytes=taille_max_mo * 1024 * 1024, backupCount=nombre_fichiers, encoding="utf-8")
        rotation.setFormatter(format_)
        journal.addHandler(rotation)
    return journal
