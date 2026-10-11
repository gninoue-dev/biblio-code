using UnityEngine;
using UnityEngine.Pool;

// Réutilise des objets (balles, effets, ennemis) au lieu de les créer/détruire sans cesse.
public class PoolObjets : MonoBehaviour
{
    [SerializeField] private GameObject prefab;
    [SerializeField] private int tailleInitiale = 20;
    [SerializeField] private int tailleMax = 100;

    private ObjectPool<GameObject> pool;

    private void Awake()
    {
        pool = new ObjectPool<GameObject>(
            createFunc: () => Instantiate(prefab, transform),
            actionOnGet: obj => obj.SetActive(true),
            actionOnRelease: obj => obj.SetActive(false),
            actionOnDestroy: obj => Destroy(obj),
            collectionCheck: false,
            defaultCapacity: tailleInitiale,
            maxSize: tailleMax);
    }

    public GameObject Prendre(Vector3 position, Quaternion rotation)
    {
        var obj = pool.Get();
        obj.transform.SetPositionAndRotation(position, rotation);
        return obj;
    }

    public void Rendre(GameObject obj) => pool.Release(obj);
}
