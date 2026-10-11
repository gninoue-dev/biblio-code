import android.app.Activity
import android.hardware.biometrics.BiometricManager.Authenticators
import android.hardware.biometrics.BiometricPrompt
import android.os.Build
import android.os.CancellationSignal
import androidx.annotation.RequiresApi

/**
 * Demande l'empreinte / le visage (ou le code du téléphone sur Android 11+) avant une action sensible.
 * Renvoie un CancellationSignal pour annuler la demande (ex. dans onPause).
 */
@RequiresApi(Build.VERSION_CODES.P)
fun Activity.demanderBiometrie(
    titre: String,
    sousTitre: String? = null,
    surSucces: () -> Unit,
    surEchec: (message: String) -> Unit,
): CancellationSignal {
    val annulation = CancellationSignal()
    val builder = BiometricPrompt.Builder(this).setTitle(titre)
    sousTitre?.let { builder.setSubtitle(it) }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        // Empreinte forte OU code/schéma du téléphone (pas de bouton « Annuler » dans ce cas)
        builder.setAllowedAuthenticators(Authenticators.BIOMETRIC_STRONG or Authenticators.DEVICE_CREDENTIAL)
    } else {
        builder.setNegativeButton("Annuler", mainExecutor) { _, _ -> surEchec("Annulé") }
    }
    builder.build().authenticate(annulation, mainExecutor, object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(resultat: BiometricPrompt.AuthenticationResult) = surSucces()
        override fun onAuthenticationError(code: Int, message: CharSequence) = surEchec(message.toString())
    })
    return annulation
}
