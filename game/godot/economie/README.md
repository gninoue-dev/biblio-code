---
prefixe: bib-economie
description: Monnaies du jeu + objets possédés (skins) pour un jeu free-to-play
langage: gdscript
fichier: economie.gd
---

# economie

```gdscript
var eco := Economie.new()
eco.solde_change.connect(func(m, s): $HUD/Pieces.text = str(s))

eco.crediter(&"pieces", 250)                       # fin de combat
if eco.acheter(&"skin_nanan_or", &"pieces", 1000): # boutique
	afficher_skin()
else:
	$Boutique.afficher("Pas assez de pièces")

# Sauvegarde (avec le module sauvegarde-versionnee)
Sauvegarde.donnees["economie"] = eco.vers_dictionnaire()
eco.depuis_dictionnaire(Sauvegarde.donnees.get("economie", {}))
```

## Pièges

- Pour un **achat réel** (Google Play Billing), n'appelle `donner()` qu'après la confirmation de Google, et vérifie le reçu côté serveur si tu en as un.
- Une sauvegarde locale peut être modifiée par un joueur rooté. Pour un classement ou un jeu en ligne, l'économie doit vivre sur un serveur.
