---
prefixe: bib-py-indicateurs
description: Indicateurs techniques : SMA, EMA, RSI, ATR, Bollinger, MACD (sans dépendance)
langage: python
fichier: indicateurs.py
---

# indicateurs

```python
clotures = [b["close"] for b in bougies]
r = rsi(clotures, 14)[-1]
moyenne_50, moyenne_200 = sma(clotures, 50)[-1], sma(clotures, 200)[-1]
volatilite = atr(hauts, bas, clotures, 14)[-1]
milieu, haut, bas_ = bandes_bollinger(clotures)
```

Les calculs suivent les définitions standard (RSI et ATR de Wilder). Ils sont vérifiés dans les tests contre l'exemple de référence de StockCharts.

## Pièges

- Ces indicateurs décrivent le **passé**. Aucun ne garantit un gain : teste toujours une stratégie sur des données historiques (backtest), puis en démo, avant d'y mettre de l'argent.
