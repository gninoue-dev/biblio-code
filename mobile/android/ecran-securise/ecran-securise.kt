import android.app.Activity
import android.view.WindowManager

/**
 * Bloque les captures d'écran, l'enregistrement d'écran, et masque l'aperçu dans les applis récentes.
 * À activer sur les écrans sensibles (solde, codes, données personnelles).
 */
fun Activity.protegerEcran(actif: Boolean = true) {
    if (actif) {
        window.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
    } else {
        window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }
}
