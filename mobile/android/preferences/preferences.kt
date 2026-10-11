import android.content.Context
import androidx.core.content.edit

// Petites données persistantes (réglages, pseudo…) avec des propriétés typées.
class Preferences(context: Context) {
    private val prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)

    var premierLancement: Boolean
        get() = prefs.getBoolean("premier_lancement", true)
        set(valeur) = prefs.edit { putBoolean("premier_lancement", valeur) }

    var pseudo: String?
        get() = prefs.getString("pseudo", null)
        set(valeur) = prefs.edit { putString("pseudo", valeur) }
}
