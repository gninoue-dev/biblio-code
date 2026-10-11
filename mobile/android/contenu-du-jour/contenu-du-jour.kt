import java.time.LocalDate
import java.time.temporal.ChronoUnit

/** Numéro du jour (1, 2, 3…) depuis une date de départ, d'après le calendrier local du téléphone. */
fun numeroDuJour(debut: LocalDate, aujourdHui: LocalDate = LocalDate.now()): Int =
    ChronoUnit.DAYS.between(debut, aujourdHui).toInt() + 1

/**
 * Élément du jour dans une liste (citation, conseil, défi, lettre…).
 * boucler = true : on recommence au début une fois la liste finie ; false : on reste sur le dernier.
 * Renvoie null avant la date de départ.
 */
fun <T> contenuDuJour(
    liste: List<T>,
    debut: LocalDate,
    aujourdHui: LocalDate = LocalDate.now(),
    boucler: Boolean = true,
): T? {
    val n = numeroDuJour(debut, aujourdHui)
    if (n < 1 || liste.isEmpty()) return null
    val index = n - 1
    return if (boucler) liste[index % liste.size] else liste[minOf(index, liste.size - 1)]
}

/** Nombre de jours avant une date (compte à rebours d'anniversaire, d'examen…). Négatif si passée. */
fun joursAvant(date: LocalDate, aujourdHui: LocalDate = LocalDate.now()): Long =
    ChronoUnit.DAYS.between(aujourdHui, date)
