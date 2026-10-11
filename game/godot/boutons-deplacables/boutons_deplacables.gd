extends Control
## Rend les boutons tactiles enfants déplaçables (mode édition des contrôles) et mémorise leur position.

signal disposition_changee

@export var fichier := "user://disposition_boutons.cfg"

var mode_edition := false
var _deplace: Control = null
var _decalage := Vector2.ZERO
var _defauts := {}


func _ready() -> void:
	for bouton in boutons():
		_defauts[bouton.name] = bouton.position
	charger()


func boutons() -> Array[Control]:
	var liste: Array[Control] = []
	for enfant in get_children():
		if enfant is Control:
			liste.append(enfant)
	return liste


func _input(event: InputEvent) -> void:
	if not mode_edition:
		return
	var appui: bool = event is InputEventScreenTouch or (event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT)
	if appui and event.pressed:
		for bouton in boutons():
			if bouton.get_global_rect().has_point(event.position):
				_deplace = bouton
				_decalage = bouton.global_position - event.position
				get_viewport().set_input_as_handled()
				return
	elif appui and not event.pressed and _deplace:
		_deplace = null
		sauvegarder()
		disposition_changee.emit()
		get_viewport().set_input_as_handled()
	elif _deplace and (event is InputEventScreenDrag or event is InputEventMouseMotion):
		var ecran := get_viewport_rect().size
		var limite := (ecran - _deplace.size * _deplace.scale).max(Vector2.ZERO)
		_deplace.global_position = (event.position + _decalage).clamp(Vector2.ZERO, limite)
		get_viewport().set_input_as_handled()


func sauvegarder() -> void:
	var config := ConfigFile.new()
	for bouton in boutons():
		config.set_value("positions", bouton.name, bouton.position)
	config.save(fichier)


func charger() -> void:
	var config := ConfigFile.new()
	if config.load(fichier) != OK:
		return
	for bouton in boutons():
		if config.has_section_key("positions", bouton.name):
			bouton.position = config.get_value("positions", bouton.name)


func reinitialiser() -> void:
	for bouton in boutons():
		if _defauts.has(bouton.name):
			bouton.position = _defauts[bouton.name]
	sauvegarder()
	disposition_changee.emit()
