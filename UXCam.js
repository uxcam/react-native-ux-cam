'use strict';
var { Platform, NativeModules, findNodeHandle, InteractionManager } = require('react-native');
var UXCamBridge = NativeModules.RNUxcam;

// Capture the platform we are running on
const platform = Platform.OS;
const platformIOS = platform === "ios" ? true : false;
const platformAndroid = platform === "android" ? true : false;

class UXCam {
    /**
     *  Call this method from applicationDidFinishLaunching to start UXCam recording your application's session.
     *  This will start the UXCam system, get the settings configurations from our server and start capturing the data according to the configuration.
     *
     *  @brief Start the UXCam session
     *  @parameter userAPIKey   The key to identify your UXCam account - find it in the UXCam dashboard for your account at https://dashboard.uxcam.com/user/settings
     */
    static startWithKey(apiKey) {
		UXCamBridge.startWithKey(apiKey);
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
     *  Returns a URL path that shows the current session when it compeletes
     *
     *  @note This can be used for tying in the current session with other analytics systems
     *
     *  @return url path for current session or nil if no verified session is active
     */
    static urlForCurrentSession() {
		return UXCamBridge.urlForCurrentSession();
    }

    /**
     *  Returns a URL path for showing all the current users sessions
     *
     *  @note This can be used for tying in the current user with other analytics systems
     *
     *  @return url path for user session or nil if no verified session is active
     */
    static urlForCurrentUser() {
        return UXCamBridge.urlForCurrentUser();
    }

    /**
        Hide / un-hide the whole screen from the recording
     
        Call this when you want to hide the whole screen from being recorded - useful in situations where you don't have access to the exact view to occlude
        Once turned on with a TRUE parameter it will continue to hide the screen until called with FALSE
     
        @parameter hideScreen Set TRUE to hide the screen from the recording, FALSE to start recording the screen contents again
        @parameter hideGesture Set TRUE to hide the gestures in the screen from the recording, FALSE to start recording the gestures in the screen again
    */
    static occludeSensitiveScreen(hideScreen, hideGesture) {
        if(typeof hideGesture !== "undefined"){
            UXCamBridge.occludeSensitiveScreen(hideScreen, hideGesture);
        }else{
            UXCamBridge.occludeSensitiveScreen(hideScreen, true);
        }
    }

    /**
        Hide / un-hide all UITextField views on the screen
     
        Call this when you want to hide the contents of all UITextFields from the screen capture. Default is NO.
     
        @parameter occludeAll Set YES to hide all UITextField views on the screen in the recording, NO to stop occluding them from the screen recording.
     */
    static occludeAllTextView() {
        UXCamBridge.occludeAllTextFields(true);
    }

    /**
        Hide / un-hide all UITextField views on the screen
     
        Call this when you want to hide the contents of all UITextFields from the screen capture. Default is NO.
     
        @parameter occludeAll Set YES to hide all UITextField views on the screen in the recording, NO to stop occluding them from the screen recording.
     */
    static occludeAllTextFields(occludeAll) {
        UXCamBridge.occludeAllTextFields(occludeAll);
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
     
     @note Only NSNumber and NSString value types are supported to a maximum size per entry of 1KiB
     */
    static setUserProperty(propertyName, value) {
        UXCamBridge.setUserProperty(propertyName, value);
    }

    /**
     Add a single key/value property to this session
     
     @parameter propertyName Name of the property to attach to the session recording
     @parameter value A value to associate with this property
     
     @note Only number and string value types are supported to a maximum size per entry of 1KiB
     */
    static setSessionProperty(propertyName, value) {
        UXCamBridge.setSessionProperty(propertyName, value);
    }

    /**
        Insert a general event, with associated properties, into the timeline - stores the event with the timestamp when it was added.
     
        @parameter eventName Name of the event to attach to the session recording at the current time
        @parameter properties An NSDictionary of properties to associate with this event
     
        @note Only number and string property types are supported to a maximum count of 100 and maximum size per entry of 1KiB
     */
    static logEvent(eventName, properties) {
        if(typeof properties !== "undefined" || properties !== null){
            UXCamBridge.logEvent(eventName, properties);
        }else{
            UXCamBridge.logEvent(eventName);
        }
    }

	/**
		Returns a promise that will be resolved with the result of the next session verification call
		resolves with "success" if verification completes OK, or rejects with an error if the verification fails
	*/
    static addVerificationListener() {
        return UXCamBridge.addVerificationListener();
    }

    /**
     *  Returns the current recording status
     *
     *  @return YES if the session is being recorded
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
     *  This will cancel any current session recording and opt this device out of future session recordings until `optInOverall` is called
     *  @note The default is to opt-in to session recordings, but not to screen recordings, and the defaults will be reset if the user un-installs and re-installs the app
     */
    static optOutOverall(){
        if (platformIOS) {
            UXCamBridge.optOutOverall();
        }
    }

    /**
     *  This will opt this device out of schematic recordings for future settings
     *  - any current session will be stopped and restarted with the last settings passed to `startWithKey`
     */
    static optOutOfSchematicRecordings(){
        if (platformIOS) {
            UXCamBridge.optOutOfSchematicRecordings();
        }
    }

    /**
     *  This will opt this device into session recordings
     *  - any current session will be stopped and a new session will be started with the last settings passed to `startWithKey`
     */
    static optInOverall(){
        if (platformIOS) {
            UXCamBridge.optInOverall();
        }
    }

    /**
     *  This will opt this device back into session recordings
     */
    static optIntoSchematicRecordings(){
        if (platformIOS) {
            UXCamBridge.optIntoSchematicRecordings();
        }
    }

    /**
     *  Returns the opt-in status of this device
     *  @return YES if the device is opted in to session recordings, NO otherwise. The default is YES.
     */
    static optInOverallStatus(){
        if (platformIOS) {
            return UXCamBridge.optInOverallStatus();
        }
        return false;
    }

    /** Returns the opt-in status of this device for schematic recordings
     *  @returns YES if the device is opted in to schematic recordings, NO otherwise. The default is NO.
     *  @note Use in conjunction with optInOverallStatus to control the overall recording status for the device
     */
    static optInSchematicRecordingStatus(){
        if (platformIOS) {
            return UXCamBridge.optInSchematicRecordingStatus();
        }
        return false;
    }

    /**
     *  This will cancel any current session recording and opt this device out of future session recordings until `optIn` is called
     *  @note The default is to opt-in to recordings, and the default will be reset if the user un-installs and re-installs the app
    */
    static optOut() {
        UXCamBridge.optOut();
    }

    /**
     *  This will opt this device back into session recordings - you will need to call `startWithKey:` after opting the device back in
     */
    static optIn() {
        UXCamBridge.optIn();
    }

    /**
     *  Returns the opt-in status of this device
     *  @return YES if the device is opted in to session recordings, NO otherwise
    */
    static optStatus() {
        return UXCamBridge.optInStatus()
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
     *  By default UXCam will end a session immediately when your app goes into the background. But if you are switching over to another app for authorisation, or some other short action, and want the session to continue when the user comes back to your app then call this method with a value of TRUE before switching away to the other app.
     *  UXCam will pause the current session as your app goes into the background and then continue the session when your app resumes. If your app doesn't resume within a couple of minutes the original session will be closed as normal and a new session will start when your app eventually is resumed.
     *
     *  @brief Prevent a short trip to another app causing a break in a session
     *  @param continueSession Set to TRUE to continue the current session after a short trip out to another app. Default is FALSE - stop the session as soon as the app enters the background.
     */
    static allowShortBreakForAnotherApp(continueSession) {
        UXCamBridge.allowShortBreakForAnotherApp(continueSession);
    }

    /**
     *  @brief Resume after short break. Only used in android, does nothing on iOS
     */
    static resumeShortBreakForAnotherApp() {
        UXCamBridge.resumeShortBreakForAnotherApp();
    }

    /**
     *  Get whether UXCam is set to automatically record a new session when the app resumes from the background
    */
    static getMultiSessionRecord() {
        return UXCamBridge.getMultiSessionRecord();
    }

    /**
     *  Set whether to record multiple sessions or not
     *
     *  @parameter multiSessionRecord YES to record a new session automatically when the device comes out of the background. If NO then a single session is recorded, when stopped (either programmatically with `stopApplicationAndUploadData` or by the app going to the background) then no more sessions are recorded until `startWithKey` is called again).
     *  @note The default setting is to record a new session each time a device comes out of the background. This flag can be set to NO to stop that. You can also set this with the appropriate startWithKey: variant. (This will be reset each time startWithKey is called)
    */
    static setMultiSessionRecord(multiSessionRecord) {
        UXCamBridge.setMultiSessionRecord(multiSessionRecord);
    }

    /**
     *  @brief Deletes any sessions that are awaiting upload
     *  @note Advanced use only. This is not needed for most developers. This can't be called until UXCam startWithKey: has completed
     */
    static deletePendingUploads() {
        UXCamBridge.deletePendingUploads();
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
     * Hide a view that contains sensitive information or that you do not want recording on the screen video.
     *
     * @parameter sensitiveView The view to occlude in the screen recording
     */
    static occludeSensitiveView(sensitiveView){
        UXCamBridge.occludeSensitiveView(findNodeHandle(sensitiveView));
    }

    /**
     * Stop hiding a view that was previously hidden
     * If the view passed in was not previously occluded then no action is taken and this method will just return
     *
     * @parameter view The view to show again in the screen recording
     */
    static unOccludeSensitiveView(view){
        UXCamBridge.unOccludeSensitiveView(findNodeHandle(view));
    }

    /**
     * Hide a view that contains sensitive information or that you do not want recording on the screen video.
     *
     * @parameter sensitiveView The view to occlude in the screen recording
     */
    static occludeSensitiveViewWithoutGesture(sensitiveView){
        UXCamBridge.occludeSensitiveViewWithoutGesture(findNodeHandle(sensitiveView));
    }

    /**
        UXCam normally captures the view controller name automatically but in cases where it this is not sufficient (such as in OpenGL applications)
        or where you would like to set a different unique name, use this function to set the name.
    
        @note Call this in `[UIViewController viewDidAppear:]` after the call to `[super ...]` or automatic screen name tagging will override your value
    
        @parameter screenName Name to apply to the current screen in the session video
    */
    static tagScreenName(screenName) {
        UXCamBridge.tagScreenName(screenName);
    }

    /**
        Enable / disable the automatic tagging of screen names
        
        @note By default UXCam will tag new screen names automatically. You can override this using the `tagScreenName` method or use this method to disable the automatic tagging.
    
        @parameters autoScreenTagging Set to TRUE to enable automatic screen name tagging (the default) or FALSE to disable it
    */
    static setAutomaticScreenNameTagging(autoScreenTagging) {
        UXCamBridge.setAutomaticScreenNameTagging(autoScreenTagging);
    }

    /**
        Add a name to the list of screens names that wont be added to the timeline in automatic screen name tagging mode
    
        This will not impact gesture or action recording - just that the timeline on the dashboard will not contain an entry for this screen name if it appears after this call.
        Use this if you have view controllers that are presented but which are not primary user interaction screens to make your dashboard timeline easier to understand.
    
        @param screenName A name to add to the list of screens to ignore
    
        @note This is a convenience method for `addScreenNamesToIgnore([nameToIgnore])`
    */
    static addScreenNameToIgnore(screenName){
        UXCamBridge.addScreenNameToIgnore(screenName);
    }
    
    /**
        Add a list of names to the list of screens names that wont be added to the timeline in automatic screen name tagging mode
    
        This will not impact gesture or action recording - just that the timeline on the dashboard will not contain an entry for any of the screens in this list encountered after this call.
        Use this if you have view controllers that are presented but which are not primary user interaction screens to make your dashboard timeline easier to understand.
    
        @param screenNames A list of screen names to add to the ignore list
    */
    static addScreenNamesToIgnore(screenNames){
        UXCamBridge.addScreenNamesToIgnore(screenNames);
    }

    /**
        Remove the a name from the list of screens to be ignored in automatic screen name tagging mode

        @param screenName The name to remove from the list of ignored screens
        @note This is a convenience method for `removeScreenNamesToIgnore([nameToRemove])`
    */
    static removeScreenNameToIgnore(screenName){
        UXCamBridge.removeScreenNameToIgnore(screenName);
    }
    
    /**
        Remove the a list of names from the list of screens to be ignored in automatic screen name tagging mode
    
        @param screenNames A list of names to remove from the ignore list
    */
    static removeScreenNamesToIgnore(screenNames){
        UXCamBridge.removeScreenNamesToIgnore(screenNames);
    }
    
    // Remove all entries from the list of screen names to be ignored in automatic screen name tagging mode
    static removeAllScreenNamesToIgnore(){
        UXCamBridge.removeAllScreenNamesToIgnore();
    }

    // Get the list of screen names that are being ignored in automatic screen name tagging mode
    static screenNamesBeingIgnored(){
        return UXCamBridge.screenNamesBeingIgnored();
    }
}

module.exports = UXCam;