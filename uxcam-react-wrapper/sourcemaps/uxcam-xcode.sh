#!/bin/bash
# Wraps React Native's "Bundle React Native code and images" build phase:
# makes sure a source map is written, runs React Native's own script, then
# uploads the map to UXCam. In that build phase, put this script in front of
# React Native's script:
#
#   set -e
#   WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
#   REACT_NATIVE_XCODE="../node_modules/react-native/scripts/react-native-xcode.sh"
#   UXCAM_XCODE=`"$NODE_BINARY" --print "require('path').join(require('path').dirname(require.resolve('react-native-ux-cam/package.json')), 'sourcemaps', 'uxcam-xcode.sh')"`
#   /bin/sh -c "$WITH_ENVIRONMENT \"$UXCAM_XCODE $REACT_NATIVE_XCODE\""
#
# Like the dSYM upload, this needs ENABLE_USER_SCRIPT_SANDBOXING = NO.
#
# Settings, for example in ios/.xcode.env.local:
#   UXCAM_APP_KEY=<key>               required for the upload
#   UXCAM_SOURCEMAP_UPLOAD=false      bundle and write the map, but skip the upload
#   UXCAM_SOURCEMAP_DRY_RUN=true      prepare the upload, but send nothing
#
# The upload never fails the build; problems are printed as Xcode warnings.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# The first argument is React Native's bundling script; without one, use the default.
if [[ -n "$1" && -f "$1" ]]; then
  REACT_NATIVE_XCODE="$1"
  shift
else
  REACT_NATIVE_XCODE="${REACT_NATIVE_PATH:-$PROJECT_DIR/../node_modules/react-native}/scripts/react-native-xcode.sh"
fi

# React Native writes no iOS source map unless SOURCEMAP_FILE is set.
if [[ -z "$SOURCEMAP_FILE" ]]; then
  export SOURCEMAP_FILE="$DERIVED_FILE_DIR/main.jsbundle.map"
fi

"$REACT_NATIVE_XCODE" "$@"

if [[ "$CONFIGURATION" == *Debug* || "$UXCAM_SOURCEMAP_UPLOAD" == "false" ]]; then
  exit 0
fi

if [[ -z "$UXCAM_APP_KEY" && "$UXCAM_SOURCEMAP_DRY_RUN" != "true" ]]; then
  echo "warning: [UXCam] UXCAM_APP_KEY is not set, so the source map was not uploaded. Set it in ios/.xcode.env.local."
  exit 0
fi

NODE="${NODE_BINARY:-node}"
UPLOAD_ARGS=(
  --platform ios
  --map "$SOURCEMAP_FILE"
  --bundle "$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH/main.jsbundle"
  --project-root "$PROJECT_DIR/.."
)
if [[ -n "$UXCAM_APP_KEY" ]]; then
  UPLOAD_ARGS+=(--app-key "$UXCAM_APP_KEY")
fi
if [[ "$UXCAM_SOURCEMAP_DRY_RUN" == "true" ]]; then
  UPLOAD_ARGS+=(--dry-run)
fi

"$NODE" "$SCRIPT_DIR/upload-sourcemap.js" "${UPLOAD_ARGS[@]}" \
  || echo "warning: [UXCam] source map upload did not complete."
exit 0
