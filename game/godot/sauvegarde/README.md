---
prefixe: bib-save-godot
description: Autoload de sauvegarde JSON dans user:// (Godot 4)
langage: gdscript
fichier: sauvegarde.gd
---

# sauvegarde

**À quoi ça sert :** garder la progression du joueur entre deux parties.

## Utilisation

1. Projet → Paramètres du projet → Globals (Autoload) → ajouter `sauvegarde.gd` sous le nom `Sauvegarde`.
2. Dans n'importe quel script :

```gdscript
Sauvegarde.donnees["pieces"] = Sauvegarde.donnees.get("pieces", 0) + 50
Sauvegarde.sauvegarder()
```

## Pièges

- En JSON, les nombres entiers reviennent en `float` : utilise `int(Sauvegarde.donnees["pieces"])`.
- Les `Vector2`/`Color` ne passent pas directement en JSON : stocke-les comme `[x, y]`.
