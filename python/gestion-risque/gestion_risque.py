"""Taille de position selon le risque accepté : la base de toute stratégie de trading qui dure."""
import math


def taille_position(capital, risque_pct, entree, stop, valeur_par_point=1.0, pas=0.01, taille_min=0.0, taille_max=None):
    """
    Taille telle que, si le stop est touché, la perte = risque_pct % du capital.
    valeur_par_point : gain/perte pour un mouvement de 1,0 du prix avec une taille de 1
                       (or XAUUSD : 1 lot = 100 onces → 100 $ par dollar de mouvement).
    pas : arrondi inférieur imposé par le courtier (0,01 lot).
    Renvoie 0 si la taille minimale ferait dépasser le risque.
    """
    distance = abs(entree - stop)
    if distance == 0 or capital <= 0 or risque_pct <= 0:
        return 0.0
    risque_argent = capital * risque_pct / 100
    taille = risque_argent / (distance * valeur_par_point)
    taille = math.floor(taille / pas + 1e-9) * pas
    if taille_max is not None:
        taille = min(taille, taille_max)
    if taille < taille_min or taille <= 0:
        return 0.0
    decimales = max(0, -int(math.floor(math.log10(pas)))) if pas < 1 else 0
    return round(taille, decimales)


def perte_si_stop(taille, entree, stop, valeur_par_point=1.0):
    return abs(entree - stop) * valeur_par_point * taille


def ratio_risque_rendement(entree, stop, objectif):
    """2.0 = on vise à gagner deux fois ce qu'on risque."""
    risque = abs(entree - stop)
    return abs(objectif - entree) / risque if risque else 0.0


def stop_atr(entree, atr_valeur, multiple=1.5, achat=True):
    """Stop placé à `multiple` × ATR de l'entrée (s'adapte à la volatilité du marché)."""
    return entree - multiple * atr_valeur if achat else entree + multiple * atr_valeur
