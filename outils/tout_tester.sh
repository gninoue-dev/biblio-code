#!/usr/bin/env bash
# Lance tous les tests disponibles sur cette machine. Les langages sans outil installé sont signalés et sautés.
RACINE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$RACINE"
echecs=0
etape() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }

etape "JavaScript (web)"
if command -v node >/dev/null; then node --test 2>&1 | grep -E "^# (pass|fail)" || echecs=1; node --test >/dev/null 2>&1 || echecs=1
else echo "node absent : sauté"; fi

etape "Python"
python3 -m unittest discover -s tests/python 2>&1 | tail -3 | grep -E "^(OK|FAILED|Ran)" ; python3 -m unittest discover -s tests/python >/dev/null 2>&1 || echecs=1

etape "Godot"
if command -v godot-4 >/dev/null || command -v godot >/dev/null; then
  ./outils/tester_godot.sh 2>&1 | grep -E "Godot :|ÉCHEC"; ./outils/tester_godot.sh >/dev/null 2>&1 || echecs=1
else echo "Godot absent : sauté"; fi

etape "Kotlin (Android)"
if [ -d "$HOME/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-compiler-embeddable" ]; then
  ./outils/tester_kotlin.sh 2>&1 | grep -vE "warning|deprecated" || echecs=1
else echo "Compilateur Kotlin absent du cache Gradle : sauté"; fi

echo
[ "$echecs" = 0 ] && echo "✅ Tous les tests passent" || { echo "❌ Des tests échouent"; exit 1; }
