extends Camera2D
## Tremblement de caméra : appeler secouer(force) lors d'un impact.

@export var amortissement := 1.5
@export var decalage_max := Vector2(12, 8)

var _trauma := 0.0


func secouer(force: float = 0.5) -> void:
	_trauma = minf(_trauma + force, 1.0)


func _process(delta: float) -> void:
	if _trauma <= 0.0:
		offset = Vector2.ZERO
		return
	_trauma = maxf(_trauma - amortissement * delta, 0.0)
	var intensite := _trauma * _trauma
	offset = Vector2(
		decalage_max.x * intensite * randf_range(-1.0, 1.0),
		decalage_max.y * intensite * randf_range(-1.0, 1.0)
	)
