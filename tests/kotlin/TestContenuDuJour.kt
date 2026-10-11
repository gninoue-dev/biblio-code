import java.time.LocalDate

fun verifier(condition: Boolean, message: String) {
    if (!condition) throw AssertionError(message)
}

fun main() {
    val debut = LocalDate.of(2026, 7, 15)
    verifier(numeroDuJour(debut, debut) == 1, "jour 1 le premier jour")
    verifier(numeroDuJour(debut, LocalDate.of(2027, 7, 15)) == 366, "jour 366 un an après (2027 non bissextile)")
    val liste = listOf("a", "b", "c")
    verifier(contenuDuJour(liste, debut, debut) == "a", "premier élément")
    verifier(contenuDuJour(liste, debut, debut.plusDays(4)) == "b", "boucle")
    verifier(contenuDuJour(liste, debut, debut.plusDays(10), boucler = false) == "c", "reste au dernier")
    verifier(contenuDuJour(liste, debut, debut.minusDays(1)) == null, "rien avant le début")
    verifier(joursAvant(LocalDate.of(2027, 7, 15), LocalDate.of(2026, 10, 11)) == 277L, "J-277")
    println("Kotlin : contenu-du-jour OK (7 vérifications)")
}
