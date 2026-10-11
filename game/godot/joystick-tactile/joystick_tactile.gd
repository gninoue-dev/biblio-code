extends Control
## Joystick virtuel tactile. Lire `direction` (Vector2, longueur 0 à 1) depuis le joueur.

@export var rayon := 80.0
@export var zone_morte := 0.15

var direction := Vector2.ZERO
var _doigt := -1
var _position_bouton := Vector2.ZERO


func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed and _doigt == -1 and get_global_rect().has_point(event.position):
			_doigt = event.index
			_mettre_a_jour(event.position)
		elif not event.pressed and event.index == _doigt:
			_doigt = -1
			direction = Vector2.ZERO
			_position_bouton = Vector2.ZERO
			queue_redraw()
	elif event is InputEventScreenDrag and event.index == _doigt:
		_mettre_a_jour(event.position)


func _mettre_a_jour(position_ecran: Vector2) -> void:
	var ecart := (position_ecran - get_global_rect().get_center()).limit_length(rayon)
	_position_bouton = ecart
	var d := ecart / rayon
	direction = d if d.length() > zone_morte else Vector2.ZERO
	queue_redraw()


func _draw() -> void:
	var centre := size / 2
	draw_circle(centre, rayon, Color(1, 1, 1, 0.15))
	draw_circle(centre + _position_bouton, rayon * 0.4, Color(1, 1, 1, 0.5))
