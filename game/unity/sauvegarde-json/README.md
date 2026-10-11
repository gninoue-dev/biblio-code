---
prefixe: bib-save-unity
description: Sauvegarde/chargement JSON dans persistentDataPath
langage: csharp
fichier: SauvegardeJson.cs
---

# sauvegarde-json

**À quoi ça sert :** sauvegarder la progression du joueur (niveau, pièces, skins débloqués).

## Utilisation

```csharp
[System.Serializable]
public class Progression { public int niveau = 1; public int pieces; }

var p = SauvegardeJson.Charger<Progression>();
p.pieces += 50;
SauvegardeJson.Sauvegarder(p);
```

## Pièges

- `JsonUtility` ne gère pas les `Dictionary` ni les propriétés : uniquement les champs publics ou `[SerializeField]`.
