extends Control
## Boîte de dialogue (mode histoire, tutoriel, PNJ) : le texte s'écrit lettre par lettre.
## Un appui affiche tout le texte, l'appui suivant passe à la réplique suivante.
## Enfants attendus : un Label « Nom » et un RichTextLabel « Texte ».

signal replique_affichee(index: int)
signal termine

@export var vitesse := 45.0  # caractères par seconde

var _repliques: Array = []
var _index := 0
var _ecrit := 0.0

@onready var _nom: Label = $Nom
@onready var _texte: RichTextLabel = $Texte


## repliques : [{ "nom": "Nash", "texte": "On est où là ?" }, ...]
func lancer(repliques: Array) -> void:
	_repliques = repliques
	_index = 0
	show()
	_afficher()


## Lit une liste de répliques dans un fichier JSON : { "intro": [ {...}, ... ], "fin": [...] }
static func charger(chemin: String, cle: String) -> Array:
	var contenu = JSON.parse_string(FileAccess.get_file_as_string(chemin))
	if contenu is Dictionary and contenu.get(cle) is Array:
		return contenu[cle]
	push_error("Dialogue « %s » introuvable dans %s" % [cle, chemin])
	return []


func en_train_d_ecrire() -> bool:
	# -1 signifie « tout le texte est visible »
	return _texte.visible_characters != -1 and _texte.visible_characters < _texte.get_total_character_count()


func avancer() -> void:
	if _repliques.is_empty():
		return
	if en_train_d_ecrire():
		_texte.visible_characters = -1  # tout afficher d'un coup
		return
	_index += 1
	if _index >= _repliques.size():
		_repliques = []
		hide()
		termine.emit()
	else:
		_afficher()


func _afficher() -> void:
	var replique: Dictionary = _repliques[_index]
	_nom.text = replique.get("nom", "")
	_texte.text = replique.get("texte", "")
	_texte.visible_characters = 0
	_ecrit = 0.0
	replique_affichee.emit(_index)


func _process(delta: float) -> void:
	if visible and not _repliques.is_empty() and en_train_d_ecrire():
		_ecrit += delta * vitesse
		_texte.visible_characters = int(_ecrit)


func _gui_input(event: InputEvent) -> void:
	if (event is InputEventMouseButton or event is InputEventScreenTouch) and event.pressed:
		avancer()
		accept_event()


func _unhandled_input(event: InputEvent) -> void:
	if visible and event.is_action_pressed("ui_accept"):
		avancer()
		get_viewport().set_input_as_handled()
