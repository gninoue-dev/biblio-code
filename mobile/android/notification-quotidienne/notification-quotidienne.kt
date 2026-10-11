import android.content.Context
import androidx.work.Data
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequest
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.time.Duration
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

/** Tâche exécutée une fois par jour par WorkManager (survit au redémarrage du téléphone). */
class RappelQuotidien(context: Context, parametres: WorkerParameters) : Worker(context, parametres) {
    override fun doWork(): Result {
        Notifications.afficher(
            applicationContext,
            canalId = inputData.getString("canal") ?: "rappels",
            id = 1001,
            titre = inputData.getString("titre") ?: "",
            texte = inputData.getString("texte") ?: "",
            icone = inputData.getInt("icone", android.R.drawable.ic_dialog_info),
        )
        return Result.success()
    }
}

object RappelsQuotidiens {
    /** Programme un rappel chaque jour vers heure:minute. Rappeler la fonction remplace l'ancien réglage. */
    fun programmer(
        context: Context,
        heure: Int,
        minute: Int = 0,
        titre: String,
        texte: String,
        icone: Int,
        canal: String = "rappels",
        nom: String = "rappel_quotidien",
    ) {
        val maintenant = LocalDateTime.now()
        var prochain = maintenant.toLocalDate().atTime(heure, minute)
        if (!prochain.isAfter(maintenant)) prochain = prochain.plusDays(1)

        val donnees = Data.Builder()
            .putString("titre", titre)
            .putString("texte", texte)
            .putString("canal", canal)
            .putInt("icone", icone)
            .build()

        val requete = PeriodicWorkRequest.Builder(RappelQuotidien::class.java, 1, TimeUnit.DAYS)
            .setInitialDelay(Duration.between(maintenant, prochain).toMillis(), TimeUnit.MILLISECONDS)
            .setInputData(donnees)
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(nom, ExistingPeriodicWorkPolicy.UPDATE, requete)
    }

    fun annuler(context: Context, nom: String = "rappel_quotidien") {
        WorkManager.getInstance(context).cancelUniqueWork(nom)
    }
}
