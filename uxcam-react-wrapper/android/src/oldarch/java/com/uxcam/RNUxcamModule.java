package com.uxcam;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;
import java.util.HashMap;

public class RNUxcamModule extends ReactContextBaseJavaModule {

    private final RNUxcamModuleImpl impl;

    RNUxcamModule(ReactApplicationContext context) {
        super(context);
        this.impl = new RNUxcamModuleImpl(context);
    }

    @ReactMethod
    public String getName() {
        return RNUxcamModuleImpl.MODULE_NAME;
    }

    @ReactMethod
    public void startWithConfiguration(ReadableMap configuration) {
        this.impl.startWithConfiguration(configuration);
    }

    @ReactMethod
    public void addListener(String eventName) {
        this.impl.addListener(eventName);
    }

    @ReactMethod
    public void removeListeners(double count) {
        this.impl.removeListeners(count);
    }

    @ReactMethod
    public void applyOcclusion(ReadableMap occlusionMap) {
        this.impl.applyOcclusion(occlusionMap);
    }

    @ReactMethod
    public void removeOcclusion(ReadableMap occlusionMap) {
        this.impl.removeOcclusion(occlusionMap);
    }

    @ReactMethod
    public void startNewSession() {
        this.impl.startNewSession();
    }

    @ReactMethod
    public void stopSessionAndUploadData() {
        this.impl.stopSessionAndUploadData();
    }

    @ReactMethod
    public void cancelCurrentSession() {
        this.impl.cancelCurrentSession();
    }

    @ReactMethod
    public void occludeAllTextFields(boolean occludeAll) {
        this.impl.occludeAllTextFields(occludeAll);
    }

    @ReactMethod
    public void occludeSensitiveScreen(boolean occlude, boolean hideGestures) {
        this.impl.occludeSensitiveScreen(occlude, hideGestures);
    }

    @ReactMethod
    public void occludeSensitiveView(final double id, boolean hideGestures) {
        this.impl.occludeSensitiveView(id, hideGestures);
    }

    @ReactMethod
    public void unOccludeSensitiveView(final double id) {
        this.impl.unOccludeSensitiveView(id);
    }

    @ReactMethod
    public void optInOverall() {
        this.impl.optInOverall();
    }

    @ReactMethod
    public void optOutOverall() {
        this.impl.optOutOverall();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean optInOverallStatus() {
        return  this.impl.optInOverallStatus();
    }

    @ReactMethod
    public void optIntoVideoRecording() {
        this.impl.optIntoVideoRecording();
    }

    @ReactMethod
    public void optOutOfVideoRecording() {
        this.impl.optOutOfVideoRecording();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean optInVideoRecordingStatus(){
       return   this.impl.optInVideoRecordingStatus();
    }

    @ReactMethod
    public void optIntoSchematicRecordings() {
        this.impl.optIntoSchematicRecordings();
    }

    @ReactMethod
    public void optOutOfSchematicRecordings() {
        this.impl.optOutOfSchematicRecordings();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean optInSchematicRecordingStatus() {
       return this.impl.optInSchematicRecordingStatus();
    }

    @ReactMethod
    public void urlForCurrentSession(Promise promise) {
        this.impl.urlForCurrentSession(promise);
    }

    @ReactMethod
    public void urlForCurrentUser(Promise promise) {
        this.impl.urlForCurrentUser(promise);
    }

    @ReactMethod
    public void uploadPendingSession() {
        this.impl.uploadPendingSession();
    }

    @ReactMethod
    public void deletePendingUploads() {
        this.impl.deletePendingUploads();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public double pendingSessionCount() {
        return  this.impl.pendingSessionCount();
    }

    @ReactMethod
    public void allowShortBreakForAnotherAppInMillis(double millis) {
        this.impl.allowShortBreakForAnotherAppInMillis(millis);
    }

    @ReactMethod
    public void allowShortBreakForAnotherApp(boolean continueSession) {
        this.impl.allowShortBreakForAnotherApp(continueSession);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isRecording() {
        return  this.impl.isRecording();
    }

    @ReactMethod
    public void pauseScreenRecording() {
        this.impl.pauseScreenRecording();
    }

    @ReactMethod
    public void resumeScreenRecording() {
        this.impl.resumeScreenRecording();
    }

    @ReactMethod
    public void tagScreenName(String screenName) {
        this.impl.tagScreenName(screenName);
    }

    @ReactMethod
    public void logEvent(String event, ReadableMap properties) {
        this.impl.logEvent(event, properties);
    }

    @ReactMethod
    public void setUserIdentity(String id) {
        this.impl.setUserIdentity(id);
    }

    @ReactMethod
    public void setUserProperty(String key, String value) {
        this.impl.setUserProperty(key, value);
    }

    @ReactMethod
    public void setSessionProperty(String key, String value) {
        this.impl.setSessionProperty(key, value);
    }
}