import { EmitterSubscription } from "react-native";
import { Configuration, Occlusion } from "./types";

export * from './types';

export default class UXCam {
    /**
     *  This will start the UXCam system, get the settings configurations from our server and start capturing the data according to the configuration.
     *
     *  @brief Start the UXCam session
     *  @parameter configuration   The configuration to identify your UXCam app - find appKey in the UXCam dashboard for your account 
     */
    static startWithConfiguration: (configuration: Configuration) => void;

    /**
     *  @deprecated Use {@link #startWithConfiguration(configuration)} instead to start new session
     * 
     *  @brief Start the UXCam session
     *  @parameter userAppKey   The key to identify your UXCam app - find it in the UXCam dashboard for your account 
     */
     static startWithKey: (userAppKey: string) => void;

    /**
     * Apply manual occlusion to screens in the app. 
     * This will be applied to all the screens until it is not removed manually again using {@link #removeOcclusion(occlusion)} method
     */
    static applyOcclusion: (occlusion: Occlusion) => void;

    /**
     * Remove manual occlusion from the app that was applied using {@link #applyOcclusion(occlusion)} method
     */
    static removeOcclusion: (occlusion: Occlusion) => void;
    /**
     * Starts a new session after the {@link #stopSessionAndUploadData()} method has been called.
     * This happens automatically when the app returns from background.
     */
    static startNewSession: () => void;

    /**
     * Stop current uxcam session and send captured data to server.<br>
     * Use this to start sending the data on UXCam server without the app going into the background.<br>
     * This starts an asynchronous process and returns immediately.
     */
    static stopSessionAndUploadData: () => void;

    /**
     *  Returns a URL path that shows the current session when it compeletes
     *
     *  @note This can be used for tying in the current session with other analytics systems
     *
     *  @return url path for current session or nil if no verified session is active
     */
    static urlForCurrentSession: () => Promise<string | undefined | null>;

    /**
     *  Returns a URL path for showing all the current users sessions
     *
     *  @note This can be used for tying in the current user with other analytics systems
     *
     *  @return url path for user session or nil if no verified session is active
     */
    static urlForCurrentUser: () => Promise<string | undefined | null>;

    /**
        Hide / un-hide the whole screen from the recording
     
        Call this when you want to hide the whole screen from being recorded - useful in situations where you don't have access to the exact view to occlude
        Once turned on with a `true` parameter it will continue to hide the screen until called with `false`
     
        @parameter hideScreen Set `true` to hide the screen from the recording, `false` to start recording the screen contents again
        @parameter hideGesture Set `true` to hide the gestures in the screen from the recording, `false` to start recording the gestures in the screen again
    */
    static occludeSensitiveScreen: (hideScreen: boolean, hideGestures?: boolean) => void;

    /**
        Hide / un-hide all UITextField views on the screen
     
        Call this when you want to hide the contents of all UITextFields from the screen capture. Default is `false`.
     
        @parameter occludeAll Set `true` to hide all UITextField views on the screen in the recording, `false` to stop occluding them from the screen recording.
     */
    static occludeAllTextFields: (occludeAll: boolean) => void;

    /**
     UXCam uses a unique number to tag a device.
     You can set a user identity for a device allowing you to more easily search for it on the dashboard and review their sessions further.
     
     @parameters userIdentity String to apply to this user (device) in this recording session
     */
    static setUserIdentity: (userIdentity: string) => void;

    /**
     Add a key/value property for this user
     
     @parameter propertyName Name of the property to attach to the user
     @parameter value A value to associate with this property
     
     @note Only number and string value types are supported to a maximum size per entry of 1KiB
     */
    static setUserProperty: (propertyName: string, value: string | number) => void;

    /**
     Add a single key/value property to this session
     
     @parameter propertyName Name of the property to attach to the session recording
     @parameter value A value to associate with this property
     
     @note Only number and string value types are supported to a maximum size per entry of 1KiB
     */
    static setSessionProperty: (propertyName: string, value: string | number) => void;

    /**
        Insert a general event, with associated properties, into the timeline - stores the event with the timestamp when it was added.
     
        @parameter eventName Name of the event to attach to the session recording at the current time
        @parameter properties An Object of properties to associate with this event
     
        @note Only number and string property types are supported to a maximum count of 100 and maximum size per entry of 1KiB
     */
    static logEvent: (eventName: string, properties: Object | null) => void

    /**
        UXCam verification listener that returns success/failure status. TRUE status means the session was successfully verified and started.
        @parameter status Function to call that will receive verification status boolean value.
     */
    static addVerificationListener: (status: (status: { success: boolean })=>void) => EmitterSubscription;

    /**
     *  Returns the current recording status
     *
     *  @return `true` if the session is being recorded
     */
    static isRecording: () => boolean;

    /**
     * Pause the screen recording
     */
    static pauseScreenRecording: () => void;

    /**
     *  Resumes a paused session - will cancel any remaining pause time and resume screen recording
     */
    static resumeScreenRecording: () => void;

    /**
     *  This will cancel any current session recording and opt this device out of future session recordings until `optInOverall` is called
     *  @note The default is to opt-in to session recordings, but not to screen recordings, and the defaults will be reset if the user un-installs and re-installs the app
     */
    static optOutOverall: () => void;

    /**
     *  This will opt this device out of schematic recordings for future sessions
     *  - any current session will be stopped and restarted with the last settings passed to `startWithKey`
     */
    static optOutOfSchematicRecordings: () => void;

    /**
     *  This will opt this device into session recordings
     *  - any current session will be stopped and a new session will be started with the last settings passed to `startWithKey`
     */
    static optInOverall: () => void;

    /**
     *  This will opt this device back into session recordings
     */
    static optIntoSchematicRecordings: () => void;

    /**
     *  Returns the opt-in status of this device
     *  @return `true` if the device is opted in to session recordings, `false` otherwise. The default is `false`.
     */
    static optInOverallStatus: () => boolean;

    /** Returns the opt-in status of this device for schematic recordings
     *  @returns `true` if the device is opted in to schematic recordings, `false` otherwise. The default is `false`.
     *  @note Use in conjunction with optInOverallStatus to control the overall recording status for the device
     */
    static optInSchematicRecordingStatus: () => boolean;

    /**
     *  @Deprecated use optOutOverall() instead
     *  This will cancel any current session recording and opt this device out of future session recordings until `optIn` is called
     *  @note The default is to opt-in to recordings, and the default will be reset if the user un-installs and re-installs the app
    */
    static optOut: () => void;

    /**
     *  @Deprecated use optInOverall() instead
     */
    static optIn: () => void;

    /**
     *  @Deprecated use optInOverallStatus() instead
    */
    static optStatus: () => boolean;

    /**
    *  @brief Android only.
    *  This will opt this device into video recording for future sessions.
    */
    static optIntoVideoRecording: () => void;

    /**
    *  @brief Android only.
    *  This will opt this device out of video recording for future sessions.
    */
    static optOutOfVideoRecording: () => void;

    /**
     * @brief Android only.
     *  Returns the opt-in video status of this device
     *  @return `true` if the device is opted in for video recordings, `false` otherwise.
     */
    static optInVideoRecordingStatus: () => boolean;

    /**
     *  Cancels the recording of the current session and discards the data
     *
     * @note A new session will start as normal when the app nexts come out of the background (depending on the state of the MultiSessionRecord flag), or if you call `startNewSession`
    */
    static cancelCurrentSession: () => void;

    /**
     *  By default UXCam will end a session immediately when your app goes into the background. But if you are switching over to another app for authorisation, or some other short action, and want the session to continue when the user comes back to your app then call this method with a value of `true` before switching away to the other app.
     *  UXCam will pause the current session as your app goes into the background and then continue the session when your app resumes. If your app doesn't resume within a couple of minutes the original session will be closed as normal and a new session will start when your app eventually is resumed.
     *
     *  @brief Prevent a short trip to another app causing a break in a session
     *  @param continueSession Set to `true` to continue the current session after a short trip out to another app. Default is `false` - stop the session as soon as the app enters the background.
     *  @param continueSession For android, you can also add time to wait in `milliseconds` before finishing the session.
     */
    static allowShortBreakForAnotherApp: (continueSession: boolean | number) => void;

    /**
     *  @brief Resume after short break. Only used in android, does nothing on iOS
     */
    static resumeShortBreakForAnotherApp: () => void;

    /**
     *  @brief Deletes any sessions that are awaiting upload
     *  @note Advanced use only. This is not needed for most developers. This can't be called until UXCam startWithKey: has completed
     */
    static deletePendingUploads: () => void;

    /**
     *  @brief Returns how many sessions are waiting to be uploaded
     *
     *  Sessions can be in the Pending state if UXCam was unable to upload them at the end of the last session. Normally they will be sent at the end of the next session.
     */
    static pendingSessionCount: () => number;

    /**
    *  @brief IOS only. Uploads sessions that were pending to be uploaded
    *
    *  Sessions can be in the Pending state if UXCam was unable to upload them at the end of the last session. Normally they will be sent at the end of the next session.
    */
    static uploadPendingSession: () => void;

    /**
     * Hide a view that contains sensitive information or that you do not want recording on the screen video.
     *
     * @parameter sensitiveView The view to occlude in the screen recording
     */
    static occludeSensitiveView: (sensitiveView: any) => void;

    /**
     * Stop hiding a view that was previously hidden
     * If the view passed in was not previously occluded then no action is taken and this method will just return
     *
     * @parameter view The view to show again in the screen recording
     */
    static unOccludeSensitiveView: (view: any) => void;

    /**
     * Hide a view that contains sensitive information or that you do not want recording on the screen video.
     *
     * @parameter sensitiveView The view to occlude in the screen recording
     */
    static occludeSensitiveViewWithoutGesture: (sensitiveView: any) => void;

    /**
        UXCam normally captures the view controller name automatically but in cases where it this is not sufficient (such as in OpenGL applications)
        or where you would like to set a different unique name, use this function to set the name.
    
        @note Call this in `[UIViewController viewDidAppear:]` after the call to `[super ...]` or automatic screen name tagging will override your value
    
        @parameter screenName Name to apply to the current screen in the session video
    */
    static tagScreenName: (screenName: string) => void;
}