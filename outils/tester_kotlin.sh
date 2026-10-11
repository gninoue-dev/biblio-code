#!/usr/bin/env bash
# Compile tous les modules Android avec le compilateur Kotlin et les bibliothèques AndroidX
# trouvés dans le cache Gradle, puis exécute les tests des modules sans dépendance Android.
set -euo pipefail
RACINE="$(cd "$(dirname "$0")/.." && pwd)"
CACHE="$HOME/.gradle/caches/modules-2/files-2.1"
SDK="${ANDROID_HOME:-$HOME/Android/Sdk}"
JAVA="${JAVA:-java}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Dernière version d'un fichier dans le cache (chaîne vide si absent, sans faire échouer le script)
dernier() { { find "$CACHE/$1" -name "$2" ! -name "*sources*" ! -name "*javadoc*" 2>/dev/null || true; } | sort -V | tail -1; }

KOTLIN_VERSION=$(ls "$CACHE/org.jetbrains.kotlin/kotlin-compiler-embeddable" | sort -V | tail -1)
CP_COMPILATEUR=""
for a in kotlin-compiler-embeddable kotlin-stdlib kotlin-script-runtime kotlin-daemon-embeddable; do
  CP_COMPILATEUR+="$(dernier org.jetbrains.kotlin/$a/$KOTLIN_VERSION "$a-$KOTLIN_VERSION.jar"):"
done
CP_COMPILATEUR+="$(dernier org.jetbrains.intellij.deps/trove4j '*.jar'):$(dernier org.jetbrains.kotlinx/kotlinx-coroutines-core-jvm '*.jar'):$(dernier org.jetbrains/annotations 'annotations-13.0.jar')"
STDLIB="$(dernier org.jetbrains.kotlin/kotlin-stdlib/$KOTLIN_VERSION "kotlin-stdlib-$KOTLIN_VERSION.jar")"

# Bibliothèques Android : android.jar + classes.jar extraits des .aar AndroidX
ANDROID_JAR="$(ls -d "$SDK"/platforms/android-3[0-9] | sort -V | tail -1)/android.jar"
CP_ANDROID="$ANDROID_JAR"
for aar in androidx.core/core androidx.core/core-ktx androidx.work/work-runtime androidx.activity/activity \
           androidx.lifecycle/lifecycle-runtime androidx.lifecycle/lifecycle-common androidx.lifecycle/lifecycle-viewmodel \
           androidx.savedstate/savedstate; do
  f="$(dernier "$aar" '*.aar')"
  if [ -z "$f" ]; then f="$(dernier "$aar" '*.jar')"; fi
  if [ -z "$f" ]; then echo "absent du cache : $aar" >&2; continue; fi
  if [[ "$f" == *.aar ]]; then
    d="$TMP/$(basename "$f" .aar)"; mkdir -p "$d"; unzip -q -o "$f" classes.jar -d "$d" 2>/dev/null && CP_ANDROID+=":$d/classes.jar"
  else
    CP_ANDROID+=":$f"
  fi
done
for jar in androidx.annotation/annotation-jvm androidx.annotation/annotation androidx.lifecycle/lifecycle-common-jvm; do
  f="$(dernier "$jar" '*.jar')"
  if [ -n "$f" ]; then CP_ANDROID+=":$f"; fi
done

kotlinc() { "$JAVA" -cp "$CP_COMPILATEUR" org.jetbrains.kotlin.cli.jvm.K2JVMCompiler -no-stdlib -jvm-target 17 "$@"; }

echo "→ Compilation des modules Android (Kotlin $KOTLIN_VERSION, $(basename "$(dirname "$ANDROID_JAR")"))"
kotlinc -classpath "$STDLIB:$CP_ANDROID" -d "$TMP/android" "$RACINE"/mobile/android/*/*.kt
echo "  ✓ $(ls "$RACINE"/mobile/android/*/*.kt | wc -l) fichiers compilés sans erreur"

echo "→ Tests exécutables"
kotlinc -classpath "$STDLIB" -d "$TMP/tests" "$RACINE/mobile/android/contenu-du-jour/contenu-du-jour.kt" "$RACINE"/tests/kotlin/*.kt
"$JAVA" -cp "$STDLIB:$TMP/tests" TestContenuDuJourKt
