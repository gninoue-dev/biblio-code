import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

object Notifications {
    /** À appeler au démarrage de l'appli (Application.onCreate). Sans canal, rien ne s'affiche sur Android 8+. */
    fun creerCanal(
        context: Context,
        id: String,
        nom: String,
        description: String = "",
        importance: Int = NotificationManager.IMPORTANCE_DEFAULT,
    ) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val canal = NotificationChannel(id, nom, importance).apply { this.description = description }
        context.getSystemService(NotificationManager::class.java).createNotificationChannel(canal)
    }

    /** Affiche une notification ; un appui ouvre `activite`. Renvoie false si la permission manque. */
    fun afficher(
        context: Context,
        canalId: String,
        id: Int,
        titre: String,
        texte: String,
        icone: Int,
        activite: Class<*>? = null,
    ): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) return false

        val builder = NotificationCompat.Builder(context, canalId)
            .setSmallIcon(icone)
            .setContentTitle(titre)
            .setContentText(texte)
            .setStyle(NotificationCompat.BigTextStyle().bigText(texte))
            .setAutoCancel(true)

        if (activite != null) {
            val intent = Intent(context, activite).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            builder.setContentIntent(
                PendingIntent.getActivity(context, id, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
            )
        }
        NotificationManagerCompat.from(context).notify(id, builder.build())
        return true
    }
}
