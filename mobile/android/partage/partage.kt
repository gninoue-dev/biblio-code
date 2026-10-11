import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import java.io.File

/** Ouvre la feuille de partage d'Android avec un texte (WhatsApp, SMS, Gmail…). */
fun Context.partagerTexte(texte: String, titre: String = "Partager") {
    val envoi = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_TEXT, texte)
    }
    startActivity(Intent.createChooser(envoi, titre).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
}

/** Partage un fichier de l'appli (image, PDF…) via le FileProvider déclaré dans le manifeste. */
fun Context.partagerFichier(fichier: File, typeMime: String, texte: String? = null, titre: String = "Partager") {
    val uri = FileProvider.getUriForFile(this, "$packageName.fichiers", fichier)
    val envoi = Intent(Intent.ACTION_SEND).apply {
        type = typeMime
        putExtra(Intent.EXTRA_STREAM, uri)
        texte?.let { putExtra(Intent.EXTRA_TEXT, it) }
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
    }
    startActivity(Intent.createChooser(envoi, titre).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
}

/**
 * Ouvre une discussion WhatsApp avec un message prérempli.
 * numero au format international (ex. "2250707123456") ; null = l'utilisateur choisit le contact.
 * Renvoie false si rien ne peut ouvrir le lien.
 */
fun Context.ouvrirWhatsApp(message: String, numero: String? = null): Boolean {
    val chiffres = numero?.filter { it.isDigit() }.orEmpty()
    val lien = Uri.parse("https://wa.me/$chiffres?text=${Uri.encode(message)}")
    return try {
        startActivity(Intent(Intent.ACTION_VIEW, lien).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        true
    } catch (e: ActivityNotFoundException) {
        false
    }
}
