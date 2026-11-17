#!/bin/sh
# Builds the signed APK.  Usage:  sh android/build.sh [<versionCode> <versionName>]
#   Without arguments the version comes from android/verze.txt ("versionCode versionName"), the file the GitHub
#   workflow reads too. versionCode MUST be higher than the installed app's, otherwise the update does not install.
# Needs: sh, python3, java + javac (JDK 17+), zip; npm only the first time (fetches the Android tools, checked by SHA-256).
# Key: ALWAYS the original one (certificate SHA-256 5013f733…). Never generate a new one: another key = the update does
#   not install over the old app and the progress on the phone would be lost.
#   GAMGOL_KS_FILE  path of gamgol.jks (default android/gamgol.jks, not in the repository: handoff ZIP / GitHub Secrets)
#   GAMGOL_KS_PASS  its password (default: the file android/KEYSTORE_PASSWORD.txt, not in the repository either)
set -e
cd "$(dirname "$0")"
if [ $# -ge 2 ]; then VC=$1; VN=$2; else read VC VN < verze.txt; fi
KS="${GAMGOL_KS_FILE:-gamgol.jks}"
PASS="${GAMGOL_KS_PASS:-$(cat KEYSTORE_PASSWORD.txt 2>/dev/null || true)}"
[ -f "$KS" ] || { echo "MISSING $KS: without the original key the update does not install over the old app" >&2; exit 1; }
[ -n "$PASS" ] || { echo "MISSING the key password (GAMGOL_KS_PASS or android/KEYSTORE_PASSWORD.txt)" >&2; exit 1; }
T=toolchain

# 1) Android build tools: from the handoff ZIP (toolchain/) or fetched from npm; refused if they differ from the checked copies
if [ ! -f $T/android.jar ] || [ ! -f $T/d8.jar ] || [ ! -f $T/apksigner.jar ] || [ ! -f $T/aapt2 ]; then
  mkdir -p $T/.dl $T/.x1 $T/.x2
  (cd $T/.dl && npm pack @drxiaozhi/minapk@0.4.0 aaptjs3@2.0.2 >/dev/null)
  tar xzf $T/.dl/drxiaozhi-minapk-0.4.0.tgz -C $T/.x1
  tar xzf $T/.dl/aaptjs3-2.0.2.tgz -C $T/.x2
  cp $T/.x1/package/tools/android.jar $T/.x1/package/tools/d8.jar $T/.x1/package/tools/apksigner.jar $T/
  cp $T/.x2/package/bin/x64/linux/aapt2 $T/
  rm -rf $T/.dl $T/.x1 $T/.x2
fi
(cd $T && sha256sum -c --quiet - <<'SUMS'
6cea1df3efb77103ac3e2beb9bf4718964b0e0869ab16d39d29d5cbae1c147ad  android.jar
d43c8a94c9b1f1da1a7cc49c32b81e8cee1708b37ee8b530a81a0688222b42c0  d8.jar
eefdd6aed9db9fb849e4c98a50d8741e19d1b674ba6547220bcb9c3ed152123a  apksigner.jar
e4dff6060827a3e401bce376e47916f2f93a89602af54973ffd3fdfc2528be3f  aapt2
SUMS
) || { echo "the build tools in android/toolchain differ from the checked copies: not building" >&2; exit 1; }
chmod +x $T/aapt2

# 2) The page (from web/gamgol.html, fonts embedded) and the recordings (single MP3s from the bundles)
sed -i "s/android:versionCode=\"[0-9]*\"/android:versionCode=\"$VC\"/; s/android:versionName=\"[^\"]*\"/android:versionName=\"$VN\"/" AndroidManifest.xml
python3 ../web/tools/unbundle.py   # single MP3s from the bundles (existing ones are kept)
python3 build_apk_html.py

# 3) Compile, dex, package, align, sign
rm -rf build && mkdir -p build/classes build/dex
$T/aapt2 compile --dir res -o build/res.zip
$T/aapt2 link -o build/base.apk -I $T/android.jar --manifest AndroidManifest.xml -A assets build/res.zip --min-sdk-version 26 --target-sdk-version 34 --version-code $VC --version-name $VN
javac -nowarn -source 1.8 -target 1.8 -bootclasspath $T/android.jar -cp $T/android.jar -d build/classes $(find src -name '*.java') 2>&1 | grep -v -e '^warning' -e '^Note' -e '^Picked' -e 'JAVA_TOOL' || true
java -cp $T/d8.jar com.android.tools.r8.D8 --lib $T/android.jar --min-api 26 --output build/dex $(find build/classes -name '*.class') 2>&1 | grep -v -e JAVA_TOOL -e '^Picked' || true
[ -f build/dex/classes.dex ] || { echo "no classes.dex: the Java code did not compile" >&2; exit 1; }
(cd build && cp base.apk unaligned.apk && zip -q -j unaligned.apk dex/classes.dex)
python3 align.py build/unaligned.apk build/aligned.apk
java -jar $T/apksigner.jar sign --ks "$KS" --ks-key-alias gamgol --ks-pass "pass:$PASS" --key-pass "pass:$PASS" --out build/GamgolSubstation-$VN.apk build/aligned.apk 2>&1 | grep -v -e JAVA_TOOL -e '^Picked' || true
rm -f build/GamgolSubstation-$VN.apk.idsig
java -jar $T/apksigner.jar verify --print-certs build/GamgolSubstation-$VN.apk 2>&1 | grep -E 'SHA-256|DOES NOT' || true
ls -la build/GamgolSubstation-$VN.apk
