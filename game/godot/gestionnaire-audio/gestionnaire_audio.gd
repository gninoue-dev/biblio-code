extends Node
## Autoload : musique avec fondu enchaîné, effets sonores qui se superposent, volumes sauvegardés.
## Crée les bus « Musique » et « Effets » dans l'onglet Audio (sinon tout passe par Master).

const FICHIER := "user://audio.cfg"
const SILENCE_DB := -40.0

var _musiques: Array[AudioStreamPlayer] = []
var _active := 0
var _effets: Array[AudioStreamPlayer] = []
var _prochain_effet := 0


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	for i in 2:
		_musiques.append(_lecteur(&"Musique"))
	for i in 8:
		_effets.append(_lecteur(&"Effets"))
	charger_volumes()


func _lecteur(bus: StringName) -> AudioStreamPlayer:
	var lecteur := AudioStreamPlayer.new()
	lecteur.bus = bus if AudioServer.get_bus_index(bus) != -1 else &"Master"
	add_child(lecteur)
	return lecteur


func jouer_musique(flux: AudioStream, fondu := 1.0) -> void:
	var ancienne := _musiques[_active]
	if ancienne.stream == flux and ancienne.playing:
		return
	_active = 1 - _active
	var nouvelle := _musiques[_active]
	nouvelle.stream = flux
	nouvelle.volume_db = SILENCE_DB
	nouvelle.play()
	var tween := create_tween().set_parallel()
	tween.tween_property(nouvelle, "volume_db", 0.0, fondu)
	tween.tween_property(ancienne, "volume_db", SILENCE_DB, fondu)
	tween.chain().tween_callback(ancienne.stop)


func arreter_musique(fondu := 1.0) -> void:
	var lecteur := _musiques[_active]
	var tween := create_tween()
	tween.tween_property(lecteur, "volume_db", SILENCE_DB, fondu)
	tween.tween_callback(lecteur.stop)


## variation : légère différence de hauteur à chaque lecture (évite l'effet « mitraillette »)
func jouer_effet(flux: AudioStream, variation := 0.05, volume_db := 0.0) -> void:
	var lecteur: AudioStreamPlayer = null
	for l in _effets:
		if not l.playing:
			lecteur = l
			break
	if lecteur == null:  # tous occupés : on coupe le plus ancien
		lecteur = _effets[_prochain_effet]
		_prochain_effet = (_prochain_effet + 1) % _effets.size()
	lecteur.stream = flux
	lecteur.pitch_scale = 1.0 + randf_range(-variation, variation)
	lecteur.volume_db = volume_db
	lecteur.play()


## volume entre 0 et 1 (pour un curseur)
func regler_volume(bus: StringName, volume: float, sauvegarder := true) -> void:
	var index := AudioServer.get_bus_index(bus)
	if index == -1:
		return
	volume = clampf(volume, 0.0, 1.0)
	AudioServer.set_bus_volume_db(index, linear_to_db(maxf(volume, 0.0001)))
	AudioServer.set_bus_mute(index, volume <= 0.0001)
	if sauvegarder:
		var config := ConfigFile.new()
		config.load(FICHIER)
		config.set_value("volumes", bus, volume)
		config.save(FICHIER)


func volume(bus: StringName) -> float:
	var index := AudioServer.get_bus_index(bus)
	if index == -1 or AudioServer.is_bus_mute(index):
		return 0.0
	return db_to_linear(AudioServer.get_bus_volume_db(index))


func charger_volumes() -> void:
	var config := ConfigFile.new()
	if config.load(FICHIER) != OK:
		return
	for bus in config.get_section_keys("volumes"):
		regler_volume(bus, config.get_value("volumes", bus), false)
