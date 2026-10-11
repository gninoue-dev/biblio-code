class_name MachineEtats
extends RefCounted
## Machine à états simple : chaque état a des fonctions entrer / mettre à jour / sortir.

signal etat_change(ancien: StringName, nouveau: StringName)

var etat: StringName = &""
var etat_precedent: StringName = &""
var temps_dans_etat := 0.0
var _etats := {}


func ajouter(nom: StringName, entrer := Callable(), mettre_a_jour := Callable(), sortir := Callable()) -> MachineEtats:
	_etats[nom] = {"entrer": entrer, "maj": mettre_a_jour, "sortir": sortir}
	return self


func changer(nouveau: StringName) -> void:
	assert(_etats.has(nouveau), "État inconnu : %s" % nouveau)
	if nouveau == etat:
		return
	if _etats.has(etat) and _etats[etat]["sortir"].is_valid():
		_etats[etat]["sortir"].call()
	etat_precedent = etat
	etat = nouveau
	temps_dans_etat = 0.0
	if _etats[nouveau]["entrer"].is_valid():
		_etats[nouveau]["entrer"].call()
	etat_change.emit(etat_precedent, etat)


func mettre_a_jour(delta: float) -> void:
	temps_dans_etat += delta
	if _etats.has(etat) and _etats[etat]["maj"].is_valid():
		_etats[etat]["maj"].call(delta)


func est(nom: StringName) -> bool:
	return etat == nom
