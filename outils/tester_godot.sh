#!/usr/bin/env bash
# Copie les modules Godot dans le projet de test, puis lance les tests en mode sans fenêtre.
set -euo pipefail
RACINE="$(cd "$(dirname "$0")/.." && pwd)"
GODOT="${GODOT:-$(command -v godot-4 || command -v godot)}"
rm -rf "$RACINE/tests/godot/modules"
mkdir -p "$RACINE/tests/godot/modules"
cp "$RACINE"/game/godot/*/*.gd "$RACINE/tests/godot/modules/"
"$GODOT" --headless --path "$RACINE/tests/godot" --import >/dev/null 2>&1 || true
"$GODOT" --headless --path "$RACINE/tests/godot" --script res://test_modules.gd
