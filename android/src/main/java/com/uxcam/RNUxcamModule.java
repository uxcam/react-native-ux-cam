package com.uxcam;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import java.util.HashMap;
import android.view.View;
import android.util.Log;
import com.uxcam.UXCam;

public class RNUxcamModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNUxcamModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNUxcam";
  }

  @ReactMethod
  public void startWithKey(String key) {
    UXCam.pluginType("react-native", "5.1.3");
    UXCam.startApplicationWithKeyForCordova(getCurrentActivity(), key);
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
    UXCam.occludeSensitiveScreen(occlude,false);
  }
  
  @ReactMethod
  public void occludeSensitiveScreen(boolean occlude,boolean hideGesture) {
    UXCam.occludeSensitiveScreen(occlude,hideGesture);
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

  // @ReactMethod
  // public void logEvent(String event) {
  //   UXCam.logEvent(event);
  // }

  @ReactMethod
  public void logEvent(String event, ReadableMap properties) {
    if(properties != null ){
      HashMap<String, String> map = new HashMap<String, String>();

      ReadableMapKeySetIterator iterator = properties.keySetIterator();
      while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        String value = properties.getString(key);
        map.put(key, value);
      }
      UXCam.logEvent(event, map);
    }else{
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
  public void optIn() {
    UXCam.optIn();
  }

  @ReactMethod
  public void optOut() {
    UXCam.optOut();
  }

  @ReactMethod
  public void optStatus(Promise promise) {
    promise.resolve(UXCam.optStatus());
  }

  @ReactMethod
  public void cancelCurrentSession() {
   UXCam.cancelCurrentSession();
  }

  @ReactMethod
  public void allowShortBreakForAnotherApp() {
    UXCam.allowShortBreakForAnotherApp();
  }

  @ReactMethod
  public void allowShortBreakForAnotherApp(int millis) {
    UXCam.allowShortBreakForAnotherApp(millis);
  }

  @ReactMethod
  public void resumeShortBreakForAnotherApp() {
    UXCam.resumeShortBreakForAnotherApp();
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
  public void occludeSensitiveView(final int id){
    UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock()
        {
          @Override
          public void execute(NativeViewHierarchyManager nativeViewHierarchyManager)
          {
                    try
                    {
                        View view = nativeViewHierarchyManager.resolveView(id);
                        
                        if (view != null)
                        UXCam.occludeSensitiveView(view);
                    }
                    catch(Exception e)
                    {
                        
                    }
          }
        });
    
  }
  @ReactMethod
  public void unOccludeSensitiveView(final int id){
    UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock()
        {
          @Override
          public void execute(NativeViewHierarchyManager nativeViewHierarchyManager)
          {
                    try
                    {
                        View view = nativeViewHierarchyManager.resolveView(id);
                        
                        if (view != null)
                        UXCam.unOccludeSensitiveView(view);
                    }
                    catch(Exception e)
                    {
                        
                    }
          }
        });
    
  }
  @ReactMethod
  public void occludeSensitiveViewWithoutGesture(final int id){
    UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock()
        {
          @Override
          public void execute(NativeViewHierarchyManager nativeViewHierarchyManager)
          {
                    try
                    {
                        View view = nativeViewHierarchyManager.resolveView(id);
                        
                        if (view != null)
                        UXCam.occludeSensitiveViewWithoutGesture(view);
                    }
                    catch(Exception e)
                    {
                        e.printStackTrace();
                    }
          }
        });
    
  }
}