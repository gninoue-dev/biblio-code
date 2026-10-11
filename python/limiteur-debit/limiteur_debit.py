"""Limite le nombre d'appels sur une période (respecter les quotas d'une API, éviter le bannissement)."""
import threading
import time
from collections import deque


class LimiteurDebit:
    """LimiteurDebit(10, 1.0) : au plus 10 appels par seconde (fenêtre glissante, compatible threads)."""

    def __init__(self, appels, periode, horloge=time.monotonic, dormir=time.sleep):
        self.appels = appels
        self.periode = periode
        self._horloge = horloge
        self._dormir = dormir
        self._instants = deque()
        self._verrou = threading.Lock()

    def acquerir(self):
        """Attend si nécessaire, puis réserve un appel. Renvoie le temps attendu (secondes)."""
        attendu = 0.0
        while True:
            with self._verrou:
                maintenant = self._horloge()
                while self._instants and maintenant - self._instants[0] >= self.periode:
                    self._instants.popleft()
                if len(self._instants) < self.appels:
                    self._instants.append(maintenant)
                    return attendu
                pause = self.periode - (maintenant - self._instants[0])
            self._dormir(pause)
            attendu += pause

    def __enter__(self):
        self.acquerir()
        return self

    def __exit__(self, *erreur):
        return False
