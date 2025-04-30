import { Platform, NativeModules, findNodeHandle, NativeEventEmitter } from 'react-native'

const isTurboModuleEnabled = global.__turboModuleProxy != null;
const UXCamBridge = isTurboModuleEnabled ? require("./NativeRNUxcam").default : NativeModules.RNUxcam;

const RNUxcam_VerifyEvent_Name = 'UXCam_Verification_Event';

// Capture the platform we are running on
const platform = Platform.OS;
const platformIOS = platform === "ios" ? true : false;
const platformAndroid = platform === "android" ? true : false;

export default class UXCam {
    
    static startWithConfiguration(configuration) {
        UXCamBridge.startWithConfiguration(configuration);
    }

    static startWithKey(userAppKey) {
        const configuration = { "userAppKey": userAppKey };
        UXCam.startWithConfiguration(configuration);
    }

    static applyOcclusion(occlusion) {
        UXCamBridge.applyOcclusion(occlusion);
    }

    static removeOcclusion(occlusion) {
        UXCamBridge.removeOcclusion(occlusion);
    }

    static addVerificationListener(status) {
        const emitter = new NativeEventEmitter(UXCamBridge);
        return emitter.addListener(RNUxcam_VerifyEvent_Name, status)
    }

    /**
    *  This will opt this device into session recordings
    *  - any current session will be stopped and a new session will be started with the last settings passed to `startWithKey`
    */
    static optInOverall() {
        UXCamBridge.optInOverall();
    }

    /**
    *  This will cancel any current session recording and opt this device out of future session recordings until `optInOverall` is called
    *  @note The default is to opt-in to session recordings, but not to screen recordings, and the defaults will be reset if the user un-installs and re-installs the app
    */
    static optOutOverall() {
        UXCamBridge.optOutOverall();
    }

    /**
    *  This will opt this device back into session recordings
    */
    static optIntoSchematicRecordings() {
        if (platformIOS) {
            UXCamBridge.optIntoSchematicRecordings();
        }
    }

    /**
     *  This will opt this device out of schematic recordings for future sessions
     *  - any current session will be stopped and restarted with the last settings passed to `startWithKey`
     */
    static optOutOfSchematicRecordings() {
        if (platformIOS) {
            UXCamBridge.optOutOfSchematicRecordings();
        }
    }

    /**
     *  Returns the opt-in status of this device
     *  @return `true` if the device is opted in to session recordings, `false` otherwise. The default is `false`.
     */
    static optInOverallStatus() {
        return UXCamBridge.optInOverallStatus();
    }

    /** Returns the opt-in status of this device for schematic recordings
     *  @returns `true` if the device is opted in to schematic recordings, `false` otherwise. The default is `false`.
     *  @note Use in conjunction with optInOverallStatus to control the overall recording status for the device
     */
    static optInSchematicRecordingStatus() {
        if (platformIOS) {
            return UXCamBridge.optInSchematicRecordingStatus();
        } else {
            // Just return the general status for Android which doesn't currently split status between session data and video
            return UXCamBridge.optInOverallStatus();
        }
    }

    /**
    *  @brief Android only.
    *  This will opt this device into video recording for future sessions.
    */
    static optIntoVideoRecording() {
        if (platformAndroid) {
            UXCamBridge.optIntoVideoRecording();
        } else if (platformIOS) {
            UXCamBridge.optIntoSchematicRecordings();
        }
    }

    /**
    *  @brief Android only.
    *  This will opt this device out of video recording for future sessions.
    */
    static optOutOfVideoRecording() {
        if (platformAndroid) {
            UXCamBridge.optOutOfVideoRecording();
        } else if (platformIOS) {
            UXCamBridge.optOutOfSchematicRecordings();
        }
    }

    /**
     * @brief Android only.
     *  Returns the opt-in video status of this device
     *  @return `true` if the device is opted in for video recordings, `false` otherwise.
     */
    static optInVideoRecordingStatus() {
        if (platformAndroid) {
            return UXCamBridge.optInVideoRecordingStatus();
        } else if (platformIOS) {
            return UXCamBridge.optInSchematicRecordingStatus();
        }
        return false;
    }

    /**
    * Starts a new session after the {@link #stopSessionAndUploadData()} method has been called.
    * This happens automatically when the app returns from background.
    */
    static startNewSession() {
        UXCamBridge.startNewSession();
    }

    /**
     * Stop current uxcam session and send captured data to server.<br>
     * Use this to start sending the data on UXCam server without the app going into the background.<br>
     * This starts an asynchronous process and returns immediately.
     */
    static stopSessionAndUploadData() {
        UXCamBridge.stopSessionAndUploadData();
    }

    /**
     *  Cancels the recording of the current session and discards the data
     *
     * @note A new session will start as normal when the app nexts come out of the background (depending on the state of the MultiSessionRecord flag), or if you call `startNewSession`
    */
    static cancelCurrentSession() {
        UXCamBridge.cancelCurrentSession();
    }

    /**
     *  Returns a URL path that shows the current session when it compeletes
     *
     *  @note This can be used for tying in the current session with other analytics systems
     *
     *  @return url path for current session or nil if no verified session is active
     */
    static async urlForCurrentSession() {
        return UXCamBridge.urlForCurrentSession();
    }

    /**
     *  Returns a URL path for showing all the current users sessions
     *
     *  @note This can be used for tying in the current user with other analytics systems
     *
     *  @return url path for user session or nil if no verified session is active
     */
    static async urlForCurrentUser() {
        return UXCamBridge.urlForCurrentUser();
    }

    /**
     *  @brief IOS only. Uploads sessions that were pending to be uploaded
     *
     *  Sessions can be in the Pending state if UXCam was unable to upload them at the end of the last session. Normally they will be sent at the end of the next session.
     */
    static uploadPendingSession() {
        return UXCamBridge.uploadPendingSession();
    }

    /**
     *  @brief Returns how many sessions are waiting to be uploaded
     *
     *  Sessions can be in the Pending state if UXCam was unable to upload them at the end of the last session. Normally they will be sent at the end of the next session.
     */
    static pendingSessionCount() {
        return UXCamBridge.pendingSessionCount();
    }

    /**
     *  @brief Deletes any sessions that are awaiting upload
     *  @note Advanced use only. This is not needed for most developers. This can't be called until UXCam startWithKey: has completed
     */
    static deletePendingUploads() {
        UXCamBridge.deletePendingUploads();
    }

    /**
     *  By default UXCam will end a session immediately when your app goes into the background. But if you are switching over to another app for authorisation, or some other short action, and want the session to continue when the user comes back to your app then call this method with a value of `true` before switching away to the other app.
     *  UXCam will pause the current session as your app goes into the background and then continue the session when your app resumes. If your app doesn't resume within a couple of minutes the original session will be closed as normal and a new session will start when your app eventually is resumed.
     *  @param duration Set time to wait in `milliseconds` before finishing the session.
     */
    static allowShortBreakForAnotherApp(duration) {
        if (typeof duration == 'boolean') {
            UXCamBridge.allowShortBreakForAnotherApp(duration);
        } else if (typeof duration == 'number') {
            UXCamBridge.allowShortBreakForAnotherAppInMillis(duration);
        }
        
    }

    /**
     *  @brief Resume after short break. Only used in android, does nothing on iOS
     */
    static resumeShortBreakForAnotherApp() {
        UXCamBridge.resumeShortBreakForAnotherApp();
    }

    /**
    *  Returns the current recording status
    *
    *  @return `true` if the session is being recorded
    */
    static isRecording() {
        return UXCamBridge.isRecording();
    }

    /**
     * Pause the screen recording
     */
    static pauseScreenRecording() {
        UXCamBridge.pauseScreenRecording();
    }

    /**
     *  Resumes a paused session - will cancel any remaining pause time and resume screen recording
     */
    static resumeScreenRecording() {
        UXCamBridge.resumeScreenRecording();
    }

    /**
        UXCam normally captures the view controller name automatically but in cases where it this is not sufficient (such as in OpenGL applications)
        or where you would like to set a different unique name, use this function to set the name.
    
        @parameter screenName Name to apply to the current screen in the session video
    */
    static tagScreenName(screenName) {
        UXCamBridge.tagScreenName(screenName);
    }

    /**
        Insert a general event, with associated properties, into the timeline - stores the event with the timestamp when it was added.
     
        @parameter eventName Name of the event to attach to the session recording at the current time
        @parameter properties An Object of properties to associate with this event
     
        @note Only number and string property types are supported to a maximum count of 100 and maximum size per entry of 1KiB
     */
    static logEvent(eventName, properties) {
        UXCamBridge.logEvent(eventName, properties);
    }

     /**
     UXCam uses a unique number to tag a device.
     You can set a user identity for a device allowing you to more easily search for it on the dashboard and review their sessions further.
     
     @parameters userIdentity String to apply to this user (device) in this recording session
     */
     static setUserIdentity(userIdentity) {
        UXCamBridge.setUserIdentity(userIdentity);
    }

    /**
     Add a key/value property for this user
     
     @parameter propertyName Name of the property to attach to the user
     @parameter value A value to associate with this property
     
     @note Only number and string value types are supported to a maximum size per entry of 1KiB
     */
     static setUserProperty(propertyName, value) {
        if (typeof value == 'number') {
            UXCamBridge.setUserProperty(propertyName, value.toString());
        } else if (typeof value == 'string') {
            UXCamBridge.setUserProperty(propertyName, value);
        }
    }

    /**
     Add a single key/value property to this session
     
     @parameter propertyName Name of the property to attach to the session recording
     @parameter value A value to associate with this property
     
     @note Only number and string value types are supported to a maximum size per entry of 1KiB
     */
    static setSessionProperty(propertyName, value) {
        if (typeof value == 'number') {
            UXCamBridge.setSessionProperty(propertyName, value.toString());
        } else if (typeof value == 'string') {
            UXCamBridge.setSessionProperty(propertyName, value);
        }
    }

    static occludeAllTextFields(occludeAll) {
        UXCamBridge.occludeAllTextFields(occludeAll);
    }

    static occludeSensitiveScreen(hideScreen, hideGestures) {
        if (typeof hideGestures !== "undefined") {
            UXCamBridge.occludeSensitiveScreen(hideScreen, hideGestures);
        } else {
            UXCamBridge.occludeSensitiveScreen(hideScreen, true);
        }
    }

    static occludeSensitiveView(sensitiveView) {
        if (sensitiveView) {
            const tag = findNodeHandle(sensitiveView);
            if (tag) {
                // Add a small delay to allow the native view to be registered
                setTimeout(() => {
                    UXCamBridge.occludeSensitiveView(tag, false);
                }, 10); 
            }
        }
    }

    static occludeSensitiveViewWithoutGesture(sensitiveView) {
        if (sensitiveView) {
            const tag = findNodeHandle(sensitiveView);
            if (tag) {
                // Add a small delay to allow the native view to be registered
                setTimeout(() => {
                    UXCamBridge.occludeSensitiveView(tag, true);
                }, 10);
            }
        }
    }

    static unOccludeSensitiveView(view) {
        if (view) {
            UXCamBridge.unOccludeSensitiveView(findNodeHandle(view));
        }
    }

}