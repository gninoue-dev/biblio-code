extends CanvasLayer
## Autoload : changement de scène avec fondu au noir (et blocage des clics pendant le fondu).

@export var duree := 0.35
@export var couleur := Color.BLACK

var en_cours := false
var _voile := ColorRect.new()


func _ready() -> void:
	layer = 100
	process_mode = Node.PROCESS_MODE_ALWAYS
	_voile.color = couleur
	_voile.set_anchors_preset(Control.PRESET_FULL_RECT)
	_voile.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_voile.modulate.a = 0.0
	add_child(_voile)


func changer_scene(chemin: String) -> void:
	if en_cours:
		return
	en_cours = true
	_voile.mouse_filter = Control.MOUSE_FILTER_STOP
	await _fondu(1.0)
	var erreur := get_tree().change_scene_to_file(chemin)
	if erreur != OK:
		push_error("Scène introuvable : %s" % chemin)
	# Laisse la nouvelle scène s'installer avant de la révéler.
	await get_tree().process_frame
	await get_tree().process_frame
	await _fondu(0.0)
	_voile.mouse_filter = Control.MOUSE_FILTER_IGNORE
	en_cours = false


func _fondu(cible: float) -> void:
	var tween := create_tween()
	tween.tween_property(_voile, "modulate:a", cible, duree)
	await tween.finished
