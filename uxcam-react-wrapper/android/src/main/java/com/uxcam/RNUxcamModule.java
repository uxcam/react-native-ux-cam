package com.uxcam;

import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.util.Log;

import com.uxcam.UXCam;
import com.uxcam.datamodel.UXCamBlur;
import com.uxcam.datamodel.UXCamOverlay;
import com.uxcam.datamodel.UXCamOcclusion;
import com.uxcam.datamodel.UXCamOccludeAllTextFields;
import com.uxcam.datamodel.UXConfig;

public class RNUxcamModule extends ReactContextBaseJavaModule {
    private static final String UXCAM_PLUGIN_TYPE = "react-native";
    private static final String UXCAM_REACT_PLUGIN_VERSION = "5.4.1";

    private static final String UXCAM_VERIFICATION_EVENT_KEY = "UXCam_Verification_Event";
    private static final String PARAM_SUCCESS_KEY = "success";
    private static final String PARAM_ERROR_MESSAGE_KEY = "error";

    public static final String USER_APP_KEY = "userAppKey";
    public static final String ENABLE_MUTLI_SESSION_RECORD = "enableMultiSessionRecord";
    public static final String ENABLE_CRASH_HANDLING = "enableCrashHandling";
    public static final String ENABLE_AUTOMATIC_SCREEN_NAME_TAGGING = "enableAutomaticScreenNameTagging";
    public static final String ENABLE_IMPROVED_SCREEN_CAPTURE = "enableImprovedScreenCapture";
    public static final String OCCLUSION = "occlusions";
    public static final String SCREENS = "screens";
    public static final String NAME = "name";
    public static final String TYPE = "type";
    public static final String EXCLUDE_MENTIONED_SCREENS = "excludeMentionedScreens";
    public static final String CONFIG = "config";
    public static final String BLUR_RADIUS = "blurRadius";
    public static final String HIDE_GESTURES = "hideGestures";

    private final ReactApplicationContext reactContext;

    public RNUxcamModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        UXCam.addVerificationListener(new OnVerificationListener() {
            @Override
            public void onVerificationSuccess() {
                WritableMap params = Arguments.createMap();
                params.putBoolean(PARAM_SUCCESS_KEY, true);
                sendEvent(RNUxcamModule.this.reactContext, UXCAM_VERIFICATION_EVENT_KEY, params);
            }

            @Override
            public void onVerificationFailed(String errorMessage) {
                WritableMap params = Arguments.createMap();
                params.putBoolean(PARAM_SUCCESS_KEY, false);
                params.putString(PARAM_ERROR_MESSAGE_KEY, errorMessage);
                sendEvent(RNUxcamModule.this.reactContext, UXCAM_VERIFICATION_EVENT_KEY, params);
            }
        });
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public String getName() {
        return "RNUxcam";
    }

    @ReactMethod
    public void startWithKey(String key) {
        UXCam.pluginType(UXCAM_PLUGIN_TYPE, UXCAM_REACT_PLUGIN_VERSION);
        UXCam.startApplicationWithKeyForCordova(getCurrentActivity(), key);
    }

    @ReactMethod
    public void startWithConfiguration(ReadableMap configuration) {
        try {
            HashMap<String, Object> configMap = configuration.toHashMap();
            String appKey = (String) configMap.get(USER_APP_KEY);
            Boolean enableMultiSessionRecord = (Boolean) configMap.get(ENABLE_MUTLI_SESSION_RECORD);
            Boolean enableCrashHandling = (Boolean) configMap.get(ENABLE_CRASH_HANDLING);
            Boolean enableAutomaticScreenNameTagging = (Boolean) configMap.get(ENABLE_AUTOMATIC_SCREEN_NAME_TAGGING);
            Boolean enableImprovedScreenCapture = (Boolean) configMap.get(ENABLE_IMPROVED_SCREEN_CAPTURE);

            // // occlusion
            List<UXCamOcclusion> occlusionList = null;
            if (configMap.get(OCCLUSION) != null) {
                List<Map<String, Object>> occlusionObjects = (List<Map<String, Object>>) configMap.get(OCCLUSION);
                occlusionList = convertToOcclusionList(occlusionObjects);
            }

            UXConfig.Builder uxConfigBuilder = new UXConfig.Builder(appKey);
            if (enableMultiSessionRecord != null)
                uxConfigBuilder.enableMultiSessionRecord(enableMultiSessionRecord);
            if (enableCrashHandling != null)
                uxConfigBuilder.enableCrashHandling(enableCrashHandling);
            if (enableAutomaticScreenNameTagging != null)
                uxConfigBuilder.enableAutomaticScreenNameTagging(enableAutomaticScreenNameTagging);
            if (enableImprovedScreenCapture != null) {
                Log.d("config", "improved screen capture enabled " + enableImprovedScreenCapture);
                uxConfigBuilder.enableImprovedScreenCapture(enableImprovedScreenCapture);
            }
            if (occlusionList != null)
                uxConfigBuilder.occlusions(occlusionList);

            UXConfig config = uxConfigBuilder.build();
            UXCam.pluginType(UXCAM_PLUGIN_TYPE, UXCAM_REACT_PLUGIN_VERSION);
            UXCam.startWithConfigurationCrossPlatform(getCurrentActivity(), config);
        } catch (Exception e) {
            Log.d("config", "Error starting with configuration");
            e.printStackTrace();
        }
    }

    private List<UXCamOcclusion> convertToOcclusionList(List<Map<String, Object>> occlusionObjects) {
        List<UXCamOcclusion> occlusionList = new ArrayList<UXCamOcclusion>();
        for (Map<String, Object> occlusionMap :
                occlusionObjects) {
            UXCamOcclusion occlusion = getOcclusion(occlusionMap);
            if (occlusion != null)
                occlusionList.add(getOcclusion(occlusionMap));
        }
        return occlusionList;
    }

    private UXCamOcclusion getOcclusion(Map<String, Object> occlusionMap) {
        double typeIndex = (double) occlusionMap.get(TYPE);
        switch ((int)typeIndex) {
            case 1:
                return (UXCamOcclusion) getOccludeAllTextFields();
            case 2:
                return (UXCamOcclusion) getOverlay(occlusionMap);
            case 3:
                return (UXCamOcclusion) getBlur(occlusionMap);
            default:
                return null;
        }
    }

    private UXCamOccludeAllTextFields getOccludeAllTextFields() {
        return new UXCamOccludeAllTextFields.Builder().build();
    }
    private UXCamOverlay getOverlay(Map<String, Object> overlayMap) {
        // get data
        List<String> screens = (List<String>) overlayMap.get(SCREENS);
        Boolean excludeMentionedScreens = (Boolean) overlayMap.get(EXCLUDE_MENTIONED_SCREENS);
        Boolean hideGestures = (Boolean) overlayMap.get(HIDE_GESTURES);

        // set data
        UXCamOverlay.Builder overlayBuilder = new UXCamOverlay.Builder();
        if (screens != null && !screens.isEmpty())
            overlayBuilder.screens(screens);
        if (excludeMentionedScreens != null)
            overlayBuilder.excludeMentionedScreens(excludeMentionedScreens);
        if (hideGestures != null)
            overlayBuilder.withoutGesture(hideGestures);
        return overlayBuilder.build();
    }

    private UXCamBlur getBlur(Map<String, Object> blurMap) {
        // get data
        List<String> screens = (List<String>) blurMap.get(SCREENS);
        Boolean excludeMentionedScreens = (Boolean) blurMap.get(EXCLUDE_MENTIONED_SCREENS);
        Double blurRadius = (Double) blurMap.get(BLUR_RADIUS);
        Boolean hideGestures = (Boolean) blurMap.get(HIDE_GESTURES);

        // set data
        UXCamBlur.Builder blurBuilder = new UXCamBlur.Builder();
        if (screens != null && !screens.isEmpty())
            blurBuilder.screens(screens);
        if (excludeMentionedScreens != null)
            blurBuilder.excludeMentionedScreens(excludeMentionedScreens);
        if (blurRadius != null)
            blurBuilder.blurRadius(blurRadius.intValue());
        if (hideGestures != null)
            blurBuilder.withoutGesture(hideGestures);
        return blurBuilder.build();
    }

    @ReactMethod
    public void applyOcclusion(ReadableMap occlusionMap) {
        UXCamOcclusion occlusion = getOcclusion(occlusionMap.toHashMap());
        UXCam.applyOcclusion(occlusion);
    }

    @ReactMethod
    public void removeOcclusion(ReadableMap occlusionMap) {
        UXCamOcclusion occlusion = getOcclusion(occlusionMap.toHashMap());
        UXCam.removeOcclusion(occlusion);
    }

    @ReactMethod
    public void startNewSession() {
        UXCam.startNewSession();
    }

    @ReactMethod
    public void stopSessionAndUploadData() {
        UXCam.stopSessionAndUploadData();
    }

    @ReactMethod
    public void occludeSensitiveScreen(boolean occlude) {
        UXCam.occludeSensitiveScreen(occlude, false);
    }

    @ReactMethod
    public void occludeSensitiveScreen(boolean occlude, boolean hideGesture) {
        UXCam.occludeSensitiveScreen(occlude, hideGesture);
    }

    @ReactMethod
    public void occludeAllTextFields(boolean occlude) {
        UXCam.occludeAllTextFields(occlude);
    }

    @ReactMethod
    public void tagScreenName(String screenName) {
        UXCam.tagScreenName(screenName);
    }

    @ReactMethod
    public void setAutomaticScreenNameTagging(boolean autoScreenTagging) {
        UXCam.setAutomaticScreenNameTagging(autoScreenTagging);
    }

    @ReactMethod
    public void addScreenNameToIgnore(String screenName) {
        UXCam.addScreenNameToIgnore(screenName);
    }

    @ReactMethod
    public void addScreenNamesToIgnore(ReadableArray screenNames) {
        ArrayList<Object> list = screenNames.toArrayList();
        for (Object screenName : list) {
            UXCam.addScreenNameToIgnore(screenName.toString());
        }
    }

    @ReactMethod
    public void removeScreenNameToIgnore(String screenName) {
        UXCam.removeScreenNameToIgnore(screenName);
    }

    @ReactMethod
    public void removeScreenNamesToIgnore(ReadableArray screenNames) {
        ArrayList<Object> list = screenNames.toArrayList();
        for (Object screenName : list) {
            UXCam.removeScreenNameToIgnore(screenName.toString());
        }
    }

    @ReactMethod
    public void removeAllScreenNamesToIgnore() {
        UXCam.removeAllScreenNamesToIgnore();
    }

    @ReactMethod
    public void screenNamesBeingIgnored(Promise promise) {
        List<String> list = UXCam.screenNamesBeingIgnored();
        WritableArray promiseArray = Arguments.createArray();
        for (String screen : list) {
            promiseArray.pushString(screen);
        }
        promise.resolve(promiseArray);
    }

    @ReactMethod
    public void setUserIdentity(String id) {
        UXCam.setUserIdentity(id);
    }

    @ReactMethod
    public void setUserProperty(String key, String value) {
        UXCam.setUserProperty(key, value);
    }

    @ReactMethod
    public void setSessionProperty(String key, String value) {
        UXCam.setSessionProperty(key, value);
    }

    @ReactMethod
    public void logEvent(String event) {
      UXCam.logEvent(event);
    }

    @ReactMethod
    public void logEvent(String event, ReadableMap properties) {
        if (properties != null) {
            
            HashMap<String, Object> map = new HashMap<String, Object>();

            ReadableMapKeySetIterator iterator = properties.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                ReadableType type = properties.getType(key);
                if (type == ReadableType.Boolean) {
                    map.put(key, properties.getBoolean(key));
                } else if (type == ReadableType.Number) {
                    map.put(key, properties.getDouble(key));
                } else {
                    map.put(key, properties.getString(key));
                }
            }
            UXCam.logEvent(event, map);
        } else {
            UXCam.logEvent(event);
        }

    }

    @ReactMethod
    public void addVerificationListener(final Promise promise) {
        UXCam.addVerificationListener(new OnVerificationListener() {
            @Override
            public void onVerificationSuccess() {
                promise.resolve("success");
            }

            @Override
            public void onVerificationFailed(String errorMessage) {
                Throwable error = new Throwable(errorMessage);
                promise.reject("failed", errorMessage, error);
            }
        });
    }

    @ReactMethod
    public void urlForCurrentSession(Promise promise) {
        promise.resolve(UXCam.urlForCurrentSession());
    }

    @ReactMethod
    public void urlForCurrentUser(Promise promise) {
        promise.resolve(UXCam.urlForCurrentUser());
    }

    @ReactMethod
    public void isRecording(Promise promise) {
        promise.resolve(UXCam.isRecording());
    }

    @ReactMethod
    public void pauseScreenRecording() {
        UXCam.pauseScreenRecording();
    }

    @ReactMethod
    public void resumeScreenRecording() {
        UXCam.resumeScreenRecording();
    }

    @ReactMethod
    public void optInOverall() {
        UXCam.optIn();
    }

    @ReactMethod
    public void optOutOverall() {
        UXCam.optOut();
    }

    @ReactMethod
    public void optInOverallStatus(Promise promise) {
        promise.resolve(UXCam.optStatus());
    }

    @ReactMethod
    public void optIntoVideoRecording(){
        UXCam.optIntoVideoRecording();
    }

    @ReactMethod
    public void optOutOfVideoRecording(){
        UXCam.optOutOfVideoRecording();
    }

    @ReactMethod
    public void optInVideoRecordingStatus(Promise promise){
        promise.resolve(UXCam.optInVideoRecordingStatus());
    }

    @ReactMethod
    public void cancelCurrentSession() {
        UXCam.cancelCurrentSession();
    }

    @ReactMethod
    public void allowShortBreakForAnotherApp(boolean startShortBreak) {
        UXCam.allowShortBreakForAnotherApp(startShortBreak);
    }

    @ReactMethod
    public void allowShortBreakForAnotherAppInMillis(int millis) {
        UXCam.allowShortBreakForAnotherApp(millis);
    }

    @ReactMethod
    public void getMultiSessionRecord(Promise promise) {
        promise.resolve(UXCam.getMultiSessionRecord());
    }

    @ReactMethod
    public void setMultiSessionRecord(boolean multiSessionRecord) {
        UXCam.setMultiSessionRecord(multiSessionRecord);
    }

    @ReactMethod
    public void deletePendingUploads() {
        UXCam.deletePendingUploads();
    }

    @ReactMethod
    public void pendingSessionCount(Promise promise) {
        promise.resolve(UXCam.pendingSessionCount());
    }

    @ReactMethod
    public void uploadPendingSession() {}

    @ReactMethod
    public void occludeSensitiveView(final int id) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                try {
                    View view = nativeViewHierarchyManager.resolveView(id);

                    if (view != null)
                        UXCam.occludeSensitiveView(view);
                } catch (Exception e) {

                }
            }
        });

    }

    @ReactMethod
    public void unOccludeSensitiveView(final int id) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                try {
                    View view = nativeViewHierarchyManager.resolveView(id);

                    if (view != null)
                        UXCam.unOccludeSensitiveView(view);
                } catch (Exception e) {

                }
            }
        });

    }

    @ReactMethod
    public void occludeSensitiveViewWithoutGesture(final int id) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                try {
                    View view = nativeViewHierarchyManager.resolveView(id);

                    if (view != null)
                        UXCam.occludeSensitiveViewWithoutGesture(view);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @ReactMethod
    public void setPushNotificationToken(String token) {
        UXCam.setPushNotificationToken(token);
    }

    @ReactMethod
    public void reportBugEvent(String event) {
        UXCam.reportBugEvent(event);
    }

    @ReactMethod
    public void reportBugEvent(String event, ReadableMap properties) {
        if (properties != null) {

            HashMap<String, Object> map = new HashMap<String, Object>();

            ReadableMapKeySetIterator iterator = properties.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                ReadableType type = properties.getType(key);
                if (type == ReadableType.Boolean) {
                    map.put(key, properties.getBoolean(key));
                } else if (type == ReadableType.Number) {
                    map.put(key, properties.getDouble(key));
                } else {
                    map.put(key, properties.getString(key));
                }
            }
            UXCam.reportBugEvent(event, map);
        } else {
            UXCam.reportBugEvent(event);
        }

    }

    @ReactMethod
    public void disableCrashHandling(boolean disable) {
        UXCam.disableCrashHandling(disable);
    }

}
