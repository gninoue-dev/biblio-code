---
prefixe: bib-py-risque
description: Taille de position selon le risque (%), stop ATR, ratio risque/rendement
langage: python
fichier: gestion_risque.py
---

# gestion-risque

```python
stop = stop_atr(entree=2041.5, atr_valeur=4.2, multiple=1.5)       # 2035.2
lots = taille_position(capital=10_000, risque_pct=1, entree=2041.5, stop=stop,
                       valeur_par_point=100, pas=0.01, taille_min=0.01)  # → 0.15 lot
perte = perte_si_stop(lots, 2041.5, stop, 100)                      # ≈ 94,5 $ (< 100 $ = 1 %)
ratio_risque_rendement(2041.5, stop, objectif=2054)                 # ≈ 2.0
```

La règle la plus importante pour durer : ne jamais risquer plus de 1 à 2 % du capital par position.

## Pièges

- Vérifie la **valeur par point** et le **pas** exacts chez ton courtier : ils changent selon l'instrument et le compte (standard, mini, micro).
