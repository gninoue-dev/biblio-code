class_name Economie
extends RefCounted
## Portefeuille du joueur (pièces, gemmes…) et objets possédés (skins, personnages).
## Impossible d'avoir un solde négatif ou d'acheter deux fois le même objet.

signal solde_change(monnaie: StringName, solde: int)
signal objet_obtenu(id: StringName)

var _soldes := {}
var _possedes := {}


func solde(monnaie: StringName) -> int:
	return int(_soldes.get(monnaie, 0))


func crediter(monnaie: StringName, montant: int) -> void:
	if montant <= 0:
		return
	_soldes[monnaie] = solde(monnaie) + montant
	solde_change.emit(monnaie, solde(monnaie))


func peut_payer(monnaie: StringName, prix: int) -> bool:
	return prix >= 0 and solde(monnaie) >= prix


func debiter(monnaie: StringName, prix: int) -> bool:
	if not peut_payer(monnaie, prix):
		return false
	_soldes[monnaie] = solde(monnaie) - prix
	solde_change.emit(monnaie, solde(monnaie))
	return true


func possede(id: StringName) -> bool:
	return _possedes.has(id)


## Achat avec la monnaie du jeu. Renvoie false si déjà possédé ou pas assez d'argent.
func acheter(id: StringName, monnaie: StringName, prix: int) -> bool:
	if possede(id) or not debiter(monnaie, prix):
		return false
	donner(id)
	return true


## Objet offert (récompense, achat réel validé par le magasin)
func donner(id: StringName) -> void:
	if possede(id):
		return
	_possedes[id] = true
	objet_obtenu.emit(id)


func vers_dictionnaire() -> Dictionary:
	return {"soldes": _soldes.duplicate(), "possedes": _possedes.keys().map(func(k): return String(k))}


func depuis_dictionnaire(d: Dictionary) -> void:
	_soldes.clear()
	for monnaie in d.get("soldes", {}):
		_soldes[StringName(monnaie)] = int(d["soldes"][monnaie])
	_possedes.clear()
	for id in d.get("possedes", []):
		_possedes[StringName(id)] = true
