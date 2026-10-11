---
prefixe: bib-audio
description: Audio : musique en fondu enchaîné, effets superposés, volumes sauvegardés
langage: gdscript
fichier: gestionnaire_audio.gd
---

# gestionnaire-audio

1. Onglet **Audio** (en bas de l'éditeur) : ajoute les bus `Musique` et `Effets`.
2. Globals → ajouter `gestionnaire_audio.gd` sous le nom `Audio`.

```gdscript
Audio.jouer_musique(preload("res://audio/theme_combat.ogg"))
Audio.jouer_effet(preload("res://audio/coup.wav"))

# Écran Options : un HSlider de 0 à 1
$Curseur.value = Audio.volume(&"Musique")
$Curseur.value_changed.connect(func(v): Audio.regler_volume(&"Musique", v))
```

Les volumes sont retenus d'une partie à l'autre, dans `user://audio.cfg`.

## Pièges

- Pour une musique en boucle : dans l'onglet Import du fichier `.ogg` ou `.mp3`, coche **Loop**.
