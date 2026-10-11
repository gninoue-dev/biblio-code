extends Node
## Autoload : sauvegarde JSON avec numéro de version, migrations automatiques,
## écriture sûre (fichier temporaire) et copie de secours (.bak) en cas de fichier abîmé.

const VERSION := 3

var chemin := "user://sauvegarde.json"
var donnees: Dictionary = {}


func _ready() -> void:
	charger()


## Valeurs d'une partie neuve. Ajoute ici chaque nouveau champ.
func _defaut() -> Dictionary:
	return {"version": VERSION, "pieces": 0, "skins": [], "options": {"vibrations": true}}


## Une fonction par changement de format : _migrer_1_vers_2, _migrer_2_vers_3…
## Ne supprime jamais une migration : un joueur peut sauter plusieurs mises à jour.
func _migrer_1_vers_2(d: Dictionary) -> void:
	d["skins"] = d.get("skins_debloques", [])
	d.erase("skins_debloques")


func _migrer_2_vers_3(d: Dictionary) -> void:
	d["options"] = {"vibrations": d.get("vibrations", true)}
	d.erase("vibrations")


func charger() -> void:
	donnees = _lire(chemin)
	if donnees.is_empty():
		donnees = _lire(chemin + ".bak")
	if donnees.is_empty():
		donnees = _defaut()
		return
	var version := int(donnees.get("version", 1))
	while version < VERSION:
		var methode := "_migrer_%d_vers_%d" % [version, version + 1]
		if has_method(methode):
			call(methode, donnees)
		version += 1
	donnees["version"] = VERSION
	var defaut := _defaut()
	for cle in defaut:
		if not donnees.has(cle):
			donnees[cle] = defaut[cle]


func sauvegarder() -> bool:
	var temporaire := chemin + ".tmp"
	var fichier := FileAccess.open(temporaire, FileAccess.WRITE)
	if fichier == null:
		push_error("Sauvegarde impossible : %s" % error_string(FileAccess.get_open_error()))
		return false
	fichier.store_string(JSON.stringify(donnees))
	fichier.close()
	if FileAccess.file_exists(chemin):
		if FileAccess.file_exists(chemin + ".bak"):
			DirAccess.remove_absolute(chemin + ".bak")
		DirAccess.rename_absolute(chemin, chemin + ".bak")
	return DirAccess.rename_absolute(temporaire, chemin) == OK


func effacer() -> void:
	for suffixe in ["", ".bak", ".tmp"]:
		if FileAccess.file_exists(chemin + suffixe):
			DirAccess.remove_absolute(chemin + suffixe)
	donnees = _defaut()


func _lire(fichier: String) -> Dictionary:
	if not FileAccess.file_exists(fichier):
		return {}
	var json := JSON.new()  # JSON.new().parse() : pas d'erreur affichée si le fichier est abîmé
	if json.parse(FileAccess.get_file_as_string(fichier)) != OK:
		return {}
	return json.data if json.data is Dictionary else {}
