class_name RecompenseQuotidienne
extends RefCounted
## Récompense de connexion quotidienne avec série (jours consécutifs). Un jour manqué = retour au jour 1.

var recompenses: Array = [50, 75, 100, 150, 200, 300, 500]  # jour 1 à 7, puis on recommence
var dernier_jour := -1  # numéro du dernier jour réclamé
var serie := 0


## Numéro du jour calendaire LOCAL (change à minuit chez le joueur)
static func jour_actuel() -> int:
	var maintenant := Time.get_datetime_dict_from_system()
	return int(Time.get_unix_time_from_datetime_dict(maintenant) / 86400)


func disponible(jour: int = jour_actuel()) -> bool:
	return jour > dernier_jour


func serie_si_reclamee(jour: int = jour_actuel()) -> int:
	return serie + 1 if jour == dernier_jour + 1 else 1


func prochaine_recompense(jour: int = jour_actuel()) -> int:
	return recompenses[(serie_si_reclamee(jour) - 1) % recompenses.size()]


## Renvoie la récompense gagnée (0 si déjà réclamée aujourd'hui).
func reclamer(jour: int = jour_actuel()) -> int:
	if not disponible(jour):
		return 0
	var gain: int = prochaine_recompense(jour)
	serie = serie_si_reclamee(jour)
	dernier_jour = jour
	return gain


func vers_dictionnaire() -> Dictionary:
	return {"dernier_jour": dernier_jour, "serie": serie}


func depuis_dictionnaire(d: Dictionary) -> void:
	dernier_jour = int(d.get("dernier_jour", -1))
	serie = int(d.get("serie", 0))
