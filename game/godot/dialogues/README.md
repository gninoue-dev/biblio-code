---
prefixe: bib-dialogue
description: Boîte de dialogue lettre par lettre, répliques en JSON (mode histoire)
langage: gdscript
fichier: dialogues.gd
---

# dialogues

**Scène :** un `PanelContainer` ou un `Control` avec ce script, et deux enfants : un `Label` nommé **Nom** et un `RichTextLabel` nommé **Texte** (le BBCode marche : `[color=gold]pouvoir[/color]`).

`res://donnees/dialogues.json` :

```json
{
  "intro": [
    { "nom": "Nash", "texte": "Attends… je suis où, là ?" },
    { "nom": "Voix", "texte": "Dans l'[color=gold]Arène des Légendes[/color]." }
  ]
}
```

```gdscript
$Dialogue.lancer($Dialogue.charger("res://donnees/dialogues.json", "intro"))
await $Dialogue.termine
lancer_combat()
```

Garder les textes dans un JSON permet de les corriger ou de les traduire sans toucher au code, et de prévoir le doublage (ajoute `"voix": "res://voix/intro_01.ogg"` et joue-le dans `replique_affichee`).
