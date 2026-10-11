using UnityEngine;

// Hérite de Singleton<MaClasse> pour avoir MaClasse.Instance accessible partout.
public abstract class Singleton<T> : MonoBehaviour where T : MonoBehaviour
{
    public static T Instance { get; private set; }

    [SerializeField] private bool persistantEntreScenes = true;

    protected virtual void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this as T;
        if (persistantEntreScenes) DontDestroyOnLoad(gameObject);
    }

    protected virtual void OnDestroy()
    {
        if (Instance == this) Instance = null;
    }
}
