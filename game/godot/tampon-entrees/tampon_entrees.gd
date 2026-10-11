class_name TamponEntrees
extends RefCounted
## Garde un appui en mémoire quelques instants : une action pressée un peu trop tôt n'est pas perdue.
## Indispensable dans un jeu d'action ou de combat pour des commandes « réactives ».

var duree := 0.15
var _appuis := {}  # action -> temps restant


func enregistrer(action: StringName) -> void:
	_appuis[action] = duree


func mettre_a_jour(delta: float) -> void:
	for action in _appuis.keys():
		_appuis[action] -= delta
		if _appuis[action] <= 0.0:
			_appuis.erase(action)


## Vrai si l'action a été pressée récemment ; l'appui est alors consommé.
func consommer(action: StringName) -> bool:
	if _appuis.has(action):
		_appuis.erase(action)
		return true
	return false


func contient(action: StringName) -> bool:
	return _appuis.has(action)


func vider() -> void:
	_appuis.clear()
