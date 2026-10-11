---
prefixe: bib-singleton
description: Singleton générique pour managers (GameManager, AudioManager…)
langage: csharp
fichier: Singleton.cs
---

# singleton

**À quoi ça sert :** un seul GameManager/AudioManager, accessible depuis n'importe quel script.

## Utilisation

```csharp
public class GameManager : Singleton<GameManager> { public int score; }
// ailleurs :
GameManager.Instance.score += 10;
```

## Pièges

- Si tu redéfinis `Awake`, appelle `base.Awake()`.
- L'objet doit être à la racine de la scène pour que `DontDestroyOnLoad` marche.
