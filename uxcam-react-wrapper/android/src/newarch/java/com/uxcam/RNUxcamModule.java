package com.uxcam;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import java.util.Map;
import java.util.HashMap;

public class RNUxcamModule extends NativeRNUxcamSpec {

    private final RNUxcamModuleImpl impl;

    RNUxcamModule(ReactApplicationContext context) {
        super(context);
        this.impl = new RNUxcamModuleImpl(context);
    }

    @Override
    @NonNull
    public String getName() {
        return RNUxcamModuleImpl.MODULE_NAME;
    }

    @Override
    public void startWithConfiguration(ReadableMap configuration) {
        this.impl.startWithConfiguration(configuration);
    }

    @Override
    public void addListener(String eventName) {
        this.impl.addListener(eventName);
    }

    @Override
    public void removeListeners(double count) {
        this.impl.removeListeners(count);
    }

    @Override
    public void applyOcclusion(ReadableMap occlusionMap) {
        this.impl.applyOcclusion(occlusionMap);
    }

    @Override
    public void removeOcclusion(ReadableMap occlusionMap) {
        this.impl.removeOcclusion(occlusionMap);
    }

    @Override
    public void startNewSession() {
        this.impl.startNewSession();
    }

    @Override
    public void stopSessionAndUploadData() {
        this.impl.stopSessionAndUploadData();
    }

    @Override
    public void cancelCurrentSession() {
        this.impl.cancelCurrentSession();
    }

    @Override
    public void occludeAllTextFields(boolean occludeAll) {
        this.impl.occludeAllTextFields(occludeAll);
    }

    @Override
    public void occludeSensitiveScreen(boolean occlude, boolean hideGestures) {
        this.impl.occludeSensitiveScreen(occlude, hideGestures);
    }

    @Override
    public void occludeSensitiveView(final double id, boolean hideGestures) {
        this.impl.occludeSensitiveView(id, hideGestures);
    }

    @Override
    public void unOccludeSensitiveView(final double id) {
        this.impl.unOccludeSensitiveView(id);
    }

    @Override
    public void optInOverall() {
        this.impl.optInOverall();
    }

    @Override
    public void optOutOverall() {
        this.impl.optOutOverall();
    }

    @Override
    public boolean optInOverallStatus() {
        return this.impl.optInOverallStatus();
    }

    @Override
    public void optIntoVideoRecording() {
        this.impl.optIntoVideoRecording();
    }

    @Override
    public void optOutOfVideoRecording() {
        this.impl.optOutOfVideoRecording();
    }

    @Override
    public boolean optInVideoRecordingStatus(){
       return this.impl.optInVideoRecordingStatus();
    }

    @Override
    public void optIntoSchematicRecordings() {
        this.impl.optIntoSchematicRecordings();
    }

    @Override
    public void optOutOfSchematicRecordings() {
        this.impl.optOutOfSchematicRecordings();
    }

    @Override
    public boolean optInSchematicRecordingStatus() {
       return this.impl.optInSchematicRecordingStatus();
    }

    @Override
    public void urlForCurrentSession(Promise promise) {
        this.impl.urlForCurrentSession(promise);
    }

    @Override
    public void urlForCurrentUser(Promise promise) {
        this.impl.urlForCurrentUser(promise);
    }

    @Override
    public void uploadPendingSession() {
        this.impl.uploadPendingSession();
    }

    @Override
    public void deletePendingUploads() {
        this.impl.deletePendingUploads();
    }

    @Override
    public double pendingSessionCount() {
        return this.impl.pendingSessionCount();
    }

    @Override
    public void allowShortBreakForAnotherAppInMillis(double millis) {
        this.impl.allowShortBreakForAnotherAppInMillis(millis);
    }

    @Override
    public void allowShortBreakForAnotherApp(boolean continueSession) {
        this.impl.allowShortBreakForAnotherApp(continueSession);
    }

    @Override
    public boolean isRecording() {
        return this.impl.isRecording();
    }

    @Override
    public void pauseScreenRecording() {
        this.impl.pauseScreenRecording();
    }

    @Override
    public void resumeScreenRecording() {
        this.impl.resumeScreenRecording();
    }

    @Override
    public void tagScreenName(String screenName) {
        this.impl.tagScreenName(screenName);
    }

    @Override
    public void logEvent(String event, ReadableMap properties) {
        this.impl.logEvent(event, properties);
    }

    @Override
    public void setUserIdentity(String id) {
        this.impl.setUserIdentity(id);
    }

    @Override
    public void setUserProperty(String key, String value) {
        this.impl.setUserProperty(key, value);
    }

    @Override
    public void setSessionProperty(String key, String value) {
        this.impl.setSessionProperty(key, value);
    }

    @Override
    public void configurationForUXCam(Promise promise) { 
        this.impl.configurationForUXCam(promise);
    }

    @Override
    public void updateConfiguration(ReadableMap configuration) {
        this.impl.updateConfiguration(configuration);
    }
}