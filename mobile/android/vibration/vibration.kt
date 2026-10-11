import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.HapticFeedbackConstants
import android.view.View

/** Vibration courte (succès, erreur, fin de minuteur). */
fun Context.vibrer(millisecondes: Long = 40, amplitude: Int = VibrationEffect.DEFAULT_AMPLITUDE) {
    val vibreur: Vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        getSystemService(VibratorManager::class.java).defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    }
    if (!vibreur.hasVibrator()) return
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        vibreur.vibrate(VibrationEffect.createOneShot(millisecondes, amplitude))
    } else {
        @Suppress("DEPRECATION")
        vibreur.vibrate(millisecondes)
    }
}

/** Petit retour tactile sur un bouton, sans permission (respecte les réglages du téléphone). */
fun View.retourTactile() {
    performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY)
}
