---
prefixe: bib-pool
description: Pool d'objets pour projectiles/effets (évite les saccades)
langage: csharp
fichier: PoolObjets.cs
---

# pool-objets

**À quoi ça sert :** sur mobile, créer et détruire des centaines de balles provoque des saccades. Le pool les recycle.

## Utilisation

```csharp
var balle = pool.Prendre(canon.position, canon.rotation);
// quand la balle touche ou sort de l'écran :
pool.Rendre(balle);
```

## Prérequis

- Unity 2021.1 ou plus récent (`UnityEngine.Pool`).
- Ne jamais appeler `Destroy` sur un objet du pool : utiliser `Rendre`.
