"""Indicateurs techniques classiques, sans dépendance. Les listes renvoyées ont la même longueur
que l'entrée : None tant qu'il n'y a pas assez de données (période de chauffe)."""


def sma(valeurs, periode):
    """Moyenne mobile simple."""
    resultat, somme = [], 0.0
    for i, v in enumerate(valeurs):
        somme += v
        if i >= periode:
            somme -= valeurs[i - periode]
        resultat.append(somme / periode if i >= periode - 1 else None)
    return resultat


def ema(valeurs, periode):
    """Moyenne mobile exponentielle (initialisée par la moyenne simple des `periode` premières valeurs)."""
    resultat = [None] * len(valeurs)
    if len(valeurs) < periode:
        return resultat
    alpha = 2 / (periode + 1)
    courant = sum(valeurs[:periode]) / periode
    resultat[periode - 1] = courant
    for i in range(periode, len(valeurs)):
        courant = alpha * valeurs[i] + (1 - alpha) * courant
        resultat[i] = courant
    return resultat


def rsi(valeurs, periode=14):
    """RSI de Wilder (0 à 100). > 70 : suracheté, < 30 : survendu."""
    resultat = [None] * len(valeurs)
    if len(valeurs) <= periode:
        return resultat
    variations = [valeurs[i] - valeurs[i - 1] for i in range(1, len(valeurs))]
    gain = sum(max(v, 0) for v in variations[:periode]) / periode
    perte = sum(max(-v, 0) for v in variations[:periode]) / periode

    def valeur_rsi(g, p):
        if p == 0:
            return 100.0 if g > 0 else 50.0
        return 100 - 100 / (1 + g / p)

    resultat[periode] = valeur_rsi(gain, perte)
    for i in range(periode, len(variations)):
        gain = (gain * (periode - 1) + max(variations[i], 0)) / periode
        perte = (perte * (periode - 1) + max(-variations[i], 0)) / periode
        resultat[i + 1] = valeur_rsi(gain, perte)
    return resultat


def atr(hauts, bas, cloture, periode=14):
    """Average True Range de Wilder : volatilité moyenne, utile pour placer un stop."""
    vrais = []
    for i in range(len(cloture)):
        if i == 0:
            vrais.append(hauts[0] - bas[0])
        else:
            vrais.append(max(hauts[i] - bas[i], abs(hauts[i] - cloture[i - 1]), abs(bas[i] - cloture[i - 1])))
    resultat = [None] * len(cloture)
    if len(cloture) < periode:
        return resultat
    courant = sum(vrais[:periode]) / periode
    resultat[periode - 1] = courant
    for i in range(periode, len(cloture)):
        courant = (courant * (periode - 1) + vrais[i]) / periode
        resultat[i] = courant
    return resultat


def bandes_bollinger(valeurs, periode=20, ecarts=2.0):
    """Renvoie (milieu, haut, bas). Écart-type de population, comme sur la plupart des plateformes."""
    milieu = sma(valeurs, periode)
    haut, bas = [], []
    for i, m in enumerate(milieu):
        if m is None:
            haut.append(None)
            bas.append(None)
            continue
        fenetre = valeurs[i - periode + 1 : i + 1]
        ecart_type = (sum((v - m) ** 2 for v in fenetre) / periode) ** 0.5
        haut.append(m + ecarts * ecart_type)
        bas.append(m - ecarts * ecart_type)
    return milieu, haut, bas


def macd(valeurs, rapide=12, lente=26, signal=9):
    """Renvoie (macd, signal, histogramme)."""
    ema_rapide, ema_lente = ema(valeurs, rapide), ema(valeurs, lente)
    ligne = [r - l if r is not None and l is not None else None for r, l in zip(ema_rapide, ema_lente)]
    debut = next((i for i, v in enumerate(ligne) if v is not None), len(ligne))
    ligne_signal = [None] * debut + ema(ligne[debut:], signal)
    histogramme = [m - s if m is not None and s is not None else None for m, s in zip(ligne, ligne_signal)]
    return ligne, ligne_signal, histogramme
