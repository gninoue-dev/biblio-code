"""Décorateur : réessaie une fonction qui échoue (API instable, réseau), avec attente croissante."""
import asyncio
import functools
import logging
import random
import time

journal = logging.getLogger(__name__)


def reessayer(essais=3, attente=1.0, facteur=2.0, attente_max=30.0, exceptions=(Exception,), alea=True):
    """Attentes : 1 s, 2 s, 4 s… (+ un peu d'aléatoire pour ne pas frapper le serveur tous en même temps)."""

    def calculer_attente(numero):
        duree = min(attente * facteur ** (numero - 1), attente_max)
        return duree * random.uniform(0.5, 1.0) if alea else duree

    def decorateur(fonction):
        if asyncio.iscoroutinefunction(fonction):
            @functools.wraps(fonction)
            async def enveloppe_async(*args, **kwargs):
                for numero in range(1, essais + 1):
                    try:
                        return await fonction(*args, **kwargs)
                    except exceptions as erreur:
                        if numero == essais:
                            raise
                        duree = calculer_attente(numero)
                        journal.warning("%s a échoué (%s), essai %d/%d dans %.1f s", fonction.__name__, erreur, numero + 1, essais, duree)
                        await asyncio.sleep(duree)
            return enveloppe_async

        @functools.wraps(fonction)
        def enveloppe(*args, **kwargs):
            for numero in range(1, essais + 1):
                try:
                    return fonction(*args, **kwargs)
                except exceptions as erreur:
                    if numero == essais:
                        raise
                    duree = calculer_attente(numero)
                    journal.warning("%s a échoué (%s), essai %d/%d dans %.1f s", fonction.__name__, erreur, numero + 1, essais, duree)
                    time.sleep(duree)
        return enveloppe

    return decorateur
