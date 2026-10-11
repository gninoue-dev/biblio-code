extends Node
## Autoload : gel bref du jeu sur un impact (« hitstop ») + vibration du téléphone.

var _jeton := 0


func geler(duree := 0.08, echelle := 0.0, vibration_ms := 0) -> void:
	_jeton += 1
	var mien := _jeton
	Engine.time_scale = echelle
	if vibration_ms > 0 and OS.has_feature("mobile"):
		Input.vibrate_handheld(vibration_ms)
	# ignore_time_scale = true : le minuteur avance en temps réel même si le jeu est figé
	await get_tree().create_timer(duree, true, false, true).timeout
	if mien == _jeton:  # un gel plus récent a pu prendre le relais
		Engine.time_scale = 1.0
