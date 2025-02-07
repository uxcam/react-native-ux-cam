package com.uxcam;

import android.app.Activity;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.NoSuchKeyException;
import com.facebook.react.bridge.Promise;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.facebook.react.bridge.Arguments;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.UnexpectedNativeTypeException;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.common.UIManagerType;
import com.uxcam.screenshot.model.UXCamBlur;
import com.uxcam.screenshot.model.UXCamOverlay;
import com.uxcam.screenshot.model.UXCamOcclusion;
import com.uxcam.screenshot.model.UXCamOccludeAllTextFields;
import com.uxcam.datamodel.UXConfig;

public class RNUxcamModuleImpl {

    public static final String MODULE_NAME = "RNUxcam";

    private static final String UXCAM_VERIFICATION_EVENT_KEY = "UXCam_Verification_Event";
    private static final String PARAM_SUCCESS_KEY = "success";
    private static final String PARAM_ERROR_MESSAGE_KEY = "error";

    public static final String USER_APP_KEY = "userAppKey";
    public static final String ENABLE_INTEGRATION_LOGGING = "enableIntegrationLogging";
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

    private static final String UXCAM_PLUGIN_TYPE = "react-native";
    private static final String UXCAM_REACT_PLUGIN_VERSION = "6.0.3";

    private final ReactApplicationContext reactContext;

    public RNUxcamModuleImpl(ReactApplicationContext reactApplicationContext) {
      this.reactContext = reactApplicationContext;
      UXCam.addVerificationListener(new OnVerificationListener() {
                @Override
                public void onVerificationSuccess() {
                    WritableMap params = Arguments.createMap();
                    params.putBoolean(PARAM_SUCCESS_KEY, true);
                    sendEvent(getReactApplicationContext(), params);
                }

                @Override
                public void onVerificationFailed(String errorMessage) {
                    WritableMap params = Arguments.createMap();
                    params.putBoolean(PARAM_SUCCESS_KEY, false);
                    params.putString(PARAM_ERROR_MESSAGE_KEY, errorMessage);
                    sendEvent(getReactApplicationContext(), params);
                }
            });
    }

    private ReactApplicationContext getReactApplicationContext() {
      return this.reactContext;
    }

    private Activity getCurrentActivity() {
      return this.reactContext.getCurrentActivity();
    }

    public void startWithConfiguration(ReadableMap configuration) {
        try {
            UXConfig config = getConfiguration(configuration);
            if (config != null) {

                UXCam.pluginType(UXCAM_PLUGIN_TYPE, UXCAM_REACT_PLUGIN_VERSION);
                UXCam.startWithConfigurationCrossPlatform(getCurrentActivity(), config);
            }
           
        } catch (Exception e) {
            Log.d("config", "Error starting with configuration");
            e.printStackTrace();
        }
    }

    public UXConfig getConfiguration(ReadableMap configuration) {
         HashMap<String, Object> configMap = configuration.toHashMap();
         String appKey = (String) configMap.get(USER_APP_KEY);
         if (appKey == null) {
            Log.d("config", "Empty app key value for starting UXCam");
            return null;
         }

         Boolean enableIntegrationLogging = (Boolean) configMap.get(ENABLE_INTEGRATION_LOGGING);
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
         if (enableIntegrationLogging != null)
             uxConfigBuilder.enableIntegrationLogging(enableIntegrationLogging);
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
         return config;
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

    private void sendEvent(ReactApplicationContext reactContext,
                           WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(RNUxcamModuleImpl.UXCAM_VERIFICATION_EVENT_KEY, params);
    }

    public void addListener(String eventName) {
       // Handled through initializer, only for interface confirmation
    }

    public void removeListeners(double count) {
        // Not needed on android, only for interface confirmation
    }

    public void applyOcclusion(ReadableMap occlusionMap) {
        UXCamOcclusion occlusion = getOcclusion(occlusionMap.toHashMap());
        UXCam.applyOcclusion(occlusion);
    }

    public void removeOcclusion(ReadableMap occlusionMap) {
        UXCamOcclusion occlusion = getOcclusion(occlusionMap.toHashMap());
        UXCam.removeOcclusion(occlusion);
    }

    public void startNewSession() {
        UXCam.startNewSession();
    }

    public void stopSessionAndUploadData() {
        UXCam.stopSessionAndUploadData();
    }

    public void cancelCurrentSession() {
        UXCam.cancelCurrentSession();
    }

     public void occludeAllTextFields(boolean occludeAll) {
        UXCam.occludeAllTextFields(occludeAll);
    }

    public void occludeSensitiveScreen(boolean occlude, boolean hideGestures) {
        UXCam.occludeSensitiveScreen(occlude, hideGestures);
    }

    public void occludeSensitiveView(final double tag, boolean hideGestures) {
        if (hideGestures) {
            occludeSensitiveViewWithoutGesture((int)tag);
        } else {
            occludeSensitiveViewWithGesture((int)tag);
        }
    }

    public void occludeSensitiveViewWithGesture(final int id) {
       findView(id, (new RNUxViewFinder() {
           @Override
           public void obtainView(View view) {
               UXCam.occludeSensitiveView(view);
           }
       }));
    }

    public void occludeSensitiveViewWithoutGesture(final int id) {
        findView(id, (new RNUxViewFinder() {
            @Override
            public void obtainView(View view) {
                UXCam.occludeSensitiveViewWithoutGesture(view);
            }
        }));
    }

    public void unOccludeSensitiveView(final double id) {
        findView((int) id, (new RNUxViewFinder() {
            @Override
            public void obtainView(View view) {
                UXCam.unOccludeSensitiveView(view);
            }
        }));
    }

    private void findView(final int tag, RNUxViewFinder viewFinder) {
        int type = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED ? UIManagerType.FABRIC : UIManagerType.DEFAULT;
        UIManager uiManager = UIManagerHelper.getUIManager(getReactApplicationContext(), type);
        assert uiManager != null;
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // Temporary fix for nullable view on new architecture due to lazy loading
            UiThreadUtil.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    View view = uiManager.resolveView(tag);
                    if (view != null) {
                        viewFinder.obtainView(view);
                    }
                }
            }, 100);
        } else {
            ((UIManagerModule)uiManager).addUIBlock(new UIBlock() {
                @Override
                public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                    View view = nativeViewHierarchyManager.resolveView(tag);
                    if (view != null) {
                        viewFinder.obtainView(view);
                    }
                }
            });
        }

    }

    public void optInOverall() {
        UXCam.optIn();
    }

    public void optOutOverall() {
        UXCam.optOut();
    }

    public boolean optInOverallStatus() {
        return UXCam.optStatus();
    }

    public void optIntoVideoRecording() {
        UXCam.optIntoVideoRecording();
    }

    public void optOutOfVideoRecording() {
        UXCam.optOutOfVideoRecording();
    }

    public boolean optInVideoRecordingStatus() {
       return UXCam.optInVideoRecordingStatus();
    }

    public void optIntoSchematicRecordings() {
        UXCam.optIntoVideoRecording();
    }

    public void optOutOfSchematicRecordings() {
        UXCam.optOutOfVideoRecording();
    }

    public boolean optInSchematicRecordingStatus() {
       return UXCam.optInVideoRecordingStatus();
    }

    public void urlForCurrentSession(Promise promise) {
        promise.resolve(UXCam.urlForCurrentSession());
    }

    public void urlForCurrentUser(Promise promise) {
        promise.resolve(UXCam.urlForCurrentUser());
    }

    public void uploadPendingSession() {
        // Method not available in android
    }

    public void deletePendingUploads() {
        UXCam.deletePendingUploads();
    }

    public double pendingSessionCount() {
        return UXCam.pendingSessionCount();
    }

    public void allowShortBreakForAnotherAppInMillis(double millis) {
        UXCam.allowShortBreakForAnotherApp((int)millis);
    }

    public void allowShortBreakForAnotherApp(boolean continueSession) {
        UXCam.allowShortBreakForAnotherApp(continueSession);
    }

    public boolean isRecording() {
        return UXCam.isRecording();
    }

    public void pauseScreenRecording() {
        UXCam.pauseScreenRecording();
    }

    public void resumeScreenRecording() {
        UXCam.resumeScreenRecording();
    }

    public void tagScreenName(String screenName) {
        UXCam.tagScreenName(screenName);
    }

    public void logEvent(String event, ReadableMap properties) {
        HashMap<String, Object> convertedProperties = new HashMap<>();

        if (properties != null) {
            ReadableMapKeySetIterator iterator = properties.keySetIterator();

            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                ReadableType type = properties.getType(key);
                try {
                    switch (type) {
                        case Null:
                            convertedProperties.put(key, "");
                            break;
                        case Boolean:
                            convertedProperties.put(key, properties.getBoolean(key));
                            break;
                        case Number:
                            convertedProperties.put(key, properties.getDouble(key));
                            break;
                        case String:
                            convertedProperties.put(key, properties.getString(key));
                            break;
                        case Map:
                            convertedProperties.put(key, properties.getMap(key).toString());
                            break;
                        case Array:
                            convertedProperties.put(key, properties.getArray(key).toString());
                            break;
                    }
                } catch (NullPointerException | NoSuchKeyException | UnexpectedNativeTypeException e) {
                    convertedProperties.put(key, "");
                    e.printStackTrace();
                }
            }
        }

        UXCam.logEvent(event, convertedProperties);
    }

     public void setUserIdentity(String id) {
        UXCam.setUserIdentity(id);
    }

    public void setUserProperty(String key, String value) {
        UXCam.setUserProperty(key, value);
    }

     public void setSessionProperty(String key, String value) {
        UXCam.setSessionProperty(key, value);
    }
}