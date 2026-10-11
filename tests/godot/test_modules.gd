extends SceneTree
## Tests des modules Godot de biblio-code. Lancer : outils/tester_godot.sh

var reussis := 0
var echecs: Array[String] = []


func verifier(condition: bool, message: String) -> void:
	if condition:
		reussis += 1
	else:
		echecs.append(message)


func _initialize() -> void:
	_lancer.call_deferred()


func _lancer() -> void:
	await process_frame
	root.size = Vector2i(1280, 720)  # en mode sans fenêtre, l'écran fait 64×64
	_tester_machine_etats()
	_tester_tampon()
	_tester_economie()
	_tester_recompense()
	_tester_sauvegarde()
	await _tester_hitstop()
	await _tester_transition()
	await _tester_audio()
	await _tester_dialogues()
	await _tester_boutons()
	await _tester_anciens_modules()
	print("Godot : %d vérifications réussies, %d échec(s)" % [reussis, echecs.size()])
	for e in echecs:
		printerr("  ÉCHEC : ", e)
	quit(1 if echecs.size() else 0)


func _tester_machine_etats() -> void:
	var journal: Array[String] = []
	var m = load("res://modules/machine_etats.gd").new()
	m.ajouter(&"repos", func(): journal.append("entrer repos"), Callable(), func(): journal.append("sortir repos"))
	m.ajouter(&"course", func(): journal.append("entrer course"), func(d): journal.append("maj course"))
	var changements := []
	m.etat_change.connect(func(a, n): changements.append([a, n]))
	m.changer(&"repos")
	m.changer(&"repos")
	m.changer(&"course")
	m.mettre_a_jour(0.5)
	verifier(journal == ["entrer repos", "sortir repos", "entrer course", "maj course"], "machine : ordre des appels %s" % [journal])
	verifier(m.est(&"course") and m.etat_precedent == &"repos", "machine : état courant/précédent")
	verifier(is_equal_approx(m.temps_dans_etat, 0.5), "machine : temps dans l'état")
	verifier(changements.size() == 2, "machine : signal émis 2 fois")


func _tester_tampon() -> void:
	var t = load("res://modules/tampon_entrees.gd").new()
	t.enregistrer(&"attaque")
	t.mettre_a_jour(0.1)
	verifier(t.contient(&"attaque"), "tampon : encore présent après 0,1 s")
	t.mettre_a_jour(0.1)
	verifier(not t.consommer(&"attaque"), "tampon : expiré après 0,2 s")
	t.enregistrer(&"saut")
	verifier(t.consommer(&"saut") and not t.consommer(&"saut"), "tampon : consommé une seule fois")


func _tester_economie() -> void:
	var e = load("res://modules/economie.gd").new()
	var signaux := []
	e.solde_change.connect(func(m, s): signaux.append(s))
	e.crediter(&"pieces", 500)
	e.crediter(&"pieces", -100)
	verifier(e.solde(&"pieces") == 500, "économie : crédit négatif ignoré")
	verifier(not e.acheter(&"skin", &"pieces", 800), "économie : achat refusé sans assez d'argent")
	verifier(e.acheter(&"skin", &"pieces", 300), "économie : achat accepté")
	verifier(not e.acheter(&"skin", &"pieces", 100), "économie : pas d'achat en double")
	verifier(e.solde(&"pieces") == 200 and e.possede(&"skin"), "économie : solde et possession")
	var copie = load("res://modules/economie.gd").new()
	copie.depuis_dictionnaire(JSON.parse_string(JSON.stringify(e.vers_dictionnaire())))
	verifier(copie.solde(&"pieces") == 200 and copie.possede(&"skin"), "économie : aller-retour JSON")
	verifier(signaux == [500, 200], "économie : signaux %s" % [signaux])


func _tester_recompense() -> void:
	var r = load("res://modules/recompense_quotidienne.gd").new()
	verifier(r.reclamer(100) == 50 and r.reclamer(100) == 0, "quotidien : une fois par jour")
	verifier(r.reclamer(101) == 75 and r.serie == 2, "quotidien : série jour 2")
	verifier(r.reclamer(103) == 50 and r.serie == 1, "quotidien : jour manqué → retour au jour 1")
	for j in range(104, 110):
		r.reclamer(j)
	verifier(r.serie == 7 and r.reclamer(110) == 50 and r.serie == 8, "quotidien : cycle après 7 jours")
	var jour = load("res://modules/recompense_quotidienne.gd").jour_actuel()
	verifier(jour > 20000, "quotidien : jour actuel plausible (%d)" % jour)
	verifier(r.disponible(), "quotidien : argument par défaut = aujourd'hui")


func _tester_sauvegarde() -> void:
	var s = load("res://modules/sauvegarde_versionnee.gd").new()
	s.chemin = "user://test_sauvegarde.json"
	s.effacer()
	var f := FileAccess.open(s.chemin, FileAccess.WRITE)
	f.store_string(JSON.stringify({"version": 1, "pieces": 5, "skins_debloques": ["or"], "vibrations": false}))
	f.close()
	s.charger()
	verifier(int(s.donnees["version"]) == 3, "sauvegarde : migrée en v3")
	verifier(s.donnees["skins"] == ["or"] and not s.donnees.has("skins_debloques"), "sauvegarde : migration 1→2")
	verifier(s.donnees["options"] == {"vibrations": false}, "sauvegarde : migration 2→3")
	verifier(int(s.donnees["pieces"]) == 5, "sauvegarde : données conservées")
	verifier(s.sauvegarder(), "sauvegarde : écriture 1")
	s.donnees["pieces"] = 6
	verifier(s.sauvegarder(), "sauvegarde : écriture 2")
	f = FileAccess.open(s.chemin, FileAccess.WRITE)
	f.store_string("{fichier abîmé")
	f.close()
	s.charger()
	verifier(int(s.donnees["pieces"]) == 5, "sauvegarde : récupération depuis .bak")
	s.effacer()
	s.charger()
	verifier(int(s.donnees["pieces"]) == 0 and s.donnees["version"] == 3, "sauvegarde : partie neuve")
	s.free()


func _tester_hitstop() -> void:
	var h = load("res://modules/hitstop.gd").new()
	root.add_child(h)
	h.geler(0.05)
	verifier(Engine.time_scale == 0.0, "hitstop : jeu figé")
	await create_timer(0.15, true, false, true).timeout
	verifier(Engine.time_scale == 1.0, "hitstop : jeu relancé")
	h.queue_free()


func _tester_transition() -> void:
	var t = load("res://modules/transition_scene.gd").new()
	t.duree = 0.05
	root.add_child(t)
	await process_frame
	var fini := false
	t.changer_scene("res://scene_vide.tscn")
	verifier(t.en_cours, "transition : en cours")
	t.changer_scene("res://scene_vide.tscn")  # double appel ignoré
	while t.en_cours:
		await process_frame
	verifier(current_scene != null and current_scene.name == "Vide", "transition : nouvelle scène chargée")
	verifier(t.get_child(0).modulate.a == 0.0, "transition : voile retiré")
	t.queue_free()


func _tester_audio() -> void:
	var a = load("res://modules/gestionnaire_audio.gd").new()
	root.add_child(a)
	a.regler_volume(&"Master", 0.5)
	verifier(absf(a.volume(&"Master") - 0.5) < 0.01, "audio : volume réglé")
	a.regler_volume(&"Master", 0.0)
	verifier(a.volume(&"Master") == 0.0, "audio : volume coupé")
	a.regler_volume(&"Master", 1.0)
	var config := ConfigFile.new()
	verifier(config.load("user://audio.cfg") == OK and config.get_value("volumes", "Master") == 1.0, "audio : volume sauvegardé")
	var son := AudioStreamWAV.new()
	for i in 10:
		a.jouer_effet(son)
	a.jouer_musique(son, 0.01)
	verifier(true, "audio : lecture sans erreur")
	a.queue_free()


func _tester_dialogues() -> void:
	var d := Control.new()
	var nom := Label.new()
	nom.name = "Nom"
	var texte := RichTextLabel.new()
	texte.name = "Texte"
	d.add_child(nom)
	d.add_child(texte)
	d.set_script(load("res://modules/dialogues.gd"))
	root.add_child(d)
	d.vitesse = 1000.0
	var fini := [false]
	d.termine.connect(func(): fini[0] = true)
	var f := FileAccess.open("user://dialogue.json", FileAccess.WRITE)
	f.store_string('{"intro": [{"nom": "Nash", "texte": "Bonjour [b]toi[/b]"}, {"nom": "Voix", "texte": "Salut"}]}')
	f.close()
	var repliques: Array = d.charger("user://dialogue.json", "intro")
	verifier(repliques.size() == 2, "dialogues : chargement JSON")
	d.vitesse = 20.0
	d.lancer(repliques)
	verifier(nom.text == "Nash" and texte.visible_characters == 0, "dialogues : première réplique")
	await process_frame
	await process_frame
	d.avancer()
	verifier(not d.en_train_d_ecrire(), "dialogues : appui = tout afficher")
	d.avancer()
	verifier(nom.text == "Voix", "dialogues : réplique suivante")
	d.avancer()
	d.avancer()
	verifier(fini[0] and not d.visible, "dialogues : fin")
	d.queue_free()


func _tester_boutons() -> void:
	var conteneur := Control.new()
	conteneur.size = Vector2(800, 600)
	for n in ["Attaque", "Saut"]:
		var b := Button.new()
		b.name = n
		b.size = Vector2(80, 80)
		b.position = Vector2(100, 100) if n == "Attaque" else Vector2(300, 100)
		conteneur.add_child(b)
	conteneur.set_script(load("res://modules/boutons_deplacables.gd"))
	conteneur.fichier = "user://test_boutons.cfg"
	if FileAccess.file_exists(conteneur.fichier):
		DirAccess.remove_absolute(conteneur.fichier)
	root.add_child(conteneur)
	await process_frame
	conteneur.mode_edition = true
	var appui := InputEventMouseButton.new()
	appui.button_index = MOUSE_BUTTON_LEFT
	appui.pressed = true
	appui.position = Vector2(120, 120)
	conteneur._input(appui)
	var glisser := InputEventMouseMotion.new()
	glisser.position = Vector2(220, 320)
	conteneur._input(glisser)
	appui = appui.duplicate()
	appui.pressed = false
	conteneur._input(appui)
	var attaque: Control = conteneur.get_node("Attaque")
	verifier(attaque.position == Vector2(200, 300), "boutons : déplacé (%s)" % attaque.position)
	verifier(conteneur.get_node("Saut").position == Vector2(300, 100), "boutons : l'autre n'a pas bougé")
	var copie: Control = conteneur.duplicate()
	copie.get_node("Attaque").position = Vector2(100, 100)
	conteneur.queue_free()
	root.add_child(copie)
	await process_frame
	verifier(copie.get_node("Attaque").position == Vector2(200, 300), "boutons : position rechargée")
	copie.reinitialiser()
	verifier(copie.get_node("Attaque").position == Vector2(100, 100), "boutons : réinitialisation (%s)" % copie.get_node("Attaque").position)
	copie.queue_free()


func _tester_anciens_modules() -> void:
	var cam = load("res://modules/tremblement_camera.gd").new()
	root.add_child(cam)
	cam.secouer(1.0)
	await process_frame
	verifier(cam.offset != Vector2.ZERO, "tremblement : caméra décalée")
	cam.queue_free()
	var save = load("res://modules/sauvegarde.gd").new()
	save.donnees = {"pieces": 3}
	save.sauvegarder()
	save.donnees = {}
	save.charger()
	verifier(int(save.donnees.get("pieces", 0)) == 3, "sauvegarde simple : aller-retour")
	save.free()
	var joy = load("res://modules/joystick_tactile.gd").new()
	joy.size = Vector2(200, 200)
	root.add_child(joy)
	await process_frame
	var toucher := InputEventScreenTouch.new()
	toucher.pressed = true
	toucher.position = joy.get_global_rect().get_center() + Vector2(160, 0)
	toucher.position = joy.get_global_rect().get_center() + Vector2(50, 0)
	joy._input(toucher)
	var glisser := InputEventScreenDrag.new()
	glisser.position = joy.get_global_rect().get_center() + Vector2(200, 0)
	joy._input(glisser)
	verifier(joy.direction.is_equal_approx(Vector2(1, 0)), "joystick : direction max (%s)" % joy.direction)
	toucher = toucher.duplicate()
	toucher.pressed = false
	joy._input(toucher)
	verifier(joy.direction == Vector2.ZERO, "joystick : relâché")
	joy.queue_free()
