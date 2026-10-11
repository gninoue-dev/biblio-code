using System.IO;
using UnityEngine;

// Sauvegarde n'importe quelle classe [System.Serializable] en JSON sur l'appareil.
public static class SauvegardeJson
{
    private static string Chemin(string nom) =>
        Path.Combine(Application.persistentDataPath, nom + ".json");

    public static void Sauvegarder<T>(T donnees, string nom = "sauvegarde")
    {
        File.WriteAllText(Chemin(nom), JsonUtility.ToJson(donnees, true));
    }

    public static T Charger<T>(string nom = "sauvegarde") where T : new()
    {
        var chemin = Chemin(nom);
        if (!File.Exists(chemin)) return new T();
        return JsonUtility.FromJson<T>(File.ReadAllText(chemin));
    }
}
